import OrganizationController from './controller/organization'
import EventController from './controller/event'

const run = async () => {
  const Organization = {
    name: 'Zuzalu',
    description: 'Zuzalu is a first-of-its-kind pop-up city community.',
    url: 'https://zuzalu.city/',
    logo: 'https://zuzalu.city/_next/image?url=https%3A%2F%2Fpolcxtixgqxfuvrqgthn.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fzulalu-images%2Fzulalologo.png&w=256&q=75',
    location: 'Unknown',
  }

  const orgController = new OrganizationController()
  const organizationInstance = await orgController.createOrganization(Organization)

  const Event = {
    name: 'Zuzalu 2023 - Jurisdictions for Longevity',
    description: 'Zuzalu is a first-of-its-kind pop-up city community in Montenegro.',
    start: new Date('2023-04-09T00:00:00.000Z'), // "2021-09-30T00:00:00.000Z
    end: new Date('2023-04-11T00:00:00.000Z'), // "2021-10-02T00:00:00.000Z
    location: 'Montenegro',
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: 'gsheet' as 'gsheet',
        config: {
          sheetId: '1KYyLZGlO1nLJYbTzQbUvOX_KrRAhYYwZdhGIVE1kwD4',
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
