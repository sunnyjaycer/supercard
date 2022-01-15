const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");

const hre = require("hardhat");

async function main() {

    
    accounts = await web3.eth.getAccounts();

    console.log(accounts)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});