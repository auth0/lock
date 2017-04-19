import React from 'react';
import InputWrap from './input_wrap';
import { isSmallScreen } from '../../utils/media_utils';

const svg =
  '<svg focusable="false" width="12px" height="14px" viewBox="0 0 12 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" class="auth0-lock-icon auth0-lock-icon-box"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g transform="translate(-964.000000, -3509.000000)" fill="#888888"><g transform="translate(915.000000, 3207.000000)"><g transform="translate(35.000000, 289.000000)"><path id="Fill-42" d="M25.0523108,22.8115806 L20.455448,26.0692401 L20.455448,20.6336024 L25.0523108,17.6924012 L25.0523108,22.8115806 L25.0523108,22.8115806 Z M20.1658456,19.763342 C20.1060864,19.786611 20.050924,19.8145338 19.9957617,19.8471103 C19.9451962,19.8191876 19.8946307,19.786611 19.8394683,19.7679958 L14.9392126,16.7616414 L19.986568,13.8949009 L25.0523108,16.7616414 L25.043117,16.7662952 L20.1658456,19.763342 L20.1658456,19.763342 Z M19.5360754,20.6336024 L19.5360754,26.0692401 L14.9392126,22.8115806 L14.9392126,17.6924012 L19.5360754,20.6336024 L19.5360754,20.6336024 Z M25.9716833,17.6924012 C25.9716833,17.5574411 25.9395053,17.4317885 25.8889398,17.3154435 C26.0728143,16.9664085 26.0314425,16.5242976 25.7418402,16.2311082 L20.4002856,13.2340614 C19.7980966,12.9408721 20.2393954,12.9036417 19.5590597,13.2340614 L14.2634738,16.2311082 C13.9692745,16.5242976 13.9279028,16.9571009 14.1071804,17.3107897 C14.0520181,17.4271347 14.01984,17.5527873 14.01984,17.6924012 L14.01984,22.8115806 C14.01984,23.3234985 14.4335577,23.7423404 14.9392126,23.7423404 L19.5360754,27 C19.7061593,27 19.8578558,26.9395006 19.9957617,26.8557322 C20.1336676,26.9395006 20.285364,27 20.455448,27 L25.511997,23.7423404 C26.017652,23.7423404 25.9716833,23.3234985 25.9716833,22.8115806 L25.9716833,17.6924012 L25.9716833,17.6924012 Z"></path></g></g></g></g></svg>';

export default class VcodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!isSmallScreen()) {
      // TODO: We can't set the focus immediately because we have to wait for
      // the input to be visible. Use a more robust solution (Placeholder should
      // notify it children when they are being shown).
      setTimeout(() => this.refs.input && this.refs.input.focus(), 1200);
    }
  }

  render() {
    const { isValid, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap focused={focused} isValid={isValid} name="vcode" icon={svg}>
        <input
          ref="input"
          type="tel"
          name="vcode"
          className="auth0-lock-input auth0-lock-input-code"
          autoComplete="off"
          autoCapitalize="off"
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          {...props}
        />
      </InputWrap>
    );
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }
}

// TODO: specify propTypes
