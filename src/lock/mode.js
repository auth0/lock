import { getEntity, read, setEntity, swap } from '../store/index';
import { closeLock, openLock } from '../lock/actions';

export default class Mode {
  constructor(name, dict = {}) {
    this.name = name;
    this.dict = dict;
  }

  execHook(str, id, ...args) {
    if (typeof this[str] != "function") return;
    this.id = id;
    const model = read(getEntity, "lock", id);
    const result = this[str](model, ...args);
    delete this.id;
    return result;
  }

  open(id, ...args) {
    const { name } = this;
    // TODO: we're silently ignoring the callback so things don't
    // explode during a change that moves options and callback to the
    // constructor. When the change is done, this should not be needed
    // anymore.
    const [options, _] = openFunctionArgsResolver(name, args);

    // TODO: figure it out if we still need this, it doesn't seem
    // right.
    options.mode = {};

    this.options = options; // TODO: should clone

    this.execHook("willOpen", id, options);

    const result = openLock(id, name, this.options);

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
