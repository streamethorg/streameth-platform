import OrganizationController from "./controller/organization";
import EventController from "./controller/event";

const run = async () => {
  const Organization = {
    name: 'Funding the Commons',
    description:
      'We are individuals and organizations building new models of sustainable public goods funding and value alignment in open source networks. Our goal with Funding the Commons is to bridge the public goods community across Web2, Web3, research, philanthropy and industry.',
    url: 'https://fundingthecommons.io/',
    logo: 'https://fundingthecommons.io/assets/logoNav.6b3e7427.png',
    location: 'Unknown',
  }

  const orgController = new OrganizationController();
  const organizationInstance = await orgController.createOrganization(
    Organization
  );

  const Event = {
    name: 'Funding the Commons Paris 2023',
    description:
      'We are individuals and organizations building new models of sustainable public goods funding and value alignment in open source networks. Our goal with Funding the Commons is to bridge the public goods community across Web2, Web3, research, philanthropy and industry.',
    start: new Date('2023-07-15T00:00:00.000Z'),
    end: new Date('2023-07-16T00:00:00.000Z'),
    location: 'Paris, France',
    organizationId: organizationInstance.id,
    website: 'https://fundingthecommons.io/',
    dataImporter: [
      {
        type: "gsheet" as "gsheet",
        config: {
          sheetId: '1JUFF93zl0Y84h70t4RMDeCfZdA4eYYKf7_0vReLx4Xg',
          apiKey: 'AIzaSyChBCoGLIXhlMxY3eI9gJMpYujvFN90v6w',
        },
      },
    ],
  };

  const eventController = new EventController();
  const EventInstance = await eventController.createEvent(Event);
  await eventController.importEventData(EventInstance);
};

run();
