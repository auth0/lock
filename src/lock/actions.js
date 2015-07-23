import { ActionTypes } from '../control/constants';
import LockWebAPI from './web_api';
import * as Gravatar from '../gravatar/index';

import { setLock, updateLock } from '../store/index';
import * as l from './index';

export function setupLock(lockID, clientID, domain, options) {
  setLock(l.setup({
    lockID: lockID,
    clientID: clientID,
    domain: domain,
    options: options
  }));

  LockWebAPI.setupClient(lockID, clientID, domain, options);
}

export function showLock(lockID, options) {
  updateLock(lockID, l.show, options);
}

export function hideLock(lockID) {
  updateLock(lockID, l.hide);
}
