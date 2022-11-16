import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { appContext } from "../App";
import logo from "../assets/images/icon.png";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";

const Login = () => {

  const [error,setError]=useState("");
  const [saleComplete,setSaleComplete] = useState(false);
  const [loading,setLoading]=useState(true)

  const [login, setLogin, provider, setProvider, accounts, setAccounts, totalMinted, setTotalMinted, contractAddress, contractABI,, isMetamaskAvailable, setIsMetamaskAvailable] =
    useContext(appContext);

  const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  useEffect(() => {
    getTotalSupply();
    if (isMetamaskAvailable == null) {
      if(window.ethereum!=null){
        setIsMetamaskAvailable(true)
      }
      else{
        setIsMetamaskAvailable(false)
      }
    }
  }, []);

  async function ConnectWallet() {
    if (window.ethereum) {
      var Account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      var Provider = new ethers.providers.Web3Provider(window.ethereum);
      var signer = Provider.getSigner();
      var chain = (await signer.getChainId());
      console.log(chain);
    }
    else {
      const provider = new WalletConnectProvider({
        rpc:rpcURL
      });
      var Account = await provider.enable();
      var Provider = new providers.Web3Provider(provider);
      var signer = Provider.getSigner();
      var chain = (await signer.getChainId());
      console.log(chain);
    }
      if (Account.length > 0) {
        if(chain==97){
        setLogin(true);
        setAccounts(Account);
        console.log(Provider);
        setProvider(Provider);
        }
        else{
          setError("Please network switch to BSC");
        }
      }
      console.log(chain);
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
      if(response===500){
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
          <img width={80} height={80} src={logo} />
          <h1>SantaFloki</h1>
          <h3 style={{position:'absolute',bottom:'-15px',right:'10px'}} className="altfont">Anniversary Edition</h3>
        </div>
        <div>
          <h3> {totalMinted}/500 NFTs Minted!</h3>
        </div>
        <button
          className="buttonConnect"
          onClick={() => {
            if(!saleComplete&&!loading)
              ConnectWallet();
          }}
        >
          {!loading?<>{saleComplete?<>Sale Completed..</>:<>Connect Wallet</>}</>:<>...</>}
        </button>
        <h4 style={{ position: 'absolute', bottom: '60px' }}>Connect Wallet To Mint!</h4>
        <h5 style={{ position: 'absolute', bottom: '0',marginBottom:'5px',letterSpacing:"1.5px" ,color:"yellow"}}>{error}</h5>
      </div>
    </div>
  );
};

export default Login;

