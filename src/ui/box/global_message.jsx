import React from 'react';
import ReactDOM from 'react-dom';

export default class GlobalMessage extends React.Component {

  render() {
    const { message, type } = this.props;
    const className = `auth0-global-message auth0-global-message-${type}`

    return (
      <div className={className}>
        <span className="animated fadeInUp">{message}</span>
      </div>
    );
  }

}

GlobalMessage.propTypes = {
  message: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['error', 'success']).isRequired
}
