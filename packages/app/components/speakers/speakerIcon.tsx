'use client'
import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface'
import makeBlockie from 'ethereum-blockies-base64'
import { Badge } from '@/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import SpeakerModal from '@/app/[organization]/[event]/speakers/components/SpeakerModal'
import { Credenza, CredenzaTrigger } from '../ui/crezenda'
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
    <Credenza>
      <SpeakerModal speaker={speaker} />
      <CredenzaTrigger>
        <Badge className="bg-background z-50 text-primary border border-secondary">
          <Avatar className="my-1">
            <AvatarImage src={speaker?.photo} />
            <AvatarFallback className="">
              {speaker?.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm">{speaker?.name}</span>
        </Badge>
      </CredenzaTrigger>
    </Credenza>
  )
}
