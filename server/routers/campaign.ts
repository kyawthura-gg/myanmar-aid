import { z } from "zod"
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

const paymentMethodSchema = z.object({
  methodType: z.enum(["bank", "crypto", "mobilepayment", "link"]),
  country: z.string(),
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
  regionCode: z.string().min(2, "Invalid region"),
  townshipCode: z.string().min(2, "Invalid township"),
  photos: z
    .array(z.string())
    .min(1)
    .transform((photos) => JSON.stringify(photos)),
  payments: z
    .array(paymentMethodSchema)
    .min(1, "At least one payment method is required"),
})

export const campaignRouter = createTRPCRouter({
  updateStatus: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "active", "rejected"]),
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.campaign.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      })
    }),
  listForAdmin: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "active"]),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.campaign.findMany({
        where: {
          status: input.status,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }),
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
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        ...campaignSchema.shape,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: ctx.session.user.id,
        },
      })
      if (!currentUser?.accountType) {
        throw new Error("Account type not found")
      }

      const { id, payments, ...rest } = input

      return ctx.db.campaign.upsert({
        where: {
          id: id ?? "create-new-id",
        },
        create: {
          ...rest,
          accountType: currentUser?.accountType,
          status: currentUser.status ?? "pending",
          userId: ctx.session.user.id,
          payments: {
            create: payments,
          },
        },
        update: {
          ...rest,
          payments: {
            deleteMany: {},
            create: payments,
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
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await ctx.db.campaign.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        payments: true,
        region: true,
        township: true,
      },
    })
    return {
      ...data,
      photos: parsePhotos(data?.photos),
    }
  }),
  getActiveById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.campaign.findUniqueOrThrow({
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

      return {
        ...data,
        photos: parsePhotos(data?.photos),
      }
    }),
})

function parsePhotos(photos?: string): string[] {
  if (!photos) {
    return []
  }
  try {
    return JSON.parse(photos)
  } catch {
    return []
  }
}
