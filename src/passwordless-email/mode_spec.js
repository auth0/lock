import { openLock } from '../lock/actions';
import render from './render';

const NAME = "passwordless-email";

function magiclink(id, options, callback) {
  options.signInCallback = callback;
  openLock(id, NAME, options);
}

function emailcode(id, options, callback) {
  options.modeOptions = {send: "code"};
  options.signInCallback = callback;
  openLock(id, NAME, options);
}

export default {
  name: NAME,
  openMethods: {magiclink: magiclink, emailcode: emailcode},
  render: render
};
