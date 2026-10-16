import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Content changed in the CMS → refresh the static pages that show it (no rebuild).
 * Skipped when `context.disableRevalidate` is set (seed script runs outside a Next request).
 */
const refresh = (slug?: unknown) => {
  revalidatePath('/')
  if (typeof slug === 'string' && slug) revalidatePath(`/artikel/${slug}`)
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (!req.context.disableRevalidate) {
    refresh(doc?.slug)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) refresh(previousDoc.slug)
  }
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) refresh(doc?.slug)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidatePath('/', 'layout')
  return doc
}

/** Spread into any public-content collection. */
export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
