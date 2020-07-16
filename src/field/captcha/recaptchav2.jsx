import { createRef } from '../../utils/createRef';
import React from 'react';
import propTypes from 'prop-types';

const noop = () => {};

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
    const scriptUrl = `https://www.google.com/recaptcha/api.js?hl=${props.hl}&onload=${callbackName}`;
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
      this.widgetId = window.grecaptcha.render(this.ref.current, {
        callback: this.changeHandler,
        'expired-callback': this.expiredHandler,
        'error-callback': this.erroredHandler,
        sitekey: this.props.sitekey
      });
    });
  }

  reset() {
    window.grecaptcha.reset(this.widgetId);
  }

  render() {
    // style={{ border: !this.props.isValid ? '1px solid #dd4b39' : ''}}
    return (
      <div className={
          this.props.isValid ?
            "auth0-lock-recaptcha-block" :
            "auth0-lock-recaptcha-block auth0-lock-recaptcha-block-error"
            }>
        <div
          className="auth0-lock-recaptchav2"
          ref={this.ref}
        />
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
