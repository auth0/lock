import AskEmail from '../../cred/email/ask_email';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import { requestPasswordlessEmail } from '../../passwordless/actions';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';


export default function render(lock) {
  return m.passwordlessStarted(lock)
    ? new AskEmailVcode(lock, l.signedIn(lock))
    : new AskEmail(lock, false, requestPasswordlessEmail, null);
}
