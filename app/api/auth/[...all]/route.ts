import { getAuth } from "@/lib/auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const ctx = await getCloudflareContext({ async: true })
  const auth = getAuth(ctx.env.DB)
  return auth.handler(request)
}

export async function POST(request: NextRequest) {
  const ctx = await getCloudflareContext({ async: true })
  const auth = getAuth(ctx.env.DB)
  return auth.handler(request)
}
