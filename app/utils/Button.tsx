import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center border rounded-[8px] disabled:opacity-50  disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'text-white bg-accent hover:bg-transparent hover:text-accent hover:border-accent',
        danger: 'bg-danger text-white',
        base: 'bg-base text-white hover:text-black',
        outline:
          'text-accent bg-transparent border-accent hover:text-white hover:bg-accent',
        green: 'bg-transparent text-accent border-green',
        yellow: 'bg-yellow-500 text-white',
      },
      size: {
        default: 'h-9 py-1 px-4',
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
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
