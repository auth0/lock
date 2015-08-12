import React from 'react/addons';
import Avatar from './avatar';
import BackButton from '../header/back_button';
import CloseButton from '../header/close_button';
import CredentialsPane from './credentials_pane';
import * as l from './index';
import * as g from '../gravatar/index';
const ui = l.ui;
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import { closeLock } from './actions';
import EscKeydownUtils from '../utils/esc_keydown_utils';

export default class Lock extends React.Component {
  componentDidMount() {
    this.escKeydown = new EscKeydownUtils(() => closeLock(l.id(this.props.lock)));
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  render() {
    const { backHandler, content, lock, submitHandler, disallowClose } = this.props;

    // TODO: rename confirmation to something more representative: it's an
    // element that needs to be rendered covering the content element.
    const Confirmation = this.props.confirmation || null;

    const overlay = ui.appendContainer(lock) ?
      <div className="auth0-lock-overlay"/> : null;

    const icon = ui.icon(lock);
    const showCloseButton = ui.closable(lock) && !disallowClose;
    const globalError = l.globalError(lock);
    const gravatar = l.gravatar(lock);


    const disableSubmit = l.submitting(lock);

    let className = "auth0-lock";
    if (!l.ui.appendContainer(lock)) {
      className += " opened-in-frame";
    }
    if (lock.get("show")) {
      className += " opened";
    }
    if (l.submitting(lock)) {
      className += " auth0-lock-mode-loading";
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
            {backHandler && <BackButton lockID={l.id(lock)} onClick={backHandler} />}
            <div className="auth0-lock-widget-container">
              <CredentialsPane name={name}
                backgroundUrl={backgroundUrl}
                icon={icon}
                globalError={globalError}
                content={content}
                lock={lock}
                disableSubmit={disableSubmit} />
            </div>
            <ReactCSSTransitionGroup transitionName="slide">
              {Confirmation && <Confirmation key="confirmation" lock={lock} />}
            </ReactCSSTransitionGroup>
            <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
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

// TODO: complete, add defaults (disallowClose: false)
Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};
