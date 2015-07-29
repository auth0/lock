import IDUtils from '../utils/id_utils';
import { closeLock, setupLock } from './actions';
import WebAPI from './web_api';

export default class Auth0Lock {
  static registerMode(spec) {
    this.modes = this.modes || {};
    this.modes[spec.name] = spec;
  }

  static modeRender(name) {
    return (this.modes || {})[name].render;
  }

  static modeOpen(name) {
    return (this.modes || {})[name].open;
  }

  constructor(clientID, domain) {
    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }

    this.id = IDUtils.random();
    setupLock(this.id, clientID, domain);
  }

  open(mode, optionsOrCallback, callback) {
    // Argument validation
    if (typeof mode != "string") {
      throw new Error("A `mode` string must be provided as first argument.");
    }

    let options;

    if (arguments.length == 2) {
      if (typeof optionsOrCallback == "object") {
        options = optionsOrCallback;
      } else if (typeof optionsOrCallback == "function") {
        callback = optionsOrCallback
      } else {
        throw new Error("An `option` object or a `callback` function must be provided as a second argument.");
      }
    } else {
      options = optionsOrCallback;
      if (typeof options != "object") {
        throw new Error("An `option` object must be provided as a second argument.");
      }
      if (typeof callback != "function") {
        throw new Error("A `callback` function must be provided as a third argument.");
      }
    }

    // Dispatch according to the given mode
    const modeOpen = Auth0Lock.modeOpen(mode);

    if (typeof modeOpen != "function") {
      throw new Error("Unknown `mode` " + mode + ".");
    }

    options = options || {};
    options.signInCallback = callback;
    modeOpen(this.id, options);
  }

  close() {
    closeLock(this.id);
  }

  logout(query = {}) {
    // TODO: create action
    WebAPI.signOut(this.id, query);
  }
}
