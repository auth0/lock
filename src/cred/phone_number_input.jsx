import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';

export default class PhoneNumberInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;

    return (
      <InputWrap name="phone-number" isValid={isValid} icon={<Icon name="phoneNumber" />}>
        <input type="text"
          name="phoneNumber"
          className="auth0-lock-input auth0-lock-input-number"
          placeholder="your phone number"
          {...props} />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
