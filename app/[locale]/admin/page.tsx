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
import { getStorageFullURL } from "@/lib/utils"
import { api } from "@/trpc/react"
import { CheckCircle, Clock, Search, ShieldAlert, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export const runtime = "edge"

export default function AdminPage() {
  const [serachUserText, setSearchUserText] = useState("")
  const [filteredUserList, setFilteredUserList] = useState<any>([])
  const [verificationsStatus, setVerificationStatus] = useState<any>("pending") // this status is for to filter list of the api data
  const [dontationStatus, setDonationStatus] = useState<any>("pending") // this status is for to filter list of the api data
  const [adminNotes, setAdminNotes] = useState("")
  const [donationVerificationStatus, setDonationVerificationStatus] =
    useState<any>("pending")
  const [selectedDonation, setSelectedDonation] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const { data: campaigns, refetch } = api.campaign.listForAdmin.useQuery({
    status: verificationsStatus,
  })
  const { data: users, refetch: refetchUsers } =
    api.user.userListForAdmin.useQuery()

  const updateCampaignMutation = api.campaign.updateStatus.useMutation()
  const updateUserStatusMutation = api.user.updateUserStatus.useMutation()
  const { data: donation, refetch: refetchDonation } =
    api.donation.donationForAdmin.useQuery({ status: dontationStatus })
  const updateDonationMutation = api.donation.updateDonationStatus.useMutation()

  async function handleUserStatusUpdate(status: "active" | "rejected") {
    await updateUserStatusMutation.mutateAsync({
      status,
      id: selectedUser.id,
    })
    refetchUsers()
  }

  async function handleUpdateStatus(status: "active" | "rejected") {
    await updateCampaignMutation.mutateAsync({
      status,
      id: selectedVerification.id,
    })
    refetch()
  }

  async function handleUpdateDonationMutation() {
    await updateDonationMutation.mutateAsync({
      status: donationVerificationStatus,
      id: selectedDonation.id,
      adminNote: adminNotes,
    })
    refetchDonation()
    setSelectedDonation(null)
  }

  async function handleFlagAsSuspicious() {
    await updateDonationMutation.mutateAsync({
      status: "rejected",
      id: selectedDonation.id,
      adminNote: adminNotes,
    })
    refetchDonation()
    setSelectedDonation(null)
  }
  const [searchTerm, setSearchTerm] = useState("")

  const handleAdminVerificationChange = (value: any) => {
    setDonationVerificationStatus(value)
  }

  const handleVerificatoinStatusChange = (status: string) => {
    setVerificationStatus(status)
  }

  const handleDonationStatusChange = (status: string) => {
    setDonationStatus(status)
  }

  const searchUser = (searchText: string) => {
    const inputText = searchText
    setSearchUserText(inputText)
    if (inputText === "") {
      return setFilteredUserList(users)
    } else {
      const results = users
        ? users.filter((item: any) => item.name.includes(inputText))
        : []
      return setFilteredUserList(results)
    }
  }

  useEffect(() => {
    users ? setFilteredUserList(users) : setFilteredUserList([])
  }, [users])

  return (
    <div className="container-wrapper py-10">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verifications">Campaign</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="users">User</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-[20px]">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search verifications..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={verificationsStatus}
                  onValueChange={handleVerificatoinStatusChange}
                >
                  <SelectTrigger id="admin-verified" className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md">
                {campaigns ? (
                  <div className="divide-y">
                    {campaigns.map((verification: any) => (
                      <div
                        key={verification.id}
                        className={`p-3 cursor-pointer hover:bg-muted ${selectedVerification === verification.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedVerification(verification)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {verification.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {verification.description}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            <span>{verification.status}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{verification.type}</span>
                          <span>
                            {new Date(
                              verification.createdAt
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
              {selectedVerification ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedVerification.name}</CardTitle>
                        <CardDescription>
                          {selectedVerification.type} -{" "}
                          {selectedVerification.location}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{selectedVerification.user.status}</span>
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
                              {selectedVerification.user.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <span className="col-span-2">
                              {selectedVerification.region.nameEn +
                                ", " +
                                selectedVerification.township.nameEn}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Phone:
                            </span>
                            <span className="col-span-2">
                              {selectedVerification.user.phone}
                            </span>
                          </div>
                          {/* <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Family Size:
                            </span>
                            <span className="col-span-2">5 members</span>
                          </div> */}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Photos</h3>
                        <div className="space-y-2">
                          {JSON.parse(selectedVerification.photos).map(
                            (photo: any, index: number) => (
                              <div
                                key={index}
                                className="border rounded p-2 flex items-center justify-between"
                              >
                                <span className="text-sm">
                                  Photo {index + 1}
                                </span>
                                <Button
                                  onClick={() => {
                                    window.open(getStorageFullURL(photo))
                                  }}
                                  variant="ghost"
                                  size="sm"
                                >
                                  View
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Situation Description
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedVerification.description}
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
                      <Button
                        onClick={() => {
                          handleUpdateStatus("rejected")
                        }}
                        variant="destructive"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline">Request More Info</Button>
                    </div>
                    <Button
                      onClick={() => {
                        handleUpdateStatus("active")
                      }}
                    >
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
              <div className="flex items-center gap-[20px]">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search donations..."
                    className="pl-8"
                  />
                </div>
                <Select
                  value={dontationStatus}
                  onValueChange={handleDonationStatusChange}
                >
                  <SelectTrigger id="admin-verified" className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md">
                <div className="divide-y">
                  {donation
                    ? donation.map((donation: any) => (
                        <div
                          key={donation.id}
                          className={`p-3 cursor-pointer hover:bg-muted ${selectedDonation === donation.id ? "bg-muted" : ""}`}
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                ${donation.amount} Donation
                              </div>
                              <div className="text-sm text-muted-foreground">
                                To: {donation.campaign.title}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              <span>{donation.status}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                            <span>From: {donation.donorName}</span>
                            <span>
                              {new Date(
                                donation.donatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedDonation ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          ${selectedDonation.amount} Donation
                        </CardTitle>
                        <CardDescription>
                          From {selectedDonation.donor} to{" "}
                          {selectedDonation.recipient}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{selectedDonation.status}</span>
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
                              ${selectedDonation.amount}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="col-span-2">
                              {new Date(
                                selectedDonation.donatedAt
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Donor:
                            </span>
                            <span className="col-span-2">
                              {selectedDonation.donorName}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Recipient:
                            </span>
                            <span className="col-span-2">
                              {selectedDonation.campaign.user.name}
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
                          <Select
                            value={donationVerificationStatus}
                            onValueChange={handleAdminVerificationChange}
                          >
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

                        {/* <div className="flex items-center gap-2">
                          <Label htmlFor="recipient-confirmed">
                            Recipient Confirmation:
                          </Label>
                          <Select value={recipientConfirmationStatus} onValueChange={handleRecipientConfirmationChange}>
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
                        </div> */}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Admin Notes</h3>
                      <Textarea
                        onChange={(e: any) => setAdminNotes(e.target.value)}
                        value={adminNotes}
                        placeholder="Add verification notes here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleFlagAsSuspicious}
                        variant="destructive"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Flag as Suspicious
                      </Button>
                      <Button variant="outline">Contact Donor</Button>
                    </div>
                    <Button onClick={handleUpdateDonationMutation}>
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

        <TabsContent value="users" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-[20px]">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={serachUserText}
                    onChange={(e: any) => searchUser(e.target.value)}
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                  />
                </div>
                <Select
                  value={dontationStatus}
                  onValueChange={handleDonationStatusChange}
                >
                  <SelectTrigger id="admin-verified" className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md">
                <div className="divide-y">
                  {users
                    ? filteredUserList.map((user: any) => (
                        <div
                          key={user.id}
                          className={`p-3 cursor-pointer hover:bg-muted 
                            `}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              <span>{user.status}</span>
                            </Badge>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedUser ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedUser.name}</CardTitle>
                        {/* <CardDescription>
                          From {selectedUser.name} to{" "}
                          {selectedUser.name}
                        </CardDescription> */}
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{selectedUser.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          User Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Fullname:
                            </span>
                            <span className="col-span-2">
                              {selectedUser.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <span className="col-span-2">
                              {selectedUser.email}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Phone:
                            </span>
                            <span className="col-span-2">
                              {selectedUser.phone}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Facebook:
                            </span>
                            <span className="col-span-2">
                              {selectedUser.socialLink}
                            </span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="text-muted-foreground">
                              Account type:
                            </span>
                            <span className="col-span-2">
                              {selectedUser.accountType === "org"
                                ? "Organization"
                                : "Individual"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">User photo</h3>
                        <div className="border rounded-lg p-4 text-center">
                          <div className="bg-muted aspect-video rounded flex items-center justify-center mb-2">
                            <Button variant="ghost">View user photo</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          handleUserStatusUpdate("rejected")
                        }}
                        variant="destructive"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      {/* <Button variant="outline">Contact Donor</Button> */}
                    </div>
                    <Button
                      onClick={() => {
                        handleUserStatusUpdate("active")
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
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
