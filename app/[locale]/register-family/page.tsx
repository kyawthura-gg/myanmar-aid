"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterFamilyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    location: "",
    familySize: "",
    incomeLevel: "",
    primaryNeed: "",
    description: "",
    idUploaded: false,
    locationVerified: false,
    termsAccepted: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the data to the server
    router.push("/registration-success")
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <div className="container max-w-3xl py-10">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Register as an Affected Family</CardTitle>
          <CardDescription>
            Please provide accurate information to help donors understand your
            needs. All information will be verified by our team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
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
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City/Town, Region"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Please provide your current location where aid should be
                    delivered
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="familySize">Family Size</Label>
                  <Select
                    onValueChange={(value) => handleChange("familySize", value)}
                    value={formData.familySize}
                    required
                  >
                    <SelectTrigger id="familySize">
                      <SelectValue placeholder="Select family size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 person</SelectItem>
                      <SelectItem value="2-3">2-3 people</SelectItem>
                      <SelectItem value="4-6">4-6 people</SelectItem>
                      <SelectItem value="7+">7 or more people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="incomeLevel">
                    Income Level (Before Disaster)
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleChange("incomeLevel", value)
                    }
                    value={formData.incomeLevel}
                    required
                  >
                    <SelectTrigger id="incomeLevel">
                      <SelectValue placeholder="Select income level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low income</SelectItem>
                      <SelectItem value="medium">Medium income</SelectItem>
                      <SelectItem value="high">High income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Primary Need</Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleChange("primaryNeed", value)
                    }
                    value={formData.primaryNeed}
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shelter" id="shelter" />
                      <Label htmlFor="shelter">Shelter/Housing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="food" id="food" />
                      <Label htmlFor="food">Food & Water</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medical" id="medical" />
                      <Label htmlFor="medical">Medical Assistance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="children" id="children" />
                      <Label htmlFor="children">Children's Needs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Describe Your Situation</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe your current situation and specific needs..."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <Label>Identity Verification</Label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Upload ID Document</p>
                      <p className="text-xs text-muted-foreground text-center max-w-xs">
                        Please upload a government-issued ID. We will blur
                        sensitive information for your privacy.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleChange("idUploaded", true)}
                        className="mt-2"
                      >
                        Select File
                      </Button>
                      {formData.idUploaded && (
                        <p className="text-xs text-green-600 mt-2">
                          ID document uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Label>Location Verification</Label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <p className="text-sm font-medium">
                        Verify Your Location
                      </p>
                      <p className="text-xs text-muted-foreground text-center max-w-xs">
                        We need to verify your location to ensure aid reaches
                        the right people.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleChange("locationVerified", true)}
                        className="mt-2"
                      >
                        Share Location
                      </Button>
                      {formData.locationVerified && (
                        <p className="text-xs text-green-600 mt-2">
                          Location verified successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      handleChange("termsAccepted", checked === true)
                    }
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I confirm that all information provided is accurate and I
                      consent to the processing of my data.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <Button type="button" variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={
                !formData.idUploaded ||
                !formData.locationVerified ||
                !formData.termsAccepted
              }
              onClick={handleSubmit}
            >
              Submit Registration
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
