import React from 'react';
import PasswordInput from './password_input';
import * as c from '../index';
import { changePassword } from './actions';
import * as l from '../../lock/index';

export default class PasswordPane extends React.Component {

  handleChange(e) {
    const { lock, onChange, policy } = this.props;
    onChange ? onChange(e) : changePassword(l.id(lock), e.target.value, policy);
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
