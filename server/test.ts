import OrganizationController from './controller/organization'
import EventController from './controller/event'

const run = async () => {
  const Organization = {
    name: 'ETH Safari',
    description: 'Welcome to the largest ETH event happening in Africa!',
    url: 'https://ethsafari.xyz/',
    logo: 'https://ethsafari.xyz/static/ethsafari-logo-icon-a37e9deca2bfb730665fbcb60b3f7f14.svg',
    location: 'Unknown',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(Organization)

  const Event = {
    name: 'ETH Safari 2023',
    description: 'Welcome to the largest ETH event happening in Africa!',
        start: new Date('2023-09-21T00:00:00.000Z'),
    end: new Date('2023-09-23T00:00:00.000Z'),
    location: 'Kalifi, Kenya',
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: 'gsheet' as 'gsheet',
        config: {
          sheetId: '1uUTWJj0yrbmGo2FF4xOkBQLbFAcpErcLxBMsrx02GPE',
          apiKey: 'w',
        },
      },
    ],
    timezone: "Africa/Nairobi",
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
