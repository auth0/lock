import React from 'react';
import CSSCore from 'fbjs/lib/CSSCore';
import Chrome from './chrome';
import Icon from '../icon/icon';
import IconButton from '../icon/button';
import * as l from '../lock/index';
import * as g from '../gravatar/index';
import EscKeydownUtils from '../utils/esc_keydown_utils';

const BottomBadge = () => (
  <span className="auth0-lock-badge-bottom">
    <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge">
      <Icon name="badge" />
    </a>
  </span>
);

const Avatar = ({imageUrl}) => (
  <img src={imageUrl} className="auth0-lock-header-avatar" />
);

Avatar.propTypes = {
  imageUrl: React.PropTypes.string.isRequired
}

export default class Container extends React.Component {
  componentDidMount() {
    if (l.ui.appendContainer(this.props.lock)) {
      setTimeout(() => CSSCore.addClass(
        this.refs.container,
        "auth0-lock-opened"
      ), 17);
    }

    this.escKeydown = new EscKeydownUtils(() => this.handleEsc());
  }

  componentWillUnmount() {
    this.escKeydown.release();
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
      submitHandler,
      tabs,
      transitionName
    } = this.props;

    const overlay = l.ui.appendContainer(lock) ?
      <div className="auth0-lock-overlay"/> : null;

    const gravatar = l.gravatar(lock);
    const showCloseButton = l.ui.closable(lock) && !disallowClose;

    let className = "auth0-lock";
    if (!l.ui.appendContainer(lock)) {
      className += " auth0-lock-opened-in-frame";
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
      <div className={className} ref="container">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {gravatar && <Avatar imageUrl={g.imageUrl(gravatar)} />}
            {showCloseButton && <IconButton name="close" onClick={::this.handleClose} />}
            <div className="auth0-lock-widget-container">
              <Chrome
                auxiliaryPane={auxiliaryPane}
                backHandler={backHandler}
                contentRender={contentRender}
                footerText={footerText}
                headerText={headerText}
                screenName={screenName}
                lock={lock}
                showSubmitButton={!!submitHandler}
                tabs={tabs}
                transitionName={transitionName}
              />
            </div>
          </form>
          <BottomBadge />
        </div>
      </div>
    );
  }

}

Container.propTypes = {
  auxiliaryPane: React.PropTypes.element,
  backHandler: React.PropTypes.func,
  contentRender: React.PropTypes.func.isRequired,
  footerText: React.PropTypes.element,
  headerText: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  screenName: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.element,
  transitionName: React.PropTypes.string.isRequired
  // closeHandler,
  // disallowClose,
  // escHandler
  // submitHandler,
};
