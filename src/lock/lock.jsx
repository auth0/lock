import React from 'react';
import { Map } from 'immutable';
import Chrome from './chrome';
import MultisizeSlide from '../multisize-slide/multisize_slide';
import Avatar from './avatar';
import IconButton from '../icon/button';
import Badge from './badge';
import * as l from './index';
import * as g from '../gravatar/index';
import EscKeydownUtils from '../utils/esc_keydown_utils';

export default class Lock extends React.Component {
  componentDidMount() {
    this.escKeydown = new EscKeydownUtils(() => this.handleEsc());
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  render() {
    const {
      auxiliaryPane,
      backHandler,
      closeHandler,
      contentRender,
      disallowClose,
      footerText,
      headerText,
      lock,
      screenName,
      submitHandler
    } = this.props;

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

    if (auxiliaryPane) {
      className += " auth0-lock-auxiliary";
    }

    return (
      <div className={className} ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {gravatar && <Avatar imageUrl={g.imageUrl(gravatar)} />}
            {showCloseButton && <IconButton name="close" onClick={::this.handleClose} />}
            <div className="auth0-lock-widget-container">
              <MultisizeSlide delay={400} transitionName="horizontal-fade">
                <Chrome
                  auxiliaryPane={auxiliaryPane}
                  backHandler={backHandler}
                  contentRender={contentRender}
                  footerText={footerText}
                  headerText={headerText}
                  key={screenName}
                  lock={lock}
                  showSubmitButton={!!submitHandler}
                />
              </MultisizeSlide>
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
      submitHandler(l.id(lock));
    }
  }

  handleClose() {
    const { closeHandler, lock } = this.props;
    if (!l.submitting(lock)) {
      closeHandler(l.id(lock));
    }
  }

  handleEsc() {
    const { closeHandler, escHandler, lock } = this.props;
    escHandler ? escHandler(l.id(lock)) : this.handleClose();
  }
}

Lock.propTypes = {
  auxiliaryPane: React.PropTypes.element,
  backHandler: React.PropTypes.func,
  contentRender: React.PropTypes.func.isRequired,
  footerText: React.PropTypes.element,
  headerText: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  screenName: React.PropTypes.string.isRequired,
  // closeHandler,
  // disallowClose,
  // escHandler
  // submitHandler,
};
