export default {
  emailcode: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "An email with the code has been sent to {email}.",
      resendLabel: "Did not get the code?"
    },
    confirmation: {
      success: "Thanks for signing in."
    },
    email: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Enter your email to sign in or create an account"
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  error: {
    passwordless: {
      "bad.tenant": "We're sorry, we can't send you the {medium} because there's a configuration problem",
      "bad.client_id": "We're sorry, we can't send you the {medium} because there's a configuration problem",
      "bad.connection": "We're sorry, we can't send you the {medium} because there's a configuration problem",
      "bad.send": "We're sorry, we can't send you the {medium} because there's an internal error",
      "bad.authParams": "We're sorry, we can't send you the {medium} because there's an internal error",
      "bad.request": "We're sorry, we can't send you the {medium} because there's an internal error",
      "bad.email": "The email is invalid",
      "bad.phone_number": "The phone number is invalid",
      "lock.request": "We're sorry, something went wrong when sending the {medium}",
      "sms_provider_error": "We're sorry, something went wrong when sending the SMS"
    },
    signIn: {
      "invalid_user_password": "Wrong {cred} or verification code",
      "lock.request": "We're sorry, something went wrong when attempting to sign in"
    }
  },
  magiclink: {
    confirmation: {
      failedLabel: "Failed!",
      retryLabel: "Retry",
      resendLabel: "Resend",
      resendingLabel: "Resending...",
      sentLabel: "Sent!",
      success: "We sent you a link to sign in<br />to {email}."
    },
    email: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Enter your email to sign in or create an account"
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  sms: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "An SMS with the code has been sent to {phoneNumber}.",
      resendLabel: "Did not get the code?"
    },
    confirmation: {
      success: "Thanks for signing in."
    },
    location: {
      locationFilterInputPlaceholder: "Select your country"
    },
    phone: {
      footerText: "",
      headerText: "Enter your phone to sign in or create an account",
      phoneNumberInputPlaceholder: "your phone number"
    },
    title: "Auth0"
  }
};
