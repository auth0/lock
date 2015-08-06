import React from 'react';
import InputWrap from './input_wrap';
import PhoneNumberIcon from './phone_number_icon';

export default class PhoneNumberInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;
    const icon = <PhoneNumberIcon />;

    return (
      <InputWrap name="phone-number" isValid={isValid} icon={icon}>
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
