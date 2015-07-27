import atom from '../atom/index';
import Immutable, { Map } from 'immutable';
import { email } from '../credentials/index';

const store = atom(Immutable.fromJS({gravatar: {}, lock: {}}));

function set(state) {
  store.reset(state);
}

function update(f) {
  store.swap(f);
}

function updateCollection(coll, f, ...args) {
  update(state => state.update(coll, xs => f(xs, ...args)));
}

function updateFilteredCollection(coll, pred, f, ...args) {
  updateCollection(coll, xs => xs.merge(xs.filter(pred).map(x => f(x, ...args))));
}

function updateEntity(coll, id, f, ...args) {
  update(state => state.updateIn([coll, id], new Map({}), x => f(x, ...args)));
}

function setEntity(coll, id, x) {
  update(state => state.setIn([coll, id], x));
}

function getEntity(coll, id) {
  return store.deref().getIn([coll, id]);
}

function updateLocks(f) {
  updateCollection("lock", f);
}

export function updateLock(id, f, ...args) {
  updateEntity("lock", id, f, ...args);
}

export function setLock(lock) {
  setEntity("lock", lock.get("id"), lock);
}

export function getLock(id) {
  return getEntity("lock", id);
}

export function getGravatar(email) {
  return getEntity("gravatar", email);
}

export function updateGravatar(email, f) {
  updateEntity("gravatar", email, f);
}

function deriveUIState(state) {
  return state.get("lock").map(lock => {
    const gravatar = getGravatar(email(lock)) || new Map({});
    return lock.set("gravatar", gravatar.get("loaded") ? gravatar : null);
  });
}

export function subscribe(key, f) {
  store.addWatch(key, (key, oldState, newState) => f(deriveUIState(newState)));
}

export function getUIState() {
  return deriveUIState(store.deref());
}

// DEV
// store.addWatch("keepHistory", (key, oldState, newState) => {
//   if (!global.window.h) global.window.h = []; global.window.h.push(newState);
//   console.debug("something changed", newState.toJS());
// });
