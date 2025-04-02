import { inter, notoSansMyanmar } from "@/lib/fonts"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import type React from "react"
import "@/app/globals.css"
import { api } from "@/trpc/server"

export const metadata: Metadata = {
  title: "Myanmar Aid Connect",
  description:
    "Direct peer-to-peer aid platform for Myanmar earthquake victims",
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
  const hello = await api.post.hello({ text: "World" })
  console.log({ hello })
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
