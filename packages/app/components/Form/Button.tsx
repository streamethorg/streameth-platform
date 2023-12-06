import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center disabled:opacity-50  disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'text-white bg-base rounded-xl hover:bg-white hover:border-base',
        danger: 'bg-danger text-white',
        base: 'bg-base text-white hover:text-black',
        outline:
          'text-blue bg-transparent border-blue hover:text-white hover:bg-blue',
        green: 'bg-transparent text-blue border-green',
        yellow: 'bg-yellow-500 text-white',
      },
      size: {
        default: 'm-2 p-2',
        sm: 'h-7 px-2 text-sm',
        xs: 'h-6 px-1.5 text-[12px]',
        lg: 'w-full h-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant, isLoading, size, ...props },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isLoading}
        {...props}>
        {isLoading ? (
          <div className="animate-pulse">Loading...</div>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
