'use client'

import { MapPin } from 'lucide-react'
import { useState } from 'react'

/** Google Maps is one of the heaviest embeds — load it only when the visitor asks (saves mobile data, keeps LCP fast). */
export function MapFacade({ address }: { address: string }) {
  const [show, setShow] = useState(false)
  const q = encodeURIComponent(address)
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-line bg-page-alt">
      {show ? (
        <iframe
          title="Lokasi Benaya Law Attorney"
          className="h-full min-h-[260px] w-full"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${q}&output=embed`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="absolute inset-0 grid place-items-center text-sm font-semibold text-fg-muted transition hover:text-brand"
        >
          <span className="flex flex-col items-center gap-2">
            <MapPin className="h-7 w-7 text-brand" aria-hidden="true" />
            Tampilkan peta
          </span>
        </button>
      )}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener"
        className="glass absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:text-brand"
      >
        <MapPin className="h-4 w-4 text-brand" aria-hidden="true" /> Lihat di Google Maps
      </a>
    </div>
  )
}
