import React from 'react';
import Content from './content';
import LockActionCreators from '../actions/lock_action_creators';
import { LockStates } from '../constants/app_constants';
import SubmitButton from './submit_button';
import Header from './header';
import EmailUtils from '../utils/email_utils';
import PasswordUtils from '../utils/password_utils';

export default class Widget extends React.Component {
  _handleSubmit(event) {
    event.preventDefault();
    var email = EmailUtils.validateEmail(this.props.lock.get("email"));
    var password = PasswordUtils.validatePassword(this.props.lock.get("password"));
    if (email && password) {
      LockActionCreators.signIn(this.props.lock.get("id"));
    } else {
      LockActionCreators.invalidateCredentials(
        this.props.lock.get("id"),
        {email: !!email, password: !!password}
      );
    }
  }

  render() {
    var disableSubmit = this.props.lock.get("state") === LockStates.SIGNING_IN;
    var submit = this.props.lock.get("state") === LockStates.WAITING_CLIENT_CONFIG ?
      null : <SubmitButton disabled={disableSubmit} />;

    var icon = this.props.lock.getIn(["showOptions", "icon"]) || "";
    var showCloseButton = this.props.lock.getIn(["showOptions", "closable"]);
    var email = this.props.lock.get("email");
    var gravatar = this.props.lock.getIn(["showOptions", "gravatar"]);
    return (
      <form className="auth0-lock-widget" onSubmit={this._handleSubmit.bind(this)}>
        {/* */}
        <Header icon={icon} showCloseButton={showCloseButton} email={email} gravatar={gravatar}/>

        <Content lock={this.props.lock}/>
        {submit}
      </form>
    );
  }
}
