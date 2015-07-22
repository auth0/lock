import React from 'react';
import InputWrap from './input_wrap';

export default class VerificationCodeInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;

    return (
      <InputWrap name="verification-code" isValid={isValid}>
        <input type="text" name="verification-code" className="auth0-lock-input" placeholder="Code" {...props}/>
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
