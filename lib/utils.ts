import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStorageFullURL(image: string) {
  return `${process.env.NEXT_PUBLIC_R2_URL}${image}`
}
