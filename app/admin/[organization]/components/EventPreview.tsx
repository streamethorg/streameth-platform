import { IEvent } from '@/server/model/event'
import React, { useEffect } from 'react'
import Image from 'next/image'
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'
import colors from '@/app/constants/colors'
import { Button } from '@/app/utils/Button'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ItemButton = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row justify-center">
    <button className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">
      {children}
    </button>
  </div>
)

const pages = [
  {
    name: 'Home',
    icon: <HomeIcon />,
  },
  {
    name: 'Schedule',
    icon: <CalendarIcon />,
  },
  {
    name: 'Speakers',
    icon: <UserGroupIcon />,
  },
  {
    name: 'Streams',
    icon: <CameraIcon />,
  },
]

interface EventPreviewProps {
  formData: Omit<IEvent, 'id'>
  closeModal: () => void
  handleSubmit: () => void
}

const EventPreview = ({
  formData,
  handleSubmit,
  closeModal,
}: EventPreviewProps) => {
  useEffect(() => {
    if (formData.accentColor) {
      document.documentElement.style.setProperty(
        '--colors-accent',
        formData?.accentColor
      )
    }
    return () => {
      document.documentElement.style.setProperty(
        '--colors-accent',
        colors.accent
      )
    }
  }, [formData.accentColor])

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="w-20 items-center flex">
          <span className="sr-only">Logo</span>
          <Image
            src={'/events/' + formData?.logo}
            className=""
            alt="logo"
            width={50}
            height={50}
          />
        </div>
        <div className="flex gap-4 flex-row">
          <Button variant="outline" onClick={() => closeModal()}>
            Edit Event
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
      <div className="flex flex-row w-screen lg:overflow-hidden h-full">
        <div className="text-main-text text-center my-1 space-x-0 gap-3 text-md font-medium flex flex-col">
          {pages.map((item) => (
            <div
              key={item.name}
              className={`py-1 cursor-pointer hover:text-gray-300 ${
                item == pages[0]
                  ? 'bg-accent text-primary'
                  : 'text-accent'
              } rounded`}>
              <div className="w-6 h-6 lg:w-8 lg:h-8 m-auto p-1">
                {item.icon}
              </div>
              <p className="">{item.name}</p>
            </div>
          ))}
        </div>

        <div
          className={`flex w-full ${
            formData?.archiveMode
              ? ' lg:w-full'
              : 'lg:w-[calc(100%-5rem)]'
          } ml-auto bg-background`}>
          <div className="flex flex-col w-full h-full gap-4">
            <div className="relative w-full">
              <div className="relative">
                <Image
                  src={'/events/' + formData?.banner}
                  alt="Event Cover"
                  width={1500}
                  height={500}
                  className="w-full object-cover h-36 md:h-52 lg:h-96"
                />
                <Image
                  src={'/events/' + formData?.logo}
                  alt="Event Logo"
                  width={128}
                  height={128}
                  className="absolute bottom-0 translate-y-1/2 translate-x-3 lg:translate-x-1/2 w-24 h-24 lg:w-32 lg:h-32 object-cover bg-white"
                />
              </div>
            </div>

            <div className="flex-col mt-0 flex max-w-4xl mb-12 mx-auto p-4 bg-white  space-y-4 ">
              <h1 className="font-bold text-4xl">{formData?.name}</h1>
              <article className="prose prose-gray">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {formData?.description}
                </Markdown>
              </article>
              <div className="flex flex-row flex-wrap justify-center items-center p-4">
                <ItemButton>Watch Livestream</ItemButton>
                <ItemButton>Schedule</ItemButton>
                <ItemButton>Speakers</ItemButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventPreview
