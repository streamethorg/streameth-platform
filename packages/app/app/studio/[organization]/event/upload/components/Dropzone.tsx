import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'

const Dropzone = ({
  setSelectedFile,
  handleUpload,
}: {
  setSelectedFile: (file: File) => void
  handleUpload: (file: File) => void
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setSelectedFile(file)
      }
    },
    [setSelectedFile]
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['*.mp4'],
    },
    maxFiles: 1,
    onDrop,
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 h-[550px] w-[700px]">
      <FileUp className={'my-4'} size={65} />
      <input
        {...getInputProps()}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            handleUpload(file)
          }
        }}
      />
      <p>Drag and drop videos to upload... Or just click here!</p>
    </div>
  )
}

export default Dropzone
