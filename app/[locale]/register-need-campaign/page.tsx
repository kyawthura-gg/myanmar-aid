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
import { signIn, signUp, useSession } from "@/lib/auth-client"
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
    <div className="container-wrapper py-3 md:py-10">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="link">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <Card className="border-0 md:border">
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
                <>
                  <div className="text-center space-y-2 mb-4">
                    <h3 className="text-lg font-medium">Create your account</h3>
                    <p className="text-sm text-muted-foreground">
                      Register with Google to start your campaign
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="secondary"
                      type="button"
                      className="max-w-[300px] w-full"
                      onClick={() => {
                        signIn.social({
                          provider: "google",
                          callbackURL: "/account/campaigns",
                          newUserCallbackURL: "/register-need-campaign",
                        })
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                      </svg>
                      Register with Google
                    </Button>
                  </div>
                  {/* <Form {...step1Form}>
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

                      <div className="flex flex-col items-center">
                        <Button
                          loading={step1Form.formState.isSubmitting}
                          type="submit"
                          className="max-w-[300px] w-full"
                        >
                          Sign Up & Continue
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          className="max-w-[300px] w-full mt-4"
                          onClick={() => {
                            signIn.social({
                              provider: "google",
                              callbackURL: "/account/campaigns",
                              newUserCallbackURL: "/register-need-campaign",
                            })
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="100"
                            height="100"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#FFC107"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                              fill="#FF3D00"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                              fill="#4CAF50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            />
                            <path
                              fill="#1976D2"
                              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                          </svg>
                          Continue with Google
                        </Button>
                      </div>
                    </form>
                  </Form> */}
                </>
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
