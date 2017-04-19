import React from 'react';
import SuccessPane from '../../ui/box/success_pane';
import { closeLock } from '../../core/actions';
import * as l from '../../core/index';
import * as c from '../../field/index';

import { resendEmail, restart } from './actions';
import * as m from './index';

import * as i18n from '../../i18n'; // TODO: can't we get this from pops?

const retrySvg =
  '<svg focusable="false" height="32px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M27.877,19.662c0.385-1.23,0.607-2.531,0.607-3.884c0-7.222-5.83-13.101-13.029-13.194v4.238    c4.863,0.093,8.793,4.071,8.793,8.956c0,0.678-0.088,1.332-0.232,1.966l-3.963-1.966l2.76,8.199l8.197-2.762L27.877,19.662z"></path> <path d="M7.752,16.222c0-0.678,0.088-1.332,0.232-1.967l3.963,1.967l-2.76-8.199L0.99,10.785l3.133,1.553    c-0.384,1.23-0.607,2.531-0.607,3.885c0,7.223,5.83,13.1,13.03,13.194v-4.238C11.682,25.086,7.752,21.107,7.752,16.222z"></path> </svg>';

class ResendLink extends React.Component {
  render() {
    const { label, onClick } = this.props;
    return (
      <a className="auth0-lock-resend-link" href="#" onClick={onClick}>
        {label} <span dangerouslySetInnerHTML={{ __html: retrySvg }} />
      </a>
    );
  }
}

class Resend extends React.Component {
  render() {
    const { labels, lock } = this.props;

    const resendLink =
      m.resendAvailable(lock) &&
      <ResendLink
        onClick={::this.handleClick}
        label={m.resendFailed(lock) ? labels.retry : labels.resend}
      />;

    const resendingLabel =
      m.resendOngoing(lock) && <a className="auth0-lock-resend-link">{labels.resending}</a>;

    const resendSuccessLabel =
      m.resendSuccess(lock) && <span className="auth0-lock-sent-label">{labels.sent}</span>;

    const resendFailedLabel =
      m.resendFailed(lock) && <span className="auth0-lock-sent-failed-label">{labels.failed}</span>;

    return (
      <span>
        {resendLink}
        {resendingLabel}
        {resendSuccessLabel}
        {resendFailedLabel}
      </span>
    );
  }

  handleClick(e) {
    e.preventDefault();
    resendEmail(l.id(this.props.lock));
  }
}

export default class EmailSentConfirmation extends React.Component {
  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;
    const labels = {
      failed: i18n.str(lock, 'failedLabel'),
      resend: i18n.str(lock, 'resendLabel'),
      resending: i18n.str(lock, 'resendingLabel'),
      retry: i18n.str(lock, 'retryLabel'),
      sent: i18n.str(lock, 'sentLabel')
    };

    return (
      <SuccessPane backHandler={::this.handleBack} closeHandler={closeHandler}>
        <p>{i18n.html(lock, ['success', 'magicLink'], c.email(lock))}</p>
        <Resend labels={labels} lock={lock} />
      </SuccessPane>
    );
  }

  handleBack() {
    restart(l.id(this.props.lock));
  }

  handleClose() {
    closeLock(l.id(this.props.lock));
  }
}

export function renderEmailSentConfirmation(lock, props = {}) {
  props.key = 'auxiliarypane';
  props.lock = lock;

  return m.passwordlessStarted(lock) ? <EmailSentConfirmation {...props} /> : null;
}
