import { IsNotEmpty, IsUrl, validate } from 'class-validator'
import { generateId, BASE_PATH } from '../utils'
import path from 'path'
export interface IOrganization {
  id: string
  name: string
  description: string
  url: string
  logo: string
  location: string
  accentColor: string
}

export default class Organization {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  @IsUrl()
  @IsNotEmpty()
  url: string

  @IsUrl()
  @IsNotEmpty()
  logo: string

  @IsNotEmpty()
  location: string

  @IsNotEmpty()
  accentColor: string

  constructor({
    id,
    name,
    description,
    url,
    logo,
    location,
    accentColor = '#FFF',
  }: Omit<IOrganization, 'id'> & { id?: string }) {
    this.id = id ?? generateId(name)
    this.name = name
    this.description = description
    this.url = url
    this.logo = logo
    this.location = location
    this.accentColor = accentColor
    this.validateThis()
  }

  async validateThis() {
    const errors = await validate(this)
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors}`)
    }
  }

  public toJson(): IOrganization {
    return { ...this }
  }

  static async fromJson(jsonData: string): Promise<Organization> {
    const data = JSON.parse(jsonData) as IOrganization
    return new Organization({ ...data })
  }

  static async getOrganizationPath(id?: string): Promise<string> {
    if (!id) return path.join(BASE_PATH, 'organizations')
    return path.join(BASE_PATH, 'organizations', `${id}.json`)
  }
}
