import PropTypes from 'prop-types';
import React from 'react';
import EmailInput from '../../ui/input/email_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setEmail } from '../email';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

export default class EmailPane extends React.Component {
  componentDidMount() {
    const { lock, strictValidation } = this.props;
    if (l.ui.avatar(lock) && c.email(lock)) {
      requestAvatar(l.id(lock), c.email(lock));
    }

    swap(updateEntity, 'lock', l.id(lock), setEmail, c.email(lock), strictValidation);
  }

  handleChange(e) {
    const { lock, strictValidation } = this.props;
    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }

    swap(updateEntity, 'lock', l.id(lock), setEmail, e.target.value, strictValidation);
  }

  render() {
    const { i18n, lock, placeholder, forceInvalidVisibility = false } = this.props;
    const allowAutocomplete = l.ui.allowAutocomplete(lock);

    const field = c.getField(lock, 'email');
    const value = field.get('value', '');
    const valid = field.get('valid', true);

    // TODO: invalidErrorHint and blankErrorHint are deprecated.
    // They are kept for backwards compatibiliy in the code for the customers overwriting
    // them with languageDictionary. They can be removed in the next major release.
    const invalidHint =
      field.get('invalidHint') || value
        ? i18n.str('invalidErrorHint') || i18n.str('invalidEmailErrorHint')
        : i18n.str('blankErrorHint') || i18n.str('blankEmailErrorHint');

    const isValid = (!forceInvalidVisibility || valid) && !c.isFieldVisiblyInvalid(lock, 'email');

    return (
      <EmailInput
        lockId={l.id(lock)}
        value={value}
        invalidHint={invalidHint}
        isValid={isValid}
        onChange={::this.handleChange}
        placeholder={placeholder}
        autoComplete={allowAutocomplete}
      />
    );
  }
}

EmailPane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  strictValidation: PropTypes.bool.isRequired
};
