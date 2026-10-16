'use server'

import { headers } from 'next/headers'

import { getCms } from '@/lib/cms'
import { consultationSchema, fieldErrors, type FieldErrors } from '@/lib/consultation-schema'
import { allow } from '@/lib/rate-limit'

export type ConsultationState = {
  ok: boolean
  message?: string
  errors?: FieldErrors
  /** echoed back on failure so React's post-action form reset keeps what the visitor typed */
  values?: Record<string, string>
}

const SUCCESS = 'Terima kasih! Permintaan konsultasi Anda telah terkirim. Tim kami akan menghubungi dalam 24 jam.'

export async function submitConsultation(_prev: ConsultationState, formData: FormData): Promise<ConsultationState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, String(v)]),
  )

  // honeypot: real visitors never see this field — pretend success so bots learn nothing
  if (raw.website) return { ok: true, message: SUCCESS }

  const parsed = consultationSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), values: raw }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (!allow(`consult:${ip}`)) {
    return { ok: false, message: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.', values: raw }
  }

  try {
    const cms = await getCms()
    const { consent: _consent, ...data } = parsed.data
    // the lead is saved first — an email outage must never lose it
    const lead = await cms.create({
      collection: 'consultation-requests',
      data: { ...data, consentAt: new Date().toISOString(), status: 'baru' },
    })
    await cms.jobs.queue({ task: 'sendLeadEmail', input: { leadId: String(lead.id) } })
    return { ok: true, message: SUCCESS }
  } catch (err) {
    console.error('[submitConsultation]', err)
    return {
      ok: false,
      message: 'Maaf, terjadi gangguan saat mengirim. Silakan coba lagi atau hubungi kami via WhatsApp.',
      values: raw,
    }
  }
}
