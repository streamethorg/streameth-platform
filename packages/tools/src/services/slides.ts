import { AuthenticateServiceAccount } from './google'
import { CONFIG } from 'utils/config'
import fs, { createReadStream } from 'fs'

export const PRESENTATION_SCOPES = [
  'https://www.googleapis.com/auth/presentations',
]
export const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive']

// MAKE SURE NOT TO COMMIT THE SECRET FILES
const google = AuthenticateServiceAccount([
  ...PRESENTATION_SCOPES,
  ...DRIVE_SCOPES
])

export async function CreateFolders(
  folders: string[],
  parentId?: string
) {
  console.log('Create folders', folders, parentId)

  const client = google.drive('v3')

  for (const folder of folders) {
    const exists = await client.files.list({
      q: `name='${folder}' and trashed=false and mimeType='application/vnd.google-apps.folder' and ${parentId ? `'${parentId}' in parents` : ''}`,
      corpora: 'drive',
      spaces: 'drive',
      driveId: '0AMKHrdGKMYAeUk9PVA',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })

    if (exists.data.files && exists.data.files.length > 0) {
      console.log('Folder already exists', folder)
      continue
    }

    const file = await client.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: folder,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : [],
      },
    })

    console.log('Folder created', file.data.id)
  }
}

export async function CreateSlide(title: string, parentId?: string) {
  console.log('CreateSlide', title)

  const presentation = await google.slides('v1')
    .presentations.create({
      requestBody: {
        title: title,
      },
    })

  if (presentation.data.presentationId) {
    console.log(
      'Presentation created',
      `https://docs.google.com/presentation/d/${presentation.data.presentationId}`
    )

    console.log('Move file')
    const copy = await google.drive('v3').files.copy({
      fileId: presentation.data.presentationId,
      supportsAllDrives: true,
      requestBody: {
        name: `Copy of ${title}`,
        parents: parentId ? [parentId] : [],
      },
    })
    console.log(
      'Presentation copied',
      `https://docs.google.com/presentation/d/${copy.data.id}`
    )

    return presentation.data.presentationId
  }
}

export async function DownloadSlides(id: string) {
  const res = await fetch(
    `https://docs.google.com/presentation/d/${id}/export/pdf?opts=shs%3D0`
  )
  const arr = await res.arrayBuffer()
  const buffer = Buffer.from(arr)

  if (buffer.length > 3125) {
    fs.writeFileSync(
      `${CONFIG.ASSET_FOLDER}/slides/${id}.pdf`,
      buffer
    )
  } else {
    console.log('Invalid slides', id)
  }
}

export async function UploadDrive(
  name: any,
  path: string,
  type: string = 'video/mp4',
  parentId: string
) {
  try {
    console.log(' - upload to drive', name)
    const client = google.drive('v3')

    const upload = await client.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: name,
        parents: parentId ? [parentId] : [],
      },
      media: {
        mimeType: type,
        body: createReadStream(path),
      },
    })

    return upload.data
  } catch (ex) {
    console.log('Unable to upload to Google Drive', name)
    console.error(ex)
  }
}

export async function UpdateDrive(
  name: any,
  path: string,
  type: string = 'video/mp4',
  fileId: string,
  parentId: string
) {
  try {
    console.log(' - update on drive', name)
    const client = google.drive('v3')

    const upload = await client.files.update({
      fileId: fileId,
      supportsAllDrives: true,
      addParents: parentId ? parentId : '',
      requestBody: {
        name: name,
      },
      media: {
        mimeType: type,
        body: createReadStream(path),
      },
    })

    return upload.data
  } catch (ex) {
    console.log('Unable to update on Google Drive', name)
    console.error(ex)
  }
}

export async function UploadOrUpdate(
  name: any,
  path: string,
  type: string = 'video/mp4',
  parentId: string) {
  try {
    const fileExists = await FileExists(name, type, parentId)
    if (!fileExists) {
      return UploadDrive(name, path, type, parentId)
    }

    const fileId = await GetFileId(name, type, parentId)
    if (fileId) {
      return UpdateDrive(name, path, type, fileId, parentId)
    }

  } catch (ex) {
    console.log('Unable to upload to Google Drive', name)
    console.error(ex)
  }
}

export async function GetFileId(name: string, type: string, parentId: string) {
  try {
    const client = google.drive('v3')

    const files = await client.files.list({
      q: `name='${name}' and mimeType = '${type}' and trashed=false and ${parentId ? `'${parentId}' in parents` : ''}`,
      corpora: 'drive',
      spaces: 'drive',
      driveId: CONFIG.GOOGLE_DRIVE_ID,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })

    if (files.data.files && files.data.files.length > 0) {
      return files.data.files[0].id as string
    }
  } catch (ex) {
    console.log('Unable to get from Google Drive', name)
    console.error(ex)
  }
}

export async function FileExists(name: string, type: string, parentId: string) {
  const id = await GetFileId(name, type, parentId)
  return id !== undefined
}

export function getSlidesId(url: string): string {
  let id = url
  id = id.replace('https://docs.google.com/presentation/d/', '')
  id = id.replace('/edit?usp=sharing', '')
  id = id.replace('/edit#slide=id.p', '')
  id = id.replace('/edit#slide=id.g13737362dea_0_1', '')
  id = id.replace(
    '/edit?usp=drive_web&ouid=114193972392563644912',
    ''
  )
  id = id.replace('/edit#slide=id.g14286fcf6b3_0_92', '')
  id = id.replace('/edit#slide=id.p1', '')
  id = id.replace('/edit#slide=id.g1433c566fdb_1_78', '')
  id = id.replace('/edit#slide=id.p1', '')
  id = id.replace('/edit#slide=id.p1', '')
  id = id.replace('/edit', '')

  return id
}
