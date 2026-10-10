import type { Story } from '../types'
import { MetaStrip } from './MetaStrip'

interface StoryCoverProps {
  story: Story
}

/**
 * Typographic story cover: thin frame, title, ruled metadata strip, and an
 * empty slot reserved for a single fine-line botanical drawing later.
 */
export function StoryCover({ story }: StoryCoverProps) {
  return (
    <figure className="m-0 flex aspect-[3/4] w-full max-w-[18rem] flex-col border border-ink p-2">
      <div className="flex flex-1 flex-col border border-rule-strong p-5">
        <div data-slot="illustration" aria-hidden="true" className="flex-1" />
        <figcaption className="font-display text-[2rem] leading-[1.05] text-ink">
          {story.title}
        </figcaption>
        <MetaStrip
          className="mt-5"
          items={[
            { label: 'Story', value: story.category },
            { label: 'Read', value: `${story.readMinutes} min` },
          ]}
        />
      </div>
    </figure>
  )
}
