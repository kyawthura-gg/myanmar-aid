import { api } from "@/trpc/server"
import { NeedCampaignDetails } from "../need-campaign-details"
import { CampaignError } from "./campaign-error"

export const runtime = "edge"

export default async function CampaignDonationPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await api.campaign.getActiveById(id)

  if (!campaign) {
    return <CampaignError />
  }
  return <NeedCampaignDetails campaign={campaign} />
}
