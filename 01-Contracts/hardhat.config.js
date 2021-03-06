require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");
require("dotenv").config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  mocha: {
    timeout: 500000000
  },
  networks: {
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_KEY,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.INFURA_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    // kovan: {
    //   url: "https://kovan.infura.io/v3/" + process.env.INFURA_KEY,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  }
};
