import React from 'react';
import Lock from '../../lock/lock';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { openLock } from '../../lock/actions';
import { close } from '../../social/actions';
import { requestPasswordlessEmail, signIn } from '../../passwordless/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as mp from '../../passwordless/index';

const NAME = "socialOrEmailcode";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  // TODO: review cred storage
  options.modeOptions = {send: "code", dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function render(lock) {
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


export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      socialOrEmailcode: open
    }
  },
  renderFn: render
};
