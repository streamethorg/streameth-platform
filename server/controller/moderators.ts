import Moderator, { IModerator } from '../model/moderator'
import BaseController from './baseController'

export default class ModeratorController {
  private controller: BaseController<IModerator>

  constructor() {
    this.controller = new BaseController<IModerator>('fs')
  }

  public async getModerator(
    moderatorId: IModerator['id'],
    eventId: IModerator['eventId']
  ): Promise<Moderator> {
    const moderatorQuery = await Moderator.getModeratorPath(
      eventId,
      moderatorId
    )
    const data = await this.controller.get(moderatorQuery)
    return new Moderator({ ...data })
  }

  public async createModerator(
    moderator: Omit<IModerator, 'id'>
  ): Promise<Moderator> {
    const ses = new Moderator({ ...moderator })
    const moderatorQuery = await Moderator.getModeratorPath(
      ses.eventId,
      ses.id
    )
    await this.controller.create(moderatorQuery, ses)
    return ses
  }

  public async getAllModeratorsForEvent(
    eventId: IModerator['eventId']
  ): Promise<Moderator[]> {
    const moderators: Moderator[] = []
    const moderatorQuery = await Moderator.getModeratorPath(eventId)
    const data = await this.controller.getAll(moderatorQuery)
    for (const ses of data) {
      moderators.push(new Moderator({ ...ses }))
    }
    return moderators
  }
}
