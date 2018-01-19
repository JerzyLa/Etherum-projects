var wallet = artifacts.require("./MyWallet.sol");

contract("MyWallet", (accounts) => {
   it("Should be possible to put money inside", () => {
      var contractInstance;
      return wallet.deployed().then((instance) => {
         contractInstance = instance;
         return contractInstance.sendTransaction({value: web3.toWei(10, 'ether')
            , address: contractInstance.address, from: accounts[0]});
      }).then((tx) => {
         // console.log(tx);
         assert.equal(web3.eth.getBalance(contractInstance.address).toNumber(),
            web3.toWei(10, 'ether'), "The balance is the same");
      });
   });

   it("Should be possible to get back money as owner", () => {
      var walletInstance;
      var balanceBefore;
      var balanceAfter;
      var moneySpend = web3.toWei(5, 'ether');

      return wallet.deployed().then((instance) => {
         walletInstance = instance;
         balanceBefore = web3.eth.getBalance(walletInstance.address).toNumber();
         return walletInstance.spendMoneyOn(accounts[0], moneySpend, "Because I am the owner", {from:accounts[0]});
      }).then(() => {
         return web3.eth.getBalance(walletInstance.address).toNumber();
      }).then((balance) => {
         balanceAfter = balance;
         assert.equal(balanceBefore - moneySpend, balanceAfter, "Balance is now 5 ether less");
      })

   });

   it("Should be possible to propose spending money", () => {
      var walletInstance;
      return wallet.deployed().then((instance) => {
         walletInstance = instance;
         return instance.spendMoneyOn(accounts[1], web3.toWei(5, 'ether'), "Because I want money"
            , {from:accounts[1]});
      }).then(() => {
         assert.equal(web3.toWei(5, 'ether'), web3.eth.getBalance(walletInstance.address).toNumber(), "Balance money not spend until confirmation");
         return walletInstance.confirmProposal(1, {from:accounts[0]});
      }).then(() => {
         assert.equal(web3.toWei(0, 'ether'), web3.eth.getBalance(walletInstance.address).toNumber(), "Balance is 0, spending money confirmed");
      });
   })

   it("Should emit ProposalReceived event when spending money", () => {
      return wallet.deployed().then((instance) => {
         return instance.spendMoneyOn(accounts[1], web3.toWei(5, 'ether'), "Because I want money",
            {from: accounts[1]});
      }).then((result) => {
         assert.equal(result.logs[0].event, "ProposalReceived", "ProposalReceived event was emited");
      });
   });
});
