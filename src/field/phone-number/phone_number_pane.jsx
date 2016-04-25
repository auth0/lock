import React from 'react';
import PhoneNumberInput from '../../ui/input/phone_number_input';
import LocationInput from '../../ui/input/location_input';
import * as c from '../index';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import { selectPhoneLocation } from './actions';
import { selectingLocation } from './index';
import { setPhoneNumber } from '../phone_number';

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
    swap(updateEntity, "lock", l.id(this.props.lock), setPhoneNumber, e.target.value);
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
          autoFocus={l.ui.autofocus(lock)}
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
