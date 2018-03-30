import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

let cvdata = {
  title: "Jerzy Lasyk CV",
  description:
    "If you want to see complete CV run metamask or mist and refresh website",
  addressUrl: "https://github.com/JerzyLa",
  personalInfo: { name: "Jerzy Lasyk", email: "xyz@gmail.com" },
  projects: [
    {
      name: "PROJECT 1",
      description:
        "Very interesting software project."
    },
    {
      name: "PROJECT 2",
      description:
        "Another very interesting software project."
    },
    {
      name: "PROJECT 3",
      description:
        "And another one very interesting software project."
    }
  ],
  skills: [{ name: "Skill 1", level: 4 }, { name: "Skill 2", level: 5 }]
};

ReactDOM.render(<App cvdata={cvdata} />, document.getElementById("app"));
