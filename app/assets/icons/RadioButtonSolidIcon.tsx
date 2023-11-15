import colors from '@/app/constants/colors'
import React from 'react'

interface Props {
  checked?: boolean
  height?: string
  width?: string
  className?: string
  pathFill?: string
}

const RadioButtonSolidIcon = ({
  pathFill = colors.blue,
  height = '35',
  width = '35',
  className = '',
  checked,
}: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <circle
        cx="17.5"
        cy="17.5"
        r="17"
        fill={checked ? pathFill : ''}
        stroke={!checked ? colors.accent : ''}
      />
    </svg>
  )
}

export default RadioButtonSolidIcon
