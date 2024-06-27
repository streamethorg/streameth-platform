'use client'

import { Input } from '@/components/ui/input'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/utils'
import { toast } from 'sonner'
import { Label } from '@radix-ui/react-label'
import { Image as ImageLogo } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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

const ConfirmImageDeletion = ({
  onChange,
  setPreview,
}: {
  onChange: (files: string | null) => void
  setPreview: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <X
          size={24}
          className="bg-white absolute ml-auto z-[9999999999994] text-muted-foreground right-0 border border-muted-foreground rounded-full cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-5 justify-center items-center">
        <p className="text-xl">
          Are you sure you want to remove this image?
        </p>
        <DialogFooter className="flex items-center gap-4">
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChange('')
              setPreview('')
            }}
            variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ImageUpload({
  id,
  placeholder,
  onChange,
  aspectRatio,
  value,
  path,
  className,
  maxSize = 5000000,
  ...rest
}: {
  id?: string
  maxSize?: number
  placeholder?: string
  aspectRatio: number
  onChange: (files: string | null) => void
  value: string | null | undefined
  path: string
  className?: string
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

      if (file.size > maxSize) {
        throw new Error('File size is too big')
      }

      data.set(
        'file',
        new File([file], file.name.replace(/[^a-zA-Z0-9.]/g, '_'), {
          type: file.type,
        })
      )
      data.set('path', path)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      onChange(
        getImageUrl(
          '/' + path + '/' + file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        )
      )
      return 'Image uploaded successfully'
    } catch (e: any) {
      console.error(e)
      setPreview('')

      throw e
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      {isUploading ? (
        <div className={`${className} flex relative flex-col w-full`}>
          Uploading image...
        </div>
      ) : preview ? (
        <div className={`${className} flex relative flex-col w-full`}>
          <ConfirmImageDeletion
            onChange={onChange}
            setPreview={setPreview}
          />
          <div
            className={`w-full h-full relative flex justify-center flex-col items-center `}>
            <Image
              src={preview ?? value}
              className={`${className} z-10`}
              alt="preview"
              fill
            />
          </div>
        </div>
      ) : (
        <>
          <Label
            htmlFor={id}
            className={`${className} flex justify-center flex-col items-center border border-dotted bg-secondary cursor-pointer`}>
            <div className="p-2 text-white rounded-full bg-neutral-400">
              <ImageLogo />
            </div>
            <p className="p-1 w-full text-center lg:w-2/3 text-[12px]">
              {placeholder}
            </p>
          </Label>
          <Input
            id={id}
            type="file"
            accept=".png,.jpg, .jpeg"
            placeholder="Upload image"
            className="hidden"
            onChange={(event) => {
              const { files, displayUrl } = getImageData(event)

              setPreview(displayUrl)
              toast.promise(onSubmit(files[0]), {
                loading: 'Uploading image',
                success: (message) => {
                  toast.success(message)
                  return 'Image uploaded successfully'
                },
                error: (error) => {
                  toast.error(error.message)
                  return error.message || 'Unknown error'
                },
              })
            }}
          />
        </>
      )}
    </>
  )
}
