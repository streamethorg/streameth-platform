import OrganizationController from './controller/organization'
import EventController from './controller/event'
import moment from 'moment-timezone'

const run = async () => {
  const Organization = {
    name: 'Zuzalu',
    description: 'Zuzalu is a first-of-its-kind pop-up city community in Montenegro.',
    url: 'https://zuzalu.city/',
    logo: 'https://zuzalu.city/_next/image?url=https%3A%2F%2Fpolcxtixgqxfuvrqgthn.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fzulalu-images%2Fzulalologo.png&w=256&q=75',
    location: 'Unknown',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(Organization)

  const Event = {
    name: 'Zuzalu Montenegro 2023 - Coordi-nations and Digital Tribes',
    description:
      'Join 200 core residents brought together by a shared desire to learn, create, live longer and healthier lives, and build self-sustaining communities.',
    start: new Date('2023-05-15T00:00:00.000Z'),
    end: new Date('2023-05-19T00:00:00.000Z'),
  location: "Montenegro",
    organizationId: 'zuzalu',
    dataImporter: [
      {
        type: 'gsheet' as 'gsheet',
        config: {
          sheetId: '1S-2vBhIfOqvsTsDJU0Xt9Luaudvp7GucVVYIccvUVQ0',
          apiKey: 'l',
        },
      },
    ],
    logo: '',
    banner: '',
    website: '',
    archiveMode: true,
    timezone: 'Asia/Ho_Chi_Minh',
    eventCover: '',
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
