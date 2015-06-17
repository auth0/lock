import React from 'react';

// TODO move to its own package
class InputWrap extends React.Component {
  render() {
    var className = "auth0-lock-input-wrap auth0-lock-input-" + this.props.name;
    if (!this.props.isValid) {
      className += " auth0-lock-input-invalid";
    }

    return (
      <div className={className}>
        <i className="auth0-lock-icon"/>
        {this.props.children}
      </div>
    );
  }
}

InputWrap.propTypes = {
  name: React.PropTypes.string.isRequired,
  isValid: React.PropTypes.bool.isRequired,
  children: React.PropTypes.element.isRequired
};

export default class SigninContent extends React.Component {
  render() {
    return (
      <div className="auth0-lock-content">
        <ul className="auth0-lock-tabs">
          <li className="auth0-lock-tabs-current"><a className="" href="">Login</a></li>
          <li><a className="" href="">Sign Up</a></li>
        </ul>

        <div className="auth0-lock-error-message">
          An error ocurred.
        </div>

        <InputWrap name="username" isValid={true}>
          <input type="text" name="username" className="auth0-lock-input" placeholder="Username"/>
        </InputWrap>

        <InputWrap name="password" isValid={false}>
          <input type="password" name="password" className="auth0-lock-input" placeholder="Password"/>
        </InputWrap>

        <a href="#" className="auth0-lock-forgot-link">Don't remember your password?</a>
      </div>
    );
  }
}

// TODO specify prop types
