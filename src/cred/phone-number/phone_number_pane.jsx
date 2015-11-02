import React from 'react';
import PhoneNumberInput from './phone_number_input';
import LocationInput from './location_input';
import * as c from '../index';
import * as l from '../../lock/index';
import { changePhoneNumber, selectPhoneLocation } from './actions';
import { selectingLocation } from './index';

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
  focusSubmit: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};

PhoneNumberPane.defaultProps = {
  tabIndex: 1
};
