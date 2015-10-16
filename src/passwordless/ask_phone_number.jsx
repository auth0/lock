import React from 'react';
import MainScreenContainer from '../lock/main_screen_container';
import PhoneNumberPane from '../panes/phone_number_pane';
import AskLocation from './ask_location';
import * as c from '../cred/index';
import * as m from './index';

export default class AskPhoneNumber extends MainScreenContainer {

  constructor(props) {
    super(props, "phone");
  }

  componentWillReceiveProps(nextProps) {
    if (m.selectingLocation(this.props.lock) && !m.selectingLocation(nextProps.lock)) {
      setTimeout(() => {
        if (c.phoneNumber(nextProps.lock)) {
          this.refs.main.focusSubmit();
        } else {
          this.refs.phoneNumberPane.focusPhoneNumberInput();
        }
      }, 17);
    }
  }

  renderAuxiliaryPane() {
    const { lock } = this.props;

    if (!m.selectingLocation(lock)) {
      return null;
    }

    return (
      <AskLocation
        initialLocationSearchStr={m.initialLocationSearchStr(lock)}
        key="auxiliarypane"
        lock={lock}
      />
    );
  }

  renderContent() {
    const { lock } = this.props;

    return (
      <PhoneNumberPane
        lock={lock}
        placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
        ref="phoneNumberPane"
        tabIndex={1}
      />
    );
  }

}
