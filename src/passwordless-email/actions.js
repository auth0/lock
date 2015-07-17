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

export function requestPasswordlessLinkEmail(lockID) {
  dispatch([{
    type: ActionTypes.REQUEST_PASSWORDLESS_LINK_EMAIL,
    lockID: lockID,
  }, () => {
    const lock = getLock(lockID);
    if (lock.get("validEmail")) {
      WebApi.requestPasswordlessLinkEmail(lockID);
    }
  }]);
}

export function requestPasswordlessLinkEmailSuccess(lockID) {
  dispatch([{
    type: ActionTypes.REQUEST_PASSWORDLESS_LINK_EMAIL_SUCCESS,
    lockID: lockID,
  }]);
}
