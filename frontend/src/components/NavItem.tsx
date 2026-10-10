import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
}

export function NavItem({ to, label, icon: Icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 border-l py-2 pl-4 pr-2 text-[0.9375rem]',
          isActive
            ? 'border-sage text-sage font-medium'
            : 'border-transparent text-ink-soft hover:text-ink hover:border-rule-strong',
        ].join(' ')
      }
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}
