import Dispatcher from '../control/dispatcher';
import { ActionTypes } from '../control/constants';

export default {
  receiveClient: function(client_attributes) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_CLIENT,
      attributes: client_attributes
    });
  },

  receiveClientError: function(lockID) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_CLIENT_ERROR,
      lockID: lockID
    });
  },

  receiveClientTimeout: function(lockID) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_CLIENT_TIMEOUT,
      lockID: lockID
    });
  }
}
