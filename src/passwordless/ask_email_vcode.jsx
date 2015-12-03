import Base from './ask_vcode';
import * as c from '../cred/index';

export default class AskEmailVcode extends Base {

  renderHeaderText(lock) {
    return this.t(lock, ["headerText"], {email: c.email(lock)});
  }

}
