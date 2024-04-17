// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

/// ======================== Error Handling ========================
error MintFeeNotPaid(string message);
error NonExistentTokenURI(string message);
error WithdrawTransfer(string message);

contract EventNFT is
    Initializable,
    OwnableUpgradeable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable
{
    using Strings for uint256;

    uint256 public constant baseFee = 1e10;
    uint256 public totalSupply;

    string public eventName;
    string public baseTokenURI;
    // string public description;
    bool public limitedSupply;
    uint256 public maxSupply;

    uint256 public mintFee;
    uint256 public mintStartTime;
    uint256 public mintEndTime;

    address[] public EventAddresses;
    address public streamethGnosisWallet;

    mapping(address => mapping(string => bool)) private _sessionMinted;

/// ======================== Events ========================
    event sessionMinted(address receipeint, string sessionId);

    function initialize(
        string memory _baseTokenURI,
        string memory _name,
        string memory _symbol,
        bool _limitedSupply,
        uint256 _maxSupply,
        uint256 _mintFee,
        uint256 _mintStartTime,
        uint256 _mintEndTime,
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __ERC721URIStorage_init();
        __Ownable_init(_msgSender());
        
        baseTokenURI = _baseTokenURI;
        eventName = _name;
        limitedSupply = _limitedSupply;
        maxSupply = _maxSupply;
        mintFee = _mintFee;
        mintStartTime = _mintStartTime;
        mintEndTime = _mintEndTime;
    }

    // @dev: This function is used to add new addresses to the list of allowed people to stream
    // @param: _newEmitter: address of the new emitter
    // @return: void
    // function addEmitterAddress(address _newEmitter) public {
    //     EventAddresses.push(_newEmitter);
    // }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function setTokenURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function setName(string memory _name) public onlyOwner {
        eventName = _name;
    }

    // function setDescription(string memory _description) public  {
    //       require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()));
    //     description = _description;
    // }
    // @dev: This function is used to update the mint fee, can only be called by onlyOwner
    function setMintFee(uint256 _mintFee) public onlyOwner {
        mintFee = _mintFee;
    }

    /// ======================== Mint Methods ========================
    function mintAction(string memory _uri) internal {
        uint256 tokenId = ++totalSupply;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    // @dev: This function is used to mint a new token paying the mint price or free if the caller is the owner
    // @param: recipient: address of the recipient
    // @return: newTokenId: id of the new token
    function sessionMint(string memory sessionId) public payable {
        require(
            !_sessionMinted[msg.sender][sessionId],
            "User has already minted this session"
        );
        require(
            mintStartTime < block.timestamp && block.timestamp < mintEndTime,
            "Not mint period"
        );
        string memory uri = string.concat(baseTokenURI, sessionId, ".json");
        if (limitedSupply) {
            require(totalSupply < maxSupply, "No more tokens available");
        }

        if (msg.sender == owner()) {
            _sessionMinted[msg.sender][sessionId] = true;
            mintAction(uri);
        }

        if (msg.value < mintFee + baseFee) {
            revert MintFeeNotPaid("Mint fee not paid");
        } else {
            _sessionMinted[msg.sender][sessionId] = true;

            // Transfer baseFee to the streamethGnosisWallet
            payable(streamethGnosisWallet).transfer(baseFee);
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

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
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
            // string memory,
            bool,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            baseTokenURI,
            eventName,
            // description,
            limitedSupply,
            totalSupply,
            maxSupply,
            mintFee
        );
    }
}
