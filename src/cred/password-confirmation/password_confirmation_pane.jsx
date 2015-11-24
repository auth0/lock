import React from 'react';
import PasswordInput from '../password/password_input';
import PasswordPane from '../password/password_pane';
import * as c from '../index';
import { changePassword, changePasswordConfirmation } from './actions';
import * as l from '../../lock/index';

export default class PasswordconfirmationPane extends React.Component {

  handlePasswordChange(e) {
    changePassword(l.id(this.props.lock), e.target.value);
  }

  handlePasswordConfirmationChange(e) {
    changePasswordConfirmation(l.id(this.props.lock), e.target.value);
  }

  render() {
    const {
      lock,
      passwordConfirmationPlaceholder,
      passwordPlaceholder,
      tabIndex
    } = this.props;

    return (
      <div>
        <PasswordPane
          lock={lock}
          onChange={::this.handlePasswordChange}
          placeholder={passwordPlaceholder}
          tabIndex={tabIndex}
        />
        <PasswordInput
          value={c.passwordConfirmation(lock)}
          isValid={!c.visiblyInvalidPasswordConfirmation(lock)}
          onChange={::this.handlePasswordConfirmationChange}
          placeholder={passwordConfirmationPlaceholder}
          tabIndex={l.tabIndex(lock, tabIndex + 1)}
          disabled={l.submitting(lock)}
        />
      </div>
    );
  }

}

PasswordconfirmationPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  passwordConfirmationPlaceholder: React.PropTypes.string.isRequired,
  passwordPlaceholder: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};

PasswordconfirmationPane.defaultProps = {
  tabIndex: 1
};
