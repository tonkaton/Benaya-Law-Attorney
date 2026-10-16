import { Phone, Scale } from 'lucide-react'
import Link from 'next/link'

import { MobileMenu } from '@/components/mobile-menu'
import { NAV_LINKS } from '@/components/nav-links'
import { ThemeSwitch } from '@/components/theme-switch'
import { buttonVariants } from '@/components/ui/button'
import { telHref } from '@/lib/utils'

export function Logo() {
  return (
    <Link href="/#top" className="flex shrink-0 items-center gap-2.5" aria-label="Benaya Law Attorney — beranda">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-cta text-on-cta">
        <Scale className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="block text-[16px] font-bold tracking-[0.2em]">BENAYA</span>
        <span className="block text-[9px] tracking-[0.3em] text-fg-muted">LAW ATTORNEY</span>
      </span>
    </Link>
  )
}

export function Navbar({ phone }: { phone: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-page/80 text-fg backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm text-fg-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link className="transition hover:text-fg" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href={telHref(phone)} className="hidden items-center gap-2 text-sm text-fg-muted transition hover:text-fg xl:flex">
            <Phone className="h-4 w-4 text-brand" aria-hidden="true" /> {phone}
          </a>
          <Link href="/#kontak" className={buttonVariants({ className: 'hidden lg:inline-flex' })}>
            Konsultasi Gratis
          </Link>
          <span className="hidden rounded-md border border-line px-2 py-1 text-xs text-fg-muted lg:inline">ID</span>
          <ThemeSwitch />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
