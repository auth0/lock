import React from 'react';
import MainScreenContainer from '../lock/main_screen_container';
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

export default class AskSocialNetworkOrEmail extends MainScreenContainer {

  constructor(props) {
    super(props, "network");
  }

  handleEmailChange(e) {
    changeEmail(l.id(this.props.lock), e.target.value);
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  renderAuxiliaryPane() {
    const { lock } = this.props;

    if (l.signedIn(lock)) {
      return (
        <SignedInConfirmation
          closeHandler={::this.handleClose}
          dictKey="socialConfirmation"
          key="auxiliarypane"
          lock={lock}
        />
      );
    }

    if (mp.isSendLink(lock) && mp.passwordlessStarted(lock)) {
      return <EmailSentConfirmation dictKey="magiclinkConfirmation" key="auxiliarypane" lock={lock} />;
    }

    return null;

  }

  renderContent() {
    const { lock } = this.props;

    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <EmailPane
          lock={lock}
          placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
          tabIndex={1}
        />
      </div>
    );
  }

}
