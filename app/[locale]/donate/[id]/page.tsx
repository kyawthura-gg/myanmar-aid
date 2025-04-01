"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Building,
  Calendar,
  CreditCard,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock data for recipients
const recipients = [
  {
    id: "1",
    name: "Aung Family",
    type: "family",
    location: "Yangon",
    members: 5,
    needs: ["Shelter", "Food"],
    story:
      "Lost home in earthquake, currently staying in temporary shelter. The family includes two young children and elderly grandparents. Their house was completely destroyed in the earthquake, and they are currently living under a makeshift shelter made from tarpaulin. They urgently need materials to build a more stable temporary shelter before the rainy season begins. They also need food supplies as the father has lost his job at the local market which was destroyed in the earthquake.",
    amountNeeded: 500,
    amountRaised: 320,
    updates: [
      {
        date: "2025-03-25",
        content:
          "Thank you to everyone who has donated so far. We were able to purchase some tarpaulin and basic food supplies.",
      },
      {
        date: "2025-03-28",
        content:
          "We received more donations and have now bought wood to strengthen our temporary shelter. We are very grateful for your support.",
      },
    ],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: "5",
    name: "Ma Hla",
    type: "individual",
    location: "Yangon",
    members: 1,
    needs: ["Medical", "Food"],
    story:
      "I am an elderly woman with chronic medical conditions who lost my home in the earthquake. I was living alone in a small house that was severely damaged during the earthquake. The walls have large cracks and it's not safe to stay inside. I need assistance with medical supplies for my diabetes and high blood pressure, as well as basic food and shelter. I lost most of my belongings in the earthquake and have been staying with neighbors temporarily, but need to find a more permanent solution soon.",
    amountNeeded: 300,
    amountRaised: 120,
    updates: [
      {
        date: "2025-03-26",
        content:
          "I am grateful for the initial donations that have helped me purchase my essential medications.",
      },
    ],
    images: ["/placeholder.svg?height=300&width=400"],
  },
  {
    id: "7",
    name: "Yangon Relief Center",
    type: "organization",
    location: "Yangon",
    members: 0,
    needs: ["Food", "Medical", "Shelter"],
    story:
      "We are a local organization providing immediate relief to over 50 families in the Yangon area affected by the earthquake. Our team of volunteers is working around the clock to distribute emergency supplies, provide basic medical care, and help construct temporary shelters. We have established a community kitchen that serves hot meals twice daily to affected families. We also have a medical team providing first aid and basic healthcare. Your donations will help us purchase more food supplies, medical equipment, and building materials for temporary shelters. We ensure transparent use of all funds and provide regular updates on our activities.",
    amountNeeded: 2000,
    amountRaised: 800,
    updates: [
      {
        date: "2025-03-24",
        content:
          "Today we distributed food packages to 25 families in the eastern district of Yangon.",
      },
      {
        date: "2025-03-26",
        content:
          "Our medical team treated 15 people with minor injuries and distributed essential medications.",
      },
      {
        date: "2025-03-29",
        content:
          "With recent donations, we purchased materials to build 10 temporary shelters. Construction begins tomorrow.",
      },
    ],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
]

// Payment method types
interface PaymentMethod {
  id: number
  methodType: string
  bankName?: string
  accountName?: string
  accountNumber?: string
  iban?: string
  cryptoCurrency?: string
  cryptoAddress?: string
  mobileProvider?: string
  mobileNumber?: string
}

export default function CampaignDonationPage() {
  const router = useRouter()
  const params = useParams()
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [activePaymentTab, setActivePaymentTab] = useState("bank")
  const [proofUploaded, setProofUploaded] = useState(false)

  const recipient = recipients.find((r) => r.id === params.id)

  if (!recipient) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipient Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The recipient you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/donate">Back to Donations</Link>
        </Button>
      </div>
    )
  }

  const handleDonate = () => {
    setIsDonateModalOpen(true)
  }

  const handleSubmitProof = () => {
    setIsDonateModalOpen(false)
    setIsProofModalOpen(true)
  }

  const handleProofSubmission = () => {
    // In a real app, this would submit the proof to the server
    setIsProofModalOpen(false)
    // Show success message or redirect
    router.push("/donation-success")
  }

  return (
    <div className="container py-10">
      <Link
        href="/donate"
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all recipients
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">
                  {recipient.type === "family" && <Users className="h-6 w-6" />}
                  {recipient.type === "individual" && (
                    <User className="h-6 w-6" />
                  )}
                  {recipient.type === "organization" && (
                    <Building className="h-6 w-6" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{recipient.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {recipient.location}
                  </div>
                  {recipient.type !== "organization" && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      {recipient.members}{" "}
                      {recipient.type === "family"
                        ? "family members"
                        : "person"}
                    </div>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {recipient.type}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Their Story</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {recipient.story}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Needs</h2>
                <div className="flex flex-wrap gap-2">
                  {recipient.needs.map((need, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Verification Status
                </h2>
                <div className="flex items-center gap-2 text-green-600">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Verified
                  </Badge>
                  <span className="text-sm">
                    Verified by Myanmar Aid Connect on March 25, 2025
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="updates" className="mt-6">
              {recipient.updates && recipient.updates.length > 0 ? (
                <div className="space-y-4">
                  {recipient.updates.map((update, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            Update from {recipient.name}
                          </CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {update.date}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {update.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No updates have been posted yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              {recipient.images && recipient.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipient.images.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden border"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={""}
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No photos have been uploaded yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation Progress</CardTitle>
              <CardDescription>
                Help {recipient.name} reach their goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">
                    ${recipient.amountRaised} raised
                  </span>
                  <span className="text-muted-foreground">
                    of ${recipient.amountNeeded} goal
                  </span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full"
                    style={{
                      width: `${
                        (recipient.amountRaised / recipient.amountNeeded) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">
                    {Math.round(
                      (recipient.amountRaised / recipient.amountNeeded) * 100
                    )}
                    % complete
                  </span>
                  <span className="text-muted-foreground">
                    ${recipient.amountNeeded - recipient.amountRaised} still
                    needed
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Recent Donors</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">John S.</div>
                        <div className="text-xs text-muted-foreground">
                          2 days ago
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">$50</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>MT</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Michael T.</div>
                        <div className="text-xs text-muted-foreground">
                          3 days ago
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">$75</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>EL</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Emma L.</div>
                        <div className="text-xs text-muted-foreground">
                          4 days ago
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">$100</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Your donation goes directly to {recipient.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                100% of your donation will go directly to {recipient.name} to
                help with their immediate needs. After clicking the button
                below, you'll see payment information and be able to submit
                proof of your donation.
              </p>

              <div className="rounded-lg border p-4 bg-muted/30">
                <h3 className="font-medium text-sm mb-2">How it works:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                  <li>Click the "Donate Now" button below</li>
                  <li>Choose your preferred payment method</li>
                  <li>Make the payment directly to the recipient</li>
                  <li>Submit proof of your donation</li>
                  <li>The recipient will confirm receipt</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleDonate}>
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Donation Payment Modal */}
      <Dialog open={isDonateModalOpen} onOpenChange={setIsDonateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Payment Information</DialogTitle>
            <DialogDescription>
              Please use one of the following payment methods to donate to{" "}
              {recipient.name}.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="bank" onValueChange={setActivePaymentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank">
                <CreditCard className="h-4 w-4 mr-2" />
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Phone className="h-4 w-4 mr-2" />
                Mobile Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="mt-4 space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-3">
                  {paymentMethods
                    .filter((method) => method.methodType === "Bank")
                    .map((method, index) => (
                      <div key={index} className="space-y-1">
                        <h3 className="font-medium">{method.bankName}</h3>
                        <div className="grid grid-cols-2 text-sm">
                          <span className="text-muted-foreground">
                            Account Name:
                          </span>
                          <span>{method.accountName}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <span className="text-muted-foreground">
                            Account Number:
                          </span>
                          <span className="font-mono">
                            {method.accountNumber}
                          </span>
                        </div>
                        {method.iban && (
                          <div className="grid grid-cols-2 text-sm">
                            <span className="text-muted-foreground">IBAN:</span>
                            <span className="font-mono">{method.iban}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Please include "{recipient.name} - Aid" in the transfer
                  reference.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-4 space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-3">
                  {paymentMethods
                    .filter((method) => method.methodType === "MobileMoney")
                    .map((method, index) => (
                      <div key={index} className="space-y-1">
                        <h3 className="font-medium">{method.mobileProvider}</h3>
                        <div className="grid grid-cols-2 text-sm">
                          <span className="text-muted-foreground">Number:</span>
                          <span className="font-mono">
                            {method.mobileNumber}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{method.accountName}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Please include "{recipient.name} - Aid" in the payment note.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t pt-4">
            <p className="text-sm text-center mb-4">
              After making your donation, please submit proof of payment to
              verify your contribution.
            </p>
            <Button className="w-full" onClick={handleSubmitProof}>
              Submit Donation Proof
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proof Submission Modal */}
      <Dialog open={isProofModalOpen} onOpenChange={setIsProofModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Donation Proof</DialogTitle>
            <DialogDescription>
              Please provide details about your donation and upload proof of
              payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex">
                  <span className="flex items-center justify-center border border-r-0 rounded-l-md px-3 bg-muted">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    className="rounded-l-none"
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Input
                  id="payment-method"
                  value={
                    activePaymentTab === "bank"
                      ? "Bank Transfer"
                      : "Mobile Payment"
                  }
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-id">Transaction ID/Reference</Label>
              <Input id="transaction-id" placeholder="e.g., TRX123456789" />
            </div>

            <div className="space-y-2">
              <Label>Proof of Payment</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Upload Screenshot/Receipt
                  </p>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    Please upload a screenshot or photo of your payment receipt.
                    We accept JPG, PNG or PDF files.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setProofUploaded(true)}
                    className="mt-2"
                  >
                    Select File
                  </Button>
                  {proofUploaded && (
                    <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                      <span>payment-receipt.jpg uploaded successfully</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about your donation..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProofModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleProofSubmission} disabled={!proofUploaded}>
              Submit Proof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
