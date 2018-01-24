pragma solidity ^0.4.17;

contract MyWallet is mortal {
    event receivedFunds(address indexed from, uint256 amount);
    event proposalReceived(address from, address to, string reason);

    struct Proposal {
        address from;
        address to;
        uint256 amount;
        string reason;
        bool isSent;
    }

    uint m_proposalCounter;
    mapping(uint => Proposal) m_proposals;

    function spendMoneyOn(address to, uint256 amount, string reason) public returns(uint256) {
        if(msg.sender == owner) {
            require(to.send(amount));
        } else {
            ++m_proposalCounter;
            m_proposals[m_proposalCounter] = Proposal(msg.sender, to, amount, reason, false);
            proposalReceived(msg.sender, to, reason);

            return m_proposalCounter;
        }
    }

    function confirmProposal(uint proposalId) onlyowner public returns(bool) {
        Proposal proposal = m_proposals[proposalId];
        if(proposal.from != address(0) && !proposal.isSent) {
            if(proposal.to.send(proposal.amount)) {
                proposal.isSent = true;
                return true;
            }
        }

        return false;
    }

    function() payable public {
        if(msg.value > 0) {
            receivedFunds(msg.sender, msg.value);
        }
    }
}
