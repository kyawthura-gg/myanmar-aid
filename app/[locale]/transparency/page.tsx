import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data for donations
const recentDonations = [
  {
    id: "d1",
    donor: "John S.",
    recipient: "Aung Family",
    amount: 150,
    date: "2025-03-28T09:20:00Z",
    status: "verified",
  },
  {
    id: "d2",
    donor: "Sarah J.",
    recipient: "Min Family",
    amount: 200,
    date: "2025-03-27T14:10:00Z",
    status: "verified",
  },
  {
    id: "d3",
    donor: "Michael T.",
    recipient: "Thiri Family",
    amount: 75,
    date: "2025-03-27T10:30:00Z",
    status: "verified",
  },
  {
    id: "d4",
    donor: "Emma L.",
    recipient: "Kyaw Family",
    amount: 120,
    date: "2025-03-26T16:45:00Z",
    status: "verified",
  },
  {
    id: "d5",
    donor: "David W.",
    recipient: "Min Family",
    amount: 50,
    date: "2025-03-26T11:20:00Z",
    status: "verified",
  },
]

// Mock data for testimonials
const testimonials = [
  {
    id: "t1",
    family: "Aung Family",
    message:
      "Thank you so much for your generous donation. We were able to purchase materials to repair our roof before the rainy season.",
    date: "2025-03-29T10:15:00Z",
  },
  {
    id: "t2",
    family: "Min Family",
    message:
      "We are deeply grateful for the support. The medical supplies you helped us purchase have made a significant difference for our child's recovery.",
    date: "2025-03-28T14:30:00Z",
  },
  {
    id: "t3",
    family: "Thiri Family",
    message:
      "Your kindness has brought hope to our large family. We now have clean water and food supplies that will last us for weeks.",
    date: "2025-03-27T09:45:00Z",
  },
]

export default function TransparencyPage() {
  return (
    <div className="container py-10">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Transparency Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track donations and see the impact of community support
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">$32,450</CardTitle>
              <CardDescription>Total donations to date</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">189</CardTitle>
              <CardDescription>Families helped</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">100%</CardTitle>
              <CardDescription>Funds directly to recipients</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donations">Donation Ledger</TabsTrigger>
            <TabsTrigger value="testimonials">Family Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>
                  All verified donations are publicly recorded for transparency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-3 font-medium text-sm bg-muted">
                    <div>Date</div>
                    <div>Donor</div>
                    <div>Recipient</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {recentDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="grid grid-cols-5 p-3 text-sm"
                      >
                        <div className="text-muted-foreground">
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                        <div>{donation.donor}</div>
                        <div>{donation.recipient}</div>
                        <div>${donation.amount}</div>
                        <div>
                          {donation.status === "verified" ? (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Verified</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              <span>Pending</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="flex items-center gap-2">
                    View All Donations
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {testimonial.family.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {testimonial.family}
                        </CardTitle>
                        <CardDescription>
                          {new Date(testimonial.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                      "{testimonial.message}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                View All Testimonials
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Our Commitment to Transparency</CardTitle>
            <CardDescription>
              How we ensure your donations reach those who need them most
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-medium">Verification Process</h3>
                <p className="text-sm text-muted-foreground">
                  Every family registration undergoes a thorough verification
                  process to confirm their identity and needs. Our team
                  validates documentation and conducts follow-up checks.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Donation Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  All donations are recorded in our public ledger. Donors
                  provide proof of transaction, and recipients confirm receipt
                  of funds to complete the verification cycle.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Direct Support Model</h3>
                <p className="text-sm text-muted-foreground">
                  100% of your donation goes directly to the family you choose
                  to support. We do not take any fees or percentage of
                  donations. Our platform is maintained by volunteers.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                For more information about our transparency practices or to
                volunteer as a verification team member, please{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
