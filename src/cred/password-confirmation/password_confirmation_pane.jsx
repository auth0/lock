import React from 'react';
import PasswordInput from '../password/password_input';
import * as c from '../index';
import { changePasswordConfirmation } from './actions';
import * as l from '../../lock/index';

export default class PasswordconfirmationPane extends React.Component {

  handleChange(e) {
    changePasswordConfirmation(l.id(this.props.lock), e.target.value);
  }

  render() {
    const { lock, placeholder, tabIndex } = this.props;

    return (
      <PasswordInput
        value={c.passwordConfirmation(lock)}
        isValid={!c.visiblyInvalidPasswordConfirmation(lock)}
        onChange={::this.handleChange}
        placeholder={placeholder}
        tabIndex={l.tabIndex(lock, tabIndex)}
        disabled={l.submitting(lock)}
      />
    );
  }

}

PasswordconfirmationPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};

PasswordconfirmationPane.defaultProps = {
  tabIndex: 1
};
