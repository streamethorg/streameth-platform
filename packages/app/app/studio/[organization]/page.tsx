'use server'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const OrganizationPage = async ({
  params,
}: {
  params: { organization: string }
}) => {
  return (
    <div className="h-full w-full flex flex-row ">
      <div className="h-full w-full">
        <div className="grid grid-rows-2 grid-cols-3 p-4 gap-4 max-w-5xl">
          <Card className="text-white bg-gradient-to-br from-[#3D22BA] to-[#6426EF] w-full h-full col-span-2 ">
            <CardHeader>
              <CardTitle>Upload video</CardTitle>
              <CardDescription className="text-white max-w-[300px]">
                Upload and manage video content on your organization’s
                page.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={`/studio/${params.organization}/library`}>
                <Button className="bg-white text-black">
                  Upload Video
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="text-white min-h-full w-full m-auto border-secondary col-span-1 bg-gradient-to-b from-[#1E293B] to-[#000000] ">
            <CardHeader>
              <CardTitle>Create NFT</CardTitle>
              <CardDescription className="text-white">
                Create NFTs from your video content and share them
                with your community.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={`/studio/${params.organization}/nfts`}>
                <Button variant="primary">Upload Video</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="text-white min-h-full w-full m-auto border-secondary col-span-1 bg-gradient-to-b from-[#1E293B] to-[#000000] ">
            <CardHeader>
              <CardTitle>Clip a livestream</CardTitle>
              <CardDescription className="text-white">
                Clip livestreams to share with your community.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={`/studio/${params.organization}/clips`}>
                <Button variant="primary">Clip Livestream</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="text-white bg-gradient-to-br from-[#3D22BA] to-[#6426EF] w-full h-full col-span-2 ">
            <CardHeader>
              <CardTitle>Start a livestream</CardTitle>
              <CardDescription className="text-white max-w-[300px]">
                Stream your event without restrictions to millions of
                views globally.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={`/studio/${params.organization}/livestreams?show=true`}>
                <Button className="bg-white text-black">
                  Start a Livestream
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPage
