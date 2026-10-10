import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { getBookmarks, toggleBookmark } from '../data/readingLog'

/** Saves a story to My Reading. The state is announced through aria-pressed, not colour alone. */
export function BookmarkButton({ storyId, title }: { storyId: string; title: string }) {
  const [saved, setSaved] = useState(() => getBookmarks().includes(storyId))
  const [bump, setBump] = useState(0)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${title} for later`}
      onClick={() => {
        setSaved(toggleBookmark(storyId))
        setBump((n) => n + 1)
      }}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-current hover:bg-r-line"
    >
      <Bookmark
        key={bump}
        size={19}
        strokeWidth={1.6}
        aria-hidden="true"
        fill={saved ? 'currentColor' : 'none'}
        className={bump ? 'pop' : ''}
      />
    </button>
  )
}
