import React from 'react';
import Lock from '../../lock/lock';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskPhoneNumber from '../../cred/phone-number/ask_phone_number';
import { openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';

// TODO: remove passwordless dep
import * as m from '../../passwordless/index';
import {
  cancelSelectPhoneLocation,
  close,
  requestPasswordlessEmail,
  sendSMS,
  signIn
} from '../../passwordless/actions';

const NAME = "sms";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
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


function render(lock) {
  const props = {
    closeHandler: close,
    children: m.passwordlessStarted(lock) ?
      <AskVcode destination={c.fullHumanPhoneNumber(lock)} lock={lock} key="ask-vcode" /> :
      <AskPhoneNumber lock={lock} key="ask-phone-number" />,
    disallowClose: m.selectingLocation(lock),
    escHandler: function() {
      m.selectingLocation(lock) ?
        cancelSelectPhoneLocation(l.id(lock)) : close(l.id(lock));
    },
    isDone: l.signedIn(lock),
    lock: lock,
    submitHandler: m.passwordlessStarted(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
  };

  return <Lock {...props} />;
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      sms: open
    }
  },
  renderFn: render
};
