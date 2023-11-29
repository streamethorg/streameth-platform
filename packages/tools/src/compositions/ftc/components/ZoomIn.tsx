import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion'

interface Props {
  image: string
}

const SpringIn = (props: Props) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    fps,
    frame: frame - 15,
    config: {
      mass: 0.8,
    },
  })

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <Img src={staticFile(props.image)} />
    </div>
  )
}

export default SpringIn
