"use client"

import Link from "next/link"

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
import { getStorageFullURL } from "@/lib/utils"
import { api } from "@/trpc/react"

import { ImageIcon, Plus, Trash } from "lucide-react"
import { toast } from "sonner"

export default function CampaignsPage() {
  const { data: campaigns, isLoading, refetch } = api.campaign.list.useQuery()
  const deleteMutation = api.campaign.delete.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "This action cannot be undone. This will permanently delete your campaign and remove all of its data from our servers."
      )
    ) {
      return
    }

    toast.promise(deleteMutation.mutateAsync(id), {
      loading: "Deleting campaign...",
      success: "Campaign deleted successfully",
      error: "Failed to delete campaign",
    })
  }

  return (
    <div className="container-wrapper py-6 sm:py-10 min-h-[80dvh] px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Campaigns
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your fundraising campaigns
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/account/campaigns/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : campaigns?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="h-full overflow-hidden block group"
            >
              <div className="relative">
                {campaign.photos?.[0] ? (
                  <img
                    src={getStorageFullURL(JSON.parse(campaign.photos)[0])}
                    alt={campaign.title}
                    className="w-full h-40 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-52 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  variant={
                    campaign.status === "active"
                      ? "default"
                      : campaign.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                  className="capitalize absolute top-2 right-2"
                >
                  {campaign.status}
                </Badge>
              </div>
              <CardContent>
                <CardTitle className="mb-2">{campaign.title}</CardTitle>
                <p className="line-clamp-3 text-sm sm:text-base text-muted-foreground">
                  {campaign.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href={`/account/campaigns/${campaign.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href={`/account/campaigns/${campaign.id}/edit`}>
                    Edit
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  className="w-full sm:w-auto ml-auto"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4 sm:p-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              No campaigns yet
            </CardTitle>
            <CardDescription className="text-sm">
              Create your first campaign to start raising funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/account/campaigns/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
