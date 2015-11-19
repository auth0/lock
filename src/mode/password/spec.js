import { Mode } from '../index';
import AskEmailAndPassword from '../../password/ask_email_and_password';
import SignUp from '../../password/sign_up';
import { getActivity, processPasswordOptions } from '../../password/index';

export default class Password extends Mode {

  constructor() {
    super("password");
  }

  willOpen(model, options) {
    this.setOptions(processPasswordOptions(options));
  }

  render(lock) {
    return getActivity(lock) === "login"
      ? new AskEmailAndPassword()
      : new SignUp();
  }

}
