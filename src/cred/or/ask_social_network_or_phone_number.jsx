import React from 'react';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../panes/pane_separator';

export default class AskSocialNetworkOrPhoneNumber extends React.Component {

  render() {
    const { focusSubmit, lock, placeholder } = this.props;

    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <PhoneNumberPane
          focusSubmit={focusSubmit}
          lock={lock}
          placeholder={placeholder}
          tabIndex={1}
        />
      </div>
    );
  }

}
