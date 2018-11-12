// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests: 'Jammer, jy het limiet bereik. Probeer asseblief weer later.',
      'lock.fallback': 'Jammer, iets het verkeerd gegaan terwyl jy wagwoord verander het.',
      enterprise_email:
        "Jou e-pos se domein is deel van 'n Enterprise Identity provider. Om u wagwoord terug te stel, raadpleeg asseblief u sekuriteitsadministrateur."
    },
    login: {
      blocked_user: 'Die gebruiker is geblok.',
      invalid_user_password: 'Verkeerde inligting.',
      'lock.fallback': 'Jammer, iets het verkeerd gegaan terwyl jy probeer inteken.',
      'lock.invalid_code': 'Verkeerde kode.',
      'lock.invalid_email_password': 'Verkeerde e-pos of wagwoord.',
      'lock.invalid_username_password': 'Verkeerde gebruikersnaam of wagwoord.',
      'lock.network': 'Die stelsel is van lyn af, probeer asseblief weer later.',
      'lock.popup_closed': 'Stelsel het toegemaak. Probeer asseblief weer later.',
      'lock.unauthorized': 'Toegang verbied. Probeer asseblief weer later.',
      'lock.mfa_registration_required': 'Jou toestel voldoen nie aan vereistes nie.',
      'lock.mfa_invalid_code': 'Verkeerde kode. Probeer asseblief weer.',
      password_change_required: 'Dateer wagwoord op asseblief.',
      password_leaked:
        'Jou rekening het sekuriteitsprobleme. Vir jou veiligheid het ons die rekening geblok. Sien e-pos met instruksies om rekening weer te aktiveer.',
      too_many_attempts: 'Jou rekening is geblok nadat daar te veel keer probeer inteken is.',
      session_missing: 'Kon nie versoek bevestig nie. Maak asseblief alles toe en probeer weer',
      'hrd.not_matching_email': 'Gebruik asseblief korporatiewe e-pos om in te teken.'
    },
    passwordless: {
      'bad.email': 'Die e-pos is ongeldig',
      'bad.phone_number': 'Die telefoonnommer is ongeldig',
      'lock.fallback': 'Jammer, iets het verkeerd gegaan'
    },
    signUp: {
      invalid_password: 'Wagwoord is ongeldig.',
      'lock.fallback': 'Jammer, jou intekening het misluk.',
      password_dictionary_error: 'Wagwoord is te eenvoudig.',
      password_no_user_info_error: 'Wagwoord kan nie persoonlike inligting bevat nie.',
      password_strength_error: 'Wagwoord is swak.',
      user_exists: 'Gebruiker bestaan reeds.',
      username_exists: 'Gebruikersnaam bestaan reeds.'
    }
  },
  success: {
    logIn: 'Dankie dat u inteken.',
    forgotPassword: 'Ons het n e-pos gestuur om wagwoord te herstel.',
    magicLink: 'Ons het n skakel gestuur om in te teken in<br /> by %s.',
    signUp: 'Dankie dat u ingeteken het.'
  },
  blankErrorHint: 'Mag nie leeg wees nie',
  codeInputPlaceholder: 'jou kode',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'of',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'of',
  emailInputPlaceholder: 'jou@voorbeeld.com',
  enterpriseLoginIntructions: 'Teken in met jou korporatiewe besonderhede.',
  enterpriseActiveLoginInstructions: 'Vul asseblief jou korporatiewe besonderhede in by %s.',
  failedLabel: 'Misluk!',
  forgotPasswordTitle: 'Herstel jou wagwoord',
  forgotPasswordAction: 'Wagwoord vergeet?',
  forgotPasswordInstructions: 'Vul jou e-pos in en ons stuur e-pos met herstel-opsies.',
  forgotPasswordSubmitLabel: 'Stuur e-pos',
  invalidErrorHint: 'Ongeldig',
  lastLoginInstructions: 'Vorige intekening was met',
  loginAtLabel: 'Ingeteken by%s',
  loginLabel: 'Teken in',
  loginSubmitLabel: 'Teken in',
  loginWithLabel: 'Teken in met %s',
  notYourAccountAction: 'Nie jou rekening nie?',
  passwordInputPlaceholder: 'jou wagwoord',
  passwordStrength: {
    containsAtLeast: 'Bevat ten minste %d of %d tipe karakters:',
    identicalChars: 'Nie meer as %d identiese karakters (e.g., "%s" not allowed)',
    nonEmpty: 'Wagwoord word vereis',
    numbers: 'Nommers (i.e. 0-9)',
    lengthAtLeast: 'Ten minste %d karakters lank',
    lowerCase: 'kleinletters (a-z)',
    shouldContain: 'Moet die volgende inhe:',
    specialCharacters: 'Spesiale karakters (e.g. !@#$%^&*)',
    upperCase: 'Hoofletters (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Andersins vul jou e-pos in om inteken<br/>of skep n rekening',
  passwordlessEmailCodeInstructions: 'E-pos met die kode is gestuur na %s.',
  passwordlessEmailInstructions: 'Vul jou e-pos in om inteken<br/>of skep n rekening',
  passwordlessSMSAlternativeInstructions:
    'Andersins vul jou telefoonnommer in om inteken<br/>of skep n rekening',
  passwordlessSMSCodeInstructions: 'Ons stuur SMS met die kode <br/>na %s.',
  passwordlessSMSInstructions:
    'Vul jou telenfoonnommer in om in te teken <br/>of skep jou rekening',
  phoneNumberInputPlaceholder: 'jou telefoonnommer',
  resendCodeAction: 'Nie die kode gekry nie?',
  resendLabel: 'Stuur weer',
  resendingLabel: 'Stuur weer...',
  retryLabel: 'Probeer weer',
  sentLabel: 'Gestuur!',
  signUpTitle: 'Registreer',
  signUpLabel: 'Registreer',
  signUpSubmitLabel: 'Registreer',
  signUpWithLabel: 'Registreer %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Enkel-intekening aktief',
  submitLabel: 'Gaan voort',
  unrecoverableError: 'Iets het verkeerd gegaan.<br />Kontak asseblief ons tegniese span.',
  usernameFormatErrorHint:
    'Gebruik %d-%d letters, nommers en die volgende karakters: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'jou gebruikersnaam',
  usernameOrEmailInputPlaceholder: 'gebruikersnaam en e-pos',
  title: 'Auth0',
  welcome: 'Welkom %s!',
  windowsAuthInstructions: 'Jy konnekteer van jou korporatiewe netwerk&hellip;',
  windowsAuthLabel: 'Windows Goedkeuring',
  mfaInputPlaceholder: 'Kode',
  mfaLoginTitle: '2-Stap Goedkeuring',
  mfaLoginInstructions: 'Vul asseblief die kode in wat deur jou toestel geskep is.',
  mfaSubmitLabel: 'Gaan voort',
  mfaCodeErrorHint: 'Gebruik %d nommers',
  showPassword: 'Wys wagwoord',
  signUpTerms: 'Deur u in te teken, stem u in tot ons diensbepalings en privaatheidsbeleid.'
};
