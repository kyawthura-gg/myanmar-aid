"use client"

import { Button } from "@/components/ui/button"
import { useSafeBack } from "@/hooks/use-safe-back"
import { ArrowLeftIcon } from "lucide-react"

export const CampaignError = () => {
  const safeBack = useSafeBack()
  return (
    <div className="container-wrapper py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The campaign you're looking for doesn't exist or has been removed.
      </p>
      <Button variant="link" onClick={() => safeBack("/")}>
        <ArrowLeftIcon className="h-4 w-4" />
        Back to home
      </Button>
    </div>
  )
}
