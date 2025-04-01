"use client"

import { SiteHeader } from "@/components/site-header"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building,
  Filter,
  MapPin,
  SearchIcon,
  User,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock data for recipients
const recipients = [
  {
    id: "1",
    name: "Aung Family",
    type: "family",
    location: "Yangon",
    members: 5,
    needs: ["Shelter", "Food"],
    story: "Lost home in earthquake, currently staying in temporary shelter.",
    amountNeeded: 500,
    amountRaised: 320,
  },
  {
    id: "2",
    name: "Min Family",
    type: "family",
    location: "Mandalay",
    members: 3,
    needs: ["Medical", "Food"],
    story: "Medical needs for injured child, food supplies running low.",
    amountNeeded: 350,
    amountRaised: 150,
  },
  {
    id: "3",
    name: "Thiri Family",
    type: "family",
    location: "Bago",
    members: 7,
    needs: ["Shelter", "Water"],
    story:
      "Large family with elderly members, need shelter materials urgently.",
    amountNeeded: 600,
    amountRaised: 200,
  },
  {
    id: "4",
    name: "Kyaw Family",
    type: "family",
    location: "Yangon",
    members: 4,
    needs: ["Food", "Children's Supplies"],
    story: "Family with two young children needs food and supplies.",
    amountNeeded: 400,
    amountRaised: 280,
  },
  {
    id: "5",
    name: "Ma Hla",
    type: "individual",
    location: "Yangon",
    members: 1,
    needs: ["Medical", "Food"],
    story:
      "Elderly woman with medical conditions who lost her home in the earthquake.",
    amountNeeded: 300,
    amountRaised: 120,
  },
  {
    id: "6",
    name: "U Myint",
    type: "individual",
    location: "Mandalay",
    members: 1,
    needs: ["Shelter", "Medical"],
    story:
      "Disabled individual who needs assistance with temporary housing and medical supplies.",
    amountNeeded: 250,
    amountRaised: 100,
  },
  {
    id: "7",
    name: "Yangon Relief Center",
    type: "organization",
    location: "Yangon",
    members: 0,
    needs: ["Food", "Medical", "Shelter"],
    story:
      "Local organization providing immediate relief to 50+ families in the Yangon area.",
    amountNeeded: 2000,
    amountRaised: 800,
  },
  {
    id: "8",
    name: "Mandalay Community Aid",
    type: "organization",
    location: "Mandalay",
    members: 0,
    needs: ["Water", "Food", "Children's Supplies"],
    story:
      "Community-based organization distributing clean water and food to affected neighborhoods.",
    amountNeeded: 1500,
    amountRaised: 600,
  },
]

export default function DonatePage() {
  const t = useTranslations("donate")
  const common = useTranslations("common")
  const recipientTypes = useTranslations("recipientTypes")

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null
  )
  const [donationAmount, setDonationAmount] = useState(100)
  const [activeTab, setActiveTab] = useState("browse")
  const [recipientTypeFilter, setRecipientTypeFilter] = useState<string>("all")

  const filteredRecipients = recipients.filter((recipient) => {
    // Filter by search term
    const matchesSearch =
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.needs.some((need) =>
        need.toLowerCase().includes(searchTerm.toLowerCase())
      )

    // Filter by recipient type
    const matchesType =
      recipientTypeFilter === "all" || recipient.type === recipientTypeFilter

    return matchesSearch && matchesType
  })

  const selectedRecipientData = recipients.find(
    (recipient) => recipient.id === selectedRecipient
  )

  const handleViewDetails = (id: string) => {
    router.push(`/donate/${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {common("backToHome")}
        </Link>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <Tabs
            defaultValue="browse"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">{t("browseRecipients")}</TabsTrigger>
              <TabsTrigger value="donate" disabled={!selectedRecipient}>
                {t("makeDonation")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, location, or needs..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={recipientTypeFilter}
                      onValueChange={setRecipientTypeFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Recipient Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Recipients</SelectItem>
                        <SelectItem value="family">Families</SelectItem>
                        <SelectItem value="individual">Individuals</SelectItem>
                        <SelectItem value="organization">
                          Organizations
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRecipients.map((recipient) => (
                    <Card
                      key={recipient.id}
                      className={`overflow-hidden ${
                        selectedRecipient === recipient.id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback>
                                {recipient.type === "family" && (
                                  <Users className="h-4 w-4" />
                                )}
                                {recipient.type === "individual" && (
                                  <User className="h-4 w-4" />
                                )}
                                {recipient.type === "organization" && (
                                  <Building className="h-4 w-4" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">
                                {recipient.name}
                              </CardTitle>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {recipient.location}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {recipient.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {recipient.needs.map((need, i) => (
                            <Badge key={i} variant="secondary">
                              {need}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {recipient.story}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Raised: ${recipient.amountRaised}</span>
                            <span>Goal: ${recipient.amountNeeded}</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${
                                  (recipient.amountRaised /
                                    recipient.amountNeeded) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(recipient.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setSelectedRecipient(recipient.id)
                            setActiveTab("donate")
                          }}
                        >
                          Donate
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredRecipients.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No recipients match your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="donate" className="mt-6">
              {selectedRecipientData && (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recipient Information</CardTitle>
                      <CardDescription>
                        You are donating to the following recipient
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-xl">
                            {selectedRecipientData.type === "family" && (
                              <Users className="h-6 w-6" />
                            )}
                            {selectedRecipientData.type === "individual" && (
                              <User className="h-6 w-6" />
                            )}
                            {selectedRecipientData.type === "organization" && (
                              <Building className="h-6 w-6" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedRecipientData.name}
                          </h3>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {selectedRecipientData.location}
                          </div>
                          {selectedRecipientData.type !== "organization" && (
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              {selectedRecipientData.members}{" "}
                              {selectedRecipientData.type === "family"
                                ? "family members"
                                : "person"}
                            </div>
                          )}
                          <Badge variant="outline" className="mt-1 capitalize">
                            {selectedRecipientData.type}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Needs</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedRecipientData.needs.map((need, i) => (
                            <Badge key={i} variant="secondary">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Their Story</h4>
                        <p className="text-muted-foreground">
                          {selectedRecipientData.story}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Funding Progress</h4>
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            Raised: ${selectedRecipientData.amountRaised}
                          </span>
                          <span>
                            Goal: ${selectedRecipientData.amountNeeded}
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${
                                (selectedRecipientData.amountRaised /
                                  selectedRecipientData.amountNeeded) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Make Your Donation</CardTitle>
                      <CardDescription>
                        100% of your donation goes directly to the recipient
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Donation Amount</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            variant={
                              donationAmount === 50 ? "default" : "outline"
                            }
                            onClick={() => setDonationAmount(50)}
                          >
                            $50
                          </Button>
                          <Button
                            variant={
                              donationAmount === 100 ? "default" : "outline"
                            }
                            onClick={() => setDonationAmount(100)}
                          >
                            $100
                          </Button>
                          <Button
                            variant={
                              donationAmount === 200 ? "default" : "outline"
                            }
                            onClick={() => setDonationAmount(200)}
                          >
                            $200
                          </Button>
                        </div>
                        <div className="pt-2">
                          <Label htmlFor="custom-amount">Custom Amount</Label>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                              id="custom-amount"
                              type="number"
                              value={donationAmount}
                              onChange={(e) =>
                                setDonationAmount(Number(e.target.value))
                              }
                              min={1}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select defaultValue="bank">
                          <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="mobile">Mobile Money</SelectItem>
                            <SelectItem value="crypto">
                              Cryptocurrency
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email for receipt"
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll send you payment instructions and a receipt.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button className="w-full">Proceed to Payment</Button>
                      <p className="text-xs text-center text-muted-foreground">
                        After payment, you'll be asked to upload proof of
                        transaction. The recipient will confirm receipt of
                        funds.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
