import type { ButtonHTMLAttributes } from 'react'
import { buttonClass, type Variant } from './buttonClass'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return <button type={type} {...props} className={`${buttonClass(variant)} ${className}`} />
}
