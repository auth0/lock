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
  }

}
