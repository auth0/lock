import React from 'react/addons';
import { Map } from 'immutable';
import MultisizeSlide from '../multisize-slide/multisize_slide';
import Avatar from './avatar';
import IconButton from '../icon/button';
import Badge from './auth0_badge';
import * as l from './index';
import * as g from '../gravatar/index';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import { closeLock } from './actions';
import EscKeydownUtils from '../utils/esc_keydown_utils';

export default class Lock extends React.Component {
  componentDidMount() {
    this.escKeydown = new EscKeydownUtils(() => this.handleEsc());
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  render() {
    const { children, closeHandler, isDone, lock, submitHandler, disallowClose } = this.props;

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

    if (l.ui.mobile(lock)) {
      className += " auth0-lock-mobile";
    }

    if (l.submitting(lock)) {
      className += " auth0-lock-mode-loading";
    }

    if (isDone) {
      className += " auth0-lock-complete";
    }

    return (
      <div className={className} ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {gravatar && <Avatar imageUrl={g.imageUrl(gravatar)} />}
            {showCloseButton && <IconButton name="close" onClick={::this.handleClose} />}
            <div className="auth0-lock-widget-container">
              <MultisizeSlide delay={400} transitionName="horizontal-fade">{children}</MultisizeSlide>
            </div>
          </form>
          <span className="auth0-lock-badge-bottom">
            <Badge />
          </span>
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

  handleEsc() {
    const { closeHandler, escHandler, lock } = this.props;
    escHandler ? escHandler(l.id(lock)) : this.handleClose();
  }
}

// TODO: complete, add defaults (disallowClose: false)
Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};
