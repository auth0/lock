import React from 'react';
import InputWrap from './input_wrap';
import LocationIcon from './location_icon';
import ArrowIcon from './arrow_icon';

export default class LocationInput extends React.Component {
  render() {
    const icon = <LocationIcon />;

    return (
      <InputWrap name="location" isValid={true} icon={icon}>
        <input type="button"
          name="location"
          className="auth0-lock-input auth0-lock-input-location"
          {...this.props} />
        <ArrowIcon />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
