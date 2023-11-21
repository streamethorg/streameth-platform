import { join } from 'path'
import { bundle } from '@remotion/bundler'
import { getCompositions, renderMedia } from '@remotion/renderer'
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
  })

  console.log('Fetching compositions...')
  const compositions = await getCompositions(bundled)

  if (compositions) {
    for (const composition of compositions) {
      if (!composition.id.includes('secureum')) {
        continue
      }
      console.log(`Started rendering ${composition.id}`)
      await renderMedia({
        codec: 'h264',
        composition,
        serveUrl: bundled,
        outputLocation: `out/sessions/${composition.id}.mp4`,
        videoBitrate: '3M',
        onProgress,
      })
      lastProgressPrinted = -1
    }
  }
}
start()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
