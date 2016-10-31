import React from 'react';
import Chrome from './chrome';
import { CloseButton } from './button';

const badgeSvg = (
  <svg width="58px" height="21px" viewBox="0 0 462 168"><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="logo-grey-horizontal"><g id="Group"><g id="LogoText" transform="translate(188.000000, 41.500000)" fill="#D0D2D3"><path d="M246.517,0.11 C238.439,0.11 231.607,3.916 226.759,11.115 C221.94,18.271 219.393,28.26 219.393,40 C219.393,51.74 221.94,61.729 226.759,68.884 C231.607,76.084 238.439,79.889 246.517,79.889 C254.595,79.889 261.427,76.084 266.275,68.884 C271.093,61.729 273.64,51.74 273.64,40 C273.64,28.26 271.093,18.271 266.275,11.115 C261.427,3.916 254.595,0.11 246.517,0.11 L246.517,0.11 Z M246.517,70.005 C242.655,70.005 239.604,67.82 237.187,63.324 C234.268,57.893 232.66,49.61 232.66,40 C232.66,30.39 234.268,22.106 237.187,16.676 C239.604,12.18 242.655,9.994 246.517,9.994 C250.378,9.994 253.43,12.18 255.847,16.676 C258.766,22.106 260.373,30.389 260.373,40 C260.373,49.611 258.766,57.895 255.847,63.324 C253.43,67.82 250.378,70.005 246.517,70.005 L246.517,70.005 Z M71.45,29.172 L71.45,63.484 C71.45,72.53 78.81,79.889 87.856,79.889 C95.746,79.889 101.707,75.975 103.902,74.291 C104.024,74.197 104.184,74.169 104.331,74.216 C104.478,74.263 104.592,74.379 104.637,74.527 L105.961,78.86 L115.737,78.86 L115.737,29.172 L103.175,29.172 L103.175,66.326 C103.175,66.501 103.076,66.662 102.921,66.743 C100.559,67.961 95.899,70.006 91.231,70.006 C87.252,70.006 84.012,66.768 84.012,62.787 L84.012,29.172 L71.45,29.172 L71.45,29.172 Z M197.237,78.859 L209.8,78.859 L209.8,44.547 C209.8,35.501 202.44,28.141 193.394,28.141 C186.735,28.141 181.393,31.004 178.802,32.71 C178.657,32.805 178.473,32.813 178.322,32.731 C178.171,32.649 178.075,32.491 178.075,32.318 L178.075,1.141 L165.513,1.141 L165.513,78.859 L178.075,78.859 L178.075,41.704 C178.075,41.529 178.174,41.368 178.33,41.288 C180.691,40.069 185.352,38.025 190.019,38.025 C191.947,38.025 193.76,38.776 195.123,40.139 C196.486,41.502 197.236,43.316 197.236,45.243 L197.236,78.859 L197.237,78.859 Z M124.792,39.055 L132.438,39.055 C132.697,39.055 132.907,39.265 132.907,39.524 L132.907,66.858 C132.907,74.043 138.753,79.888 145.938,79.888 C148.543,79.888 151.113,79.512 153.585,78.77 L153.585,69.796 C152.143,69.923 150.485,70.005 149.313,70.005 C147.193,70.005 145.469,68.28 145.469,66.161 L145.469,39.523 C145.469,39.264 145.679,39.054 145.938,39.054 L153.585,39.054 L153.585,29.171 L145.938,29.171 C145.679,29.171 145.469,28.961 145.469,28.702 L145.469,12.295 L132.907,12.295 L132.907,28.702 C132.907,28.961 132.697,29.171 132.438,29.171 L124.792,29.171 L124.792,39.055 L124.792,39.055 Z M51.361,78.859 L64.429,78.859 L44.555,9.55 C42.962,3.992 37.811,0.11 32.029,0.11 C26.247,0.11 21.096,3.992 19.502,9.55 L-0.372,78.859 L12.697,78.859 L18.449,58.798 C18.507,58.597 18.691,58.459 18.9,58.459 L45.158,58.459 C45.367,58.459 45.552,58.597 45.609,58.798 L51.361,78.859 L51.361,78.859 Z M42.056,48.576 L22.004,48.576 C21.857,48.576 21.718,48.507 21.629,48.388 C21.541,48.272 21.513,48.119 21.553,47.978 L31.579,13.012 C31.637,12.811 31.821,12.673 32.03,12.673 C32.239,12.673 32.423,12.811 32.48,13.012 L42.507,47.978 C42.547,48.12 42.519,48.272 42.43,48.388 C42.342,48.507 42.203,48.576 42.056,48.576 L42.056,48.576 Z" id="Shape"/></g><g id="LogoBadge" fillOpacity="0.4" fill="#FFFFFF"><path d="M119.555,135.861 L102.705,83.997 L146.813,51.952 L92.291,51.952 L75.44,0.09 L75.435,0.076 L129.965,0.076 L146.82,51.947 L146.821,51.946 L146.835,51.938 C156.623,82.03 146.542,116.256 119.555,135.861 L119.555,135.861 Z M31.321,135.861 L31.307,135.871 L75.426,167.924 L119.555,135.862 L75.44,103.808 L31.321,135.861 L31.321,135.861 Z M4.052,51.939 L4.052,51.939 C-6.252,83.66 5.709,117.272 31.312,135.867 L31.316,135.851 L48.168,83.99 L4.07,51.951 L58.579,51.951 L75.431,0.089 L75.435,0.075 L20.902,0.075 L4.052,51.939 L4.052,51.939 Z" id="Shape"/></g></g></g></g></svg>
);

const BottomBadge = ({link}) => (
  <span className="auth0-lock-badge-bottom">
    <a href={link} target="_blank" className="auth0-lock-badge">
      Protected with {badgeSvg}
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
      if (e.keyCode == 27 && e.target.tagName.toUpperCase() != "INPUT") {
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

    if (this.props.closeHandler) {
      this.escKeydown = new EscKeyDownHandler(::this.handleEsc);
    }
  }

  componentWillUnmount() {
    if (this.escKeydown) {
      this.escKeydown.release();
    }
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
      submitButtonLabel,
      submitHandler,
      success,
      tabs,
      terms,
      title,
      transitionName
    } = this.props;

    const badge = showBadge
      ? <BottomBadge link={badgeLink} />
      : null;

    const overlay = isModal
      ? <div className="auth0-lock-overlay">{badge}</div>
      : null;

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
                submitButtonLabel={submitButtonLabel}
                success={success}
                tabs={tabs}
                terms={terms}
                title={title}
                transitionName={transitionName}
              />
            </div>
          </form>
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
  submitButtonLabel: React.PropTypes.string,
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
