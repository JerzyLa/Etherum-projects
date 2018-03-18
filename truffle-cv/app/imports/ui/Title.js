import React from "react";

export default class Title extends React.Component {
  render() {
    return (
      <div className="title">
        {this.props.title}
      </div>
    );
  }
}
