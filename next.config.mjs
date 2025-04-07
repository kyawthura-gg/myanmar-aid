import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"
import createNextIntlPlugin from "next-intl/plugin"

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform()
}

const withNextIntl = createNextIntlPlugin("./lib/i18n/index.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default withNextIntl(nextConfig)
