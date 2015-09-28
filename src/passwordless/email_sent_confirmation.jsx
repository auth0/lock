import React from 'react';
import ConfirmationPane from '../lock/confirmation_pane';
import { close, resendEmail, reset } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';
import * as m from './index';


class RetryIcon extends React.Component {
  render() {
    const svgTag = '<svg height="32px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M27.877,19.662c0.385-1.23,0.607-2.531,0.607-3.884c0-7.222-5.83-13.101-13.029-13.194v4.238    c4.863,0.093,8.793,4.071,8.793,8.956c0,0.678-0.088,1.332-0.232,1.966l-3.963-1.966l2.76,8.199l8.197-2.762L27.877,19.662z"></path> <path d="M7.752,16.222c0-0.678,0.088-1.332,0.232-1.967l3.963,1.967l-2.76-8.199L0.99,10.785l3.133,1.553    c-0.384,1.23-0.607,2.531-0.607,3.885c0,7.223,5.83,13.1,13.03,13.194v-4.238C11.682,25.086,7.752,21.107,7.752,16.222z"></path> </svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} />;
  }
}

class ResendLink extends React.Component {
  render() {
    const { label, onClick } = this.props;
    return(
      <a className="auth0-lock-resend-link" href="" onClick={onClick}>
        {label} <RetryIcon />
      </a>
    );
  }
}

class Resend extends React.Component {
  render() {
    const { lock } = this.props;

    const resendLink = m.resendAvailable(lock) &&
      <ResendLink onClick={::this.handleClick}
        label={this.t([m.resendFailed(lock) ? "retryLabel" : "resendLabel"])} />;

    const resendingLabel = m.resendOngoing(lock) &&
      <a className="auth0-lock-resend-link">{this.t(["resendingLabel"])}</a>;

    const resendSuccessLabel = m.resendSuccess(lock) &&
      <span className="auth0-lock-sent-label">{this.t(["sentLabel"])}</span>;

    const resendFailedLabel = m.resendFailed(lock) &&
      <span className="auth0-lock-sent-failed-label">{this.t(["failedLabel"])}</span>;

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

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["confirmation"].concat(keyPath), params);
  }
}

export default class EmailSentConfirmation extends React.Component {
  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <ConfirmationPane backHandler={::this.handleBack} closeHandler={closeHandler}>
        <p>{this.t(["success"], {email: c.email(lock)})}</p>
        <Resend lock={lock}/>
      </ConfirmationPane>
    )
  }

  handleBack() {
    reset(l.id(this.props.lock), {clearCred: []});
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["confirmation"].concat(keyPath), params);
  }
}
