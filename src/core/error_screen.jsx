import React from 'react';
import Screen from './screen';
import * as l from './index';

export default class ErrorScreen extends Screen {

  constructor() {
    super("error");
  }

  render() {
    return ErrorPane;
  }

}

const ErrorPane = ({t}) => (
  <div className="auth0-lock-error-pane">
    <p>{t("unrecoverableError")}</p>
  </div>
);


ErrorPane.propTypes = {
  t: React.PropTypes.func.isRequired
};
