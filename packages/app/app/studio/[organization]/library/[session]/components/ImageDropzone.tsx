'use client'

import Image from 'next/image'
import { ImageUp, X } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/utils'
import { toast } from 'sonner'
import { useCallback, useState, forwardRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageDropzoneProps {
  id?: string
  placeholder?: string
  onChange: (files: string | null) => void
  value: string | null | undefined
  path: string
}

function getImageData(file: File) {
  const dataTransfer = new DataTransfer()

  dataTransfer.items.add(file)

  const files = dataTransfer.files
  const displayUrl = URL.createObjectURL(file)
  return { files, displayUrl }
}

const ImageDropzone = forwardRef<HTMLDivElement, ImageDropzoneProps>(
  (props, ref) => {
    const { onChange, value, path, ...rest } = props
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
      maxSize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 1,
      onDrop,
    })

    return (
      <div ref={ref} {...rest}>
        {isUploading ? (
          <div className="z-10 flex h-40 items-center justify-center border border-dashed border-gray-400 bg-white transition">
            <div className="text-sm">Uploading image...</div>
          </div>
        ) : preview ? (
          <>
            <X
              size={24}
              className="z-[9999999999994] ml-auto cursor-pointer rounded-md hover:bg-gray-300"
              onClick={() => {
                onChange(null)
                setPreview('')
              }}
            />
            <div className="z-10 flex h-40 items-center justify-center border border-dashed border-gray-400 bg-white transition">
              <Image
                src={preview ?? value}
                alt="preview"
                quality={50}
                width={150}
                height={150}
              />
            </div>
          </>
        ) : (
          <div
            {...getRootProps()}
            className="z-10 flex h-40 cursor-pointer flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed border-gray-300 bg-white text-sm transition-colors hover:bg-gray-200">
            <ImageUp size={35} />
            <input {...getInputProps()} />
            <div className="mx-4">
              <p>
                Drag and drop your thumbnail to upload... Or just
                click here!
              </p>
              <p>
                Maximum image file size is 1MB. Best resolution of
                1920 x 1080. Aspect ratio of 16:9
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }
)

ImageDropzone.displayName = 'ImageDropzone'

export default ImageDropzone
