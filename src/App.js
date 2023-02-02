import React, { useState, useEffect, createContext } from "react";
import "./App.css";
import Login from "./components/Login";
import MintPage from "./components/MintPage";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public"
import contractABI from './assets/abi.json'

export const appContext = createContext();

function App() {

  const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai], [publicProvider()]
  )

  const client = createClient({
    autoConnect: true, provider, webSocketProvider
  })

  const { address, isConnected } = useAccount()


  const contractAddress = "0xBe9662C5BFEC5fBb9928EdCAF8dAe752C444dE1d";

  return (
    <WagmiConfig client={client}>
      <appContext.Provider
        value={[

          contractAddress,
          contractABI,

        ]}
      >
        <>
          <div className="App">


            {isConnected ?
              <div>
                <MintPage />
              </div>
              :
              <div>
                <Login />
              </div>
            }

          </div>
        </>
      </appContext.Provider>
    </WagmiConfig>
  );
}

export default App;

