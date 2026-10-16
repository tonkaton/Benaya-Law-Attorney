import { z } from 'zod'

/** One schema for both sides: the browser validates for instant feedback, the Server Action validates for real. */
export const SERVICES = [
  'Korporasi & Bisnis',
  'Litigasi & Sengketa',
  'Ketenagakerjaan',
  'Properti & Pertanahan',
  'Perdata & Keluarga',
  'Pidana',
] as const

export const consultationSchema = z.object({
  name: z.string().trim().min(2, 'Nama wajib diisi.').max(100, 'Nama terlalu panjang.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi.')
    .max(150, 'Email terlalu panjang.')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Nomor telepon wajib diisi.')
    .regex(/^[+]?[\d\s().-]{8,20}$/, 'Nomor telepon tidak valid.'),
  service: z.enum(SERVICES, { error: 'Pilih jenis layanan.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Mohon jelaskan kebutuhan Anda (min. 10 karakter).')
    .max(2000, 'Pesan maksimal 2000 karakter.'),
  consent: z.literal('on', { error: 'Anda harus menyetujui kebijakan privasi.' }),
})

export type ConsultationInput = z.infer<typeof consultationSchema>
export type FieldErrors = Partial<Record<keyof ConsultationInput, string>>

/** First message per field — what the form shows under each input. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ConsultationInput
    if (key && !out[key]) out[key] = issue.message
  }
  return out
}
