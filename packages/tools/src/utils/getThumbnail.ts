import { IEvent } from './types'

// I am not able to fetch the image. I need to fetch the animations anyway, so I should just check if the animation exist and throw an error otherwise
export default async function getAnimation(
  event: IEvent,
  apiBaseUri: string,
  coverImage?: string
) {
  if (!coverImage) {
    throw new Error(
      'coverImage does not exist. Iterating to the next session'
    )
  }
}
