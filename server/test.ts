import OrganizationController from './controller/organization'
import EventController from './controller/event'

const run = async () => {
  const Organization = {
    name: 'ETHChicago',
    description:
      'ETHChicago is a community-run hackathon and conference focused on decentralized technology, particularly within the Ethereum ecosystem. Our aim is to catalyze innovation, foster collaboration, and promote education through real-world impact in blockchain technology.',
    url: 'https://www.ethchicago.xyz/',
    logo: 'https://www.ethchicago.xyz/logo.png',
    location: 'Chicago, USA',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(
    Organization
  )

  const Event = {
    id: 'ethchicago',
    name: 'ETHChicago',
    description:
      'ETHChicago is a community-run hackathon and conference focused on decentralized technology, particularly within the Ethereum ecosystem. Our aim is to catalyze innovation, foster collaboration, and promote education through real-world impact in blockchain technology.',
    start: new Date('2023-09-15T00:00:00.000Z'),
    end: new Date('2023-09-17T00:00:00.000Z'),
    location: 'Chicago, USA',
    organizationId: 'ethchicago',
    dataImporter: [
      {
        type: 'pretalx' as 'pretalx',
        config: {
          url: 'https://pretalx.com/api/events/ethchi-2023',
          apiToken: 'k',
        },
      },
    ],
    logo: 'ethchicago_logo.jpeg',
    banner: 'ethchicago_banner.jpeg',
    website: '',
    archiveMode: false,
    timezone: 'America/Chicago',
    eventCover: 'ethchicago_2023.png',
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
