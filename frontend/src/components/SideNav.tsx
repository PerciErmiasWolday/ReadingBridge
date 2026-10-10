import { BookMarked, Library, ListChecks, SlidersHorizontal } from 'lucide-react'
import { NavItem } from './NavItem'
import { Wordmark } from './Wordmark'

const items = [
  { to: '/library', label: 'Library', icon: Library },
  { to: '/my-reading', label: 'My Reading', icon: BookMarked },
  { to: '/progress', label: 'Progress', icon: ListChecks },
  { to: '/settings', label: 'Settings', icon: SlidersHorizontal },
]

export function SideNav() {
  return (
    <aside className="border-b border-rule md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <div className="px-6 pb-6 pt-8 md:pb-10">
        <Wordmark />
      </div>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-2 px-2 pb-4 md:flex-col md:gap-1 md:px-2">
          {items.map((item) => (
            <li key={item.to}>
              <NavItem {...item} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
