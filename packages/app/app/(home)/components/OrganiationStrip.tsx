import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import VideoGrid from '../../../components/misc/Videos'
import { fetchAllSessions } from '@/lib/data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { IOrganization } from 'streameth-server/model/organization'

export default async function OrganizationStrip({
  organization,
}: {
  organization: IOrganization
}) {
  const videos = (
    await fetchAllSessions({
      organization: organization.id,
      onlyVideos: true,
    })
  ).sessions

  if (videos.length === 0) return false
  return (
    <div key="organization.id" className="bg-white flex flex-col">
      <div className="flex flex-row md:hidden my-2">
        <CardTitle className="text-background text-2xl">
          {organization.name}
        </CardTitle>
        <Link
          href={'/archive?organization=' + organization.id}
          className=" ml-auto">
          <Button className="">all videos</Button>
        </Link>
      </div>
      <div className="flex flex-row overflow-y-scroll gap-4 h-full">
        <Card className="hidden w-72 md:w-[20%] md:flex flex-col bg-white border-background">
          <CardHeader>
            <Image
              className="rounded m-auto"
              alt="Session image"
              quality={80}
              src={organization.logo}
              height={64}
              width={64}
            />
            <CardTitle className="text-background text-center">
              {organization.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="hidden md:block text-background pt-0 md:pt-0 max-h-[100px] overflow-scroll">
            {organization.description}
          </CardContent>
          <CardFooter className=" mt-auto justify-self-end">
            <Link
              href={'/archive?organization=' + organization.id}
              className="w-full ">
              <Button className="w-full ">Watch all videos</Button>
            </Link>
          </CardFooter>
        </Card>
        <div className="w-[80%]">
          <VideoGrid videos={videos} maxVideos={7} />
        </div>
      </div>
    </div>
  )
}
