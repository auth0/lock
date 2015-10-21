import React from 'react';
import Lock from '../../lock/lock';
import AskSocialNetworkOrPhoneNumber from '../../cred/or/ask_social_network_or_phone_number';
import AskVcode from '../../cred/vcode/ask_vcode';
import { openLock } from '../../lock/actions';
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

  const props = {
    auxiliaryPane: renderAskLocation(lock) || renderSignedInConfirmation(lock),
    backHandler: backHandler,
    children: children,
    closeHandler: close,
    escHandler: function() {
      m.selectingLocation(lock) ?
        cancelSelectPhoneLocation(l.id(lock)) : close(l.id(lock));
    },
    footerText: l.ui.t(lock, [screenName, "footerText"]),
    headerText: l.ui.t(lock, [screenName, "headerText"], {phoneNumber: c.fullHumanPhoneNumber(lock)}),
    isDone: l.signedIn(lock),
    lock: lock,
    screenName: screenName,
    submitHandler: submitHandler
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
