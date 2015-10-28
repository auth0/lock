import render from './render';
import { closeLock, openLock } from '../../lock/actions';
import { openFunctionArgsResolver } from '../../lock/mode';
import { setDefaultLocation } from '../../passwordless/actions';

const NAME = "socialOrSms";

function open(id, ...args) {
  const [options, callback] = openFunctionArgsResolver(NAME, args);
  const { connections } = options;
  if (!Array.isArray(connections) || connections.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }
  options.signInCallback = callback;
  options.modeOptions = {send: "sms", dictName: NAME, storageKey: NAME};
  if (options.defaultLocation && typeof options.defaultLocation === "string") {
    setDefaultLocation(id, options.defaultLocation.toUpperCase());
  }
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    close: closeLock,
    open: {
      socialOrSms: open
    }
  },
  renderFn: render
};
