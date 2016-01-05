import React from 'react';
import ConfirmationPane from '../lock/confirmation_pane';
import Icon from '../icon/icon';
import { closeLock } from '../lock/actions';
import * as l from '../lock/index';
import * as c from '../cred/index';

import { resendEmail, reset } from './actions';
import * as m from './index';


class ResendLink extends React.Component {
  render() {
    const { label, onClick } = this.props;
    return(
      <a className="auth0-lock-resend-link" href="#" onClick={onClick}>
        {label} <Icon name="retry" />
      </a>
    );
  }
}

class Resend extends React.Component {
  render() {
    const { labels, lock } = this.props;

    const resendLink = m.resendAvailable(lock) &&
      <ResendLink onClick={::this.handleClick}
        label={m.resendFailed(lock) ? labels.retry : labels.resend} />;

    const resendingLabel = m.resendOngoing(lock) &&
      <a className="auth0-lock-resend-link">{labels.resending}</a>;

    const resendSuccessLabel = m.resendSuccess(lock) &&
      <span className="auth0-lock-sent-label">{labels.sent}</span>;

    const resendFailedLabel = m.resendFailed(lock) &&
      <span className="auth0-lock-sent-failed-label">{labels.failed}</span>;

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
      failed: this.t(["failedLabel"]),
      resend: this.t(["resendLabel"]),
      resending: this.t(["resendingLabel"]),
      retry: this.t(["retryLabel"]),
      sent: this.t(["sentLabel"])
    };

    return (
      <ConfirmationPane backHandler={::this.handleBack} closeHandler={closeHandler}>
        <p>{this.t(["success"], {email: c.email(lock)})}</p>
        <Resend labels={labels} lock={lock}/>
      </ConfirmationPane>
    )
  }

  handleBack() {
    reset(l.id(this.props.lock), {clearCred: []});
  }

  handleClose() {
    closeLock(l.id(this.props.lock));
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["emailSent"].concat(keyPath), params);
  }

}

export function renderEmailSentConfirmation(lock, props = {}) {
  props.key = "auxiliarypane";
  props.lock = lock;

  return m.passwordlessStarted(lock)
    ? <EmailSentConfirmation {...props} />
    : null;
}
