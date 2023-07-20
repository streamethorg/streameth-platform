import OrganizationController from "./controller/organization";
import EventController from "./controller/event";
import { IEvent, IDataImporter } from "./model/event";
const run = async () => {
  const Organization = {
    name: "ETHPorto",
    description:
      "ETHPorto is collaborating with a local nonprofit, Transformers, in an effort to support the local community and explore new ways to finance public goods through quadratic voting",
    url: "https://ethporto.org/",
    logo: "https://pbs.twimg.com/profile_images/1613498246403395590/BF_dNWpk_400x400.jpg",
    location: "Porto, Portugal",
  };

  const orgController = new OrganizationController();
  const organizationInstance = await orgController.createOrganization(
    Organization
  );

  const Event = {
    name: "EthPorto 2023",
    description:
      "March 16-18th, 2023 🇵🇹 Bringing the first ETH event to the beautiful city of Porto",
    start: new Date("2023-03-16T00:00:00.000Z"), // "2021-09-30T00:00:00.000Z
    end: new Date("2023-03-18T00:00:00.000Z"), // "2021-10-02T00:00:00.000Z
    location: "Porto, Portugal",
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: "gsheet" as "gsheet",
        config: {
          sheetId: "1oe2C9BFunInC0-rLVOHuQQ3Uu5osOHUlAJxLooLd69c",
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
