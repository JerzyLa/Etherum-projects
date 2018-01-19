pragma solidity ^0.4.15;


contract Owned {
    address owner;

    modifier onlyowner() {
        require(owner == msg.sender);
        _;
    }

    function Owned() public {
        owner = msg.sender;
    }
}
