import { Livepeer } from 'livepeer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const video: File | null = data.get('file') as unknown as File
    const url: string | null = data.get('url') as unknown as string

    if (!video) {
      return NextResponse.json({ success: false, status: 400 })
    }

    const response = await fetch(url, {
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
  } catch (e) {
    return NextResponse.json({
      success: false,
      status: 500,
    })
  }
}
