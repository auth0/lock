import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';
import { isSmallScreen } from '../../utils/media_utils';

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
      setTimeout(() => this.refs.input.focus(), 1200);
    }
  }

  render() {
    const { isValid, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap name="vcode" isValid={isValid} icon={<Icon name="vcode" />}  focused={focused}>
        <input ref="input"
          type="tel"
          name="vcode"
          className="auth0-lock-input auth0-lock-input-code"
          autoComplete="off"
          autoCapitalize="off"
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          {...props} />
      </InputWrap>
    );
  }

  handleFocus() {
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}

// TODO: specify propTypes
