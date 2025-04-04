"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  BitcoinIcon,
  Building2Icon,
  CheckCircle2Icon,
  ImageIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  RocketIcon,
  SmartphoneIcon,
  TrashIcon,
  WalletIcon,
  XIcon,
} from "lucide-react"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  RegionDropdown,
  TownshipDropdown,
} from "@/components/ui/location-dropdown"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import states from "@/lib/location/states.json"
import townships from "@/lib/location/townships.json"
import { api } from "@/trpc/react"
import mime from "mime-types"
import { useMemo } from "react"

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  regionCode: z.string().min(2, "Invalid region"),
  townshipCode: z.string().min(2, "Invalid township"),
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

  const selectedRegionCode = form.watch("regionCode")
  const townshipsForSelectedRegion = useMemo(() => {
    return townships.filter(
      (township) => township.regionCode === selectedRegionCode
    )
  }, [selectedRegionCode])

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
      router.push("/account/campaigns")
    } catch (error) {
      toast.error("Failed to create campaign")
    }
  }

  // if (!session?.user) {
  //   router.push("/auth/login")
  //   return null
  // }

  return (
    <div className="container-wrapper">
      <div className="max-w-3xl py-4 md:py-10 mx-auto px-3">
        <Link
          href="/account/campaigns"
          className="flex items-center gap-2 text-sm md:mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to campaigns
        </Link>

        <Card className="border-0 md:border">
          <CardHeader className="px-0 pb-4 md:p-6">
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>
              Share your story and set up donation methods
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-6 p-2.5 md:p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <PencilIcon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Campaign Details</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-base font-medium">
                            Campaign Title
                          </FormLabel>

                          <div className="text-xs text-muted-foreground">
                            {field.value?.length ?? 0}/100
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Emergency Relief for Flood Victims in Mandalay"
                            className="text-lg"
                            maxLength={100}
                          />
                        </FormControl>
                        <FormDescription>
                          Make it clear, specific, and memorable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-base font-medium">
                            Campaign Story
                          </FormLabel>

                          <div className="text-xs text-muted-foreground">
                            {field.value?.length ?? 0}/2000
                          </div>
                        </div>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share your story here. Include: • What happened and who needs help? • How will the donations be used? • What is the impact of donations? • Who is organizing this campaign?"
                            className="min-h-[200px] text-base leading-relaxed"
                            maxLength={2000}
                          />
                        </FormControl>
                        <div className="space-y-3 rounded-md bg-muted p-4 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p>Be specific about how the funds will be used</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p>Share personal stories and real impact</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p>
                              Include relevant details about timing and urgency
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-2.5 md:p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Campaign Location</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="regionCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Region</FormLabel>
                          <FormControl>
                            <RegionDropdown
                              options={states}
                              onChange={(location) => {
                                field.onChange(location.regionCode)
                                //@ts-expect-error
                                form.setValue("townshipCode", undefined)
                              }}
                              defaultValue={field.value}
                              placeholder="Select state/region"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="townshipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Township</FormLabel>
                          <FormControl>
                            <TownshipDropdown
                              options={townshipsForSelectedRegion}
                              onChange={(location) =>
                                field.onChange(location.townshipCode)
                              }
                              placeholder={
                                form.watch("regionCode")
                                  ? "Select township"
                                  : "Please select state/region first"
                              }
                              disabled={!form.watch("regionCode")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="photos"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-4">
                        <FormLabel className="text-lg font-medium m-0">
                          Campaign Photos
                        </FormLabel>
                        <div className="text-xs px-2 py-1 rounded-full bg-muted">
                          {field.value.length}/6 photos
                        </div>
                      </div>
                      <FormControl>
                        <div className="space-y-6">
                          <div className="border-2 border-dashed rounded-lg p-6 bg-muted/30">
                            <div className="text-center space-y-4">
                              <div className="mx-auto w-fit p-4 rounded-full bg-muted">
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Click to upload photos
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  The first photo will be used as the campaign
                                  cover
                                </p>
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={field.value.length >= 6}
                                className="hidden"
                                id="photo-upload"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files ?? [])
                                  const totalFiles =
                                    field.value.length + files.length
                                  if (totalFiles > 6) {
                                    toast.error("Maximum 6 photos allowed")
                                    return
                                  }
                                  field.onChange([...field.value, ...files])
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={field.value.length >= 6}
                                onClick={() =>
                                  document
                                    .getElementById("photo-upload")
                                    ?.click()
                                }
                              >
                                Select Photos
                              </Button>
                            </div>
                          </div>

                          {field.value.length > 0 && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {field.value.map((file: File, i: number) => (
                                  <div
                                    key={i}
                                    className="group relative aspect-square rounded-lg overflow-hidden border bg-muted/10"
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${i + 1}`}
                                      className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                                      <p className="text-xs text-white truncate">
                                        {file.name}
                                      </p>
                                    </div>
                                    {i === 0 && (
                                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                                        Cover Photo
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newFiles = [...field.value]
                                        newFiles.splice(i, 1)
                                        field.onChange(newFiles)
                                      }}
                                      className="absolute top-2 right-2 bg-destructive text-white hover:bg-destructive/70 p-1.5 rounded-full"
                                    >
                                      <XIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6 p-2.5 md:p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WalletIcon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Payment Methods</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendPayment({
                          methodType: "bank",
                          country: "Myanmar",
                        })
                      }
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Payment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {paymentFields.map((field, index) => {
                      const fieldMethodType = form.watch(
                        `payments.${index}.methodType`
                      )

                      return (
                        <div
                          key={field.id}
                          className="relative space-y-4 p-3 md:p-6 border rounded-lg bg-card transition-colors hover:bg-accent/5"
                        >
                          <div className="absolute top-4 right-4 space-x-2">
                            {paymentFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePayment(index)}
                                className="h-8 w-8 p-0"
                              >
                                <TrashIcon className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`payments.${index}.methodType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Method</FormLabel>
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
                                        <div className="flex items-center gap-2">
                                          <Building2Icon className="h-4 w-4" />
                                          Bank Account
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="mobilepayment">
                                        <div className="flex items-center gap-2">
                                          <SmartphoneIcon className="h-4 w-4" />
                                          Mobile Payment
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="link">
                                        <div className="flex items-center gap-2">
                                          <LinkIcon className="h-4 w-4" />
                                          Fundraiser Link
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="crypto">
                                        <div className="flex items-center gap-2">
                                          <BitcoinIcon className="h-4 w-4" />
                                          Cryptocurrency
                                        </div>
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
                                    <FormLabel>Country</FormLabel>
                                    <CountryDropdown
                                      placeholder="Select country"
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
                          </div>

                          <div className="pt-4 border-t">
                            {fieldMethodType === "bank" && (
                              <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name={`payments.${index}.accountName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Account Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Enter account holder name"
                                        />
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
                                        <Input
                                          {...field}
                                          placeholder="Enter account number"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
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
                                          {mobilePaymentProviders[
                                            field.country
                                          ]?.map((provider) => (
                                            <SelectItem
                                              key={provider}
                                              value={provider}
                                            >
                                              {provider}
                                            </SelectItem>
                                          ))}
                                          <SelectItem value="Other">
                                            Other
                                          </SelectItem>
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
                                        <Input
                                          {...field}
                                          placeholder="+959..."
                                        />
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
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={form.formState.isSubmitting}
                >
                  <span className="flex items-center gap-2">
                    <RocketIcon className="h-5 w-5" />
                    Launch Campaign
                  </span>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
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
