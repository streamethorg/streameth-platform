import OrganizationController from "./controller/organization";
import EventController from "./controller/event";

const run = async () => {
  const Organization = {
    name: "Swarm",
    description:
      "Swarm is a distributed storage platform and content distribution service, a native base layer service of the ethereum web3 stack that aims to provide a decentralized and redundant store for dapp code, user data, blockchain and state data. Swarm sets out to provide various base layer services for web3, including node-to-node messaging, media streaming, decentralised database services and scalable state-channel infrastructure for decentralised service economies.",
    url: "https://www.ethswarm.org/",
    logo: "https://web3edge.io/wp-content/uploads/2022/08/swarm-spotlight-600x300.png",
    location: "Virtual",
  };

  const orgController = new OrganizationController();
  const organizationInstance = await orgController.createOrganization(
    Organization
  );

  const Event = {
    name: "Swarm Summit 2023",
    description:
      "As the summer light symbolically vanquished the darkness on 21 June, Swarm network kicked off its three-day Swarm Virtual Summit. This year, the network’s global community gathered in the virtual world, giving all its diverse members a chance to watch and listen to leading voices and keen enthusiasts across different fields on the online stage.",
    start: new Date("2023-06-21T00:00:00.000Z"), // "2021-09-30T00:00:00.000Z
    end: new Date("2023-06-23T00:00:00.000Z"), // "2021-10-02T00:00:00.000Z
    location: "Virtual",
    organizationId: organizationInstance.id,
    dataImporter: [
      {
        type: "gsheet" as "gsheet",
        config: {
          sheetId: "129T5ggZEdmH_u_2Sp1-LJShcoOqgBGDWosVBQQ6IfYg",
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
