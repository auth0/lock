import React from 'react';
import LocationSelect from '../cred/location_select';
import { cancelSelectPhoneLocation, changePhoneLocation } from './actions';
import * as l from '../lock/index';

export default class AskLocation extends React.Component {
  render() {
    return (
      <LocationSelect selectHandler={::this.handleSelect}
        cancelHandler={::this.handleCancel} />
    );
  }

  handleCancel() {
    cancelSelectPhoneLocation(l.id(this.props.lock));
  }

  handleSelect(location) {
    changePhoneLocation(l.id(this.props.lock), location);
  }
}
