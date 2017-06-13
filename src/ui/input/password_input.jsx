import PropTypes from 'prop-types';
import React from 'react';
import InputWrap from './input_wrap';
import PasswordStrength from './password/password_strength';

export const icon =
  '<svg focusable="false" width="11px" height="14px" viewBox="0 0 13 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="auth0-lock-icon auth0-lock-icon-box"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-288.000000, -1508.000000)" fill="#888888"><path d="M299,1523.998 L290,1523.998 C288.896,1523.998 288,1523.102 288,1521.999 L288,1515.999 C288,1514.895 288.896,1513.998 290,1513.998 L290,1513.998 L290,1512.499 C290,1510.015 292.015,1507.999 294.5,1507.999 C296.985,1507.999 299,1510.015 299,1512.499 L299,1513.999 C300.104,1513.999 301,1514.895 301,1515.999 L301,1521.999 C301,1523.103 300.104,1523.998 299,1523.998 L299,1523.998 Z M298,1512.499 C298,1510.566 296.433,1508.999 294.5,1508.999 C292.567,1508.999 291,1510.566 291,1512.499 L291,1513.998 L298,1513.998 L298,1512.499 L298,1512.499 Z M300,1515.999 C300,1515.446 299.552,1514.998 299,1514.998 L290,1514.998 C289.447,1514.998 289,1515.446 289,1515.999 L289,1521.999 C289,1522.551 289.447,1522.998 290,1522.998 L299,1522.998 C299.552,1522.998 300,1522.551 300,1521.999 L300,1515.999 L300,1515.999 Z M294.5,1520.998 C294.224,1520.998 294,1520.774 294,1520.498 L294,1517.498 C294,1517.223 294.224,1516.999 294.5,1516.999 C294.776,1516.999 295,1517.223 295,1517.498 L295,1520.498 C295,1520.774 294.776,1520.998 294.5,1520.998 L294.5,1520.998 Z"></path></g></g></svg>';

export default class PasswordInput extends React.Component {
  static propTypes = {
    invalidHint: PropTypes.string.isRequired,
    isValid: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    policy: PropTypes.string,
    strengthMessages: PropTypes.object,
    value: PropTypes.string.isRequired,
    showPassword: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  focus() {
    this.refs.input && this.refs.input.focus();
  }

  hasFocus() {
    return this.state.focused;
  }

  render() {
    const {
      invalidHint,
      isValid,
      onChange,
      policy,
      strengthMessages,
      value,
      showPassword,
      ...props
    } = this.props;

    const { focused, changing } = this.state;

    const passwordStrength = policy && focused && changing
      ? <PasswordStrength messages={strengthMessages} password={value} policy={policy} />
      : null;

    return (
      <InputWrap
        before={passwordStrength}
        focused={focused}
        invalidHint={policy ? undefined : invalidHint}
        isValid={isValid}
        name="password"
        icon={icon}
      >
        <input
          ref="input"
          type={showPassword ? 'text' : 'password'}
          name="password"
          className="auth0-lock-input"
          autoComplete="off"
          autoCapitalize="off"
          onChange={::this.handleOnChange}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          value={value}
          {...props}
        />
      </InputWrap>
    );
  }

  handleOnChange(e) {
    var state = this.state;
    state.changing = true;
    this.setState(state);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }
}
