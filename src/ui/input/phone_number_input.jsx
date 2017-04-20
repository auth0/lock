import React from 'react';
import InputWrap from './input_wrap';

const svg =
  '<svg focusable="false" width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" class="auth0-lock-icon auth0-lock-icon-mobile"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" transform="translate(-204.000000, -3459.000000)" fill="#888888"><g id="SMS" transform="translate(153.000000, 3207.000000)"><g transform="translate(35.000000, 239.000000)"><path d="M24.1,15.625 L16.9,15.625 L16.9,14.75 C16.9,14.264375 17.30275,13.875 17.8,13.875 L23.2,13.875 C23.6968,13.875 24.1,14.264375 24.1,14.75 L24.1,15.625 L24.1,15.625 Z M16.9,16.5 L24.1,16.5 L24.1,21.75 L16.9,21.75 L16.9,16.5 Z M24.1,25.25 C24.1,25.73125 23.6968,26.125 23.2,26.125 L17.8,26.125 C17.30275,26.125 16.9,25.73125 16.9,25.25 L16.9,22.625 L24.1,22.625 L24.1,25.25 L24.1,25.25 Z M23.2,13 L17.8,13 C16.80595,13 16,13.783125 16,14.75 L16,25.25 C16,26.216875 16.80595,27 17.8,27 L23.2,27 C24.19405,27 25,26.216875 25,25.25 L25,14.75 C25,13.783125 24.19405,13 23.2,13 L23.2,13 Z M20.5,25.25 C20.9968,25.25 21.4,24.85625 21.4,24.375 C21.4,23.889375 20.9968,23.5 20.5,23.5 C20.00275,23.5 19.6,23.889375 19.6,24.375 C19.6,24.85625 20.00275,25.25 20.5,25.25 L20.5,25.25 Z"></path></g></g></g></g></svg>';

export default class PhoneNumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isValid, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap focused={focused} isValid={isValid} name="phone-number" icon={svg}>
        <input
          ref="input"
          type="tel"
          name="phoneNumber"
          className="auth0-lock-input auth0-lock-input-number"
          autoComplete="off"
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          {...props}
        />
      </InputWrap>
    );
  }

  focus() {
    if (!this.refs.input) return;

    this.refs.input.focus();
    this.handleFocus();
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }
}

// TODO: specify propTypes
