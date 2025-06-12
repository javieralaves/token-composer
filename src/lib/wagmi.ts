import { createConfig, http } from 'wagmi';
import { hardhat } from 'wagmi/chains';

export const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('http://localhost:8545'),
  },
});
