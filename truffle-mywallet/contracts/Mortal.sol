pragma solidity ^0.4.15;

import "./Owned.sol";


contract Mortal is Owned {
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }
}
