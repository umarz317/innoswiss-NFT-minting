import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { appContext } from "../App";
import logo from "../assets/images/logo.png";
import { providers } from "ethers";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

const Login = () => {

  const [error, setError] = useState("");
  const [totalMinted,setTotalMinted] = useState()
  const [saleComplete, setSaleComplete] = useState(false);
  const [loading, setLoading] = useState(true)

  const { connect } = useConnect({
    connector: new InjectedConnector(),
    chainId:80001
  })

  const [contractAddress, contractABI] =
    useContext(appContext);

  //deployment
  // const rpcURL = "https://bsc-dataseed1.binance.org/";
  //testing
  const rpcURL = "https://rpc-mumbai.maticvigil.com/";


  useEffect(() => {
    getTotalSupply();
  }, []);

  async function ConnectWallet() {
    connect()
  }

  async function getTotalSupply() {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      new ethers.providers.getDefaultProvider(
        rpcURL
      )
    );
    try {
      const response = (await contract.totalSupply()).toString();
      setTotalMinted(response);
      setLoading(false);
      if (response === 500) {
        setSaleComplete(true);
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="Container">

      <div className="transparentBox">
        <div className="logoDiv">
          <img width={55} height={55} style={{ marginRight: "5px" }} src={logo} />
          <h2>The Council Of AI</h2>
          <h4 style={{ position: 'absolute', bottom: '-15px', right: '10px' }} className="altfont">Genesis collection</h4>
        </div>
        <div>
          <h3> {totalMinted}/1000 NFTs Minted!</h3>
        </div>
        <button
          className="buttonConnect"
          onClick={() => {
            if (!saleComplete && !loading)
              ConnectWallet();
          }}
        >
          {!loading ? <>{saleComplete ? <>Sale Completed..</> : <>Connect Wallet</>}</> : <>...</>}
        </button>
        <h4 style={{ position: 'absolute', bottom: '65px' }}>Connect Wallet To Mint!</h4>
        <h5 style={{ position: 'absolute', bottom: '0', marginBottom: '5px', letterSpacing: "1.5px", color: "yellow" }}>{error}</h5>
      </div>
    </div>
  );
};

export default Login;

