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
        case ActionTypes.RECEIVE_CLIENT:
          this._state = this._state.setIn(
            ['clients', action.attributes.id],
            Map(action.attributes)
          );
          this.emitChange();
          break;
        case ActionTypes.SETUP_LOCK: // TODO
          this._state = this._state.setIn(
            ['locks', action.clientID],
            Map({
              clientID: action.clientID,
              lockID: action.lockID,
              domain: action.domain,
              options: action.options
            })
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
}

export default new AppStore();
