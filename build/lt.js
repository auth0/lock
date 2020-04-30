Auth0.registerLanguageDictionary('lt', {
  error: {
    forgotPassword: {
      too_many_requests:
        'Jūs pasiekėte slaptažodžio keitimų limitą. Prašome palaukti, prieš bandant dar kartą.',
      'lock.fallback': 'Atsiprašome, nesklandumai keičiant slaptažodį.',
      enterprise_email:
        'Jūsų el.pašto domenas yra Enterprise tapatybės teikėjo dalis. Norėdami iš naujo nustatyti slaptažodį, apsilankykite pas savo saugumo administratorių.'
    },
    login: {
      blocked_user: 'Vartotojas užblokuotas.',
      invalid_user_password: 'Neteisingas slaptažodis.',
      'lock.fallback': 'Atsiprašome, kažkas nutiko bandant prisijungti.',
      'lock.invalid_code': 'Neteisingas kodas.',
      'lock.invalid_email_password': 'Neteisingas el.pašto adresas arba slaptažodis.',
      'lock.invalid_username_password': 'Neteisingas vartotojo vardas arba slaptažodis.',
      'lock.network': 'Mes negalėjome pasiekti serverio. Patikrinkite ryšį ir bandykite dar kartą.',
      'lock.popup_closed': 'Iškylantis langas uždarytas, bandykite dar kartą.',
      'lock.unauthorized': 'Nepakankami privilegijos, bandykite dar kartą.',
      'lock.mfa_registration_required':
        'Multifaktorinis autentifikavimas yra būtinas, tačiau prietaisas nėra registruotas. Prašome jį užregistruoti prieš tęsiant.',
      'lock.mfa_invalid_code': 'Neteisingas kodas, bandykite dar kartą.',
      password_change_required:
        'Jums reikia atnaujinti savo slaptažodį, nes prisijungiate pirmą kartą, arba slaptažodis yra negaliojantis.',
      password_leaked:
        'Mes nustatėme galimą saugumo problemą su šia sąskaita. Norėdami apsaugoti jūsų sąskaitą, mes užblokuosime šį prisijungimą. Į jūsų el. paštą buvo išsiųsta instrukcija, kaip atblokuoti jūsų sąskaitą.',
      too_many_attempts: 'Jūsų sąskaita buvo užblokuota, po kelių iš eilės bandymų prisijungti.',
      session_missing:
        'Nepavyko užbaigti jūsų autentifikavimo prašymo. Bandykite dar kartą uždarius visus atidarytus dialogo langus.',
      'hrd.not_matching_email': 'Prašome naudoti jūsų įmonės el.pašto adresą prisijungimui.',
      too_many_requests:
        'Mes atsiprašome. Šiuo metu yra per daug užklausų. Atnaujinkite puslapį ir bandykite dar kartą. Jei tai išlieka, bandykite dar kartą vėliau.'
    },
    passwordless: {
      'bad.email': 'Neteisingas el.pašto adresas',
      'bad.phone_number': 'Neteisingas telefono numeris',
      'lock.fallback': 'Atsiprašome, įvyko netikėta klaida.'
    },
    signUp: {
      invalid_password: 'Slaptažodis neteisingas.',
      'lock.fallback': 'Atsiprašome, kažkas nutiko bandant užsiregistruoti.',
      password_dictionary_error: 'Šis slaptažodis yra per dažnai naudojamas.',
      password_no_user_info_error: 'Slaptažodis remiantis vartotojų informacija.',
      password_strength_error: 'Šis slaptažodis yra per silpnas.',
      user_exists: 'Vartotojas jau egzistuoja.',
      username_exists: 'Vartotojo vardas jau egzistuoja.'
    }
  },
  success: {
    logIn: 'Ačiū už prisijungimą.',
    forgotPassword: 'Mes išsiuntėme jums el.laišką iš naujo nustatyti slaptažodį.',
    magicLink: 'Mes išsiuntėme jums nuorodą į prisijungimą<br />į %s.',
    signUp: 'Dėkojame, kad užsiregistravote.'
  },
  blankErrorHint: 'Laukas negali būti tuščias',
  codeInputPlaceholder: 'jūsų kodas',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'arba',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'arba',
  emailInputPlaceholder: 'jusu@pastas.com',
  enterpriseLoginIntructions: 'Prisijunkite su jūsų įmonės įgaliojimais.',
  enterpriseActiveLoginInstructions: 'Prašome įvesti jūsų įmonės rekvizitus %s.',
  failedLabel: 'Nepavyko!',
  forgotPasswordTitle: 'Atstatyti slaptažodį',
  forgotPasswordAction: 'Negalite prisiminti slaptažodžio?',
  forgotPasswordInstructions:
    'Įveskite jūsų el.pašto adresą. Mes atsiųsime jums laišką iš nustatyti nauja slaptažodį.',
  forgotPasswordSubmitLabel: 'Siųsti laišką',
  invalidErrorHint: 'Negaliojantys duomenys',
  lastLoginInstructions: 'Paskutinį kartą prisijungėte su',
  loginAtLabel: 'Prisijunkite naudojant šią nuorodą %s',
  loginLabel: 'Prisijungti',
  loginSubmitLabel: 'Prisijungti',
  loginWithLabel: 'Prisijungti su %s',
  notYourAccountAction: 'Ne jūsų prisijungimas?',
  passwordInputPlaceholder: 'slaptažodis',
  passwordStrength: {
    containsAtLeast: 'Turi turėti bent %d iš šių %d tipų simbolių:',
    identicalChars: 'Ne daugiau nei %d identiškų simbolių iš eilės (pvz, "%s" neleidžiama)',
    nonEmpty: 'Slaptažodis negali būti tuščias',
    numbers: 'Numeriai (0-9)',
    lengthAtLeast: 'Bent %d simbolių',
    lowerCase: 'Mažosios raidės (a-z)',
    shouldContain: 'Turi turėti:',
    specialCharacters: 'Specialūs simboliai (pvz. !@#$%^&*)',
    upperCase: 'Viršutinės raidės (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Arba įveskite el.pašto adresą prisijungti<br/>arba susikurti paskyrą',
  passwordlessEmailCodeInstructions: 'Žinutę su kodu buvo išsiųstas į %s.',
  passwordlessEmailInstructions: 'Įveskite el.pašto adresą prisijungti<br/>arba susikurti paskyrą',
  passwordlessSMSAlternativeInstructions:
    'Arba įveskite telefono numerį prisijungti<br/>arba susikurti paskyrą',
  passwordlessSMSCodeInstructions: 'SMS su kodu buvo išsiųstas<br/>į %s.',
  passwordlessSMSInstructions: 'Įveskite telefono numerį prisijungti<br/>arba susikurti paskyrą',
  phoneNumberInputPlaceholder: 'Jūsų telefono numeris',
  resendCodeAction: 'Negavote kodo?',
  resendLabel: 'Persiūsti',
  resendingLabel: 'Siunčiama...',
  retryLabel: 'Bandyti dar kartą',
  sentLabel: 'Išsiųsta!',
  showPassword: 'Rodyti slaptažodį',
  signUpTitle: 'Užsiregistruoti',
  signUpLabel: 'Registracija',
  signUpSubmitLabel: 'Užsiregistruoti',
  signUpWithLabel: 'Užsiregistruoti su %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On įjungtas',
  submitLabel: 'Pateikti',
  unrecoverableError: 'Įvyko netikėta klaida.<br />Prašome susisiekti su technine pagalba.',
  usernameFormatErrorHint: 'Naudokite %d-%d raides, skaičiai ir šie simboliai: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'Jūsų vartotojo vardas',
  usernameOrEmailInputPlaceholder: 'el.pašto adresas / vartotojo vardas',
  title: 'Auth0',
  welcome: 'Sveiki %s!',
  windowsAuthInstructions: 'Jūs esate prijungtas iš jūsų įmonių tinklo&hellip;',
  windowsAuthLabel: 'Windows autentifikavimas',
  mfaInputPlaceholder: 'Kodas',
  mfaLoginTitle: 'Dviejų žingsnių autentifikacija',
  mfaLoginInstructions: 'Prašome įvesti patvirtinimo kodą sugeneruotą mobiliosios programėlės.',
  mfaSubmitLabel: 'Prisijungti',
  mfaCodeErrorHint: 'Naudoti %d numerius',
  signUpTerms:
    'Registruodamiesi jūs sutinkate su mūsų paslaugų teikimo sąlygomis ir privatumo politika.'
});
