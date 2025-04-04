import { getCloudflareContext } from "@opennextjs/cloudflare"
import { PrismaD1 } from "@prisma/adapter-d1"
import { PrismaClient } from "@prisma/client"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { headers } from "next/headers"

const getDB = (db: D1Database) => {
  const adapter = new PrismaD1(db)
  return new PrismaClient({ adapter })
}

export const getAuth = (db: D1Database) => {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(getDB(db), {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },

    user: {
      additionalFields: {
        accountType: {
          type: "string",
          nullable: true,
          required: false,
        },
        onboardingCompleted: {
          type: "boolean",
          required: false,
        },
        status: {
          type: "string",
          enum: ["pending", "active", "rejected"],
          default: "pending",
          required: false,
        },
        isAdmin: {
          type: "boolean",
          required: false,
        },
      },
    },
  })
}

export const getAuthSession = async () => {
  const ctx = await getCloudflareContext({ async: true })
  const auth = getAuth((ctx.env as Cloudflare.Env).DB)
  return auth.api.getSession({ headers: await headers() })
}
