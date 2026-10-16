import type { Access, FieldAccess, PayloadRequest } from 'payload'

/** RBAC roles — matrix in ANALISIS-IMPLEMENTASI-NEXTJS.md §7. Checked server-side on every operation. */
export const ROLES = ['admin', 'partner', 'editor', 'lawyer'] as const
export type Role = ( typeof ROLES [number] )

const roleOf = (req: PayloadRequest): Role | undefined =>
  (req.user as { role?: Role } | null | undefined)?.role

export const hasRole =
  (...allowed: Role[]) =>
  ({ req }: { req: PayloadRequest }): boolean => {
    const role = roleOf(req)
    return !!role && allowed.includes(role)
  }

export const isAdmin = hasRole('admin')
export const isAdminOrPartner = hasRole('admin', 'partner')
/** Can manage public content (services, articles, testimonials as drafts). */
export const isContentStaff = hasRole('admin', 'partner', 'editor')
export const isLoggedIn = ({ req }: { req: PayloadRequest }) => !!req.user

/** Field-level variants (same rules, FieldAccess signature). */
export const fieldAdminOnly: FieldAccess = ({ req }) => roleOf(req) === 'admin'
export const fieldAdminOrPartner: FieldAccess = ({ req }) => ['admin', 'partner'].includes(roleOf(req) ?? '')
export const fieldContentStaff: FieldAccess = ({ req }) =>
  ['admin', 'partner', 'editor'].includes(roleOf(req) ?? '')

/** Lawyers may only touch documents linked to their own account via `field`. */
export const staffOrOwn =
  (field: string, staff: Role[]): Access =>
  ({ req }) => {
    const role = roleOf(req)
    if (!role) return false
    if (staff.includes(role)) return true
    if (role === 'lawyer') return { [field]: { equals: req.user!.id } }
    return false
  }
