import React from 'react';
import AskVcode from '../../cred/vcode/ask_vcode';
import AskPhoneNumber from '../../cred/phone-number/ask_phone_number';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import * as l from '../../lock/index';
import * as c from '../../cred/index';
import {
  buildBackHandler,
  renderAskLocation,
  renderSignedInConfirmation
} from '../shared';

// TODO: remove passwordless dep
import * as m from '../../passwordless/index';
import {
  cancelSelectPhoneLocation,
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

function render(lock) {
  let auxiliaryPane, backHandler, children, screenName, submitHandler;
  if (m.passwordlessStarted(lock)) {
    auxiliaryPane = renderSignedInConfirmation(lock);
    backHandler = buildBackHandler(lock, ["vcode"]);
    screenName = "code";
    const placeholder = l.ui.t(lock, [screenName, "codeInputPlaceholder"], {__textOnly: true});
    const resendLabel = l.ui.t(lock, [screenName, "resendLabel"], {__textOnly: true});
    children = <AskVcode lock={lock} placeholder={placeholder} resendLabel={resendLabel} />;
    submitHandler = signIn;
  } else {
    auxiliaryPane = renderAskLocation(lock);
    screenName = "phone";
    const placeholder = l.ui.t(lock, [screenName, "phoneNumberInputPlaceholder"], {__textOnly: true});
    children = <AskPhoneNumber lock={lock} placeholder={placeholder} />;
    submitHandler = sendSMS;
  }

  return {
    auxiliaryPane: auxiliaryPane,
    backHandler: backHandler,
    children: children,
    closeHandler: closeLock,
    disallowClose: m.selectingLocation(lock),
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
      sms: open
    }
  },
  renderFn: render
};
