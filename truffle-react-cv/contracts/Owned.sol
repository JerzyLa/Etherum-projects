pragma solidity ^0.4.18;

contract Owned {
    address owner;

    modifier onlyowner() {
        require(msg.sender == owner);
        _;
    }

    function Owned() public {
        owner = msg.sender;
    }
}
