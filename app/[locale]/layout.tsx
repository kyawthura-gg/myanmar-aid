import { inter, notoSansMyanmar } from "@/lib/fonts"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import type React from "react"
import "@/app/globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/react"

export const metadata: Metadata = {
  metadataBase: new URL("https://mmaidconnect.com"),
  title: {
    default: "Myanmar Aid Connect",
    template: "%s | Myanmar Aid Connect",
  },
  description:
    "A platform built for Myanmar — where people ask for help, and others can give.",
  keywords: [
    "myanmar",
    "earthquake",
    "aid",
    "donations",
    "help",
    "direct aid",
    "peer-to-peer",
  ],
  authors: [{ name: "Myanmar Aid Connect" }],
  creator: "Myanmar Aid Connect",
  publisher: "Myanmar Aid Connect",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "my_MM",
    title: "Myanmar Aid Connect",
    description:
      "A platform built for Myanmar — where people ask for help, and others can give.",
    siteName: "Myanmar Aid Connect",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Myanmar Aid Connect - Direct Aid Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myanmar Aid Connect",
    description:
      "A platform built for Myanmar — where people ask for help, and others can give.",
    images: ["/opengraph-image.png"],
  },
}

const locales = ["en", "mm"]

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = (await params).locale
  if (!locales.includes(locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`@/lib/i18n/locales/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${notoSansMyanmar.variable} font-sans`}
      >
        <TRPCReactProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </NextIntlClientProvider>
        </TRPCReactProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
