import React from 'react';
import CredPane from '../lock/cred_pane';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import SocialButton from '../social/social_button';
import EmailInput from '../cred/email_input';
import EmailSentConfirmation from '../passwordless/email_sent_confirmation';
import { changeEmail } from '../passwordless/actions';
import { close } from './actions';
import * as l from '../lock/index';
import * as mp from '../passwordless/index';
import * as c from '../cred/index';

export default class AskSocialNetworkOrEmail extends React.Component {

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
    return l.ui.t(this.props.lock, ["network"].concat(keyPath), params);
  }

  handleEmailChange(e) {
    changeEmail(l.id(this.props.lock), e.target.value);
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  render() {
    const { lock } = this.props;
    const buttons = l.ui.connections(lock).map(x => {
      return <SocialButton key={x} name={x} lockID={l.id(lock)} />;
    });

    let auxiliaryPane;
    if (l.signedIn(lock)) {
      auxiliaryPane = <SignedInConfirmation closeHandler={::this.handleClose} key="auxiliarypane" lock={lock} />;
    }

    if (mp.isSendLink(lock) && mp.passwordlessStarted(lock)) {
      auxiliaryPane = <EmailSentConfirmation key="auxiliarypane" lock={lock} />;
    }

    const terms = this.t(["footerText"]);

    return (
      <CredPane lock={lock} ref="cred" terms={terms} auxiliaryPane={auxiliaryPane} className="auth0-lock-ask-email">
        <div className="auth0-lock-form">
          {buttons}
          <div className="auth0-lock-or">or</div>
          <EmailInput value={c.email(lock)}
            isValid={!c.visiblyInvalidEmail(lock)}
            onChange={::this.handleEmailChange}
            gravatar={l.ui.gravatar(lock)}
            autoFocus={l.ui.focusInput(lock)}
            placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
            tabIndex={l.tabIndex(lock, 1)}
            disabled={l.submitting(lock)} />
        </div>
      </CredPane>
    );
  }

}
