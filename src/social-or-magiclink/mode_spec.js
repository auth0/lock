import { openLock } from '../lock/actions';
import { close } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "social-or-magiclink";

function socialOrMagiclink(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("socialOrMagiclink", args);
  options.signInCallback = callback;
  // TODO: review cred storage
  options.modeOptions = {dictName: "socialOrMagiclink", storageKey: "socialOrMagiclink"};
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      socialOrMagiclink: socialOrMagiclink
    }
  },
  renderFn: render
};
