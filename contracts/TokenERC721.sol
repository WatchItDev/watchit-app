pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract W721Token is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint public tokenCount = 0;
    string private _extendedURI = "";
    constructor (string memory name_, string memory symbol_) ERC721("WMediaToken", "WMT") {}

    function _setBaseURI(string memory _uri) private returns (string memory) {
        require(bytes(_uri).length > 0, "Valid token uri needed");
        _extendedURI = _uri;
        return _extendedURI;
    }

    function _baseURI() internal view override virtual returns (string memory) {
        return _extendedURI;
    }


    function mintToken(address owner, string memory _tokenURI) public returns (uint256)
    {
        _tokenIds.increment();
        tokenCount += 1;
        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        _setTokenURI(id, _tokenURI);

        return id;
    }

}
