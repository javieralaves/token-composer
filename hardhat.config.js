require("@nomicfoundation/hardhat-toolbox");
const path = require("path");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {},
        // Use local solcjs shipped with the solc npm package
        path: require.resolve("solc/soljson.js"),
      }
    ],
  },
};
