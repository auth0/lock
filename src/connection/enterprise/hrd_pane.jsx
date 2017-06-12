import PropTypes from 'prop-types';
import React from 'react';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import * as l from '../../core/index';

export default class HRDPane extends React.Component {
  render() {
    const { header, i18n, model, passwordInputPlaceholder, usernameInputPlaceholder } = this.props;

    return (
      <div>
        {header}
        <UsernamePane
          i18n={i18n}
          lock={model}
          placeholder={usernameInputPlaceholder}
          validateFormat={false}
        />
        <PasswordPane i18n={i18n} lock={model} placeholder={passwordInputPlaceholder} />
      </div>
    );
  }
}

HRDPane.propTypes = {
  header: PropTypes.element,
  i18n: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  passwordInputPlaceholder: PropTypes.string.isRequired,
  usernameInputPlaceholder: PropTypes.string.isRequired
};
