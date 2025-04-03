"use client"

import { Plus } from "lucide-react"
import Link from "next/link"

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
  // const { data: campaigns, isLoading } = api.campaign.campaignListForAdmin.useQuery({status: "pending"});

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your fundraising campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription>
                  Created on {new Date(campaign.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  {campaign.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/campaigns/${campaign.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No campaigns yet</CardTitle>
            <CardDescription>
              Create your first campaign to start raising funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/campaigns/create">
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
