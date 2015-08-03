import React from 'react/addons';
import Avatar from './avatar';
import SubmitButton from './submit_button';
import Header from '../header/header';
import CloseButton from '../header/close_button';
import GlobalError from './global_error';
import * as l from './index';
import * as g from '../gravatar/index';
const ui = l.ui;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class Lock extends React.Component {
  // componentDidMount() {
  //   setTimeout(() => { this.refs.lock.getDOMNode().className += ' opened' }, 10);
  // }
  //
  render() {
    const { completed, lock, submitHandler } = this.props;
    const Content = this.props.content;
    const Confirmation = this.props.confirmation || null;

    const overlay = ui.appendContainer(lock) ?
      <div className="auth0-lock-overlay"/> : null;

    const icon = ui.icon(lock);
    const showCloseButton = ui.closable(lock);
    const globalError = l.globalError(lock);
    const gravatar = l.gravatar(lock);


    const disableSubmit = l.submitting(lock);

    let className = "auth0-lock";
    if (lock.get("show")) {
      className += " opened";
    }
    if (l.submitting(lock)) {
      className += " auth0-lock-mode-loading";
    } else if (completed) {
      className += " auth0-lock-mode-completed";
    }

    let backgroundUrl, name;
    if (gravatar) {
      backgroundUrl = gravatar.get("imageUrl");
      name = gravatar.get("displayName")
    } else {
      backgroundUrl = icon;
      name = "";
    }

    return (
      <div className={className} ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {gravatar && <Avatar imageUrl={g.imageUrl(gravatar)} />}
            {showCloseButton && <CloseButton lockID={l.id(lock)} />}
            <div className="auth0-lock-widget-container">
              <Header name={name} backgroundUrl={backgroundUrl} logoUrl={icon}/>
              {globalError && <GlobalError message={globalError} />}
              <div className="auth0-lock-content">
                <this.props.content lock={lock} />
              </div>
              <SubmitButton disabled={disableSubmit} />
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
