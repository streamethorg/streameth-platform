import { Overview } from "./components/Overview"

export default async function Page() {
  const res = await fetch(`https://livepeer.studio/api/asset/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STUDIO_API_KEY}`,
    },
  })

  const data = await res.json()
  if (data.errors) {
    console.error(data.errors)
  }
  
  return <Overview clips={data ?? []} />
}
