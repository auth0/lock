import React from 'react';

export default class WelcomeMessage extends React.Component {
  render() {
    const { name } = this.props;
    let className, message;

    if (name) {
      className = "auth0-lock-firstname";
      message = `Welcome ${name}!`;
    } else {
      className = "auth0-lock-name";
      message = "Auth0";
    }

    return <div className={className}>{message}</div>;
  }
}

WelcomeMessage.propTypes = {
  name: React.PropTypes.string
}
