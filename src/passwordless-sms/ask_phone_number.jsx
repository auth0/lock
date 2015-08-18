import React from 'react';
import CredentialsPane from '../lock/credentials_pane';
import PhoneNumberInput from '../credentials/phone_number_input';
import LocationInput from '../credentials/location_input';
import Terms from '../lock/terms';
import AskLocation from './ask_location';
import { changePhoneNumber, selectPhoneLocation } from './actions';
import * as c from '../credentials/index';
import * as l from '../lock/index';
import * as m from './index';

export default class AskPhoneNumber extends React.Component {
  render() {
    const { lock } = this.props;
    const auxiliaryPane = m.selectingLocation(lock) ?
      <AskLocation key="auxiliarypane" lock={lock} /> : null;

    return (
      <CredentialsPane lock={lock} auxiliaryPane={auxiliaryPane} className="auth0-lock-intro">
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
