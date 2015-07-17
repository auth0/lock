import Immutable from 'immutable';
import { ActionTypes } from '../control/constants';

function resetClient(clients, client) {
  return clients.set(client.get("id"), client);
}

export default function reducer(clients, e) {
  switch(e.type) {
  case ActionTypes.RECEIVE_CLIENT:
    return resetClient(clients, Immutable.fromJS(e.attrs));
  default:
    return clients;
  }
}
