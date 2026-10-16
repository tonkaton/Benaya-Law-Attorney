import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/navbar'
import { NAV_LINKS } from '@/components/nav-links'
import { waHref } from '@/lib/utils'

export function Footer() {
  return (
    <footer data-tl="navy" data-td="midnight" className="border-t border-line bg-page py-10 text-fg">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo />
          <ul className="flex flex-wrap gap-6 text-sm text-fg-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link className="transition hover:text-brand" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-fg-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Benaya Law Attorney. All rights reserved.</p>
          <div className="flex gap-5">
            <a className="transition hover:text-brand" href="#">Privacy Policy</a>
            <a className="transition hover:text-brand" href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppButton({ number }: { number: string }) {
  return (
    <a
      href={waHref(number)}
      target="_blank"
      rel="noopener"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-xl shadow-emerald-500/30 transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7 text-white" aria-hidden="true" />
    </a>
  )
}
