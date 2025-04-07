import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CampaignForm } from "../campaign-form"

export const runtime = "edge"

export default function CreateCampaignPage() {
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
            <CampaignForm
              defaultValues={{
                photos: [],
                payments: [{ methodType: "bank", country: "Myanmar" }],
                contactMethods: [{ type: "facebook", value: "" }],
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
