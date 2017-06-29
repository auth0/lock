import PropTypes from 'prop-types';
import React from 'react';

export default class GlobalMessage extends React.Component {
  componentDidMount() {
    const methodIsSupported =
      this.messageNode && typeof this.messageNode.scrollIntoView === 'function';
    if (methodIsSupported && this.props.scrollIntoView) {
      const boundingRect = this.messageNode.getBoundingClientRect();
      if (boundingRect.top < 0) {
        this.messageNode.scrollIntoView(true);
      }
    }
  }
  render() {
    const { message, type } = this.props;
    const className = `auth0-global-message auth0-global-message-${type}`;
    return (
      <div
        className={className}
        ref={messageNode => {
          this.messageNode = messageNode;
        }}
      >
        <span className="animated fadeInUp">{message}</span>
      </div>
    );
  }
}

GlobalMessage.propTypes = {
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['error', 'success']).isRequired,
  scrollIntoView: PropTypes.bool
};

GlobalMessage.defaultProps = {
  scrollIntoView: true
};
