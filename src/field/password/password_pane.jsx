import React from 'react';
import PasswordInput from './password_input';
import * as c from '../index';
import { changeField } from '../actions';
import * as l from '../../lock/index';
import { validatePassword } from '../../utils/validation_utils';

export default class PasswordPane extends React.Component {

  handleChange(e) {
    const { lock, onChange, policy } = this.props;
    onChange ? onChange(e) : changeField(l.id(lock), "password", e.target.value, validatePassword, policy);
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
