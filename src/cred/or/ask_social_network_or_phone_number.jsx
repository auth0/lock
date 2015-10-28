import React from 'react';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../panes/pane_separator';
import * as l from '../../lock/index';

const NAME = "networkOrPhone";

export default class AskSocialNetworkOrPhoneNumber extends React.Component {

  render() {
    const { focusSubmit, lock } = this.props;
    const placeholder =
      l.ui.t(lock, [NAME, "phoneNumberInputPlaceholder"], {__textOnly: true});

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
