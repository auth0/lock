import React from 'react';
import InputWrap from './input_wrap';

export default class PhoneNumberInput extends React.Component {
  render() {
    const { isValid, countryCode, countryCodeSelectionHandler, ...props } = this.props;

    return (
      <InputWrap name="phone-number" isValid={isValid}>
        <span className="auth0-lock-country-code-input"
          onClick={countryCodeSelectionHandler}>
          {countryCode}
        </span>
        <input type="text"
          name="phoneNumber"
          className="auth0-lock-input"
          placeholder="Phone Number"
          {...props} />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
