import { Stream } from '@livepeer/react'
import StreamOverview from './components/StreamOverview'

export default async function Page() {
  const res = await fetch(
    `https://livepeer.studio/api/stream?streamsonly=true`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STUDIO_API_KEY}`, // ONLY use on Server actions - NOT client side
      },
    }
  )

  const data = await res.json()
  if (!data || data.errors) {
    console.error(data.errors)
    return null
  }

  const filtered = data ? data.filter((i: any) => i.isActive) : []

  return <StreamOverview streams={filtered} />
}
