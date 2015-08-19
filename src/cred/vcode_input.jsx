import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';

export default class VcodeInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;

    return (
      <InputWrap name="vcode" isValid={isValid} icon={<Icon name="vcode" />}>
        <input type="text"
            name="vcode"
            className="auth0-lock-input auth0-lock-input-code"
            placeholder="Your code"
            {...props} />
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
