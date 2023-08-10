import OrganizationController from './controller/organization'
import EventController from './controller/event'

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
    name: 'Zuzalu Montenegro 2023 - Longevity Introductory',
    description:
      'Join 200 core residents brought together by a shared desire to learn, create, live longer and healthier lives, and build self-sustaining communities.',
    start: new Date('2023-03-25T00:00:00.000Z'),
    end: new Date('2023-05-25T00:00:00.000Z'),
    location: 'Montenegro',
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: 'gsheet' as 'gsheet',
        config: {
          sheetId: '1_CsWVC9yfgDhOHMpJd5lr8d7_fcIzOX_Cz_LBXPzbmc',
          apiKey: 'AIzaSyChBCoGLIXhlMxY3eI9gJMpYujvFN90v6w',
        },
      },
    ],
  }

  const eventController = new EventController()
  const EventInstance = await eventController.createEvent(Event)
  await eventController.importEventData(EventInstance)
}

run()
