import React from 'react';
import PhoneNumberInput from './phone_number_input';
import LocationInput from './location_input';
import * as c from '../index';
import * as l from '../../lock/index';
import { changeField } from '../actions';
import { selectPhoneLocation } from './actions';
import { selectingLocation } from './index';
import { validatePhoneNumber } from '../../utils/validation_utils';

export default class PhoneNumberPane extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (selectingLocation(this.props.lock) && !selectingLocation(nextProps.lock)) {
      setTimeout(() => {
        if (c.phoneNumber(nextProps.lock)) {
          this.props.focusSubmit();
        } else {
          this.focusPhoneNumberInput();
        }
      }, 17);
    }
  }

  focusPhoneNumberInput() {
    this.refs.phoneNumberInput.focus();
  }

  handlePhoneNumberChange(e) {
    changeField(l.id(this.props.lock), "phoneNumber", e.target.value, validatePhoneNumber);
  }

  handleLocationClick(searchStr) {
    selectPhoneLocation(l.id(this.props.lock), searchStr);
  }

  render() {
    const { lock, placeholder } = this.props;

    return (
      <div>
        <LocationInput value={c.phoneLocationString(lock)}
          onClick={::this.handleLocationClick} />
        <PhoneNumberInput ref="phoneNumberInput"
          value={c.phoneNumber(lock)}
          isValid={!c.isFieldVisiblyInvalid(lock, "phoneNumber")}
          onChange={::this.handlePhoneNumberChange}
          autoFocus={l.ui.focusInput(lock)}
          placeholder={placeholder}
          disabled={l.submitting(lock)} />
      </div>
    );
  }
}

PhoneNumberPane.propTypes = {
  focusSubmit: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
