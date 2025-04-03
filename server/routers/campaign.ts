import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

const paymentMethodSchema = z.object({
  methodType: z.enum(["bank", "crypto", "mobilepayment", "link"]),
  country: z.string().default("MM"),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  cryptoAddress: z.string().optional(),
  mobileNumber: z.string().optional(),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
  routingNumber: z.string().optional(),
  mobileProvider: z.string().optional(),
  link: z.string().optional(),
})

const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  photos: z
    .array(z.string())
    .min(1)
    .transform((photos) => JSON.stringify(photos)),
  facebookLink: z.string().url().optional(),
  viberLink: z.string().optional(),
  payments: z
    .array(paymentMethodSchema)
    .min(1, "At least one payment method is required"),
})

export const campaignRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.campaign.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }),
  create: protectedProcedure
    .input(campaignSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.campaign.create({
        data: {
          ...input,
          status: "pending",
          userId: ctx.session.user.id,
          payments: {
            create: input.payments,
          },
        },
      })
    }),
  listActive: publicProcedure.query(async ({ ctx }) => {
    const campaigns = await ctx.db.campaign.findMany({
      where: {
        status: "active",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        payments: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        donations: {
          select: {
            id: true,
          },
        },
      },
    })

    return campaigns.map((campaign) => ({
      ...campaign,
      photos: parsePhotos(campaign.photos),
    }))
  }),
  getActiveById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.campaign.findUnique({
        where: {
          id: input,
          status: "active",
        },
        include: {
          payments: true,
          user: {
            select: {
              name: true,
              image: true,
              facebookLink: true,
              phone: true,
              viberPhoneNumber: true,
              whatsappPhoneNumber: true,
            },
          },
        },
      })
    }),
})

function parsePhotos(photos: string): string[] {
  try {
    return JSON.parse(photos)
  } catch {
    return []
  }
}
