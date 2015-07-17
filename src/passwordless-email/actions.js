import { dispatch } from '../event-sourcing/index';
import { ActionTypes } from '../control/constants';

export function changeEmail(lockID, email) {
  dispatch([{
    type: ActionTypes.CHANGE_EMAIL,
    lockID: lockID,
    email: email
  }]);
}
