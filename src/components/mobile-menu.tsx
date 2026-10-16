'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { NAV_LINKS } from '@/components/nav-links'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className={buttonVariants({ variant: 'outline', size: 'icon', className: 'lg:hidden' })}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 border-t border-line bg-page/95 backdrop-blur lg:hidden">
          <nav className="shell flex flex-col gap-1 py-4" aria-label="Menu utama">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-line py-2.5" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/#kontak" className={buttonVariants({ size: 'lg', className: 'mt-3' })} onClick={() => setOpen(false)}>
              Konsultasi Gratis
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
