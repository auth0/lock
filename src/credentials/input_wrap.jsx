import React from 'react';
import EmailIcon from './email_icon';

export default class InputWrap extends React.Component {
  render() {
    var className = "auth0-lock-input-block auth0-lock-input-" + this.props.name;
    if (!this.props.isValid) {
      className += " auth0-lock-error animated pulse";
    }

    let icon = <i className="auth0-lock-icon"/>;
    if (this.props.name === "email") {
      icon = <EmailIcon />;
    }

    return (
      <div className={className}>
        <div className="auth0-lock-input-wrap">
          {icon}
          {this.props.children}
        </div>
      </div>
    );
  }
}

InputWrap.propTypes = {
  name: React.PropTypes.string.isRequired,
  isValid: React.PropTypes.bool.isRequired,
  children: React.PropTypes.element.isRequired
};
