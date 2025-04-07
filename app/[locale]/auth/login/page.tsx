import { LoginForm } from "./form"

export const runtime = "edge"

export default function SignInPage() {
  return (
    <div className="container-wrapper min-h-[70dvh] flex flex-col justify-center">
      <LoginForm />
    </div>
  )
}
