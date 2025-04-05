import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-4 sm:py-6 md:py-8">
      <div className="container-wrapper px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center sm:justify-start gap-2 font-semibold">
            <img
              src="/logo.png"
              alt="Myanmar aid connect logo"
              className="w-5 h-auto"
            />
            <span>Myanmar Aid Connect</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center order-last sm:order-none">
            {`© ${new Date().getFullYear()} Myanmar Aid Connect. All rights reserved.`}
          </p>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
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
      </div>
    </footer>
  )
}
