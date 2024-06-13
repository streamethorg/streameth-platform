# NFT Contract`

### VideoNFT implementation https://basescan.org/address/0xaB29f1B8DfF6De1ad4aC19de32990683da002a27#code

### VideoNFT Factory https://basescan.org/address/0x9F519A0e442f5e8FB1492638b0f3aA621182A9DA#code

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
