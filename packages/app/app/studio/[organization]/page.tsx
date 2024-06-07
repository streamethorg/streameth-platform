'use server'

import {
  CalendarDays,
  Videotape,
  Radio,
  ScissorsLineDashed,
  Home,
  ImageIcon,
  Settings,
  CameraIcon,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Livestreams, Loading } from './livestreams/page'
import {
  IExtendedStage,
  LivestreamPageParams,
  eSort,
} from '@/lib/types'
import CreateLivestreamModal from './livestreams/components/CreateLivestreamModal'
import { Suspense } from 'react'
import { fetchOrganization } from '@/lib/services/organizationService'
const OrganizationPage = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization  = await fetchOrganization({
    organizationSlug: params.organization
  })

  if (!organization) return <></>

  return (
    <div className="h-full w-full flex flex-row ">
      <div className="h-full w-full p-12 flex flex-col">
        <h2 className="text-lg font-bold">Create</h2>
        <div className="grid grid-rows-1 grid-cols-4 gap-4 max-w-5xl py-4">
          <CreateLivestreamModal
            show={searchParams?.show}
            organization={organization}
          />
          <Link href={`/studio/${params.organization}/library`}>
            <div className="flex flex-row bg-white p-2 rounded-xl  border space-x-4 items-center">
              <div className="p-4 border bg-primary  rounded-xl text-white">
                <CameraIcon className="h-6" />
              </div>
              <span className=" ">Upload Video</span>
            </div>
          </Link>
          <Link href={`/studio/${params.organization}/library`}>
            <div className="flex flex-row bg-white p-2 rounded-xl  border space-x-4 items-center">
              <div className="p-4 border bg-primary  rounded-xl text-white">
                <CameraIcon className="h-6" />
              </div>
              <span className=" ">Upload Video</span>
            </div>
          </Link>
          <Link href={`/studio/${params.organization}/library`}>
            <div className="flex flex-row bg-white p-2 rounded-xl  border space-x-4 items-center">
              <div className="p-4 border bg-primary  rounded-xl text-white">
                <CameraIcon className="h-6" />
              </div>
              <span className=" ">Upload Video</span>
            </div>
          </Link>
        </div>
        <span className='py-4 font-bold text-lg'>Livestreams</span>
        <Suspense
          key={searchParams.toString()}
          fallback={<Loading />}>
          <Livestreams params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default OrganizationPage
