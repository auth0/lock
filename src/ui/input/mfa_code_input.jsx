import PropTypes from 'prop-types';
import React from 'react';
import InputWrap from './input_wrap';
import { icon } from './password_input';

export default class MFACodeInput extends React.Component {
  static propTypes = {
    invalidHint: PropTypes.string.isRequired,
    isValid: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired
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
    const { invalidHint, isValid, onChange, value, ...props } = this.props;

    const { focused } = this.state;

    return (
      <InputWrap
        focused={focused}
        invalidHint={invalidHint}
        isValid={isValid}
        name="mfa_code"
        icon={icon}
      >
        <input
          ref="input"
          type="text"
          name="mfa_code"
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
