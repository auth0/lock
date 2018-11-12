// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Vous avez atteint la limite de tentatives de changement de mot de passe. Veuillez patienter avant de recommencer.',
      'lock.fallback':
        'Nous sommes désolés, un problème est survenu lors de la demande de changement de mot de passe.',
      enterprise_email:
        "Le domaine de votre messagerie fait partie d'un fournisseur d'identité d'entreprise. Pour réinitialiser votre mot de passe, veuillez contacter votre administrateur de sécurité."
    },
    login: {
      blocked_user: 'L’utilisateur est bloqué.',
      invalid_user_password: 'Mauvais identifiants.',
      'lock.fallback':
        'Nous sommes désolés, un problème est survenu lors de la tentative de connexion.',
      'lock.invalid_code': 'Mauvais code.',
      'lock.invalid_email_password': 'Mauvaise adresse de messagerie ou mot de passe.',
      'lock.invalid_username_password': 'Mauvais nom d’utilisateur ou mot de passe.',
      'lock.network':
        'Nous ne pouvons pas joindre le serveur. Vérifiez votre connexion et réessayez.',
      'lock.popup_closed': 'La fenêtre popup a été fermée. Veuillez réessayer.',
      'lock.unauthorized': 'Les permissions n’ont pas été accordées. Veuillez réessayer.',
      password_change_required:
        'Vous devez mettre à jour votre mot de passe, soit parce qu’il s’agit de votre première connexion, soit parce que ce dernier a expiré.',
      password_leaked:
        'Cette connexion a été bloquée parce que votre mot de passe a été utilisé sur un autre site web. Nous vous avons envoyé un courriel avec des instructions pour la débloquer.',
      too_many_attempts:
        'Votre compte a été bloqué à la suite de trop nombreuses tentatives de connexion consécutives.',
      'lock.mfa_registration_required':
        "l'authentification multifactorielle est nécessaire, mais votre appareil n'est pas inscrit. Veuillez vous inscrire avant de passer.",
      'lock.mfa_invalid_code': 'Mauvais code. Veuillez réessayer.',
      session_missing:
        "Impossible de terminer votre demande d'authentification. Veuillez essayer de nouveau après la fermeture de tous les dialogues ouverts",
      'hrd.not_matching_email':
        "Veuillez utiliser votre messagerie d'entreprise pour vous connecter."
    },
    passwordless: {
      'bad.email': 'L’adresse de messagerie n’est pas valide',
      'bad.phone_number': 'Le numéro de téléphone n’est pas valide',
      'lock.fallback': 'Nous sommes désolés, un problème est survenu'
    },
    signUp: {
      invalid_password: 'Le mot de passe n’est pas valide.',
      'lock.fallback':
        'Nous sommes désolés, un problème est survenu lors de la tentative d’inscription.',
      password_dictionary_error: 'Le mot de passe est trop commun.',
      password_no_user_info_error: 'Le mot de passe est basé sur des informations utilisateur.',
      password_strength_error: 'La force du mot de passe est trop faible.',
      user_exists: 'Cet utilisateur existe déjà.',
      username_exists: 'Ce nom d’utilisateur existe déjà.'
    }
  },
  success: {
    logIn: 'Merci de vous être connecté.',
    forgotPassword:
      'Nous venons de vous envoyer un courriel pour réinitialiser votre mot de passe.',
    magicLink: 'Nous vous avons envoyé un lien pour vous connecter<br />à %s.',
    signUp: 'Merci de vous être inscrit.'
  },
  blankErrorHint: 'Ne peut être vide',
  codeInputPlaceholder: 'votre code',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ou',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ou',
  emailInputPlaceholder: 'votreadresse@exemple.com',
  enterpriseLoginIntructions: 'Connectez-vous avec vos identifiants d’entreprise.',
  enterpriseActiveLoginInstructions:
    'Veuillez entrer les identifiants de connexion de votre entreprise %s.',
  failedLabel: 'A échoué !',
  forgotPasswordAction: 'Mot de passe oublié ?',
  forgotPasswordInstructions:
    'Veuillez entrer votre adresse de messagerie. Nous vous enverrons un courriel pour réinitialiser votre mot de passe.',
  forgotPasswordSubmitLabel: 'Envoyer le courriel',
  invalidErrorHint: 'Invalide',
  lastLoginInstructions: 'Dernière connexion avec',
  loginAtLabel: 'Connexion à %s',
  loginLabel: 'Connexion',
  loginSubmitLabel: 'Connexion',
  loginWithLabel: 'Se connecter avec %s',
  notYourAccountAction: 'Ceci n’est pas votre compte ?',
  passwordInputPlaceholder: 'Votre mot de passe',
  passwordStrength: {
    containsAtLeast: 'Doit contenir au moins %d des %d types de caractères :',
    identicalChars:
      'Pas plus de %d caractères identiques dans une ligne (par ex., « %s » n’est pas autorisé)',
    nonEmpty: 'Mot de passe non vide requis',
    numbers: 'Chiffres  (i.e. 0-9)',
    lengthAtLeast: 'Au moins %d caractères',
    lowerCase: 'Lettres minuscules (a-z)',
    shouldContain: 'Doit contenir :',
    specialCharacters: 'Caractères spéciaux (par ex. !@#$%^&*)',
    upperCase: 'Lettres majuscules (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Sinon entrez votre adresse de messagerie pour vous connecter<br/>ou créez un compte',
  passwordlessEmailCodeInstructions: 'Un courriel avec le code a été envoyé à %s.',
  passwordlessEmailInstructions:
    'Entrez votre adresse de messagerie pour vous connecter<br/>ou créez un compte',
  passwordlessSMSAlternativeInstructions:
    'Sinon saisissez votre numéro de téléphone pour vous connecter<br/>ou créez un compte',
  passwordlessSMSCodeInstructions: 'Un SMS avec le code a été envoyé<br/>à %s.',
  passwordlessSMSInstructions:
    'Saisissez votre numéro de téléphone pour vous connecter<br/>ou créez un compte',
  phoneNumberInputPlaceholder: 'votre numéro de téléphone',
  resendCodeAction: 'Vous n’avez pas reçu le code ?',
  resendLabel: 'Envoyer une nouvelle fois',
  resendingLabel: 'Nouvel envoi en cours…',
  retryLabel: 'Réessayer',
  sentLabel: 'Envoyé !',
  signUpLabel: 'Inscription',
  signUpSubmitLabel: 'Inscription',
  signUpWithLabel: 'S’inscrire avec %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Authentification unique activée',
  submitLabel: 'Envoyer',
  unrecoverableError: 'Un problème est survenu.<br />Veuillez contacter l’assistance technique.',
  usernameFormatErrorHint:
    'Utilisez %d-%d lettres, chiffres et les caractères suivants: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'votre nom d’utilisateur',
  usernameOrEmailInputPlaceholder: 'nom d’utilisateur/adresse de messagerie',
  title: 'Auth0',
  welcome: 'Bienvenue %s !',
  windowsAuthInstructions: 'Vous êtes connecté depuis votre réseau d’entreprise...',
  windowsAuthLabel: 'Authentification Windows',
  forgotPasswordTitle: 'réinitialisez votre mot de passe',
  signUpTitle: "S'inscrire",
  mfaInputPlaceholder: 'Code',
  mfaLoginTitle: '2-Step Vérification',
  mfaLoginInstructions:
    'Veuillez entrer le code de vérification généré par votre application mobile.',
  mfaSubmitLabel: "S'identifier",
  mfaCodeErrorHint: 'Utilisez des numéros %d',
  showPassword: 'Montrer le mot de passe',
  signUpTerms:
    "En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité."
};
