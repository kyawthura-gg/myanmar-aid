import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function DonationSuccessPage() {
  return (
    <div className="container max-w-md py-20">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Donation Proof Submitted</CardTitle>
          <CardDescription>Thank you for your generosity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your donation proof has been submitted successfully. The recipient will be notified of your contribution.
          </p>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground text-left list-decimal pl-4">
              <li>Our team will verify your donation proof</li>
              <li>The recipient will confirm receipt of funds</li>
              <li>Your donation will be recorded on our public ledger</li>
              <li>You'll receive a confirmation email with a receipt</li>
            </ol>
          </div>

          <p className="text-sm text-muted-foreground">
            Donation ID: <span className="font-mono">DON-2025-03-31-0087</span>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/donate">Find More Recipients</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

