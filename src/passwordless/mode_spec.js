import { openLock } from '../lock/actions';
import { close, setDefaultLocation } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "passwordless";

function sms(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("sms", args);
  options.signInCallback = callback;
  options.modeOptions = {send: "sms", dictName: "sms", storageKey: "sms"};
  if (options.defaultLocation && typeof options.defaultLocation === "string") {
    setDefaultLocation(id, options.defaultLocation.toUpperCase());
  }
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      sms: sms
    }
  },
  renderFn: render
};
