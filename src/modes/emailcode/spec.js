import render from './render';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';

const NAME = "emailcode";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {send: "code", dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      emailcode: open
    }
  },
  renderFn: render
};
