import React from 'react';

const PaneSeparator = ({text}) => (
  <p className="auth0-lock-pane-separator">{text}</p>
);

PaneSeparator.propTypes = {
  text: React.PropTypes.string.isRequired
};

PaneSeparator.defaultProps = {
  text: "or"
};

export default PaneSeparator;
