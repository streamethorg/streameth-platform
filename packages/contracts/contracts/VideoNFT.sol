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

contract VideoNFT is
    Initializable,
    OwnableUpgradeable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable
{
    using Strings for uint256;

    uint256 public constant baseFee = 0.000777 ether;
    uint256 public totalSupply;

    string public videoNFTName;
    string public baseTokenUri;
    bool public limitedSupply;
    uint256 public maxSupply;

    uint256 public mintFee;
    uint256 public mintStartTime;
    uint256 public mintEndTime;

    address public constant streamethGnosisWallet =
        0x9268d03EfF4A9A595ef619764AFCB9976c0375df;

    mapping(address => mapping(uint256 => bool)) public sessionMinted;

    /// ======================== Events ========================
    event SessionMinted(address receipeint, uint256 mintPrice);

    function initialize(
        string memory _baseTokenUri,
        string memory _name,
        string memory _symbol,
        bool _limitedSupply,
        uint256 _maxSupply,
        uint256 _mintFee,
        uint256 _mintStartTime,
        uint256 _mintEndTime
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __ERC721URIStorage_init();
        __Ownable_init(_msgSender());

        baseTokenUri = _baseTokenUri;
        videoNFTName = _name;
        limitedSupply = _limitedSupply;
        maxSupply = _maxSupply;
        mintFee = _mintFee;
        mintStartTime = _mintStartTime;
        mintEndTime = _mintEndTime;
    }

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

    function setTokenURI(string memory _baseTokenUri) public onlyOwner {
        baseTokenUri = _baseTokenUri;
    }

    function setName(string memory _name) public onlyOwner {
        videoNFTName = _name;
    }

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
    function sessionMint(uint256[] calldata _id) public payable {
        uint256 amount = _id.length;
        uint256 mintPrice = (mintFee + baseFee) * amount;
        require(msg.value == mintPrice, "Incorrect mint fee");
        require(msg.sender == tx.origin, "Contract call");

        if (limitedSupply) {
            require(totalSupply < maxSupply, "No more tokens available");
        }

        // Transfer baseFee to the streamethGnosisWallet
        payable(streamethGnosisWallet).transfer(baseFee * amount);

        uint256[] memory id = _id;
        uint8 _index = 0;
        for (uint256 i = 1; i <= amount; i++) {
            string memory uri = string.concat(
                baseTokenUri,
                Strings.toString(id[_index])
            );
            mintAction(uri);
            sessionMinted[msg.sender][id[_index]] = true;
            _index++;
        }
        emit SessionMinted(msg.sender, mintPrice);
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
        returns (string memory, string memory, bool, uint256, uint256, uint256)
    {
        return (
            baseTokenUri,
            videoNFTName,
            limitedSupply,
            totalSupply,
            maxSupply,
            mintFee
        );
    }
}
