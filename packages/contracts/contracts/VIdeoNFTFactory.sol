// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./VideoNFT.sol";

contract VideoNFTFactory is Ownable(msg.sender) {
    using Clones for address;

    address public implementation;

    address[] public videoCollections;

    event VideoCreated(
        address indexed videoCollectionAddress,
        address indexed creator
    );
    event ImplemnationUpdated(address indexed newImplementationAddress);
    constructor(address _impl) {
        implementation = _impl;
    }

    function createVideoCollection(
        string memory _baseTokenURI,
        string memory _name,
        string memory _symbol,
        bool _limitedSupply,
        uint256 _maxSupply,
        uint256 _mintFee,
        uint256 _mintStartTime,
        uint256 _mintEndTime
    ) external returns (address) {
        address cloneVideoCollection = address(implementation).clone();
        VideoNFT(cloneVideoCollection).initialize(
            _baseTokenURI,
            _name,
            _symbol,
            _limitedSupply,
            _maxSupply,
            _mintFee,
            _mintStartTime,
            _mintEndTime
        );
        VideoNFT(cloneVideoCollection).transferOwnership(msg.sender);
        videoCollections.push(address(cloneVideoCollection));
        emit VideoCreated(address(cloneVideoCollection), msg.sender);
        return address(cloneVideoCollection);
    }

    function getAllVideoCollections() external view returns (address[] memory) {
        return videoCollections;
    }

    function getMetadata(
        address _videoAddress
    )
        external
        view
        returns (string memory, string memory, bool, uint256, uint256, uint256)
    {
        return VideoNFT(_videoAddress).getMetadata();
    }

    function updateImplentation(address _impl) public onlyOwner {
        implementation = _impl;
        emit ImplemnationUpdated(_impl);
    }
}
