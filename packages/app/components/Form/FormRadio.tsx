import { a11yEnterKeyPress } from '@/utils'
import React from 'react'
import RadioButtonSolidIcon from '../icons/RadioButtonSolidIcon'

interface FormRadioProps {
  checked?: boolean
  onChange: (value: boolean | undefined) => void
  label: string
  buttonHeight?: string
  buttonWidth?: string
  labelClassName?: string
  disabled?: boolean
  value?: boolean
}

const FormRadio = ({
  checked,
  onChange,
  label,
  value,
  labelClassName = '',
  buttonHeight = '15',
  buttonWidth = '15',
  disabled,
}: FormRadioProps) => {
  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => a11yEnterKeyPress(e, () => onChange(value))}
      onClick={() => onChange(value)}
      className={`flex items-center cursor-pointer ${
        disabled ? 'pointer-events-none' : ''
      }`}>
      <div className="border border-medGrey rounded-full px-2">
        <RadioButtonSolidIcon
          height={buttonHeight}
          width={buttonWidth}
          checked={checked}
        />
      </div>

      {label && (
        <div className={`ml-[10px] ${labelClassName}`}>{label}</div>
      )}
    </div>
  )
}

export default FormRadio
