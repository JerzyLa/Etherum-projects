import React from "react";
import ReactDOM from "react-dom";
import App from "./../imports/ui/App";

let cvdata = {
  title: "Jerzy Lasyk",
  description:
    "I am software developer with over 4 years of professional experience, passionate about blockchain development.",
  addressUrl: "https://www.linkedin.com/in/jerzylasyk",
  personalInfo: { name: "E-mail", info: "jerzylasyk@gmail.com" },
  projects: [
    {
      name: "SDARS",
      description:
        "Satellite radio application for automotive companies like Volvo, Volkswagen."
    },
    {
      name: "BLOCKCHAIN CV",
      description:
        "Truffle project, which contains smart contracts and web frontend. Smart contract is used as database."
    },
    {
      name: "BITCOIN BLOCKCHAIN PARSER",
      description:
        "Application for parsing bitcoin blockchain and store all transactions, addresses, blocks, longest chain etc. in MySQL database."
    }
  ],
  skills: [{ name: "English", level: 4 }, { name: "C++", level: 5 }]
};

ReactDOM.render(<App cvdata={cvdata} />, document.getElementById("app"));