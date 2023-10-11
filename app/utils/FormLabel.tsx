import React from 'react'
import ToolTipIcon from '../assets/icons/ToolTipIcon'

interface FormLabelProps {
  id?: string
  label: string
  required?: boolean
  toolTip?: boolean
  toolTipHTML?: string
}

const FormLabel = ({ label, id, required, toolTip, toolTipHTML }: FormLabelProps) => {
  return (
    <label className="text-lg text-accent flex items-center gap-1 mb-2" data-hover={toolTip ? toolTipHTML : ''} htmlFor={id}>
      {label}
      {toolTip && <ToolTipIcon className="mb-1 cursor-pointer" />}
      {required && <span className="text-red-500">*</span>}
    </label>
  )
}

export default FormLabel
