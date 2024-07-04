import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GoogleRedirect = ({
  searchParams,
}: {
  searchParams: { channelId: string }
}) => {
  return (
    <div className="container mx-auto max-w-5xl space-y-2 p-12 text-black">
      <h3 className="text-3xl font-bold">
        Enable live streaming on YouTube
      </h3>
      <p>
        To stream and repurpose content to YouTube, YouTube requires
        you to enable live streaming on your channel. To do this,
        follow these steps:{' '}
      </p>
      <p>1. Go to your YouTube live dashboard</p>
      <Link
        href={`https://studio.youtube.com/channel/${searchParams.channelId}/livestreaming?`}>
        <Button className="my-4">Open Youtube Live Dashboard</Button>
      </Link>
      <p>2. Follow YouTube&apos;s steps to enable live streaming.</p>
      <Image
        src="/images/youtube-tutorial.png"
        alt="YouTube Streaming Guide"
        className="py-4"
        width={1280}
        height={720}
      />
      <p>
        3. Once live streaming is enabled, return to StreamEth and
        connect again. It often takes 24-48 hours to be approved.
      </p>

      <p className="mt-24">
        Having issues?{' '}
        <a
          target="_blank"
          className="font-medium text-primary underline"
          rel="noopener noopener"
          href="https://t.me/+p7TgdE06G-4zZDU0">
          Contact Us
        </a>
      </p>
      <div className="mt-48">
        <Footer />
      </div>
    </div>
  )
}

export default GoogleRedirect
