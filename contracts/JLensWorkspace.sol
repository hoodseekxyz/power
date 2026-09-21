// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  JLensWorkspace
 * @notice Overlay for jacobian-lens / $JLENS on Robinhood Chain 4663.
 *         Ping sits you. Spark sits + 0.0001 ETH. ETH is glow, not yield.
 *         bindToken after LONG mints. Do not paste this CA in the LONG form.
 */
contract JLensWorkspace {
    address public owner;
    address public token;
    uint256 public n;
    uint256 public pings;
    uint256 public constant SPARK = 0.0001 ether;

    string public website;
    string public twitter;
    string public github;
    string public paper =
        "https://transformer-circuits.pub/2026/workspace/index.html";

    event Unfold(uint256 n);
    event Pinged(address indexed who, uint256 pings);
    event Sparked(address indexed who, uint256 value);
    event Fit(address indexed who);
    event Fed(address indexed from, uint256 value);
    event TokenBound(address token);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        website = "https://jlens.lol";
        twitter = "https://x.com/jlensLOL";
        github = "https://github.com/hoodseekxyz/jlens";
    }

    function unfold() external onlyOwner {
        require(n == 0, "once");
        require(token == address(0), "bound");
        n = 24; // ASCII-face tokens
        emit Unfold(n);
    }

    function ping() external {
        pings += 1;
        emit Pinged(msg.sender, pings);
    }

    function spark() external payable {
        require(msg.value == SPARK, "spark");
        pings += 1;
        emit Sparked(msg.sender, msg.value);
        emit Pinged(msg.sender, pings);
    }

    function fit() external {
        emit Fit(msg.sender);
    }

    function bindToken(address t) external onlyOwner {
        require(token == address(0), "once");
        require(t != address(0), "zero");
        token = t;
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

    function harvest(address) external view returns (uint256) {
        return address(this).balance;
    }

    function socials()
        external
        view
        returns (string memory, string memory, string memory, string memory)
    {
        return (website, twitter, github, paper);
    }

    receive() external payable {
        emit Fed(msg.sender, msg.value);
    }
}
