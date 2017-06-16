import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import MultisizeSlide from './multisize_slide';
import GlobalMessage from './global_message';
import * as l from '../../core/index';
import Header from './header';

const submitSvg =
  '<svg focusable="false" width="43px" height="42px" viewBox="0 0 43 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" sketch:type="MSArtboardGroup" transform="translate(-280.000000, -3592.000000)"><g id="SMS" sketch:type="MSLayerGroup" transform="translate(153.000000, 3207.000000)"><g id="Group" sketch:type="MSShapeGroup"><g id="Login" transform="translate(0.000000, 369.000000)"><g id="Btn"><g id="Oval-302-+-Shape" transform="translate(128.000000, 17.000000)"><circle id="Oval-302" stroke="#FFFFFF" stroke-width="2" cx="20.5" cy="20" r="20"></circle><path d="M17.8,15.4 L19.2,14 L25.2,20 L19.2,26 L17.8,24.6 L22.4,20 L17.8,15.4 Z" id="Shape" fill="#FFFFFF"></path></g></g></g></g></g></g></g></svg>';
const submitText =
  '<svg focusable="false" class="icon-text" width="8px" height="12px" viewBox="0 0 8 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Web/Submit/Active" transform="translate(-148.000000, -32.000000)" fill="#FFFFFF"><polygon id="Shape" points="148 33.4 149.4 32 155.4 38 149.4 44 148 42.6 152.6 38"></polygon></g></g></svg>';

class SubmitButton extends React.Component {
  handleSubmit() {
    const { label, screenName, contentProps } = this.props;
    const { model } = contentProps;

    if (screenName === 'main.signUp') {
      l.emitEvent(model, 'signup submit');
    } else if (screenName === 'main.login') {
      l.emitEvent(model, 'signin submit');
    } else if (screenName === 'forgotPassword') {
      l.emitEvent(model, 'forgot_password submit');
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(label, screenName);
    }
  }

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  render() {
    const { color, disabled, label } = this.props;
    const content = label
      ? <span className="auth0-label-submit">
          {label}
          <span dangerouslySetInnerHTML={{ __html: submitText }} />
        </span>
      : <span dangerouslySetInnerHTML={{ __html: submitSvg }} />;

    return (
      <button
        className="auth0-lock-submit"
        disabled={disabled}
        style={{ backgroundColor: color }}
        onClick={::this.handleSubmit}
        type="submit"
      >
        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
        {content}
      </button>
    );
  }
}

SubmitButton.propTypes = {
  color: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  screenName: PropTypes.string,
  onSubmit: PropTypes.func,
  contentProps: PropTypes.object
};

const MESSAGE_ANIMATION_DURATION = 250;
const AUXILIARY_ANIMATION_DURATION = 350;

export default class Chrome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moving: false, reverse: false };
  }

  componentWillReceiveProps(nextProps) {
    const { auxiliaryPane, showSubmitButton } = this.props;
    const { delayingShowSubmitButton } = this.state;

    if (!showSubmitButton && nextProps.showSubmitButton && !delayingShowSubmitButton) {
      this.setState({ delayingShowSubmitButton: true });
    }

    if (!auxiliaryPane && nextProps.auxiliaryPane) {
      this.auxiliaryPaneTriggerInput = global.document.activeElement;
      this.setState({ moving: true });
    }

    if (auxiliaryPane && !nextProps.auxiliaryPane) {
      // TODO clear timeout
      setTimeout(() => this.setState({ moving: false }), AUXILIARY_ANIMATION_DURATION + 50);
    }
  }

  componentDidUpdate(prevProps) {
    const { autofocus, auxiliaryPane, error, screenName } = this.props;

    if (!autofocus) return;

    if (auxiliaryPane && !prevProps.auxiliaryPane) {
      const input = this.findAutofocusInput(this.refs.auxiliary);

      if (input) {
        // TODO clear timeout
        setTimeout(() => input.focus(), AUXILIARY_ANIMATION_DURATION);
      }

      return;
    }

    if (!auxiliaryPane && prevProps.auxiliaryPane) {
      if (this.auxiliaryPaneTriggerInput) {
        // TODO clear timeout
        setTimeout(() => this.auxiliaryPaneTriggerInput.focus(), AUXILIARY_ANIMATION_DURATION);
      }

      return;
    }

    if (screenName !== prevProps.screenName) {
      const input = this.findAutofocusInput();

      if (input) {
        if (this.mainScreenName(prevProps.screenName) !== this.mainScreenName()) {
          this.inputToFocus = input;
        } else {
          // TODO clear timeout
          setTimeout(() => input.focus(), 17);
        }
      }
    }
  }

  onWillSlide() {
    this.setState({ moving: true });
    this.sliding = true;
  }

  onDidSlide() {
    this.sliding = false;
    this.setState({ reverse: false });
  }

  onDidAppear() {
    this.setState({ moving: false });
    if (this.state.delayingShowSubmitButton) {
      this.setState({ delayingShowSubmitButton: false });
    }

    if (this.inputToFocus) {
      this.inputToFocus.focus();
      delete this.inputToFocus;
    }
  }

  mainScreenName(str) {
    return (str || this.props.screenName || '').split('.')[0];
  }

  findAutofocusInput(ref) {
    return ReactDOM.findDOMNode(ref || this.refs.screen).querySelector('input');
  }

  focusError() {
    const node = ReactDOM.findDOMNode(this.refs.screen);
    // TODO: make the error input selector configurable via props.
    const error = node.querySelector('.auth0-lock-error input');

    if (error) {
      error.focus();
    }
  }

  render() {
    const {
      avatar,
      auxiliaryPane,
      backHandler,
      contentComponent,
      contentProps,
      disableSubmitButton,
      error,
      isSubmitting,
      logo,
      primaryColor,
      screenName,
      showSubmitButton,
      submitButtonLabel,
      success,
      terms,
      title,
      transitionName,
      scrollGlobalMessagesIntoView
    } = this.props;

    const { delayingShowSubmitButton, moving, reverse } = this.state;

    let backgroundUrl, name;
    if (avatar) {
      backgroundUrl = avatar;
      name = title;
    } else {
      backgroundUrl = logo;
      name = '';
    }

    const submitButton =
      showSubmitButton &&
      !delayingShowSubmitButton &&
      <SubmitButton
        color={primaryColor}
        disabled={disableSubmitButton}
        screenName={screenName}
        contentProps={contentProps}
        key="submit"
        label={submitButtonLabel}
        ref="submit"
      />;

    function wrapGlobalMessage(message) {
      return typeof message === 'string'
        ? React.createElement('span', { dangerouslySetInnerHTML: { __html: message } })
        : message;
    }

    const globalError = error
      ? <GlobalMessage
          key="global-error"
          message={wrapGlobalMessage(error)}
          type="error"
          scrollIntoView={scrollGlobalMessagesIntoView}
        />
      : null;
    const globalSuccess = success
      ? <GlobalMessage
          key="global-success"
          message={wrapGlobalMessage(success)}
          type="success"
          scrollIntoView={scrollGlobalMessagesIntoView}
        />
      : null;

    const Content = contentComponent;

    let className = 'auth0-lock-cred-pane';
    const isQuiet = !moving && !delayingShowSubmitButton;
    className += isQuiet ? ' auth0-lock-quiet' : ' auth0-lock-moving';

    return (
      <div className={className}>
        <Header
          title={title}
          name={name}
          backHandler={backHandler && ::this.handleBack}
          backgroundUrl={backgroundUrl}
          backgroundColor={primaryColor}
          logoUrl={logo}
        />
        <ReactCSSTransitionGroup
          transitionName="global-message"
          transitionEnterTimeout={MESSAGE_ANIMATION_DURATION}
          transitionLeaveTimeout={MESSAGE_ANIMATION_DURATION}
        >
          {globalSuccess}
          {globalError}
        </ReactCSSTransitionGroup>
        <div style={{ position: 'relative' }}>
          <MultisizeSlide
            delay={550}
            onDidAppear={::this.onDidAppear}
            onDidSlide={::this.onDidSlide}
            onWillSlide={::this.onWillSlide}
            transitionName={transitionName}
            reverse={reverse}
          >
            <div key={this.mainScreenName()} className="auth0-lock-view-content">
              <div style={{ position: 'relative' }}>
                <div className="auth0-lock-body-content">
                  <div className="auth0-lock-content">
                    <div className="auth0-lock-form" ref="screen">
                      <Content focusSubmit={::this.focusSubmit} {...contentProps} />
                    </div>
                  </div>
                  {terms && <small className="auth0-lock-terms">{terms}</small>}
                </div>
              </div>
            </div>
          </MultisizeSlide>
        </div>
        {submitButton}
        <ReactCSSTransitionGroup
          ref="auxiliary"
          transitionName="slide"
          transitionEnterTimeout={AUXILIARY_ANIMATION_DURATION}
          transitionLeaveTimeout={AUXILIARY_ANIMATION_DURATION}
        >
          {auxiliaryPane}
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  focusSubmit() {
    this.refs.submit.focus();
  }

  handleBack() {
    if (this.sliding) return;

    const { backHandler } = this.props;
    this.setState({ reverse: true });
    backHandler();
  }
}

Chrome.propTypes = {
  autofocus: PropTypes.bool.isRequired,
  avatar: PropTypes.string,
  auxiliaryPane: PropTypes.element,
  backHandler: PropTypes.func,
  contentComponent: PropTypes.func.isRequired, // TODO: it also can be a class component
  contentProps: PropTypes.object.isRequired,
  disableSubmitButton: PropTypes.bool.isRequired,
  error: PropTypes.node,
  isSubmitting: PropTypes.bool.isRequired,
  logo: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  screenName: PropTypes.string.isRequired,
  showSubmitButton: PropTypes.bool.isRequired,
  submitButtonLabel: PropTypes.string,
  success: PropTypes.node,
  terms: PropTypes.element,
  title: PropTypes.string,
  transitionName: PropTypes.string.isRequired,
  scrollGlobalMessagesIntoView: PropTypes.bool
};

Chrome.defaultProps = {
  autofocus: false,
  disableSubmitButton: false,
  showSubmitButton: true,
  scrollGlobalMessagesIntoView: true
};
