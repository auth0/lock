import React from 'react';
import InputWrap from '../input_wrap';
import Icon from '../../icon/icon';

export default class LocationInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onClick, tabIndex, value } = this.props;
    const { focused } = this.state;

    const limitedValue = value.length > 23 ?
      `${value.substr(0,20)}...` : value;

    return (
      <InputWrap name="location" isValid={true} icon={<Icon name="location" />} focused={focused}>
        <input type="button"
          name="location"
          className="auth0-lock-input auth0-lock-input-location"
          value={limitedValue}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          onKeyDown={::this.handleKeyDown}
          onClick={onClick}
          tabIndex={tabIndex} />
        <Icon name="arrow" />
      </InputWrap>
    );
  }

  handleFocus() {
    this.setState({focused: true});
  }

  handleBlur() {
    this.setState({focused: false});
  }

  handleKeyDown(e) {
    if (e.key !== "Tab") {
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      return this.props.onClick();
    }

    if (e.keyCode >= 65 && e.keyCode <= 90) {
      return this.props.onClick(String.fromCharCode(e.keyCode).toLowerCase());
    }
  }
}

// TODO: specify propTypes
