import { EventEmitter } from 'events';
import { Map } from 'immutable';
import { ActionTypes, Events } from '../constants/app_constants';

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
        case ActionTypes.RECEIVE_CLIENT:
          this._state = this._state.setIn(
            ['clients', action.attributes.id],
            Map(action.attributes).set('loaded', true)
          );
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
              password: ""
            })
          );
          this._state = this._state.setIn(
            ['clients', action.clientID],
            Map({id: action.clientID, loaded: false})
          );
          this.emitChange();
          break;
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
