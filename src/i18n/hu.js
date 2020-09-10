// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Elérted a jelszóváltoztatási probálkozások engedélyezett számát. Kérjük, várj egy kicsit mielőtt újrapróbálnád!',
      'lock.fallback': 'Sajnáljuk, valami hiba történt a jelszóváltoztatás során.',
      enterprise_email:
        'Az e-mail címed egy vállalati azonosítószolgáltatáshoz tartozik. A jelszó visszaállításában a biztonsági adminisztrátor tud segítséget nyújtani.'
    },
    login: {
      blocked_user: 'A felhasználó le van tiltva.',
      invalid_user_password: 'Hibás azonosító adatok.',
      'lock.fallback': 'Sajnáljuk, valami hiba történt a bejelentkezés során.',
      'lock.invalid_code': 'Hibás PIN.',
      'lock.invalid_email_password': 'Hibás e-mail cím vagy jelszó.',
      'lock.invalid_username_password': 'Hibás felhasználónév vagy jelszó.',
      'lock.network':
        'A szerver nem elérhető. Kérjük, ellenőrizd az internetkapcsolatot, és próbáld újra!',
      'lock.popup_closed': 'A felugró ablak be lett zárva. Próbáld újra!',
      'lock.unauthorized': 'Engedély megtagadva. Próbáld újra!',
      'lock.mfa_registration_required':
        'Többlépcsős azonosítás szükséges, de a készüléked nincs regisztrálva. Kérjük regisztráld, mielőtt továbblépsz.',
      'lock.mfa_invalid_code': 'Rossz kód. Kérjük próbáld újra.',
      password_change_required:
        'Meg kell változtatnod a jelszavadat, mert vagy most lépsz be először, vagy lejárt.',
      password_leaked:
        'Az azonosítót letiltottuk, mert a hozzá tartozó jelszó egy másik honlapon nyilvánosságra került. Küldtünk neked egy e-mailt a helyreállítás menetéről.',
      too_many_attempts:
        'Túl sok sikertelen bejelentkezési kísérletet észleltünk, ezért az azonosítód letiltásra került.',
      too_many_requests:
        'Sajnáljuk, de a rendszerünk jelenleg túlterhelt. Kérjük, töltsd újra az oldalt és próbáld meg ismét. Ha továbbra is fennáll a probléma, próbálkozz később.',
      session_missing:
        'Nem sikerült végigvinni az azonosítást. Kérjük, zárd be a párbeszédablakokat és próbáld újra.',
      'hrd.not_matching_email': 'Kérjük, használd a céges e-mail címed a bejelentkezéshez.',
      invalid_captcha: 'Oldja meg a kihívást, és ellenőrizze, hogy nem robot.',
      invalid_recaptcha: 'Jelölje be a jelölőnégyzetet annak ellenőrzéséhez, hogy nem robot vagy-e.'
    },
    passwordless: {
      'bad.email': 'Érvénytelen e-mail cím.',
      'bad.phone_number': 'Érvénytelen telefonszám.',
      'lock.fallback': 'Sajnáljuk, valami hiba történt.'
    },
    signUp: {
      invalid_password: 'Érvénytelen jelszó.',
      'lock.fallback': 'Sajnáljuk, valami hiba történt a regisztráció során.',
      password_dictionary_error: 'Túl gyakori jelszó.',
      password_no_user_info_error: 'A jelszó a felhasználói adatokra támaszkodik.',
      password_strength_error: 'Túl gyenge jelszó.',
      user_exists: 'A felhasználó már létezik.',
      username_exists: 'A felhasználónév már foglalt.',
      social_signup_needs_terms_acception:
        'Kérjük, fogadd el a felhasználási feltételeket és az adatkezelési tájékoztatót a folytatáshoz.'
    }
  },
  success: {
    logIn: 'Köszönjük, hogy bejelentkeztél.',
    forgotPassword: 'Küldtünk neked egy e-mailt a jelszó visszaállításának menetéről.',
    magicLink: 'Küldtünk neked egy bejelentkezési linket<br />a %s honlaphoz.',
    signUp: 'Köszönjük, hogy regisztráltál.'
  },
  blankErrorHint: '',
  blankPasswordErrorHint: 'Nem lehet üres.',
  blankEmailErrorHint: 'Nem lehet üres.',
  blankUsernameErrorHint: 'Nem lehet üres.',
  blankCaptchaErrorHint: 'Nem lehet üres.',
  codeInputPlaceholder: 'PIN',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'vagy',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'vagy',
  emailInputPlaceholder: 'emailcim@example.com',
  enterpriseLoginIntructions: 'Bejelentkezés céges azonosítóval.',
  enterpriseActiveLoginInstructions: 'Kérjük, add meg a céges azonosítódat a %s honlapon.',
  failedLabel: 'Sikertelen!',
  forgotPasswordTitle: 'Állítsd vissza a jelszavad',
  forgotPasswordAction: 'Nem emlékszel a jelszavadra?',
  forgotPasswordInstructions:
    'Kérjük, add meg az e-mail címedet! Küldünk neked egy e-mailt a jelszó helyreállításának menetéről.',
  forgotPasswordSubmitLabel: 'E-mail küldése',
  invalidErrorHint: '',
  invalidPasswordErrorHint: 'Érvénytelen',
  invalidEmailErrorHint: 'Érvénytelen',
  invalidUsernameErrorHint: 'Érvénytelen',
  lastLoginInstructions: 'Utolsó bejelentkezés',
  loginAtLabel: 'Bejelentkezés ideje: %s',
  loginLabel: 'Belépés',
  loginSubmitLabel: 'Belépés',
  loginWithLabel: '%s belépés',
  notYourAccountAction: 'Nem a te fiókod?',
  passwordInputPlaceholder: 'jelszó',
  passwordStrength: {
    containsAtLeast: 'Legalább %d karaktertípust tartalmaz a következő %d csoportból:',
    identicalChars:
      'Legfeljebb %d azonos karakter szerepelhet egymás után (pl. "%s" nem engedélyezett)',
    nonEmpty: 'A jelszó nem lehet üres',
    numbers: 'Számok (0-9)',
    lengthAtLeast: 'Legalább %d karakter hosszú',
    lowerCase: 'Kisbetűk (a-z)',
    shouldContain: 'Tartalmazzon:',
    specialCharacters: 'Különleges karakterek (pl. !@#$%^&*)',
    upperCase: 'Nagybetűk (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Vagy bejelentkezéshez vagy regisztrációhoz<br/>add meg az e-mail címed.',
  passwordlessEmailCodeInstructions: 'A PIN-t e-mailben elküldtük a %s címre.',
  passwordlessEmailInstructions:
    'Bejelentkezéshez vagy regisztrációhoz<br/>add meg az e-mail címed.',
  passwordlessSMSAlternativeInstructions:
    'Vagy bejelentkezéshez vagy regisztrációhoz<br/>add meg a telefonszámod.',
  passwordlessSMSCodeInstructions: 'A PIN-t SMS-ben elküldtük a %s számra.',
  passwordlessSMSInstructions: 'Bejelentkezéshez vagy regisztrációhoz<br/>add meg a telefonszámod.',
  phoneNumberInputPlaceholder: 'telefonszámod',
  resendCodeAction: 'Nem kaptad meg a PIN-t?',
  resendLabel: 'Újraküldés',
  resendingLabel: 'Újraküldés...',
  retryLabel: 'Próbáld újra',
  sentLabel: 'Elküldve!',
  showPassword: 'Mutasd a jelszót',
  signUpTitle: 'Regisztrálj',
  signUpLabel: 'Regisztráció',
  signUpSubmitLabel: 'Regisztráció',
  signUpTerms:
    'A regisztrációval elfogadom a felhasználási feltételeket és az adatkezelési tájékoztatót.',
  signUpWithLabel: '%s regisztráció',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'SSO engedélyezve',
  submitLabel: 'Mehet',
  unrecoverableError: 'Valami hiba történt.<br />Kérlek, lépj kapcsolatba az ügyfélszolgálattal.',
  usernameFormatErrorHint:
    'Használj %d-%d betűt, számot és a következő karaktereket: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'felhasználóneved',
  usernameOrEmailInputPlaceholder: 'felhasználónév/e-mail',
  title: 'Auth0',
  welcome: 'Üdv %s!',
  windowsAuthInstructions: 'Céges hálózatról kapcsolódsz&hellip;',
  windowsAuthLabel: 'Windows bejelentkezés',
  mfaInputPlaceholder: 'Kód',
  mfaLoginTitle: 'Kétlépcsős azonosítás',
  mfaLoginInstructions: 'Kérlek, add meg a mobilalkalmazás által generált ellenőrző kódot.',
  mfaSubmitLabel: 'Belépés',
  mfaCodeErrorHint: '%d számot kell beírni',
  captchaCodeInputPlaceholder: 'Írja be a fenti kódot',
  captchaMathInputPlaceholder: 'Oldja meg a fenti képletet'
};
