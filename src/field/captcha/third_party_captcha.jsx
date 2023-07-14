import { createRef } from '../../utils/createRef';
import React from 'react';
import propTypes from 'prop-types';

const noop = () => {};

const RECAPTCHA_V2_PROVIDER = 'recaptcha_v2';
const RECAPTCHA_ENTERPRISE_PROVIDER = 'recaptcha_enterprise';
const HCAPTCHA_PROVIDER = 'hcaptcha';
const FRIENDLY_CAPTCHA_PROVIDER = 'friendly_captcha';

export const isThirdPartyCaptcha = provider =>
  provider === RECAPTCHA_ENTERPRISE_PROVIDER
  || provider === RECAPTCHA_V2_PROVIDER
  || provider === HCAPTCHA_PROVIDER
  || provider === FRIENDLY_CAPTCHA_PROVIDER;

const getCaptchaProvider = provider => {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return window.grecaptcha;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return window.grecaptcha.enterprise;
    case HCAPTCHA_PROVIDER:
      return window.hcaptcha;
    case FRIENDLY_CAPTCHA_PROVIDER:
      return window.friendlyChallenge;
  }
};

const scriptForProvider = (provider, lang, callback) => {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return `https://www.recaptcha.net/recaptcha/api.js?hl=${lang}&onload=${callback}`;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return `https://www.recaptcha.net/recaptcha/enterprise.js?render=explicit&hl=${lang}&onload=${callback}`;
    case HCAPTCHA_PROVIDER:
      return `https://js.hcaptcha.com/1/api.js?hl=${lang}&onload=${callback}`;
    case FRIENDLY_CAPTCHA_PROVIDER:
      return 'https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.12/widget.min.js';
  }
};

const providerDomPrefix = (provider) => {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return 'recaptcha';
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return 'recaptcha';
    case HCAPTCHA_PROVIDER:
      return 'hcaptcha';
    case FRIENDLY_CAPTCHA_PROVIDER:
      return 'friendly-captcha'
  }
}

export class ThirdPartyCaptcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //this version of react doesn't have React.createRef
    this.ref = createRef();

    this.changeHandler = value => {
      this.setState({ value }, () => {
        this.props.onChange(value);
      });
    };

    this.expiredHandler = () => {
      let value = '';
      this.setState({ value }, () => {
        this.props.onChange(value);
        this.props.onExpired();
      });
    };

    this.erroredHandler = () => {
      let value = '';
      this.setState({ value }, () => {
        this.props.onChange(value);
        this.props.onErrored();
      });
    };
  }

  static loadScript(props, element = document.body, callback = noop) {
    const callbackName = `${providerDomPrefix(props.provider)}Callback_${Math.floor(Math.random() * 1000001)}`;
    const scriptUrl = scriptForProvider(props.provider, props.hl, callbackName);
    const script = document.createElement('script');

    window[callbackName] = () => {
      delete window[callbackName];
      callback(null, script);
    };

    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    if (props.provider === FRIENDLY_CAPTCHA_PROVIDER) {
      script.onload = window[callbackName];
    }

    element.appendChild(script);
  }

  componentWillUnmount() {
    if (!this.scriptNode) {
      return;
    }
    document.body.removeChild(this.scriptNode);
  }

  componentDidMount() {
    ThirdPartyCaptcha.loadScript(this.props, document.body, (err, scriptNode) => {
      this.scriptNode = scriptNode;
      const provider = getCaptchaProvider(this.props.provider);

      if (this.props.provider === FRIENDLY_CAPTCHA_PROVIDER) {
        this.widgetInstance = new provider.WidgetInstance(this.ref.current, {
          sitekey: this.props.sitekey,
          language: this.props.hl,
          doneCallback: this.changeHandler,
          errorCallback: this.erroredHandler,
        });
      } else {
        // if this is enterprise then we change this to window.grecaptcha.enterprise.render
        this.widgetId = provider.render(this.ref.current, {
          callback: this.changeHandler,
          'expired-callback': this.expiredHandler,
          'error-callback': this.erroredHandler,
          sitekey: this.props.sitekey
        });
      }
    });
  }

  reset() {
    const provider = getCaptchaProvider(this.props.provider);
    if (this.props.provider === FRIENDLY_CAPTCHA_PROVIDER) { 
      if (this.widgetInstance) {
        this.widgetInstance.reset();
      }
    } else {
      provider.reset(this.widgetId);
    }
  }
  render() {
    /*
      This is an override for the following conflicting css-rule:

      @media screen and (max-width: 480px)
      html.auth0-lock-html body > * {
          display: none;
      }
    */
    const fixInterval = setInterval(() => {
      const iframes = Array.from(document.querySelectorAll(`iframe[src*="${providerDomPrefix(this.props.provider)}"]`));

      const containers = iframes
        .map(iframe => iframe.parentNode.parentNode)
        .filter(container => {
          return (
            container &&
            container.parentNode === document.body &&
            container.style.display !== 'block'
          );
        });

      if (containers.length === 0) {
        return;
      }

      containers.forEach(iframe => {
        iframe.style.display = 'block';
      });

      clearInterval(fixInterval);
    }, 300);

    return (
      <div
        className={
          this.props.isValid
            ? `auth0-lock-${providerDomPrefix(this.props.provider)}-block`
            : `auth0-lock-${providerDomPrefix(this.props.provider)}-block auth0-lock-${providerDomPrefix(this.props.provider)}-block-error`
        }
      >
        <div className={`auth0-lock-${providerDomPrefix(this.props.provider) === 'recaptcha' ? 'recaptchav2' : providerDomPrefix(this.props.provider)}`} ref={this.ref} />
      </div>
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value && this.props.value === '') {
      this.reset();
    }
  }
}

// TO DO: Confirm this change will not introduce unintended behavior for customers
ThirdPartyCaptcha.displayName = 'ThirdPartyCaptcha';

ThirdPartyCaptcha.propTypes = {
  provider: propTypes.string.isRequired,
  sitekey: propTypes.string.isRequired,
  onChange: propTypes.func,
  onExpired: propTypes.func,
  onErrored: propTypes.func,
  hl: propTypes.string,
  value: propTypes.string,
  isValid: propTypes.bool
};

ThirdPartyCaptcha.defaultProps = {
  onChange: noop,
  onExpired: noop,
  onErrored: noop
};
