import AppDispatcher from '../dispatchers/app_dispatcher';
import { ActionTypes } from '../constants/app_constants';

export default {
  receiveClient: function(client_attributes) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_CLIENT,
      attributes: client_attributes
    });
  },

  receiveClientError: function(lockID) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_CLIENT_ERROR,
      lockID: lockID
    });
  },

  receiveClientTimeout: function(lockID) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_CLIENT_TIMEOUT,
      lockID: lockID
    });
  }
}
