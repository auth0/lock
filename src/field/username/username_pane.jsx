import React from 'react';
import UsernameInput from '../../ui/input/username_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setUsername, usernameLooksLikeEmail } from '../username';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

export default class UsernamePane extends React.Component {

  componentDidMount() {
    const { lock } = this.props;
    if (l.ui.avatar(lock) && c.username(lock)) {
      requestAvatar(l.id(lock), c.username(lock));
    }
  }

  handleChange(e) {
    const { lock, validateFormat, usernameStyle } = this.props;
    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }

    swap(updateEntity, "lock", l.id(lock), setUsername, e.target.value, usernameStyle, validateFormat);
  }

  render() {
    const { i18n, lock, placeholder, validateFormat } = this.props;
    const value = c.getFieldValue(lock, "username");

    const invalidHintKey = str => {
      if (!str) return "blankErrorHint";
      if (usernameLooksLikeEmail(str) || !validateFormat) return "invalidErrorHint";
      return "usernameFormatErrorHint";
    };

    return (
      <UsernameInput
        value={value}
        invalidHint={i18n.str(invalidHintKey(value))}
        isValid={!c.isFieldVisiblyInvalid(lock, "username")}
        onChange={::this.handleChange}
        placeholder={placeholder}
      />
    );
  }

}

UsernamePane.propTypes = {
  i18n: React.PropTypes.object.isRequired,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  validateFormat: React.PropTypes.bool.isRequired,
  usernameStyle: React.PropTypes.oneOf(["any", "email", "username"])
};

UsernamePane.defaultProps = {
  validateFormat: false,
  usernameStyle: "username"
};
