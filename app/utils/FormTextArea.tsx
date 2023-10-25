import { ReactNode, TextareaHTMLAttributes, forwardRef } from 'react'
import FormLabel from './FormLabel'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string
  label?: string
  required?: boolean
  toolTip?: boolean
  toolTipHTML?: string
  renderSecondaryLabel?: ReactNode
}

const FormTextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', renderSecondaryLabel, label, toolTip, toolTipHTML, required, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <FormLabel
            toolTip={toolTip}
            toolTipHTML={toolTipHTML}
            required={required}
            label={label}
            id={id}
            renderSecondaryLabel={renderSecondaryLabel}
          />
        )}
        <textarea
          className={`
			  "flex min-h-[150px] font-sans mb-6 w-full border border-medGrey rounded-lg bg-transparent p-3 placeholder:text-grey placeholder:font-sans focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
			  ${className}
			`}
          // value={value}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
FormTextArea.displayName = 'FormTextArea'

export { FormTextArea }
