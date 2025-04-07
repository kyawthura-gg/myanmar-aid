import { LoaderCircleIcon } from "lucide-react"

export const Loader = () => {
  return (
    <div className="flex h-[78dvh] items-center justify-center">
      <LoaderCircleIcon className="h-8 w-8 animate-spin text-gray-800" />
    </div>
  )
}
