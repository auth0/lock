import React from 'react';
import Lock from '../../lock/lock';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import { close } from '../../social/actions';
import { requestPasswordlessEmail } from '../../passwordless/actions';
import * as l from '../../lock/index';
import * as mp from '../../passwordless/index';

const NAME = "socialOrMagiclink";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  // TODO: review cred storage
  options.modeOptions = {dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function render(lock) {
  const props = {
    children: <AskSocialNetworkOrEmail key="social-network-or-email" lock={lock} />,
    closeHandler: close,
    escHandler: close,
    isDone: mp.passwordlessStarted(lock) || l.signedIn(lock),
    lock: lock,
    submitHandler: !mp.passwordlessStarted(lock) && requestPasswordlessEmail
  };

  return <Lock {...props} />;
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      socialOrMagiclink: open
    }
  },
  renderFn: render
};
