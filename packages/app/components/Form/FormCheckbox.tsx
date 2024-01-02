import { listenPressOnElement } from '@/lib/utils'
import React from 'react'
import CheckBoxSolid from '../icons/CheckBoxIcon'

interface FormCheckboxProps {
  checked?: boolean
  onChange: (value: boolean | undefined) => void
  label: string
  buttonHeight?: string
  buttonWidth?: string
  className?: string
  labelClassName?: string
  disabled?: boolean
  value?: boolean
}

const FormCheckbox = ({
  checked,
  onChange,
  label,
  className = '',
  labelClassName = '',
  disabled,
}: FormCheckboxProps) => {
  return (
    <div
      className={`cursor-pointer position-relative ${
        disabled ? 'pointer-events-none' : ''
      } ${className}`}>
      <div
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(event) =>
          listenPressOnElement(event, () => onChange(!checked))
        }
        className="flex items-center">
        <span className="mr-3 netone-form-checkbox">
          <CheckBoxSolid checked={checked} />
        </span>

        {label && (
          <div
            style={{
              overflowWrap: 'break-word',
            }}
            className={`${labelClassName} text-blue`}>
            {label}
          </div>
        )}
      </div>
    </div>
  )
}

export default FormCheckbox
