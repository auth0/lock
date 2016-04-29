import React from 'react';
import PasswordInput from '../../ui/input/password_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setPassword } from '../password';

export default class PasswordPane extends React.Component {

  handleChange(e) {
    const { lock, policy } = this.props;
    swap(updateEntity, "lock", l.id(lock), setPassword, e.target.value, policy);
  }

  render() {
    const { lock, placeholder, policy, strengthMessages } = this.props;

    return (
      <PasswordInput
        value={c.password(lock)}
        isValid={!c.isFieldVisiblyInvalid(lock, "password")}
        onChange={::this.handleChange}
        placeholder={placeholder}
        strengthMessages={strengthMessages}
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
  policy: React.PropTypes.string,
  strengthMessages: React.PropTypes.object
};
