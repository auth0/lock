import React from 'react';
import UsernameInput from '../../ui/input/username_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../lock/index';
import { setUsername } from '../username';
import { debouncedRequestGravatar, requestGravatar } from '../../gravatar/actions';

export default class UsernamePane extends React.Component {

  componentDidMount() {
    const { lock } = this.props;
    if (l.ui.gravatar(lock) && c.username(lock)) {
      requestGravatar(c.username(lock));
    }
  }

  handleChange(e) {
    const { lock } = this.props;
    if (l.ui.gravatar(lock)) {
      debouncedRequestGravatar(e.target.value);
    }

    swap(updateEntity, "lock", l.id(lock), setUsername, e.target.value);
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
