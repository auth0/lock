import { EventEmitter } from 'events';
import Immutable, { Map } from 'immutable';
import { ActionTypes, LockStates, Events } from './constants';
import Client from '../client/client';

import Dispatcher from './dispatcher';

export default class Store extends EventEmitter {
  constructor() {
    super();
    this._state = Map({clients: Map(), locks: Map()});
    Dispatcher.register((action) => {
      // TOOD maybe move this thing out of the constructor?
      switch(action.type) {
        // TODO add some functions to abstract state updates and remove some
        // duplication.
        // TODO investigate the use of Record instead of Map for clients and
        // locks.
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
          // TODO translate `action.error.code` to validation flags, for
          // instance:
          //   if (action.error.code === "invalid_user_password") {
          //     this._state = this._state.setIn(
          //       ["locks", action.lockID, "validations"],
          //       Map({email: false, password: false})
          //     );
          //   }
          this.emitChange();
          break;
        case ActionTypes.HIDE_LOCK:
          this._state = this._state.setIn(
            ["locks", action.lockID, "show"],
            false
          );
          this.emitChange();
          break;
        case ActionTypes.INVALIDATE_CREDENTIALS:
          this._state = this._state.setIn(
            ["locks", action.lockID, "validations"],
            Immutable.fromJS(action.validations)
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
          // TODO maybe we can recover from this when the client config is
          // received after the timeout expired
          if (lock && lock.get("state") !== LockStates.CRASHED) {
            this._state = this._state.setIn(
              ["locks", lock.get("id"), "state"],
              LockStates.READY
            );
          }
          this.emitChange();
          break;
        case ActionTypes.RECEIVE_CLIENT_ERROR:
        case ActionTypes.RECEIVE_CLIENT_TIMEOUT:
          this._state = this._state.setIn(
            ["locks", action.lockID, "state"],
            LockStates.CRASHED
          );
          // TODO probably need to acknolwedge this error in the client data
          this.emitChange();
          break;
        case ActionTypes.SETUP_LOCK:
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
              showOptions: Map({}),
              validations: Map({email: true, password: true})
            })
          );
          this._state = this._state.setIn(
            ['clients', action.clientID],
            Map({id: action.clientID, loaded: false})
          );
          this.emitChange();
          break;
        case ActionTypes.SHOW_LOCK:
          if (!this._state.getIn(["locks", action.lockID, "show"])) {
            this._state = this._state.setIn(
              ["locks", action.lockID, "show"],
              true
            ).setIn(
              ["locks", action.lockID, "showOptions"],
              prepareShowOptions(this.getLock(action.lockID), action.options)
            );
            this.emitChange();
          }
          break;
        case ActionTypes.SIGN_IN:
          this._state = this._state.setIn(
            ["locks", action.lockID, "state"],
            LockStates.SIGNING_IN
          );
          this._state = this._state.setIn(
            ["locks", action.lockID, "validations"],
            Map({email: true, password: true})
          );
          this.emitChange();
          break;
        case ActionTypes.SUCCESSFUL_SIGN_IN:
          this._state = this._state.setIn(
            ["locks", action.lockID, "state"],
            LockStates.SIGNED_IN
          ).setIn(
            ["locks", action.lockID, "signIn"],
            Immutable.fromJS(action.signIn)
          ).setIn(
            ["locks", action.lockID, "show"],
            false
          ).removeIn(["locks", action.lockID, "error"]);
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

  getLocks() {
    return this._state.get("locks").toList().map((lock) => {
      return this.getLock(lock.get("id"));
    });
  }
}

export default new Store();

function prepareShowOptions(lock, options) { // TODO this function doesn't belong here
  if (lock.get("state") === LockStates.CRASHED) {
    return Map({});
  }

  var responseType = options.responseType || options.callbackURL ? "code" : "token";

  var defaultConnection = Client.getDefaultConnection(lock.get("client"));

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
    signInCallback: options.signInCallback,
    responseType: responseType,
    callbackURL: options.callbackURL || null,
    callbackOnLocationHash: responseType === "token" || null,
  });

  return preparedOptions;
}

// TODO we are not taking advantage of the immutable data structures when
// rendering. See the PureRenderMixin at
// http://facebook.github.io/react/docs/pure-render-mixin.html
