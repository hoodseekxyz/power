// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  JSpace
 * @notice Sparse subframe of J-lens vectors. Occupancy k ≤ 25.
 *         Paper: union of k-cones. A wallet is one nonnegative coefficient.
 *         Full workspace evicts the lightest seat. ETH is glow, not yield.
 */
contract JSpace {
    uint8 public constant K = 25;
    uint8 public constant N = 45;

    address public owner;
    address public lens;
    address public token;
    address public immutable deployer;

    struct Seat {
        address who;
        uint8 pos;
        uint96 weight;
    }

    Seat[] public seats;
    mapping(address => uint256) public idxOf; // 1-based

    event Sat(address indexed who, uint8 pos, uint8 k, uint96 weight);
    event Left(address indexed who, uint8 k);
    event Evicted(address indexed who, uint8 k);
    event Broadcast(address indexed who, uint8 pos, uint8 k);
    event LensBound(address lens);
    event TokenBound(address token);
    event Fed(address indexed from, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    modifier onlyLens() {
        require(msg.sender == lens, "lens");
        _;
    }

    constructor(address owner_) {
        owner = owner_ == address(0) ? msg.sender : owner_;
        deployer = msg.sender;
    }

    function occupancy() external view returns (uint8) {
        return uint8(seats.length);
    }

    function bindLens(address l) external {
        require(msg.sender == owner || msg.sender == deployer, "auth");
        require(lens == address(0), "once");
        require(l != address(0), "zero");
        lens = l;
        emit LensBound(l);
    }

    function bindToken(address t) external {
        require(msg.sender == owner || msg.sender == lens, "auth");
        require(token == address(0), "once");
        require(t != address(0), "zero");
        token = t;
        emit TokenBound(t);
    }

    function sit(address who, uint8 pos, uint96 extra) external onlyLens {
        require(who != address(0), "zero");
        pos = pos % N;
        uint256 i = idxOf[who];
        uint96 w;
        if (i == 0) {
            if (seats.length >= K) _evictLightest();
            seats.push(Seat(who, pos, extra == 0 ? uint96(1) : extra));
            idxOf[who] = seats.length;
            w = seats[seats.length - 1].weight;
        } else {
            Seat storage s = seats[i - 1];
            s.pos = pos;
            s.weight += extra == 0 ? uint96(1) : extra;
            w = s.weight;
        }
        uint8 k = uint8(seats.length);
        emit Sat(who, pos, k, w);
        emit Broadcast(who, pos, k);
    }

    function leave() external {
        uint256 i = idxOf[msg.sender];
        require(i != 0, "absent");
        _remove(i - 1);
        emit Left(msg.sender, uint8(seats.length));
    }

    function _evictLightest() internal {
        uint256 n = seats.length;
        uint256 vi = 0;
        uint96 vw = seats[0].weight;
        for (uint256 j = 1; j < n; j++) {
            if (seats[j].weight < vw) {
                vw = seats[j].weight;
                vi = j;
            }
        }
        address who = seats[vi].who;
        _remove(vi);
        emit Evicted(who, uint8(seats.length));
    }

    function _remove(uint256 i) internal {
        address who = seats[i].who;
        uint256 last = seats.length - 1;
        if (i != last) {
            Seat memory mv = seats[last];
            seats[i] = mv;
            idxOf[mv.who] = i + 1;
        }
        seats.pop();
        delete idxOf[who];
    }

    function harvest(address) external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        emit Fed(msg.sender, msg.value);
    }
}
