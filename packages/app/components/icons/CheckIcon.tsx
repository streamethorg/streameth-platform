import colors from '@/constants/colors'
import React from 'react'

const CheckIcon = ({ pathFill = colors.blue }) => {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 7.51562L6.5 12.5L16.5 1.625"
        stroke={pathFill}
        stroke-opacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default CheckIcon
