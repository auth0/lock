import React from 'react';
import EmailPane from '../../field/email/email_pane';
import * as l from '../../core/index';

export default class ResetPasswordPane extends React.Component {
  static propTypes = {
    emailInputPlaceholder: React.PropTypes.string.isRequired,
    lock: React.PropTypes.object.isRequired
  };

  render() {
    const { emailInputPlaceholder, header, lock } = this.props;

    return (
      <div>
        {header}
        <EmailPane lock={lock} placeholder={emailInputPlaceholder} />
      </div>
    );
  }

}
