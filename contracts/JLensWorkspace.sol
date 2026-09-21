// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JSpace} from "./JSpace.sol";
import {JLens} from "./JLens.sol";

/**
 * @title  JLensWorkspace
 * @notice One tx on Robinhood 4663 deploys the pair:
 *           jlens  — readout (ping / spark / fit)
 *           jspace — sparse occupancy k ≤ 25
 *         Do not paste this factory CA in the LONG form.
 *         Ping the JLens child. Occupancy lives on JSpace.
 */
contract JLensWorkspace {
    JSpace public immutable jspace;
    JLens public immutable jlens;
    address public owner;

    string public website = "https://jlens.lol";
    string public twitter = "https://x.com/jlensLOL";
    string public github = "https://github.com/hoodseekxyz/jlens";

    event Pair(address jlens, address jspace);

    constructor() {
        owner = msg.sender;
        jspace = new JSpace(msg.sender);
        jlens = new JLens(msg.sender, jspace);
        jspace.bindLens(address(jlens));
        emit Pair(address(jlens), address(jspace));
    }
}
