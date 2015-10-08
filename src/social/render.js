import React from 'react';
import Lock from '../lock/lock';
import AskSocialNetwork from './ask_social_network';
import { close } from './actions';

export default function render(lock) {
  const props = {
    children: <AskSocialNetwork key="social-network" lock={lock} />,
    closeHandler: close,
    lock: lock,
    isDone: false,
    submitHandler: function() { }
  };

  return <Lock {...props} />;
}
