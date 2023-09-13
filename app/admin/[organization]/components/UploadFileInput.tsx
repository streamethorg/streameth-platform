'use client'
import { useEffect, useState } from 'react'
import { apiUrl } from '@/server/utils'

export function UploadFileInput({
  organizationId,
  onFileUpload,
}: {
  organizationId: string
  onFileUpload: (fileName: string) => void
}) {
  const [file, setFile] = useState<File>()
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async () => {
    if (!file) return

    setLoading(true)

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch(
        `${apiUrl()}/organizations/${organizationId}/events/upload`,
        {
          method: 'POST',
          body: data,
        }
      )
      // handle the error
      if (!res.ok) throw new Error(await res.text())
    } catch (e: any) {
      // Handle errors here
      console.error(e)
    } finally {
      setLoading(false)
      onFileUpload(file.name)
    }
  }

  useEffect(() => {
    if (!file) return
    onSubmit()
  }, [file])

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      {loading && <p>Uploading...</p>}
    </div>
  )
}

export default UploadFileInput
