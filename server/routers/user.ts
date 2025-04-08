import { z } from "zod"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  userListForAdmin: adminProcedure.query(async ({ ctx, input }) => {
    return ctx.db.user.findMany({
      where: {
        isAdmin: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }),
  updateUserStatus: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "active", "rejected"]),
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      })
    }),
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        accountType: z.enum(["individual", "org"]),
        socialLink: z.string().url(),
        image: z.string().nullish(),
        phoneNumber: z.string().nullish(),
        termsAccepted: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.termsAccepted) {
        throw new Error("You must accept the terms and conditions")
      }
      return ctx.db.user.update({
        where: { id: ctx.session.user.id, onboardingCompleted: false },
        data: {
          name: input.name,
          accountType: input.accountType,
          socialLink: input.socialLink,
          phone: input.phoneNumber,
          image: input.image,
          status: "pending",
          onboardingCompleted: true,
        },
      })
    }),
})
