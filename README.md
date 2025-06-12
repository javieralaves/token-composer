# Token Composer

Experimental dApp to create ERC-20 "bundles" backed by USDC deposits. Bundles are deployed through a factory contract and track a set of weighted tokens. Depositors receive bundle shares representing their proportional ownership.

The project consists of Hardhat smart contracts and a Next.js front‑end that interacts with them using Wagmi.

## Development

Install dependencies with:

```bash
npm install
```

Start the web application:

```bash
npm run dev
```

Hardhat uses a local copy of `solc` so that compilation works without network access:

```bash
npm run compile
```

Running the tests requires the contracts to be compiled. If the compiler cannot be downloaded because of network restrictions, the command will fail.

```bash
npx hardhat test
```

## Environment

Create a `.env.local` file containing the address of a deployed `TokenBundleFactory` on Base Sepolia:

```bash
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
```

Restart the dev server after adding the file.

## Deploying to Base Sepolia

You need Base Sepolia ETH to pay for gas. Request it from the official Base faucet or bridge Sepolia ETH using the Base bridge. Configure your wallet to use the Base Sepolia RPC (`https://sepolia.base.org`, chain ID `84532`).

Add a network entry to `hardhat.config.js`:

```js
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {},
        path: require.resolve("solc/soljson.js"),
      },
    ],
  },
  networks: {
    base_sepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
```

Create a deployment script `scripts/deployFactory.js`:

```js
const hre = require("hardhat");

async function main() {
  const Factory = await hre.ethers.getContractFactory("TokenBundleFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  console.log("Factory deployed to:", await factory.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
```

Run the deployment:

```bash
PRIVATE_KEY=0xYourKey BASE_SEPOLIA_RPC_URL=https://sepolia.base.org \
npx hardhat run scripts/deployFactory.js --network base_sepolia
```

Copy the deployed address into `NEXT_PUBLIC_FACTORY_ADDRESS` and restart the dev server.
