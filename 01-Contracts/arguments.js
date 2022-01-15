const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");

module.exports = [
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
];