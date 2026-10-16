'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useSyncExternalStore } from 'react'

const THEME_COLOR = { light: '#F2F5FA', dark: '#0B1A33' } as const
type Theme = keyof typeof THEME_COLOR

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

// The <html data-theme> attribute is the single source of truth (set before paint by the layout script).
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}
const isDark = () => document.documentElement.dataset.theme === 'dark'

/** Dimensional switch. The knob position is pure CSS ([data-theme]), so there is no flash before hydration. */
export function ThemeSwitch() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)

  // follow the device setting until the visitor makes a choice
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('theme')
      } catch {}
      if (!saved) apply(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = dark ? 'light' : 'dark'
    apply(next)
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  return (
    <button type="button" className="dswitch" role="switch" aria-checked={dark} aria-label="Mode gelap" onClick={toggle}>
      <Sun className="ds-ghost ds-ghost-sun" aria-hidden="true" />
      <Moon className="ds-ghost ds-ghost-moon" aria-hidden="true" />
      <span className="ds-knob">
        <Sun className="ds-ico ds-sun" aria-hidden="true" />
        <Moon className="ds-ico ds-moon" aria-hidden="true" />
      </span>
    </button>
  )
}
