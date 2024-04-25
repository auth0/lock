import PropTypes from 'prop-types';
import React from 'react';
import EmailPane from '../../field/email/email_pane';
import * as l from '../../core/index';
import CaptchaPane from '../../field/captcha/captcha_pane';
import { Flow, swapCaptcha } from '../../connection/captcha';

export default class ResetPasswordPane extends React.Component {
  static propTypes = {
    emailInputPlaceholder: PropTypes.string.isRequired,
    lock: PropTypes.object.isRequired
  };

  render() {
    const { emailInputPlaceholder, header, i18n, lock } = this.props;

    const captchaPane =
      l.resetPasswordCaptcha(lock) &&
      l.resetPasswordCaptcha(lock).get('required') ? (
        <CaptchaPane i18n={i18n} lock={lock} flow={Flow.PASSWORD_RESET} onReload={() => swapCaptcha(l.id(lock), Flow.PASSWORD_RESET, false, null)} />
      ) : null;

    return (
      <div>
        {header}
        <EmailPane
          i18n={i18n}
          lock={lock}
          placeholder={emailInputPlaceholder}
          strictValidation={false}
        />
        {captchaPane}
      </div>
    );
  }
}
