import React from 'react';
import InputWrap from './input_wrap';
import VerificationCodeIcon from './verification_code_icon';

export default class VerificationCodeInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;
    const icon = <VerificationCodeIcon />

    return (
      <InputWrap name="verification-code" isValid={isValid} icon={icon}>
        <input type="text"
            name="verificationCode"
            className="auth0-lock-input auth0-lock-input-code"
            placeholder="Your code"
            {...props} />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
