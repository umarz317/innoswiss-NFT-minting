import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { appContext } from "../App";
import logo from "../assets/images/logo.png";
import gif from '../assets/images/nfts.gif';
import polygonIcon from '../assets/images/polygon-icon.webp'
import { useSigner } from "wagmi";


const MintPage = () => {

  const [showNFTs, setShowNFTs] = useState(false)
  const [mintAmount, setMintAmount] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [canMint, setCanMint] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("Loading...")
  const [warning, setWarning] = useState("")
  const url = 'https://brown-hilarious-galliform-710.mypinata.cloud/ipfs/'
  const cid = 'QmdxiuHAkbUDJimMvCrFbDqqM4tAqrh4sTxJTcbCjCTMhY/'
  const [balance, setBalance] = useState(-1)

  const { data: signer, isSuccess, isFetched } = useSigner({
    onSuccess() {
      console.log('ok')
    }
  })

  const price = 0.1

  const [
    contractAddress,
    contractABI,
  ] = useContext(appContext);

  useEffect(() => {
    if (isFetched) {
      async function mintCheck() {
        var balance = ethers.utils.formatEther(await signer.getBalance())
        setBalance(balance)
        if (parseFloat(balance) < price) {
          setWarning("**Low Balance**")
          setCanMint(false)
        }
        else {
          setCanMint(true)
        }
      }
      if (balance < 0) {
        mintCheck()
      }
    }
    return () => {

    }
  }, [isFetched, showNFTs]);

  function quantityClick(bool) {
    var amount = mintAmount
    if (bool) {
      amount += 1
      setMintAmount(amount)
    }
    else {
      amount -= 1
      setMintAmount(amount)
    }
    if (parseFloat(balance) < price * (amount)) {
      setWarning("**Low Balance**")
      setCanMint(false)
    }
    else {
      setWarning('')
      setCanMint(true)
    }
  }

  async function getMintedNFTsImage(mintedID, mintedCount) {
    var nftArray = []
    await setTimeout(1000);
    for (var i = mintedID; i < mintedID + mintedCount; i++) {
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
      signer
    );
    try {
      const response = parseInt((await contract.totalSupply()).toString()) + 1;
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
      signer
    );
    try {
      var value = mintAmount * price
      value = Math.round(value * 10) / 10
      value = ethers.utils.parseEther(value.toString())
      console.log(value.toString())
      const response = await contract.mintBatch(mintAmount, { value: value });
      const tx = await response.wait()
      if (tx['status'] === 1) {
        setMessage("Minted! Loading NFTs...")
        getMintedNFTsImage(mintedID, mintAmount)
      }
    }
    catch (err) {
      console.log(err);
      setMessage('Failed!');
      resetLoading();
    }

  }

  async function resetLoading() {
    setTimeout(() => {
      setLoading(false)
      setMessage("Loading...");
    }, 2000);
  }

  function resetFromNFTDisplay() {
    //refetch balance
    setBalance(-1);
    setShowNFTs(false);
    setMintedNFTs([]);
  }

  return (
    <>
      <div className="Container">
        <div className="transparentBox">
          <h4 style={{ position: 'absolute', right: '10px', bottom: '80px' }}>{Math.round((mintAmount * price) * 10) / 10} <img className="TokenIcon" src={polygonIcon} /></h4>
          <div className="logoDiv">
            <img width={55} height={55} style={{ marginLeft: "-40px", marginRight: '5px' }} src={logo} />
            <h2>The Council Of AI</h2>
            <h4 style={{ position: 'absolute', bottom: '-18px' }} className="altfont">Genesis collection</h4>
          </div>
          <>
            {loading ?
              <h1>{message}</h1>
              :
              <>
                {!showNFTs ?
                  <>
                    <div className="gifDiv">
                      <img className="nftsGif" width={180} height={264} src={gif} />
                      <h1 className="nftsGifText">?</h1>
                    </div>

                    <div className="mintBtnDiv">

                      <button className="mintBtn"
                        style={{ left: "15px", backgroundColor: '#5dac0d', border: '0', color: 'white' }}
                        onClick={() => {
                          {
                            mintAmount > 1 ? quantityClick(false) : <></>;
                          }
                        }}
                      >
                        -
                      </button>
                      <button className="mintBtn" style={{ marginLeft: '40px', marginRight: '40px', }}>
                        {mintAmount}
                      </button>
                      <button className="mintBtn"
                        style={{ right: "15px", backgroundColor: '#5dac0d', border: '0', color: 'white' }}
                        onClick={() => {
                          {
                            mintAmount < 4 ? quantityClick(true) : <></>;
                          }
                        }}
                      >
                        +
                      </button>
                      <div style={{ marginTop: '30px' }}>
                        <button id='mintBTN' onClick={MintFunction} className="mintBtn">{loading | !canMint ? "..." : "MINT!"}</button>
                      </div>
                      <h4 style={{ position: 'absolute', bottom: '-10px', right: '-70px' }}>{price} <img className="TokenIcon" src={polygonIcon} /> / NFT</h4>
                      <h5 id='warning' style={{ position: 'absolute', bottom: '-30px', right: '-90px', color: 'orange' }}>{warning}</h5>
                    </div>
                  </> :

                  <div className="nftBox">
                    <h3 className="nftText">NFTs Minted!</h3>
                    <div className="nftImagesDiv">
                      {mintedNFTs.map(element => {
                        return (<img className="nftImage" src={url + cid + element + '.png'} />);
                      })}
                    </div>
                    <div className="nftBackBtnDiv">
                      <button onClick={() => {
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
