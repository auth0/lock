import React from 'react';
import EmailInput from './email_input';
import * as c from '../index';
import { changeField } from '../actions';
import * as l from '../../lock/index';
import { validateEmail } from '../../utils/validation_utils';

export default class EmailPane extends React.Component {

  handleChange(e) {
    changeField(l.id(this.props.lock), "email", e.target.value, validateEmail);
  }

  render() {
    const { lock, placeholder } = this.props;

    return (
      <EmailInput value={c.email(lock)}
        isValid={!c.isFieldVisiblyInvalid(lock, "email")}
        onChange={::this.handleChange}
        gravatar={l.ui.gravatar(lock)}
        autoFocus={l.ui.focusInput(lock)}
        placeholder={placeholder}
        disabled={l.submitting(lock)} />
    );
  }

}

EmailPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
