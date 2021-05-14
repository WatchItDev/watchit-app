pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract W1155Token is ERC1155 {

    constructor (string memory _uri) ERC1155(_uri) {}

}
