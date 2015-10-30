import Base from '../cred/email/ask_email';
import { requestPasswordlessEmail } from './actions';

export default class AskEmail extends Base {

  submitHandler() {
    return requestPasswordlessEmail;
  }

}
