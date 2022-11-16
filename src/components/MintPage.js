import React, { useState, useContext,useEffect } from "react";
import { ethers } from "ethers";
import { useMoralisWeb3Api } from "react-moralis";
import { appContext } from "../App";
import logo from "../assets/images/icon.png";
import gif from '../assets/images/nfts.gif';
import {SiBinance} from 'react-icons/si'

const MintPage = () => {
  const [
    login,
    setLogin,
    provider,
    setProvider,
    accounts,
    setAccounts,
    totalMinted,
    setTotalMinted,
    contractAddress,
    contractABI,
    accountAddress
  ] = useContext(appContext);

  useEffect(() => {
    return () => {
      console.log("Component unmounted")
      window.ethereum.removeListener('chainChanged', ()=>{});
      window.ethereum.removeListener('accountsChanged', ()=>{});
      window.ethereum.removeListener('disconnect', ()=>{});
    }
  }, []);

  window.ethereum.on('accountsChanged', () =>{setLogin(false)});
  window.ethereum.on('disconnect', () =>{setLogin(false)});
  window.ethereum.on('chainChanged', () => {setLogin(false)});

  const [showNFTs,setShowNFTs] = useState(false)
  const [mintAmount, setMintAmount] = useState(1);
  const [mintedNFTs,setMintedNFTs] = useState([]) 
  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState("Loading...")
  const url = 'https://santafloki.mypinata.cloud/ipfs'
  const cid = '/QmYTZJgpMdbHuGJbAxSTwnwHbaMr98gU4RNqUdxbH6NnAW/'

  async function getMintedNFTsImage(mintedID,mintedCount){
    var nftArray = []
    await setTimeout(1000);
    for(var i=mintedID;i<mintedID+mintedCount;i++){
      // const options = {chain: "ropsten", address: contractAddress, token_id:i};
      // console.log(options)
      // const NFT = (await Web3Api.token.getTokenIdMetadata(options))
      nftArray.push(i)
    }
    setShowNFTs(true);
    console.log(nftArray)
    setMintedNFTs(nftArray);
    setLoading(false);
  }
  

  async function getMintedID() {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    try {
      const response = parseInt((await contract.totalSupply()).toString())+1;
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  const MintFunction = async () => {
    setLoading(true);
    setMessage("Minting...!");
    var mintedID = await getMintedID()
    const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider.getSigner()
    );
    try {
      var value = mintAmount*0.25
      value = ethers.utils.parseEther(value.toString())
      console.log(value.toString())
      const response = await contract.mintBatch(mintAmount,{value:value.toString()});
      const tx = await response.wait()
      if(tx['status']===1){
        setMessage("Minted! Loading NFTs...")
        getMintedNFTsImage(mintedID,mintAmount)
      }
    } 
    catch (err) {
        console.log(err);
        setMessage('Failed!');
        resetLoading();
    }
    
  }

  async function resetLoading(){
    setTimeout(() => {
      setLoading(false)
      setMessage("Loading...");
    }, 2000);
  }

  function resetFromNFTDisplay(){
    setShowNFTs(false);
    setMintedNFTs([]);
  }

  return (
    <>
      <div className="Container">
        <div className="transparentBox">
        <div className="logoDiv">
          <img width={100} height={100} src={logo} />
          <h1>SantaFloki</h1>
          <h3 style={{position:'absolute',bottom:'-15px',right:'10px'}} className="altfont">Anniversary Edition</h3>
          </div>
          <>
          {loading?
          <h1>{message}</h1>
          :
          <>
          {!showNFTs?
          <>
          <div className="gifDiv">
            <img className="nftsGif" width={180} src={gif}/>
            <h1 className="nftsGifText">?</h1>
          </div>
          <div className="mintBtnDiv">
          <h4 style={{position:'absolute',right:'-70px'}}>{mintAmount*0.25} <SiBinance style={{width:'20px',height:'20px',color:'#F3BA2F'}}/></h4>
  
          <button className="mintBtn"
            style={{ left: "15px" }}
            onClick={() => {
              {
                mintAmount > 1 ? setMintAmount(mintAmount - 1) : <></>;
              }
            }}
          >
            -
          </button>
          <button className="mintBtn" style={{marginLeft:'40px',marginRight:'40px'}}>
            {mintAmount}
          </button>
          <button className="mintBtn"
            style={{ right: "15px" }}
            onClick={() => {
              {
                mintAmount < 4 ? setMintAmount(mintAmount + 1) : <></>;
              }
            }}
          >
            +
          </button>
          <div style={{marginTop:'30px'}}>
            <button onClick={MintFunction} className="mintBtn">Mint</button>
          </div>
          <h4 style={{position:'absolute',bottom:'-10px',right:'-70px'}}>0.25 <SiBinance style={{width:'20px',height:'20px',color:'#F3BA2F'}}/> / NFT</h4>
          </div>
          </>:

          <div className="nftBox">
            <h3 className="nftText">NFTs Minted!</h3>
            <div className="nftImagesDiv">
              {mintedNFTs.map(element =>{
                return(<img className="nftImage" src={url+cid+element+'.png'}/>);
              })}
            </div>
            <div className="nftBackBtnDiv">
                <button onClick={()=>{
                  resetFromNFTDisplay()
                }} className="buttonBlue">Mint More!</button>
            </div>
            
          </div>


          }
          </>
          }
          </>
         </div>
      </div>
    </>
  );
};

export default MintPage;
