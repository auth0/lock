import React from 'react';

export default class WelcomeMessage extends React.Component {
  render() {
    let className, message;

    if (this.props.name) {
      className = "auth0-lock-firstname";
      message = `Welcome ${this.props.name}!`;
    } else {
      className = "auth0-lock-name";
      message = "Auth0";
    }

    return <div className={className}>{message}</div>
  }
}

WelcomeMessage.propTypes = {
  name: React.PropTypes.string
}
