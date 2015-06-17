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
  }
}
