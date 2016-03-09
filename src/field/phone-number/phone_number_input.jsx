import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';

export default class PhoneNumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isValid, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap name="phone-number" isValid={isValid} icon={<Icon name="phoneNumber" />} focused={focused}>
        <input ref="input"
          type="tel"
          name="phoneNumber"
          className="auth0-lock-input auth0-lock-input-number"
          autoComplete="off"
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          {...props} />
      </InputWrap>
    );
  }

  focus() {
    this.refs.input.focus();
    this.handleFocus();
  }

  handleFocus() {
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}

// TODO: specify propTypes
