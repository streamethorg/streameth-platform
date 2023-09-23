import { IsNotEmpty, IsUrl, IsOptional, validate } from "class-validator";
import { IEvent } from "./event";
import { generateId, BASE_PATH } from "../utils";
import path from "path";

export interface ISpeaker {
  id: string;
  name: string;
  bio: string;
  eventId: IEvent["id"];
  twitter?: string;
  github?: string;
  website?: string;
  photo?: string;
  company?: string;
}

export default class Speaker implements ISpeaker {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  bio: string;

  @IsNotEmpty()
  eventId: IEvent["id"];

  @IsOptional()
  twitter?: string;

  @IsUrl()
  @IsOptional()
  github?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsOptional()
  photo?: string;

  @IsOptional()
  company?: string;

  constructor({
    name,
    bio,
    eventId,
    twitter,
    github,
    website,
    photo,
    company
  }: Omit<ISpeaker, "id"> & { id?: string }) {
    this.id = generateId(name);
    this.name = name;
    this.bio = bio;
    this.eventId = eventId;
    this.twitter = twitter;
    this.github = github;
    this.website = website;
    this.photo = photo;
    this.company = company;
    this.validateThis();
  }

  async validateThis() {
    const errors = await validate(this);
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors}`);
    }
  }

  toJson(): ISpeaker {
    return { ...this };
  }

  static async fromJson(jsonData: string | Omit<ISpeaker, "id">) {
    const data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
    const speaker = new Speaker({ ...data });
    await speaker.validateThis();
    return speaker;
  }

  static async getSpeakerPath(
    eventId: ISpeaker["eventId"],
    speakerId?: ISpeaker["id"]
  ): Promise<string> {
    if (speakerId) {
      return path.join(BASE_PATH, "speakers", eventId, `${speakerId}.json`);
    }
    return path.join(BASE_PATH, "speakers", eventId);
  }
}
