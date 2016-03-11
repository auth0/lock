import React from 'react';
import UsernameInput from './username_input';
import * as c from '../index';
import { changeUsername } from './actions';
import * as l from '../../lock/index';

export default class UsernamePane extends React.Component {

  handleChange(e) {
    changeUsername(l.id(this.props.lock), e.target.value);
  }

  render() {
    const { lock, placeholder } = this.props;

    return (
      <UsernameInput
        value={c.username(lock)}
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
