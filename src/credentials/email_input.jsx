import React from 'react';
import InputWrap from './input_wrap';
import { requestGravatar } from '../gravatar/actions';

export default class EmailInput extends React.Component {
  render() {
    const { isValid, onChange, gravatar, ...props } = this.props;

    return (
      <InputWrap name="email" isValid={isValid}>
        <input type="text"
          name="email"
          className="auth0-lock-input"
          placeholder="yours@example.com"
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
