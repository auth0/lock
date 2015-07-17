import Immutable from 'immutable';
import ImmutableStore from './immutable_store';
import Dispatcher from './dispatcher';
import lockReducer from '../lock/reducer';
import clientReducer from '../client/reducer';
import passwordlessEmailReducer from '../passwordless-email/reducer';

function reducer(s, e) {
  return s.update("clients", clients => clientReducer(clients, e))
    .update("locks", locks => passwordlessEmailReducer(lockReducer(locks, e), e));
}

const initialState = Immutable.fromJS({locks: {}, clients: {}});
const store = new ImmutableStore(reducer, initialState);
const dispatcher = new Dispatcher(store);

function getLocks() {
  return store.getState().get("locks").toList();
}

function getLock(id) {
  return store.getState().getIn(["locks", id]);
}

export default {
  dispatch: dispatcher.dispatch.bind(dispatcher),
  store: store,
  getLocks: getLocks,
  getLock: getLock
}
