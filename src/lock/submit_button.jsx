import React from 'react';
import SubmitIcon from './submit_icon';

export default class SubmitButton extends React.Component {
  render() {
    const { color, disabled, tabIndex } = this.props;

    return (
      <button type="submit" className="auth0-lock-submit" style={{backgroundColor: color}} disabled={disabled} tabIndex={tabIndex}>
        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
        <SubmitIcon />
      </button>
    );
  }

  focus() {
    React.findDOMNode(this).focus();
  }
}

SubmitButton.propTypes = {
  disabled: React.PropTypes.bool
};
