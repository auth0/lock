import React from 'react';
import Lock from '../lock/lock';
import AskSocialNetworkOrEmail from './ask_social_network_or_email';
import { close } from './actions';
import * as l from '../lock/index';
import * as mp from '../passwordless/index';
import { requestPasswordlessEmail } from '../passwordless/actions';

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

export default function render(lock) {
  const props = {
    children: <AskSocialNetworkOrEmail key="social-network-or-email" lock={lock} />,
    closeHandler: close,
    escHandler: close,
    isDone: mp.passwordlessStarted(lock) || l.signedIn(lock),
    lock: lock,
    submitHandler: !mp.passwordlessStarted(lock) && askEmailSubmitHandler
  };

  return <Lock {...props} />;
}
