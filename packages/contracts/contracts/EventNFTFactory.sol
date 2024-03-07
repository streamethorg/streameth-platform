// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./EventNFT.sol";

contract StageFactory {
    address[] public events;

     event EventCreated(address indexed eventAddress, address indexed creator);

    function createEvent(
         string memory _uri,
        string memory _name,
        string memory _description,
        bool _limitedSupply,
        uint256 _totalSupply,
        uint256 _mintPrice,
        uint256 _mintStartTime,
        uint256 _mintEndTime
    ) public returns (address){
        Event e = new Event();
        e.initialize(_uri, _name, _description, _limitedSupply, _totalSupply, _mintPrice, _mintStartTime, _mintEndTime);
        e.transferOwnership(msg.sender);
        events.push(address(e));
        emit EventCreated(address(e), msg.sender);
        return address(e);
    }

    function getAllEvents() public view returns (address[] memory){
        return events;
    }

    function getMetadata(address _EventAddress)
        public
        view
        returns (string memory, string memory, string memory, bool, uint256, uint256, uint256)
    {
        return Event(_EventAddress).getMetadata();
    }
}