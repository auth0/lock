import React from 'react';
import MainScreen from '../lock/main_screen';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import EmailPane from '../panes/email_pane';
import SocialButtonsPane from '../panes/social_buttons_pane';
import PaneSeparator from '../panes/pane_separator';
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

    let auxiliaryPane;
    if (l.signedIn(lock)) {
      auxiliaryPane = <SignedInConfirmation closeHandler={::this.handleClose} key="auxiliarypane" lock={lock} />;
    }

    if (mp.isSendLink(lock) && mp.passwordlessStarted(lock)) {
      auxiliaryPane = <EmailSentConfirmation key="auxiliarypane" lock={lock} />;
    }

    const terms = this.t(["footerText"]);

    return (
      <MainScreen lock={lock} ref="cred" terms={terms} auxiliaryPane={auxiliaryPane} className="auth0-lock-ask-email">
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <EmailPane
          lock={lock}
          placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true}) || 'wat'}
          tabIndex={1}
        />
      </MainScreen>
    );
  }

}
