import React from "react";

export default class AddressUrl extends React.Component {
  render() {
    return (
      <div className="address-url">
        <strong>{this.props.name}</strong>
        <div>
          <a
            href={this.props.url}
            alt="My url address"
            title="URL"
            target="_blank"
          >
            {this.props.url}
          </a>
        </div>
      </div>
    );
  }
}
