import { openLock } from '../lock/actions';
import { close } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "social-or-emailcode";

function socialOrEmailcode(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("socialOrEmailcode", args);
  options.signInCallback = callback;
  // TODO: review cred storage
  options.modeOptions = {send: "code", dictName: "socialOrEmailcode", storageKey: "socialOrEmailcode"};
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      socialOrEmailcode: socialOrEmailcode
    }
  },
  renderFn: render
};
