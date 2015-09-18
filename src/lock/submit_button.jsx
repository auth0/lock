import React from 'react';
import SubmitIcon from './submit_icon';

export default class SubmitButton extends React.Component {
  render() {
    return (
      <button type="submit" className="auth0-lock-submit" disabled={this.props.disabled} tabIndex="10">
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
