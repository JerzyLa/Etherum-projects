pragma solidity ^0.4.18;

import "./Mortal.sol";
import "./CVExtender.sol";

contract MyCV is CVExtender, Mortal {
   event AddressChanged(address from, string oldAddress, string newAddress);
   event DescriptionChanged(address from, string oldDescription, string newDescription);
   event TitleChanged(address from, string oldTitle, string newTitle);
   event AuthorChanged(address from, string oldName, string oldEmail, string newName, string newEmail);
   event SkillAdded(address from, string name, uint skillLevel);
   event ProjectAdded(address from, string name, string description);

   struct PersonalInfo {
      string name;
      string email;
   }

   struct Project {
      string name;
      string description;
   }

   enum SkillLevel {BASIC, MEDIUM, GOOD, VERY_GOOD, EXPERT}

   struct Skill {
      string name;
      SkillLevel level;
   }

   string m_title;
   string m_description;
   string m_addressUrl;
   PersonalInfo m_personalInfo;
   Project[] m_projects;
   Skill[] m_skills;

   function MyCV() public {
      m_title = "Jerzy Lasyk CV";
      m_description = "I am software developer with over 4 years of professional experience passionate about blockchain development.";
      m_personalInfo = PersonalInfo("Jerzy Lasyk", "xyz@gmail.com");
      m_addressUrl = "https://github.com/JerzyLa";
      m_projects.push(Project("SDARS", "Satellite radio application for automotive companies"));
      m_skills.push(Skill("English", SkillLevel.VERY_GOOD));
   }

   function getAddress() public view returns(string) {
      return m_addressUrl;
   }

   function changeAddress(string addressUrl) public onlyowner {
      AddressChanged(msg.sender, m_addressUrl, addressUrl);
      m_addressUrl = addressUrl;
   }

   function getDescription() public view returns(string) {
      return m_description;
   }

   function changeDescription(string description) public onlyowner {
      DescriptionChanged(msg.sender, m_description, description);
      m_description = description;
   }

   function getTitle() public view returns(string) {
      return m_title;
   }

   function changeTitle(string title) public onlyowner {
      TitleChanged(msg.sender, m_title, title);
      m_title = title;
   }

   function getAuthor() public view returns(string, string) {
      return (m_personalInfo.name, m_personalInfo.email);
   }

   function changeAuthor(string name, string email) public onlyowner {
      AuthorChanged(msg.sender, m_personalInfo.name, m_personalInfo.email, name, email);
      m_personalInfo.name = name;
      m_personalInfo.email = email;
   }

   function getSkillsCount() public view returns(uint) {
      return m_skills.length;
   }

   function getSkill(uint index) public view returns(string, uint) {
      require(m_skills.length > index);
      return (m_skills[index].name, uint(m_skills[index].level));
   }

   function addSkill(string name, uint level) public onlyowner {
      require(level < 5);
      SkillAdded(msg.sender, name, level);
      m_skills.push(Skill(name, SkillLevel(level)));
   }

   function removeSkill(uint index) public onlyowner {
      require(m_skills.length > index);
      for (uint i = index; i < m_skills.length-1; i++) {
          m_skills[i] = m_skills[i+1];
      }
      delete m_skills[m_skills.length-1];
      m_skills.length--;
   }

   function removeAllSkills() public onlyowner {
      delete m_skills;
   }

   function getProjectsCount() public view returns(uint) {
      return m_projects.length;
   }

   function getProject(uint index) public view returns(string, string) {
      require(m_projects.length > index);
      return (m_projects[index].name, m_projects[index].description);
   }

   function addProject(string name, string description) public onlyowner {
      ProjectAdded(msg.sender, name, description);
      m_projects.push(Project(name, description));
   }

   function removeProject(uint index) public onlyowner {
      require(m_projects.length > index);
      for (uint i = index; i < m_projects.length-1; i++) {
          m_projects[i] = m_projects[i+1];
      }
      delete m_projects[m_projects.length-1];
      m_projects.length--;
   }

   function removeAllProjectes() public onlyowner {
      delete m_projects;
   }
}
