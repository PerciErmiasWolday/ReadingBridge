import { NavLink, useLocation } from 'react-router-dom'

const items = [
  { to: '/library', label: 'Library' },
  { to: '/my-reading', label: 'My Reading' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

/** Minimal horizontal navigation: text links with a forest rule that draws in on hover. */
export function MainNav() {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Main">
      <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2 p-0">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  'group relative inline-block rounded-sm py-1 text-[0.9375rem]',
                  isActive ||
                  (item.to === '/library' &&
                    (pathname.startsWith('/read/') || pathname === '/add-reading'))
                    ? 'font-medium text-midnight [&>span]:scale-x-100'
                    : 'text-ink-soft hover:text-midnight',
                ].join(' ')
              }
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition duration-300 group-hover:scale-x-100"
              />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
