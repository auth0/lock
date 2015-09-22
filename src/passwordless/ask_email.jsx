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
    const terms = this.t(["footerText"]);

    return (
      <CredPane lock={lock} auxiliaryPane={auxiliaryPane} className="auth0-lock-ask-email" terms={terms} ref="cred">
        <div className="auth0-lock-passwordless auth0-lock-mode">
          <div className="auth0-lock-form auth0-lock-passwordless">
            <p>{this.t(["headerText"])}</p>
            <EmailInput value={c.email(lock)}
              isValid={!c.visiblyInvalidEmail(lock)}
              onChange={::this.handleEmailChange}
              gravatar={l.ui.gravatar(lock)}
              autoFocus={l.ui.focusInput(lock)}
              placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
              tabIndex={l.tabIndex(lock, 1)}
              disabled={l.submitting(lock)} />
          </div>
        </div>
      </CredPane>
    );
  }

  handleEmailChange(e) {
    changeEmail(l.id(this.props.lock), e.target.value);
  }

  componentWillSlideIn(...args) {
    return this.refs.cred.componentWillSlideIn(...args);
  }

  componentDidSlideIn(...args) {
    return this.refs.cred.componentDidSlideIn(...args);
  }

  componentWillSlideOut(...args) {
    return this.refs.cred.componentWillSlideOut(...args);
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["email"].concat(keyPath), params);
  }
}
