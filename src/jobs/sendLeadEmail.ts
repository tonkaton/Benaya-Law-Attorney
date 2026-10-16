import type { TaskConfig } from 'payload'

/**
 * Notifies the firm about a new consultation request. Runs from the job queue (3 retries),
 * so the visitor never waits on email delivery and a mail outage never loses the lead.
 * Without RESEND_API_KEY the email is logged instead of sent.
 */
export const sendLeadEmail: TaskConfig<'sendLeadEmail'> = {
  slug: 'sendLeadEmail',
  retries: 3,
  inputSchema: [{ name: 'leadId', type: 'text', required: true }],
  outputSchema: [],
  handler: async ({ input, req }) => {
    const lead = await req.payload.findByID({ collection: 'consultation-requests', id: input.leadId, req })
    const subject = `Permintaan konsultasi baru: ${lead.service} — ${lead.name}`
    const text = [
      `Nama: ${lead.name}`,
      `Email: ${lead.email}`,
      `Telepon: ${lead.phone}`,
      `Layanan: ${lead.service}`,
      '',
      lead.message,
    ].join('\n')

    const { RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM } = process.env
    if (!RESEND_API_KEY || !LEAD_EMAIL_TO) {
      req.payload.logger.info({ msg: '[sendLeadEmail] RESEND_API_KEY/LEAD_EMAIL_TO kosong — email hanya dicatat', subject })
      return { output: {} }
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: LEAD_EMAIL_FROM || 'Benaya Website <onboarding@resend.dev>',
        to: LEAD_EMAIL_TO.split(',').map((s) => s.trim()),
        reply_to: lead.email,
        subject,
        text,
      }),
    })
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`) // → retried by the queue
    return { output: {} }
  },
}
