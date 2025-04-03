import { useRouter } from "next/navigation"

export const useSafeBack = () => {
  const router = useRouter()

  const safeBack = (route: string) => {
    if (window.history?.length && window.history.length > 1) {
      router.back()
    } else {
      router.push(route)
    }
  }

  return safeBack
}
