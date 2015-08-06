import React from 'react';
import InputWrap from './input_wrap';
import EmailIcon from './email_icon';
import { requestGravatar } from '../gravatar/actions';

export default class EmailInput extends React.Component {
  render() {
    const { isValid, onChange, gravatar, ...props } = this.props;
    const icon = <EmailIcon />;

    return (
      <InputWrap name="email" isValid={isValid} icon={icon}>
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
