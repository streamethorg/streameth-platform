'use client'
import { ISpeaker } from 'streameth-server/model/speaker'
import { IEvent } from 'streameth-server/model/event'
import makeBlockie from 'ethereum-blockies-base64'

import { Badge } from '@/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

function CreateBlockie(username: string) {
  return makeBlockie(username)
}

export default function SpeakerIcon({
  speaker,
  onlyImage = false,
}: {
  speaker: ISpeaker
  onlyImage?: boolean
}) {
  if (onlyImage) {
    return (
      <Avatar className="my-2">
        <AvatarImage
          src={
            speaker.photo
              ? speaker.photo
              : CreateBlockie(speaker.name)
          }
        />
        <AvatarFallback>
          {speaker.name.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    )
  }
  return (
    <Badge
      // onClick={() =>
      //   openModal(<SpeakerModal event={event} speaker={speaker} />)
      // }>
      className="m-1">
      <Avatar className="my-2">
        <AvatarImage
          src={
            speaker.photo
              ? speaker.photo
              : CreateBlockie(speaker.name)
          }
        />
        <AvatarFallback>
          {speaker.name.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="ml-2 text-base">{speaker.name}</span>
    </Badge>
  )
}
