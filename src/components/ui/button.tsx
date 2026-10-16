import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

// shadcn/ui Button (supplied design) — colors mapped to the theme tokens so it follows section tones.
const buttonCva = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-cta text-on-cta font-semibold shadow-sm shadow-black/5 hover:bg-cta/90',
        outline: 'border border-line bg-transparent text-fg shadow-sm shadow-black/5 hover:bg-fg/5',
        ghost: 'text-fg hover:bg-fg/10',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

/** cva + tailwind-merge: caller classes (e.g. `hidden lg:inline-flex`) must override the base `inline-flex`. */
const buttonVariants = ({ className, ...props }: VariantProps<typeof buttonCva> & { className?: string } = {}) =>
  cn(buttonCva(props), className)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCva> {
  asChild?: boolean
  /** demo.tsx loading state: label turns transparent, spinner centered, opacity stays 100. */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), 'group disabled:opacity-100', className)}
        ref={ref}
        {...props}
        data-loading={loading}
        aria-busy={loading || undefined}
        disabled={asChild ? undefined : props.disabled || loading}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span className="inline-flex items-center gap-2 group-data-[loading=true]:text-transparent">{children}</span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <LoaderCircle className="animate-spin" size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            )}
          </>
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export default Button
