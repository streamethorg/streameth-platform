import OrganizationController from './controller/organization'
import EventController from './controller/event'
import SpeakerController from './controller/speaker'
import SessionController from './controller/session'
const run = async () => {
  const Organization = {
    name: 'Funding the Commons',
    description:
      'We are individuals and organizations building new models of sustainable public goods funding and value alignment in open source networks. Our goal with Funding the Commons is to bridge the public goods community across Web2, Web3, research, philanthropy and industry.',
    url: 'https://fundingthecommons.io/',
    logo: 'https://fundingthecommons.io/assets/logoNav.6b3e7427.png',
    location: 'Unknown',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(Organization)

  const Event = {
    name: 'Funding the Commons Berlin 2023',
    description:
      'We are individuals and organizations building new models of sustainable public goods funding and value alignment in open source networks. Our goal with Funding the Commons is to bridge the public goods community across Web2, Web3, research, philanthropy and industry. We do this by convening builders and practitioners, researchers and academics, and funders and philanthropists, catalyzing innovation in public goods. In the future, we seek to expand our impact by facilitating the creation of a public goods fund tied to impact evaluators, seeding projects that are conceived and incubated by the Funding the Commons community.',
    start: new Date('2023-09-09T00:00:00.000Z'),
    end: new Date('2023-09-09T00:00:00.000Z'),
    location: 'Berlin, Germany',
    organizationId: 'funding_the_commons',
    dataImporter: [
      {
        type: 'gsheet' as 'gsheet',
        config: {
          sheetId: '1CuefhHHDbdWH77JGnkPQODdaq880mUAhwLlOeYnwWpo',
          apiKey: 'w',
        },
      },
    ],
    timezone: "Europe/Berlin"
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
