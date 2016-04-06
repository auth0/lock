import Base from '../../field/vcode/ask_vcode';
import { restart, signIn } from './actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

export default class AskVcode extends Base {

  backHandler() {
    return restart;
  }

  submitHandler() {
    return signIn;
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

}
