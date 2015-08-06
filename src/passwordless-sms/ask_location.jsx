import React from 'react';
import LocationSelect from '../credentials/location_select';
import { changePhoneLocation } from './actions';
import * as l from '../lock/index';

export default class AskLocation extends React.Component {
  render() {
    return (
      <LocationSelect selectHandler={::this.locationSelectHandler}
          autoFocus={l.ui.focusInput(this.props.lock)} />
    );
  }

  locationSelectHandler(location) {
    changePhoneLocation(l.id(this.props.lock), location);
  }
}
