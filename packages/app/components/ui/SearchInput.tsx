'use client'
import * as React from 'react'
import { cn } from '@/lib/utils/utils'
import { Search } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, width = 500, type, ...props }, ref) => {
    return (
      <div style={{ width: width }} className="relative">
        <i
          className={`absolute top-1/2 transform -translate-y-1/2 left-3`}>
          <Search className="w-4 h-4 text-muted-foreground" />
        </i>
        <input
          type={type}
          className={`flex w-full pl-8 rounded-full 
		  bg-muted border outline-none border-muted-foreground 
		  px-1 py-1 text-sm ring-offset-none file:border-0 
		  file:bg-transparent file:text-sm file:font-medium 
		  placeholder:text-muted-foreground focus-visible:outline-none 
		  focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 ${
        className || ''
      }`}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
