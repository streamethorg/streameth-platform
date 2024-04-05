'use client'

import Image from 'next/image'
import { FileUp, X } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/utils'
import { toast } from 'sonner'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

function getImageData(file: File) {
  const dataTransfer = new DataTransfer()

  dataTransfer.items.add(file)

  const files = dataTransfer.files
  const displayUrl = URL.createObjectURL(file)
  return { files, displayUrl }
}

export default function ImageDropzone({
  onChange,
  value,
  path,
  ...rest
}: {
  id?: string
  placeholder?: string
  onChange: (files: string | null) => void
  value: string | null | undefined
  path: string
}) {
  const [preview, setPreview] = useState(
    value ? getImageUrl('/' + path + '/' + value) : ''
  )
  const [isUploading, setIsUploading] = useState(false)

  const onSubmit = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    try {
      const data = new FormData()
      data.set('file', file)
      data.set('path', path)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      onChange(getImageUrl('/' + path + '/' + file.name))
      toast.success('Image uploaded successfully')
      setIsUploading(false)
    } catch (e: any) {
      // Handle errors here
      setIsUploading(false)
      toast.error('Error uploading image')
      console.error(e)
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const { displayUrl } = getImageData(acceptedFiles[0])

        setPreview(displayUrl)
        onSubmit(acceptedFiles[0])
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    onDrop,
  })

  return (
    <>
      {isUploading ? (
        <div className="flex z-10 justify-center items-center h-52 bg-white border border-gray-400 border-dashed transition">
          <div className="text-sm">Uploading image...</div>
        </div>
      ) : preview ? (
        <>
          <X
            size={24}
            className="ml-auto rounded-md cursor-pointer hover:bg-gray-300 z-[9999999999994]"
            onClick={() => {
              onChange(null)
              setPreview('')
            }}
          />
          <div className="flex z-10 justify-center items-center h-52 bg-white border border-gray-400 border-dashed transition">
            <Image
              src={preview ?? value}
              alt="preview"
              quality={60}
              width={150}
              height={150}
            />
          </div>
        </>
      ) : (
        <div
          {...getRootProps()}
          className="flex flex-col justify-center items-center space-y-4 h-52 text-sm bg-white rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-square">
          <FileUp size={65} />
          <input {...getInputProps()} />
          <div className="mx-4">
            <p>
              Drag and drop your thumbnail to upload... Or just click
              here!
            </p>
            <p>
              Maximum image file size is 1MB. Best resolution of 200 x
              200. Aspect ratio of 1:1
            </p>
          </div>
        </div>
      )}
    </>
  )
}
