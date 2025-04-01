"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(en|mm)/, "") || "/";

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;

    // If switching to default locale (en), we can use the path without locale prefix
    const newPath =
      newLocale === "en"
        ? pathnameWithoutLocale
        : `/${newLocale}${pathnameWithoutLocale}`;

    router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className={locale === "en" ? "bg-muted font-medium" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("mm")}
          className={locale === "mm" ? "bg-muted font-medium" : ""}
        >
          မြန်မာဘာသာ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
