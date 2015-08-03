import atom from '../atom/index';
import Immutable, { Map } from 'immutable';
import { email } from '../credentials/index';
import * as g from '../gravatar/index';

const store = atom(Immutable.fromJS({}));

export function subscribe(key, f) {
  store.addWatch(key, f);
}

export function swap(...args) {
  return store.swap(...args);
}

export function updateEntity(state, coll, id, f, ...args) {
  return state.updateIn([coll, id], new Map({}), x => f(x, ...args));
}

export function setEntity(state, coll, id, m) {
  return state.setIn([coll, id], m);
}

export function read(f, ...args) {
  return f(store.deref(), ...args);
}

export function getEntity(state, coll, id) {
  return state.getIn([coll, id]);
}

// function updateCollection(coll, f, ...args) {
//   store.swap(state => state.update(coll, xs => f(xs, ...args)));
// }
//
// function updateFilteredCollection(coll, pred, f, ...args) {
//   updateCollection(coll, xs => xs.merge(xs.filter(pred).map(x => f(x, ...args))));
// }

function deriveUIState(state) {
  return state.get("lock").map(lock => {
    const gravatar = getEntity(state, "gravatar", email(lock)) || new Map({});
    return lock.set("gravatar", g.loaded(gravatar) ? gravatar : null);
  });
}

export function getUIState() {
  return deriveUIState(store.deref());
}

// DEV
// store.addWatch("keepHistory", (key, oldState, newState) => {
//   if (!global.window.h) global.window.h = []; global.window.h.push(newState);
//   console.debug("something changed", newState.toJS());
// });
