import React from 'react';
import AskSocialNetwork from '../../cred/social/ask_social_network';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import {
  renderSignedInConfirmation
} from '../shared';

const NAME = "social";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  const { connections } = options;
  if (!Array.isArray(connections) || connection.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }
  options.signInCallback = callback;
  options.modeOptions = {dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

function render(lock) {
  const screenName = "network";
  return {
    auxiliaryPane: renderSignedInConfirmation(lock),
    children: <AskSocialNetwork lock={lock} />,
    closeHandler: closeLock,
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"]),
    lock: lock,
    isDone: l.signedIn(lock),
    screenName: screenName,
    showSubmitButton: false
  };
}


export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      social: open
    }
  },
  renderFn: render
};
