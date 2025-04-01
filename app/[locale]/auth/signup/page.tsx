import { RegisterForm } from "./form"

console.log("CLOUDFLARE_ACCOUNT_ID", process.env.DB)
export default function SignUpPage() {
  return (
    <div className="container">
      <RegisterForm />
    </div>
  )
}
