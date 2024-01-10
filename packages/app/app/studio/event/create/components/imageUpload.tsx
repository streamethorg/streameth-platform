'use client'
import { Input } from '@/components/ui/input'

import { ChangeEvent, useState } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getImageUrl } from '@/lib/utils'
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
  ...rest
}: {
  aspectRatio: number
  onChange: (files: string | null) => void
  value: string | null
}) {
  const [preview, setPreview] = useState(
    value ? getImageUrl('/events/' + value) : ''
  )
  return (
    <>
      {preview ? (
        <div className="relative flex flex-col w-full">
          <XMarkIcon
            className="z-[9999999999994] relative ml-auto h-6 w-6"
            onClick={() => {
              onChange(null)
              setPreview('')
            }}
          />
          <AspectRatio ratio={aspectRatio} className="relative">
            <Image
              src={preview}
              className="z-10"
              alt="preview"
              fill
            />
          </AspectRatio>
        </div>
      ) : (
        <Input
          type="file"
          {...rest}
          onChange={(event) => {
            const { files, displayUrl } = getImageData(event)
            setPreview(displayUrl)
            onChange(files[0].name)
          }}
        />
      )}
    </>
  )
}
