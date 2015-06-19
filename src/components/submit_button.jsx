import React from 'react';

export default class SubmitButton extends React.Component {
  render() {
    // TODO we should display a spinner when is disabled instead of ellipsis
    return (
      <button type="submit" className={"auth0-lock-submit"} disabled={this.props.disabled}>
        <i className="auth0-lock-icon"/>
      </button>
    );
  }
}

SubmitButton.propTypes = {
  disabled: React.PropTypes.bool
};
