import React from 'react';
import Chrome from './chrome';
import { CloseButton } from './button';

const badgeSvg = '<svg width="18px" height="21px" viewBox="0 0 18 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" sketch:type="MSArtboardGroup" transform="translate(-276.000000, -3229.000000)" fill-opacity="0.4" fill="#FFFFFF"><g id="SMS" sketch:type="MSLayerGroup" transform="translate(153.000000, 3207.000000)"><g id="Group" sketch:type="MSShapeGroup"><g id="Header" transform="translate(-0.500000, 0.000000)"><path d="M137.790429,38.4848167 L135.770249,32.1883757 L141.058325,28.2980192 L134.521693,28.2980192 L132.501273,22.001821 L132.500673,22.0001214 L139.038385,22.0001214 L141.059165,28.2974122 L141.059165,28.2972908 L141.060843,28.2963196 C142.234586,31.9495762 141.025835,36.1047125 137.790429,38.4848167 L137.790429,38.4848167 L137.790429,38.4848167 Z M127.211877,38.4848167 L127.210199,38.4860307 L132.499714,42.3773585 L137.790429,38.4849381 L132.501393,34.593489 L127.211877,38.4848167 L127.211877,38.4848167 Z M123.942542,28.296441 L123.942542,28.296441 C122.707175,32.147463 124.141203,36.2280579 127.210798,38.4855451 L127.211278,38.4836027 L129.231698,32.1875259 L123.9447,28.2978978 L130.479774,28.2978978 L132.500314,22.0016996 L132.500793,22 L125.962722,22 L123.942542,28.296441 L123.942542,28.296441 Z" id="Shape"></path></g></g></g></g></g></svg>';

const BottomBadge = ({link}) => (
  <span className="auth0-lock-badge-bottom">
    <a href={link} target="_blank" className="auth0-lock-badge">
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


const IPHONE = global.navigator
  && !!global.navigator.userAgent.match(/iPhone/i);

export default class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isOpen: false};
  }

  componentDidMount() {
    if (this.props.isModal) {
      setTimeout(() => this.setState({isOpen: true}), 17);
    }

    this.escKeydown = new EscKeyDownHandler(::this.handleEsc);
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { submitHandler } = this.props;
    if (submitHandler) {
      setTimeout(() => {
        if (!this.props.isSubmitting) {
          this.refs.chrome.focusError();
        }
      }, 17);
      submitHandler();
    }
  }

  handleClose() {
    const { closeHandler, isSubmitting } = this.props;
    if (!isSubmitting) {
      closeHandler();
    }
  }

  handleEsc() {
    const { closeHandler, escHandler } = this.props;
    escHandler ? escHandler() : this.handleClose();
  }

  hide() {
    this.setState({isOpen: false});
  }

  render() {
    const {
      autofocus,
      avatar,
      auxiliaryPane,
      backHandler,
      badgeLink,
      closeHandler,
      contentComponent,
      contentProps,
      disableSubmitButton,
      disallowClose,
      error,
      isMobile, // TODO: not documented and should be removed (let the design team know first)
      isModal,
      isSubmitting,
      logo,
      primaryColor,
      screenName,
      showBadge,
      submitHandler,
      success,
      tabs,
      terms,
      title,
      transitionName
    } = this.props;

    const overlay = isModal ? <div className="auth0-lock-overlay"/> : null;

    let className = "auth0-lock";

    if (isModal && this.state.isOpen) {
      className += " auth0-lock-opened"
    }

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

    if (!submitHandler) {
      className += " auth0-lock-no-submit";
    }

    if (terms) {
      className += " auth0-lock-with-terms";
    }

    if (IPHONE) {
      className += " auth0-lock-iphone";
    }

    // TODO: this no longer makes sense, instead of taking a tabs
    // prop we should take extra class names.
    if (tabs) {
      className += " auth0-lock-with-tabs";
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
                autofocus={autofocus}
                avatar={avatar}
                auxiliaryPane={auxiliaryPane}
                backHandler={backHandler}
                contentComponent={contentComponent}
                contentProps={contentProps}
                disableSubmitButton={disableSubmitButton}
                error={error}
                isSubmitting={isSubmitting}
                logo={logo}
                screenName={screenName}
                primaryColor={primaryColor}
                ref="chrome"
                showSubmitButton={!!submitHandler}
                success={success}
                tabs={tabs}
                terms={terms}
                title={title}
                transitionName={transitionName}
              />
            </div>
          </form>
          <div style={{ visibility: showBadge ? "visible" : "hidden" }}>
            <BottomBadge link={badgeLink} />
          </div>
        </div>
      </div>
    );
  }

}

Container.propTypes = {
  autofocus: React.PropTypes.bool.isRequired,
  avatar: React.PropTypes.string,
  auxiliaryPane: React.PropTypes.element,
  backHandler: React.PropTypes.func,
  badgeLink: React.PropTypes.string.isRequired,
  closeHandler: React.PropTypes.func,
  contentComponent: React.PropTypes.func.isRequired, // TODO: it also can be a class component
  contentProps: React.PropTypes.object.isRequired,
  disableSubmitButton: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  isMobile: React.PropTypes.bool.isRequired,
  isModal: React.PropTypes.bool.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  logo: React.PropTypes.string.isRequired,
  primaryColor: React.PropTypes.string.isRequired,
  screenName: React.PropTypes.string.isRequired,
  showBadge: React.PropTypes.bool.isRequired,
  success: React.PropTypes.string,
  tabs: React.PropTypes.bool,
  terms: React.PropTypes.element,
  title: React.PropTypes.string.isRequired,
  transitionName: React.PropTypes.string.isRequired
  // escHandler
  // submitHandler,
};

// NOTE: detecting the file protocol is important for things like electron.
const isFileProtocol = global.window
  && global.window.location
  && global.window.location.protocol === "file:";

export const defaultProps = Container.defaultProps = {
  autofocus: false,
  badgeLink: "https://auth0.com/",
  contentProps: {},
  disableSubmitButton: false,
  isMobile: false,
  isSubmitting: false,
  logo: `${isFileProtocol ? "https:" : ""}//cdn.auth0.com/styleguide/1.0.0/img/badge.png`,
  primaryColor: "#ea5323",
  showBadge: true

};
