import React from 'react';
import PhoneNumberPane from './phone_number_pane';
import * as l from '../../lock/index';

const NAME = "phone";

export default class AskPhoneNumber extends React.Component {

  render() {
    const { focusSubmit, lock } = this.props;
    const placeholder =
      l.ui.t(lock, [NAME, "phoneNumberInputPlaceholder"], {__textOnly: true});

    return (
      <PhoneNumberPane
        focusSubmit={focusSubmit}
        lock={lock}
        placeholder={placeholder}
        tabIndex={1}
      />
    );
  }

}
