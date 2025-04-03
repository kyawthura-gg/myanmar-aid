"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, XIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CountryDropdown } from "@/components/ui/country-dropdown"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/trpc/react"
import mime from "mime-types"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  photos: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required")
    .max(6, "Maximum 6 photos allowed"),
  facebookLink: z.string().url().optional(),
  viberLink: z.string().optional(),
  payments: z
    .array(
      z.object({
        methodType: z.enum(["bank", "crypto", "mobilepayment", "link"]),
        country: z.string({
          required_error: "Please select a country",
        }),
        accountName: z.string().optional(),
        accountNumber: z.string().optional(),
        cryptoAddress: z.string().optional(),
        mobileNumber: z.string().optional(),
        iban: z.string().optional(),
        swiftCode: z.string().optional(),
        routingNumber: z.string().optional(),
        mobileProvider: z.string().optional(),
        link: z.string().optional(),
      })
    )
    .min(1, "At least one payment method is required"),
})

export default function CreateCampaignPage() {
  const router = useRouter()
  const createMutation = api.campaign.create.useMutation()
  const uploadMutation = api.upload.getSignedURLS.useMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photos: [],
      payments: [{ methodType: "bank", country: "Myanmar" }],
    },
  })

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control: form.control,
    name: "payments",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const photos = values.photos
      const fileFormats = photos
        .map((photo) => mime.extension(photo.type))
        .filter(Boolean) as string[]

      const signedURLS = await uploadMutation.mutateAsync({
        fileFormats,
        prefix: "/campaigns/",
      })
      const uploadedImages = await Promise.all(
        Array.from(photos).map(async (file, i) => {
          const signed = signedURLS?.[i]
          const responseUpload = await fetch(signed.url, {
            method: "PUT",
            body: file,
          })
          if (!responseUpload.ok) {
            throw new Error("something went wrong while upload")
          }
          return signed.key
        })
      )

      await createMutation.mutateAsync({ ...values, photos: uploadedImages })
      toast.success("Campaign created successfully!")
      router.push("/campaigns")
    } catch (error) {
      toast.error("Failed to create campaign")
    }
  }

  // if (!session?.user) {
  //   router.push("/auth/signin")
  //   return null
  // }

  return (
    <div className="container max-w-3xl py-10">
      <Link
        href="/campaigns"
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaigns
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
          <CardDescription>
            Share your story and set up donation methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? [])
                            field.onChange([...field.value, ...files])
                          }}
                        />

                        {field.value.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {field.value.map((file: File, i: number) => (
                              <div key={i} className="relative aspect-square">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${i + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                {i === 0 && (
                                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                                    Primary Photo
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFiles = [...field.value]
                                    newFiles.splice(i, 1)
                                    field.onChange(newFiles)
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <XIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendPayment({ methodType: "bank", country: "Myanmar" })
                    }
                  >
                    + Add More Payment
                  </Button>
                </div>
                {paymentFields.map((field, index) => {
                  const fieldMethodType = form.watch(
                    `payments.${index}.methodType`
                  )
                  return (
                    <div
                      key={field.id}
                      className="space-y-4 p-4 border rounded-lg"
                    >
                      <FormField
                        control={form.control}
                        name={`payments.${index}.methodType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bank">
                                  Bank Transfer
                                </SelectItem>
                                <SelectItem value="mobilepayment">
                                  Mobile Payment
                                </SelectItem>
                                <SelectItem value="link">
                                  Fundraiser Link
                                </SelectItem>
                                <SelectItem value="crypto">
                                  Cryptocurrency
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {(fieldMethodType === "bank" ||
                        fieldMethodType === "mobilepayment") && (
                        <FormField
                          control={form.control}
                          name={`payments.${index}.country`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Country</FormLabel>
                              <CountryDropdown
                                placeholder="Country"
                                defaultValue={field.value}
                                onChange={(country) => {
                                  field.onChange(country.name)
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Conditional fields based on payment method type */}
                      {fieldMethodType === "bank" && (
                        <>
                          <FormField
                            control={form.control}
                            name={`payments.${index}.accountName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`payments.${index}.accountNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {fieldMethodType === "crypto" && (
                        <>
                          <FormField
                            control={form.control}
                            name={`payments.${index}.cryptoAddress`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Wallet Address</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="0x..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {fieldMethodType === "mobilepayment" && (
                        <>
                          <FormField
                            control={form.control}
                            name={`payments.${index}.mobileProvider`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormLabel>Mobile Provider</FormLabel>
                                <Select
                                  onValueChange={formField.onChange}
                                  defaultValue={formField.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {mobilePaymentProviders[field.country]?.map(
                                      (provider) => (
                                        <SelectItem
                                          key={provider}
                                          value={provider}
                                        >
                                          {provider}
                                        </SelectItem>
                                      )
                                    )}
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`payments.${index}.mobileNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="+959..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {fieldMethodType === "link" && (
                        <FormField
                          control={form.control}
                          name={`payments.${index}.link`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Link</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="url"
                                  placeholder="https://..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Add remove button for payment method */}
                      {paymentFields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removePayment(index)}
                          className="mt-2"
                        >
                          Remove Payment Method
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={form.formState.isSubmitting}
              >
                Create Campaign
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export const mobilePaymentProviders: Record<string, string[]> = {
  Myanmar: [
    "KBZ Pay",
    "Wave Money",
    "OK Dollar",
    "AYA Pay",
    "CB Pay",
    "MPT Money",
    "MyTel Pay",
  ],
  Thailand: [
    "PromptPay",
    "TrueMoney Wallet",
    "Rabbit LINE Pay",
    "SCB Easy",
    "K PLUS",
  ],
  Malaysia: ["Touch 'n Go eWallet", "Boost", "GrabPay", "MAE", "ShopeePay"],
  Singapore: ["PayNow", "GrabPay", "PayLah!", "Singtel Dash"],
  "United States": ["Venmo", "PayPal", "Zelle", "CashApp"],
  "United Kingdom": ["PayPal", "Bank Transfer", "Credit Card"],
}
