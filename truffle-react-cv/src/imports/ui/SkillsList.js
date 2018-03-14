import React from "react";

export default class SkillsList extends React.Component {
  renderSkills() {
    return this.props.skills.map(skill => {
      let barwidth = skill.level * 100 / 5 + "%";
      return (
        <div className="skill">
          <strong>{skill.name}</strong>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: barwidth }}
            />
          </div>
        </div>
      );
    });
  }

  render() {
    return <div className="skill-list">{this.renderSkills()}</div>;
  }
}
