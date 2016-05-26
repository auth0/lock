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
    signUp: {
      "invalid_password": "The password is too weak.", // NOTE: request is not made if pass doesn't satisfy policy
      "lock.fallback": "We're sorry, something went wrong when attempting to sign up.",
      "user_exists": "The user already exists.",
      "username_exists": "The username already exists."
    }
  },
  success: { // success messages show above the form or in a confirmation pane
    logIn: "Thanks for logging in.",
    resetPassword: "We've just sent you an email to reset your password."
  },
  databaseEnterpriseLoginInstructions: "",
  databaseEnterpriseAlternativeLoginInstructions: "or",
  databaseSignUpInstructions: "",
  databaseAlternativeSignUpInstructions: "or",
  emailInputPlaceholder: "yours@example.com",
  enterpriseLoginIntructions: "Login with your corporate credentials.",
  enterpriseActiveLoginInstructions: "Please enter your coorporate credentials at {domain}.",
  forgotPasswordAction: "Don't remember your password?",
  forgotPasswordInstructions: "Please enter your email address. We will send you an email to reset your password.",
  lastLoginInstructions: "Last time you logged in with",
  loginAtLabel: "Login at {domain}",
  loginLabel: "Login",
  loginWithLabel: "Login with {idp}",
  notYourAccountAction: "Not your account?",
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
  signUpLabel: "Sign Up",
  signUpterms: "",
  signUpWithLabel: "Sign up with {idp}",
  signedUpMessage: "Thanks for signing up.",
  socialLoginInstructions: "",
  socialSignUpInstructions: "",
  ssoEnabled: "Single Sign-On enabled",
  unrecoverableError: "Something went wrong.<br />Please contant technical support.",
  usernameInputPlaceholder: "your username",
  title: "Auth0",
  welcome: "Welcome {name}!",
  windowsAuthInstructions: "You are connected from your corporate network&hellip;",
  windowsAuthLabel: "Windows Authentication"
};
