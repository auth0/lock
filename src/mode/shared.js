import React from 'react';
import AskLocation from '../cred/phone-number/ask_location';
import {
  initialLocationSearchStr,
  selectingLocation
} from '../cred/phone-number/index';
import * as m from '../passwordless/index';

export function renderAskLocation(lock) {
  return selectingLocation(lock)
    ? <AskLocation
        initialLocationSearchStr={initialLocationSearchStr(lock)}
        key="auxiliarypane"
        lock={lock} />
    : null;
}
