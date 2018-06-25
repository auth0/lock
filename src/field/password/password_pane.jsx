import PropTypes from 'prop-types';
import React from 'react';
import PasswordInput from '../../ui/input/password_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setPassword, setShowPassword } from '../password';

export default class PasswordPane extends React.Component {
  handleChange = e => {
    const { lock, policy } = this.props;
    swap(updateEntity, 'lock', l.id(lock), setPassword, e.target.value, policy);
  };
  handleShowPasswordChange = e => {
    const { lock } = this.props;
    swap(updateEntity, 'lock', l.id(lock), setShowPassword, e.target.checked);
  };

  render() {
    const { i18n, lock, placeholder, policy, strengthMessages, hidden } = this.props;
    const hiddenCss = hidden ? ' auth0-lock-hidden' : '';
    return (
      <div className={`auth0-lock-input-block auth0-lock-input-show-password${hiddenCss}`}>
        <PasswordInput
          value={c.getFieldValue(lock, 'password')}
          invalidHint={i18n.str('blankErrorHint')}
          showPasswordStrengthMessage={!c.isFieldValid(lock, 'password')}
          isValid={!c.isFieldVisiblyInvalid(lock, 'password')}
          onChange={this.handleChange}
          placeholder={placeholder}
          strengthMessages={strengthMessages}
          disabled={l.submitting(lock)}
          policy={policy}
          showPassword={c.getFieldValue(lock, 'showPassword', false)}
        />
        {l.ui.allowShowPassword(lock) && (
          <div className="auth0-lock-show-password">
            <input type="checkbox" id="slideOne" onChange={this.handleShowPasswordChange} />
            <label htmlFor="slideOne" title={i18n.str('showPassword')} />
          </div>
        )}
      </div>
    );
  }
}

PasswordPane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  policy: PropTypes.string,
  strengthMessages: PropTypes.object,
  hidden: PropTypes.bool
};
