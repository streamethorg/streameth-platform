
const redirects = [
  {
    source: '/',
    has: [
      {
        type: 'host',
        value: 'basemiami.xyz',
      },
    ],
    destination: 'https://basemiami.xyz/base/base_event',
    permanent: true,
  },
  {
    source: '/',
    has: [
      {
        type: 'host',
        value: 'watch.protocol.berlin',
      },
    ],
    destination:
      'https://watch.protocol.berlin/ethberlin/protocol_berg',
    permanent: true,
  },
  {
    source: '/',
    has: [
      {
        type: 'host',
        value: 'launch.scroll.io',
      },
    ],
    destination:
      'https://launch.scroll.io/scroll/scroll_announcement_stream',
    permanent: true,
  }
]