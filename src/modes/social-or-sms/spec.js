import React from 'react';
import Lock from '../../lock/lock';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskVcode from '../../cred/vcode/ask_vcode';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as mp from '../../passwordless/index';
import {
  cancelSelectPhoneLocation,
  requestPasswordlessEmail,
  sendSMS,
  signIn
} from '../../passwordless/actions';

import { close } from '../../social/actions';

const NAME = "socialOrSms";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  // TODO: review cred storage
  options.modeOptions = {send: "sms", dictName: NAME, storageKey: NAME};
  if (options.defaultLocation && typeof options.defaultLocation === "string") {
    setDefaultLocation(id, options.defaultLocation.toUpperCase());
  }
  return openLock(id, NAME, options);
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}

export default function render(lock) {
  const props = {
    children: mp.passwordlessStarted(lock) ?
      <AskVcode destination={c.email(lock)} lock={lock} key="ask-vcode" /> :
      <AskSocialNetworkOrPhoneNumber key="social-network-or-phone-bumber" lock={lock} />,
    closeHandler: close,
    escHandler: function() {
      mp.selectingLocation(lock) ?
        cancelSelectPhoneLocation(l.id(lock)) : close(l.id(lock));
    },
    isDone: l.signedIn(lock),
    lock: lock,
    submitHandler: mp.passwordlessStarted(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
  };

  return <Lock {...props} />;
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      socialOrSms: open
    }
  },
  renderFn: render
};
