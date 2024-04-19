# NFT Contract`

### VideoNFT implementation https://sepolia.basescan.org/address/0xc874C3CB9fA5131D8978dF3eD3996D620415d73A#code

### VideoNFT Factory https://sepolia.basescan.org/address/0x12fb8277a7aA0210fe44fAD5eDb1F7ceA4490E9e#code

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
