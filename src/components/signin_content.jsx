import React from 'react';
import SignInErrorMessage from './sign_in_error_message';
import LockActionCreators from '../actions/lock_action_creators';

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
  _handleUsernameChange() {
    var lockID = this.props.lock.get('id'), username = event.target.value;
    LockActionCreators.changeUsername(lockID, username);
  }

  _handlePasswordChange() {
    var lockID = this.props.lock.get('id'), password = event.target.value;
    LockActionCreators.changePassword(lockID, password);
  }

  render() {
    return (
      <div className="auth0-lock-content">
        <ul className="auth0-lock-tabs">
          <li className="auth0-lock-tabs-current"><a className="" href="">Login</a></li>
          <li><a className="" href="">Sign Up</a></li>
        </ul>

        <SignInErrorMessage error={this.props.lock.get("error")}/>

        <InputWrap name="username" isValid={true}>
          <input type="text" name="username" className="auth0-lock-input" placeholder="Username" onChange={this._handleUsernameChange.bind(this)} value={this.props.lock.get("username")}/>
        </InputWrap>

        <InputWrap name="password" isValid={true}>
          <input type="password" name="password" className="auth0-lock-input" placeholder="Password" onChange={this._handlePasswordChange.bind(this)} value={this.props.lock.get("password")}/>
        </InputWrap>

        <a href="#" className="auth0-lock-forgot-link">Don't remember your password?</a>
      </div>
    );
  }
}

// TODO specify prop types
