import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegistrationSuccessPage() {
  return (
    <div className="container-wrapper max-w-md py-20">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Registration Submitted</CardTitle>
          <CardDescription>
            Your family registration has been received
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for registering with Myanmar Aid Connect. Your
            registration is now pending verification by our team.
          </p>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground text-left list-decimal pl-4">
              <li>
                Our verification team will review your information (typically
                within 24-48 hours)
              </li>
              <li>You may receive a call or message to confirm details</li>
              <li>
                Once verified, your profile will be visible to potential donors
              </li>
              <li>
                You'll receive notifications when donations are made to your
                family
              </li>
            </ol>
          </div>

          <p className="text-sm text-muted-foreground">
            Registration ID:{" "}
            <span className="font-mono">REG-2025-03-31-0042</span>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
