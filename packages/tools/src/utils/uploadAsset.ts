import { CONFIG } from './config'
import {
  FileExists,
  UploadDrive,
  UploadOrUpdate,
} from 'services/slides'

export default async function uploadAsset(
  id: string,
  path: string,
  type: string,
  folderId: string,
  force: boolean
) {
  // - CONFIG.GOOGLE_DRIVE_ID is main, root drive. Files are upload to their respective sub folder Ids
  if (CONFIG.GOOGLE_DRIVE_ID) {
    if (force) {
      await UploadOrUpdate(id, path, type, folderId)
      return
    }

    const exists = await FileExists(id, type, folderId)
    if (!exists) {
      await UploadDrive(id, path, type, folderId)
    }
  }
}
