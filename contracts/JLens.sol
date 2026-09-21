// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JSpace} from "./JSpace.sol";

/**
 * @title  JLens
 * @notice The readout. Ping sits you in J-space. Spark is ignition (0.0001 ETH).
 *         Fit is a signal. ETH forwards to J-space as glow, not yield.
 */
contract JLens {
    address public owner;
    JSpace public space;
    address public token;
    uint256 public pings;
    uint256 public constant SPARK = 0.0001 ether;

    string public website;
    string public twitter;
    string public github;
    string public paper =
        "https://transformer-circuits.pub/2026/workspace/index.html";

    event Pinged(address indexed who, uint8 pos, uint256 pings);
    event Sparked(address indexed who, uint256 value);
    event Fit(address indexed who);
    event Fed(address indexed from, uint256 value);
    event TokenBound(address token);
    event SpaceBound(address space);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor(address owner_, JSpace space_) {
        owner = owner_ == address(0) ? msg.sender : owner_;
        space = space_;
        website = "https://jlens.lol";
        twitter = "https://x.com/jlensLOL";
        github = "https://github.com/hoodseekxyz/jlens";
        if (address(space_) != address(0)) emit SpaceBound(address(space_));
    }

    function ping() external {
        uint8 pos = uint8(uint256(keccak256(abi.encodePacked(msg.sender, pings))) % 45);
        pings += 1;
        space.sit(msg.sender, pos, 1);
        emit Pinged(msg.sender, pos, pings);
    }

    function spark() external payable {
        require(msg.value == SPARK, "spark");
        uint8 pos = uint8(uint256(keccak256(abi.encodePacked(msg.sender, pings))) % 45);
        pings += 1;
        space.sit(msg.sender, pos, 8);
        emit Sparked(msg.sender, msg.value);
        emit Pinged(msg.sender, pos, pings);
        (bool ok, ) = payable(address(space)).call{value: msg.value}("");
        require(ok, "glow");
    }

    function fit() external {
        emit Fit(msg.sender);
    }

    function bindToken(address t) external onlyOwner {
        require(token == address(0), "once");
        require(t != address(0), "zero");
        token = t;
        space.bindToken(t);
        emit TokenBound(t);
    }

    function setSocials(
        string calldata site_,
        string calldata x_,
        string calldata git_
    ) external onlyOwner {
        website = site_;
        twitter = x_;
        github = git_;
    }

    function socials()
        external
        view
        returns (string memory, string memory, string memory, string memory)
    {
        return (website, twitter, github, paper);
    }

    function harvest(address) external view returns (uint256) {
        return address(space).balance;
    }

    receive() external payable {
        emit Fed(msg.sender, msg.value);
        (bool ok, ) = payable(address(space)).call{value: msg.value}("");
        require(ok, "glow");
    }
}
