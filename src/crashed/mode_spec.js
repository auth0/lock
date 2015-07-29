import { openLock } from '../lock/actions';
import render from './render';

const NAME = "crashed";

function open(id, options) {
  throw new Error(`Lock can't be opened in ${NAME} mode.`);
}

export default {
  name: NAME,
  open: open,
  render: render
};
