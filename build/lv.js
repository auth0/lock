Auth0.registerLanguageDictionary('lv', {
  error: {
    forgotPassword: {
      too_many_requests:
        'Jūs sasniedzāt atļauto paroles maiņas mēģinājumu skaitu. Lūdzu, uzgaidiet, pirms mēģinat vēlreiz.',
      'lock.fallback': 'Diemžēl, pieprasot paroles maiņu, radās problēma.',
      enterprise_email:
        'Jūsu e-pasta domēns ir daļa no uzņēmuma identitātes nodrošinātāja. Lai atiestatītu paroli, lūdzu, sazinieties ar administratoru.'
    },
    login: {
      blocked_user: 'Lietotājs ir bloķēts.',
      invalid_user_password: 'Nepareizi akreditācijas dati.',
      'lock.fallback': 'Diemžēl, mēģinot pieteikties, radās problēma.',
      'lock.invalid_code': 'Nepareizs kods.',
      'lock.invalid_email_password': 'Nepareiza e-pasta adrese vai parole.',
      'lock.invalid_username_password': 'Nepareizs lietotājvārds vai parole.',
      'lock.network':
        'Mēs nevarējās sazināties ar serveri. Pārbaudiet savienojumu un mēģiniet vēlreiz.',
      'lock.popup_closed': 'Uznirstošais logs aizvērts. Mēģiniet vēlreiz.',
      'lock.unauthorized': 'Atļaujas netika piešķirtas. Mēģiniet vēlreiz.',
      'lock.mfa_registration_required':
        'Nepieciešama daudzfaktoru autentifikācija, taču jūsu ierīce nav reģistrēta. Reģistrējiet to pirms turpmākām darbībām.',
      'lock.mfa_invalid_code': 'Nepareizs kods. Lūdzu, mēģiniet vēlreiz.',
      password_change_required:
        'Jums jāatjaunina parole, jo šī ir pirmā pieteikšanās reizi vai arī ir beidzies paroles derīguma termiņš.',
      password_leaked:
        'Saistībā ar šo kontu atklājām iespējamu drošības problēmu. Lai aizsargātu jūsu kontu, esam bloķējuši šo lietotājvārdu. Tika nosūtīts e-pasta ziņojums ar norādījumiem par to, kā atbloķēt kontu.',
      too_many_attempts: 'Jūsu konts ir bloķēts pēc vairākiem secīgiem pieteikšanās mēģinājumiem.',
      session_missing:
        'Nevarēja izpildīt jūsu autentifikācijas pieprasījumu. Lūdzu, mēģiniet vēlreiz pēc visu dialoglodziņu aizvēršanas',
      'hrd.not_matching_email': 'Lai pieteiktos, lūdzu, izmantojiet uzņēmuma e-pasta adresi.'
    },
    passwordless: {
      'bad.email': 'Nederīga e-pasta adrese',
      'bad.phone_number': 'Nederīgs tālruņa numurs',
      'lock.fallback': 'Diemžēl radās problēma'
    },
    signUp: {
      invalid_password: 'Nederīga parole.',
      'lock.fallback': 'Diemžēl, mēģinot reģistrēties, radās problēma.',
      password_dictionary_error: 'Parrole ir pārāk bieži sastopama.',
      password_no_user_info_error: 'Paroles pamatā ir lietotāja informācija.',
      password_strength_error: 'Parrole ir pārāk vienkārša.',
      user_exists: 'Lietotājs jau eksistē.',
      username_exists: 'Lietotājvārds jau eksistē.'
    }
  },
  success: {
    logIn: 'Paldies, ka pieteicāties!',
    forgotPassword: 'Mēs tikko nosūtījām jums e-pasta ziņojumu paroles atiestatīšanai.',
    magicLink: 'Mēs jums nosūtījām saiti, kurā pieteikties<br />tīmekļa lapā %s.',
    signUp: 'Paldies, ka reģistrējāties!'
  },
  blankErrorHint: 'Nevar būt tukšs',
  codeInputPlaceholder: 'jūsu kods',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'vai',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'vai',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Piesakieties, izmantojot uzņēmuma akreditācijas datus.',
  enterpriseActiveLoginInstructions: 'Lūdzu, ievadiet uzņēmuma akreditācijas datus šeit: %s.',
  failedLabel: 'Neizdevās!',
  forgotPasswordTitle: 'Atiestatiet paroli',
  forgotPasswordAction: 'Neatceraties savu paroli?',
  forgotPasswordInstructions:
    'Lūdzu, ievadiet savu e-pasta adresi. Mēs jums nosūtīsim e-pasta ziņojumu paroles atiestatīšanai.',
  forgotPasswordSubmitLabel: 'Nosūtīt e-pasta ziņojumu',
  invalidErrorHint: 'Nederīgs',
  lastLoginInstructions: 'Jūs pēdējo reizi pieteicāties, izmantojot',
  loginAtLabel: 'Pieteikties šeit: %s',
  loginLabel: 'Pieteikties',
  loginSubmitLabel: 'Pieteikties',
  loginWithLabel: 'Pieteikties, izmantojot %s',
  notYourAccountAction: 'Šis nav jūsu konts?',
  passwordInputPlaceholder: 'jūsu parole',
  passwordStrength: {
    containsAtLeast: 'Satur vismaz %d no tālāk norādītajiem %d rakstzīmju veidiem:',
    identicalChars: 'Ne vairāk kā %d identiskas rakstzīmes rindā (piemēram, "%s" nav atļauta)',
    nonEmpty: 'Nepieciešama parole, kas nav tukša',
    numbers: 'Cipari (t.i., 0–9)',
    lengthAtLeast: 'Vismaz %d rakstzīmes garš',
    lowerCase: 'Mazie burti (a–z)',
    shouldContain: 'Jāsatur:',
    specialCharacters: 'speciālās rakstzīmes (piemēram, !, @, #, $, %, ^, &, *)',
    upperCase: 'lielie burti (A–Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Vai arī ievadiet savu e-pasta adresi, lai pierakstītos<br/>vai izveidotu kontu',
  passwordlessEmailCodeInstructions: 'E-pasta ziņojums ar kodu ir nosūtīts uz adresi %s.',
  passwordlessEmailInstructions:
    'Ievadiet savu e-pasta adresi, lai pieteiktos<br/>vai izveidotu kontu',
  passwordlessSMSAlternativeInstructions:
    'Vai arī ievadiet savu tālruņa numuru, lai pieteiktos<br/>vai izveidotu kontu',
  passwordlessSMSCodeInstructions: 'Īsziņa ar kodu ir nosūtīta<br/>uz adresi %s.',
  passwordlessSMSInstructions:
    'Ievadiet savu tālruņa numuru, lai pieteiktos<br/>vai izveidotu kontu',
  phoneNumberInputPlaceholder: 'jūsu tālruņa numurs',
  resendCodeAction: 'Nesaņēmāt kodu?',
  resendLabel: 'Nosūtīt atkārtoti',
  resendingLabel: 'Notiek atkārtota sūtīšana...',
  retryLabel: 'Mēģināt vēlreiz',
  sentLabel: 'Nosūtīts!',
  showPassword: 'Rādīt paroli',
  signUpTitle: 'Reģistrēties',
  signUpLabel: 'Reģistrēties',
  signUpSubmitLabel: 'Reģistrēties',
  signUpTerms: 'Reģistrējoties jūs piekrītat mūsu pakalpojuma noteikumiem un privātuma politikai.',
  signUpWithLabel: 'Reģistrējieties, izmantojot %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Vienotā pierakstīšanās ir iespējota',
  submitLabel: 'Iesniegt',
  unrecoverableError: 'Radās problēma.<br />Lūdzu, sazinieties ar tehniskā atbalsta dienestu.',
  usernameFormatErrorHint:
    'Izmantojiet burtus %d–%d, ciparus un tālāk norādītās rakstzīmes: “_”, “.”, “+”, “-”',
  usernameInputPlaceholder: 'jūsu lietotājvārds',
  usernameOrEmailInputPlaceholder: 'lietotājvārds/e-pasta adrese',
  title: 'Auth0',
  welcome: 'Laipni lūdzam, %s!',
  windowsAuthInstructions: 'Jūs izveidojāt savienojumu, izmantojot uzņēmuma tīklu&hellip;',
  windowsAuthLabel: 'Windows autentifikācija',
  mfaInputPlaceholder: 'Kods',
  mfaLoginTitle: 'Divsoļu pārbaude',
  mfaLoginInstructions: 'Lūdzu, ievadiet mobilās lietotnes ģenerēto pārbaudes kodu.',
  mfaSubmitLabel: 'Pieteikties',
  mfaCodeErrorHint: 'Izmantojiet %d ciparus'
});
