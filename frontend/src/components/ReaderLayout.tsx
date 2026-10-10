import { Outlet } from 'react-router-dom'
import { SkipLink } from './SkipLink'
import { TextLink } from './TextLink'

/** Shell for /read/:storyId. No side navigation — only a quiet way back. */
export function ReaderLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SkipLink />
      <header className="px-6 pt-6 md:px-10">
        <TextLink to="/library" className="text-[0.9375rem]">
          <span aria-hidden="true">←</span> Library
        </TextLink>
      </header>
      <main id="main" tabIndex={-1} className="px-6 py-10 md:px-10 md:py-16">
        <Outlet />
      </main>
    </div>
  )
}
