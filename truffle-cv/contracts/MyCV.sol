pragma solidity ^0.4.18;

import "./Mortal.sol";
import "./CVExtender.sol";

// TODO: zrobić własny frontend do tego CV
// TODO: zrobić edycyjną część frontendu - to zrobic jak skoncze kurs meteora
// TODO: update, żeby wyglądało prawie jak CV z strony interviewme
// TODO: przetestuj na testowym blockchainie
// TODO: submit do nich

contract MyCV is CVExtender, Mortal {
   event AddressChanged(address from, string oldAddress, string newAddress);
   event DescriptionChanged(address from, string oldDescription, string newDescription);
   event TitleChanged(address from, string oldTitle, string newTitle);
   event AuthorChanged(address from, string oldName, string oldEmail, string newName, string newEmail);

   struct PersonalInfo {
      string name;
      string email;
   }

   struct SocialMedia {
      string addressUrl;
      string linkedInUrl;
   }

   enum SkillLevel {BASIC, MEDIUM, GOOD, VERY_GOOD, EXPERT};

   string m_title;
   string m_description;
   PersonalInfo m_personalInfo;
   SocialMedia m_socialMedia;
   mapping(string => string) m_projects;
   mapping(string => SkillLevel) m_skills;

   function MyCV() public {
      m_title = "Jerzy Lasyk CV";
      m_description = "I am software developer with over 4 years of professional experience passionate about blockchain development.";
      m_personalInfo = PersonalInfo("Jerzy Lasyk", "jerzylasyk@gmail.com");
      m_socialMedia = SocialMedia("https://github.com/JerzyLa", "https://www.linkedin.com/in/jerzylasyk/");
   }

   function getAddress() public view returns(string) {
      return m_socialMedia.addressUrl;
   }

   function changeAddress(string addressUrl) public onlyowner {
      AddressChanged(msg.sender, m_socialMedia.addressUrl, addressUrl);
      m_socialMedia.addressUrl = addressUrl;
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
}
