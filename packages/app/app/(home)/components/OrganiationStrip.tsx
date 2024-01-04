import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import VideoGrid from './Videos'
import { fetchAllSessions } from '@/lib/data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function OrganizationStrip({
  organization,
}: {
  organization: any
}) {
  const videos = await fetchAllSessions({
    organization: organization.id,
  })

  return (
    <div key="organization.id" className="bg-white">
      <div className="flex flex-row overflow-y-scroll gap-4 h-full">
        <Card className="w-72 md:w-[20%] flex flex-col bg-white border-background">
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
            <Link href="" className="w-full ">
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
