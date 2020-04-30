Auth0.registerLanguageDictionary('et', {
  error: {
    forgotPassword: {
      too_many_requests:
        'Sa oled liiga palju kordi üritanud salasõna vahetada. Palun oota enne uuesti proovimist.',
      'lock.fallback': 'Vabandame, midagi läks salasõna vahetamise sooviga valesti.',
      enterprise_email:
        'Teie e-posti domeen kuulub ettevõtte identiteedi pakkuja juurde. Parooli lähtestamiseks lugege oma turvameedet.'
    },
    login: {
      blocked_user: 'Kasutaja on blokeeritud.',
      invalid_user_password: 'Sellise infoga kasutaja puudub.',
      'lock.fallback': 'Vabandame, midagi läks sisse logides valesti.',
      'lock.invalid_code': 'Vale kood.',
      'lock.invalid_email_password': 'Vale e-mail või salasõna.',
      'lock.invalid_username_password': 'Vale salasõna või parool.',
      'lock.network': 'Ei saanud serveriga ühendust. Palun kontrolli oma internetiühendust.',
      'lock.popup_closed': 'Hüpikaken suleti. Palun proovi uuesti.',
      'lock.unauthorized': 'Õiguseid ei antud. Palun proovi uuesti.',
      'lock.mfa_registration_required':
        'Mitmetasemeline autentimine on nõutud aga sinu seade ei ole nimekirja lisatud. Palun lisa ta nimekirja.',
      'lock.mfa_invalid_code': 'Vale kood. Palun proovi uuesti.',
      password_change_required:
        'Parooli vahetamine on kohustuslik, sest sa logid sisse esimest korda või parool on aegunud.',
      password_leaked:
        'Me oleme avastanud võimaliku turvariski selle kontoga. Sinu konto kaitsmises oleme selle sisselogimise blokeerinud. Sulle saadeti e-mail kuidas blokeering maha võtta.',
      too_many_attempts: 'Sinu konto blokeeriti peale mitut ebaõnnestunud sisselogimiskatset.',
      session_missing:
        'Sisselogimine ebaõnnestus. Palun proovi uuesti peale kõigi akende sulgemist.',
      'hrd.not_matching_email': 'Palun kasuta oma ettevõtte e-maili sisselogimiseks.',
      too_many_requests:
        'Vabandame. Praegu on päringuid liiga palju. Laadige leht uuesti ja proovige uuesti. Kui see jätkub, proovige hiljem uuesti.'
    },
    passwordless: {
      'bad.email': 'Vigane e-mail',
      'bad.phone_number': 'Vigane telefoninumber',
      'lock.fallback': 'Vabandame, midagi läks valesti.'
    },
    signUp: {
      invalid_password: 'Parool on vigane.',
      'lock.fallback': 'Vabandame, registreerumisel läks midagi valesti.',
      password_dictionary_error: 'Parool on liiga tavaline.',
      password_no_user_info_error: 'Parool sisaldab kasutajainfot.',
      password_strength_error: 'Parool on liiga nõrk.',
      user_exists: 'Selline kasutaja on juba olemas.',
      username_exists: 'Selline kasutajanimi on juba olemas.'
    }
  },
  success: {
    logIn: 'Täname, et sisse logisid.',
    forgotPassword: 'Me saatsime sulle e-maili, et oma salasõna taastada.',
    magicLink: 'Me saatsime sisselogimise lingi aadressile:<br />%s.',
    signUp: 'Täname, et registreerusid.'
  },
  blankErrorHint: 'Ei või olla tühi',
  codeInputPlaceholder: 'sinu kood',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'või',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'või',
  emailInputPlaceholder: 'sinuemail@example.com',
  enterpriseLoginIntructions: 'Logi sisse kasutades ettevõtte infot',
  enterpriseActiveLoginInstructions: 'Palun sisesta oma ettevõtte sisselogimisinfo %s.',
  failedLabel: 'Ebaõnnestus!',
  forgotPasswordTitle: 'Taasta oma salasõna',
  forgotPasswordAction: 'Ei mäleta salasõna?',
  forgotPasswordInstructions:
    'Palun sisesta oma e-maili aadress. Me saadame sulle e-maili millega saad oma salasõna taastada.',
  forgotPasswordSubmitLabel: 'Saada e-mail',
  invalidErrorHint: 'Vigane',
  lastLoginInstructions: 'Viimati logisid sisse kasutades:',
  loginAtLabel: 'Logi sisse %s',
  loginLabel: 'Logi sisse',
  loginSubmitLabel: 'Logi sisse',
  loginWithLabel: 'Logi sisse kasutades %s',
  notYourAccountAction: 'Pole sinu konto?',
  passwordInputPlaceholder: 'sinu salasõna',
  passwordStrength: {
    containsAtLeast: 'Sisaldab vähemalt %d järgnevat %d sümbolit:',
    identicalChars:
      'Ei tohi sisaldada rohkem kui %d sama järjestikulist sümbolit (näiteks, "%s" ei ole lubatud)',
    nonEmpty: 'Parool ei või olla tühi',
    numbers: 'Numbrid (näiteks 0-9)',
    lengthAtLeast: 'Vähemalt %d tähemärki pikk',
    lowerCase: 'Väiketähed (a-z)',
    shouldContain: 'Peaks sisaldama:',
    specialCharacters: 'Erilised tähemärgid (näiteks !@#$%^&*)',
    upperCase: 'Suured tähed (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Muidu, sisesta oma e-mail et sisse logida<br/>või konto luua',
  passwordlessEmailCodeInstructions: 'Koodiga e-mail saadeti aadressile: %s.',
  passwordlessEmailInstructions: 'Sisesta oma e-mail, et sisse logida<br/>või konto luua',
  passwordlessSMSAlternativeInstructions:
    'Muidu, sisesta oma telefoninumber, et sisse logida<br/>või konto luua',
  passwordlessSMSCodeInstructions: 'SMS koodiga saadeti numbrile: <br/> %s.',
  passwordlessSMSInstructions: 'Sisesta oma telefoninumber, et sisse logida<br/>või konto luua',
  phoneNumberInputPlaceholder: 'sinu telefoninumber',
  resendCodeAction: 'Kas said koodi kätte?',
  resendLabel: 'Saada uuesti',
  resendingLabel: 'Saadan...',
  retryLabel: 'Proovi uuesti',
  sentLabel: 'Saadetud!',
  showPassword: 'Näita salasõna',
  signUpTitle: 'Registreeri',
  signUpLabel: 'Registreeri',
  signUpSubmitLabel: 'Registreeri',
  signUpWithLabel: 'Registreeri kasutades %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Ühine sisselogimine on sees',
  submitLabel: 'Saada',
  unrecoverableError: 'Midagi läks valesti.<br />Palun võta ühendust tehnilise toega.',
  usernameFormatErrorHint:
    'Kasuta %d-%d tähti, numbreid ja järgnevaid sümboleid: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'sinu kasutajanimi',
  usernameOrEmailInputPlaceholder: 'kasutajanimi/e-mail',
  title: 'Auth0',
  welcome: 'Tere Tulemast %s!',
  windowsAuthInstructions: 'Sa oled ühendatud ettevõtte võrgust&hellip;',
  windowsAuthLabel: 'Windowsi autentimine',
  mfaInputPlaceholder: 'Kood',
  mfaLoginTitle: '2-Sammuline Tuvastamine',
  mfaLoginInstructions: 'Palun sisesta tuvastuskood mille genereeris su mobiilirakendus',
  mfaSubmitLabel: 'Logi sisse',
  mfaCodeErrorHint: 'Kasuta %d numbrit',
  signUpTerms: 'Registreerudes nõustute meie teenusetingimustega ja privaatsuspoliitikaga.'
});
