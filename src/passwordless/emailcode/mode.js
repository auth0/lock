import Mode from '../../lock/mode';
import AskEmail from '../ask_email';
import AskEmailVcode from '../ask_email_vcode';
import { initPasswordless, passwordlessStarted } from '../index';

export default class EmailcodeMode extends Mode {

  constructor() {
    super("emailcode");
  }

  willOpen(model, options) {
    this.setModel(initPasswordless(model, {send: "code"}));
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskEmail();
  }

}
