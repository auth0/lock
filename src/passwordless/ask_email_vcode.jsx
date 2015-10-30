import Base from './ask_vcode';
import * as c from '../cred/index';

export default class AskEmailVcode extends Base {

  renderHeaderText() {
    return this.t(["headerText"], {email: c.email(this.lock)});
  }

}
