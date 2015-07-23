import React from 'react';
import InputWrap from './input_wrap';
import { requestGravatar } from '../gravatar/actions';

export default class EmailInput extends React.Component {
  render() {
    const { isValid, onChange, gravatar, ...props } = this.props;
    const { disabled } = props;

    return (
      <InputWrap name="email" isValid={isValid} disabled={disabled}>
        <input type="text"
          name="email"
          className="auth0-lock-input"
          placeholder="Email"
          onChange={::this.handleOnChange}
          {...props}/>
      </InputWrap>
    );
  }

  handleOnChange(e) {
    if (this.props.gravatar) {
      requestGravatar(e.target.value);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
}

// TODO: specify propTypes
