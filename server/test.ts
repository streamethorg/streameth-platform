import OrganizationController from "./controller/organization";
import EventController from "./controller/event";

const run = async () => {
  const Organization = {
    name: "ETHBerlin",
    description:
      "ETHBerlin is known as the hackathon extravaganza, a cultural festival, an educational event, a platform for hacktivism, and a community initiative to push the decentralized ecosystem forward. ETHBerlin³ is the third edition, and we've come a long way since we hosted our first hackathon in 2018.",
    url: "https://ethberlin.ooo/",
    logo: "https://ethberlin.ooo/ETHBerlin.gif",
    location: "Berlin, Germany",
  };

  const orgController = new OrganizationController();
  const organizationInstance = await orgController.createOrganization(
    Organization
  );

  const Event = {
    name: "ETHBerlin 2022",
    description:
      "ETHBerlin³ (2022) was a hackathon, a cultural festival, an educational event, a platform for hacktivism, and a community initiative to push the decentralized ecosystem forward.",
    start: new Date("2022-09-16T00:00:00.000Z"), // "2021-09-30T00:00:00.000Z
    end: new Date("2022-09-18T00:00:00.000Z"), // "2021-10-02T00:00:00.000Z
    location: "Berlin, Germany",
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: "gsheet" as "gsheet",
        config: {
          sheetId: "1EJg7Z0WpyhdRa89Noti5lRb-iRjywGqa9_MbN6FsdWM",
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
