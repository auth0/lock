import AppDispatcher from '../dispatchers/app_dispatcher';
import { ActionTypes } from '../constants/app_constants';
import WebAPIUtils from '../utils/web_api_utils';

export default {
  setupLock: function(lockID, clientID, domain, options) {
    AppDispatcher.dispatch({
      type: ActionTypes.SETUP_LOCK,
      lockID: lockID,
      clientID: clientID,
      domain: domain,
      options: options
    });

    WebAPIUtils.setupClient(lockID, clientID, domain, options);
  },

  changeUsername: function(lockID, username) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_USERNAME,
      lockID: lockID,
      username: username
    });
  },

  changePassword: function(lockID, password) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PASSWORD,
      lockID: lockID,
      password: password
    });
  },

  signIn: function(lockID) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGN_IN,
      lockID: lockID
    });

    WebAPIUtils.signIn(lockID);
  },

  successfulSignIn: function(lockID, signIn) {
    AppDispatcher.dispatch({
      type: ActionTypes.SUCCESSFUL_SIGN_IN,
      lockID: lockID,
      signIn: signIn
    });
  },

  failedSignIn: function(lockID, error) {
    AppDispatcher.dispatch({
      type: ActionTypes.FAILED_SIGN_IN,
      lockID: lockID,
      error: error
    });
  },

  showLock: function(lockID, options) {
    AppDispatcher.dispatch({
      type: ActionTypes.SHOW_LOCK,
      lockID: lockID,
      options: options
    });
  },

  hideLock: function(lockID) {
    AppDispatcher.dispatch({
      type: ActionTypes.HIDE_LOCK,
      lockID: lockID
    });
  }
}
