import React from 'react';
import EmailPane from '../cred/email/email_pane';
import UsernamePane from '../cred/username/username_pane';
import { authWithUsername } from './index';

export default class ResetPasswordPane extends React.Component {
  static propTypes = {
    emailInputPlaceholder: React.PropTypes.string.isRequired,
    lock: React.PropTypes.object.isRequired,
    usernameInputPlaceholder: React.PropTypes.string.isRequired
  };

  render() {
    const {
      emailInputPlaceholder,
      lock,
      usernameInputPlaceholder
    } = this.props;

    return authWithUsername(lock)
      ? <UsernamePane lock={lock} placeholder={usernameInputPlaceholder} />
      : <EmailPane lock={lock} placeholder={emailInputPlaceholder} />;
  }

}

// ResetPasswordPane.propTypes
