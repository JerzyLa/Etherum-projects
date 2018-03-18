import React from "react";

export default class PersonalInfo extends React.Component {
  render() {
    return (
      <div className="personal-info">
        <strong>{this.props.name}</strong>
        <div>{this.props.info}</div>
      </div>
    );
  }
}
