import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, signOut, useSession, updateUser, getSession } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
      inferAdditionalFields({
        user: {
          accountType: {
            type: "string",
            nullable: true,
            required: false,
          },
          onboardingCompleted: {
            type: "string",
            required: false,
          },
          isAdmin: {
            type: "boolean",
            required: false,
          },
        },
      }),
    ],
  })
