import { Mode } from '../index';
import Login from '../../database/login';
import ResetPassword from '../../database/reset_password';
import SignUp from '../../database/sign_up';
import { getActivity, initDatabase } from '../../database/index';

export default class Database extends Mode {

  constructor() {
    super("database");
  }

  willOpen(model, options) {
    this.setModel(initDatabase(model, options));
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
