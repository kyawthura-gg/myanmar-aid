"use client"

import { createTranslator } from "next-intl"

export function useClientTranslations(
  namespace: string,
  locale: string,
  messages: any
) {
  return createTranslator({ locale, messages, namespace })
}
