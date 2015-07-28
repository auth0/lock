import React from 'react';
import SubmitButton from './submit_button';
import Header from '../header/header';
import CloseButton from '../header/close_button';
import GlobalError from './global_error';
import { ui } from './index';

export default class Lock extends React.Component {
  componentDidMount() {
    setTimeout(() => { this.refs.lock.getDOMNode().className += ' opened' }, 10);
  }

  render() {
    const { lock, submitHandler } = this.props;
    const Content = this.props.content;
    const Confirmation = this.props.confirmation || null;

    const overlay = ui.appendContainer(lock) ?
      <div className="auth0-lock-overlay"/> : null;

    const icon = ui.icon(lock) || ""; // TODO: figure out if we still need the default and why, so we can remove it
    const showCloseButton = ui.closable(lock);
    const globalError = lock.get("globalError");
    const gravatar = ui.gravatar(lock) && lock.get("gravatar");

    const disableSubmit = lock.get("submitting");
    const showSubmit = !!submitHandler;
    const submit = showSubmit ? <SubmitButton disabled={disableSubmit} /> : null;

    return (
      <div className="auth0-lock" ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {showCloseButton && <CloseButton lockID={lock.get("id")} />}
            <div className="auth0-lock-widget-container">
              <Header icon={icon} gravatar={gravatar}/>
              {globalError && <GlobalError message={globalError} />}
              <div className="auth0-lock-content">
                <this.props.content lock={lock} />
              </div>
              {submit}
              <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
            </div>
            {Confirmation && <Confirmation lock={lock} />}
          </form>
        </div>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    const { lock, submitHandler } = this.props;
    if (submitHandler) {
      submitHandler(lock);
    }
  }
}

Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};
