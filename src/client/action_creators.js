import { ActionTypes } from '../control/constants';
import { dispatch } from '../event-sourcing/index';

export default {
  receiveClient: function(client_attrs) {
    dispatch([{
      type: ActionTypes.RECEIVE_CLIENT,
      attrs: client_attrs
    }]);
  },

  receiveClientError: function(clientID) {
    dispatch([{
      type: ActionTypes.RECEIVE_CLIENT_ERROR,
      clientID: clientID
    }]);
  },

  receiveClientTimeout: function(clientID) {
    dispatch([{
      type: ActionTypes.RECEIVE_CLIENT_TIMEOUT,
      clientID: clientID
    }]);
  }
}
