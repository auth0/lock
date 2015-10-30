import AskEmail from '../../cred/email/ask_email';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import { requestPasswordlessEmail } from '../../passwordless/actions';
import * as m from '../../passwordless/index';


export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskEmailVcode(lock)
    : new AskEmail(lock, requestPasswordlessEmail, null);
}
