"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { useSafeBack } from "@/hooks/use-safe-back"
import { cn, getStorageFullURL } from "@/lib/utils"
import type { AppRouter } from "@/server/root"
import type { inferRouterOutputs } from "@trpc/server"
import {
  ArrowLeft,
  BitcoinIcon,
  Building2Icon,
  CheckCircleIcon,
  CopyIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  LinkIcon,
  MailIcon,
  MapPin,
  MessageSquare,
  PhoneIcon,
  Share2,
  SmartphoneIcon,
  TagIcon,
  Upload,
  X,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type RouterOutput = inferRouterOutputs<AppRouter>["campaign"]["getActiveById"]

export function NeedCampaignDetails({ campaign }: { campaign: RouterOutput }) {
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [proofUploaded, setProofUploaded] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const safeBack = useSafeBack()

  const handleProofSubmission = () => {}

  const handleShare = async () => {
    if (!campaign) {
      return
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: `Check out this campaign: ${campaign.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copy link if share fails or is cancelled
        await navigator.clipboard.writeText(window.location.href)
        // You might want to add a toast notification here
      }
    } else {
      // Fallback for browsers that don't support share API
      await navigator.clipboard.writeText(window.location.href)
      // You might want to add a toast notification here
    }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container-wrapper py-3 md:py-6">
          <Button variant="link" onClick={() => safeBack("/")}>
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>

          <div className="mt-2 md:mt-4 pl-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {campaign.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-wrapper py-3 md:py-6">
        <div className="grid gap-8 lg:grid-cols-12 px-3">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Photos Gallery */}
            {campaign.photos.length > 0 && (
              <div className="space-y-4">
                {/* Main Photo */}
                <div className="aspect-video rounded-xl overflow-hidden border bg-muted">
                  <img
                    src={getStorageFullURL(campaign.photos[0])}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {campaign.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {campaign.photos.slice(1).map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          window.open(getStorageFullURL(photo), "_blank")
                        }
                      >
                        <img
                          src={getStorageFullURL(photo)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Campaign Info */}
            <div className="bg-white rounded-xl border p-6 space-y-6">
              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">About this campaign</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                {/* Campaign Details */}
                <div className="grid gap-6 mt-6 pt-6 border-t sm:grid-cols-2">
                  {/* Categories */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <TagIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Categories</h4>
                        <p className="text-sm text-muted-foreground">
                          Campaign focus areas
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.categories.map((category: string) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="capitalize bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  {campaign?.region?.nameEn ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <MapPin className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p className="text-sm text-muted-foreground">
                            Campaign area
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold pl-4">
                        {campaign?.township?.nameEn
                          ? `${campaign.township.nameEn}, `
                          : ""}
                        {campaign.region.nameEn}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Organizer Info */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/5">
                    {campaign.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {campaign.user?.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Campaign Organizer
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {campaign.accountType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            {/* <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-lg mb-4">Recent Donations</h3>
              {campaign.donations.length > 0 ? (
                <div className="space-y-4">
                  {campaign.donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {donation.isAnonymous
                            ? "Anonymous Donor"
                            : donation.donorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistance(
                            new Date(donation.donatedAt),
                            new Date(),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        ${donation.amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No donations yet. Be the first to donate!
                </div>
              )}
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              {/* Campaign Stats */}
              <Card className="mb-6">
                <CardHeader>
                  {/* <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      $
                      {campaign.donations
                        .reduce((acc, d) => acc + d.amount, 0)
                        .toLocaleString()}
                    </div>
                    <CardDescription>
                      raised by {campaign.donations.length} donors
                    </CardDescription>
                  </div> */}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsProofModalOpen(true)}
                  >
                    Donate Now
                  </Button> */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <CreditCardIcon className="h-4 w-4" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-3 md:p-6">
                  {campaign.payments.map((payment, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-lg border p-2 md:p-4 transition-colors",
                        payment.isVerified && "border-green-200 bg-green-50",
                        "hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {payment.methodType === "bank" && (
                            <Building2Icon className="h-5 w-5 text-blue-600" />
                          )}
                          {payment.methodType === "crypto" && (
                            <BitcoinIcon className="h-5 w-5 text-orange-500" />
                          )}
                          {payment.methodType === "mobilepayment" && (
                            <SmartphoneIcon className="h-5 w-5 text-green-600" />
                          )}
                          {payment.methodType === "link" && (
                            <LinkIcon className="h-5 w-5 text-purple-600" />
                          )}
                          <h3 className="font-medium capitalize">
                            {payment.methodType === "mobilepayment"
                              ? "Mobile Payment"
                              : payment.methodType}
                          </h3>
                        </div>
                        {payment.isVerified && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        {/* Country info for all methods */}
                        {payment.methodType !== "link" &&
                        payment.methodType !== "crypto" ? (
                          <p className="text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {payment.country}
                          </p>
                        ) : null}

                        {payment.methodType === "bank" && (
                          <div className="grid gap-2 text-sm">
                            {payment.accountBankName && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Bank Name:
                                </span>
                                <span className="font-medium">
                                  {payment.accountBankName}
                                </span>
                              </div>
                            )}
                            {payment.accountName && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Account Name:
                                </span>
                                <span className="font-medium">
                                  {payment.accountName}
                                </span>
                              </div>
                            )}
                            {payment.accountNumber && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Account Number:
                                </span>
                                <code className="font-mono bg-background px-2 py-0.5 rounded">
                                  {payment.accountNumber}
                                </code>
                              </div>
                            )}
                          </div>
                        )}

                        {payment.methodType === "crypto" &&
                          payment.cryptoAddress && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Wallet Address:
                                </span>
                                <code className="font-mono bg-background px-2 py-0.5 rounded text-xs">
                                  {payment.cryptoAddress}
                                </code>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    payment.cryptoAddress!
                                  )
                                }
                              >
                                <CopyIcon className="h-3 w-3 mr-2" />
                                Copy Address
                              </Button>
                            </div>
                          )}

                        {payment.methodType === "mobilepayment" && (
                          <div className="grid gap-2 text-sm">
                            {payment.mobileProvider && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Provider:
                                </span>
                                <span className="font-medium">
                                  {payment.mobileProvider}
                                </span>
                              </div>
                            )}
                            {payment.accountName && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Account Name:
                                </span>
                                <span className="font-medium">
                                  {payment.accountName}
                                </span>
                              </div>
                            )}
                            {payment.mobileNumber && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-muted-foreground">
                                  Number:
                                </span>
                                <code className="font-mono bg-background px-2 py-0.5 rounded">
                                  {payment.mobileNumber}
                                </code>
                              </div>
                            )}
                          </div>
                        )}

                        {payment.methodType === "link" && payment.link && (
                          <div className="space-y-2 text-sm">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() =>
                                window.open(payment.link!, "_blank")
                              }
                            >
                              <ExternalLinkIcon className="h-3 w-3 mr-2" />
                              Open Payment Link
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Donation Button */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Support this Campaign</CardTitle>
                  <CardDescription>
                    Your donation can make a difference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsProofModalOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Donation
                  </Button>
                </CardContent>
              </Card> */}
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
                  <Label htmlFor="transaction-id">
                    Transaction ID/Reference
                  </Label>
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
                        Please upload a screenshot or photo of your payment
                        receipt. We accept JPG, PNG or PDF files.
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
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
                <Button
                  onClick={handleProofSubmission}
                  disabled={!proofUploaded}
                >
                  Submit Proof
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Contact
                </DialogTitle>
              </DialogHeader>

              {/* Direct Contact Methods */}
              <div className="grid gap-3">
                {campaign.contactMethods?.map((contact, index) => {
                  const contactConfig = {
                    phone: {
                      icon: <PhoneIcon className="h-4 w-4 text-blue-500" />,
                      label: "Phone Number",
                    },
                    viber: {
                      icon: (
                        <svg
                          className="h-4 w-4 text-purple-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.011 0C5.506 0 .214 5.292.214 11.797c0 2.03.525 4.103 1.594 5.897L.228 23.242l5.726-1.63c1.733.943 3.677 1.438 5.66 1.438 6.505 0 11.797-5.292 11.797-11.797C23.411 5.292 18.116 0 12.011 0zm0 21.516c-1.665 0-3.297-.445-4.732-1.289l-.339-.201-3.516.922.937-3.422-.222-.351c-.917-1.458-1.4-3.146-1.4-4.878 0-5.075 4.131-9.206 9.206-9.206s9.206 4.131 9.206 9.206-4.131 9.219-9.14 9.219zm5.378-6.885c-.277-.139-1.644-.811-1.899-.904-.255-.093-.44-.139-.625.139-.186.277-.718.904-.881 1.089-.163.186-.326.209-.603.07-.277-.139-1.171-.432-2.231-1.378-.824-.735-1.381-1.643-1.544-1.92-.163-.277-.017-.427.122-.564.125-.125.277-.325.417-.487.139-.163.186-.277.277-.463.093-.186.047-.348-.023-.487-.07-.139-.625-1.507-.856-2.063-.23-.557-.46-.482-.625-.482-.163-.009-.348-.009-.533-.009-.186 0-.487.07-.741.348-.255.277-.973.952-.973 2.32s.997 2.69 1.134 2.875c.139.186 1.954 2.986 4.734 4.188.661.286 1.179.456 1.581.584.664.21 1.27.181 1.747.11.533-.08 1.644-.672 1.876-1.32.232-.649.232-1.205.163-1.32-.07-.116-.255-.186-.532-.325z" />
                        </svg>
                      ),
                      label: "Viber",
                    },
                    whatsapp: {
                      icon: (
                        <svg
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.507 7.203c-2.023-2.023-4.713-3.137-7.573-3.137-5.9 0-10.71 4.81-10.71 10.71 0 1.885.495 3.73 1.436 5.353L0 24l4.013-.627c1.558.85 3.318 1.3 5.099 1.3h.004c5.9 0 10.71-4.81 10.71-10.71 0-2.86-1.114-5.55-3.137-7.573l.818.813zm-7.573 16.524h-.004c-1.597 0-3.163-.43-4.53-1.24l-.325-.193-3.367.883.898-3.28-.211-.336c-.894-1.422-1.368-3.067-1.368-4.768 0-4.916 4.003-8.92 8.924-8.92 2.384 0 4.624.929 6.308 2.614 1.684 1.685 2.612 3.925 2.612 6.309 0 4.917-4.004 8.92-8.92 8.92l-.017.011zm4.885-6.675c-.268-.134-1.589-.784-1.836-.873-.247-.089-.427-.134-.606.134-.179.268-.694.873-.851 1.054-.157.18-.314.202-.582.067-.268-.134-1.133-.418-2.157-1.33-.797-.71-1.334-1.59-1.49-1.858-.157-.268-.017-.413.117-.547.12-.12.268-.313.403-.47.134-.157.179-.269.268-.448.09-.179.045-.336-.022-.47-.067-.134-.605-1.457-.83-1.995-.218-.522-.44-.452-.605-.46-.157-.007-.336-.009-.516-.009-.179 0-.47.067-.716.336-.246.268-.94.917-.94 2.236 0 1.32.964 2.595 1.097 2.774.134.18 1.894 2.89 4.587 4.05.64.277 1.14.442 1.53.565.644.205 1.23.176 1.693.107.516-.077 1.59-.65 1.814-1.277.224-.627.224-1.164.157-1.277-.067-.112-.246-.179-.514-.313z" />
                        </svg>
                      ),
                      label: "WhatsApp",
                    },
                    facebook: {
                      icon: (
                        <svg
                          className="h-4 w-4 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                      label: "Facebook",
                    },
                    instagram: {
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 2499.899999999999 2500"
                        >
                          <defs>
                            <radialGradient
                              id="a"
                              cx="332.14"
                              cy="2511.81"
                              r="3263.54"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset=".09" stop-color="#fa8f21" />
                              <stop offset=".78" stop-color="#d82d7e" />
                            </radialGradient>
                            <radialGradient
                              id="b"
                              cx="1516.14"
                              cy="2623.81"
                              r="2572.12"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop
                                offset=".64"
                                stop-color="#8c3aaa"
                                stop-opacity="0"
                              />
                              <stop offset="1" stop-color="#8c3aaa" />
                            </radialGradient>
                          </defs>
                          <path
                            d="M833.4 1250c0-230.11 186.49-416.7 416.6-416.7s416.7 186.59 416.7 416.7-186.59 416.7-416.7 416.7-416.6-186.59-416.6-416.7m-225.26 0c0 354.5 287.36 641.86 641.86 641.86s641.86-287.36 641.86-641.86S1604.5 608.14 1250 608.14 608.14 895.5 608.14 1250m1159.13-667.31a150 150 0 1 0 150.06-149.94h-.06a150.07 150.07 0 0 0-150 149.94M745 2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28 7.27-505.15c5.55-121.87 26-188 43-232.13 22.72-58.36 49.78-100 93.5-143.78s85.32-70.88 143.78-93.5c44-17.16 110.26-37.46 232.13-43 131.76-6.06 171.34-7.27 505-7.27s373.28 1.31 505.15 7.27c121.87 5.55 188 26 232.13 43 58.36 22.62 100 49.78 143.78 93.5s70.78 85.42 93.5 143.78c17.16 44 37.46 110.26 43 232.13 6.06 131.87 7.27 171.34 7.27 505.15s-1.21 373.28-7.27 505.15c-5.55 121.87-25.95 188.11-43 232.13-22.72 58.36-49.78 100-93.5 143.68s-85.42 70.78-143.78 93.5c-44 17.16-110.26 37.46-232.13 43-131.76 6.06-171.34 7.27-505.15 7.27s-373.28-1.21-505-7.27M734.65 7.57c-133.07 6.06-224 27.16-303.41 58.06C349 97.54 279.38 140.35 209.81 209.81S97.54 349 65.63 431.24c-30.9 79.46-52 170.34-58.06 303.41C1.41 867.93 0 910.54 0 1250s1.41 382.07 7.57 515.35c6.06 133.08 27.16 223.95 58.06 303.41 31.91 82.19 74.62 152 144.18 221.43S349 2402.37 431.24 2434.37c79.56 30.9 170.34 52 303.41 58.06C868 2498.49 910.54 2500 1250 2500s382.07-1.41 515.35-7.57c133.08-6.06 223.95-27.16 303.41-58.06 82.19-32 151.86-74.72 221.43-144.18s112.18-139.24 144.18-221.43c30.9-79.46 52.1-170.34 58.06-303.41 6.06-133.38 7.47-175.89 7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95 97.54 2068.86 65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17 1.51 1589.56 0 1250.1 0S868 1.41 734.65 7.57"
                            fill="url(#a)"
                          />
                          <path
                            d="M833.4 1250c0-230.11 186.49-416.7 416.6-416.7s416.7 186.59 416.7 416.7-186.59 416.7-416.7 416.7-416.6-186.59-416.6-416.7m-225.26 0c0 354.5 287.36 641.86 641.86 641.86s641.86-287.36 641.86-641.86S1604.5 608.14 1250 608.14 608.14 895.5 608.14 1250m1159.13-667.31a150 150 0 1 0 150.06-149.94h-.06a150.07 150.07 0 0 0-150 149.94M745 2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28 7.27-505.15c5.55-121.87 26-188 43-232.13 22.72-58.36 49.78-100 93.5-143.78s85.32-70.88 143.78-93.5c44-17.16 110.26-37.46 232.13-43 131.76-6.06 171.34-7.27 505-7.27s373.28 1.31 505.15 7.27c121.87 5.55 188 26 232.13 43 58.36 22.62 100 49.78 143.78 93.5s70.78 85.42 93.5 143.78c17.16 44 37.46 110.26 43 232.13 6.06 131.87 7.27 171.34 7.27 505.15s-1.21 373.28-7.27 505.15c-5.55 121.87-25.95 188.11-43 232.13-22.72 58.36-49.78 100-93.5 143.68s-85.42 70.78-143.78 93.5c-44 17.16-110.26 37.46-232.13 43-131.76 6.06-171.34 7.27-505.15 7.27s-373.28-1.21-505-7.27M734.65 7.57c-133.07 6.06-224 27.16-303.41 58.06C349 97.54 279.38 140.35 209.81 209.81S97.54 349 65.63 431.24c-30.9 79.46-52 170.34-58.06 303.41C1.41 867.93 0 910.54 0 1250s1.41 382.07 7.57 515.35c6.06 133.08 27.16 223.95 58.06 303.41 31.91 82.19 74.62 152 144.18 221.43S349 2402.37 431.24 2434.37c79.56 30.9 170.34 52 303.41 58.06C868 2498.49 910.54 2500 1250 2500s382.07-1.41 515.35-7.57c133.08-6.06 223.95-27.16 303.41-58.06 82.19-32 151.86-74.72 221.43-144.18s112.18-139.24 144.18-221.43c30.9-79.46 52.1-170.34 58.06-303.41 6.06-133.38 7.47-175.89 7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95 97.54 2068.86 65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17 1.51 1589.56 0 1250.1 0S868 1.41 734.65 7.57"
                            fill="url(#b)"
                          />
                        </svg>
                      ),
                      label: "Instagram",
                    },
                    tiktok: {
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16px"
                          height="16px"
                          viewBox="0 0 300 300"
                          version="1.1"
                          preserveAspectRatio="xMidYMid"
                        >
                          <title>TikTok</title>
                          <g>
                            <path
                              d="M189.720224,104.421475 C208.398189,117.766281 231.279538,125.618095 255.992548,125.618095 L255.992548,78.0872726 C251.315611,78.0882654 246.650588,77.6008156 242.074913,76.6318726 L242.074913,114.045382 C217.363889,114.045382 194.485518,106.193568 175.80259,92.8497541 L175.80259,189.846306 C175.80259,238.368905 136.447224,277.701437 87.902784,277.701437 C69.7897057,277.701437 52.9543216,272.228299 38.9691786,262.841664 C54.9309256,279.153859 77.1908018,289.273158 101.81744,289.273158 C150.364858,289.273158 189.72221,249.940626 189.72221,201.416041 L189.72221,104.421475 L189.720224,104.421475 Z M206.889179,56.4687254 C197.343701,46.0456391 191.076347,32.5757434 189.720224,17.6842019 L189.720224,11.5707278 L176.531282,11.5707278 C179.851103,30.497877 191.174632,46.6681056 206.889179,56.4687254 L206.889179,56.4687254 Z M69.6735517,225.606854 C64.3403943,218.617757 61.4583846,210.068027 61.4712906,201.277053 C61.4712906,179.084685 79.472186,161.090739 101.680438,161.090739 C105.819294,161.089747 109.933331,161.723134 113.877603,162.974023 L113.877603,114.380938 C109.268175,113.749536 104.616057,113.481488 99.9659254,113.579773 L99.9659254,151.402303 C96.0186741,150.151413 91.9026521,149.516041 87.7628035,149.520012 C65.5545513,149.520012 47.5546487,167.511972 47.5546487,189.707318 C47.5546487,205.401018 56.552118,218.98806 69.6735517,225.606854 Z"
                              fill="#FF004F"
                            />
                            <path
                              d="M175.80259,92.8487613 C194.485518,106.192575 217.363889,114.044389 242.074913,114.044389 L242.074913,76.6308799 C228.281375,73.6942679 216.070311,66.4897401 206.889179,56.4687254 C191.173639,46.6671128 179.851103,30.4968842 176.531282,11.5707278 L141.8876,11.5707278 L141.8876,201.414056 C141.809172,223.545865 123.839052,241.466346 101.678453,241.466346 C88.6195635,241.466346 77.0180599,235.24466 69.6705734,225.606854 C56.5501325,218.98806 47.5526631,205.400025 47.5526631,189.708311 C47.5526631,167.51495 65.5525657,149.521004 87.760818,149.521004 C92.0158278,149.521004 96.1169583,150.183182 99.9639399,151.403295 L99.9639399,113.580765 C52.272289,114.565593 13.9166419,153.513923 13.9166419,201.415048 C13.9166419,225.326893 23.4680767,247.004014 38.9701714,262.842657 C52.9553144,272.228299 69.7906985,277.70243 87.9037768,277.70243 C136.449209,277.70243 175.803582,238.367912 175.803582,189.846306 L175.803582,92.8487613 L175.80259,92.8487613 Z"
                              fill="#000000"
                            />
                            <path
                              d="M242.074913,76.6308799 L242.074913,66.5145593 C229.636505,66.5334219 217.442318,63.0517795 206.889179,56.4677326 C216.231139,66.6902795 228.532545,73.7389425 242.074913,76.6308799 Z M176.531282,11.5707278 C176.214589,9.76190185 175.971361,7.9411627 175.80259,6.11347418 L175.80259,0 L127.968973,0 L127.968973,189.845313 C127.89253,211.974144 109.923403,229.894625 87.760818,229.894625 C81.2542071,229.894625 75.1109499,228.350869 69.6705734,225.607847 C77.0180599,235.24466 88.6195635,241.465353 101.678453,241.465353 C123.837066,241.465353 141.810164,223.546857 141.8876,201.415048 L141.8876,11.5707278 L176.531282,11.5707278 Z M99.9659254,113.580765 L99.9659254,102.811203 C95.9690357,102.265179 91.9393845,101.991175 87.9047695,101.99315 C39.3553659,101.99315 0,141.326686 0,189.845313 C0,220.263769 15.4673478,247.071522 38.9711641,262.840672 C23.4690694,247.003021 13.9176347,225.324907 13.9176347,201.414056 C13.9176347,153.513923 52.272289,114.565593 99.9659254,113.580765 Z"
                              fill="#00F2EA"
                            />
                          </g>
                        </svg>
                      ),
                      label: "TikTok",
                    },
                    telegram: {
                      icon: (
                        <svg
                          className="h-4 w-4 text-blue-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      ),
                      label: "Telegram",
                    },
                    website: {
                      icon: <LinkIcon className="w-4 h-4 text-blue-500" />,
                      label: "Website",
                    },
                    email: {
                      icon: <MailIcon className="w-4 h-4" />,
                      label: "Email",
                    },
                  }

                  const config = contactConfig[contact.type]
                  if (!config) return null

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {config.icon}
                        <div>
                          <p className="text-sm font-medium">{config.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.value}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(contact.value)
                          toast.success("Copied to clipboard")
                        }}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
