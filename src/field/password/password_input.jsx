import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';
import PasswordStrength from './password_strength';

export default class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isValid, onChange, policy, value, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap
        focused={focused}
        icon={<Icon name="password" />}
        isValid={isValid}
        name="password"
      >
        <input
          ref="input"
          type="password"
          name="password"
          className="auth0-lock-input"
          placeholder="enter password"
          autoComplete="off"
          autoCapitalize="off"
          onChange={::this.handleOnChange}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          value={value}
          {...props}
        />
        {policy && focused ? <PasswordStrength password={value} policy={policy} /> : null}
      </InputWrap>
    );
  }

  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleFocus() {
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}

// TODO: specify propTypes
