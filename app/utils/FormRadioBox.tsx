import { handleKeyPress } from '@/utils'
import React from 'react'
import colors from '../constants/colors'

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
  theme?: string
}

const FormRadioBox = ({ checked, onChange, label, value, name, labelClassName = '', disabled, theme = colors.accent }: FormRadioBoxProps) => {
  return (
    <div
      onClick={() => onChange(value)}
      className={`border-2 w-fit rounded-lg border-green py-2 px-4  cursor-pointer hover:border-solid ${checked ? 'border-solid' : 'border-dashed'} ${
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
