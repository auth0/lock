import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';

export default class VcodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isValid, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap name="vcode" isValid={isValid} icon={<Icon name="vcode" />}  focused={focused}>
        <input type="text"
          className="auth0-lock-input auth0-lock-input-code"
          placeholder="Your code"
          autocomplete="off"
          autocapitalize="off"
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          {...props} />
      </InputWrap>
    );
  }

  handleFocus() {
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}

// TODO: specify propTypes
