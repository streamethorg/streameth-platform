import { usePathname } from 'next/navigation'
import colors from '@/lib/constants/colors'
import { ReactNode } from 'react'
interface Props {
  children: ReactNode
  accentColor?: string
}

const ColorComponent = ({ children, accentColor }: Props) => {
  if (accentColor) {
    document.documentElement.style.setProperty(
      '--colors-accent',
      accentColor
    )
  } else {
    document.documentElement.style.setProperty(
      '--colors-accent',
      colors.accent
    )
  }

  return children
}

export default ColorComponent
