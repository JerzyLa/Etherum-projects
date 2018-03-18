import React from 'react'
import { default as contract } from "truffle-contract";
import MyCvContractArtifacts from '../build/contracts/MyCV.json'
import getWeb3 from './utils/getWeb3'

import Title from "./imports/ui/Title";
import PersonalInfo from "./imports/ui/PersonalInfo";
import AddressUrl from "./imports/ui/AddressUrl";
import SkillsList from "./imports/ui/SkillsList";
import ProjectsList from "./imports/ui/ProjectsList";

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cvdata: this.props.cvdata
      // title: null,
      // description: null,
      // addressUrl: null,
      // personalInfo: null,
      // projects: null,
      // skills: null
    };

    this.web3 = null;
    this.accounts = null;
    this.myCvContract = contract(MyCvContractArtifacts);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.web3 = results.web3;
      this.myCvContract.setProvider(this.web3.currentProvider);
      this.getAccounts();
      this.updateCvforContract();
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

  updateCvforContract()
  {
    let contract;
    let data = this.state.cvdata;
    this.myCvContract.deployed().then((instance) => {
      contract = instance;
      return contract.getAddress({from: this.accounts[0]});
    }).then((address) => {
      data.addressUrl = address;
      return contract.getTitle();
    }).then((title) => {
      data.title = title;
      return contract.getDescription();
    }).then((description) => {
      data.description = description;
      return contract.getAuthor();
    }).then((author) => {
      data.personalInfo.name = author[0];
      data.personalInfo.info = author[1];
      return contract.getSkillsCount();
    }).then((count) => {
      for(let i=0; i<count; ++i) {
       this.getSkillForContract(contract, i)
       .then((skill) => {
          data.skills.add({name: skill[0], level: skill[1]});
       })
      }
      return contract.getProjectsCount();
    }).then((count) => {
      for(let i=0; i<count; ++i) {
        this.getProjectForContract(contract, i)
        .then((project) => {
           data.project.add({name: project[0], description: project[1]});
        })
       }
    }).then(() => {
      this.setState({cvdata : data});
    });
  }

  getSkillForContract(contract, num) {
    return new Promise(() => {
      return contract.getSkill(num);
    })
  }

  getProjectForContract(contract, num) {
    return new Promise(() => {
      return contract.getProject(num);
    })
  }

  render() {
    let data = this.state.cvdata;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4 left-column">
            <div className="wrapper">
              <Title title={data.title} />
              <PersonalInfo name="E-mail"
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
