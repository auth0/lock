import React from 'react';
import AskLocation from '../cred/phone-number/ask_location';
import EmailSentConfirmation from '../cred/email/email_sent_confirmation';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import { back, close } from '../passwordless/actions';
import * as l from '../lock/index';
import * as m from '../passwordless/index';

function buildCloseHandler(lock) {
  return function() {
    close(l.id(lock));
  }
}

export function renderSignedInConfirmation(lock, props = {}) {
  props.closeHandler = buildCloseHandler(lock);
  props.key = "auxiliarypane";
  props.lock = lock;

  return l.signedIn(lock) ? <SignedInConfirmation {...props} /> : null;
}

export function renderAskLocation(lock) {
  return m.selectingLocation(lock)
    ? <AskLocation
        initialLocationSearchStr={m.initialLocationSearchStr(lock)}
        key="auxiliarypane"
        lock={lock} />
    : null;
}

export function renderEmailSentConfirmation(lock, props = {}) {
  props.key = "auxiliarypane";
  props.lock = lock;

  return m.passwordlessStarted(lock)
    ? <EmailSentConfirmation {...props} />
    : null;
}
