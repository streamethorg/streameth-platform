'use client'

import { Input } from '@/components/ui/input'
import { ChangeEvent, useState } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import { X } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/utils'
import { toast } from 'sonner'

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer()

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  )

  const files = dataTransfer.files
  const displayUrl = URL.createObjectURL(event.target.files![0])
  return { files, displayUrl }
}

export default function ImageUpload({
  onChange,
  aspectRatio,
  value,
  path,
  ...rest
}: {
  aspectRatio: number
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
      // handle the error
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

  return (
    <>
      {isUploading ? (
        <div className="text-sm">Uploading image...</div>
      ) : preview ? (
        <div className="flex relative flex-col w-full">
          <X
            size={24}
            className="relative ml-auto z-[9999999999994]"
            onClick={() => {
              onChange(null)
              setPreview('')
            }}
          />
          <AspectRatio ratio={aspectRatio} className="relative">
            <Image
              src={preview ?? value}
              className="z-10"
              alt="preview"
              fill
            />
          </AspectRatio>
        </div>
      ) : (
        <Input
          type="file"
          accept=".png,.jpg"
          {...rest}
          onChange={(event) => {
            const { files, displayUrl } = getImageData(event)
            setPreview(displayUrl)
            onSubmit(files[0])
          }}
        />
      )}
    </>
  )
}
