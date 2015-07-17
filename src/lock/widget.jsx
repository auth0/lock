import React from 'react';
import LockActionCreators from './action_creators';
import { LockStates, LockModes } from '../control/constants';
import SubmitButton from './submit_button';
import Header from '../header/header';
import EmailCredentials from './credentials/email';
import PasswordCredentials from './credentials/password';

import LoadingContent from '../loading/content';
import CrashedContent from '../crashed/content';
import PasswordlessEmailContent from '../passwordless-email/content';
import PasswordlessSMSContent from '../passwordless-sms/content';

function selectContent(mode) {
  const map = {
    [LockModes.CRASHED]: CrashedContent,
    [LockModes.LOADING]: LoadingContent,
    [LockModes.PASSWORDLESS_EMAIL]: PasswordlessEmailContent,
    [LockModes.PASSWORDLESS_SMS]: PasswordlessSMSContent
  };

  const result = map[mode];

  if (!result) {
    throw new Error("unknown lock mode");
  }

  return result;
}

export default class Widget extends React.Component {
  render() {
    var disableSubmit = this.props.lock.get("state") === LockStates.SIGNING_IN;
    var showSubmit = this.props.lock.get("state") === LockStates.WAITING_CLIENT_CONFIG ||
      this.props.lock.get("state") === LockStates.CRASHED;
    var submit = showSubmit ? null : <SubmitButton disabled={disableSubmit} />;

    var lockID = this.props.lock.get("id");
    var icon = this.props.lock.getIn(["showOptions", "icon"]) || "";
    var showCloseButton = true; // this.props.lock.getIn(["showOptions", "closable"]);
    const gravatar = this.props.lock.get("gravatar");

    const Content = selectContent(this.props.lock.get("mode"));

    return (
      <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
        <Header lockID={lockID} icon={icon} showCloseButton={showCloseButton} gravatar={gravatar}/>
        <Content lock={this.props.lock} ref="content"/>
        {submit}
        <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
      </form>
    );
  }

  handleSubmit(e) {
    return this.refs.content.handleSubmit(e);
  }
}
