import { Inter, Noto_Sans_Myanmar } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const notoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-myanmar",
})

