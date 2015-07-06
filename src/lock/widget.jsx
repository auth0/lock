import React from 'react';
import Content from './content';
import LockActionCreators from './action_creators';
import { LockStates } from '../control/constants';
import SubmitButton from './submit_button';
import Header from './header';
import EmailCredentials from './credentials/email';
import PasswordCredentials from './credentials/password';

export default class Widget extends React.Component {
  _handleSubmit(event) {
    event.preventDefault();
    var email = EmailCredentials.validateEmail(this.props.lock.get("email"));
    var password = PasswordCredentials.validatePassword(this.props.lock.get("password"));
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
    var showSubmit = this.props.lock.get("state") === LockStates.WAITING_CLIENT_CONFIG ||
      this.props.lock.get("state") === LockStates.CRASHED;
    var submit = showSubmit ? null : <SubmitButton disabled={disableSubmit} />;

    var lockID = this.props.lock.get("id");
    var icon = this.props.lock.getIn(["showOptions", "icon"]) || "";
    var showCloseButton = this.props.lock.getIn(["showOptions", "closable"]);
    var email = this.props.lock.get("email");
    var gravatar = this.props.lock.getIn(["showOptions", "gravatar"]);
    return (
      <form className="auth0-lock-widget" onSubmit={this._handleSubmit.bind(this)}>
        {/* */}
        <Header lockID={lockID} icon={icon} showCloseButton={showCloseButton} email={email} gravatar={gravatar} gravatarData={this.props.lock.get("gravatar")}/>

        <Content lock={this.props.lock}/>
        {submit}
      </form>
    );
  }
}

// TODO maybe we can make some changes to the markup to improve the rendering
// logic (components must render a single *root* element).
