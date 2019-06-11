// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Dosegnuli ste najveći dopušteni broj pokušaja promjene lozinke. Pričekajte prije nego što pokušate ponovno.',
      'lock.fallback':
        'Ispričavamo se, ali nešto je pošlo po zlu tijekom obrade zahtjeva za promjenom lozinke.',
      enterprise_email:
        'Domena vaše e-pošte dio je davatelja identiteta tvrtke. Da biste poništili zaporku, obratite se svom administratoru za sigurnost.'
    },
    login: {
      blocked_user: 'Korisnik je blokiran.',
      invalid_user_password: 'Pogrešni pristupni podatci.',
      'lock.fallback': 'Ispričavamo se, ali nešto je pošlo po zlu tijekom pokušaja prijave.',
      'lock.invalid_code': 'Pogrešan kôd.',
      'lock.invalid_email_password': 'Pogrešna adresa elektroničke pošte ili lozinka.',
      'lock.invalid_username_password': 'Pogrešno korisničko ime ili lozinka.',
      'lock.network':
        'Nismo uspjeli dosegnuti poslužitelj. Provjerite svoju vezu i pokušajte ponovno.',
      'lock.popup_closed': 'Zatvoren skočni prozor. Pokušajte ponovno.',
      'lock.unauthorized': 'Dozvole nisu odobrene. Pokušajte ponovno.',
      'lock.mfa_registration_required':
        'Potrebna je višečimbenična provjera autentičnosti, ali vaš uređaj nije prijavljen. Prijavite ga prije nastavka.',
      'lock.mfa_invalid_code': 'Pogrešan kôd. Pokušajte ponovno.',
      password_change_required:
        'Trebate ažurirati svoju lozinku jer se prijavljujete prvi put ili jer je vaša lozinka istekla.',
      password_leaked:
        'Otkrili smo mogući sigurnosni problem s ovim računom. Kako biste zaštitili svoj račun, blokirali smo ovu prijavu. Poslali smo vam elektroničku poruku s uputama za odblokiravanje vašeg računa.',
      too_many_attempts: 'Vaš je račun blokiran uslijed višestrukih uzastopnih pokušaja prijave.',
      session_missing:
        'Zahtjev za provjerom autentičnosti nije se mogao završiti. Pokušajte ponovno nakon što zatvorite sve otvorene dijaloške okvire.',
      'hrd.not_matching_email':
        'Upotrijebite svoju poslovnu adresu elektroničke pošte kako biste se prijavili.',
      too_many_requests:
        'Žao nam je. Trenutno ima previše zahtjeva. Ponovo učitajte stranicu i pokušajte ponovno. Ako se to nastavi, pokušajte ponovno kasnije.'
    },
    passwordless: {
      'bad.email': 'Neispravna adresa elektroničke pošte',
      'bad.phone_number': 'Neispravan broj telefona',
      'lock.fallback': 'Ispričavamo se, ali nešto je pošlo po zlu.'
    },
    signUp: {
      invalid_password: 'Lozinka je neispravna.',
      'lock.fallback': 'Ispričavamo se, ali nešto je pošlo po zlu tijekom pokušaja registracije.',
      password_dictionary_error: 'Lozinka je uobičajena.',
      password_no_user_info_error: 'Lozinka se zasniva na korisničkim podatcima.',
      password_strength_error: 'Lozinka je preslaba.',
      user_exists: 'Korisnik već postoji.',
      username_exists: 'Korisničko ime već postoji.'
    }
  },
  success: {
    logIn: 'Zahvaljujemo na prijavi.',
    forgotPassword:
      'Upravo smo vam poslali elektroničku poruku kako biste vratili izvornu lozinku.',
    magicLink: 'Poslali smo vam poveznicu za prijavu<br />u %s.',
    signUp: 'Hvala vam na registraciji.'
  },
  blankErrorHint: 'Ne može biti prazno',
  codeInputPlaceholder: 'vaš kôd',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ili',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ili',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Prijavite se svojim poslovnim pristupnim podatcima.',
  enterpriseActiveLoginInstructions:
    'Upišite svoje poslovne pristupne podatke na mrežnom mjestu %s.',
  failedLabel: 'Neuspješno!',
  forgotPasswordTitle: 'Vraćanje vaše izvorne lozinke',
  forgotPasswordAction: 'Zaboravili ste lozinku?',
  forgotPasswordInstructions:
    'Upišite svoju adresu elektroničke pošte. Poslat ćemo vam elektroničku poruku kako biste vratili izvornu lozinku.',
  forgotPasswordSubmitLabel: 'Pošalji elektroničku poruku',
  invalidErrorHint: 'Nevaljano',
  lastLoginInstructions: 'Vrijeme zadnje prijave s',
  loginAtLabel: 'Prijavite se na mrežnom mjestu %s',
  loginLabel: 'Prijava',
  loginSubmitLabel: 'Prijava',
  loginWithLabel: 'Prijava s %s',
  notYourAccountAction: 'Nije vaš račun?',
  passwordInputPlaceholder: 'vaša lozinka',
  passwordStrength: {
    containsAtLeast: 'Sadržava barem jedan %d od sljedećih %d znakova:',
    identicalChars: 'Ne više od %d jednakih znakova u redu (npr., „%s” nije dopušten)',
    nonEmpty: 'Potrebno je upisati lozinku',
    numbers: 'Brojevi (npr. 0 – 9)',
    lengthAtLeast: 'Barem %d znaka/ova',
    lowerCase: 'Mala slova (a – z)',
    shouldContain: 'Treba sadržavati:',
    specialCharacters: 'Posebne znakove (npr. !@#$%^&*)',
    upperCase: 'Velika slova (A – Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'U protivnom, upišite svoju adresu elektroničke pošte kako biste se prijavili<br/>ili napravite račun.',
  passwordlessEmailCodeInstructions: 'Elektronička poruka s kôdom poslana vam je na %s.',
  passwordlessEmailInstructions:
    'Upišite svoju adresu elektroničke pošte kako biste se prijavili<br/>ili napravite račun.',
  passwordlessSMSAlternativeInstructions:
    'U protivnom, upišite svoj broj telefona kako biste se prijavili<br/>ili napravite račun.',
  passwordlessSMSCodeInstructions: 'Tekstualna poruka s kôdom poslana vam je<br/>na %s.',
  passwordlessSMSInstructions:
    'Upišite svoj broj telefona kako biste se prijavili<br/>ili napravite račun.',
  phoneNumberInputPlaceholder: 'vaš broj telefona',
  resendCodeAction: 'Niste dobili kôd?',
  resendLabel: 'Ponovno pošalji',
  resendingLabel: 'Ponovno slanje u tijeku...',
  retryLabel: 'Pokušaj ponovo',
  sentLabel: 'Poslano!',
  showPassword: 'Prikaži lozinku',
  signUpTitle: 'Registracija',
  signUpLabel: 'Registracija',
  signUpSubmitLabel: 'Registracija',
  signUpWithLabel: 'Registracija s %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Omogućena jednostruka prijava',
  submitLabel: 'Pošalji',
  unrecoverableError: 'Nešto je pošlo po zlu.<br />Obratite se tehničkoj podršci.',
  usernameFormatErrorHint:
    'Upotrijebite %d-%d slova, brojeve i sljedeće znakove: „_", ".", "+", "-"',
  usernameInputPlaceholder: 'vaše korisničko ime',
  usernameOrEmailInputPlaceholder: 'korisničko ime/adresa elektroničke pošte',
  title: 'Auth0',
  welcome: 'Dobro došli %s!',
  windowsAuthInstructions: 'Povezani ste preko poslovne mreže&hellip;',
  windowsAuthLabel: 'Provjera autentičnosti Windowsa',
  mfaInputPlaceholder: 'Kôd',
  mfaLoginTitle: 'Provjera autentičnosti u dva koraka',
  mfaLoginInstructions:
    'Upišite kôd za provjeru autentičnosti koji je stvorila vaša mobilna aplikacija.',
  mfaSubmitLabel: 'Prijava',
  mfaCodeErrorHint: 'Upotrijebi %d brojeve',
  signUpTerms: 'Prijavljivanjem prihvaćate naše uvjete pružanja usluge i pravila o privatnosti.'
};
