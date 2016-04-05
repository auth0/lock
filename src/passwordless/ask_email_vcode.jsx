import Base from './ask_vcode';
import * as c from '../field/index';

export default class AskEmailVcode extends Base {

  constructor() {
    super("emailCode");
  }

  // TODO: fix this when adding passwordless
  // renderHeaderText(lock) {
  //   return this.t(lock, ["headerText"], {email: c.email(lock)});
  // }

}
