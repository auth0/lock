import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';

export default class LocationInput extends React.Component {
  render() {
    return (
      <InputWrap name="location" isValid={true} icon={<Icon name="location" />}>
        <input type="button"
          name="location"
          className="auth0-lock-input auth0-lock-input-location"
          {...this.props} />
        <Icon name="arrow" />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
