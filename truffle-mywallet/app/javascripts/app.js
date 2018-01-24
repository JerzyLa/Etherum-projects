// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

import "bootstrap/dist/css/bootstrap.css"

// Import libraries we need.
import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import myWallet_artifacts from '../../build/contracts/MyWallet.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MyWallet = contract(myWallet_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var proposalIds = [];

window.App = {
   start: function() {
      var self = this;

      // Bootstrap the MetaCoin abstraction for Use.
      MyWallet.setProvider(web3.currentProvider);

      // Get the initial account balance so it can be displayed.
      web3.eth.getAccounts(function(err, accs) {
         if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
         }

         if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
         }

         accounts = accs;
         account = accounts[0];

         document.getElementById("addresses").innerHTML = accounts.join("<br/>");
         App.basicInfoUpdate();
         App.listenToEvents();
      });
   },

   basicInfoUpdate: function() {
      MyWallet.deployed().then((instance) => {
         document.getElementById("walletAddress").innerHTML = instance.address;
         document.getElementById("walletBalance").innerHTML = web3.fromWei(web3.eth.getBalance(instance.address).toNumber(), "ether");
      });
   },

   listenToEvents: function() {
      MyWallet.deployed().then((instance) => {
         instance.ReceivedFunds({}, {fromBlock:0, toBlock:'latest'}).watch((error, event) => {
            document.getElementById("fundsEvents").innerHTML += "<table><tr><td>" + event.args.from + "</td></tr>" + "<tr><td>" + event.args.amount + "</td></tr></table>";
         });
         instance.ProposalReceived({}, {fromBlock:0, toBlock:'latest'}).watch((error, event) => {
            document.getElementById("proposalEvents").innerHTML += "<table><tr><td>" + event.args.from + "</td></tr>" + "<tr><td>" + event.args.to + "</td></tr>" + "<tr><td>" + event.args.reason + "</td></tr></table>";
         });
         instance.ProposalReceived({}, {}).watch((error, event) => {
            proposalIds.push(event.args.id);
         });
      });
   },

   submitEtherToWallet: function() {
      MyWallet.deployed().then((instance) => {
         return instance.sendTransaction({from: account, to: instance.address, value: web3.toWei(5, "ether")});
      }).then((result) => {
         App.basicInfoUpdate();
      });
   },

   submitTransaction: function() {
      let to = document.getElementById("to").value;
      let amount = parseInt(document.getElementById("amount").value);
      let reason = document.getElementById("reason").value;

      MyWallet.deployed().then((instance) => {
         console.log("send from: " + accounts[1] + " to: " + to);
         return instance.spendMoneyOn(to, web3.toWei(amount, "ether"), reason, {from:accounts[1], gas:3000000});
      }).then((result) => {
         console.log(result);
         App.basicInfoUpdate();
      }).catch((err) => {
         console.log(err);
      });
   },

   confirmProposal: function() {
      MyWallet.deployed().then((instance) => {
         console.log(proposalIds);
         if(proposalIds.length > 0) {
            return instance.confirmProposal(proposalIds.pop(), {from:account});
         } else {
            return "No proposals on to confirm !";
         }
      }).then((result) => {
         App.basicInfoUpdate();
         console.log(result);
      });
   }
};

window.addEventListener('load', () => {
   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
   if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
   } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
   }

   App.start();
});
