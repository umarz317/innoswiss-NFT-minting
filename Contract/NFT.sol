// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';


contract NFT is ERC721Enumerable{

    using Strings for uint256;
    
    uint256 public basePrice = 6000 * (10 ** 18);

    address private admin = address(0x945b6917639FDdBB12aE4729990B9368DAd40f15);

    modifier adminOnly(){
        require(msg.sender==admin,"You don't have access to this function!");
        _;
    }

    constructor() ERC721("The Council Of AI","COAI"){
    }

    function mint() public adminOnly{
        _mint(msg.sender, totalSupply()+1);
    }

    function _baseURI() internal pure override returns (string memory){
        return "https://brown-hilarious-galliform-710.mypinata.cloud/ipfs/QmUKsfRnMaeG1staUcm2ATFvcgQGCcXrLgLeFAYYghejSw/";
    }

    function tokenURI(uint256 tokenId) public view override returns(string memory){
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI,tokenId.toString(),".json")):"";
    }

    function mintBatch(uint256 quantity) public payable {
        require(msg.value == quantity*basePrice,"Invalid Amount Sent!");
        for(uint i = 0; i<quantity ;i++){
            _mint(msg.sender, totalSupply()+1);
        }
    }

    function withdraw() public adminOnly{
        require(address(this).balance>0,"No balance to withdraw");
        payable(admin).transfer(address(this).balance);
    }

    function changePrice(uint256 newPrice) public adminOnly{
        basePrice = newPrice * (10 ** 18);
    }

}