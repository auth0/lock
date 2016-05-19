import React from 'react';

const PaneSeparator = ({children}) => (
  children && children != "or"
    ? <p className="auth0-lock-pane-separator">{children}</p>
    : <div className="auth0-lock-pane-separator"></div>
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
