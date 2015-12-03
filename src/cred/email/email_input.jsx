import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';
import { debouncedRequestGravatar, requestGravatar } from '../../gravatar/actions';

export default class EmailInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const email = this.refs.input.value;
    if (email && this.props.gravatar) {
      requestGravatar(email);
    }
  }

  render() {
    const { isValid, onChange, gravatar, ...props } = this.props;
    const { focused } = this.state;

    return (
      <InputWrap name="email" isValid={isValid} icon={<Icon name="email" />} focused={focused}>
        <input ref="input"
          type="text"
          name="email"
          className="auth0-lock-input"
          placeholder="yours@example.com"
          autoComplete="off"
          autoCapitalize="off"
          onChange={::this.handleOnChange}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          {...props}/>
      </InputWrap>
    );
  }

  handleOnChange(e) {
    if (this.props.gravatar) {
      debouncedRequestGravatar(e.target.value);
    }

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
