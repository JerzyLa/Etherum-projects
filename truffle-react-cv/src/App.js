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
      this.updateCvForContract()
      .then(() => this.listenContractEvents());
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

  updateAddressUrl(addressUrl) {
    let data = this.state.cvdata;
    data.addressUrl = addressUrl;
    this.setState({cvdata : data});
  }

  updateDescription(description) {
    let data = this.state.cvdata;
    data.description = description;
    this.setState({cvdata : data});
  }

  updateTitle(title) {
    let data = this.state.cvdata;
    data.title = title;
    this.setState({cvdata : data});
  }

  updateAuthor(name, email) {
    let data = this.state.cvdata;
    data.personalInfo.name = name;
    data.personalInfo.email = email;
    this.setState({cvdata : data});
  }

  updateSkills(contract) {
    let data = this.state.cvdata;
    data.skills = [];

    contract.getSkillsCount()
    .then((count) => {
      let p = Promise.resolve();
      for(let i=0; i<count; ++i) {
        p = p
            .then(() => contract.getSkill(i))
            .then(skill => data.skills.push({name: skill[0], level: ++skill[1]}))
      }
      return p;
    })
    .then(() => this.setState({cvdata : data}));
  }

  updateProjects(contract) {
    let data = this.state.cvdata;
    data.projects = [];

    contract.getProjectsCount()
    .then((count) => {
      let p = Promise.resolve();
      for(let i=0; i<count; ++i) {
        p = p
            .then(() =>  contract.getProject(i))
            .then(project => data.projects.push({name: project[0], description: project[1]}))
      }
      return p;
    })
    .then(() => this.setState({cvdata : data}))
  }

  updateCvForContract() {
    let contract;
    let data = this.state.cvdata;
    return this.myCvContract.deployed().then((instance) => {
      contract = instance;
      return contract.getAddress({from: this.accounts[0]});
    })
    .then((address) => {
      data.addressUrl = address;
      return contract.getTitle();
    })
    .then((title) => {
      data.title = title;
      return contract.getDescription();
    })
    .then((description) => {
      data.description = description;
      return contract.getAuthor();
    })
    .then((author) => {
      data.personalInfo.name = author[0];
      data.personalInfo.email = author[1];
      return contract.getSkillsCount();
    })
    .then((count) => {
      data.skills = [];
      let p = Promise.resolve();
      for(let i=0; i<count; ++i) {
        p = p
          .then(() => contract.getSkill(i))
          .then(skill => data.skills.push({name: skill[0], level: ++skill[1]}))
      }
      return p.then(() => contract.getProjectsCount());
    })
    .then((count) => {
      data.projects = [];
      let p = Promise.resolve();
      for(let i=0; i<count; ++i) {
        p = p.then(() => contract.getProject(i))
        .then(project => data.projects.push({name: project[0], description: project[1]}))
      }
      return p;
    })
    .then(() => {
      this.setState({cvdata : data});
    });
  }

  // TODO: Takie same nazwy w blockchain i w front endzie zrobic
  // TODO: zrob ten sam front w prostszej formie dla truffle-cv

  listenContractEvents() {
    this.myCvContract.deployed().then((instance) => {
      instance.AddressChanged({}, {}).watch((error, event) => {
        console.log("AddressChanged: ", JSON.stringify(event));
        this.updateAddressUrl(event.args.newAddress);
      });
      instance.DescriptionChanged({}, {}).watch((error, event) => {
        console.log("DescriptionChanged: ", JSON.stringify(event));
        this.updateDescription(event.args.newDescription);
      });
      instance.TitleChanged({}, {}).watch((error, event) => {
        console.log("TitleChanged: ", JSON.stringify(event));
        this.updateTitle(event.args.newTitle);
      });
      instance.AuthorChanged({}, {}).watch((error, event) => {
        console.log("AuthorChanged: ", JSON.stringify(event));
        this.updateAuthor(event.args.newName, event.args.newEmail);
      });
      instance.SkillsChanged({}, {}).watch((error, event) => {
        console.log("SkillsChanged: ", JSON.stringify(event));
        this.updateSkills(instance);
      });
      instance.ProjectsChanged({}, {}).watch((error, event) => {
        console.log("ProjectsChanged: ", JSON.stringify(event));
        this.updateProjects(instance);
      })
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
              <PersonalInfo name="E-mail"info={data.personalInfo.email}/>
              <AddressUrl name="Address" url={data.addressUrl} />
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

// USED ONLY FOR TESTING PURPOSES
//
// setTimeout(() => {
//   console.log("Timeout");
//   this.myCvContract.deployed().then((instance) => {
//     return instance.changeAddress("www.test.pl", {from: this.accounts[0]});
//   }).then(() => {
//     console.log("address updated");
//   });
// }, 2000);
//