// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./EventNFT.sol";

contract EventNFTFactory {
    using Clones for address;

    address public implementation;

    address[] public events;

    event EventCreated(address indexed eventAddress, address indexed creator);

    constructor(address _impl) {
        implementation = _impl;
    }

    function createEvent(
        string memory _baseTokenURI,
        string memory _name,
        string memory _symbol,
        bool _limitedSupply,
        uint256 _maxSupply,
        uint256 _mintFee,
        uint256 _mintStartTime,
        uint256 _mintEndTime
    ) external returns (address) {
        address cloneEvent = address(implementation).clone();
        EventNFT(cloneEvent).initialize(
            _baseTokenURI,
            _name,
            _symbol,
            _limitedSupply,
            _maxSupply,
            _mintFee,
            _mintStartTime,
            _mintEndTime
        );
        EventNFT(cloneEvent).transferOwnership(msg.sender);
        events.push(address(cloneEvent));
        emit EventCreated(address(cloneEvent), msg.sender);
        return address(cloneEvent);
    }

    function getAllEvents() external view returns (address[] memory) {
        return events;
    }

    function getMetadata(
        address _eventAddress
    )
        external
        view
        returns (string memory, string memory, bool, uint256, uint256, uint256)
    {
        return EventNFT(_eventAddress).getMetadata();
    }
}
