# NFT Contract`

### EventNFT implementation https://sepolia.basescan.org/address/0xd6Cf19dA8c196AFB5954e551C6ce9786F229e358#code

### EventNFT Factory https://sepolia.basescan.org/address/0xA9908C45F67d35981C7985Ebfe8052f1F57C00f6#code

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts
npx hardhat run scripts/deploy.ts --network <network name>
```

### Environment Variables

Create a `.env` file at the root of the project and include the following variables:

```bash
ALCHEMY_API_KEY_URL=<Your API Key URL> # RPC URL
PRIVATE_KEY=<Your account private key>
BASESCAN_API_KEY=<Your Basescan api key> # generate an API key from basescan.org
```
