import React from 'react';
import PasswordInput from './password_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../lock/index';
import { setPassword } from '../password';

export default class PasswordPane extends React.Component {

  handleChange(e) {
    const { lock, onChange, policy } = this.props;
    if (onChange) {
      // TODO: are we using this?
      onChange(e)
    } else {
      swap(updateEntity, "lock", l.id(lock), setPassword, e.target.value, policy);
    }
  }

  render() {
    const { lock, placeholder, policy } = this.props;

    return (
      <PasswordInput
        value={c.password(lock)}
        isValid={!c.isFieldVisiblyInvalid(lock, "password")}
        onChange={::this.handleChange}
        placeholder={placeholder}
        disabled={l.submitting(lock)}
        policy={policy}
      />
    );
  }

}

PasswordPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func,
  placeholder: React.PropTypes.string.isRequired,
  policy: React.PropTypes.string
};
