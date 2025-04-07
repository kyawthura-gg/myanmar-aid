import { betterAuth } from "better-auth"
import { headers } from "next/headers"
import { authDB } from "./auth-db"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: {
    db: authDB,
    type: "sqlite",
  },
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

export const getAuthSession = async () => {
  return auth.api.getSession({ headers: await headers() })
}
