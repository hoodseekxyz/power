// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  Power
 * @notice ANTHROPIC². (Σa)² is not Σa². The cross term is the pool.
 *         Side caps at 12. Spark is 0.0001 ETH of glow, not yield.
 *         Do not paste this CA into the LONG token form.
 */
contract Power {
    uint256 public constant SIDE_MAX = 12;
    uint256 public constant SPARK = 0.0001 ether;

    address public owner;
    address public token;
    string public website;
    string public twitter;

    struct Seat {
        address who;
        uint96 a;
    }

    Seat[] public seats;
    mapping(address => uint256) public idxOf;

    uint256 public sumA;
    uint256 public sumSq;

    event Pinged(address indexed who, uint256 a, uint256 sumA, uint256 crossTerm);
    event Sparked(address indexed who, uint256 value);
    event Evicted(address indexed who, uint256 a);
    event TokenBound(address token);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        website = "https://sqpower.xyz";
    }

    function ping() external {
        _add(msg.sender, 1);
    }

    function spark() external payable {
        require(msg.value == SPARK, "spark");
        _add(msg.sender, 3);
        emit Sparked(msg.sender, msg.value);
    }

    function squareOfSum() public view returns (uint256) {
        return sumA * sumA;
    }

    function crossTerm() public view returns (uint256) {
        return squareOfSum() - sumSq;
    }

    function occupancy() external view returns (uint256) {
        return seats.length;
    }

    function bindToken(address t) external onlyOwner {
        require(token == address(0), "once");
        require(t != address(0), "zero");
        token = t;
        emit TokenBound(t);
    }

    function setSocials(string calldata site_, string calldata x_) external onlyOwner {
        website = site_;
        twitter = x_;
    }

    function _add(address who, uint256 da) internal {
        while (sumA + da > SIDE_MAX) {
            require(_evictLightest(who), "full");
        }
        uint256 i = idxOf[who];
        if (i == 0) {
            seats.push(Seat(who, 0));
            idxOf[who] = seats.length;
            i = seats.length;
        }
        uint256 old = seats[i - 1].a;
        seats[i - 1].a = uint96(old + da);
        sumSq += 2 * old * da + da * da;
        sumA += da;
        emit Pinged(who, old + da, sumA, squareOfSum() - sumSq);
    }

    function _evictLightest(address keep) internal returns (bool) {
        if (seats.length == 0) return false;
        uint256 best = type(uint256).max;
        uint256 bi = type(uint256).max;
        for (uint256 i = 0; i < seats.length; i++) {
            if (seats[i].who == keep) continue;
            if (seats[i].a < best) {
                best = seats[i].a;
                bi = i;
            }
        }
        if (bi == type(uint256).max) return false;
        address who = seats[bi].who;
        uint256 a = seats[bi].a;
        sumA -= a;
        sumSq -= a * a;
        uint256 last = seats.length - 1;
        if (bi != last) {
            seats[bi] = seats[last];
            idxOf[seats[bi].who] = bi + 1;
        }
        seats.pop();
        idxOf[who] = 0;
        emit Evicted(who, a);
        return true;
    }

    receive() external payable {}
}
