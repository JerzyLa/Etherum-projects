pragma solidity 0.4.19;

import "github.com/ethereum/solidity/std/mortal.sol";

contract SimpleWallet is mortal {
    
    mapping(address => Permission) addressMapping;
    
    event addToSenderListCalled(address smWhoAdded, address smWhoWasAllowed, uint amountInWei);
    event removeFromSenderLostCalled(address caller, address removedAddress);
    event sendFoundsCalled(address caller, address receiver, uint limitInWei);
    
    struct Permission {
        bool isAllowed;
        uint transferLimit;
    }
    
    function addAddressToSenderList(address permitted, uint limitInWei) onlyowner {
        addressMapping[permitted] = Permission(true, limitInWei);
        addToSenderListCalled(msg.sender, permitted, limitInWei);
    }
    
    function removeAddressFromSenderList(address notAllowed) onlyowner {
        delete addressMapping[msg.sender];
        removeFromSenderLostCalled(msg.sender, notAllowed);
    }
    
    function sendFunds(address receiver, uint amountInWei) {
        if(addressMapping[msg.sender].isAllowed) {
            if(addressMapping[msg.sender].transferLimit >= amountInWei) {
                require(receiver.send(amountInWei));
                sendFoundsCalled(msg.sender, receiver, amountInWei);
            } else {
                require(false);
            }
        } else {
            require(false);
        }
    } 
    
    function getBalance() constant returns(uint) {
        return this.balance;
    }
    
    function () payable {
    }
}
