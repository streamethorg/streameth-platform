import { type MutableRefObject } from 'react'

const uploadVideo = (
  video: File,
  url: string,
  abortControllerRef: MutableRefObject<AbortController>,
  onProgress: (percentage: number) => void
) => {
  const formData = new FormData()
  formData.append('file', video)
  formData.append('url', url)

  const xhr = new XMLHttpRequest()

  abortControllerRef.current.signal.addEventListener('abort', () => {
    console.log('Aborting upload')
    xhr.abort()
  })
  xhr.open('POST', '/api/upload-video', true)

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
      return
    }
    console.error(`Upload failed with status: ${xhr.status}`)
    console.error(xhr.response)
  }

  xhr.onerror = () => {
    console.error('Error during video upload:', xhr.statusText)
  }

  xhr.send(formData)
}

export default uploadVideo
