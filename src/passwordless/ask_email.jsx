import React from 'react';
import CredPane from '../lock/cred_pane';
import EmailInput from '../cred/email_input';
import EmailSentConfirmation from './email_sent_confirmation';
import * as c from '../cred/index';
import { changeEmail } from './actions';
import * as l from '../lock/index';
import * as m from './index';

export default class AskEmail extends React.Component {
  render() {
    const { lock } = this.props;
    const auxiliaryPane = m.isSendLink(lock) && m.passwordlessStarted(lock) ?
      <EmailSentConfirmation key="auxiliarypane" lock={lock} /> : null;

    return (
      <CredPane lock={lock} auxiliaryPane={auxiliaryPane} className="auth0-lock-ask-email">
        <div className="auth0-lock-passwordless auth0-lock-mode">
          <div className="auth0-lock-form auth0-lock-passwordless">
            <p>Enter your email to sign in or sign up.</p>
            <EmailInput value={c.email(lock)}
              isValid={!c.visiblyInvalidEmail(lock)}
              onChange={::this.handleEmailChange}
              gravatar={l.ui.gravatar(lock)}
              autoFocus={l.ui.focusInput(lock)}
              disabled={l.submitting(lock)} />
          </div>
        </div>
      </CredPane>
    );
  }

  handleEmailChange(e) {
    changeEmail(l.id(this.props.lock), e.target.value);
  }
}
