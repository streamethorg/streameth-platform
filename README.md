# StreamETH

This blockchain space has a very remote culture. Even events that are held physically still want to give remote attendees an experience as close to being physically present as possible. While solutions such as YouTube or other social media ‘Live’ media broadcasting solutions exist, they do not align with the core values of decentralization.

This open-source live-streaming and playback solution utilizes decentralized technologies and infrastructure that allows event hosts to easily spin up an environment for their virtual attendees.

## Demo

- https://app.streameth.org

## Development

This project is bootstrapped using a [Next.js](https://nextjs.org/). Check out our [Next.js documentation](https://nextjs.org/docs/) for more details.

Run the development server to watch the result at [http://localhost:3000](http://localhost:3000)

```bash
yarn dev
```

## API

We make use of a simple API to get the sessions, speakers, events or organization in JSON format.

### All possible routes:

```bash
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations"
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events"
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/sessions"
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/speakers"
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/stages"
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/${ORGANIZATION}/events/${EVENT}/schedule"
```

### Usage:

```bash
curl -L -H "Accept: application/json" "http://app.streameth.org/api/organizations/ethberlin/events/protocol_berg/sessions"
```