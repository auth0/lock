import React from 'react';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import * as l from '../../lock/index';

export default class HRDPane extends React.Component {

  render() {
    const {
      model,
      passwordInputPlaceholder,
      usernameInputPlaceholder
    } = this.props;

    return (
      <div>
        <UsernamePane
          autofocus={l.ui.autofocus(model)}
          lock={model}
          placeholder={usernameInputPlaceholder}
        />
        <PasswordPane lock={model} placeholder={passwordInputPlaceholder} />
      </div>
    );
  }

}

HRDPane.propTypes = {
  model: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired
};
