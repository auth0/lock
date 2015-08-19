import React from 'react/addons';
import Avatar from './avatar';
import IconButton from '../icon/button';
import * as l from './index';
import * as g from '../gravatar/index';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import { closeLock } from './actions';
import EscKeydownUtils from '../utils/esc_keydown_utils';

export default class Lock extends React.Component {
  componentDidMount() {
    this.escKeydown = new EscKeydownUtils(() => this.handleClose());
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  render() {
    const { backHandler, closeHandler, mainPane, mainPaneKey, lock, submitHandler, disallowClose } = this.props;

    const overlay = l.ui.appendContainer(lock) ?
      <div className="auth0-lock-overlay"/> : null;

    const gravatar = l.gravatar(lock);
    const showCloseButton = l.ui.closable(lock) && !disallowClose;

    let className = "auth0-lock";
    if (!l.ui.appendContainer(lock)) {
      className += " auth0-lock-opened-in-frame";
    } else if (lock.get("show")) {
      className += " auth0-lock-opened";
    }

    if (l.submitting(lock)) {
      className += " auth0-lock-mode-loading";
    }

    return (
      <div className={className} ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {gravatar && <Avatar imageUrl={g.imageUrl(gravatar)} />}
            {showCloseButton && <IconButton name="close" onClick={::this.handleClose} />}
            {backHandler && <IconButton name="back" onClick={::this.handleBack} />}
            <div className="auth0-lock-widget-container">
              <ReactCSSTransitionGroup transitionName="horizontal-fade">
                <this.props.mainPane key={mainPaneKey} lock={lock} />
              </ReactCSSTransitionGroup>
            </div>
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

  handleClose() {
    const { closeHandler, lock } = this.props;
    closeHandler(l.id(lock));
  }

  handleBack() {
    const { backHandler, lock } = this.props;
    backHandler(lock);
  }
}

// TODO: complete, add defaults (disallowClose: false)
Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};
