let mycv = artifacts.require("./MyCV.sol");

contract("MyCv", (accounts) => {
   it("Should be possible to read all cv fields from every account", () => {
      let expectedAddress = "https://github.com/JerzyLa";
      let expectedDescription = "I am software developer with over 4 years of professional experience passionate about blockchain development.";
      let expectedTitle = "Jerzy Lasyk CV";
      let expectedName = "Jerzy Lasyk";
      let expectedEmail = "jerzylasyk@gmail.com";
      let expectedProjectName = "SDARS";
      let expectedSkillName = "English";
      let contractInstance;

      return mycv.deployed().then((instance) => {
         contractInstance = instance;
         return contractInstance.getAddress({from: accounts[0]});
      }).then((address) => {
         assert.equal(address, expectedAddress);
         return contractInstance.getDescription({from: accounts[1]});
      }).then((description) => {
         assert.equal(description, expectedDescription);
         return contractInstance.getTitle({from: accounts[2]});
      }).then((title) => {
         assert.equal(title, expectedTitle);
         return contractInstance.getAuthor({from:accounts[3]});
      }).then((author) => {
         assert.equal(author[0], expectedName);
         assert.equal(author[1], expectedEmail);
         return contractInstance.getProject(0, {from:accounts[1]});
      }).then((project) => {
         assert.equal(project[0], expectedProjectName);
         return contractInstance.getSkill(0, {form:accounts[2]});
      }). then((skill) => {
         assert.equal(skill[0], expectedSkillName);
      });
   });

   it("Should be possible to modify CV as an author", () => {
      let contractInstance;

      return mycv.deployed().then((instance) => {
         contractInstance = instance;
         return contractInstance.changeAddress("my new http address", {from: accounts[0]});
      }).then((result) => {
         assert.equal(result.logs[0].event, "AddressChanged", "AddressChanged event was emmit");
         return contractInstance.getAddress();
      }).then((address) => {
         assert.equal(address, "my new http address");
      });
   });

   it("Shouldnt be possible to modify CV not as an author", () => {
      let contractInstance;

      return mycv.deployed().then((instance) => {
         contractInstance = instance;
         return contractInstance.changeAddress("http://illegalchange", {from: accounts[1]});
      }).catch((error) => {
         return contractInstance.getAddress();
      }).then((address) => {
         assert.equal(address, "my new http address");
      });
   });

   it("Should be possible to add and remove projects as an author", () => {
      let contractInstance;

      return mycv.deployed().then((instance) => {
         contractInstance = instance;
         return contractInstance.addProject("Project1", "Superb project");
      }).then((result) => {
         return contractInstance.getProjectsCount();
      }).then((count) => {
         assert.equal(count, 2);
      }).then(() => {
         return contractInstance.removeProject(1);
      }).then((result) => {
         return contractInstance.getProjectsCount();
      }).then((count) => {
         assert.equal(count, 1);
      });
   });

   it("Should be possible to add and remove skills as an author", () => {
      let contractInstance;

      return mycv.deployed().then((instance) => {
         contractInstance = instance;
         return contractInstance.addSkill("Skill1", 3);
      }).then((result) => {
         return contractInstance.getSkillsCount();
      }).then((count) => {
         assert.equal(count, 2);
      }).then(() => {
         return contractInstance.removeSkill(1);
      }).then((result) => {
         return contractInstance.getSkillsCount();
      }).then((count) => {
         assert.equal(count, 1);
      });
   });
});
