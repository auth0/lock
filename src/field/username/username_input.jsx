import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';

export default class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      // TODO: We can't set the focus immediately because we have to wait for
      // the input to be visible. Use a more robust solution (Placeholder should
      // notify it children when they are being shown).
      setTimeout(() => this.refs.input.focus(), 1200);
    }
  }

  render() {
    const { autoFocus, isValid, onChange, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap
        focused={focused}
        icon={<Icon name="username" />}
        isValid={isValid}
        name="username"
      >
        <input
          ref="input"
          type="text"
          name="username  "
          className="auth0-lock-input"
          placeholder="username"
          autoComplete="off"
          autoCapitalize="off"
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
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }
}

// TODO: specify propTypes
