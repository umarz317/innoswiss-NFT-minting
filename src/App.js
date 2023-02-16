import React, { useState, useEffect, createContext } from "react";
import "./App.css";
import Login from "./components/Login";
import MintPage from "./components/MintPage";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public"
import { songbird } from "./songbird.ts";

export const appContext = createContext();

function App() {

  

 

  const { isConnected } = useAccount()

  useEffect(()=>{
    console.log(isConnected)
  },[isConnected]);

  const contractAddress = "0x21a8075deDe971Dd8a5E88Eb3Ef608e114d65fb2";
  const [saleComplete, setSaleComplete] = useState(null);

  return (
      <appContext.Provider
        value={[
          contractAddress,
          saleComplete, setSaleComplete
        ]
}
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
  );
}

export default App;

