import React from 'react';
import SignInErrorMessage from './error_message';
import ModeTabs from '../mode_tabs';
import LockActionCreators from '../action_creators';
import InputWrap from '../../forms/input_wrap';

export default class SignInContent extends React.Component {
  _handleEmailChange() {
    var lockID = this.props.lock.get('id'), email = event.target.value;
    LockActionCreators.changeEmail(lockID, email);
  }

  _handlePasswordChange() {
    var lockID = this.props.lock.get('id'), password = event.target.value;
    LockActionCreators.changePassword(lockID, password);
  }

  _handleEmailInput() {
    var lockID = this.props.lock.get('id'), email = event.target.value;
    LockActionCreators.inputEmail(lockID, email);
  }

  _handlePasswordInput() {
    var lockID = this.props.lock.get('id'), email = event.target.value;
    LockActionCreators.inputPassword(lockID, email);
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

        <div className="auth0-lock-form auth0-lock-login">
          <InputWrap name="email" isValid={validEmail}>
            <input type="text" name="email" className="auth0-lock-input" placeholder="Email" onChange={this._handleEmailChange.bind(this)} value={this.props.lock.get("email")} autoFocus={autoFocusEmail} onInput={this._handleEmailInput.bind(this)}/>
          </InputWrap>

          <InputWrap name="password" isValid={validPassword}>
            <input type="password" name="password" className="auth0-lock-input" placeholder="Password" onChange={this._handlePasswordChange.bind(this)} value={this.props.lock.get("password")} onInput={this._handlePasswordInput.bind(this)}/>
          </InputWrap>

          {resetAction}
        </div>
      </div>
    );
  }
}

SignInContent.propTypes = {
  lock: React.PropTypes.object
};



// TODO the autoFocus attribute which this component relies on doesn't work on
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
