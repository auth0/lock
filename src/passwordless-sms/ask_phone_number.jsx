import React from 'react';
import CredentialsPane from '../lock/credentials_pane';
import PhoneNumberInput from '../credentials/phone_number_input';
import LocationInput from '../credentials/location_input';
import Terms from '../lock/terms';
import * as c from '../credentials/index';
import { changePhoneNumber, selectPhoneLocation } from './actions';
import * as l from '../lock/index';

export default class AskPhoneNumber extends React.Component {
  render() {
    const { lock } = this.props;
    return (
      <CredentialsPane {...this.props}>
        <div className="auth0-lock-passwordless auth0-lock-mode">
          <div className="auth0-lock-form auth0-lock-passwordless">
            <h2>SMS</h2>
            <p>Please enter your phone number.</p>
            <PhoneNumberInput value={c.phoneNumber(lock)}
              isValid={!c.visiblyInvalidPhoneNumber(lock)}
              onChange={::this.handlePhoneNumberChange}
              autoFocus={l.ui.focusInput(lock)} />
            <LocationInput value={c.phoneLocationString(lock)}
              onClick={::this.handleLocationClick} />
          </div>
          {l.ui.terms(lock) && <Terms content={l.ui.terms(lock)} />}
        </div>
      </CredentialsPane>
    );
  }

  handlePhoneNumberChange(e) {
    changePhoneNumber(l.id(this.props.lock), e.target.value);
  }

  handleLocationClick() {
    selectPhoneLocation(l.id(this.props.lock));
  }
}
