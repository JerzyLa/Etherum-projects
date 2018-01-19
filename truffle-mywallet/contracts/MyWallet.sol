pragma solidity ^0.4.17;

import "./Mortal.sol";


contract MyWallet is Mortal {
    event ReceivedFunds(address indexed from, uint256 amount);
    event ProposalReceived(address from, address to, string reason);

    struct Proposal {
        address from;
        address to;
        uint256 amount;
        string reason;
        bool isSent;
    }

    uint m_proposalCounter;
    mapping(uint => Proposal) m_proposals;

    function() public payable {
        if (msg.value > 0) {
            ReceivedFunds(msg.sender, msg.value);
        }
    }

    function spendMoneyOn(address to, uint256 amount, string reason) public returns(uint256) {
        if (owner == msg.sender) {
           to.transfer(amount);
        } else {
            ++m_proposalCounter;
            m_proposals[m_proposalCounter] = Proposal(msg.sender, to, amount, reason, false);
            ProposalReceived(msg.sender, to, reason);
            return m_proposalCounter;
        }
    }

    function confirmProposal(uint proposalId) public onlyowner returns(bool) {
        Proposal proposal = m_proposals[proposalId];
        if (proposal.from != address(0) && !proposal.isSent) {
            if (proposal.to.send(proposal.amount)) {
                proposal.isSent = true;
                return true;
            }
        }

        return false;
    }
}
