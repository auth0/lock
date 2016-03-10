import React from 'react';
import CSSCore from 'fbjs/lib/CSSCore';
import Chrome from './chrome';
import Icon from '../icon/icon';
import { CloseButton } from './button';
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
    if (this.props.isModal) {
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
    const { closeHandler, isSubmitting, lock } = this.props;
    if (!isSubmitting) {
      closeHandler(l.id(lock));
    }
  }

  handleEsc() {
    const { closeHandler, escHandler, lock } = this.props;
    escHandler ? escHandler(l.id(lock)) : this.handleClose();
  }

  hide() {
    CSSCore.removeClass(this.refs.container, "auth0-lock-opened");
  }

  render() {
    const {
      auxiliaryPane,
      backHandler,
      closeHandler,
      contentRender,
      disallowClose,
      footerText,
      globalError,
      globalSuccess,
      gravatar, // TODO: should be named "avatar" and point to the avatar url
      headerText,
      icon,
      isMobile, // TODO: not documented and should be removed (let the design team know first)
      isModal,
      isSubmitting,
      lock,
      primaryColor,
      screenName,
      submitHandler,
      tabs,
      transitionName
    } = this.props;

    const overlay = isModal ? <div className="auth0-lock-overlay"/> : null;

    let className = "auth0-lock";
    if (!isModal) {
      className += " auth0-lock-opened-in-frame";
    }

    if (isMobile) {
      className += " auth0-lock-mobile";
    }

    if (isSubmitting) {
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
            {closeHandler && <CloseButton onClick={::this.handleClose} />}
            <div className="auth0-lock-widget-container">
              <Chrome
                auxiliaryPane={auxiliaryPane}
                backHandler={backHandler}
                contentRender={contentRender}
                footerText={footerText}
                globalError={globalError}
                globalSuccess={globalSuccess}
                gravatar={gravatar}
                headerText={headerText}
                icon={icon}
                isSubmitting={isSubmitting}
                screenName={screenName}
                lock={lock}
                primaryColor={primaryColor}
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
  closeHandler: React.PropTypes.func,
  contentRender: React.PropTypes.func.isRequired,
  footerText: React.PropTypes.element,
  globalError: React.PropTypes.string,
  globalSuccess: React.PropTypes.string,
  gravatar: React.PropTypes.object,
  headerText: React.PropTypes.element,
  icon: React.PropTypes.string.isRequired,
  isMobile: React.PropTypes.bool.isRequired,
  isModal: React.PropTypes.bool.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  lock: React.PropTypes.object.isRequired,
  primaryColor: React.PropTypes.string.isRequired,
  screenName: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.element,
  transitionName: React.PropTypes.string.isRequired
  // escHandler
  // submitHandler,
};

Container.defaultPropTypes = {
  isMobile: false,
  isSubmitting: false
};
