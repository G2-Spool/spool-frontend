/**
 * Textarea Component
 * 
 * A styled textarea component with configurable properties for multi-line text input.
 * Supports auto-resizing, placeholder text, disabled state, and custom styling.
 */

import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  rows?: number
  autoResize?: boolean
  style?: React.CSSProperties
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, value, onChange, onKeyDown, disabled, rows = 4, autoResize = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          autoResize && 'resize-none',
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        rows={rows}
        style={autoResize ? { resize: 'none' } : undefined}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea' 