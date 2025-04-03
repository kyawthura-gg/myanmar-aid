import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RegisterLayout({
  children,
}: { children: React.ReactNode }) {
  const auth = await getAuthSession()

  if (!auth?.user?.onboardingCompleted) {
    return redirect("/register-need-campaign")
  }

  return <>{children}</>
}
