import OrganizationController from './controller/organization'
import EventController from './controller/event'
import moment from 'moment-timezone'

const run = async () => {
  const Organization = {
    name: 'Scroll',
    description:
      'Scroll seamlessly extends Ethereum’s capabilities through zero knowledge tech and EVM equivalence. The L2 blockchain built by Ethereum devs for Ethereum devs.',
    url: 'https://scroll.io/',
    logo: 'https://scroll.io/logo.png',
    location: 'Unknown',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(Organization)

  const Event = {
    name: 'Scroll Announcement Stream',
    description:
      'Scroll seamlessly extends Ethereum’s capabilities through zero knowledge tech and EVM equivalence. The L2 blockchain built by Ethereum devs for Ethereum devs.',
    start: new Date('2023-10-20T00:00:00.000Z'),
    end: new Date('2023-10-20T00:00:00.000Z'),
    location: 'Hanoi, Vietnam',
    organizationId: 'scroll',
    dataImporter: [
      {
        type: 'gsheet' as 'gsheet',
        config: {
          sheetId: '1nM8U6a8TlmuMzE835ZvCol9IW5vmjLD9YI0Moc_SUJE',
          apiKey: 'l',
        },
      },
    ],
    logo: '',
    banner: '',
    website: '',
    archiveMode: false,
    timezone: 'Asia/Ho_Chi_Minh',
    eventCover: '',
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
