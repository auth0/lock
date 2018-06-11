// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Du har nådd grensa for antal forsøk på å endre passord. Ver venleg og vent ei stund før du prøvar på nytt',
      'lock.fallback': 'Beklagar, men noko giekk galt då du prøvde å endre passordet.',
      enterprise_email:
        'E-postdomenet ditt er ein del av ein Enterprise Identity-leverandør. For å tilbakestille passordet, ver venleg og kontakt din sikkerheitsadministrator.',
    },
    login: {
      blocked_user: 'Denne brukaren er blokkert',
      invalid_user_password: 'Ugyldig passord',
      'lock.fallback': 'Beklagar, men noko gjekk galt då du forsøkte å logge deg inn.',
      'lock.invalid_code': 'Feil kode.',
      'lock.invalid_email_password': 'Feil e-post eller passord',
      'lock.invalid_username_password': 'Feil brukarnamn eller passord.',
      'lock.network':
        'Får ikkje kontakt med tenaren, ver venleg og kontroller di dekning eller nettverkstilkopling, og prøv på nytt.',
      'lock.popup_closed': 'Popup-vindauge lukka. Prøv på nytt.',
      'lock.unauthorized': 'Tilgang ikkje tillete. Prøv på nytt.',
      'Lock.mfa_registration_required':
        'Fleirstegsautorisering er påkrevd, men din enhet er godkjent. Fullfør registreringa for å gå videre.',
      'lock.mfa_invalid_code': 'Feil kode! Prøv på nytt.',
      password_change_required:
        'Du må oppdatere ditt passord, fordi dette anten er den fyrste gongen du loggar inn, eller at ditt passord har gått ut.',
      password_leaked:
        'Vi har oppdaga ein potensiell sikkerheitsrisiko med denne brukarkontoen. For å beskytte deg mot misbruk har vi blokkert brukarkontoen med den aktuelle innlogginga. Vi har sendt deg ein e-post med instruksjonar for korleis du opnar brukerkontoen din igjen.',
      too_many_attempts:
        'Din brukarkonto har blitt blokkert etter gjentekne ugyldige innloggingsforsøk.',
      session_missing:
        'Vi kunne ikkje fullføre førespurnaden om autorisering. Prøv å lukke andre opne faner eller vindauge, og prøv på nytt.',
      'hrd.not_matching_email': 'Ver venleg og bruk di korrekte e-postadresse for innlogging.',
      'lock.mfa_registration_required':
        'Multifaktorautentisering krevast, men enheten din er ikkje påmeldt. Ver venleg og meld deg inn før du går vidare.',
    },
    passwordless: {
      'bad.email': 'Ugyldig e-postadresse',
      'bad.phone_number': 'Ugyldig telefonnummer',
      'lock.fallback': 'Beklagar, men noko gjekk galt',
    },
    signUp: {
      invalid_password: 'Ugyldig passord.',
      'lock.fallback': 'Beklagar, men noko gjekk skeis i registreringa.',
      password_dictionary_error: 'Passordet er for enkelt.',
      password_no_user_info_error: 'Passordet er basert på kjende bruksdata.',
      password_strength_error: 'Passordet er for svakt.',
      user_exists: 'Denne brukaren eksisterer allereie.',
      username_exists: 'Dette brukernamnet eksisterer allereie.',
    },
  },
  success: {
    logIn: 'Takk for innlogginga.',
    forgotPassword: 'Vi har akkurat sendt deg ein e-post der du kan endre ditt passord.',
    magicLink: 'Vi har sendt deg ei lenke for å logge inn på %s.',
    signUp: 'Takk for registreringa!.',
  },
  blankErrorHint: 'Dette feltet kan ikkje vere tomt',
  codeInputPlaceholder: 'din kode',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'eller',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'eller',
  emailInputPlaceholder: 'deg@eksempel.com',
  enterpriseLoginIntructions: 'Bruk dine offisielle innloggingsdetaljar.',
  enterpriseActiveLoginInstructions:
    'Ver venleg og tast inn dine offisielle innloggingsdetaljar på %s.',
  failedLabel: 'Feil!',
  forgotPasswordTitle: 'Nullstill ditt passord',
  forgotPasswordAction: 'Har du gløymt ditt passord?',
  forgotPasswordInstructions:
    'Ver venleg og skriv inn di e-postadresse, og vi vil sende deg ein e-post der du kan nullstille ditt passord.',
  forgotPasswordSubmitLabel: 'Send e-post',
  invalidErrorHint: 'Ugyldig',
  lastLoginInstructions: 'Sist gang du logga deg inn med',
  loginAtLabel: 'Logg inn som %s',
  loginLabel: 'Logg inn',
  loginSubmitLabel: 'Logg inn',
  loginWithLabel: 'Logg inn med %s',
  notYourAccountAction: 'Er det ikkje din brukarkonto?',
  passwordInputPlaceholder: 'Ditt passord',
  passwordStrength: {
    containsAtLeast: 'Inneheld minst %d av følgande %d type teikn',
    identicalChars: 'Ikkje fleire enn %d identiske teikn på rad (eks., "%s" er tillatt)',
    nonEmpty: 'Ikkje-tomt passord krevast',
    numbers: 'Talsiffer (t.d. 0-9)',
    lengthAtLeast: 'Minst %d teikn',
    lowerCase: 'Små bokstavar (a-z)',
    shouldContain: 'Bør innehalde:',
    specialCharacters: 'Spesialteikn (t.d. !@#$%^&*)',
    upperCase: 'Store bokstavar (A-Z)',
  },
  passwordlessEmailAlternativeInstructions:
    'Eller, skriv inn di e-postadresse for å logge inn <br/> eller opprette ein brukerkonto',
  passwordlessEmailCodeInstructions: 'Ein e-post med kode har blitt sendt til %s.',
  passwordlessEmailInstructions:
    'Skriv inn di e-postadresse for å logge inn<br/>eller opprette ein brukarkonto',
  passwordlessSMSAlternativeInstructions:
    'Eller, tast inn ditt mobilnummer for å logge inn<br/>eller opprette ein brukarkonto',
  passwordlessSMSCodeInstructions: 'Ein SMS med kode er sendt<br/>til %s.',
  passwordlessSMSInstructions:
    'Tast inn ditt mobilnummer for å logge inn<br/>eller opprette ein brukarkonto',
  phoneNumberInputPlaceholder: 'ditt mobilnummer',
  resendCodeAction: 'Har du ikkje motteke ein kode?',
  resendLabel: 'Send på nytt',
  resendingLabel: 'Sender…',
  retryLabel: 'Prøv på nytt',
  sentLabel: 'Sendt!',
  showPassword: 'Vis passord',
  signupTitle: 'Registrer deg',
  signUpLabel: 'Registrer deg',
  signUpSubmitLabel: '',
  signUpTerms: '',
  signUpWithLabel: 'Registrer deg med %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Eittstegs innlogging klart',
  submitLabel: 'Send',
  unrecoverableError: 'Noko gjekk galt.<br/> Ver venleg og kontakt teknisk support.',
  usernameFormatErrorHint: 'Bruk %d-%d bokstavar, tal og følgande spesialteikn: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'ditt brukarnamn',
  usernameOrEmailInputPlaceholder: 'brukarnamn/e-post',
  title: 'Auth0',
  welcome: 'Velkomen %s!',
  windowsAuthInstructions: 'Du er tilkopla via ditt offisielle nettverk;',
  windowsAuthLabel: 'Windows Authentication',
  mfaInputPlaceholder: 'Kode',
  mfaLoginTitle: '2-stegs verifisering',
  mfaLoginInstructions: 'Ver venleg og tast inn verifiseringskoden som er generert på din mobil',
  mfaSubmitLabel: 'Logg inn',
  mfaCodeErrorHint: 'Bruk %d tall',
};
