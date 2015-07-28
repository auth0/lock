import React from 'react';
import PhoneNumberInput from '../credentials/phone_number_input';
import { countryCode, phoneNumber, visiblyInvalidPhoneNumber } from '../credentials/index';
import { selectCountryCode, changePhoneNumber } from './actions';
import { ui } from '../lock/index';

export default class AskPhoneNumber extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <div>
        <div className="auth0-lock-instructions">
          Enter your phone number to sign in or create an account
        </div>
        <PhoneNumberInput isValid={!visiblyInvalidPhoneNumber(lock)}
          onChange={::this.handlePhoneNumberChange}
          countryCode={countryCode(lock)}
          countryCodeSelectionHandler={::this.handleCountryCodeSelection}
          value={phoneNumber(lock)}
          autoFocus={ui.focusInput(lock)}
          disabled={lock.get("submitting")} />
      </div>
    );
  }

  handlePhoneNumberChange(e) {
    changePhoneNumber(this.props.lock.get('id'), e.target.value);
  }

  handleCountryCodeSelection() {
    selectCountryCode(this.props.lock.get("id"));
  }
}
