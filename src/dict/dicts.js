export default {
  emailcode: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "An email with the code has been sent to {email}.",
      resendLabel: "Did not get the code?"
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    email: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Enter your email to sign in<br>or create an account"
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
      "sms_provider_error": "We're sorry, something went wrong when sending the SMS",
      "sms_provider_error.bad_phone_number": "The number {phoneNumber} is not a valid phone number"
    },
    signIn: { // TODO: this won't do it for user/password sign in
      "invalid_user_password": "Wrong {cred} or verification code",
      "lock.popup_closed": "Popup window closed. Try again.",
      "lock.request": "We're sorry, something went wrong when attempting to sign in",
      "lock.unauthorized": "Permissions were not granted. Try again."
    }
  },
  magiclink: {
    emailSent: {
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
      headerText: "Enter your email to sign in<br>or create an account"
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  database: {
    login: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "",
      passwordInputPlaceholder: "your password",
      usernameInputPlaceholder: "your username"
    },
    resetPassword: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Please enter your email and the new password. We will send you an email to confirm the password change.",
      passwordConfirmationInputPlaceholder: "confirm password",
      passwordInputPlaceholder: "your password",
      usernameInputPlaceholder: "your username"
    },
    signUp: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "",
      passwordInputPlaceholder: "your password",
      usernameInputPlaceholder: "your username",
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    signedUp: {
      success: "Thanks for signing up."
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
    signedIn: {
      success: "Thanks for signing in."
    },
    location: {
      locationFilterInputPlaceholder: "Select your country"
    },
    phone: {
      footerText: "",
      headerText: "Enter your phone to sign in<br>or create an account",
      phoneNumberInputPlaceholder: "your phone number"
    },
    title: "Auth0"
  },
  social: {
    network: {
      footerText: "",
      headerText: "",
      smallSocialButtonsHeader: "Login with"
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    title: "Auth0"
  },
  socialOrDatabase: {
    networkOrLogin: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "",
      passwordInputPlaceholder: "your password",
      separatorText: "or",
      smallSocialButtonsHeader: "",
      usernameInputPlaceholder: "your username"
    },
    resetPassword: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "Please enter your email and the new password. We will send you an email to confirm the password change.",
      passwordConfirmationInputPlaceholder: "confirm password",
      passwordInputPlaceholder: "your password",
      usernameInputPlaceholder: "your username"
    },
    signUp: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "",
      passwordInputPlaceholder: "your password",
      usernameInputPlaceholder: "your username",
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    signedUp: {
      success: "Thanks for signing up."
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  socialOrEmailcode: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "An email with the code has been sent to {email}.",
      resendLabel: "Did not get the code?"
    },
    networkOrEmail: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "",
      separatorText: "Otherwise, enter your email to sign in<br>or create an account",
      smallSocialButtonsHeader: "Login with"
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  socialOrMagiclink: {
    emailSent: {
      failedLabel: "Failed!",
      retryLabel: "Retry",
      resendLabel: "Resend",
      resendingLabel: "Resending...",
      sentLabel: "Sent!",
      success: "We sent you a link to sign in<br />to {email}."
    },
    networkOrEmail: {
      emailInputPlaceholder: "yours@example.com",
      footerText: "",
      headerText: "",
      separatorText: "Otherwise, enter your email to sign in<br>or create an account",
      smallSocialButtonsHeader: "Login with"
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  socialOrSms: {
    code: {
      codeInputPlaceholder: "Your code",
      footerText: "",
      headerText: "An SMS with the code has been sent to {phoneNumber}.",
      resendLabel: "Did not get the code?"
    },
    signedIn: {
      success: "Thanks for signing in."
    },
    location: {
      locationFilterInputPlaceholder: "Select your country"
    },
    networkOrPhone: {
      footerText: "",
      headerText: "",
      phoneNumberInputPlaceholder: "your phone number",
      separatorText: "Otherwise, enter your phone to sign in<br>or create an account",
      smallSocialButtonsHeader: "Login with"
    },
    title: "Auth0",
    welcome: "Welcome {name}!"
  },
  success: {
    resetPassword: "We've just sent you an email to reset your password."
  }
};
