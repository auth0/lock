import Immutable from 'immutable';
import ImmutableStore from './immutable_store';
import Dispatcher from './dispatcher';

function reducer(s, e) {
  return s;
}

const store = new ImmutableStore(reducer, Immutable.fromJS({}));
const dispatcher = new Dispatcher(store);

export default {
  dispatch: dispatcher.dispatch.bind(dispatcher),
  store: store
}
