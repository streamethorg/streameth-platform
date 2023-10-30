import LoadingIcon from '@/app/assets/icons/LoadingIcon'
import PlusCircleIcon from '@/app/assets/icons/PlusCircleIcon'
import FormLabel from '@/app/utils/FormLabel'
import React, { SetStateAction, useRef, useState } from 'react'

interface ImageFileUploaderProps {
  label?: string
  className?: string
  iconClassName?: string
  image?: string
  required?: boolean
  isCircleImage?: boolean
  toolTipHTML?: string
  aspectRatio?: number
  imageKey?: string
  validationErrors?: Record<string, any>
  onImageSubmit: (
    event: Blob,
    key: string,
    setLoading: React.Dispatch<SetStateAction<boolean>>
  ) => void
}

const ImageFileUploader = ({
  label,
  required,
  iconClassName = '',
  className = '',
  image,
  aspectRatio = 16 / 9,
  toolTipHTML = '',
  isCircleImage = false,
  imageKey,
  validationErrors,
  onImageSubmit,
}: ImageFileUploaderProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event?.target?.files?.[0]
    if (!file) return
    setError('')
    setLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img
        const imageAspectRatio = naturalWidth / naturalHeight
        if (
          aspectRatio === naturalWidth ||
          naturalHeight ||
          imageAspectRatio
        ) {
          onImageSubmit(file, imageKey, setLoading)
        } else {
          setError(
            `Aspect ratio does not match the required ${aspectRatio}.`
          )
          setLoading(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      {label && (
        <FormLabel
          label={label}
          required={required}
          toolTip
          toolTipHTML={`Click to edit image. ${toolTipHTML}`}
        />
      )}
      <div
        onClick={handleClick}
        className={`relative hover:opacity-75 cursor-pointer ${
          isCircleImage ? 'rounded-full' : ''
        } ${className}`}>
        <img
          src={loading ? '' : `/events/${image}` ?? ''}
          className={`${
            isCircleImage ? 'rounded-full' : ''
          } w-full h-full`}
        />
        <div
          className={`absolute ${iconClassName} top-[40%] left-[40%] rounded-full bg-gray-300 opacity-75`}>
          {loading ? <LoadingIcon /> : <PlusCircleIcon />}
        </div>
        {loading && (
          <p className="text-medGrey text-center my-1 text-[10px]">
            50% - Loading image..
          </p>
        )}
        <input
          className="hidden"
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept="image/*"
        />
      </div>
      {validationErrors && typeof validationErrors === 'string' && (
        <div className="text-danger mb-4 mt-2">
          {validationErrors}
        </div>
      )}
      {error && <p className="text-danger text-sm my-2">{error}</p>}
    </div>
  )
}

export default ImageFileUploader
