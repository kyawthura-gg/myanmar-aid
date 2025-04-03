import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, signOut, useSession, updateUser } =
  createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [
      inferAdditionalFields({
        user: {
          accountType: {
            type: "string",
            nullable: true,
            required: false,
          },
          onboardingCompleted: {
            type: "boolean",
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
