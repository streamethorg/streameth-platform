import makeBlockie from 'ethereum-blockies-base64'

export function CreateAvatar(name: string) {
  if (!name) {
    return ''
  }
  return makeBlockie(name)
}
