import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer'
import { webpackOverride } from '../webpack-override'
import { RenderMediaOnProgress } from '@remotion/renderer'

let lastProgressPrinted = -1

const onProgress: RenderMediaOnProgress = ({ progress }) => {
  const progressPercent = Math.floor(progress * 100)

  if (progressPercent > lastProgressPrinted) {
    console.log(`Rendering is ${progressPercent}% complete`)
    lastProgressPrinted = progressPercent
  }
}

const start = async () => {
  console.log('Find compositions...')
  const bundled = await bundle({
    entryPoint: join(process.cwd(), 'src', 'index.ts'),
    webpackOverride: (config) => webpackOverride(config),
  })

  const compositions = await getCompositions(bundled)
  console.log('Compositions', compositions)
  for (const composition of compositions.filter((c) => c.id.includes('devconnect'))) {
    console.log(`Rendering ${composition.id}...`)

    await renderMedia({
      codec: 'h264',
      composition,
      serveUrl: bundled,
      outputLocation: `assets/intros/${composition.id}.mp4`,
      onProgress,
    })

    await renderStill({
      composition,
      serveUrl: bundled,
      frame: 290,
      output: `assets/stills/${composition.id}.png`,
    })

    lastProgressPrinted = -1
  }

  return
}
start()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
