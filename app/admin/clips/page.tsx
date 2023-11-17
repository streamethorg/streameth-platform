import { Overview } from './components/Overview'

export default async function Page() {
  const res = await fetch(
    `https://livepeer.studio/api/asset?filters=[{"id":"sourceType","value":"clip"}]`,
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

  // filter out some early test data
  const filtered = data
    ? data.filter(
        (clip: any) =>
          clip.name.startsWith('clip-') &&
          clip.sessionId !== 'b3fa9672-97c9-4a50-86fd-cf5c3609f4de' &&
          clip.createdAt > 1699100000000
      )
    : [] // Nov 4

  return <Overview clips={filtered} />
}
