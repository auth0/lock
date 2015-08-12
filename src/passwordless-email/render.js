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

function backHandler(id) {
  reset(id);
}

export default function render(lock) {
  if (lock.getIn(["modeOptions", "send"]) == "code") {
    return {
      backHandler: m.emailSent(lock) ? backHandler : undefined,
      content: m.emailSent(lock) ? AskVerificationCode : AskEmail,
      submitHandler: m.emailSent(lock) ? askVerificationCodeSubmitHandler : askEmailSubmitHandler
    }
  } else {
    return {
      completed: m.emailSent(lock), // TODO: completed is true when there's a confirmation, can be derived
      confirmation: m.emailSent(lock) && EmailSentConfirmation,
      content: AskEmail,
      submitHandler: !m.emailSent(lock) && askEmailSubmitHandler
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
