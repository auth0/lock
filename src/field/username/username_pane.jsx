import React from 'react';
import UsernameInput from './username_input';
import * as c from '../index';
import { changeField } from '../actions';
import * as l from '../../lock/index';
import { validateNotEmptyString } from '../../utils/validation_utils';

export default class UsernamePane extends React.Component {

  handleChange(e) {
    changeField(l.id(this.props.lock), "username", e.target.value, validateNotEmptyString);
  }

  render() {
    const { lock, placeholder } = this.props;

    return (
      <UsernameInput
        value={c.username(lock)}
        gravatar={l.ui.gravatar(lock)}
        isValid={!c.isFieldVisiblyInvalid(lock, "username")}
        onChange={::this.handleChange}
        placeholder={placeholder}
        disabled={l.submitting(lock)}
      />
    );
  }

}

UsernamePane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
