export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Dostigli ste ograničenje broja pokušaja promene lozinke. Sačekajte pre nego što pokušate ponovo.',
      'lock.fallback': "Žao nam je, došlo je do greške prilikom slanja zahteva za promenu lozinke.",
      enterprise_email:
        "Domen vaše adrese e-pošte pripada kompanijskom dobavljaču identiteta. Da biste ponovo postavili lozinku, obratite se administratoru bezbednosti."
    },
    login: {
      blocked_user: 'Korisnik je blokiran.',
      invalid_user_password: 'Pogrešni akreditivi.',
      'lock.fallback': "Žao nam je, došlo je do greške prilikom pokušaja prijavljivanja.",
      'lock.invalid_code': 'Pogrešan kôd.',
      'lock.invalid_email_password': 'Pogrešna adresa e-pošte ili lozinka.',
      'lock.invalid_username_password': 'Pogrešno korisničko ime ili lozinka.',
      'lock.network': 'Nismo uspeli da se povežemo sa serverom. Proverite vezu i pokušajte ponovo.',
      'lock.popup_closed': 'Iskačući prozor je zatvoren. Pokušajte ponovo.',
      'lock.unauthorized': 'Dozvole nisu dodeljene. Pokušajte ponovo.',
      'lock.mfa_registration_required':
        'Potrebna je višestruka potvrda identiteta, ali vaš uređaj nije registrovan. Registrujte ga pre nego što nastavite.',
      'lock.mfa_invalid_code': 'Pogrešan kôd. Pokušajte ponovo.',
      password_change_required:
        'Morate ažurirati lozinku pošto je ovo prvi put da se prijavljujete ili zbog toga što je lozinka istekla.', // TODO: verify error code
      password_leaked:
        'Otkrili smo potencijalni bezbednosni problem sa vašim nalogom. Da bismo zaštitili vaš nalog, blokirali smo ovo prijavljivanje. Poslali smo vam e-poruku koja sadrži uputstvo za deblokadu naloga.',
      too_many_attempts: 'Vaš nalog je blokiran nakon više uzastopnih pokušaja prijavljivanja.',
      session_missing:
        "Nije bilo moguće ispuniti vaš zahtev za potvrdu identiteta. Pokušajte ponovo nakon što zatvorite sve otvorene dijaloge",
      'hrd.not_matching_email': 'Prijavite se pomoću kompanijske adrese e-pošte.'
    },
    passwordless: {
      'bad.email': 'Adresa e-pošte je nevažeća',
      'bad.phone_number': 'Broj telefona je nevažeći',
      'lock.fallback': "Žao nam je, došlo je do greške"
    },
    signUp: {
      invalid_password: 'Lozinka je nevažeća.',
      'lock.fallback': "Žao nam je, došlo je do greške prilikom pokušaja registracije.",
      password_dictionary_error: 'Lozinka je previše česta.',
      password_no_user_info_error: 'Lozinka se zasniva na podacima korisnika.',
      password_strength_error: 'Lozinka je previše slaba.',
      user_exists: 'Korisnik već postoji.',
      username_exists: 'Korisničko ime već postoji.'
    }
  },
  success: {
    // success messages show above the form or in a confirmation pane
    logIn: 'Hvala vam što ste se prijavili.',
    forgotPassword: "Upravo smo vam poslali e-poruku za ponovno postavljanje lozinke.",
    magicLink: 'Poslali smo vam vezu za prijavljivanje<br />na %s.',
    signUp: 'Hvala vam što ste se registrovali.'
  },
  blankErrorHint: "Ne može biti prazno",
  codeInputPlaceholder: 'vaš kôd',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ili',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ili',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Prijavite se kompanijskim akreditivima.',
  enterpriseActiveLoginInstructions: 'Unesite kompanijske akreditive na %s.',
  failedLabel: 'Nije uspelo!',
  forgotPasswordTitle: 'Ponovo postavite lozinku',
  forgotPasswordAction: "Ne sećate se lozinke?",
  forgotPasswordInstructions:
    'Unesite adresu e-pošte. Poslaćemo vam e-poruku za ponovno postavljanje lozinke.',
  forgotPasswordSubmitLabel: 'Pošalji e-poruku',
  invalidErrorHint: 'Nevažeće',
  lastLoginInstructions: 'Poslednji put ste se prijavili sa',
  loginAtLabel: 'Prijavite se na %s',
  loginLabel: 'Prijavi me',
  loginSubmitLabel: 'Prijavi me',
  loginWithLabel: 'Prijavite se sa %s',
  notYourAccountAction: 'Nije vaš nalog?',
  passwordInputPlaceholder: 'vaša lozinka',
  passwordStrength: {
    containsAtLeast: 'Sadrže barem %d od sledećih %d tipova znakova:',
    identicalChars: 'Ne više od %d istovetnih znakova u redu (npr. „%s“ nije dozvoljen)',
    nonEmpty: 'Lozinka ne sme biti prazna',
    numbers: 'Brojevi (tj. 0-9)',
    lengthAtLeast: 'Dužina od barem %d znakova',
    lowerCase: 'Mala slova (a-z)',
    shouldContain: 'Mora da sadrži:',
    specialCharacters: 'Specijalne znakove (npr. !@#$%^&*)',
    upperCase: 'Velika slova (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'U suprotnom, unesite adresu e-pošte da biste se prijavili<br/> ili kreirajte nalog',
  passwordlessEmailCodeInstructions: 'E-poruka sa kôdom poslata je na %s.',
  passwordlessEmailInstructions: 'Unesite adresu e-pošte da biste se prijavili<br/> ili kreirali nalog',
  passwordlessSMSAlternativeInstructions:
    'U suprotnom, unesite broj telefona da biste se prijavili<br/> ili kreirajte nalog',
  passwordlessSMSCodeInstructions: 'SMS poruka sa kôdom poslata je <br/>na %s.',
  passwordlessSMSInstructions: 'Unesite broj telefona da biste se prijavili<br/> ili kreirajte nalog',
  phoneNumberInputPlaceholder: 'vaš broj telefona',
  resendCodeAction: 'Niste dobili kôd?',
  resendLabel: 'Ponovo pošalji',
  resendingLabel: 'Ponovno slanje...',
  retryLabel: 'Pokušaj ponovo',
  sentLabel: 'Poslato!',
  showPassword: 'Prikaži lozinku',
  signUpTitle: 'Registruj se',
  signUpLabel: 'Registruj se',
  signUpSubmitLabel: 'Registruj se',
  signUpTerms: 'Registracijom prihvatate naše uslove korišćenja usluge i politiku privatnosti.',
  signUpWithLabel: 'Registrujte se sa %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Jedinstveno prijavljivanje je omogućeno',
  submitLabel: 'Pošalji',
  unrecoverableError: 'Došlo je do greške.<br />Obratite se tehničkoj podršci.',
  usernameFormatErrorHint:
    'Koristite %d-%d slova, brojeve i sledeće znakove: „_“, „.“, „+“, „-“',
  usernameInputPlaceholder: 'vaše korisničko ime',
  usernameOrEmailInputPlaceholder: 'korisničko ime/adresa e-pošte',
  title: 'Auth0',
  welcome: 'Dobro došli %s!',
  windowsAuthInstructions: 'Povezani ste sa kompanijske mreže&hellip;',
  windowsAuthLabel: 'Windows potvrda identiteta',
  mfaInputPlaceholder: 'Kôd',
  mfaLoginTitle: 'Verifikacija u dva koraka',
  mfaLoginInstructions: 'Unesite kôd za verifikaciju koji je generisan u vašoj aplikaciji za mobilne uređaje',
  mfaSubmitLabel: 'Prijavi me',
  mfaCodeErrorHint: 'Koristite %d broj(ev)a'
};
