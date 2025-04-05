import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, signOut, useSession, updateUser, getSession } =
  createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
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
