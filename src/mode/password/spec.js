import { Mode } from '../index';
import Login from '../../password/login';
import ResetPassword from '../../password/reset_password';
import SignUp from '../../password/sign_up';
import { getActivity, initPassword } from '../../password/index';

export default class Password extends Mode {

  constructor() {
    super("password");
  }

  willOpen(model, options) {
    this.setModel(initPassword(model, options));
  }

  render(lock) {
    const activity = getActivity(lock);
    switch(activity) {
      case "login":
      return new Login();

      case "signUp":
      return new SignUp();

      case "resetPassword":
      return new ResetPassword();

      default: // TODO: show a crashed screen.
      throw new Error("unknown activity");
    }
  }

}
