import { PageHeader } from './PageHeader'

interface PlaceholderProps {
  title: string
  description: string
}

/** Phase 1 placeholder: a page title and one line saying what will go here. */
export function Placeholder({ title, description }: PlaceholderProps) {
  return <PageHeader title={title}>{description}</PageHeader>
}
