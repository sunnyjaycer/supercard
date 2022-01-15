const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");

module.exports = [
    "0xc41876DAB61De145093b6aA87417326B24Ae4ECD",
    "TradeableFlow",
    "TF",
    "base-link",                                          // Base URI
    "0x0F1D7C55A2B133E000eA10EeC03c774e0d6796e8",         // payment token
    "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2",         // lending token
    130000,                                               // Interest rate (130,000 = 30%)
    toWad(2000).toString(),                                          // Max LOC
    "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6",         // SF host
    "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A",         // SF CFA
    ""
];