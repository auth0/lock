import React from 'react';
import AskLocation from '../cred/phone-number/ask_location';
import SignedInConfirmation from '../lock/signed_in_confirmation';
import { back, close } from '../passwordless/actions';
import * as l from '../lock/index';
import * as m from '../passwordless/index';

function buildCloseHandler(lock) {
  return function() {
    close(l.id(lock));
  }
}

export function buildBackHandler(lock, clearCred) {
  return function() {
    back(l.id(lock), {clearCred: clearCred});
  }
}

export function renderSignedInConfirmation(lock) {
  return l.signedIn(lock)
    ? <SignedInConfirmation
        closeHandler={buildCloseHandler(lock)}
        key="auxiliarypane"
        lock={lock} />
    : null;
}

export function renderAskLocation(lock) {
  return m.selectingLocation(lock)
    ? <AskLocation
        initialLocationSearchStr={m.initialLocationSearchStr(lock)}
        key="auxiliarypane"
        lock={lock} />
    : null;
}
