import { openLock } from '../lock/actions';
import { close, setDefaultLocation } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "passwordless";

function emailcode(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("emailcode", args);
  options.signInCallback = callback;
  options.modeOptions = {send: "code"};
  return openLock(id, NAME, options);
}

function magiclink(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("magiclink", args);
  options.signInCallback = callback;
  options.modeOptions = {send: "link"};
  return openLock(id, NAME, options);
}

function sms(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("sms", args);
  options.signInCallback = callback;
  options.modeOptions = {send: "sms"};
  if (options.defaultLocation) setDefaultLocation(id, options.defaultLocation);
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      emailcode: emailcode,
      magiclink: magiclink,
      sms: sms
    }
  },
  renderFn: render
};
