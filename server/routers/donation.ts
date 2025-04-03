import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc"


export const donationRouter = createTRPCRouter({
  updateDonationStatus: protectedProcedure.input(
    z.object({
      status: z.enum(["pending", "verified", "rejected"]),
      adminNote: z.string().nullish(),
      id: z.string().min(1)
    })
  ).mutation(async ({ ctx, input}) => {
    return ctx.db.donation.update({
      where: {
        id: input.id
      },
      data: {
        status: input.status,
        adminNote: input.adminNote,
        verifiedAt: new Date()
      }
    })
  }),
  donationForAdmin: protectedProcedure.input(z.object({
    status: z.enum(["pending", "active"]),
  })).query(async ({ ctx, input }) => {
    return ctx.db.donation.findMany({
      where: {
        status: input.status,
      },
      include: {
        campaign: {
            include: {
                user: true,
                payments: true,
            }
        },
      },
      orderBy: {
        donatedAt: "desc",
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
