import Immutable from 'immutable';
import { setClient, updateLocksWithClient } from '../store/index';
import * as l from '../lock/index';

export function requestClientSuccess(clientAttrs) {
  const client = Immutable.fromJS(clientAttrs);
  setClient(client);
  updateLocksWithClient(client.get("id"), lock => {
    const loadingMode = lock.get("loading");
    if (loadingMode) {
      return l.markReady(lock).set("mode", loadingMode);
    } else {
      return l.markReady(lock);
    }
  });
}

export function requestClientError(clientID) {
  updateLocksWithClient(clientID, l.markCrashed);
}

export function requestClientTimeout(clientID) {
  updateLocksWithClient(clientID, l.markCrashed);
}
