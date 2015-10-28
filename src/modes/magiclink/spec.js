import render from './render';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';

const NAME = "magiclink";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  options.signInCallback = callback;
  options.modeOptions = {send: "link", dictName: NAME, storageKey: NAME};
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      magiclink: open
    }
  },
  renderFn: render
};
