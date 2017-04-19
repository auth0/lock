import PropTypes from 'prop-types';
import React from 'react';
import EmailPane from '../../field/email/email_pane';
import * as l from '../../core/index';

export default class ResetPasswordPane extends React.Component {
  static propTypes = {
    emailInputPlaceholder: PropTypes.string.isRequired,
    lock: PropTypes.object.isRequired
  };

  render() {
    const { emailInputPlaceholder, header, i18n, lock } = this.props;

    return (
      <div>
        {header}
        <EmailPane i18n={i18n} lock={lock} placeholder={emailInputPlaceholder} />
      </div>
    );
  }
}
