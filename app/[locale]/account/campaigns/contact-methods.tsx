"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
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
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"
import type { CampaignFormValues, contactTypeList } from "./campaign-schema"

type ContactType = (typeof contactTypeList)[number]

const contactTypePlaceholders: Record<ContactType, string> = {
  phone: "Enter phone number",
  viber: "Enter Viber number",
  facebook: "Enter Facebook profile link",
  instagram: "Enter Instagram profile link",
  whatsapp: "Enter WhatsApp number",
  telegram: "Enter Telegram profile link",
  tiktok: "Enter TikTok profile link",
}

const contactTypeLabels: Record<ContactType, string> = {
  phone: "Phone Number",
  facebook: "Facebook Profile",
  viber: "Viber Number",
  telegram: "Telegram",
  whatsapp: "WhatsApp Number",
  instagram: "Instagram Profile",
  tiktok: "TikTok Profile",
} as const

export function ContactMethodsForm() {
  const { control, watch } = useFormContext<CampaignFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contactMethods",
  })

  return (
    <div className="space-y-6 p-2.5 md:p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Contact Methods</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ type: "phone", value: "" })}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <FormField
        control={control}
        name="contactMethods"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <div className="space-y-4">
              {fields.map((field, index) => {
                const contactType = watch(`contactMethods.${index}.type`)
                return (
                  <div key={field.id} className="flex flex-col space-y-2">
                    <div className="flex items-center justify-end">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`contactMethods.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select contact type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(contactTypeLabels).map(
                                  ([type, label]) => (
                                    <SelectItem key={type} value={type}>
                                      <div className="flex items-center gap-2">
                                        <span>{label}</span>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`contactMethods.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={
                                  contactTypePlaceholders[contactType]
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {fields.length > 0 ? null : <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  )
}
