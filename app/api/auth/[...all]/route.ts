import { getAuth } from "@/lib/auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  console.log("BETTER_AUTH_URL", process.env.BETTER_AUTH_URL)
  const ctx = await getCloudflareContext({ async: true })
  const auth = getAuth((ctx.env as Cloudflare.Env).DB)
  return auth.handler(request)
}

export async function POST(request: NextRequest) {
  console.log("BETTER_AUTH_URL", process.env.BETTER_AUTH_URL)
  const ctx = await getCloudflareContext({ async: true })
  const auth = getAuth((ctx.env as Cloudflare.Env).DB)
  return auth.handler(request)
}
