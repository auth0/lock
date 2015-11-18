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
    const { lock, placeholder, tabIndex } = this.props;

    return (
      <UsernameInput
        value={c.username(lock)}
        isValid={!c.visiblyInvalidUsername(lock)}
        onChange={::this.handleChange}
        placeholder={placeholder}
        tabIndex={l.tabIndex(lock, tabIndex)}
        disabled={l.submitting(lock)}
      />
    );
  }

}

UsernamePane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};

UsernamePane.defaultProps = {
  tabIndex: 1
};
