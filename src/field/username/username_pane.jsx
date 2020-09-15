import PropTypes from 'prop-types';
import React from 'react';
import UsernameInput from '../../ui/input/username_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setUsername, usernameLooksLikeEmail, getUsernameValidation } from '../username';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

export default class UsernamePane extends React.Component {
  componentDidMount(e) {
    const { lock, validateFormat, usernameStyle, strictValidation } = this.props;
    if (l.ui.avatar(lock) && c.username(lock)) {
      requestAvatar(l.id(lock), c.username(lock));
    }
    swap(
      updateEntity,
      'lock',
      l.id(lock),
      setUsername,
      c.username(lock),
      usernameStyle,
      validateFormat,
      strictValidation
    );
  }

  handleChange(e) {
    const { lock, validateFormat, usernameStyle, strictValidation } = this.props;
    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }
    swap(
      updateEntity,
      'lock',
      l.id(lock),
      setUsername,
      e.target.value,
      usernameStyle,
      validateFormat,
      strictValidation
    );
  }

  render() {
    const { i18n, lock, placeholder, validateFormat } = this.props;
    const allowAutocomplete = l.ui.allowAutocomplete(lock);
    const value = c.getFieldValue(lock, 'username');
    const usernameValidation = validateFormat ? getUsernameValidation(lock) : {};

    // TODO: invalidErrorHint and blankErrorHint are deprecated.
    // They are kept for backwards compatibiliy in the code for the customers overwriting
    // them with languageDictionary. They can be removed in the next major release.
    const invalidHintKey = str => {
      if (!str) {
        return i18n.str('blankErrorHint') ? 'blankErrorHint' : 'blankUsernameErrorHint';
      }
      if (usernameLooksLikeEmail(str) || !validateFormat)
        return i18n.str('invalidErrorHint') ? 'invalidErrorHint' : 'invalidUsernameErrorHint';
      return 'usernameFormatErrorHint';
    };

    const invalidHint = str => {
      const hintKey = invalidHintKey(str);

      // only show format info in the error if it should validate the format and
      // if there is any format restrictions for the connection
      if ('usernameFormatErrorHint' === hintKey && validateFormat && usernameValidation != null) {
        return i18n.str(hintKey, usernameValidation.min, usernameValidation.max);
      }

      return i18n.str(hintKey);
    };

    return (
      <UsernameInput
        value={value}
        invalidHint={invalidHint(value)}
        isValid={!c.isFieldVisiblyInvalid(lock, 'username')}
        onChange={::this.handleChange}
        placeholder={placeholder}
        autoComplete={allowAutocomplete}
      />
    );
  }
}

UsernamePane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  validateFormat: PropTypes.bool.isRequired,
  usernameStyle: PropTypes.oneOf(['any', 'email', 'username']),
  strictValidation: PropTypes.bool.isRequired
};

UsernamePane.defaultProps = {
  validateFormat: false,
  usernameStyle: 'username'
};
