import React from 'react';
import InputWrap from './input_wrap';

export default class TextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  hasFocus() {
    return this.state.focused;
  }

  render() {
    const { isValid, onChange, value, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap focused={focused} isValid={isValid} name="password" svg="">
        <input
          ref="input"
          type="text"
          name="text"
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
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}
