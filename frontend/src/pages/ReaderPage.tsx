import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Placeholder } from '../components/Placeholder'
import { getStory, saveLastRead } from '../data/stories'

export function ReaderPage() {
  const { storyId } = useParams()
  const story = getStory(storyId)

  const openedId = story?.id
  useEffect(() => {
    if (openedId) saveLastRead({ storyId: openedId, sectionIndex: 0 })
  }, [openedId])

  if (!story) {
    return <Placeholder title="Story not found" description="This story is not in the library." />
  }

  return (
    <Placeholder
      title={story.title}
      description="The story will be shown here one section at a time, with quiet markers you can tap for help."
    />
  )
}
