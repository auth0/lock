import React from 'react';
import Lock from '../../lock/lock';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { openLock } from '../../lock/actions';
import { close } from '../../social/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';

const NAME = "social";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function render(lock) {
  const props = {
    children: <AskSocialNetwork key="social-network" lock={lock} />,
    closeHandler: close,
    lock: lock,
    isDone: l.signedIn(lock)
  };

  return <Lock {...props} />;
}


export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      social: open
    }
  },
  renderFn: render
};
