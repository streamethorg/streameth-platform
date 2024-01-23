'use client'
import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface'

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
  speaker: ISpeakerModel
  onlyImage?: boolean
}) {
  if (onlyImage) {
    return (
      <Avatar className="my-2 ">
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
    <Badge className="bg-background text-white">
      <Avatar className="my-1">
        <AvatarImage src={speaker.photo} />
        <AvatarFallback className="text-background">
          {speaker.name.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="ml-2 text-base">{speaker.name}</span>
    </Badge>
  )
}
