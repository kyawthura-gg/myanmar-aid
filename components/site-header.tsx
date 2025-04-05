"use client"

import { Heart, LogOutIcon, UserIcon, UsersIcon } from "lucide-react"
import Link from "next/link"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "@/lib/auth-client"
import { useSelectedLayoutSegments } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function SiteHeader() {
  const segs = useSelectedLayoutSegments()
  const isAdmin = segs?.[0] === "admin"
  const { data: session } = useSession()

  const logOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        window.location.href = "/"
      },
    })
  }

  if (isAdmin) {
    return null
  }
  return (
    <header className="border-b">
      <div className="container-wrapper flex h-16 items-center justify-between py-4 px-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg md:text-xl"
        >
          <img
            src="/logo.png"
            alt="Myanmar aid connect logo"
            className="w-5 h-auto"
          />
          <span>Myanmar Aid Connect</span>
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      {session.user.image ? (
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name || ""}
                        />
                      ) : (
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/account/campaigns">
                        <UsersIcon className="mr-2 h-4 w-4" />
                        <span>Your Need Campaigns</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logOut}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <LanguageSwitcher />
            </>
          ) : (
            <>
              <Button asChild variant="link" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/register-need-campaign">
                  Start a need campaign
                </Link>
              </Button>
              <LanguageSwitcher />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
