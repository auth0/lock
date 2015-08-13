import { openLock } from '../lock/actions';
import { close } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "passwordless-sms";

function sms(id, ...args) {
  const [options, callback] = openFunctionArgsResolver("magiclink", args);
  options.signInCallback = callback;
  return openLock(id, NAME, options);
}

export default {
  name: NAME,
  methods: {
    open: {sms: sms},
    close: close
  },
  renderFn: render
};
