import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';

export default class LocationInput extends React.Component {
  render() {
    const { onClick, value } = this.props;

    const limitedValue = value.length > 23 ?
      `${value.substr(0,20)}...` : value;

    return (
      <InputWrap name="location" isValid={true} icon={<Icon name="location" />}>
        <input type="button"
          name="location"
          className="auth0-lock-input auth0-lock-input-location"
          value={limitedValue}
          onClick={onClick} />
        <Icon name="arrow" />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
