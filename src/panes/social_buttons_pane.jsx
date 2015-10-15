import React from 'react';
import SocialButton from '../social/social_button';
import * as l from '../lock/index';

export default class SocialButtonsPane extends React.Component {

  render() {
    const { lock } = this.props;

    const buttons = l.ui.connections(lock).map(x => {
      return <SocialButton key={x} name={x} lockID={l.id(lock)} />;
    });

    return <div>{buttons}</div>;
  }

}

SocialButtonsPane.propTypes = {
  lock: React.PropTypes.object.isRequired
};
