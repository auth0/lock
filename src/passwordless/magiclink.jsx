import Base from './ask_email';
import { renderEmailSentConfirmation } from './email_sent_confirmation';

export default class Magiclink extends Base {

  renderAuxiliaryPane(lock) {
    return renderEmailSentConfirmation(lock);
  }

}
