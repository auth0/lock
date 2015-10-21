import React from 'react';
import Lock from '../../lock/lock';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { openLock } from '../../lock/actions';
import { close } from '../../social/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import {
  renderSignedInConfirmation
} from '../shared';

const NAME = "social";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function render(lock) {
  const screenName = "network";
  const props = {
    auxiliaryPane: renderSignedInConfirmation(lock),
    children: <AskSocialNetwork lock={lock} />,
    closeHandler: close,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    lock: lock,
    isDone: l.signedIn(lock),
    screenName: screenName,
    showSubmitButton: false
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
