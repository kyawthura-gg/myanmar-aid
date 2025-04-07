import { getRequestContext } from "@cloudflare/next-on-pages"

import { PrismaD1 } from "@prisma/adapter-d1"
import { PrismaClient } from "@prisma/client"

export const getDB = () => {
  const ctx = getRequestContext()
  const adapter = new PrismaD1((ctx.env as any).DB)
  return new PrismaClient({ adapter })
}
