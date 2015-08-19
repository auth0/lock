import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';

export default class VerificationCodeInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;

    return (
      <InputWrap name="verification-code" isValid={isValid} icon={<Icon name="verificationCode" />}>
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
