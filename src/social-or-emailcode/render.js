import React from 'react';
import Lock from '../lock/lock';
import AskSocialNetworkOrEmail from '../social-or-magiclink/ask_social_network_or_email';
import AskVcode from '../cred/vcode/ask_vcode';
import { close } from './actions';
import * as l from '../lock/index';
import * as c from '../cred/index';
import * as mp from '../passwordless/index';
import { requestPasswordlessEmail, signIn } from '../passwordless/actions';

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

export default function render(lock) {
  const props = {
    children: mp.passwordlessStarted(lock) ?
      <AskVcode destination={c.email(lock)} lock={lock} key="ask-vcode" /> :
      <AskSocialNetworkOrEmail key="social-network-or-email" lock={lock} />,
    closeHandler: close,
    escHandler: close,
    isDone: l.signedIn(lock),
    lock: lock,
    submitHandler: mp.passwordlessStarted(lock) ? askVcodeSubmitHandler : askEmailSubmitHandler
  };

  return <Lock {...props} />;
}
