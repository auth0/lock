import { swap, updateEntity } from '../store/index';
import { openLock } from '../lock/actions';
import render from './render';
import * as l from '../lock/index';
import * as m from './index';

const NAME = "passwordless-email";

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

function magiclink(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("magiclink", args);
  options.signInCallback = callback;
  openLock(id, NAME, options);
}

function emailcode(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("emailcode", args);
  options.signInCallback = callback;
  options.modeOptions = {send: "code"};
  openLock(id, NAME, options);
}

function closeHandler(lock) {
  swap(updateEntity, "lock", l.id(lock), m.close);
}

export default {
  name: NAME,
  openMethods: {magiclink: magiclink, emailcode: emailcode},
  render: render,
  closeHandler: closeHandler
};
