import { openLock } from '../lock/actions';
import render from './render';

const NAME = "passwordless-email";

function open(id, options) {
  options.modeOptions = {send: options.send};
  openLock(id, NAME, options);
}

export default {
  name: NAME,
  open: open,
  render: render
};
