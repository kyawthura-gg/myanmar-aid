import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const runtime = "edge"

export default async function RegisterLayout({
  children,
}: { children: React.ReactNode }) {
  const auth = await getAuthSession()

  if (auth?.user?.onboardingCompleted) {
    return redirect("/account/campaigns")
  }

  return <>{children}</>
}
