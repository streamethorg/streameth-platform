import { ReactNode, TextareaHTMLAttributes, forwardRef } from 'react'
import FormLabel from './FormLabel'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string
  label?: string
  required?: boolean
  toolTip?: boolean
  toolTipHTML?: string
  renderSecondaryLabel?: ReactNode
  validationErrors?: string
}

const FormTextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', validationErrors, renderSecondaryLabel, label, toolTip, toolTipHTML, required, id, ...props }, ref) => {
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
			  "flex min-h-[170px] font-sans mb-2 w-full border rounded-lg bg-transparent p-3 placeholder:text-grey placeholder:font-sans focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
			  ${validationErrors ? '!border-danger' : 'border-medGrey'} ${className}
			`}
          ref={ref}
          {...props}
        />
        <div className="text-danger mb-4">{validationErrors && validationErrors}</div>
      </div>
    )
  }
)
FormTextArea.displayName = 'FormTextArea'

export { FormTextArea }
