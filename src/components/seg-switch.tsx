'use client'

import { Building2, UserRound } from 'lucide-react'
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

const ICONS = { building: Building2, user: UserRound } // icons can't cross the server→client boundary as components

export type SegOption = { value: string; label: string; icon?: keyof typeof ICONS }

/**
 * Dimensional segmented slider. It only sets `data-filter` on the target element;
 * the (server-rendered) items there are shown/hidden by CSS — see globals.css.
 * `tabs` = ARIA tabs that control panels `${target}-${value}`; otherwise a group of toggle buttons.
 */
export function SegSwitch({
  target,
  options,
  label,
  tabs = false,
  className = '',
}: {
  target: string
  options: SegOption[]
  label: string
  tabs?: boolean
  className?: string
}) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (i: number, focus = false) => {
    setActive(i)
    const el = document.getElementById(target)
    if (el) el.dataset.filter = options[i].value
    if (focus) refs.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    select((i + step + options.length) % options.length, true)
  }

  return (
    <div
      className={`seg ${className}`}
      role={tabs ? 'tablist' : 'group'}
      aria-label={label}
      style={{ '--n': options.length, '--i': active } as CSSProperties}
    >
      <span className="seg-knob" aria-hidden="true" />
      {options.map((o, i) => {
        const Icon = o.icon ? ICONS[o.icon] : null
        const on = i === active
        const a11y = tabs
          ? {
              role: 'tab',
              id: `${target}-tab-${o.value}`,
              'aria-controls': `${target}-${o.value}`,
              'aria-selected': on,
              tabIndex: on ? 0 : -1,
              onKeyDown: (e: KeyboardEvent) => onKeyDown(e, i),
            }
          : { 'aria-pressed': on }
        return (
          <button
            key={o.value}
            type="button"
            className="seg-opt"
            ref={(el) => {
              refs.current[i] = el
            }}
            onClick={() => select(i)}
            {...a11y}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
