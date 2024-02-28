import { Livepeer } from 'livepeer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const video: File | null = data.get('file') as unknown as File

  if (!video) {
    return NextResponse.json({ success: false, status: 400 })
  }

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const asset = await livepeer.asset.create({ name: video.name })
  const response = await fetch(asset.object!.url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
      'Content-Type': video.type,
    },
    body: video,
  })

  if (!response.ok) {
    return NextResponse.json({
      success: false,
      status: response.status,
    })
  }

  return NextResponse.json({
    success: true,
  })
}
