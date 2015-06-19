import { EventEmitter } from 'events';
import Immutable, { Map } from 'immutable';
import { ActionTypes, LockStates, Events } from '../constants/app_constants';
import ClientUtils from '../utils/client_utils';

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
        case ActionTypes.CHANGE_EMAIL:
          this._state = this._state.setIn(
            ["locks", action.lockID, "email"],
            action.email
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
          case ActionTypes.HIDE_LOCK:
            this._state = this._state.setIn(
              ["locks", action.lockID, "show"],
              false
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
              email: "",
              password: "",
              state: LockStates.WAITING_CLIENT_CONFIG,
              show: false,
              showOptions: Map({})
            })
          );
          this._state = this._state.setIn(
            ['clients', action.clientID],
            Map({id: action.clientID, loaded: false})
          );
          this.emitChange();
          break;
        case ActionTypes.SHOW_LOCK:
          this._state = this._state.setIn(
            ["locks", action.lockID, "show"],
            true
          ).setIn(
            ["locks", action.lockID, "showOptions"],
            prepareShowOptions(this.getLock(action.lockID), action.options)
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

  getLocks() {
    return this._state.get("locks").toList().map((lock) => {
      return this.getLock(lock.get("id"));
    });
  }
}

export default new AppStore();

function prepareShowOptions(lock, options) { // TODO this function doesn't belong here
  var responseType = options.responseType || options.callbackURL ? "code" : "token";

  var defaultConnection = ClientUtils.getDefaultConnection(lock.get("client"));

  var disableSignupAction = undefined === options.disableSignupAction ? true : !!options.disableSignupAction;
  disableSignupAction = defaultConnection.get("showSignup") && disableSignupAction;

  var disableResetAction = undefined === options.disableResetAction ? true : !!options.disableResetAction;
  disableResetAction = defaultConnection.get("showForgot") && disableResetAction;

  var preparedOptions = new Map({
    container: options.container || false,
    icon: options.icon || false,
    closable: undefined === options.closable ? !options.container : !!options.closable,
    focusInput: undefined === options.focusInput ? !options.container : !!options.focusInput,
    gravatar: undefined === options.gravatar ? true : !!options.gravatar,
    usernameStyle: undefined === options.usernameStyle ? 'email' : options.usernameStyle,
    disableSignupAction: disableSignupAction,
    disableResetAction: disableResetAction,
    // TODO this options should be passed to the Auth0 client
    responseType: responseType,
    callbackURL: options.callbackURL || null,
    callbackOnLocationHash: responseType === "token" || null,
  });

  return preparedOptions;
}
