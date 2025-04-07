import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { getAuthSession } from "@/lib/auth"
import { getStorageFullURL } from "@/lib/utils"
import { UserIcon } from "lucide-react"
import { EditProfile } from "./edit-profile"

export const runtime = "edge"

export default async function ProfilePage() {
  const data = await getAuthSession()

  const user = data?.user

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending Verification</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  if (!user) {
    return (
      <div className="container-wrapper mx-3 py-10 min-h-[78dvh]">
        <div>User not found</div>
      </div>
    )
  }

  return (
    <div className="container-wrapper mx-3 py-10 min-h-[78dvh] px-3">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              {user.image ? (
                <AvatarImage
                  src={
                    user.image.startsWith("/")
                      ? getStorageFullURL(user.image)
                      : user.image
                  }
                  alt=""
                />
              ) : (
                <AvatarFallback>
                  <UserIcon className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <EditProfile image={user.image} name={user.name} />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Email Address</Label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <p className="text-sm">{user.email}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Your email address is used for login and notifications.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Account Status</Label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <p className="text-sm flex items-center gap-2">
                  Status: {getStatusBadge(user.status!)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Your account status determines what actions you can perform.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Account Type</Label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <p className="text-sm">
                  {user.accountType === "org" ? "Organization" : "Individual"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
