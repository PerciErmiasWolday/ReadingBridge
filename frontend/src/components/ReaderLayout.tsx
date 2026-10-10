import { Outlet } from 'react-router-dom'
import { SkipLink } from './SkipLink'

/** Shell for /read/:storyId: no navigation, so nothing competes with the story. */
export function ReaderLayout() {
  return (
    <>
      <SkipLink />
      <Outlet />
    </>
  )
}
