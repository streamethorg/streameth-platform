import OrganizationController from "./controller/organization";
import EventController from "./controller/event";

const run = async () => {
  const Organization = {
    name: "Ethereum Argentina",
    description:
      "The Argentinian Ethereum community is thrilled to announce the Ethereum Argentina event. This four-day event will take place from August 16th to 19th at the Centro de Convenciones (CEC) in Buenos Aires. The event serves as a dynamic platform for users, educators, students, entrepreneurs, developers, and blockchain enthusiasts to gather, exchange knowledge, share news, and showcase their experiences within the Ethereum and blockchain technology space.",
    url: "https://ethereumargentina.org/",
    logo: "https://pbs.twimg.com/profile_images/1651503136152928256/dqUQ6F0d_400x400.jpg",
    location: "Buenos Aires, Argentina",
  };

  const orgController = new OrganizationController();
  const organizationInstance = await orgController.createOrganization(
    Organization
  );

  const Event = {
    name: "Ethereum Argentina 2023",
    description:
      "The Argentinian Ethereum community is thrilled to announce the Ethereum Argentina event. This four-day event will take place from August 16th to 19th at the Centro de Convenciones (CEC) in Buenos Aires. The event serves as a dynamic platform for users, educators, students, entrepreneurs, developers, and blockchain enthusiasts to gather, exchange knowledge, share news, and showcase their experiences within the Ethereum and blockchain technology space.",
    start: new Date("2023-08-16T00:00:00.000Z"), // "2021-09-30T00:00:00.000Z
    end: new Date("2023-08-19T00:00:00.000Z"), // "2021-10-02T00:00:00.000Z
    location: "Buenos Aires, Argentina",
    organizationId: organizationInstance.id,
    website: "https://ethereumargentina.org/",
    dataImporter: [
      {
        type: "gsheet" as "gsheet",
        config: {
          sheetId: "1B7pbcBD0nE-7QG52Qy9_dXmY6ADw-UoHcRhhh1Siz0A",
          apiKey: "AIzaSyChBCoGLIXhlMxY3eI9gJMpYujvFN90v6w",
        },
      },
    ],
  };

  const eventController = new EventController();
  const EventInstance = await eventController.createEvent(Event);
  await eventController.importEventData(EventInstance);
};

run();
