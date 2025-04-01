"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"

export function SiteHeader() {
  const t = useTranslations("home")

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Heart className="h-6 w-6 text-primary" />
          <span>Myanmar Aid Connect</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:underline">
            How It Works
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Register</Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}

