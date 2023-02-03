import { Chain } from "wagmi"

export const songbird = {
  id: 19,
  name: 'Songbird',
  network: 'Songbird Flare',
  nativeCurrency: {
    decimals: 18,
    name: 'SGB',
    symbol: 'SGB',
  },
  rpcUrls: {
    default: { http: ['https://songbird.towolabs.com/rpc'] },
    public: { http: ['https://songbird.towolabs.com/rpc'] },
  },
  blockExplorers: {
    etherscan: { name: 'songbird-explorer', url: 'https://songbird-explorer.flare.network/' },
    default: { name: 'songbird-explorer', url: 'https://songbird-explorer.flare.network/' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13382504,
    },
  },
} as const satisfies Chain