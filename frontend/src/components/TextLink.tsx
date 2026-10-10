import { Link, type LinkProps } from 'react-router-dom'

export function TextLink({ className = '', ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`rounded-sm font-medium text-accent underline-offset-4 decoration-1 hover:underline focus-visible:underline ${className}`}
    />
  )
}
