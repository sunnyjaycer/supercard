const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const TradeableFlow = await hre.ethers.getContractFactory("TradeableFlow");
  // const tradeableflow = await TradeableFlow.deploy(
  //   "0xc41876DAB61De145093b6aA87417326B24Ae4ECD",
  //   "SuperCard",
  //   "SC",
  //   "ipfs://",                                            // Base URI
  //   "0x0F1D7C55A2B133E000eA10EeC03c774e0d6796e8",         // payment token
  //   "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2",         // lending token
  //   130000,                                               // Interest rate (130,000 = 30%)
  //   toWad(2000).toString(),                                          // Max LOC
  //   "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6",         // SF host
  //   "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A",         // SF CFA
  //   ""
  // );
  const tradeableflow = await TradeableFlow.deploy(
    "0xc41876DAB61De145093b6aA87417326B24Ae4ECD",
    "SuperCard",
    "SC",
    "ipfs://",                                            // Base URI
    "0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a",         // payment token
    "0xc94dd466416A7dFE166aB2cF916D3875C049EBB7",         // lending token
    130000,                                               // Interest rate (130,000 = 30%)
    toWad(2000).toString(),                                          // Max LOC
    "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9",         // SF host
    "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8",         // SF CFA
    ""
  );

  await tradeableflow.deployed();

  console.log("SuperCard deployed to:", tradeableflow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// npx hardhat run scripts/deploy.js --network rinkeby
// npx hardhat run scripts/deploy.js --network goerli
// fake UWL: 0xbDfb61f061250a1f6A9e184B7B0EE8d7d4f83cfC
// second latest DEPLOYED_CONTRACT_ADDRESS: 0x38E975A42e3DfEEa6cAA9672a6Fbb3C4bdbb97a3 
// latest: 0x603c02f90299A49c009411419c392FE49a6B6096
// npx hardhat verify --network rinkeby --constructor-args arguments.js 0x4358407B34ba88f6cEf4648Ff59690Ba5bE662d3
// npx hardhat verify --network goerli --constructor-args arguments.js 0x90b067a68EcbBD8a24eA6d6d3efDB35213D8A3fA
// https://hardhat.org/tutorial/deploying-to-a-live-network.html

// Testing Steps
// Pre. transfer in USDC for lending
// Pre. transfer some USDCx
// 0. Set CID
// 1. Register an employer
// 2. As the employer, register an employee
// 3. As the employee, mint a SuperCard
// 4. As the employer, start a stream with the SuperCard token ID
// 