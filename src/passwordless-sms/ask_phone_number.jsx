import React from 'react';
import PhoneNumberInput from '../forms/phone_number_input';
import { countryCode, phoneNumber } from '../forms/index';
import { selectCountryCode } from './actions';

export default class AskPhoneNumber extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your phone number to sign in or create an account
        </div>
        <PhoneNumberInput isValid={true}
          countryCode={countryCode(lock)}
          countryCodeSelectionHandler={::this.handleCountryCodeSelection}
          value={phoneNumber(lock)} />
      </div>
    );
  }

  handleCountryCodeSelection(e) {
    e.preventDefault();
    selectCountryCode(this.props.lock.get("id"));
  }
}
