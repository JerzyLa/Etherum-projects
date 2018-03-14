import React from 'react'
import { default as contract } from "truffle-contract";
import MyCvContractArtifacts from '../build/contracts/MyCV.json'
import getWeb3 from './utils/getWeb3'

import './App.css'
import Title from "./imports/ui/Title";
import PersonalInfo from "./imports/ui/PersonalInfo";
import AddressUrl from "./imports/ui/AddressUrl";
import SkillsList from "./imports/ui/SkillsList";
import ProjectsList from "./imports/ui/ProjectsList";

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.web3 = null;
    this.accounts = null;
    this.myCvContract = contract(MyCvContractArtifacts);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.web3 = results.web3
      this.myCvContract.setProvider(this.web3.currentProvider)
      
      this.getAccounts()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  getAccounts() {
    this.web3.eth.getAccounts((error, accounts) => {
      if (error != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accounts.length === 0) {
        alert(
          "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
        );
        return;
      }

      this.accounts = accounts;
    })
  }

  render() {
    let data = this.props.cvdata;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4 left-column">
            <div className="wrapper">
              <Title title={data.title} />
              <PersonalInfo name={data.personalInfo.name}
                info={data.personalInfo.info}/>
              <AddressUrl name="LinkedIn" url={data.addressUrl} />
            </div>
            <div className="skills-heading">Skills</div>
            <SkillsList skills={data.skills}/>
          </div>
          <div className="col-md-8">
            <div className="wrapper">
              <div className="description">{data.description}</div>
              <div className="projects-heading">Projects</div>
              <ProjectsList projects={data.projects}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
