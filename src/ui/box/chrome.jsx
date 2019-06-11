import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import MultisizeSlide from './multisize_slide';
import GlobalMessage from './global_message';
import * as l from '../../core/index';
import Header from './header';

const submitSvg =
  '<svg aria-hidden="true" focusable="false" width="43px" height="42px" viewBox="0 0 43 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" sketch:type="MSArtboardGroup" transform="translate(-280.000000, -3592.000000)"><g id="SMS" sketch:type="MSLayerGroup" transform="translate(153.000000, 3207.000000)"><g id="Group" sketch:type="MSShapeGroup"><g id="Login" transform="translate(0.000000, 369.000000)"><g id="Btn"><g id="Oval-302-+-Shape" transform="translate(128.000000, 17.000000)"><circle id="Oval-302" stroke="#FFFFFF" stroke-width="2" cx="20.5" cy="20" r="20"></circle><path d="M17.8,15.4 L19.2,14 L25.2,20 L19.2,26 L17.8,24.6 L22.4,20 L17.8,15.4 Z" id="Shape" fill="#FFFFFF"></path></g></g></g></g></g></g></g></svg>';
const submitText =
  '<svg aria-hidden="true" focusable="false" class="icon-text" width="8px" height="12px" viewBox="0 0 8 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Web/Submit/Active" transform="translate(-148.000000, -32.000000)" fill="#FFFFFF"><polygon id="Shape" points="148 33.4 149.4 32 155.4 38 149.4 44 148 42.6 152.6 38"></polygon></g></g></svg>';

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
    } else if (screenName === 'socialOrEmail') {
      l.emitEvent(model, 'socialOrEmail submit');
    } else if (screenName === 'socialOrPhoneNumber') {
      l.emitEvent(model, 'socialOrPhoneNumber submit');
    } else if (screenName === 'vcode') {
      l.emitEvent(model, 'vcode submit');
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(label, screenName);
    }
  }

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  render() {
    const { color, disabled, label, display } = this.props;
    const content = label ? (
      <span className="auth0-label-submit">
        {label}
        <span dangerouslySetInnerHTML={{ __html: submitText }} />
      </span>
    ) : (
      <span dangerouslySetInnerHTML={{ __html: submitSvg }} />
    );

    return (
      <button
        className="auth0-lock-submit"
        disabled={disabled}
        style={{ backgroundColor: color, display }}
        onClick={::this.handleSubmit}
        name="submit"
        type="submit"
        aria-label={label ? label : 'Submit'}
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
      info,
      isSubmitting,
      logo,
      primaryColor,
      screenName,
      showSubmitButton,
      submitButtonLabel,
      success,
      terms,
      title,
      classNames,
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

    const shouldShowSubmitButton = showSubmitButton && !delayingShowSubmitButton;

    function wrapGlobalMessage(message) {
      return typeof message === 'string'
        ? React.createElement('span', { dangerouslySetInnerHTML: { __html: message } })
        : message;
    }

    const globalError = error ? (
      <GlobalMessage
        key="global-error"
        message={wrapGlobalMessage(error)}
        type="error"
        scrollIntoView={scrollGlobalMessagesIntoView}
      />
    ) : null;
    const globalSuccess = success ? (
      <GlobalMessage
        key="global-success"
        message={wrapGlobalMessage(success)}
        type="success"
        scrollIntoView={scrollGlobalMessagesIntoView}
      />
    ) : null;
    const globalInfo = info ? (
      <GlobalMessage
        key="global-info"
        message={wrapGlobalMessage(info)}
        type="info"
        scrollIntoView={scrollGlobalMessagesIntoView}
      />
    ) : null;

    const Content = contentComponent;

    let className = 'auth0-lock-cred-pane';
    const isQuiet = !moving && !delayingShowSubmitButton;
    className += isQuiet ? ' auth0-lock-quiet' : ' auth0-lock-moving';

    return (
      <div className={className}>
        <div className="auth0-lock-cred-pane-internal-wrapper">
          <Header
            title={title}
            name={name}
            backHandler={backHandler && ::this.handleBack}
            backgroundUrl={backgroundUrl}
            backgroundColor={primaryColor}
            logoUrl={logo}
          />
          <div className="auth0-lock-content-wrapper">
            <TransitionGroup>
              <CSSTransition classNames="global-message" timeout={MESSAGE_ANIMATION_DURATION}>
                <div>
                  {globalSuccess}
                  {globalError}
                  {globalInfo}
                </div>
              </CSSTransition>
            </TransitionGroup>
            <div style={{ position: 'relative' }} ref="screen">
              <MultisizeSlide
                delay={550}
                onDidAppear={::this.onDidAppear}
                onDidSlide={::this.onDidSlide}
                onWillSlide={::this.onWillSlide}
                transitionName={classNames}
                reverse={reverse}
              >
                <div key={this.mainScreenName()} className="auth0-lock-view-content">
                  <div style={{ position: 'relative' }}>
                    <div className="auth0-lock-body-content">
                      <div className="auth0-lock-content">
                        <div className="auth0-lock-form">
                          <Content focusSubmit={::this.focusSubmit} {...contentProps} />
                        </div>
                      </div>
                      {terms && <small className="auth0-lock-terms">{terms}</small>}
                    </div>
                  </div>
                </div>
              </MultisizeSlide>
            </div>
          </div>
          {/*
            The submit button should always be included in the DOM.
            Otherwise, password managers will call `form.submit()`,
            which doesn't trigger the `onsubmit` event handler, which
            makes impossible for react to handle the submit event, 
            causing the page to send a POST request to `window.location.href`
            with all the form data.
         */}
          <SubmitButton
            color={primaryColor}
            disabled={disableSubmitButton}
            screenName={screenName}
            contentProps={contentProps}
            label={submitButtonLabel}
            ref={el => (this.submitButton = el)}
            display={shouldShowSubmitButton ? 'block' : 'none'}
          />
          {auxiliaryPane && (
            <TransitionGroup>
              <CSSTransition
                ref="auxiliary"
                classNames="slide"
                timeout={AUXILIARY_ANIMATION_DURATION}
              >
                {auxiliaryPane}
              </CSSTransition>
            </TransitionGroup>
          )}
        </div>
      </div>
    );
  }

  focusSubmit() {
    this.submitButton.focus();
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
  info: PropTypes.node,
  isSubmitting: PropTypes.bool.isRequired,
  logo: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  screenName: PropTypes.string.isRequired,
  showSubmitButton: PropTypes.bool.isRequired,
  submitButtonLabel: PropTypes.string,
  success: PropTypes.node,
  terms: PropTypes.element,
  title: PropTypes.string,
  classNames: PropTypes.string.isRequired,
  scrollGlobalMessagesIntoView: PropTypes.bool
};

Chrome.defaultProps = {
  autofocus: false,
  disableSubmitButton: false,
  showSubmitButton: true,
  scrollGlobalMessagesIntoView: true
};
