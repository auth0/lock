import React from 'react';

export default class GlobalError extends React.Component {
  render() {
    return (
      <div className="auth0-global-grobal-error">
        <span className="animated fadeInUp">{this.props.message}</span>
      </div>
    );
  }
}

GlobalError.propTypes = {
  message: React.PropTypes.string.isRequired
}
