import React from 'react';
import InputWrap from './input_wrap';
import Icon from '../icon/icon';
import { isSmallScreen } from '../utils/media_utils';

export default class VcodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!isSmallScreen()) {
      React.findDOMNode(this.refs.input).focus();
    }
  }

  render() {
    const { isValid, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap name="vcode" isValid={isValid} icon={<Icon name="vcode" />}  focused={focused}>
        <input ref="input"
          type="text"
          name="vcode"
          className="auth0-lock-input auth0-lock-input-code"
          placeholder="Your code"
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
