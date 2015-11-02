import React from 'react';
import AskLocation from '../cred/phone-number/ask_location';
import * as m from '../passwordless/index';

export function renderAskLocation(lock) {
  return m.selectingLocation(lock)
    ? <AskLocation
        initialLocationSearchStr={m.initialLocationSearchStr(lock)}
        key="auxiliarypane"
        lock={lock} />
    : null;
}
