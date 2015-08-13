import { openLock } from '../lock/actions';
import { close } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "passwordless-email";

function magiclink(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("magiclink", args);
  options.signInCallback = callback;
  return openLock(id, NAME, options);
}

function emailcode(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("emailcode", args);
  options.signInCallback = callback;
  options.modeOptions = {send: "code"};
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    open: {magiclink: magiclink, emailcode: emailcode},
    close: close
  },
  renderFn: render
};
