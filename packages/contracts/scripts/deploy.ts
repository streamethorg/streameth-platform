import { ethers } from "hardhat";

async function main() {
  // Deploy Implementation contract
  const ImplContract = await ethers.getContractFactory("VideoNFT");
  const deployImplContract = await ImplContract.deploy();
  await deployImplContract.waitForDeployment();
  console.log("DeployedImplContractAt:", await deployImplContract.getAddress());

  // Deploy factory contract
  const factoryContract = await ethers.getContractFactory("VideoNFTFactory");
  const deployFactoryContract = await factoryContract.deploy(
    await deployImplContract.getAddress()
  );
  await deployFactoryContract.waitForDeployment();

  console.log(
    "DeployedFactoryContractAt:",
    await deployFactoryContract.getAddress()
  );

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(50000);

  // Verify the Implementation contract after deploying
  //@ts-ignore
  await hre.run("verify:verify", {
    address: await deployImplContract.getAddress(),
    constructorArguments: [],
  });
  // Verify the Factory contract after deploying
  //@ts-ignore
  await hre.run("verify:verify", {
    address: await deployFactoryContract.getAddress(),
    constructorArguments: [await deployImplContract.getAddress()],
  });

  console.log("done");

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
