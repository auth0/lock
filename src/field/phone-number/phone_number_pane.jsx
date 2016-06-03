import React from 'react';
import PhoneNumberInput from '../../ui/input/phone_number_input';

// import LocationInput from '../../ui/input/location_input';
import SelectInput from '../../ui/input/select_input';
import { getFieldLabel, isFieldVisiblyInvalid } from '../index';
import { startOptionSelection } from '../actions';

import * as c from '../index';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import { selectPhoneLocation } from './actions';
import { selectingLocation } from './index';
import { humanLocation, setPhoneNumber } from '../phone_number';

export default class PhoneNumberPane extends React.Component {

  handlePhoneNumberChange(e) {
    swap(updateEntity, "lock", l.id(this.props.lock), setPhoneNumber, e.target.value);
  }

  render() {
    const { instructions, lock, placeholder } = this.props;
    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <div>
        {header}
        <SelectInput
          iconUrl=""
          isValid={!isFieldVisiblyInvalid(lock, "location")}
          name="location"
          placeholder=""
          label={humanLocation(lock)}
          onClick={() => startOptionSelection(l.id(lock), "location", "")}
        />
        <PhoneNumberInput ref="phoneNumberInput"
          value={c.phoneNumber(lock)}
          isValid={!c.isFieldVisiblyInvalid(lock, "phoneNumber")}
          onChange={::this.handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={l.submitting(lock)} />
      </div>
    );
  }
}

PhoneNumberPane.propTypes = {
  instructions: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
