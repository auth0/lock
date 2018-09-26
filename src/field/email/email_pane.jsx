import PropTypes from 'prop-types';
import React from 'react';
import EmailInput from '../../ui/input/email_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setEmail, setConfirmEmail } from '../email';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

export default class EmailPane extends React.Component {
  confirmedValid = true;

  componentDidMount() {
    const { lock } = this.props;
    if (l.ui.avatar(lock) && c.email(lock)) {
      requestAvatar(l.id(lock), c.email(lock));
    }
  }

  handleChange(e) {
    const { lock } = this.props;
    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }

    swap(updateEntity, 'lock', l.id(lock), setEmail, e.target.value);
  }

  compareEmails(e) {
    const { lock } = this.props;
    swap(updateEntity, 'lock', l.id(lock), setConfirmEmail, e.target.value);
    this.confirmedValid = e.target.value === this.refs.primaryEmailInput.props.value;
  }

  render() {
    const { i18n, lock, placeholder, forceInvalidVisibility = false } = this.props;
    const allowAutocomplete = l.ui.allowAutocomplete(lock);

    const field = c.getField(lock, 'email');
    const value = field.get('value', '');
    const valid = field.get('valid', true);
    const invalidHint =
      field.get('invalidHint') || i18n.str(value ? 'invalidErrorHint' : 'blankErrorHint');

    const isValid = (!forceInvalidVisibility || valid) && !c.isFieldVisiblyInvalid(lock, 'email');
    const confirmValidity = isValid && this.confirmedValid;

    return (
      <div>
        <EmailInput
          value={value}
          invalidHint={invalidHint}
          isValid={isValid}
          onChange={::this.handleChange}
          placeholder={placeholder}
          autoComplete={allowAutocomplete}
          ref="primaryEmailInput"
        />
        {l.confirmEmailInput(lock) && (
          <EmailInput
            invalidHint={invalidHint}
            isValid={confirmValidity}
            placeholder={placeholder}
            onChange={::this.compareEmails}
          />
        )}
      </div>
    );
  }
}

EmailPane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired
};
