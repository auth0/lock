import React from 'react';
import InputWrap from './input_wrap';

export default class CodeInput extends React.Component {
  render() {
    const { isValid, ...props } = this.props;

    return (
      <InputWrap name="code" isValid={isValid}>
        <input type="text" name="code" className="auth0-lock-input" placeholder="Code" {...props}/>
      </InputWrap>
    );
  }
}

// TODO: specify propTypes
