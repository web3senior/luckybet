require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.25", // Replace with your desired solidity version
      },
    ],
  },
  networks: {
    linea_sepolia: {
      url: process.env.LINEA_SEPOLIA_URL || "https://rpc.sepolia.linea.build",
      chainId: 59141, // Linea Sepolia Chain ID
      accounts: ['f8ede5f13b521b2b97939b657c1b1afc4ee3c1185d644b4451b995e5eb3763d0'],
    },
  },
};
