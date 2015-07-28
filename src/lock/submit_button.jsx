import React from 'react';

export default class SubmitButton extends React.Component {
  render() {
    return (
      <button type="submit" className="auth0-lock-submit" disabled={this.props.disabled}>
        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
        <i className="auth0-lock-icon"/>
      </button>
    );
  }
}

SubmitButton.propTypes = {
  disabled: React.PropTypes.bool
};
