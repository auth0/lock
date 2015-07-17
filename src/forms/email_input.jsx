import React from 'react';
import InputWrap from './input_wrap';

export default class EmailInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;

    return (
      <InputWrap name="email" isValid={isValid}>
        <input type="text" name="email" className="auth0-lock-input" placeholder="Email" {...props}/>
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
