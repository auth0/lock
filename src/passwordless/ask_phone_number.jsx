import React from 'react';
import MainScreen from '../lock/main_screen';
import MainScreenContainer from '../lock/main_screen_container';
import PhoneNumberPane from '../panes/phone_number_pane';
import AskLocation from './ask_location';
import * as c from '../cred/index';
import * as m from './index';

export default class AskPhoneNumber extends MainScreenContainer {

  constructor(props) {
    super(props, "phone", "cred");
  }

  componentWillReceiveProps(nextProps) {
    if (m.selectingLocation(this.props.lock) && !m.selectingLocation(nextProps.lock)) {
      setTimeout(() => {
        if (c.phoneNumber(nextProps.lock)) {
          this.refs.cred.focusSubmit();
        } else {
          this.refs.phoneNumberPane.focusPhoneNumberInput();
        }
      }, 17);
    }
  }

  render() {
    const { lock } = this.props;
    const initialLocationSearchStr = m.initialLocationSearchStr(lock);
    const auxiliaryPane = m.selectingLocation(lock) ?
      <AskLocation key="auxiliarypane" lock={lock} initialLocationSearchStr={initialLocationSearchStr} /> : null;
    const terms = this.t(["footerText"]);

    return (
      <MainScreen lock={lock} auxiliaryPane={auxiliaryPane} terms={terms} ref="cred">
        <p>{this.t(["headerText"])}</p>
        <PhoneNumberPane
          lock={lock}
          placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
          ref="phoneNumberPane"
          tabIndex={1}
        />
      </MainScreen>
    );
  }

}
