import React from 'react';
import InputWrap from './input_wrap';

export default class CheckboxInput extends React.Component {
  render() {
    const { name, placeholder, checked } = this.props;
    return (
      <div className="auth0-lock-input-checkbox">
        <label>
          <input
            type="checkbox"
            checked={checked === 'true'}
            onChange={::this.handleOnChange}
            name={name}
          />
          <span>{placeholder}</span>
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
