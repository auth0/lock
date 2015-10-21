import React from 'react';
import PhoneNumberPane from './phone_number_pane';

export default class AskPhoneNumber extends React.Component {

  render() {
    const { focusSubmit, lock, placeholder } = this.props;

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
