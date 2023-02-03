import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public"
import { songbird } from "./songbird.ts";

const root = ReactDOM.createRoot(document.getElementById('root'));

const { chains, provider, webSocketProvider } = configureChains(
  [songbird], [publicProvider()]
)

const client = createClient({
  autoConnect: true, provider, webSocketProvider
})

root.render(
<WagmiConfig client={client}>
      <App />
</WagmiConfig>
);