import atom from '../utils/atom';
import { Map } from 'immutable';

const store = atom(new Map({}));

export function observe(key, id, f) {
  subscribe(`${key}-${id}`, (_, oldState, newState) => {
    const m = getEntity(newState, 'lock', id);
    const oldM = getEntity(oldState, 'lock', id);
    if (m != oldM) f(m);
  });
}

export function subscribe(key, f) {
  store.addWatch(key, f);
}

export function unsubscribe(key) {
  store.removeWatch(key);
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

export function getEntity(state, coll, id = 0) {
  return state.getIn([coll, id]);
}

export function removeEntity(state, coll, id = 0) {
  return state.removeIn([coll, id]);
}

export function getCollection(state, coll) {
  return state.get(coll, Map()).toList();
}

// TODO: try to remove this fn
export function updateCollection(state, coll, f, ...args) {
  return state.update(coll, xs => f(xs, ...args));
}

export function getState() {
  return store.deref();
}

// DEV
// store.addWatch("keepHistory", (key, oldState, newState) => {
//   if (!global.window.h) global.window.h = []; global.window.h.push(newState);
//   console.debug("something changed", newState.toJS());
// });
