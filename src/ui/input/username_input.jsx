import React from 'react';
import InputWrap from './input_wrap';

const svg =
  '<svg focusable="false" width="13px" height="14px" viewBox="0 0 15 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="auth0-lock-icon"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-11.000000, -1471.000000)" fill="#888888"><path d="M25.552,1486.998 L11.449,1486.998 C10.667,1485.799 10.984,1483.399 11.766,1482.6 C12.139,1482.219 14.931,1481.5 16.267,1481.172 C14.856,1480.076 13.995,1478.042 13.995,1476.103 C13.995,1473.284 14.813,1470.999 18.498,1470.999 C22.182,1470.999 23,1473.284 23,1476.103 C23,1478.037 22.145,1480.065 20.74,1481.163 C22.046,1481.489 24.88,1482.228 25.241,1482.601 C26.019,1483.399 26.328,1485.799 25.552,1486.998 L25.552,1486.998 Z M24.6,1483.443 C24.087,1483.169 21.881,1482.548 20,1482.097 L20,1480.513 C21.254,1479.659 21.997,1477.806 21.997,1476.12 C21.997,1473.841 21.414,1471.993 18.499,1471.993 C15.583,1471.993 15,1473.841 15,1476.12 C15,1477.807 15.744,1479.662 17,1480.515 L17,1482.112 C15.109,1482.556 12.914,1483.166 12.409,1483.442 C12.082,1483.854 11.797,1485.173 12,1486 L25,1486 C25.201,1485.174 24.922,1483.858 24.6,1483.443 L24.6,1483.443 Z"></path></g></g></svg>';

export default class UsernameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { invalidHint, isValid, value, onChange } = this.props;
    const { focused } = this.state;

    return (
      invalidHint != nextProps.invalidHint ||
      isValid != nextProps.isValid ||
      value != nextProps.value ||
      focused != nextState.focused
    );
  }

  render() {
    const { invalidHint, isValid, onChange, autoComplete, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap
        focused={focused}
        invalidHint={invalidHint}
        isValid={isValid}
        name="username"
        icon={svg}
      >
        <input
          ref="input"
          type="text"
          name="username"
          className="auth0-lock-input"
          placeholder="username"
          autoComplete={autoComplete ? 'on' : 'off'}
          autoCapitalize="off"
          spellCheck="off"
          autoCorrect="off"
          onChange={::this.handleOnChange}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
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

  handleBlur(e) {
    this.setState({ focused: false });
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }
}

// TODO: specify propTypes
