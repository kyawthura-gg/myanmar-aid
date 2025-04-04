"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { signUp, useSession } from "@/lib/auth-client"
import { api } from "@/trpc/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const step1Schema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const phoneValidation = z
  .string()
  .regex(
    /^\+[1-9]\d{6,14}$/,
    "Enter valid number starting with + (e.g., +959751241231)"
  )
  .nullish()
  .or(z.literal(""))
const step2Schema = z.object({
  accountType: z.enum(["individual", "org"], {
    required_error: "Please select an account type",
  }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  socialLink: z.string().url("Please enter a valid URL"),
  phoneNumber: phoneValidation,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export default function RegisterFamilyPage() {
  const { data: session } = useSession()
  const me = api.user.me.useQuery(undefined, { enabled: !!session?.user })
  const createMutation = api.user.create.useMutation()
  const step = session?.user ? 2 : 1

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      accountType: undefined,
      name: "",
      phoneNumber: "",
      socialLink: "",
      termsAccepted: false,
    },
  })

  async function onStep1Submit(values: z.infer<typeof step1Schema>) {
    await signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.email.split("@")[0],
      },
      {
        onError: (error) => {
          console.warn(error)
          toast.error(error.error.message)
        },
        onSuccess: () => {
          toast.success("Account created successfully!")
          me.refetch()
        },
      }
    )
  }

  async function onStep2Submit(values: z.infer<typeof step2Schema>) {
    await createMutation.mutateAsync({
      ...values,
      image: null, //TODO
    })
    toast.success("Profile updated successfully!")
    window.location.replace("/account/campaigns/create")
  }

  return (
    <div className="container-wrapper py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Register to request need campaign</CardTitle>
            <CardDescription>
              Please provide your details to help donors understand your needs.
              Open to both individuals and organizations. All information will
              be verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="w-full bg-muted h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            </div>

            <div>
              {step === 1 && (
                <Form {...step1Form}>
                  <form
                    onSubmit={step1Form.handleSubmit(onStep1Submit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={step1Form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="m@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center">
                      <Button
                        loading={step1Form.formState.isSubmitting}
                        type="submit"
                        className="max-w-[300px] w-full"
                      >
                        Sign Up & Continue
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {step === 2 && (
                <Form {...step2Form}>
                  <form
                    onSubmit={step2Form.handleSubmit(onStep2Submit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={step2Form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">
                                Individual
                              </SelectItem>
                              <SelectItem value="org">Organization</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name or organization name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="socialLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Media Profile Link</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://facebook.com/your.profile"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            This will be used by our system to verify your
                            identity. Make sure to enter a publicly accessible
                            profile link.
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-2">
                      <FormLabel>Profile Image (Optional)</FormLabel>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                      />
                    </div>

                    <FormField
                      control={step2Form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+959xxxxxxxxx"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-row items-start space-x-2 pt-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="grid gap-1.5 leading-none">
                              <FormLabel className="text-sm font-medium leading-none">
                                Accept terms and conditions
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                I confirm that all information provided is
                                accurate and I consent to the processing of my
                                data.
                              </p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="max-w-[300px] w-full"
                        loading={createMutation.isPending}
                      >
                        Submit Registration
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
