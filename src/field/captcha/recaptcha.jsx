import { createRef } from '../../utils/createRef';
import React from 'react';
import propTypes from 'prop-types';

const noop = () => {};

const RECAPTCHA_V2_PROVIDER = 'recaptcha_v2';
const RECAPTCHA_ENTERPRISE_PROVIDER = 'recaptcha_enterprise';

export const isRecaptcha = provider =>
  provider === RECAPTCHA_ENTERPRISE_PROVIDER || provider === RECAPTCHA_V2_PROVIDER;

const getRecaptchaProvider = provider => {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return window.grecaptcha;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return window.grecaptcha.enterprise;
  }
};

const scriptForProvider = (provider, lang, callback) => {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return `https://www.google.com/recaptcha/api.js?hl=${lang}&onload=${callback}`;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return `https://www.recaptcha.net/recaptcha/enterprise.js?render=explicit&hl=${lang}&onload=${callback}`;
  }
};

export class ReCAPTCHA extends React.Component {
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
    const callbackName = `recatpchaCallback_${Math.floor(Math.random() * 1000001)}`;
    const scriptUrl = scriptForProvider(props.provider, props.hl, callbackName);
    const script = document.createElement('script');

    window[callbackName] = () => {
      delete window[callbackName];
      callback(null, script);
    };

    script.src = scriptUrl;
    script.async = true;
    element.appendChild(script);
  }

  componentWillUnmount() {
    if (!this.scriptNode) {
      return;
    }
    document.body.removeChild(this.scriptNode);
  }

  componentDidMount() {
    ReCAPTCHA.loadScript(this.props, document.body, (err, scriptNode) => {
      this.scriptNode = scriptNode;
      const provider = getRecaptchaProvider(this.props.provider);

      // if this is enterprise then we change this to window.grecaptcha.enterprise.render
      this.widgetId = provider.render(this.ref.current, {
        callback: this.changeHandler,
        'expired-callback': this.expiredHandler,
        'error-callback': this.erroredHandler,
        sitekey: this.props.sitekey
      });
    });
  }

  reset() {
    const provider = getRecaptchaProvider(this.props.provider);
    provider.reset(this.widgetId);
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
      let iframes = Array.from(document.querySelectorAll(`iframe[title="recaptcha challenge"]`));

      iframes = iframes.filter(iframe => iframe.parentNode.parentNode.style.display !== 'block');

      if (iframes.length === 0) {
        return;
      }

      iframes.forEach(iframe => {
        iframe.parentNode.parentNode.style.display = 'block';
      });

      clearInterval(fixInterval);
    }, 300);

    return (
      <div
        className={
          this.props.isValid
            ? 'auth0-lock-recaptcha-block'
            : 'auth0-lock-recaptcha-block auth0-lock-recaptcha-block-error'
        }
      >
        <div className="auth0-lock-recaptchav2" ref={this.ref} />
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

ReCAPTCHA.displayName = 'ReCAPTCHA';

ReCAPTCHA.propTypes = {
  provider: propTypes.string.isRequired,
  sitekey: propTypes.string.isRequired,
  onChange: propTypes.func,
  onExpired: propTypes.func,
  onErrored: propTypes.func,
  hl: propTypes.string,
  value: propTypes.string,
  isValid: propTypes.bool
};

ReCAPTCHA.defaultProps = {
  onChange: noop,
  onExpired: noop,
  onErrored: noop
};
