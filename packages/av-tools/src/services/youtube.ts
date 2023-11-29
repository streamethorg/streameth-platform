import fs from 'fs'
import { Authenticate } from './google'

export const AUTH_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
]

export async function updateAsset(id: string, title: string, description: string) {
  console.log('Update asset', id, title, description)

  // MAKE SURE NOT TO COMMIT THE SECRET FILES
  const google = await Authenticate(AUTH_SCOPES)
  const client = google.youtube('v3')

  const res1 = await client.videos.update({
    part: ['id', 'snippet'],
    requestBody: {
      id: id,
      snippet: {
        title: title,
        description: description,
        categoryId: '28',
      },
    },
  })
  if (res1.status !== 200) {
    console.error(res1.statusText)
  }
}

export async function addThumbnail(id: string, thumbnailPath: string) {
  console.log('Add thumbnail', id, thumbnailPath)

  // MAKE SURE NOT TO COMMIT THE SECRET FILES
  const google = await Authenticate(AUTH_SCOPES)
  const client = google.youtube('v3')

  const res = await client.thumbnails.set({
    videoId: id,
    media: {
      body: fs.createReadStream(thumbnailPath),
    },
  })
  if (res.status !== 200) {
    console.error(res.statusText)
  }
}

export function getVideoId(youtubeUrl: string) {
  let videoId = youtubeUrl
  videoId = videoId.replace('https://youtu.be/', '')
  videoId = videoId.replace('https://www.youtube.com/embed/', '')
  videoId = videoId.replace('https://www.youtube.com/watch?v=', '')
  videoId = videoId.replace('https://studio.youtube.com/video/', '')
  videoId = videoId.replace('&feature=youtu.be', '')
  videoId = videoId.replace('/edit', '')

  return videoId
}
