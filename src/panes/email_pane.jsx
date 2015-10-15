import React from 'react';
import EmailInput from '../cred/email_input';
import * as c from '../cred/index';
import { changeEmail } from '../passwordless/actions';
import * as l from '../lock/index';

export default class EmailPane extends React.Component {

  handleChange(e) {
    changeEmail(l.id(this.props.lock), e.target.value);
  }

  render() {
    const { lock, placeholder, tabIndex } = this.props;

    return (
      <EmailInput value={c.email(lock)}
        isValid={!c.visiblyInvalidEmail(lock)}
        onChange={::this.handleChange}
        gravatar={l.ui.gravatar(lock)}
        autoFocus={l.ui.focusInput(lock)}
        placeholder={placeholder}
        tabIndex={l.tabIndex(lock, tabIndex)}
        disabled={l.submitting(lock)} />
    );
  }

}

EmailPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};
