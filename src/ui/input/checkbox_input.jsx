import React from 'react';
import InputWrap from './input_wrap';

export default class CheckboxInput extends React.Component {
  render() {
    const { lockId, name, ariaLabel, placeholder, checked } = this.props;
    return (
      <div className="auth0-lock-input-checkbox">
        <label>
          <input
            id={`${lockId}-${name}`}
            type="checkbox"
            checked={checked === 'true'}
            onChange={::this.handleOnChange}
            name={name}
            aria-label={ariaLabel || name}
          />
          <span dangerouslySetInnerHTML={{ __html: placeholder }} />
        </label>
      </div>
    );
  }

  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
}
