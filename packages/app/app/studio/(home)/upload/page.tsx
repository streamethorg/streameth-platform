'use client'

import {
  ContextMenu,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useRef } from 'react'
import CreateOrganization from '../components/CreateOrganizationForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// TODO: No drag and drop for phone

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col p-4 w-full h-full">
      <div className="flex justify-between items-center mb-20">
        <h1>Studio</h1>
        <div className="flex items-center">
          <CreateOrganization />
          <Link href={'/studio/user'}>
            <div className="mx-3 w-10 h-10 bg-black rounded-full"></div>
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <ContextMenu>
          <ContextMenuTrigger className="flex flex-col justify-center items-center p-4 text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed h-[550px] w-[700px]">
            <h1 className="mb-2 text-center">
              Drag and drop videos anywhere in this box.
            </h1>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="video/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  console.log('Selected file:', file.name)
                }
              }}
            />
            <Button onClick={handleButtonClick}>
              Upload video...
            </Button>
          </ContextMenuTrigger>
        </ContextMenu>
      </div>
    </div>
  )
}

export default Upload
