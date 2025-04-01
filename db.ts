import { getCloudflareContext } from "@opennextjs/cloudflare"
import { PrismaD1 } from "@prisma/adapter-d1"
import { PrismaClient } from "@prisma/client"

export const getDB = async () => {
	const ctx = await getCloudflareContext({ async: true })
	const adapter = new PrismaD1((ctx.env as Cloudflare.Env).DB)
	return new PrismaClient({ adapter })
}
