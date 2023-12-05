import React, { ReactNode } from 'react'
import ToolTipIcon from '../icons/ToolTipIcon'

interface FormLabelProps {
  id?: string
  label: string
  required?: boolean
  toolTip?: boolean
  toolTipHTML?: string
  labelClassName?: string
  renderSecondaryLabel?: ReactNode
}

const FormLabel = ({
  label,
  id,
  required,
  toolTip,
  toolTipHTML,
  labelClassName = '',
  renderSecondaryLabel,
}: FormLabelProps) => {
  return (
    <label
      className={`relative text-lg text-blue flex items-center justify-between gap-1 mb-2 ${labelClassName} ${
        toolTip && toolTipHTML
          ? 'before:content-[attr(data-hover)] before:w-[250px] before:invisible before:absolute before:left-[90px] before:-top-[30px] before:rounded-md before:bg-white before:transition-opacity before:z-40 before:px-4 before:py-1 before:text-sm before:border-1 before:text-center before:text-medGrey before:shadow-md before:opacity-0 hover:before:opacity-100 hover:before:visible'
          : ''
      }`}
      data-hover={toolTip ? toolTipHTML : ''}
      htmlFor={id}>
      <div className="flex items-center gap-1 mb-1">
        {label}
        {toolTip && <ToolTipIcon className="mb-1 cursor-pointer" />}
        {required && <span className="text-red-500">*</span>}
      </div>
      {renderSecondaryLabel && <div>{renderSecondaryLabel}</div>}
    </label>
  )
}

export default FormLabel
