export default {
  error: {
    forgotPassword: {
      "invalid_user": "The user does not exists.",
      "too_many_requests": "You have reached the limit on password change attempts. Please wait before trying again.",
      "lock.fallback": "We're sorry, something went wrong when requesting the password change."
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
    signIn: { // TODO: rename to login, and namespace by connection
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
  success: {
    resetPassword: "We've just sent you an email to reset your password."
  },
  title: "Auth0",
  welcome: "Welcome {name}!"
};
