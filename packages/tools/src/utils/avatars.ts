import makeBlockie from 'ethereum-blockies-base64'

export function CreateAvatar(name: string) {
  return makeBlockie(name)
}
