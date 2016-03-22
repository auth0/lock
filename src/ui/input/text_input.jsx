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
    const { iconUrl, isValid, name, onChange, value, ...props } = this.props;
    const { focused } = this.state;

    const icon = typeof iconUrl === "string" && iconUrl
      ? <img className="auth0-lock-custom-icon" src={iconUrl} />
      : null;


    return (
      <InputWrap focused={focused} isValid={isValid} name={name} icon={icon}>
        <input
          ref="input"
          type="text"
          name={name}
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
