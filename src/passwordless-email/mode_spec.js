import { LockModes } from '../control/constants';
import { openLock } from '../lock/actions';

export default {
  name: "passwordless-email",
  open: function(id, options) {
    options.modeOptions = {send: options.send};
    openLock(this.id, LockModes.PASSWORDLESS_EMAIL, options);
  }
};
