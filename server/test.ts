import OrganizationController from './controller/organization'
import EventController from './controller/event'
import SpeakerController from './controller/speaker'
import SessionController from './controller/session'
const run = async () => {
  const Organization = {
    name: 'ETHChicago',
    description: 'A community-run hackathon and conference focused on decentralized technology, particularly within the Ethereum ecosystem.',
    url: 'https://www.ethchicago.xyz/',
    logo: 'https://www.ethchicago.xyz/images/brand/ethchi_banner.svg',
    location: 'Chicago',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(Organization)

  const Event = {
    name: 'ETHChicago 2023',
    description:
      'Three days of building bridges between web3 builders, creators, traditional businesses, financial experts and policymakers.',
    start: new Date('2023-09-15T00:00:00.000Z'),
    end: new Date('2023-09-17T00:00:00.000Z'),
    location: 'Chicago',
    organizationId: organizationInstance.id,
    timezone: "CDT",
    dataImporter: [
      {
        type: 'pretalx' as 'pretalx',
        config: {
          url: 'https://pretalx.com/api/events/ethchi-2023',
          apiToken: 'c5429a10c524106246757284a2acdf3cfe9a4ed5',
        },
      },
    ],
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
