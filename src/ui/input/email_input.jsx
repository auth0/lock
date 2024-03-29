import React from 'react';
import InputWrap from './input_wrap';

const SVG = (
  <svg
    aria-hidden="true"
    focusable="false"
    width="14px"
    height="13px"
    viewBox="0 0 32 26"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="auth0-lock-icon auth0-lock-icon-box"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="32px" transform="translate(-2155.000000, -2317.000000)" fill="#373A39">
        <g id="Group-856" transform="translate(1.000000, 1.000000)">
          <path
            id="Fill-419"
            d="M2184,2339 C2184,2339.55 2183.55,2340 2183,2340 L2157,2340 C2156.45,2340 2156,2339.55 2156,2339 L2156,2319 C2156,2318.45 2156.45,2318 2157,2318 L2183,2318 C2183.55,2318 2184,2318.45 2184,2319 L2184,2339 L2184,2339 Z M2184,2316 L2156,2316 C2154.89,2316 2154,2316.89 2154,2318 L2154,2340 C2154,2341.1 2154.89,2342 2156,2342 L2184,2342 C2185.1,2342 2186,2341.1 2186,2340 L2186,2318 C2186,2316.89 2185.1,2316 2184,2316 L2184,2316 Z M2176,2322 L2180,2322 L2180,2326 L2176,2326 L2176,2322 Z M2174,2328 L2182,2328 L2182,2320 L2174,2320 L2174,2328 Z M2158,2332 L2172,2332 L2172,2330 L2158,2330 L2158,2332 Z M2158,2336 L2172,2336 L2172,2334 L2158,2334 L2158,2336 Z"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export default class EmailInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { invalidHint, isValid, value, disabled, onChange } = this.props;
    const { focused } = this.state;

    return (
      invalidHint != nextProps.invalidHint ||
      isValid != nextProps.isValid ||
      value != nextProps.value ||
      focused != nextState.focused ||
      disabled != nextProps.disabled
    );
  }

  render() {
    const { lockId, invalidHint, isValid, autoComplete, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap
        focused={focused}
        invalidHint={invalidHint}
        isValid={isValid}
        name="email"
        icon={SVG}
      >
        <input
          id={`${lockId}-email`}
          ref="input"
          type="email"
          inputMode="email"
          name="email"
          className="auth0-lock-input"
          placeholder="yours@example.com"
          autoComplete={autoComplete ? 'on' : 'off'}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          onChange={::this.handleOnChange}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          aria-label="Email"
          aria-invalid={!isValid}
          aria-describedby={!isValid && invalidHint ? `auth0-lock-error-msg-email` : undefined}
          {...props}
        />
      </InputWrap>
    );
  }

  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }
}

// TODO: specify propTypes
