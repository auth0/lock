import React from 'react';
import PhoneNumberInput from '../credentials/phone_number_input';
import LocationInput from '../credentials/location_input';
import * as c from '../credentials/index';
// import { selectCountryCode, changePhoneNumber } from './actions';
import { ui } from '../lock/index';

export default class AskPhoneNumber extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <div className="auth0-lock-passwordless.auth0-lock-mode">
        <div className="auth0-lock-form auth0-lock-passwordless">
          <h2>SMS</h2>
          <p>Please enter your phone number.</p>
          <PhoneNumberInput value={c.phoneNumber(lock)}
            isValid={!c.visiblyInvalidPhoneNumber(lock)}
            onChange={::this.handlePhoneNumberChange}
            autoFocus={ui.focusInput(lock)} />
          <LocationInput value="+54 Argentina"
            onClick={::this.handleLocationClick}
            autoFocus={ui.focusInput(lock)} />
        </div>
      </div>
    );
  }

  handlePhoneNumberChange(e) {
    console.log("handlePhoneNumberChange");
    //changePhoneNumber(this.props.lock.get('id'), e.target.value);
  }

  handleLocationClick() {
    console.log("handleCountryCodeSelection");
    // selectCountryCode(this.props.lock.get("id"));
  }
}
