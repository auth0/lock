// This file was automatically translated.
// Feel free to submit a pull request (PR) if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'U heeft de limiet van het aantal wachtwoord wijzigingspogingen bereikt. Wacht even voor dat u het nog een keer probeert.',
      'lock.fallback':
        'Onze excuses, er is iets fout gegaan bij de de aanvraag voor een wachtwoord wijziging.',
      enterprise_email:
        'Het domein van uw e-mail maakt deel uit van een Enterprise-identiteitsprovider. Raadpleeg uw beveiligingsbeheerder om uw wachtwoord opnieuw in te stellen.',
      invalid_captcha: 'Los de vraag op om te verifiëren dat u geen robot bent.',
      invalid_recaptcha: 'Selecteer het vakje om te verifiëren dat u geen robot bent.'
    },
    login: {
      blocked_user: 'De gebruiker is geblokkeerd.',
      invalid_user_password: 'Gebruiker of wachtwoord is niet correct.',
      'lock.fallback': 'Onze excuses, er is iets mis gegaan bij het aanmelden.',
      'lock.invalid_code': 'Verkeerde code.',
      'lock.invalid_email_password': 'Verkeerd e-mailadres of wachtwoord.',
      'lock.invalid_username_password': 'Verkeerde gebruikersnaam of wachtwoord.',
      'lock.network':
        'Server is niet bereikbaar. Controleer uw netwerkverbinding en probeer het nog een keer.',
      'lock.popup_closed': 'Pop-up venster gesloten. Probeer het nog een keer.',
      'lock.unauthorized': 'Autorisatie geweigerd. Probeer het nog een keer.',
      password_change_required:
        'U moet uw wachtwoord aanpassen omdat dit de eerste keer is dat u inlogt of omdat uw wachtwoord is verlopen.',
      password_leaked:
        'Dit account is geblokkeerd omdat uw wachtwoord is gelekt op een andere website. We hebben u een e-mail gestuurd met instructies voor het deblokkeren.',
      too_many_attempts:
        'Uw account is geblokkeerd als gevolg van te veel herhaalde inlogpogingen.',
      'lock.mfa_registration_required':
        'Diverse verificatie is vereist, maar het apparaat is niet geregistreerd. Gelieve in te schrijven voordat verder gaat.',
      'lock.mfa_invalid_code': 'Verkeerde code. Probeer het opnieuw.',
      session_missing:
        'Kan uw authenticatie verzoek niet voltooien. Probeer het opnieuw na het sluiten van alle geopende vensters',
      'hrd.not_matching_email': 'Gelieve gebruik te maken van uw zakelijke e-mail om in te loggen.',
      too_many_requests:
        'Het spijt ons. Er zijn op dit moment te veel aanvragen. Laad de pagina opnieuw en probeer het opnieuw. Als dit probleem aanhoudt, probeert u het later opnieuw.',
      invalid_captcha: 'Los de vraag op om te verifiëren dat u geen robot bent.',
      invalid_recaptcha: 'Selecteer het vakje om te verifiëren dat u geen robot bent.'
    },
    passwordless: {
      'bad.email': 'Het e-mailadres is ongeldig',
      'bad.phone_number': 'Het telefoonnummer is ongeldig',
      'lock.fallback': 'Onze excuses, er is iets fout gegaan.',
      invalid_captcha: 'Los de vraag op om te verifiëren dat u geen robot bent.',
      invalid_recaptcha: 'Selecteer het vakje om te verifiëren dat u geen robot bent.'
    },
    signUp: {
      invalid_password: 'Het wachtwoord is ongeldig.',
      'lock.fallback': 'Onze excuses, er is iets mis gegaan bij het registreren.',
      password_dictionary_error: 'Het wachtwoord is een te bekend woord.',
      password_leaked: 'Deze combinatie van inloggegevens is gedetecteerd bij een openbaar datalek op een andere website. Voordat uw account wordt aangemaakt, dient u een ander wachtwoord te gebruiken om het veilig te houden.',
      password_no_user_info_error: 'Het wachtwoord is gebaseerd op gebruikers informatie.',
      password_strength_error: 'Het wachtwoord is niet sterk genoeg.',
      user_exists: 'De gebruiker bestaat al.',
      username_exists: 'De gebruikersnaam bestaat al.',
      social_signup_needs_terms_acception:
        'Ga akkoord met de onderstaande servicevoorwaarden om door te gaan.'
    }
  },
  success: {
    logIn: 'Dank u voor het inloggen.',
    forgotPassword: 'Wij hebben u een e-mail gestuurd voor het resetten van uw wachtwoord.',
    magicLink: 'Wij hebben een link gestuurd, naar %s, om mee in te loggen.',
    signUp: 'Bedankt voor uw aanmelding.'
  },
  blankErrorHint: '',
  blankPasswordErrorHint: 'Mag niet leeg zijn',
  blankEmailErrorHint: 'Mag niet leeg zijn',
  blankUsernameErrorHint: 'Mag niet leeg zijn',
  blankCaptchaErrorHint: 'Mag niet leeg zijn',
  codeInputPlaceholder: 'Uw code',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'of',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'of',
  emailInputPlaceholder: 'iemand@example.com',
  enterpriseLoginIntructions: 'Login met de gegevens van uw bedrijf.',
  enterpriseActiveLoginInstructions: 'Voer de logingegevens van uw bedrijf in op %s.',
  failedLabel: 'Gefaald!',
  forgotPasswordAction: 'Wachtwoord vergeten?',
  forgotPasswordInstructions:
    'Geef uw e-mailadres op. Wij sturen een e-mail voor het resetten van uw wachtwoord.',
  forgotPasswordSubmitLabel: 'Verstuur e-mail',
  invalidErrorHint: '',
  invalidPasswordErrorHint: 'Ongeldig',
  invalidEmailErrorHint: 'Ongeldig',
  invalidUsernameErrorHint: 'Ongeldig',
  lastLoginInstructions: 'U bent laatst aangemeld met',
  loginAtLabel: 'Inloggen op %s',
  loginLabel: 'Inloggen',
  loginSubmitLabel: 'Inloggen',
  loginWithLabel: 'Inloggen met %s',
  notYourAccountAction: 'Niet uw gebruikersaccount?',
  passwordInputPlaceholder: 'Uw wachtwoord',
  passwordStrength: {
    containsAtLeast: 'Bevat minstens %d van de volgende %d type karakters:',
    identicalChars: 'Niet meer dan %d identieke karakters op een rij (bv. "%s" is niet toegestaan)',
    nonEmpty: 'Het wachtwoord mag niet leeg zijn',
    numbers: 'Cijfers (0-9)',
    lengthAtLeast: 'Minstens %d karakters lang',
    lowerCase: 'Kleine letters (a-z)',
    shouldContain: 'Moet bevatten:',
    specialCharacters: 'Speciale karakters (bv. !@#$%^&*)',
    upperCase: 'Hoofdletters (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Anders, voer uw e-mailadres in om in te loggen<br/>of creëer een nieuwe gebruikersaccount',
  passwordlessEmailCodeInstructions: 'Er is een e-mail met de code verstuurd naar %s.',
  passwordlessEmailInstructions:
    'Voer uw e-mailadres in om aan te melden <br/>of maak een nieuw account aan',
  passwordlessSMSAlternativeInstructions:
    'Anders, voer uw telefoonnummer in om in te loggen<br/>of creëer een nieuwe gebruikersaccount',
  passwordlessSMSCodeInstructions: 'Er is een SMS met de code verstuurd naar %s.',
  passwordlessSMSInstructions:
    'Voer uw telefoonnummer in om in te loggen <br/>of creëer een nieuw gebruikersaccount',
  phoneNumberInputPlaceholder: 'Uw telefoonnummer',
  resendCodeAction: 'Code niet ontvangen?',
  resendLabel: 'Opnieuw verzenden',
  resendingLabel: 'wordt verzonden...',
  retryLabel: 'Opnieuw proberen',
  sentLabel: 'Verzonden!',
  signUpLabel: 'Aanmelden',
  signUpSubmitLabel: 'Aanmelden',
  signUpWithLabel: 'Aanmelden met %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On geactiveerd',
  submitLabel: 'Verzenden',
  unrecoverableError: 'Er ging iets mis.<br/>Neem a.u.b. contact op met de technische support.',
  usernameFormatErrorHint:
    'Gebruik %d-%d letters, cijfers en de volgende tekens: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'uw gebruikersnaam',
  usernameOrEmailInputPlaceholder: 'gebruikersnaam/e-mailadres',
  title: 'Auth0',
  welcome: 'Welkom %s!',
  windowsAuthInstructions: 'U bent verbonden vanaf uw bedrijfsnetwerk&hellip;',
  windowsAuthLabel: 'Windows Authenticatie',
  forgotPasswordTitle: 'Stel je wachtwoord opnieuw in',
  signUpTitle: 'Aanmelden',
  mfaInputPlaceholder: 'Code',
  mfaLoginTitle: '2-staps verificatie',
  mfaLoginInstructions: 'Vul de verificatiecode gegenereerd door uw mobiele applicatie.',
  mfaSubmitLabel: 'Log in',
  mfaCodeErrorHint: 'Gebruik %d nummers',
  showPassword: 'Laat wachtwoord zien',
  signUpTerms:
    'Door u aan te melden gaat u akkoord met onze servicevoorwaarden en ons privacybeleid.',
  captchaCodeInputPlaceholder: 'Voer de hierboven getoonde code in',
  captchaMathInputPlaceholder: 'Los de bovenstaande formule op'
};
