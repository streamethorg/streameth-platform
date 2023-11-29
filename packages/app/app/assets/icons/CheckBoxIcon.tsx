import colors from '@/app/constants/colors'
import { IconProps } from '@/app/types'
import React from 'react'

const CheckBoxSolid = ({
  className = '',
  checked,
  height = '20',
  width = '20',
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <rect
        x="0.5"
        y="0.5"
        rx="3"
        width="19"
        height="19"
        fill="white"
        stroke="#3A4D81"
      />
      <path
        d="M16.8984 5.09346C17.3003 5.48413 17.3003 6.11544 16.8984 6.50611L8.66942 14.507C8.26761 14.8977 7.61829 14.8977 7.21648 14.507L3.10106 10.5066C2.69938 10.1159 2.69938 9.48456 3.10106 9.09389C3.50281 8.70323 4.15406 8.70323 4.55587 9.09389L7.91402 12.3849L15.4455 5.09346C15.8473 4.70216 16.4966 4.70216 16.8984 5.09346Z"
        fill={checked ? colors.blue : ''}
      />
    </svg>
  )
}

export default CheckBoxSolid
