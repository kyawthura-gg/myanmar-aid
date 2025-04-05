import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container-wrapper flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <img
            src="/logo.png"
            alt="Myanmar aid connect logo"
            className="w-5 h-auto"
          />
          <span>Myanmar Aid Connect</span>
        </div>
        <p className="text-sm text-muted-foreground">{`© ${new Date().getFullYear()} Myanmar Aid Connect. All rights reserved.`}</p>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:underline"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
