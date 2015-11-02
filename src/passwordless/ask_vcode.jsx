import Base from '../cred/vcode/ask_vcode';
import { back, signIn } from './actions';
import { renderSignedInConfirmation } from '../mode/shared';

export default class AskVcode extends Base {

  backHandler() {
    return (id) => back(id, {clearCred: ["vcode"]});
  }

  submitHandler() {
    return signIn;
  }

  renderAuxiliaryPane() {
    return renderSignedInConfirmation(this.lock);
  }

}
