import React from 'react';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import * as l from '../../core/index';

export default class HRDPane extends React.Component {

  render() {
    const {
      header,
      model,
      passwordInputPlaceholder,
      usernameInputPlaceholder
    } = this.props;

    return (
      <div>
        {header}
        <UsernamePane
          lock={model}
          placeholder={usernameInputPlaceholder}
        />
        <PasswordPane lock={model} placeholder={passwordInputPlaceholder} />
      </div>
    );
  }

}

HRDPane.propTypes = {
  header: React.PropTypes.element,
  model: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired
};
