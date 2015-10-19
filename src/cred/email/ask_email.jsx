import React from 'react';
import MainScreenContainer from '../../lock/main_screen_container';
import EmailSentConfirmation from './email_sent_confirmation';
import EmailPane from './email_pane';

// TODO: remove passwordless deps
import * as m from '../../passwordless/index';

export default class AskEmail extends MainScreenContainer {

  constructor(props) {
    super(props, "email");
  }

  renderAuxiliaryPane() {
    const { lock } = this.props;

    if (!(m.isSendLink(lock) && m.passwordlessStarted(lock))) {
      return null;
    }

    return <EmailSentConfirmation key="auxiliarypane" lock={lock} />;
  }

  renderContent() {
    const { lock } = this.props;

    return (
      <EmailPane
        lock={lock}
        placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
        tabIndex={1}
      />
    );
  }

}
