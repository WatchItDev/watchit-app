pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract WToken is ERC1155 {
    constructor() ERC721("MyNFT", "MNFT") {
    }
}