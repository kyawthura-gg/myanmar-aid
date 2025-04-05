"use client"

import {
  Heart,
  ImageIcon,
  SearchIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
        <div className="max-w-3xl mx-auto text-center mb-8 px-4 py-8 md:mb-12 md:py-16 lg:py-24">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Help People Affected by the Myanmar Earthquake
          </h1>
          <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Every donation goes straight to real people in need — families,
            communities, and individuals affected by the earthquake.
          </p>
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-3 justify-center mt-8 md:mt-10",
              session?.user?.onboardingCompleted && "hidden"
            )}
          >
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/register-need-campaign">Start a need campaign</Link>
            </Button>
          </div>
        </div>
        <section className="container-wrapper px-4 sm:px-6 pb-8 md:pb-16">
          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Give Help Directly. Make a Real Difference.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Help goes directly to people who need it — fully verified and
                transparent. No middlemen.
              </p>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search ..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card
                      key={i}
                      className="animate-pulse h-full overflow-hidden"
                    >
                      {/* Image placeholder */}
                      <div className="w-full h-40 sm:h-52 bg-muted" />

                      {/* Header with avatar and title */}
                      <CardHeader className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted" />
                          <div className="space-y-2 flex-1">
                            <div className="h-5 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      </CardHeader>

                      {/* Description */}
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                        </div>
                      </CardContent>

                      {/* Footer with stats */}
                      <CardFooter className="p-4 pt-0">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-muted rounded w-24" />
                          <div className="h-4 bg-muted rounded w-20" />
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                              className="w-full h-40 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-40 sm:h-52 bg-muted flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <CardHeader className="p-4">
                          <CardTitle className="text-lg sm:text-xl line-clamp-2 mb-2">
                            {campaign.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {campaign.description}
                          </p>
                        </CardHeader>

                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-6 w-6 border">
                              {campaign.user?.image ? (
                                <AvatarImage src={campaign.user.image} />
                              ) : (
                                <AvatarFallback>
                                  <UserIcon className="h-3 w-3" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {campaign.user?.name}
                            </span>
                          </div>
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
                  <p className="text-muted-foreground">No result</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
