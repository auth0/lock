import React from 'react';
import EmailPane from '../email/email_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../panes/pane_separator';
import * as l from '../../lock/index';

const NAME = "networkOrEmail";

export default class AskSocialNetworkOrEmail extends React.Component {

  render() {
    const { lock } = this.props;
    const placeholder =
      l.ui.t(lock, [NAME, "emailInputPlaceholder"], {__textOnly: true});

    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <EmailPane lock={lock} placeholder={placeholder} tabIndex={1} />
      </div>
    );
  }

}
