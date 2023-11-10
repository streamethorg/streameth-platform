import {
  IsNotEmpty,
  IsUrl,
  IsOptional,
  validate,
} from 'class-validator'
import { IEvent } from './event'
import { generateId, BASE_PATH } from '../utils'
import path from 'path'

export interface IModerator {
  id: string
  name: string
  bio: string
  eventId: IEvent['id']
  twitter?: string
  email?: string
  website?: string
  photo?: string
  company?: string
}

export default class Moderator implements IModerator {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  bio: string

  @IsNotEmpty()
  eventId: IEvent['id']

  @IsOptional()
  twitter?: string

  @IsUrl()
  @IsOptional()
  email?: string

  @IsUrl()
  @IsOptional()
  website?: string

  @IsOptional()
  photo?: string

  @IsOptional()
  company?: string

  constructor({
    name,
    bio,
    eventId,
    twitter,
    email,
    website,
    photo,
    company,
  }: Omit<IModerator, 'id'> & { id?: string }) {
    this.id = generateId(name)
    this.name = name
    this.bio = bio
    this.eventId = eventId
    this.twitter = twitter
    this.email = email
    this.website = website
    this.photo = photo
    this.company = company
    this.validateThis()
  }

  async validateThis() {
    const errors = await validate(this)
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors}`)
    }
  }

  toJson(): IModerator {
    return { ...this }
  }

  static async fromJson(jsonData: string | Omit<IModerator, 'id'>) {
    const data =
      typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
    const moderator = new Moderator({ ...data })
    await moderator.validateThis()
    return moderator
  }

  static async getModeratorPath(
    eventId: IModerator['eventId'],
    moderatorId?: IModerator['id']
  ): Promise<string> {
    if (moderatorId) {
      return path.join(
        BASE_PATH,
        'moderators',
        eventId,
        `${moderatorId}.json`
      )
    }
    return path.join(BASE_PATH, 'moderators', eventId)
  }
}
