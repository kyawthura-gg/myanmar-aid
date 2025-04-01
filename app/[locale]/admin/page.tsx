"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, Search, ShieldAlert, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for pending verifications
const pendingVerifications = [
  {
    id: "v1",
    name: "Kyaw Kyaw",
    location: "Yangon",
    submittedAt: "2025-03-28T14:30:00Z",
    type: "Family Registration",
    status: "pending",
  },
  {
    id: "v2",
    name: "Ma Hla",
    location: "Mandalay",
    submittedAt: "2025-03-28T10:15:00Z",
    type: "Family Registration",
    status: "pending",
  },
  {
    id: "v3",
    name: "U Aung",
    location: "Bago",
    submittedAt: "2025-03-27T16:45:00Z",
    type: "Donation Confirmation",
    status: "pending",
  },
]

// Mock data for donation verifications
const donationVerifications = [
  {
    id: "d1",
    donor: "John Smith",
    recipient: "Kyaw Family",
    amount: 150,
    date: "2025-03-28T09:20:00Z",
    status: "pending",
  },
  {
    id: "d2",
    donor: "Sarah Johnson",
    recipient: "Min Family",
    amount: 200,
    date: "2025-03-27T14:10:00Z",
    status: "pending",
  },
]

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<
    string | null
  >(null)
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null)

  const filteredVerifications = pendingVerifications.filter(
    (verification) =>
      verification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedVerificationData = pendingVerifications.find(
    (v) => v.id === selectedVerification
  )
  const selectedDonationData = donationVerifications.find(
    (d) => d.id === selectedDonation
  )

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Verify registrations and donations
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to Site</Link>
        </Button>
      </div>

      <Tabs defaultValue="verifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
          <TabsTrigger value="donations">Donation Verifications</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search verifications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-md">
                {filteredVerifications.length > 0 ? (
                  <div className="divide-y">
                    {filteredVerifications.map((verification) => (
                      <div
                        key={verification.id}
                        className={`p-3 cursor-pointer hover:bg-muted ${selectedVerification === verification.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedVerification(verification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {verification.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {verification.location}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{verification.type}</span>
                          <span>
                            {new Date(
                              verification.submittedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No pending verifications match your search.
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedVerificationData ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedVerificationData.name}</CardTitle>
                        <CardDescription>
                          {selectedVerificationData.type} -{" "}
                          {selectedVerificationData.location}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Personal Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Full Name:
                            </span>
                            <span className="col-span-2">
                              {selectedVerificationData.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <span className="col-span-2">
                              {selectedVerificationData.location}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Phone:
                            </span>
                            <span className="col-span-2">
                              +95 9 123 456 789
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Family Size:
                            </span>
                            <span className="col-span-2">5 members</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Verification Documents
                        </h3>
                        <div className="space-y-2">
                          <div className="border rounded p-2 flex items-center justify-between">
                            <span className="text-sm">ID Document</span>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                          <div className="border rounded p-2 flex items-center justify-between">
                            <span className="text-sm">
                              Location Verification
                            </span>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Situation Description
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our family of 5 lost our home in the earthquake. We are
                        currently staying in a temporary shelter made of
                        tarpaulin. We need assistance with building materials to
                        construct a more stable shelter before the rainy season.
                        We also need food supplies as I have lost my job at the
                        local market which was destroyed.
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Admin Notes</h3>
                      <Textarea
                        placeholder="Add verification notes here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="destructive">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline">Request More Info</Button>
                    </div>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center border rounded-lg p-8">
                  <div className="text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      No Verification Selected
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Select a verification request from the list to review it.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search donations..."
                  className="pl-8"
                />
              </div>

              <div className="border rounded-md">
                <div className="divide-y">
                  {donationVerifications.map((donation) => (
                    <div
                      key={donation.id}
                      className={`p-3 cursor-pointer hover:bg-muted ${selectedDonation === donation.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedDonation(donation.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            ${donation.amount} Donation
                          </div>
                          <div className="text-sm text-muted-foreground">
                            To: {donation.recipient}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>From: {donation.donor}</span>
                        <span>
                          {new Date(donation.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedDonationData ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          ${selectedDonationData.amount} Donation
                        </CardTitle>
                        <CardDescription>
                          From {selectedDonationData.donor} to{" "}
                          {selectedDonationData.recipient}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Donation Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Amount:
                            </span>
                            <span className="col-span-2">
                              ${selectedDonationData.amount}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="col-span-2">
                              {new Date(
                                selectedDonationData.date
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Donor:
                            </span>
                            <span className="col-span-2">
                              {selectedDonationData.donor}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Recipient:
                            </span>
                            <span className="col-span-2">
                              {selectedDonationData.recipient}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Payment Method:
                            </span>
                            <span className="col-span-2">Bank Transfer</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Proof of Payment
                        </h3>
                        <div className="border rounded-lg p-4 text-center">
                          <div className="bg-muted aspect-video rounded flex items-center justify-center mb-2">
                            <Button variant="ghost">View Receipt</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Transaction ID: TRX123456789
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">
                        Verification Status
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="admin-verified">
                            Admin Verification:
                          </Label>
                          <Select defaultValue="pending">
                            <SelectTrigger
                              id="admin-verified"
                              className="w-[180px]"
                            >
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label htmlFor="recipient-confirmed">
                            Recipient Confirmation:
                          </Label>
                          <Select defaultValue="pending">
                            <SelectTrigger
                              id="recipient-confirmed"
                              className="w-[180px]"
                            >
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="disputed">Disputed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Admin Notes</h3>
                      <Textarea
                        placeholder="Add verification notes here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="destructive">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Flag as Suspicious
                      </Button>
                      <Button variant="outline">Contact Donor</Button>
                    </div>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Donation
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center border rounded-lg p-8">
                  <div className="text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      No Donation Selected
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Select a donation from the list to review it.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
