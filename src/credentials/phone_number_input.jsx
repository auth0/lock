import React from 'react';
import InputWrap from './input_wrap';

export default class PhoneNumberInput extends React.Component {
  render() {
    const { isValid, countryCode, countryCodeSelectionHandler,  ...props } = this.props;
    const { disabled } = props;

    return (
      <InputWrap name="phone-number" isValid={isValid} disabled={disabled}>
        <span className="auth0-lock-country-code-input"
          onClick={::this.handleCountryCodeInputClick}>
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

  handleCountryCodeInputClick(e) {
    const { disabled, countryCodeSelectionHandler } = this.props;
    if (!disabled) {
      e.preventDefault();
      countryCodeSelectionHandler();
    }
  }
}

// TODO: specify propTypes
