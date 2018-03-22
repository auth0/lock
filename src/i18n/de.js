export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Sie haben das Limit für die Rücksetzung des Passworts erreicht. Bitte warten Sie, bevor Sie es erneut versuchen.',
      'lock.fallback': 'Beim Zurücksetzen des Passworts ist ein Fehler aufgetreten.',
      enterprise_email:
        'Die Domain Ihrer E-Mail ist Teil eines Enterprise Identity Providers. Um Ihr Passwort zurückzusetzen, wenden Sie sich bitte an Ihren Sicherheitsadministrator.'
    },
    login: {
      blocked_user: 'Der Benutzer wird blockiert.',
      invalid_user_password: 'Falsche Anmeldeinformationen.',
      'lock.fallback': 'Beim Verarbeiten der Anmeldung ist ein Fehler aufgetreten.',
      'lock.invalid_code': 'Falscher Code.',
      'lock.invalid_email_password': 'Falsche E-Mail oder Passwort.',
      'lock.invalid_username_password': 'Falscher Benutzername oder Passwort.',
      'lock.network': 'Der Server antwortet nicht.<br/>Bitte erneut versuchen.',
      'lock.popup_closed': 'Pop-up-Fenster geschlossen. Versuchen Sie es erneut.',
      'lock.unauthorized': 'Genehmigungen wurden nicht erteilt. Versuchen Sie es erneut.',
      'lock.mfa_registration_required':
      'Eine Multifaktor-Authentifizierung ist erforderlich, aber Ihr Gerät ist nicht registriert. Bitte registrieren Sie es, bevor Sie fortfahren.',
      'lock.mfa_invalid_code': 'Falscher Code. Bitte versuchen Sie es erneut.',
      password_change_required:
        'Sie müssen Ihr Passwort ändern, da Sie sich zum ersten Mal anmelden oder das Passwort abgelaufen ist.',
      password_leaked: 'Wir haben ein potenzielles Sicherheitsproblem mit diesem Konto festgestellt. Um Ihr Konto zu schützen, haben wir diese Anmeldung blockiert. Es wurde eine E-Mail mit einer Anleitung zum Entsperren Ihres Kontos gesendet.',
      too_many_attempts:
        'Ihr Konto wurde nach mehreren aufeinander folgenden Anmeldeversuche gesperrt.',
      session_missing:
        'Ihre Authentifizierungsanfrage konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut, nachdem Sie alle geöffneten Dialoge geschlossen haben.',
      'hrd.not_matching_email': 'Bitte verwenden Sie Ihre geschäftliche E-Mail, um sich anzumelden.'
    },
    passwordless: {
      'bad.email': 'Die E-Mail ist ungültig',
      'bad.phone_number': 'Die Telefonnummer ist ungültig',
      'lock.fallback': 'Es tut uns leid, etwas ist schiefgelaufen.'
    },
    signUp: {
      invalid_password: 'Passwort ist ungültig.',
      'lock.fallback': 'Es tut uns leid, beim Verarbeiten der Registrierung ist ein Fehler aufgetreten.',
      password_dictionary_error: 'Das Passwort ist zu häufig.',
      password_no_user_info_error: 'Das Passwort basiert auf Benutzerinformationen.',
      password_strength_error: 'Das Passwort ist zu schwach.',
      user_exists: 'Der Nutzer existiert bereits.',
      username_exists: 'Der Nutzername wird bereits verwendet.'
    }
  },
  success: {
    logIn: 'Danke für die Anmeldung.',
    forgotPassword: 'Wir haben Ihnen eine E-Mail gesendet, um Ihr Passwort zurückzusetzen.',
    magicLink: 'Wir haben Ihnen einen Link geschickt, zur Anmeldung<br/>bei %s.',
    signUp: "Vielen Dank für's Registrieren."
  },
  blankErrorHint: 'Darf nicht leer sein',
  codeInputPlaceholder: 'Ihr Code',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'oder',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'oder',
  emailInputPlaceholder: 'ihremail@example.com',
  enterpriseLoginIntructions: 'Melden Sie sich mit Ihren Unternehmensanmeldeinformationen an.',
  enterpriseActiveLoginInstructions:
    'Bitte geben Sie Ihre Unternehmensanmeldeinformationen bei %s an.',
  failedLabel: 'Gescheitert!',
  forgotPasswordAction: 'Passwort vergessen?',
  forgotPasswordInstructions:
    'Geben Sie bitte Ihre Email-Adresse ein. Wir werden Ihnen eine E-Mail senden um Ihr Passwort zurücksetzen zu können.',
  forgotPasswordSubmitLabel: 'E-Mail senden',
  invalidErrorHint: 'Ungültig',
  lastLoginInstructions: 'Letztes Mal waren Sie angemeldet mit',
  loginAtLabel: 'Anmelden bei %s',
  loginLabel: 'Anmelden',
  loginSubmitLabel: 'Anmelden',
  loginWithLabel: 'Anmelden mit %s',
  notYourAccountAction: 'Falscher Account?',
  passwordInputPlaceholder: 'Ihr Passwort',
  passwordStrength: {
    containsAtLeast: 'Enthält mindestens %d der folgenden %d Arten von Zeichen:',
    identicalChars: 'Nicht mehr als %d identische Zeichen in Folge (z. B. "%s" ist nicht erlaubt)',
    nonEmpty: 'Das Passwort darf nicht leer sein',
    numbers: 'Zahlen (z. B. 0-9)',
    lengthAtLeast: 'Muss mindestens %d Zeichen lang sein',
    lowerCase: 'Kleinbuchstaben (a-z)',
    shouldContain: 'Sollte enthalten:',
    specialCharacters: 'Sonderzeichen (z. B. !@#$%^&*)',
    upperCase: 'Großbuchstaben (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
  'Andernfalls geben Sie Ihre E-Mail-Adresse ein,<br/>um sich anzumelden oder ein Konto zu erstellen',
  passwordlessEmailCodeInstructions: 'Eine E-Mail mit dem Code wurde an %s gesendet.',
  passwordlessEmailInstructions:
    'Geben Sie Ihre E-Mail-Adresse ein, um sich anzumelden<br/>oder ein Konto zu erstellen',
  passwordlessSMSAlternativeInstructions:
    'Andernfalls geben Sie Ihre Telefonnummer ein,<br>um sich anzumelden oder ein Konto zu erstellen',
  passwordlessSMSCodeInstructions: 'Eine SMS mit dem Code wurde gesendet<br/>an %s.',
  passwordlessSMSInstructions:
    'Geben Sie Ihre Telefonnummer ein,<br>um sich anzumelden oder ein Konto zu erstellen',
  phoneNumberInputPlaceholder: 'Ihre Telefonnummer',
  resendCodeAction: 'Haben Sie den Code nicht erhalten?',
  resendLabel: 'Erneut senden',
  resendingLabel: 'Wird erneut gesendet...',
  retryLabel: 'Wiederholen',
  sentLabel: 'Senden',
  signUpLabel: 'Registrieren',
  signUpSubmitLabel: 'Registrieren',
  signUpTerms: '',
  signUpWithLabel: 'Registrieren mit %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On aktiviert',
  submitLabel: 'Absenden',
  unrecoverableError:
    'Etwas ist schiefgelaufen.<br/>Bitte kontaktieren Sie den technischen Support.',
  usernameFormatErrorHint:
    'Verwenden Sie %d-%d Buchstaben, Zahlen und die folgenden Zeichen: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'Ihr Benutzername',
  usernameOrEmailInputPlaceholder: 'Benutzername/E-Mail',
  title: 'Auth0',
  welcome: 'Willkommen %s!',
  windowsAuthInstructions: 'Sie sind über Ihr Firmennetzwerk verbunden&hellip;',
  windowsAuthLabel: 'Windows Authentifizierung',
  forgotPasswordTitle: 'Setzen Sie Ihr Passwort zurück',
  signupTitle: 'Anmelden',
  mfaInputPlaceholder: 'Code',
  mfaLoginTitle: '2-Step Verification',
  mfaLoginInstructions:
    'Bitte geben Sie den Bestätigungscode ein, der von Ihrer mobilen Anwendung generiert wurde.',
  mfaSubmitLabel: 'Anmelden',
  mfaCodeErrorHint: 'Verwenden %d Zahlen',
  showPassword: 'Passwort anzeigen'
};
