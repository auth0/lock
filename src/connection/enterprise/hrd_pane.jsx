import React from 'react';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import * as l from '../../core/index';

export default class HRDPane extends React.Component {

  render() {
    const {
      header,
      i18n,
      model,
      passwordInputPlaceholder,
      usernameInputPlaceholder
    } = this.props;

    return (
      <div>
        {header}
        <UsernamePane
          i18n={i18n}
          lock={model}
          placeholder={usernameInputPlaceholder}
          validateFormat={false}
        />
        <PasswordPane
          i18n={i18n}
          lock={model}
          placeholder={passwordInputPlaceholder}
        />
      </div>
    );
  }

}

HRDPane.propTypes = {
  header: React.PropTypes.element,
  i18n: React.PropTypes.object.isRequired,
  model: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired
};
