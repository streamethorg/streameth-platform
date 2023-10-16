import { handleKeyPress } from '@/utils'
import React from 'react'

interface FormRadioBoxProps {
  checked?: boolean
  onChange: (value: string | number | readonly string[] | undefined) => void
  label: string
  buttonHeight?: string
  buttonWidth?: string
  labelClassName?: string
  disabled?: boolean
  value?: string | number | readonly string[] | undefined
  name?: string
}

const FormRadioBox = ({ checked, onChange, label, value, name, labelClassName = '', disabled }: FormRadioBoxProps) => {
  return (
    <div
      onClick={() => onChange(value)}
      className={`border-2 rounded-lg py-2 px-4 border-dashed cursor-pointer hover:border-solid ${checked ? 'border-green' : 'border-red-500'} ${
        disabled ? 'pointer-events-none' : ''
      }`}
      onKeyDown={(event) => handleKeyPress(event, [' ', 'Enter'], () => onChange(value))}
      tabIndex={0}>
      <input type="radio" checked={checked} name={name} hidden aria-hidden value={value} readOnly />
      {label && <div className={`${labelClassName} `}>{label}</div>}
    </div>
  )
}

export default FormRadioBox
