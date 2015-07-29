import AskEmail from './ask_email';
import EmailSentConfirmation from './email_sent_confirmation';
import { requestPasswordlessEmail, signIn } from './actions';
import * as m from './index';

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(lock.get("id"));
}

function askVerificationCodeSubmitHandler(lock) {
  signIn(lock.get("id"));
}

export default function render(lock) {
  return {
    completed: m.emailSent(lock),
    confirmation: m.emailSent(lock) && EmailSentConfirmation,
    content: AskEmail,
    submitHandler: !m.emailSent(lock) && askEmailSubmitHandler
  };

  // switch(state) {
  // case LockStates.ASK_VERIFICATION_CODE:
  //   return (
  //     <Lock lock={lock} showHeader={true} submitHandler={askVerificationCodeSubmitHandler}>
  //       <AskVerificationCode />
  //     </Lock>
  //   );
  // case LockStates.DONE:
  //   return <Lock lock={lock} showHeader={false}><Done /></Lock>;
  // case LockStates.READY:
  //   return (
  //     <Lock lock={lock} showHeader={true} submitHandler={askEmailSubmitHandler}>
  //       <AskEmail />
  //     </Lock>
  //   );
  // default:
  //   const mode = lock.get("mode");
  //   throw new Error(`unknown state ${state} for mode ${mode}`)
  // }
}
