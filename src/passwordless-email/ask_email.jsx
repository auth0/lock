import React from 'react';
import EmailInput from '../credentials/email_input';
import Terms from '../lock/terms';
import * as c from '../credentials/index';
import { changeEmail } from './actions';
import * as l from '../lock/index';

export default class AskEmail extends React.Component {
  render() {
    const { lock } = this.props;

    return (
      <div className="auth0-lock-passwordless auth0-lock-mode">
        <div className="auth0-lock-form auth0-lock-passwordless">
          <p>Enter your email to sign in or sign up.</p>
          <EmailInput value={c.email(lock)}
            isValid={!c.visiblyInvalidEmail(lock)}
            onChange={::this.handleEmailChange}
            gravatar={l.ui.gravatar(lock)}
            autoFocus={l.ui.focusInput(lock)} />
        </div>
        {l.ui.terms(lock) && <Terms content={l.ui.terms(lock)} />}
      </div>
    );
  }

  handleEmailChange(e) {
    changeEmail(l.id(this.props.lock), e.target.value);
  }
}
