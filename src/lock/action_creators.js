import Dispatcher from '../control/dispatcher';
import { ActionTypes } from '../control/constants';
import LockWebAPI from './web_api';

export default {
  setupLock: function(lockID, clientID, domain, options) {
    Dispatcher.dispatch({
      type: ActionTypes.SETUP_LOCK,
      lockID: lockID,
      clientID: clientID,
      domain: domain,
      options: options
    });

    LockWebAPI.setupClient(lockID, clientID, domain, options);
  },

  changeEmail: function(lockID, email) {
    Dispatcher.dispatch({
      type: ActionTypes.CHANGE_EMAIL,
      lockID: lockID,
      email: email
    });
  },

  changePassword: function(lockID, password) {
    Dispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD,
      lockID: lockID,
      password: password
    });
  },

  signIn: function(lockID) {
    Dispatcher.dispatch({
      type: ActionTypes.SIGN_IN,
      lockID: lockID
    });

    LockWebAPI.signIn(lockID);
  },

  successfulSignIn: function(lockID, signIn) {
    Dispatcher.dispatch({
      type: ActionTypes.SUCCESSFUL_SIGN_IN,
      lockID: lockID,
      signIn: signIn
    });
  },

  failedSignIn: function(lockID, error) {
    Dispatcher.dispatch({
      type: ActionTypes.FAILED_SIGN_IN,
      lockID: lockID,
      error: error
    });
  },

  showLock: function(lockID, options) {
    Dispatcher.dispatch({
      type: ActionTypes.SHOW_LOCK,
      lockID: lockID,
      options: options
    });
  },

  hideLock: function(lockID) {
    Dispatcher.dispatch({
      type: ActionTypes.HIDE_LOCK,
      lockID: lockID
    });
  },

  invalidateCredentials: function(lockID, validations) {
    Dispatcher.dispatch({
      type: ActionTypes.INVALIDATE_CREDENTIALS,
      lockID: lockID,
      validations: validations
    });
  }
}
