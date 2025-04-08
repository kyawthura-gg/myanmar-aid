import { NeedCampaignDetails } from "@/app/[locale]/need-campaigns/need-campaign-details"
import { api } from "@/trpc/server"
import { notFound } from "next/navigation"

export const runtime = "edge"

export default async function CampaignDonationPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await api.campaign.getById(id)

  if (!campaign) {
    notFound()
  }
  return <NeedCampaignDetails campaign={campaign} />
}
