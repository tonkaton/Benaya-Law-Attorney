'use client'

import { Send } from 'lucide-react'
import { useActionState, useState, type FormEvent } from 'react'

import { submitConsultation, type ConsultationState } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import { consultationSchema, fieldErrors, SERVICES, type FieldErrors } from '@/lib/consultation-schema'
import { cn } from '@/lib/utils'

const input =
  'w-full rounded-lg border border-line bg-fg/[0.03] px-3.5 py-2.5 text-base sm:text-sm transition placeholder:text-fg-muted/80 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'

function Err({ name, msg }: { name: string; msg?: string }) {
  return msg ? (
    <p id={`${name}-err`} className="mt-1 text-xs text-red-600 dark:text-red-400">
      {msg}
    </p>
  ) : null
}

export function ConsultationForm() {
  const [state, action, pending] = useActionState<ConsultationState, FormData>(submitConsultation, { ok: false })
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})
  const errors = { ...state.errors, ...clientErrors }
  const v = state.values ?? {}

  // same schema as the server: instant feedback, no round trip for obvious mistakes
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const res = consultationSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))
    const errs = res.success ? {} : fieldErrors(res.error)
    setClientErrors(errs)
    if (!res.success) e.preventDefault()
  }

  const field = (name: keyof FieldErrors) => ({
    id: name,
    name,
    'aria-invalid': !!errors[name] || undefined,
    'aria-describedby': errors[name] ? `${name}-err` : undefined,
  })

  return (
    <form action={action} onSubmit={onSubmit} noValidate className="space-y-4">
      {/* honeypot — hidden from people and assistive tech */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted" htmlFor="name">Nama Lengkap</label>
          <input {...field('name')} autoComplete="name" defaultValue={v.name} placeholder="Masukkan nama lengkap" className={cn(input, errors.name && 'border-red-500')} />
          <Err name="name" msg={errors.name} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted" htmlFor="email">Email</label>
          <input {...field('email')} type="email" autoComplete="email" defaultValue={v.email} placeholder="nama@email.com" className={cn(input, errors.email && 'border-red-500')} />
          <Err name="email" msg={errors.email} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted" htmlFor="phone">Nomor Telepon</label>
          <input {...field('phone')} type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} placeholder="+62 812 3456 7890" className={cn(input, errors.phone && 'border-red-500')} />
          <Err name="phone" msg={errors.phone} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-fg-muted" htmlFor="service">Jenis Layanan</label>
          <select {...field('service')} defaultValue={v.service ?? ''} className={cn(input, errors.service && 'border-red-500')}>
            <option value="" disabled>Pilih layanan hukum</option>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Err name="service" msg={errors.service} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-fg-muted" htmlFor="message">Pesan / Deskripsi Kasus</label>
        <textarea {...field('message')} rows={4} defaultValue={v.message} placeholder="Ceritakan singkat mengenai kebutuhan hukum Anda..." className={cn(input, 'resize-none', errors.message && 'border-red-500')} />
        <Err name="message" msg={errors.message} />
      </div>
      <div>
        <label className="flex items-start gap-2.5 text-sm text-fg-muted">
          <input {...field('consent')} type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-brand" />
          <span>
            Saya menyetujui <a href="#" className="text-brand underline-offset-2 hover:underline">Kebijakan Privasi</a> dan Syarat &amp; Ketentuan.
          </span>
        </label>
        <Err name="consent" msg={errors.consent} />
      </div>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Kirim Pesan <Send className="h-4 w-4" />
      </Button>

      {state.message && (
        <div
          role="status"
          className={cn(
            'rounded-lg border px-4 py-3 text-sm',
            state.ok
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
          )}
        >
          {state.message}
        </div>
      )}
    </form>
  )
}
