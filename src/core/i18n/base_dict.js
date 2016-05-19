export default {
  error: {
    forgotPassword: {
      "invalid_user": "The user does not exists.",
      "too_many_requests": "You have reached the limit on password change attempts. Please wait before trying again.",
      "lock.fallback": "We're sorry, something went wrong when requesting the password change."
    },
    login: {
      "blocked_user": "The user is blocked.",
      "invalid_user_password": "Wrong email or password.",
      "lock.fallback": "We're sorry, something went wrong when attempting to log in.",
      "lock.network": "We could not reach the server. Please check your connection and try again.",
      "lock.popup_closed": "Popup window closed. Try again.",
      "lock.unauthorized": "Permissions were not granted. Try again.",
      "password_change_required": "You need to update your password because this is the first time you are logging in, or because your password has expired.", // TODO: verify error code
      "password_leaked": "This login has been blocked because your password has been leaked in another website. We’ve sent you an email with instructions on how to unblock it."
    },
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
    signIn: { // TODO: move this stuff to login, and namespace by connection
      "invalid_user_password": "Wrong {field} or verification code",
      "lock.popup_closed": "Popup window closed. Try again.",
      "lock.request": "We're sorry, something went wrong when attempting to sign in",
      "lock.unauthorized": "Permissions were not granted. Try again."
    },
    signUp: {
      "invalid_password": "The password is too weak.", // NOTE: request is not made if pass doesn't satisfy policy
      "lock.fallback": "We're sorry, something went wrong when attempting to sign up.",
      "user_exists": "The user already exists.",
      "username_exists": "The username already exists."
    }
  },
  success: { // success messages show above the form
    resetPassword: "We've just sent you an email to reset your password."
  },
  databaseEnterpriseLoginInstructions: "",
  emailInputPlaceholder: "yours@example.com",
  enterpriseLoginIntructions: "Login with your corporate credentials.",
  enterpriseActiveLoginInstructions: "Please enter your coorporate credentials at {domain}.",
  forgotPasswordInstructions: "Please enter your email address. We will send you an email to reset your password.",
  forgotPasswordLabel: "Don't remember your password?",
  lastLoginInstructions: "Last time you logged in with",
  loggedInMessage: "Thanks for logging in.",
  loginAt: "Login at {domain}",
  loginTabLabel: "Login",
  loginWith: "Login with {idp}",
  passwordInputPlaceholder: "your password",
  passwordStrength: {
    containsAtLeast: "Contain at least %d of the following %d types of characters:",
    identicalChars: "No more than %d identical characters in a row (e.g., \"%s\" not allowed)",
    nonEmpty: "Non-empty password required",
    numbers: "Numbers (i.e. 0-9)",
    lengthAtLeast: "At least %d characters in length",
    lowerCase: "Lower case letters (a-z)",
    shouldContain: "Should contain:",
    specialCharacters: "Special characters (e.g. !@#$%^&*)",
    upperCase: "Upper case letters (A-Z)"
  },
  separatorText: "or",
  signUpTabLabel: "Sign Up",
  signUpWith: "Sign up with {idp}",
  signedUpMessage: "Thanks for signing up.",
  skipLastLoginLabel: "Not your account?",
  socialLoginInstructions: "",
  socialSignUpInstructions: "",
  ssoEnabled: "Single Sign-On enabled",
  terms: "",
  unrecoverableError: "Something went wrong.<br />Please contant technical support.",
  usernameInputPlaceholder: "your username",
  title: "Auth0",
  welcome: "Welcome {name}!",
  windowsAuthInstructions: "You are connected from your corporate network&hellip;",
  windowsAuthLabel: "Windows Authentication"
};
