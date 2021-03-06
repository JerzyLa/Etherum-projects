import React from "react";

export default class ProjectsList extends React.Component {
  renderProject() {
    return this.props.projects.map((project, i) => {
      return (
        <div className="project" key={i}>
          <div className="project_name">{project.name}:</div>
          <div>{project.description}</div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderProject()}</div>;
  }
}
