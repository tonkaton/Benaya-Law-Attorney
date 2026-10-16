import {
  Award,
  Briefcase,
  FileText,
  Gavel,
  Home,
  LayoutGrid,
  Scale,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react'

/** CMS stores icon names (select fields); map them to components here. */
export const CMS_ICONS: Record<string, LucideIcon> = {
  'file-text': FileText,
  scale: Scale,
  briefcase: Briefcase,
  home: Home,
  users: Users,
  shield: Shield,
  award: Award,
  gavel: Gavel,
  'layout-grid': LayoutGrid,
}

export const cmsIcon = (name?: string | null): LucideIcon => CMS_ICONS[name ?? ''] ?? Scale
