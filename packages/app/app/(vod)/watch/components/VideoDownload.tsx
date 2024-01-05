import React, { useEffect, useState } from 'react'

const VideoDownload = ({
  title,
  playbackId,
  closeModal,
}: {
  closeModal: () => void
  title?: string
  playbackId?: string
}) => {
  const [url, setUrl] = useState('')
  const [loading, setIsLoading] = useState(false)

  const getVideoUrl = () => {
    setIsLoading(true)
    fetch(`/api/video-download?playbackId=${playbackId}`)
      .then((response) => response.json())
      .then((data) => {
        setUrl(data.meta.source[0].url)
        const downloadLink = document.createElement('a')
        downloadLink.href = data.meta.source[0].url
        downloadLink.download = title
          ? title + '.mp4'
          : 'Download.mp4'
        downloadLink.target = '_blank'
        downloadLink.rel = 'noopener noreferrer'

        // Append the link to the document
        document.body.appendChild(downloadLink)

        // Simulate a click event on the link
        downloadLink.click()

        // Remove the link from the document
        document.body.removeChild(downloadLink)
        setIsLoading(false)
        closeModal()
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (playbackId) getVideoUrl()
  }, [])

  return (
    <div className="w-[380px] p-5 text-white bg-base mx-auto">
      <div className="flex justify-center text-center flex-col gap-10">
        <p className="text-2xl">
          {loading
            ? 'Fetching download link...'
            : !url
            ? 'Fetch Failed'
            : 'Downloading...'}
        </p>
      </div>
    </div>
  )
}

export default VideoDownload
