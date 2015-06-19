import React from 'react';
import SignInErrorMessage from './sign_in_error_message';
import ModeTabs from './mode_tabs';
import LockActionCreators from '../actions/lock_action_creators';

// TODO move to its own module
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

export default class SignInContent extends React.Component {
  _handleEmailChange() {
    var lockID = this.props.lock.get('id'), email = event.target.value;
    LockActionCreators.changeEmail(lockID, email);
  }

  _handlePasswordChange() {
    var lockID = this.props.lock.get('id'), password = event.target.value;
    LockActionCreators.changePassword(lockID, password);
  }

  _handleResetAction(event) {
    event.preventDefault();
    alert('not implemented');
  }

  render() {
    var autoFocusEmail = this.props.lock.getIn(["showOptions", "focusInput"]);
    if (window.matchMedia && !window.matchMedia( "(min-width: 340px)" ).matches) {
      autoFocusEmail = false;
    }

    var modeTabs = this.props.lock.getIn(["showOptions", "disableSignupAction"]) ?
      null : <ModeTabs/>;

    var resetAction = this.props.lock.getIn(["showOptions", "disableResetAction"]) ?
      null : <a href="#" className="auth0-lock-forgot-link" onClick={this._handleResetAction}>Don't remember your password?</a>;

    var validEmail = this.props.lock.getIn(["validations", "email"]);
    var validPassword = this.props.lock.getIn(["validations", "password"]);

    return (
      <div className="auth0-lock-content">
        {modeTabs}

        <SignInErrorMessage error={this.props.lock.get("error")}/>

        <InputWrap name="email" isValid={validEmail}>
          <input type="text" name="email" className="auth0-lock-input" placeholder="Email" onChange={this._handleEmailChange.bind(this)} value={this.props.lock.get("email")} autoFocus={autoFocusEmail}/>
        </InputWrap>

        <InputWrap name="password" isValid={validPassword}>
          <input type="password" name="password" className="auth0-lock-input" placeholder="Password" onChange={this._handlePasswordChange.bind(this)} value={this.props.lock.get("password")}/>
        </InputWrap>

        {resetAction}
      </div>
    );
  }
}

// TODO specify prop types


// NOTE the autoFocus attribute which this component relies on doesn't work on
// IE 9, which is supported by the current version of the lock. However, the
// feature could be handled by the component itself or by a new one (as the
// following example shows).
//
// class AutoFocusInput extends React.Component {
//   componentDidMount() {
//     React.findDOMNode(this.refs.autoFocusInput).focus();
//   }
//
//   render() {
//     return <input {...this.props} ref="autoFocusInput" />;
//   }
// }
