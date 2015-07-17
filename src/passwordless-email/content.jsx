import React from 'react';
import EmailInput from '../forms/email_input';
import { changeEmail, requestPasswordlessLinkEmail } from './actions';
import { LockStates } from '../control/constants';


function selectScreen(state) {
  switch(state) {
  case LockStates.READY:
    return EnterEmailScreen;
  case LockStates.DONE:
    return DoneScreen;
  default:
    throw new Error("unknown lock state");
  }
}

class EnterEmailScreen extends React.Component {
  render() {
    const { lock } = this.props;
    const isValid = !lock.get("validate") || lock.get("validEmail");
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your email address to sign in or create an account
        </div>
        <EmailInput value={lock.get("email")} isValid={isValid} disabled={lock.get("submitting")} onChange={::this.handleEmailChange}/>
      </div>
    );
  }

  handleEmailChange(e) {
    const lockID = this.props.lock.get('id');
    const email = e.target.value;
    changeEmail(lockID, email);
  }
}

class DoneScreen extends React.Component {
  render() {
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          We sent you a link to sign in. <br/>
          Please check your inbox.
        </div>
      </div>
    );
  }
}

export default class PasswordlessEmailContent extends React.Component {
  render() {
    const Screen = selectScreen(this.props.lock.get("state"));
    return <Screen lock={this.props.lock} />;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.lock.get('state') === LockStates.READY) {
      const lockID = this.props.lock.get('id');
      requestPasswordlessLinkEmail(lockID);
    }
  }
}

PasswordlessEmailContent.propTypes = {
  lock: React.PropTypes.object
};
