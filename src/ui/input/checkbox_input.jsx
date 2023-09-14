import React from 'react';
import InputWrap from './input_wrap';

export default class CheckboxInput extends React.Component {
  render() {
    const {
      lockId,
      name,
      ariaLabel,
      placeholder,
      checked,
      placeholderHTML,
      isValid,
      invalidHint
    } = this.props;

    const spanClass = invalidHint ? '' : 'no-hint'

    return (
      <InputWrap
        invalidHint={invalidHint}
        isValid={isValid}
        name={name}
        className="auth0-lock-input-checkbox"
      >
        <label>
          <input
            id={`${lockId}-${name}`}
            type="checkbox"
            checked={checked === 'true'}
            onChange={::this.handleOnChange}
            name={name}
            aria-label={ariaLabel || name}
            aria-invalid={!isValid}
          />
          {placeholderHTML ? (
            // placeholderHTML allows raw HTML
            // eslint-disable-next-line react/no-danger
            <span className={spanClass} dangerouslySetInnerHTML={{ __html: placeholderHTML }} />
          ) : (
            <span className={spanClass}>{placeholder}</span>
          )}
        </label>
      </InputWrap>
    );
  }

  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
}
