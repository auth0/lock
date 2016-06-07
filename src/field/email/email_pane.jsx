import React from 'react';
import EmailInput from '../../ui/input/email_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setEmail } from '../email';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

export default class EmailPane extends React.Component {

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

    swap(updateEntity, "lock", l.id(lock), setEmail, e.target.value);
  }

  render() {
    const { i18n, lock, placeholder } = this.props;
    const value = c.getFieldValue(lock, "email");

    return (
      <EmailInput
        value={value}
        invalidHint={i18n.str(value ? "invalidErrorHint": "blankErrorHint")}
        isValid={!c.isFieldVisiblyInvalid(lock, "email")}
        onChange={::this.handleChange}
        placeholder={placeholder}
      />
    );
  }

}

EmailPane.propTypes = {
  i18n: React.PropTypes.object.isRequired,
  invalidHint: React.PropTypes.string,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
