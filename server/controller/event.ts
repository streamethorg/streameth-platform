import BaseController from './baseController'
import Event, { IEvent } from '../model/event'
import OrganizationController from './organization'

export default class EventController {
  private controller: BaseController<IEvent>

  constructor() {
    this.controller = new BaseController<IEvent>('fs')
  }

  public async getEvent(
    eventId: IEvent['id'],
    organizationId: IEvent['organizationId']
  ): Promise<Event> {
    const eventQuery = await Event.getEventPath(
      organizationId,
      eventId
    )
    const data = await this.controller.get(eventQuery)
    const evt = new Event({ ...data })
    // !evt.archiveMode && this.importEventData(evt)
    return evt
  }

  public async createEvent(
    event: Omit<IEvent, 'id'>
  ): Promise<Event> {
    const evt = new Event({ ...event })
    await evt.validateThis()
    const eventQuery = await Event.getEventPath(
      evt.organizationId,
      evt.id
    )
    await this.controller.create(eventQuery, evt)
    return evt
  }

  public async editEvent(
    event: IEvent,
    organizationId: IEvent['organizationId']
  ): Promise<void> {
    await this.deleteEvent(event.id, organizationId)
    await this.createEvent(event)
  }

  public async deleteEvent(
    eventId: IEvent['id'],
    organizationId: IEvent['organizationId']
  ): Promise<void> {
    if (!eventId || !organizationId) {
      throw new Error('Invalid eventId or organizationId')
    }

    const event = await this.getEvent(eventId, organizationId)
    if (!event) {
      throw new Error('Event does not exist')
    }

    const eventQuery = await Event.getEventPath(
      organizationId,
      eventId
    )
    this.controller.delete(eventQuery)
  }

  public async getAllEventsForOrganization(
    organizationId: IEvent['organizationId']
  ): Promise<Event[]> {
    const events: Event[] = []
    const eventQuery = await Event.getEventPath(organizationId)
    const data = await this.controller.getAll(eventQuery)
    for (const evt of data) {
      events.push(new Event({ ...evt }))
    }
    return events
  }

  public async getAllEvents({
    organizationId,
    startDate,
    inclUnlisted = false,
  }: {
    organizationId?: IEvent['organizationId']
    startDate?: number
    inclUnlisted?: boolean
  }): Promise<Event[]> {
    const orgController = new OrganizationController()
    const evtController = new EventController()
    const organizations = await orgController.getAllOrganizations()
    const events: Event[] = []

    for (const organization of organizations) {
      if (organizationId && organization.id !== organizationId)
        continue
      const orgId = organization.id
      const orgEvents =
        await evtController.getAllEventsForOrganization(orgId)
      for (const event of orgEvents) {
        if (startDate && new Date(event.start) < new Date(startDate))
          continue
        events.push(event)
      }
    }

    if (!inclUnlisted) {
      return events.filter((event) => !event.unlisted)
    }

    return events
  }

  public async importEventData(event: Event): Promise<void> {
    const { dataImporter } = event
    if (!dataImporter) return
    for (const importer of dataImporter) {
      const importedModule = await import(
        `../importers/${importer.type}/index`
      )
      const Importer = importedModule.default
      // Not typesafe
      const data = new Importer({ importer, event })
      return await data.generateSessions()
    }
  }
}
