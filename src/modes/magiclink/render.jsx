import AskEmail from '../../cred/email/ask_email';
import { requestPasswordlessEmail } from '../../passwordless/actions';
import { renderEmailSentConfirmation } from '../shared';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return new AskEmail(
    lock,
    m.passwordlessStarted(lock),
    !m.passwordlessStarted(lock) && requestPasswordlessEmail,
    renderEmailSentConfirmation(lock)
  );
}
