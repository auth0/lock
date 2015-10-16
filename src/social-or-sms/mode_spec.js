import { openLock } from '../lock/actions';
import { close } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "social-or-sms";

function socialOrSms(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("socialOrSms", args);
  options.signInCallback = callback;
  // TODO: review cred storage
  options.modeOptions = {send: "sms", dictName: "socialOrSms", storageKey: "socialOrSms"};
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
      socialOrSms: socialOrSms
    }
  },
  renderFn: render
};
