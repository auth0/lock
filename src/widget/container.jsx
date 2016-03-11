import React from 'react';
import CSSCore from 'fbjs/lib/CSSCore';
import Chrome from './chrome';
import { CloseButton } from './button';

const badgeSvg = '<svg width="18px" height="21px" viewBox="0 0 18 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" sketch:type="MSArtboardGroup" transform="translate(-276.000000, -3229.000000)" fill-opacity="0.4" fill="#FFFFFF"><g id="SMS" sketch:type="MSLayerGroup" transform="translate(153.000000, 3207.000000)"><g id="Group" sketch:type="MSShapeGroup"><g id="Header" transform="translate(-0.500000, 0.000000)"><path d="M137.790429,38.4848167 L135.770249,32.1883757 L141.058325,28.2980192 L134.521693,28.2980192 L132.501273,22.001821 L132.500673,22.0001214 L139.038385,22.0001214 L141.059165,28.2974122 L141.059165,28.2972908 L141.060843,28.2963196 C142.234586,31.9495762 141.025835,36.1047125 137.790429,38.4848167 L137.790429,38.4848167 L137.790429,38.4848167 Z M127.211877,38.4848167 L127.210199,38.4860307 L132.499714,42.3773585 L137.790429,38.4849381 L132.501393,34.593489 L127.211877,38.4848167 L127.211877,38.4848167 Z M123.942542,28.296441 L123.942542,28.296441 C122.707175,32.147463 124.141203,36.2280579 127.210798,38.4855451 L127.211278,38.4836027 L129.231698,32.1875259 L123.9447,28.2978978 L130.479774,28.2978978 L132.500314,22.0016996 L132.500793,22 L125.962722,22 L123.942542,28.296441 L123.942542,28.296441 Z" id="Shape"></path></g></g></g></g></g></svg>';

const BottomBadge = () => (
  <span className="auth0-lock-badge-bottom">
    <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge">
      <span dangerouslySetInnerHTML={{__html: badgeSvg}} />
    </a>
  </span>
);

const Avatar = ({imageUrl}) => (
  <img src={imageUrl} className="auth0-lock-header-avatar" />
);

Avatar.propTypes = {
  imageUrl: React.PropTypes.string.isRequired
}

class EscKeyDownHandler {

  constructor(f) {
    this.handler = (e) => {
      if (e.keyCode == 27 && e.target.tagName != "INPUT") {
        f();
      }
    };
    global.document.addEventListener('keydown', this.handler, false);
  }

  release() {
    global.document.removeEventListener('keydown', this.handler);
  }

}


export default class Container extends React.Component {
  componentDidMount() {
    if (this.props.isModal) {
      setTimeout(() => CSSCore.addClass(
        this.refs.container,
        "auth0-lock-opened"
      ), 17);
    }

    this.escKeydown = new EscKeyDownHandler(::this.handleEsc);
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { lock, submitHandler } = this.props;
    if (submitHandler) {
      submitHandler();
    }
  }

  handleClose() {
    const { closeHandler, isSubmitting, lock } = this.props;
    if (!isSubmitting) {
      closeHandler();
    }
  }

  handleEsc() {
    const { closeHandler, escHandler, lock } = this.props;
    escHandler ? escHandler() : this.handleClose();
  }

  hide() {
    CSSCore.removeClass(this.refs.container, "auth0-lock-opened");
  }

  render() {
    const {
      avatar,
      auxiliaryPane,
      backHandler,
      closeHandler,
      contentRender,
      disallowClose,
      footerText,
      globalError,
      globalSuccess,
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
      title,
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
            {avatar && <Avatar imageUrl={avatar} />}
            {closeHandler && <CloseButton onClick={::this.handleClose} />}
            <div className="auth0-lock-widget-container">
              <Chrome
                avatar={avatar}
                auxiliaryPane={auxiliaryPane}
                backHandler={backHandler}
                contentRender={contentRender}
                footerText={footerText}
                globalError={globalError}
                globalSuccess={globalSuccess}
                headerText={headerText}
                icon={icon}
                isSubmitting={isSubmitting}
                screenName={screenName}
                lock={lock}
                primaryColor={primaryColor}
                showSubmitButton={!!submitHandler}
                tabs={tabs}
                title={title}
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
  avatar: React.PropTypes.string,
  auxiliaryPane: React.PropTypes.element,
  backHandler: React.PropTypes.func,
  closeHandler: React.PropTypes.func,
  contentRender: React.PropTypes.func.isRequired,
  footerText: React.PropTypes.element,
  globalError: React.PropTypes.string,
  globalSuccess: React.PropTypes.string,
  headerText: React.PropTypes.element,
  icon: React.PropTypes.string.isRequired,
  isMobile: React.PropTypes.bool.isRequired,
  isModal: React.PropTypes.bool.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  lock: React.PropTypes.object.isRequired,
  primaryColor: React.PropTypes.string.isRequired,
  screenName: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.element,
  title: React.PropTypes.string.isRequired,
  transitionName: React.PropTypes.string.isRequired
  // escHandler
  // submitHandler,
};

Container.defaultProps = {
  icon: "//cdn.auth0.com/styleguide/1.0.0/img/badge.png",
  isMobile: false,
  isSubmitting: false,
  primaryColor: "#ea5323"
};
