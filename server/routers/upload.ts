import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { nanoid } from "nanoid"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_END_POINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
})

const folders = ["/campaigns/"] as const

export const uploadRouter = createTRPCRouter({
  getSignedURLS: protectedProcedure
    .input(
      z.object({
        prefix: z.enum(folders).optional(),
        fileFormats: z.string().array().min(1, "Required"),
      })
    )
    .mutation(async ({ input }) => {
      const { fileFormats, prefix = "/" } = input
      const urls = await Promise.all(
        fileFormats.map(async (fileFormat) => {
          const key = `${prefix}${nanoid()}.${fileFormat}`
          const url = await getSignedUrl(
            r2,
            new PutObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
            })
          )
          return {
            url,
            key,
          }
        })
      )
      return urls
    }),
  getSingedURL: protectedProcedure
    .input(
      z.object({
        prefix: z.enum(folders).optional(),
        fileFormat: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { fileFormat, prefix = "/" } = input

      const key = `${prefix}${nanoid()}.${fileFormat}`
      const url = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
        }),
        {
          expiresIn: 3600,
        }
      )
      return {
        url,
        key,
      }
    }),
})
