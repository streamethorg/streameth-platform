// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

event sessionMinted(address receipeint, uint256 sessionId);

error MintFeeNotPaid(string message);
error NonExistentTokenURI(string message);
error WithdrawTransfer(string message);

contract Event is ERC721, ERC721URIStorage, Ownable(msg.sender) {

    using Strings for uint256;
    uint256 public totalSupply;
    bool public isInitialized = false;

    string public EventName;
    string public baseTokenURI;
    string public description;
    bool public limitedSupply;
    uint256 public maxSupply;
    string uri;

    uint256 public mintFee;
    uint256 public mintStartTime;
    uint256 public mintEndTime;

    address[] public EventAddresses;

   
    mapping(address => mapping(uint256 => bool)) private _sessionMinted;

    constructor() ERC721("StreamethEvent", "SEVENT") {}

    function initialize(
        string memory _baseTokenURI,
        string memory _name,
        string memory _description,
        bool _limitedSupply,
        uint256 _maxSupply,
        uint256 _mintFee,
        uint256 _mintStartTime,
        uint256 _mintEndTime
    ) external {
        require(!isInitialized, "Contract is already initialized!");
        isInitialized = true;
        baseTokenURI = _baseTokenURI;
        EventName = _name;
        description = _description;
        limitedSupply = _limitedSupply;
        maxSupply = _maxSupply;
        mintFee = _mintFee;
        mintStartTime = _mintStartTime;
        mintEndTime = _mintEndTime;
    }

    // @dev: This function is used to add new addresses to the list of allowed people to stream
    // @param: _newEmitter: address of the new emitter
    // @return: void
    function addEmitterAddress(address _newEmitter) public onlyOwner {
        EventAddresses.push(_newEmitter);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
      	return super.tokenURI(tokenId);
    }

    function setTokenURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function setName(string memory _name) public onlyOwner {
        EventName = _name;
    }

    function setDescription(string memory _description) public onlyOwner {
        description = _description;
    }
    // @dev: This function is used to update the mint fee, can only be called by onlyOwner
    function setMintFee(uint256 _mintFee) public onlyOwner {
        mintFee = _mintFee;
    }


       /// ======================== Mint Methods ========================
    	function mintAction(string memory _uri ) internal{
		 uint256 tokenId = ++totalSupply;
   		_safeMint(msg.sender, tokenId);
          _setTokenURI(tokenId,_uri);

	}

    // @dev: This function is used to mint a new token paying the mint price or free if the caller is the owner
    // @param: recipient: address of the recipient
    // @return: newTokenId: id of the new token
    function sessionMint(uint256 sessionId) public payable {
        require(!_sessionMinted[msg.sender][sessionId], "User has already minted this session");
        require(mintStartTime < block.timestamp && block.timestamp < mintEndTime, "Not mint period");

        if (limitedSupply) {
            require(totalSupply < maxSupply, "No more tokens available");
        }

        if (msg.sender == owner()) {
            uri = string.concat(baseTokenURI, Strings.toString(sessionId), ".json");
            _sessionMinted[msg.sender][sessionId] = true;
              mintAction(uri);
        }

        if (msg.value < mintFee) {
            revert MintFeeNotPaid("Mint fee not paid");
        } else {
           uri = string.concat(baseTokenURI, Strings.toString(sessionId), ".json");
            _sessionMinted[msg.sender][sessionId] = true;
              mintAction(uri);
         
        }
        emit sessionMinted(msg.sender, sessionId);
    }

    // @dev: This function is used to withdraw the payments from the contract
    // @param: payee: address of the payee
    // @return: void
    function withdrawPayments(address payable recipient) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = recipient.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer("Transfer failed");
        }
    }

        function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getMetadata()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            bool,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            baseTokenURI,
            EventName,
            description,
            limitedSupply,
            totalSupply,
            maxSupply,
            mintFee
        );
    }
}