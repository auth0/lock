import React from 'react';
import PhoneNumberInput from '../cred/phone_number_input';
import LocationInput from '../cred/location_input';
import { changePhoneNumber, selectPhoneLocation } from '../passwordless/actions';
import * as c from '../cred/index';
import * as l from '../lock/index';

export default class PhoneNumberPane extends React.Component {

  focusPhoneNumberInput() {
    this.refs.phoneNumberInput.focus();
  }

  handlePhoneNumberChange(e) {
    changePhoneNumber(l.id(this.props.lock), e.target.value);
  }

  handleLocationClick(searchStr) {
    selectPhoneLocation(l.id(this.props.lock), searchStr);
  }

  render() {
    const { lock, placeholder, tabIndex } = this.props;

    return (
      <div>
        <LocationInput value={c.phoneLocationString(lock)}
          onClick={::this.handleLocationClick}
          tabIndex={l.tabIndex(lock, tabIndex)} />
        <PhoneNumberInput ref="phoneNumberInput"
          value={c.phoneNumber(lock)}
          isValid={!c.visiblyInvalidPhoneNumber(lock)}
          onChange={::this.handlePhoneNumberChange}
          autoFocus={l.ui.focusInput(lock)}
          placeholder={placeholder}
          tabIndex={l.tabIndex(lock, tabIndex + 1)}
          disabled={l.submitting(lock)} />
      </div>
    );
  }
}

PhoneNumberPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};
