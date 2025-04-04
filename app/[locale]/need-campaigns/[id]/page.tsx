"use client"

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
  MapPin,
  MessageSquare,
  Share2,
  Upload,
  X,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

import { useSafeBack } from "@/hooks/use-safe-back"
import { getStorageFullURL } from "@/lib/utils"
import { api } from "@/trpc/react"
import Loading from "./loading"

export default function CampaignDonationPage() {
  const params = useParams()
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [proofUploaded, setProofUploaded] = useState(false)
  const safeBack = useSafeBack()

  const { data: campaign, isLoading } = api.campaign.getActiveById.useQuery(
    params.id as string,
    {
      enabled: !!params.id,
    }
  )

  const handleProofSubmission = () => {}

  if (isLoading) {
    return <Loading />
  }

  if (!campaign) {
    return (
      <div className="container-wrapper py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The campaign you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="link" onClick={() => safeBack("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
      </div>
    )
  }

  return (
    <div className="container-wrapper py-10">
      <Button variant="link" onClick={() => safeBack("/")}>
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {campaign.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{campaign.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    Myanmar
                  </div>
                  <Badge variant="outline">{campaign.status}</Badge>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Campaign Story</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Contact Information
                </h2>
                <div className="space-y-2">
                  {campaign.user.facebookLink && (
                    <a
                      href={campaign.user.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        />
                      </svg>
                      Facebook
                    </a>
                  )}
                  {campaign.user.viberPhoneNumber && (
                    <a
                      href={campaign.user.viberPhoneNumber}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M11.4.883C5.797.883 1.242 5.437 1.242 11.04v.002c0 1.345.263 2.624.74 3.795a.27.27 0 0 1 .03.126v3.577c0 .147.12.268.268.268h3.577a.27.27 0 0 0 .126-.03c1.171-.477 2.45-.74 3.795-.74h.002c5.603 0 10.157-4.554 10.157-10.157S17.003.883 11.4.883z"
                        />
                      </svg>
                      Viber
                    </a>
                  )}
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
                    Verified by Myanmar Aid Connect
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              {campaign.photos ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {JSON.parse(campaign.photos).map(
                    (photo: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden border"
                      >
                        <img
                          src={getStorageFullURL(photo)}
                          alt=""
                          className="w-full h-auto object-cover aspect-video"
                        />
                      </div>
                    )
                  )}
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
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Available payment options for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaign.payments.map((payment, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2 capitalize">
                    {payment.methodType === "mobilepayment"
                      ? "Mobile Payment"
                      : payment.methodType}
                  </h3>
                  {payment.methodType === "bank" && (
                    <>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">
                          Account Name:
                        </span>
                        <span>{payment.accountName}</span>
                        <span className="text-muted-foreground">
                          Account Number:
                        </span>
                        <span className="font-mono">
                          {payment.accountNumber}
                        </span>
                      </div>
                    </>
                  )}
                  {payment.methodType === "crypto" && (
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">
                        Wallet Address:
                      </span>
                      <span className="font-mono">{payment.cryptoAddress}</span>
                    </div>
                  )}
                  {payment.methodType === "mobilepayment" && (
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Provider:</span>
                      <span>{payment.mobileProvider}</span>
                      <span className="text-muted-foreground">Number:</span>
                      <span className="font-mono">{payment.mobileNumber}</span>
                    </div>
                  )}
                  {payment.methodType === "link" && payment.link && (
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">
                        Payment Link:
                      </span>
                      <a
                        href={payment.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open Link
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Donation Proof</CardTitle>
              <CardDescription>
                After making your donation, please submit proof of payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setIsProofModalOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Proof
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
                  // value={
                  //   activePaymentTab === "bank"
                  //     ? "Bank Transfer"
                  //     : "Mobile Payment"
                  // }
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
