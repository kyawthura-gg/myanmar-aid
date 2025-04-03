"use client"

import { Heart, SearchIcon, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getStorageFullURL } from "@/lib/utils"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const t = useTranslations("home")
  const [searchTerm, setSearchTerm] = useState("")

  const { data: campaigns, isLoading } = api.campaign.listActive.useQuery()

  const filteredCampaigns =
    campaigns?.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    }) ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto text-center mb-12 py-12 md:py-24 lg:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Direct Support for Myanmar Earthquake Victims
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            100% of your donation goes directly to verified families affected by
            the earthquake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button size="lg">Donate Now</Button>
            <Button size="lg" variant="outline">
              Start a fundraiser
            </Button>
          </div>
        </div>
        <section className="container pb-12 md:pb-24">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={"Search anything"}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="p-4">
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-20 bg-muted rounded mb-4" />
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded" />
                          <div className="h-2 bg-muted rounded w-3/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        {campaign.photos?.[0] ? (
                          <img
                            src={getStorageFullURL(campaign.photos[0])}
                            alt={campaign.title}
                            className="w-full h-40 object-cover"
                          />
                        ) : null}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback>
                                <Users className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">
                                {campaign.title}
                              </CardTitle>
                              {/* <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {campaign.location || "Myanmar"}
                            </div> */}
                            </div>
                          </div>
                          <Badge variant="outline">{campaign.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {campaign.description}
                        </p>
                        {/* <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Raised: ${campaign.amountRaised || 0}</span>
                          <span>Goal: ${campaign.goalAmount || 0}</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${((campaign.amountRaised || 0) / (campaign.goalAmount || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div> */}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => router.push(`/donate/${campaign.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() =>
                            router.push(`/donate/${campaign.id}?donate=true`)
                          }
                        >
                          Donate
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoading && filteredCampaigns.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t("noResults")}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Heart className="h-5 w-5 text-primary" />
            <span>Myanmar Aid Connect</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("footer")}</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
