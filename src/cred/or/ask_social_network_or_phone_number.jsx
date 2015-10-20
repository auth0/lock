import React from 'react';
import MainScreenContainer from '../../lock/main_screen_container';
import SignedInConfirmation from '../../lock/signed_in_confirmation';
import PhoneNumberPane from '../phone-number/phone_number_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../panes/pane_separator';
import AskLocation from '../phone-number/ask_location';
import * as l from '../../lock/index';
import * as c from '..//index';
import * as mp from '../../passwordless/index';
import { close } from '../../social/actions';

export default class AskSocialNetworkOrPhoneNumber extends MainScreenContainer {

  constructor(props) {
    super(props, "networkOrPhone");
  }

  componentWillReceiveProps(nextProps) {
    if (mp.selectingLocation(this.props.lock) && !mp.selectingLocation(nextProps.lock)) {
      setTimeout(() => {
        if (c.phoneNumber(nextProps.lock)) {
          this.refs.main.focusSubmit();
        } else {
          this.refs.phoneNumberPane.focusPhoneNumberInput();
        }
      }, 17);
    }
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  renderAuxiliaryPane() {
    const { lock } = this.props;

    if (mp.selectingLocation(lock)) {
      return (
        <AskLocation
          initialLocationSearchStr={mp.initialLocationSearchStr(lock)}
          key="auxiliarypane"
          lock={lock}
        />
      );
    }

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

    return null;
  }

  renderContent() {
    const { lock } = this.props;

    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator />
        <PhoneNumberPane
          lock={lock}
          placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
          ref="phoneNumberPane"
          tabIndex={1}
        />
      </div>
    );
  }

}
