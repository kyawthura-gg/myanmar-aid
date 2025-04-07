import { getRequestContext } from "@cloudflare/next-on-pages"
import { Kysely } from "kysely"
import { D1Dialect } from "kysely-d1"

export const runtime = "edge"

function initDbConnectionDev() {
  const { env } = getRequestContext()
  return new D1Dialect({
    database: (env as { DB: D1Database }).DB,
  })
}

function initDbConnection() {
  return new D1Dialect({
    //@ts-expect-error
    database: process.env.DB,
  })
}

export const authDB = new Kysely({
  dialect:
    process.env.NODE_ENV === "development"
      ? initDbConnectionDev()
      : initDbConnection(),
})
