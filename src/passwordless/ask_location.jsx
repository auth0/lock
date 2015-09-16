import React from 'react';
import LocationSelect from '../cred/location_select';
import { changePhoneLocation } from './actions';
import * as l from '../lock/index';
import { isSmallScreen } from '../utils/media_utils';

export default class AskLocation extends React.Component {
  render() {
    return (
      <LocationSelect selectHandler={::this.locationSelectHandler}
        autoFocus={!isSmallScreen()} />
    );
  }

  locationSelectHandler(location) {
    changePhoneLocation(l.id(this.props.lock), location);
  }
}
