import AskEmail from './ask_email';
import AskVerificationCode from './ask_verification_code';
import EmailSentConfirmation from './email_sent_confirmation';
import { reset, requestPasswordlessEmail, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';


function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function askVerificationCodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(lock) {
  reset(l.id(lock), false);
}

export default function render(lock) {
  if (m.isSendLink(lock)) {
    return {
      auxiliaryPane: m.emailSent(lock) && EmailSentConfirmation,
      mainPane: AskEmail,
      mainPaneKey: "ask-email",
      submitHandler: !m.emailSent(lock) && askEmailSubmitHandler
    };
  } else {
    return {
      backHandler: m.emailSent(lock) ? backHandler : null,
      mainPane: m.emailSent(lock) ? AskVerificationCode : AskEmail,
      mainPaneKey: m.emailSent(lock) ? "ask-verification-code" : "ask-email",
      submitHandler: m.emailSent(lock) ? askVerificationCodeSubmitHandler : askEmailSubmitHandler
    };
  }

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
