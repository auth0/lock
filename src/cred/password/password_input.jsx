import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';

export default class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isValid, onChange, ...props } = this.props;
    const { focused } = this.state;

    return (
      // TODO: use a proper icon
      <InputWrap name="password" isValid={isValid} icon={<Icon name="vcode" />} focused={focused}>
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
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}

// TODO: specify propTypes
