import Base from './ask_email';
import { renderEmailSentConfirmation } from './email_sent_confirmation';

export default class Magiclink extends Base {

  renderAuxiliaryPane() {
    return renderEmailSentConfirmation(this.lock);
  }

}
