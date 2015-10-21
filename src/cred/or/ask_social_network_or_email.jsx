import React from 'react';
import EmailPane from '../email/email_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../panes/pane_separator';

export default class AskSocialNetworkOrEmail extends React.Component {

  render() {
    const { lock, placeholder } = this.props;

    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <EmailPane lock={lock} placeholder={placeholder} tabIndex={1} />
      </div>
    );
  }

}
