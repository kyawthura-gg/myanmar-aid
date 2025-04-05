import {
  campaignServerSchema,
  type contactTypeList,
} from "@/app/[locale]/account/campaigns/campaign-schema"
import { nanoid } from "nanoid"
import { z } from "zod"
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

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
        status: z.enum(["pending", "active", "rejected", "all"]),
      })
    )
    .query(async ({ ctx, input }) => {
      let where = {}
      if(input.status != "all") {
        where = {
          ...where,
          status: input.status
        }
      }
      return ctx.db.campaign.findMany({
        where,
        include: {
          user: true,
          region: true,
          township: true,
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
        ...campaignServerSchema.shape,
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
          id: id ?? nanoid(),
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
      photos: parseStringToArray(campaign.photos),
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
      photos: parseStringToArray(data?.photos),
      categories: parseStringToArray(data?.categories),
      contactMethods: parseStringToArray<{
        type: ContactTypeListType
        value: string
      }>(data?.contactMethods),
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
              // facebookLink: true,
              phone: true,
              // viberPhoneNumber: true,
              // whatsappPhoneNumber: true,
            },
          },
          region: true,
          township: true,
          donations: true,
        },
      })

      return {
        ...data,
        photos: parseStringToArray(data?.photos),
        categories: parseStringToArray(data?.categories),
        contactMethods: parseStringToArray<{
          type: ContactTypeListType
          value: string
        }>(data?.contactMethods),
      }
    }),
})

type ContactTypeListType = (typeof contactTypeList)[number]

function parseStringToArray<T = string>(jsonString?: string): T[] {
  if (!jsonString) {
    return []
  }
  try {
    return JSON.parse(jsonString)
  } catch {
    return []
  }
}
