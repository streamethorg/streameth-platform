import { type MutableRefObject } from 'react'

const uploadVideo = (
  video: File,
  url: string,
  abortControllerRef: MutableRefObject<AbortController>,
  onProgress: (percentage: number) => void,
  onSucess: () => void
) => {
  const xhr = new XMLHttpRequest()

  abortControllerRef.current.signal.addEventListener('abort', () => {
    console.log('Aborting upload')
    xhr.abort()
  })
  xhr.open('PUT', url, true)
  xhr.setRequestHeader(
    'Authorization',
    `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`
  )
  xhr.setRequestHeader('Content-Type', video.type)

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percentage = Math.round(
        (event.loaded / event.total) * 100
      )
      onProgress(percentage)
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Video uploaded successfully!')
      onSucess()
      return
    }
    console.error(`Upload failed with status: ${xhr.status}`)
    console.error(xhr.response)
  }

  xhr.onerror = () => {
    console.error('Error during video upload:', xhr.statusText)
  }

  xhr.send(video)
}

export default uploadVideo
