'use client'
import React, { ChangeEvent, HTMLAttributes, InputHTMLAttributes, Ref, forwardRef } from 'react'
import FormLabel from './FormLabel'

interface FormTextInputProps extends HTMLAttributes<HTMLInputElement> {
  label: string
  isNumberInput?: boolean
  type?: string
  name?: string
  value?: string
  toolTip?: boolean
  toolTipHTML?: string
  required?: boolean
  validationErrors?: string
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
  ({ className = '', isNumberInput, toolTip, toolTipHTML, required, label, validationErrors, ...props }, ref: Ref<HTMLInputElement>) => {
    return (
      <div>
        {label && <FormLabel label={label} toolTip={toolTip} required={required} toolTipHTML={toolTipHTML} />}
        <input
          className={`flex h-12 p-3 mb-2 w-full border rounded-lg bg-transparent font-sans placeholder:font-sans placeholder:text-grey focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
           ${validationErrors ? '!border-danger' : 'border-medGrey'} ${className}`}
          ref={ref}
          {...props}
        />
        <div className="text-danger mb-4">{validationErrors && validationErrors}</div>
      </div>
    )
  }
)
FormTextInput.displayName = 'FormTextInput'

export { FormTextInput }
