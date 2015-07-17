import { dispatch } from '../event-sourcing/index';
import { ActionTypes } from '../control/constants';
import WebApi from '../lock/web_api';

import { getLock } from '../event-sourcing/index';

export function changeEmail(lockID, email) {
  dispatch([{
    type: ActionTypes.CHANGE_EMAIL,
    lockID: lockID,
    email: email
  }]);
}

export function changeCode(lockID, email) {
  dispatch([{
    type: ActionTypes.CHANGE_CODE,
    lockID: lockID,
    code: code
  }]);
}

export function requestPasswordlessEmail(lockID) {
  dispatch([{
    type: ActionTypes.REQUEST_PASSWORDLESS_EMAIL,
    lockID: lockID
  }, () => {
    const lock = getLock(lockID);
    if (lock.get("validEmail")) {
      WebApi.requestPasswordlessEmail(lockID);
    }
  }]);
}

export function requestPasswordlessEmailSuccess(lockID) {
  dispatch([{
    type: ActionTypes.REQUEST_PASSWORDLESS_EMAIL_SUCCESS,
    lockID: lockID
  }]);
}

export function signIn(lockID) {
  dispatch([{
    type: ActionTypes.SIGN_IN,
    lockID: lockID
  }, () => {
    const lock = getLock(lockID);
    // TODO: pass the real options
    WebApi.signIn(lockID);
  }]);

}
