import { createRef } from '../../utils/createRef';
import React from 'react';
import propTypes from 'prop-types';

const noop = () => {};

const RECAPTCHA_V2_PROVIDER = 'recaptcha_v2';
const RECAPTCHA_ENTERPRISE_PROVIDER = 'recaptcha_enterprise';
const HCAPTCHA_PROVIDER = 'hcaptcha';
const FRIENDLY_CAPTCHA_PROVIDER = 'friendly_captcha';
const ARKOSE_PROVIDER = 'arkose';
const AUTH0_V2_CAPTCHA_PROVIDER = 'auth0_v2';
const TIMEOUT_MS = 500;
const MAX_RETRY = 3;

export const isThirdPartyCaptcha = provider =>
  provider === RECAPTCHA_ENTERPRISE_PROVIDER
  || provider === RECAPTCHA_V2_PROVIDER
  || provider === HCAPTCHA_PROVIDER
  || provider === FRIENDLY_CAPTCHA_PROVIDER
  || provider === ARKOSE_PROVIDER
  || provider === AUTH0_V2_CAPTCHA_PROVIDER;

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
    case ARKOSE_PROVIDER:
      return window.arkose;
    case AUTH0_V2_CAPTCHA_PROVIDER:
      return window.turnstile;
  }
};

const scriptForProvider = (provider, lang, callback, clientSubdomain, siteKey) => {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return `https://www.recaptcha.net/recaptcha/api.js?hl=${lang}&onload=${callback}`;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return `https://www.recaptcha.net/recaptcha/enterprise.js?render=explicit&hl=${lang}&onload=${callback}`;
    case HCAPTCHA_PROVIDER:
      return `https://js.hcaptcha.com/1/api.js?hl=${lang}&onload=${callback}`;
    case FRIENDLY_CAPTCHA_PROVIDER:
      return 'https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.12/widget.min.js';
    case ARKOSE_PROVIDER:
      return 'https://' + clientSubdomain + '.arkoselabs.com/v2/' + siteKey + '/api.js';
    case AUTH0_V2_CAPTCHA_PROVIDER:
      return `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${callback}`;
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
      return 'friendly-captcha';
    case ARKOSE_PROVIDER:
      return 'arkose';
    case AUTH0_V2_CAPTCHA_PROVIDER:
      return 'auth0-v2';
  }
};

const loadScript = (url, attributes) => {
  var script = document.createElement('script');
  for (var attr in attributes) {
    if (attr.startsWith('data-')) {
      script.dataset[attr.replace('data-', '')] = attributes[attr];
    } else {
      script[attr] = attributes[attr];
    }
  }
  script.src = url;
  document.body.appendChild(script);
};

const removeScript = (url) => {
  var scripts = document.body.querySelectorAll('script[src="' + url + '"]');
  scripts.forEach((script) => {
    script.remove();
  });
};

export class ThirdPartyCaptcha extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      retryCount: 0,
      scriptUrl: ''
    };
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
    this.renderParams = {
      sitekey: this.props.sitekey,
    }
  }

  getRenderParams() {
    if (this.props.provider === ARKOSE_PROVIDER) {
      // Arkose doesn't use render params
      delete this.renderParams;
      return;
    }

    if (this.props.provider === FRIENDLY_CAPTCHA_PROVIDER) {
      this.renderParams = {
        ...this.renderParams,
        language: this.props.hl,
        doneCallback: this.changeHandler,
        errorCallback: this.erroredHandler
      };
      return;
    }
    this.renderParams = {
      ...this.renderParams,
      callback: this.changeHandler,
      'expired-callback': this.expiredHandler,
      'error-callback': this.erroredHandler
    };

    if (this.props.provider === AUTH0_V2_CAPTCHA_PROVIDER) {
      this.renderParams = {
        ...this.renderParams,
        language: this.props.hl,
        theme: 'light'
      };
    }
  }
  
  injectCaptchaScript(callback = noop) {
    const { provider, hl, clientSubdomain, sitekey } = this.props;
    const callbackName = `${providerDomPrefix(provider)}Callback_${Math.floor(Math.random() * 1000001)}`;
    const scriptUrl = scriptForProvider(provider, hl, callbackName, clientSubdomain, sitekey);
    this.setState({ scriptUrl });
    const attributes = {
      async: true,
      defer: true
    };
    if (provider === ARKOSE_PROVIDER) {
      attributes['data-callback'] = callbackName;
      attributes['onerror'] = () => {
        if (this.state.retryCount < MAX_RETRY) {
          removeScript(scriptUrl);
          loadScript(scriptUrl, attributes);
          this.setState((prevState) => ({
            retryCount: prevState.retryCount + 1
          }));
          return;
        }
        removeScript(scriptUrl);
        this.changeHandler('BYPASS_CAPTCHA');
      };
      window[callbackName] = (arkose) => {
        callback(arkose);
      };
    } else {
      window[callbackName] = () => {
        delete window[callbackName];
        callback();
      };
  
      if (provider === FRIENDLY_CAPTCHA_PROVIDER) {
        attributes['onload'] = window[callbackName];
      }
    }

    loadScript(scriptUrl, attributes);
  }

  componentWillUnmount() {
    if (!this.state.scriptUrl) {
      return;
    }
    removeScript(this.state.scriptUrl);
  }

  componentDidMount() {
    this.getRenderParams();
    this.injectCaptchaScript((arkose) => {
      const provider = getCaptchaProvider(this.props.provider);
      if (this.props.provider === ARKOSE_PROVIDER) {
        arkose.setConfig({
          onReady: () => {
            arkose.run();
          },
          onCompleted: (response) => {
            this.changeHandler(response.token);
          },
          onError: () => {
            if (this.state.retryCount < MAX_RETRY) {
              arkose.reset();
              // To ensure reset is successful, we need to set a timeout here
              setTimeout(() => {
                arkose.run();
              }, TIMEOUT_MS);
              this.setState((prevState) => ({
                retryCount: prevState.retryCount + 1
              }));
            } else {
              this.changeHandler('BYPASS_CAPTCHA');
            }
          }
        });
      } else if (this.props.provider === FRIENDLY_CAPTCHA_PROVIDER) {
        this.widgetInstance = new provider.WidgetInstance(this.ref.current, this.renderParams);
      } else {
        // if this is enterprise then we change this to window.grecaptcha.enterprise.render
        this.widgetId = provider.render(this.ref.current, this.renderParams);
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
  clientSubdomain: propTypes.string,
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
