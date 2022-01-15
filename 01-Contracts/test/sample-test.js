const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");

const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");

const erc20Token = artifacts.require("ERC20.sol");
const TradeableFlow = artifacts.require("TradeableFlow.sol");

const traveler = require("ganache-time-traveler");
const { assert } = require("hardhat");
const ONE_DAY = 3600 * 24;
const ONE_HOUR = 3600;
const ONE_MINUTE = 60;
const TO_GWEI = 10**18;

describe("TradeableFlow", function () {

  let accounts;

  before(async function () {
      accounts = await web3.eth.getAccounts();
  });
  
  const errorHandler = (err) => {
      if (err) throw err;
  };

  const names = ["Admin", "Alice", "Bob", "Carol", "Dan", "Emma", "Frank"];
  const tokens = ["fUSDC"]

  let sf;
  let app;
  const token_directory = {}  // token => regulartoken, supertoken
  const user_directory = {};  // alias => sf.user
  const alias_directory = {}; // address => alias

  alias_directory[`0x0000000000000000000000000000000000000000`] = "-----"

  before(async function () {
      //process.env.RESET_SUPERFLUID_FRAMEWORK = 1;
      // Deploy SuperFluid test framework
      await deployFramework(errorHandler, {
          web3,
          from: accounts[0],
      });
  });

  beforeEach(async function () {
      for (var i = 0; i < tokens.length; i++) {
          // Deploy ERC20 token
          await deployTestToken(errorHandler, [":", tokens[i]], {
              web3,
              from: accounts[0],
          });
          // Deploy SuperToken
          await deploySuperToken(errorHandler, [":", tokens[i]], {
              web3,
              from: accounts[0],
          });
      }

      // Deploy and Initialize Superfluid JS SDK framework with token
      sf = new SuperfluidSDK.Framework({
          web3,
          version: "test",
          tokens: tokens,
      });
      await sf.initialize();

      for (var i = 0; i < tokens.length; i++) {
          
          token_directory[tokens[i]] = {}
          token_directory[tokens[i]]['supertoken'] = sf.tokens[tokens[i]+"x"]
          token_directory[tokens[i]]['regulartoken'] = await sf.contracts.TestToken.at(await sf.tokens[tokens[i]].address)

      }

      // Constructing a user dictionary with the below mapping of aliases to Superfluid user objects
      // Constructing a alias diction with the mapping of addresses to aliases
      for (var i = 0; i < names.length; i++) {
          user_directory[names[i].toLowerCase()] = accounts[i];
          // user_directory[names[i].toLowerCase()].alias = names[i];
          alias_directory[user_directory[names[i].toLowerCase()]] = names[i];
          console.log(names[i],"|",accounts[i])

      }

      for (var i = 0; i < tokens.length; i++) {
          // Mint 100000000 regulartokens for each user 
          // Approving reception of supertokens for each user
          for (const [, user] of Object.entries(user_directory)) {
              if (alias_directory[user] === "App") return;
              await web3tx(token_directory[tokens[i]]['regulartoken'].mint, `${alias_directory[user]} mints many ${tokens[i]}`)(
                  user,
                  toWad(100000000),
                  {     
                      from: user,
                  }
              );
              await web3tx(token_directory[tokens[i]]['regulartoken'].approve, `${alias_directory[user]} approves ${tokens[i]}x`)(
                  token_directory[tokens[i]]['supertoken'].address,
                  toWad(100000000),
                  {
                      from: user,
                  }
              );

              checkTokenBalance(user,token_directory[tokens[i]]['regulartoken'])
          }

          console.log(tokens[i]+"x","|",token_directory[tokens[i]]['supertoken'].address);
      }

      //u.zero = { address: ZERO_ADDRESS, alias: "0x0" };
      console.log("Admin:", user_directory.admin);
      console.log("Host:", sf.host.address);
      console.log("CFA:", sf.agreements.cfa.address);

      // Mint "USDC" token
      usdc = await erc20Token.new(
          "US Dollar Coin",
          "USDC",
          {from:user_directory.alice}
      )
      
      console.log("$usdc Address:",usdc.address)
      console.log(`$usdc balance for Alice is ${await usdc.balanceOf(user_directory.alice)}`)

      // Deploy TradeableFlow contract
      app = await TradeableFlow.new(
          user_directory.admin,
          "SuperCard",
          "SC",
          "ipfs://",                                          // Base URI
          token_directory["fUSDC"]["supertoken"].address,
          usdc.address,
          130000,
          toWad(2000),
          sf.host.address,
          sf.agreements.cfa.address,
          ""
      );

      // Create user directory record for TradeableFlow contract
      user_directory.app = app.address

  });

  async function checkTokenBalance(user,token) {
    console.log(`$${await token.symbol()} Balance of`, alias_directory[user], "is:", (await token.balanceOf(user)).toString());
  }

  async function logUsers(userList) {
    let header = `USER\t`
    for (let i = 0; i < tokens.length; ++i) {
        header += `|\t${tokens[i]}x\t`
    }
    console.log(header)
    console.log("--------------------------------")
    for (let i = 0; i < userList.length; i++) {
        row = `${alias_directory[userList[i]]}\t`
        for (let j = 0; j < tokens.length; ++j) {
            var tempUser = sf.user({ address: userList[i], token: token_directory[tokens[j]]['supertoken'].address });
            row += `|\t${ Math.round( ( (await tempUser.details()).cfa.netFlow )*(60*60*24*30)/10**18 ) }\t`
        }
        // row += `|\t${alias_directory[( await app.getAffiliateForSubscriber( userList[i] ) )]}\t`
        // row += `|\t${( await app.getAffiliateTokenIdForSubscriber( userList[i] ) ).toString()}`
        console.log(row)
    }
    console.log("--------------------------------")
    // bottomline = `App\t`
    // for (let i = 0; i < tokens.length; ++i) {
    //     let tempUser = sf.user({ address: user_directory.app, token: token_directory[tokens[i]]['supertoken'].address });
    //     bottomline += `|\t${(await tempUser.details()).cfa.netFlow}\t`
    // }
    // bottomline += "|"
    // console.log(bottomline)
    // console.log("==============================================================================================")
  }

  async function upgrade(accounts,supertoken) {
    for (let i = 0; i < accounts.length; ++i) {
        await web3tx(
            supertoken.upgrade,
            `${alias_directory[accounts[i]]} upgrades many ${await supertoken.symbol()}`
        )(toWad(100000000), { from: accounts[i] });
        await checkTokenBalance(accounts[i],supertoken);
    }
  }

  describe("sending flows", async function () {

    it("Testing happy path", async () => {
      const { admin, alice, bob, carol, dan, emma, frank } = user_directory
      userList = [admin, alice, bob, carol]

      // Admin = SCOwner
      // Alice = Employer

      // Upgrade all of Alice's USDC
      await upgrade([alice],token_directory["fUSDC"]["supertoken"]);

      // Give App a little USDCx so it doesn't get mad over deposit allowance
      await token_directory["fUSDC"]["supertoken"].transfer(user_directory.app, toWad(100), {from:alice});

      // Alice tosses 100,000 usdc into app for lending and gives some to her friends
      await usdc.transfer(app.address,toWad(1000000),{from:alice});
      await usdc.transfer(bob,toWad(10000),{from:alice});
      await usdc.transfer(carol,toWad(10000),{from:alice});

      // Admin registers Alice as employer
      await app.changeEmployerRegistration(alice, {from:admin});

      // Admin sets CID
      await app.setCID("QmaQCJ5YoP1g48FtrwpUjFfL3nmVVeWVxrNMWkAsRpvjFt");

      // Alice registers Bob as employee
      await app.registerEmployee(bob,{from:alice});

      // Bob mints supercard
      await app.mint({from:bob});

      // Metadata url
      console.log("Metadata URL:",await app.tokenURI(1));
      console.log()

      // Alice starts paying token 1
      console.log("Alice starts paying Bob through token ID 1")
      await sf.cfa.createFlow({
        superToken:   token_directory["fUSDC"]["supertoken"].address, 
        sender:       alice,
        receiver:     user_directory.app,
        flowRate:     parseInt(toWad(5000)/(30 * 24 * 60 * 60)).toString(),
        userData:     web3.eth.abi.encodeParameter('uint256',1)
      });

      await logUsers(userList)

      // Bob opens LOC and borrows 1k
      console.log("USDC balance of Bob:", (await usdc.balanceOf(bob) ).toString())
      console.log("Bob opens an LOC of 1000 USDC")
      await app.openLoc({from:bob})
      await app.borrow(toWad(1000), {from:bob})
      console.log("USDC balance of Bob:", (await usdc.balanceOf(bob) ).toString())

      await logUsers(userList)

      // Bob sends SC to Carol
      console.log("Bob transfers Supercard NFT to Carol")
      await app.transferFrom(bob,carol,1,{from:bob});
      await logUsers(userList)

      // Carol repays the 1k loan
      console.log("Carol repays the 1000 USDC loan")
      await usdc.approve(app.address,toWad(1000),{from:carol});
      await app.repay(toWad(1000), {from:carol})
      await logUsers(userList)

      // Alice doubles salary flow
      console.log("Alice doubles salary flow")
      await sf.cfa.updateFlow({
        superToken:   token_directory["fUSDC"]["supertoken"].address, 
        sender:       alice,
        receiver:     user_directory.app,
        flowRate:     parseInt(toWad(10000)/(30 * 24 * 60 * 60)).toString(),
        userData:     web3.eth.abi.encodeParameter('uint256',1)
      });
      await logUsers(userList)

      // Alice cancels flow to 
      console.log("Alice cancels salary flow")
      await sf.cfa.deleteFlow({
        superToken:   token_directory["fUSDC"]["supertoken"].address, 
        sender:       alice,
        receiver:     user_directory.app,
        by:           alice
      });
      await logUsers(userList)

    });

  });

//   Nonce
//   10
//   Amount
//   -0 ETH
//   Gas Limit (Units)
//   29500000
//   Total Gas Fee
//   0
//   ETH
//   Max Fee Per Gas
//   0.000000002
//   ETH

})