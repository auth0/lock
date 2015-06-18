import { EventEmitter } from 'events';
import Immutable, { Map } from 'immutable';
import { ActionTypes, LockStates, Events } from '../constants/app_constants';

import AppDispatcher from '../dispatchers/app_dispatcher';

export default class AppStore extends EventEmitter {
  constructor() {
    super();
    this._state = Map({clients: Map(), locks: Map()});
    AppDispatcher.register((action) => {
      switch(action.type) {
        // TODO investigate the use of Record instead of Map for clients and
        // locks
        case ActionTypes.CHANGE_PASSWORD:
          this._state = this._state.setIn(
            ["locks", action.lockID, "password"],
            action.password
          );
          this.emitChange();
          break;
        case ActionTypes.CHANGE_USERNAME:
          this._state = this._state.setIn(
            ["locks", action.lockID, "username"],
            action.username
          );
          this.emitChange();
          break;
        case ActionTypes.FAILED_SIGN_IN:
          this._state = this._state.setIn(
            ["locks", action.lockID, "state"],
            LockStates.FAILED_SIGN_IN
          ).setIn(
            ["locks", action.lockID, "error"],
            Immutable.fromJS(action.error)
          );
          this.emitChange();
          break;
        case ActionTypes.RECEIVE_CLIENT:
          this._state = this._state.setIn(
            ['clients', action.attributes.id],
            Immutable.fromJS(action.attributes).set('loaded', true)
          );
          var lock = this._state.get("locks").find((v, k) => {
            return v.get("clientID") == action.attributes.id;
          });
          if (lock) {
            this._state = this._state.setIn(
              ["locks", lock.get("id"), "state"],
              LockStates.READY
            );
          }
          this.emitChange();
          break;
        case ActionTypes.SETUP_LOCK: // TODO
          this._state = this._state.setIn(
            ['locks', action.lockID],
            Map({
              clientID: action.clientID,
              id: action.lockID,
              domain: action.domain,
              options: action.options,
              username: "",
              password: "",
              state: LockStates.WAITING_CLIENT_CONFIG
            })
          );
          this._state = this._state.setIn(
            ['clients', action.clientID],
            Map({id: action.clientID, loaded: false})
          );
          this.emitChange();
          break;
        case ActionTypes.SIGN_IN:
          this._state = this._state.setIn(
            ["locks", action.lockID, "state"],
            LockStates.SIGNING_IN
          );
          this.emitChange();
        case ActionTypes.SUCCESSFUL_SIGN_IN:
          this._state = this._state.setIn(
            ["locks", action.lockID, "state"],
            LockStates.SIGNED_IN
          ).setIn(
            ["locks", action.lockID, "signIn"],
            Immutable.fromJS(action.signIn)
          ).removeIn(["locks", action.lockID, "error"]);
        default:
         // no op
      }
    });
  }

  emitChange() {
    this.emit(Events.CHANGE);
  }

  addChangeListener(callback) {
    this.on(Events.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Events.CHANGE, callback);
  }

  get state() {
    return this._state;
  }

  getLock(id) {
    var lock = this._state.getIn(['locks', id]);
    var client = this._state.getIn(['clients', lock.get('clientID')]);
    return lock.set('client', client);
  }
}

export default new AppStore();
