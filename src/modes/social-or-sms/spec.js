import React from 'react';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskVcode from '../../cred/vcode/ask_vcode';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import * as m from '../../passwordless/index';
import {
  cancelSelectPhoneLocation,
  requestPasswordlessEmail,
  sendSMS,
  signIn
} from '../../passwordless/actions';
import {
  buildBackHandler,
  renderAskLocation,
  renderSignedInConfirmation
} from '../shared';

const NAME = "socialOrSms";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  const { connections } = options;
  if (!Array.isArray(connections) || connection.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }
  options.signInCallback = callback;
  options.modeOptions = {send: "sms", dictName: NAME, storageKey: NAME};
  if (options.defaultLocation && typeof options.defaultLocation === "string") {
    setDefaultLocation(id, options.defaultLocation.toUpperCase());
  }
  return openLock(id, NAME, options);
}

function render(lock) {
  let backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    const placeholder = l.ui.t(lock, [screenName, "codeInputPlaceholder"], {__textOnly: true});
    const resendLabel = l.ui.t(lock, [screenName, "resendLabel"], {__textOnly: true});
    children = <AskVcode lock={lock} placeholder={placeholder} resendLabel={resendLabel} />;
    submitHandler = signIn;
  } else {
    screenName = "networkOrPhone";
    const placeholder = l.ui.t(lock, [screenName, "phoneNumberInputPlaceholder"], {__textOnly: true});
    children = <AskSocialNetworkOrPhoneNumber lock={lock} placeholder={placeholder} />;
    submitHandler = sendSMS;
  }

  return {
    auxiliaryPane: renderAskLocation(lock) || renderSignedInConfirmation(lock),
    backHandler: backHandler,
    children: children,
    closeHandler: closeLock,
    escHandler: function() {
      m.selectingLocation(lock) ?
        cancelSelectPhoneLocation(l.id(lock)) : closeLock(l.id(lock));
    },
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"], {phoneNumber: c.fullHumanPhoneNumber(lock)}),
    isDone: l.signedIn(lock),
    lock: lock,
    screenName: screenName,
    submitHandler: submitHandler
  };
}

export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      socialOrSms: open
    }
  },
  renderFn: render
};
