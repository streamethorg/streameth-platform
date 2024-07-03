# StreamETH Platform

Welcome to the StreamETH platform repository! StreamETH produces world class Virtual Events and Marketing Content. This README provides you with all the necessary information to understand our platform, contribute to it, and get it up and running on your local machine.

## Website Additions

For a better understanding of what StreamETH offers and how it functions, please visit our websites:

- **Public Website**: [streameth.org](https://streameth.org) - Discover what StreamETH is all about and the unique features we offer.
- **Application Site**: [app.streameth.org](https://app.streameth.org) - Interact with the StreamETH application.

## Documentation Resources

You can find detailed documentation on StreamETH's features and architecture here:

- **[Documentation Link](#)**: Dive deep into the technical details and operational aspects of StreamETH.

## StreamETH-Platform Summary

StreamETH is designed to provide a seamless and flexible platform for hosting and attending events virtually or in a hybrid setting. It features:

- **Interactive Sessions**: Engage with speakers and attendees through live.
- **Scalability**: Cater to events of any size, from small gatherings to large conferences.
- **Customisation**: Tailor the event experience to meet the specific needs of your audience.

## Goals of StreamETH

Our mission with StreamETH is to:

- Offer a sustainable and inclusive event-hosting platform.
- Continuously enhance user experience with innovative features.
- Foster a community-driven approach to virtual event management.

## Setup Quickstart

Setting up the StreamETH platform for development is straightforward. Here’s a quick rundown:

### Prerequisites

- Node.js (v18 or above)
- Yarn
- Git

### Environment Variables

Create a `.env` file at the root of the project and include the following variables:

```bash
# Session secret key
SESSION_SECRET=Generate key: "openssl rand -base64 64"

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Infura Project ID
NEXT_PUBLIC_INFURA_ID=your_infura_project_id_here

# Sanity Studio API Key
NEXT_PUBLIC_STUDIO_API_KEY=your_Livepeer_studio_api_key_here

# Service Account Private Key for server-to-server interactions
SERVICE_ACCOUNT_PRIVATE_KEY=your_service_account_private_key_here

# Service Account Email
SERVICE_ACCOUNT_EMAIL=your_service_account_email_here

# Google API Key for services like Google Maps, etc.
GOOGLE_API_KEY=your_google_api_key_here
```

Make sure to replace your_..._here with your actual environment variable values.

### Running Locally

```bash
git clone git@github.com:streamethorg/streameth-platform.git
cd streameth-platform
yarn install
yarn dev # or yarn dev
```

## Contribution Guidelines

We welcome contributions from everyone. To contribute:

- **Issues**: Feel free to submit issues for bug reports, feature requests, or suggestions through our [Issues tab](#).
- **Pull Requests**: If you wish to contribute code, please make a pull request (PR) with a clear list of what you've done.

Read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information on how to contribute, commit messages, and the code review process.
