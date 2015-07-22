import React from 'react';
import PhoneNumberInput from '../credentials/phone_number_input';
import { countryCode, phoneNumber, showPhoneNumberError } from '../credentials/index';
import { selectCountryCode, changePhoneNumber } from './actions';

export default class AskPhoneNumber extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your phone number to sign in or create an account
        </div>
        <PhoneNumberInput isValid={!showPhoneNumberError(lock)}
          onChange={::this.handlePhoneNumberChange}
          countryCode={countryCode(lock)}
          countryCodeSelectionHandler={::this.handleCountryCodeSelection}
          value={phoneNumber(lock)}
          autoFocus={lock.get(["showOptions", "focusInput"])} />
      </div>
    );
  }

  handlePhoneNumberChange(e) {
    changePhoneNumber(this.props.lock.get('id'), e.target.value);
  }

  handleCountryCodeSelection(e) {
    e.preventDefault();
    selectCountryCode(this.props.lock.get("id"));
  }
}
