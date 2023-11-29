import { ReactNode } from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion'

const MoveObject = ({
  x,
  y,
  durationInSeconds,
  children,
}: {
  x: number
  y: number
  durationInSeconds: number
  children: ReactNode
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const progress = Math.min(frame / (durationInSeconds * fps), 1)

  const transitionX = interpolate(progress, [0, 1], [0, x], {
    easing: Easing.inOut(Easing.ease),
  })

  const transitionY = interpolate(progress, [0, 1], [0, y], {
    easing: Easing.inOut(Easing.ease),
  })

  return (
    <>
      <div
        style={{
          transform: `translate(${transitionX}px, ${transitionY}px)`,
        }}>
        {children}
      </div>
    </>
  )
}

export default MoveObject
