import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
   plugins: [inferAdditionalFields({
      user: {
        accountType: {
          type: "string",
				  nullable: true
        }
      }
  })],
})
