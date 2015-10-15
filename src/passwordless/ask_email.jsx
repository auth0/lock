import React from 'react';
import MainScreen from '../lock/main_screen';
import MainScreenContainer from '../lock/main_screen_container';
import EmailSentConfirmation from './email_sent_confirmation';
import EmailPane from '../panes/email_pane';
import * as m from './index';

export default class AskEmail extends MainScreenContainer {

  constructor(props) {
    super(props, "email", "cred");
  }

  render() {
    const { lock } = this.props;
    const auxiliaryPane = m.isSendLink(lock) && m.passwordlessStarted(lock) ?
      <EmailSentConfirmation key="auxiliarypane" lock={lock} /> : null;
    const terms = this.t(["footerText"]);

    return (
      <MainScreen lock={lock} auxiliaryPane={auxiliaryPane} className="auth0-lock-ask-email" terms={terms} ref="cred">
        <p>{this.t(["headerText"])}</p>

        <EmailPane
          lock={lock}
          placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
          tabIndex={1}
        />

      </MainScreen>
    );
  }

}
