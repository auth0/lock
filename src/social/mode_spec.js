import { openLock } from '../lock/actions';
import { close } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "social";

function social(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("social", args);
  options.signInCallback = callback;
  options.modeOptions = {dictName: "social", storageKey: "social"};
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: close,
    open: {
      social: social
    }
  },
  renderFn: render
};
