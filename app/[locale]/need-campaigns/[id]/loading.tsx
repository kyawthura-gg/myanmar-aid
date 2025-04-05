import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container-wrapper py-6">
          <Skeleton className="h-9 w-32" /> {/* Back button */}
          <div className="mt-4 pl-3">
            <Skeleton className="h-12 w-3/4 max-w-2xl" /> {/* Title */}
          </div>
        </div>
      </div>

      <div className="container-wrapper py-6">
        <div className="grid gap-8 lg:grid-cols-12 px-3">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Photo */}
            <div className="aspect-video rounded-xl overflow-hidden border bg-muted">
              <Skeleton className="h-full w-full" />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg overflow-hidden border"
                >
                  <Skeleton className="h-full w-full" />
                </div>
              ))}
            </div>

            {/* Campaign Info Card */}
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" /> {/* Section title */}
                <Skeleton className="h-32 w-full" /> {/* Description */}
                {/* Campaign Details */}
                <div className="grid gap-6 mt-6 pt-6 border-t sm:grid-cols-2">
                  {/* Categories */}
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-6 w-20" />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              {/* Campaign Stats Card */}
              <div className="mb-6">
                <Skeleton className="h-[120px] w-full rounded-xl" />
              </div>

              {/* Payment Methods Card */}
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
