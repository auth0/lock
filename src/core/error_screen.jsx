import PropTypes from 'prop-types';
import React from 'react';
import Screen from './screen';
import * as l from './index';

export default class ErrorScreen extends Screen {
  constructor() {
    super('error');
  }

  render() {
    return ErrorPane;
  }
}

const ErrorPane = ({ i18n }) => (
  <div className="auth0-lock-error-pane">
    <p>{i18n.html('unrecoverableError')}</p>
  </div>
);

ErrorPane.propTypes = {
  i18n: PropTypes.object.isRequired
};
