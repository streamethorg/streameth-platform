import { loadFont } from '@remotion/google-fonts/Vollkorn'

const { fontFamily } = loadFont()

function Text({
  text,
  x,
  y,
  color = 'black',
  fontWeight = 400,
  fontSize = 60,
  opacity = 1,
}: {
  text: string
  x: number
  y: number
  color?: string
  fontWeight?: number
  fontSize?: number
  fontFamily?: string
  opacity?: number
}) {
  const lines = text.split('\n').map((line, i) => <div key={i}>{line}</div>)
  return (
    <div
      style={{
        color,
        transform: `translateX(${x}px) translateY(${y}px)`,
        fontSize,
        fontFamily,
        fontWeight,
        opacity,
      }}>
      {lines}
    </div>
  )
}

export default Text
