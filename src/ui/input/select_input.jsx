import React from 'react';
import InputWrap from './input_wrap';

const arrowSvg =
  '<svg focusable="false" width="5px" height="10px" viewBox="0 0 5 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" class="auth0-lock-icon-arrow"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" transform="translate(-396.000000, -3521.000000)" fill="#000000" opacity="0.539999962"><g id="SMS" transform="translate(153.000000, 3207.000000)"><g transform="translate(35.000000, 299.000000)"><g transform="translate(210.000000, 20.000000) rotate(-90.000000) translate(-210.000000, -20.000000) translate(198.000000, 8.000000)"><path id="Shape" d="M7,10 L12,15 L17,10 L7,10 Z"></path></g></g></g></g></g></svg>';

export default class SelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iconUrl, isValid, label, name, onClick, placeholder } = this.props;
    let { icon } = this.props;
    const { focused } = this.state;

    let limitedValue = label || placeholder;
    if (limitedValue.length > 23) {
      limitedValue = `${limitedValue.substr(0, 20)}...`;
    }

    if (!icon && typeof iconUrl === 'string' && iconUrl) {
      icon = <img className="auth0-lock-custom-icon" src={iconUrl} />;
    }

    let className = 'auth0-lock-input auth0-lock-input-location';
    if (!label) className += ' auth0-lock-input-with-placeholder';

    return (
      <InputWrap focused={focused} isValid={isValid} name="location" icon={icon}>
        <input
          type="button"
          name={name}
          className={className}
          value={limitedValue}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          onKeyDown={::this.handleKeyDown}
          onClick={onClick}
        />
        <span dangerouslySetInnerHTML={{ __html: arrowSvg }} />
      </InputWrap>
    );
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }

  handleKeyDown(e) {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }

    if (e.key === 'ArrowDown') {
      return this.props.onClick();
    }

    if (e.keyCode >= 65 && e.keyCode <= 90) {
      return this.props.onClick(String.fromCharCode(e.keyCode).toLowerCase());
    }
  }
}

// TODO: specify propTypes
