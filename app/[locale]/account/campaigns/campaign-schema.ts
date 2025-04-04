import { z } from "zod"

export const contactTypeList = [
  "phone",
  "viber",
  "facebook",
  "instagram",
  "tiktok",
  "whatsapp",
  "telegram",
] as const

export const paymentMethodSchema = z.object({
  methodType: z.enum(["bank", "crypto", "mobilepayment", "link"]),
  country: z.string({
    required_error: "Please select a country",
  }),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  cryptoAddress: z.string().optional(),
  mobileNumber: z.string().optional(),
  accountBankName: z.string().optional(),
  mobileProvider: z.string().optional(),
  link: z.string().optional(),
})

export const contactSchema = z
  .array(
    z.object({
      type: z.enum(contactTypeList),
      value: z.string().min(1, "Invalid contact method"),
    })
  )
  .min(1, {
    message: "At least one contact method is required",
  })

// Base schema shared between client and server
const baseCampaignSchema = {
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  regionCode: z.string().min(2, "Invalid region"),
  townshipCode: z.string().min(2, "Invalid township"),
  categories: z.string().array().min(1, "At least one category is required"),
  contactMethods: contactSchema,
  payments: z
    .array(paymentMethodSchema)
    .min(1, "At least one payment method is required"),
}

// Client-side schema (for forms)
export const campaignFormSchema = z.object({
  ...baseCampaignSchema,
  photos: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one photo is required")
    .max(6, "Maximum 6 photos allowed"),
})

export const campaignServerSchema = z.object({
  ...baseCampaignSchema,
  photos: z
    .array(z.string())
    .min(1)
    .transform((photos) => JSON.stringify(photos)),
  categories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .transform((categories) => JSON.stringify(categories)),
  contactMethods: contactSchema.transform((contacts) =>
    JSON.stringify(contacts)
  ),
})

export type CampaignFormValues = z.infer<typeof campaignFormSchema>
export type CampaignServerValues = z.infer<typeof campaignServerSchema>
