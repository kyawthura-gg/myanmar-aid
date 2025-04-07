import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/trpc/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CampaignForm } from "../../campaign-form"

export const runtime = "edge"

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = await api.campaign.getById(id)

  if (!campaign) {
    return <div>Campaign not found</div>
  }

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
            <CardTitle>Edit Campaign</CardTitle>
            <CardDescription>
              Update your campaign details and donation methods
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <CampaignForm
              defaultValues={{
                title: campaign.title,
                description: campaign.description,
                regionCode: campaign.regionCode,
                townshipCode: campaign.townshipCode,
                photos: campaign.photos,
                categories: campaign.categories,
                contactMethods: campaign.contactMethods,
                payments: campaign.payments.map((payment) => ({
                  methodType: payment.link
                    ? "link"
                    : payment.cryptoAddress
                      ? "crypto"
                      : payment.mobileNumber
                        ? "mobilepayment"
                        : "bank",
                  accountNumber: payment.accountNumber ?? undefined,
                  accountName: payment.accountName ?? undefined,
                  country: payment.country,
                  cryptoAddress: payment.cryptoAddress ?? undefined,
                  mobileNumber: payment.mobileNumber ?? undefined,
                  mobileProvider: payment.mobileProvider ?? undefined,
                  link: payment.link ?? undefined,
                  accountBankName: payment.accountBankName ?? undefined,
                })),
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
