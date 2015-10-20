import { openLock } from '../lock/actions';
import { close, setDefaultLocation } from './actions';
import { openFunctionArgsResolver } from '../lock/mode';
import render from './render';

const NAME = "passwordless";

export default {
  name: NAME,
  methods: {
    close: close,
    open: {}
  },
  renderFn: render
};
