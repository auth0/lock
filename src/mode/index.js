import { getEntity, read, setEntity, swap } from '../store/index';
import { closeLock, openLock } from '../lock/actions';
import trim from 'trim';

export class Mode {
  constructor(name) {
    this.name = name;
  }

  open(id, ...args) {
    const { name } = this;
    const [options, callback] = openFunctionArgsResolver(name, args);

    warnScopeOpenidProfile(options);
    options.signInCallback = callback;
    options.mode = {};

    this.id = id;
    this.options = options; // TODO: should clone
    const model = read(getEntity, "lock", id);

    this.willOpen(model, options);

    const result = openLock(id, name, this.options);

    delete this.id;
    delete this.options;

    return result;
  }

  // render must be implemented in each mode

  close(id, force) {
    closeLock(id, force);
  }

  setModel(m) {
    // TODO: unnecessary swap, should pass along the model
    swap(setEntity, "lock", this.id, m);
  }

  setOptions(options) {
    this.options = options; // TODO: should clone
  }

}

function openFunctionArgsResolver(fnName, args) {
  const defaultOptions = {};
  const defaultCallback = () => {};

  if (args.length == 0) {
    return [defaultOptions, defaultCallback];
  }

  if (args.length == 1) {
    if (typeof args[0] == "object") {
      return [args[0], defaultCallback];
    } else if (typeof args[0] == "function") {
      return [defaultOptions, args[0]];
    } else {
      throw new Error("When `" + fnName + "` is called with one argument, it must be an `options` object or a `callback` function.");
    }
  }

  if (args.length == 2) {
    if (typeof args[0] != "object") {
      throw new Error("When `" + fnName + "` is called with two arguments, an `options` object must be provided as the first argument.");
    }
    if (typeof args[1] != "function") {
      throw new Error("When `" + fnName + "` is called with two arguments, a `callback` function must be provided as the second argument.");
    }
    return args;
  }

  throw new Error("`" + fnName + "` must be called with two arguments at most.");
}

function warnScopeOpenidProfile(options) {
  // TODO: abstract warning output (should receive a message and emit the
  // warning unless they are disabled).
  const { authParams, disableWarnings } = options;
  if (authParams
      && typeof authParams === "object"
      && trim(authParams.scope || "") === "openid profile"
      && !disableWarnings
      && console
      && console.warn) {
    console.warn("Usage of scope 'openid profile' is not recommended. See https://auth0.com/docs/scopes for more details.");
  }
}
