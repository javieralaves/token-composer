# Token Composer

Experimental dApp to create ERC-20 "bundles" backed by USDC deposits. Bundles are deployed through a factory contract and track a set of weighted tokens. Depositors receive bundle shares representing their proportional ownership.

The project consists of Hardhat smart contracts and a Next.js front‑end that interacts with them using Wagmi.

## Development

Start the web application:

```bash
npm run dev
```

Hardhat is configured to use a local copy of `solc` so that compilation works without network access:

```bash
npm run compile
```

Running the tests requires the contracts to be compiled. If the compiler cannot be downloaded because of network restrictions, the command will fail.

```bash
npx hardhat test
```

## Environment

`NEXT_PUBLIC_FACTORY_ADDRESS` should point to a deployed `TokenBundleFactory` when interacting with the app.
