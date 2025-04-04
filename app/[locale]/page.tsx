"use client"

import { Heart, ImageIcon, SearchIcon, Users, WalletIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useSession } from "@/lib/auth-client"
import { cn, getStorageFullURL } from "@/lib/utils"
import { api } from "@/trpc/react"
import { useState } from "react"

export default function Home() {
  const t = useTranslations("home")
  const [searchTerm, setSearchTerm] = useState("")
  const { data: session } = useSession()

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
      <main className="flex-1">
        <div className="max-w-3xl mx-auto text-center mb-12 py-12 md:py-24 lg:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Direct Help for Those Affected by the Myanmar Earthquake
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            100% of your support goes directly to verified individuals,
            families, and communities affected by the earthquake.
          </p>
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center mt-10",
              session?.user?.onboardingCompleted && "hidden"
            )}
          >
            <Button size="lg" asChild>
              <Link href="/register-need-campaign">Start a need campaign</Link>
            </Button>
          </div>
        </div>
        <section className="container-wrapper pb-12 md:pb-24">
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
                    <Link
                      key={campaign.id}
                      href={`/need-campaigns/${campaign.id}`}
                      className="block group"
                    >
                      <Card className="h-full overflow-hidden">
                        <div className="relative">
                          {campaign.photos?.[0] ? (
                            <img
                              src={getStorageFullURL(campaign.photos[0])}
                              alt={campaign.title}
                              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-52 bg-muted flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge
                              variant={
                                campaign.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border">
                              {campaign.user?.image ? (
                                <AvatarImage src={campaign.user.image} />
                              ) : (
                                <AvatarFallback>
                                  <Users className="h-4 w-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="space-y-1">
                              <CardTitle className="text-lg line-clamp-1">
                                {campaign.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{campaign.user?.name}</span>
                                {/* <span>•</span> */}
                                {/* <time
                                  dateTime={campaign.createdAt.toISOString()}
                                >
                                  {formatDistanceToNow(campaign.createdAt, {
                                    addSuffix: true,
                                  })}
                                </time> */}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {campaign.description}
                          </p>
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <WalletIcon className="h-4 w-4" />
                              <span>
                                {campaign.payments.length} payment methods
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{campaign.donations.length} donations</span>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
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
    </div>
  )
}
