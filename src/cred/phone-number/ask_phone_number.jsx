import React from 'react';
import Screen from '../../lock/screen';
import PhoneNumberPane from './phone_number_pane';

import { renderAskLocation } from '../../mode/shared';

import { cancelSelectPhoneLocation } from './actions';
import { selectingLocation } from './index';


export default class AskPhoneNumber extends Screen {

  constructor(lock) {
    super("phone", lock);
  }

  escHandler() {
    return selectingLocation(this.lock) ? cancelSelectPhoneLocation : null;
  }

  renderAuxiliaryPane() {
    return renderAskLocation(this.lock);
  }

  render({focusSubmit, lock}) {
    return (
      <PhoneNumberPane
        focusSubmit={focusSubmit}
        lock={lock}
        placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
