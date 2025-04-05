"use client"

import { Plus } from "lucide-react"
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
import { api } from "@/trpc/react"

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = api.campaign.list.useQuery()

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
            <Card key={campaign.id}>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      {campaign.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Created on{" "}
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      campaign.status === "active"
                        ? "default"
                        : campaign.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="capitalize self-start"
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="line-clamp-3 text-sm sm:text-base text-muted-foreground">
                  {campaign.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
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
