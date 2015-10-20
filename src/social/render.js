import React from 'react';
import Lock from '../lock/lock';
import AskSocialNetwork from '../cred/social/ask_social_network';
import { close } from './actions';
import * as l from '../lock/index';

export default function render(lock) {
  const props = {
    children: <AskSocialNetwork key="social-network" lock={lock} />,
    closeHandler: close,
    lock: lock,
    isDone: l.signedIn(lock),
    submitHandler: function() { }
  };

  return <Lock {...props} />;
}
