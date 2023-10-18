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
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
  ({ className = '', isNumberInput, toolTip, toolTipHTML, required, label, ...props }, ref: Ref<HTMLInputElement>) => {
    return (
      <div>
        {label && <FormLabel label={label} toolTip={toolTip} required={required} toolTipHTML={toolTipHTML} />}
        <input
          className={`flex h-12 p-3 mb-6 w-full border-medGrey border rounded-lg bg-transparent font-sans placeholder:font-sans placeholder:text-grey focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
FormTextInput.displayName = 'FormTextInput'

export { FormTextInput }
