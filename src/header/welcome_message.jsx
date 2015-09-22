import React from 'react';

export default class WelcomeMessage extends React.Component {
  render() {
    const { name, title } = this.props;
    let className, message;

    if (name) {
      className = "auth0-lock-firstname";
      message = name;
    } else {
      className = "auth0-lock-name";
      message = title;
    }

    return <div className={className}>{message}</div>;
  }
}

WelcomeMessage.propTypes = {
  name: React.PropTypes.string
}
