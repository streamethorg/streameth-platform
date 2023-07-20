import OrganizationController from "./controller/organization";
import EventController from "./controller/event";
import { IEvent, IDataImporter } from "./model/event";

const run = async () => {
  const Organization = {
    name: "Funding the Commons",
    description:
      "We are individuals and organizations building new models of sustainable public goods funding and value alignment in open source networks. Our goal with Funding the Commons is to bridge the public goods community across Web2, Web3, research, philanthropy and industry.",
    url: "https://fundingthecommons.io/",
    logo: "https://fundingthecommons.io/assets/logoNav.6b3e7427.png",
    location: "France",
  };

  const orgController = new OrganizationController();
  const organizationInstance = await orgController.createOrganization(
    Organization
  );

  const Event = {
    name: "Funding the Commons Paris 2023",
    description:
      "We are individuals and organizations building new models of sustainable public goods funding and value alignment in open source networks. Our goal with Funding the Commons is to bridge the public goods community across Web2, Web3, research, philanthropy and industry.",
    start: new Date("2023-07-15T00:00:00.000Z"), // "2021-10-01T00:00:00.000Z
    end: new Date("2023-07-16T00:00:00.000Z"), // "2021-10-01T00:00:00.000Z
    location: "Paris, France",
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: "gsheet" as "gsheet",
        config: {
          sheetId: "1BgG-lFPM_DRQaboWd09WTLmToKzP1qMuATdA7OKO0zI",
          apiKey: "AIzaSyBfg-L5lDCUx7L-s6ubJe3z6mYeXIkIFU4",
        },
      },
    ],
  };

  const eventController = new EventController();
  const EventInstance = await eventController.createEvent(Event);
  await eventController.importEventData(EventInstance);
};

run();
