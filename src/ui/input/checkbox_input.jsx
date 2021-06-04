import React from 'react';

export default class CheckboxInput extends React.Component {
  render() {
    const { lockId, name, ariaLabel, placeholder, checked, placeholderHTML } = this.props;
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
          {placeholderHTML ? (
            // placeholderHTML allows raw HTML
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: placeholderHTML }} />
          ) : (
            <span>{placeholder}</span>
          )}
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
