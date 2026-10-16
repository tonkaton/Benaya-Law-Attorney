import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "+62 21 1234 5678" → "+622112345678" for tel: links; WhatsApp needs digits only. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
export const waHref = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '62')}`

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
