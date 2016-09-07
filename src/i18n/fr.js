export default {
  error: {
    forgotPassword: {
      "too_many_requests": "Vous avez atteint la limite de tentatives de changement de mot de passe. Veuillez patienter avant de recommencer.",
      "lock.fallback": "Nous sommes désolés, un problème est survenu lors de la demande de changement de mot de passe."
    },
    login: {
      "blocked_user": "L'utilisateur est bloqué.",
      "invalid_user_password": "Mauvais identifiants.",
      "lock.fallback": "Nous sommes désolés, un problème est survenu lors de la tentative de connexion.",
      "lock.invalid_code": "Mauvais code.",
      "lock.invalid_email_password": "Mauvais courriel ou mot de passe.",
      "lock.invalid_username_password": "Mauvais nom d'utilisateur ou mot de passe.",
      "lock.network": "Nous ne pouvons pas joindre le serveur. Vérifiez votre connexion et réessayez.",
      "lock.popup_closed": "La fenêtre popup a été fermée. Veuillez réessayer.",
      "lock.unauthorized": "Les permissions n'ont pas été accordées. Veuillez réessayer.",
      "password_change_required": "Vous devez mettre à jour votre mot de passe, soit parce qu'il s'agit de votre première connexion, soit parce que ce dernier a expiré.", // TODO: verify error code
      "password_leaked": "Cette connexion a été bloquée parce que votre mot de passe a été utilisé sur un autre site web. Nous vous avons envoyé un courriel avec des instructions pour la débloquer.",
      "too_many_attempts": "Votre compte a été bloqué suite à de trop tentatives de connexion consécutive."
    },
    passwordless: {
      "bad.email": "Le courriel n'est pas valide",
      "bad.phone_number": "Le numéro de téléphone n'est pas valide",
      "lock.fallback": "Nous sommes désolés, un problème est survenu"
    },
    signUp: {
      "invalid_password": "Le mot de passe n'est pas valide",
      "lock.fallback": "Nous sommes désolés, un problème est survenu lors de la tentative d'inscription.",
      "password_dictionary_error": "Le mot de passe est trop commun.",
      "password_no_user_info_error": "Le mot de passe est basé sur des informations utilisateur.",
      "password_strength_error": "La force du mot de passe est trop faible.",
      "user_exists": "Cet utilisateur existe déjà.",
      "username_exists": "Ce nom d'utilisateur existe déjà."
    }
  },
  success: { // success messages show above the form or in a confirmation pane
    logIn: "Merci de vous être connecté.",
    forgotPassword: "Nous venons de vous envoyer un courriel pour réinitialiser votre mot de passe.",
    magicLink: "Nous vous avons envoyé un lien pour vous connecter<br />à %s.",
    signUp: "Merci de vous être insrit."
  },
  blankErrorHint: "Ne peut être vide",
  codeInputPlaceholder: "votre code",
  databaseEnterpriseLoginInstructions: "",
  databaseEnterpriseAlternativeLoginInstructions: "ou",
  databaseSignUpInstructions: "",
  databaseAlternativeSignUpInstructions: "ou",
  emailInputPlaceholder: "votrecourriel@exemple.com",
  enterpriseLoginIntructions: "Connectez-vous avec vos identifiants d'entreprise.",
  enterpriseActiveLoginInstructions: "Veuillez entrer les identifiants de votre entreprise %s.",
  failedLabel: "À échoué !",
  forgotPasswordAction: "Mot de passe oublié ?",
  forgotPasswordInstructions: "Veuillez entrer votre adresse de messagerie. Nous vous enverrons un courriel pour réinitialiser votre mot de passe.",
  forgotPasswordSubmitLabel: "Envoyer le courriel",
  invalidErrorHint: "Invalide",
  lastLoginInstructions: "Dernière connexion avec",
  loginAtLabel: "Connexion à %s",
  loginLabel: "Connexion",
  loginSubmitLabel: "Connexion",
  loginWithLabel: "Connexion avec %s",
  notYourAccountAction: "Ceci n'est pas votre compte ?",
  passwordInputPlaceholder: "Votre mot de passe",
  passwordStrength: {
    containsAtLeast: "Doit contenir au moins %d des %d types de caractères :",
    identicalChars: "Pas plus de %d caractères identiques dans une ligne (par ex., \"%s\" n'est pas autorisé)",
    nonEmpty: "Mot de passe non-vide requis",
    numbers: "Chiffres  (i.e. 0-9)",
    lengthAtLeast: "Au moins %d caractères",
    lowerCase: "Lettres minuscules (a-z)",
    shouldContain: "Doit contenir:",
    specialCharacters: "Caractères spéciaux (par ex. !@#$%^&*)",
    upperCase: "Lettres majuscules (A-Z)"
  },
  passwordlessEmailAlternativeInstructions: "Otherwise, enter your email to sign in<br/>or create an account",
  passwordlessEmailCodeInstructions: "An email with the code has been sent to %s.",
  passwordlessEmailInstructions: "Enter your email to sign in<br/>or create an account",
  passwordlessSMSAlternativeInstructions: "Otherwise, enter your phone to sign in<br/>or create an account",
  passwordlessSMSCodeInstructions: "An SMS with the code has been sent<br/>to %s.",
  passwordlessSMSInstructions: "Enter your phone to sign in<br/>or create an account",
  phoneNumberInputPlaceholder: "your phone number",
  resendCodeAction: "Did not get the code?",
  resendLabel: "Resend",
  resendingLabel: "Resending...",
  retryLabel: "Retry",
  sentLabel: "Sent!",
  signUpLabel: "Sign Up",
  signUpSubmitLabel: "Sign Up",
  signUpTerms: "",
  signUpWithLabel: "Sign up with %s",
  socialLoginInstructions: "",
  socialSignUpInstructions: "",
  ssoEnabled: "Single Sign-On enabled",
  submitLabel: "Submit",
  unrecoverableError: "Something went wrong.<br />Please contact technical support.",
  usernameFormatErrorHint: "Use 1-15 letters, numbers and \"_\"",
  usernameInputPlaceholder: "your username",
  usernameOrEmailInputPlaceholder: "username/email",
  title: "Auth0",
  welcome: "Welcome %s!",
  windowsAuthInstructions: "You are connected from your corporate network&hellip;",
  windowsAuthLabel: "Windows Authentication"
};
