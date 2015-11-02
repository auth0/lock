import React from 'react';

const PaneSeparator = ({children}) => (
  <p className="auth0-lock-pane-separator">{children}</p>
);

PaneSeparator.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string
  ]).isRequired
};

PaneSeparator.defaultProps = {
  children: "or"
};

export default PaneSeparator;
