import makeBlockie from 'ethereum-blockies-base64'

export function CreateAvatar(name: string) {
  return makeBlockie(name)
}

export async function validImageUrl(url?: string) {
  if (!url) return false

  try {
    const res = await fetch(url)
    const buff = await res.blob()

    return buff.type.startsWith('image/')
  } catch (e) {
    return false
  }
}
