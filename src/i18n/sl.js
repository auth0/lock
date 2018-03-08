// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Dosegli ste omejitev števila poskusov spremembe gesla. Pred ponovnim poskusom morate počakati.',
      'lock.fallback': 'Žal je prišlo do napake pri zahtevi za spremembo gesla.',
      enterprise_email:
        'Domena vašega e-poštnega naslova je del ponudnika identitete podjetja. Če želite ponastaviti geslo, obiščite svojega skrbnika za varnost.'
    },
    login: {
      blocked_user: 'Uporabnik je blokiran.',
      invalid_user_password: 'Napačni podatki za prijavo.',
      'lock.fallback': 'Žal je pri prijavi prišlo do napake.',
      'lock.invalid_code': 'Napačna koda.',
      'lock.invalid_email_password': 'Napačna e-pošta ali geslo.',
      'lock.invalid_username_password': 'Napačno uporabniško ime ali geslo.',
      'lock.network': 'Strežnik ni dosegljiv. Preverite povezavo in poskusite ponovno.',
      'lock.popup_closed': 'Pojavno okno se je zaprlo. Poskusite ponovno.',
      'lock.unauthorized': 'Dostop ni bil dovoljen. Poskusite ponovno.',
      'lock.mfa_registration_required':
        'Zahtevana je večstranska avtentikacija, a vaša naprava ni vpisana. Pred nadaljevanjem vpišite svojo napravo.',
      'lock.mfa_invalid_code': 'Napačna koda. Poskusite ponovno.',
      password_change_required:
        'Svoje geslo morate spremeniti, ker je to vaša prva prijava ali pa je vaše geslo poteklo.',
      password_leaked:
        'Zaznali smo morebitno varnostno težavo s tem računom. Za zaščito računa smo blokirali prijavo. Poslali smo vam e-pošto z navodili za odblokiranje računa.',
      too_many_attempts: 'Po več zaporednih poskusih napačne prijave je bil vaš račun blokiran.',
      session_missing:
        'Zahteve za avtentikacijo ni bilo možno izpolniti. Zaprite vsa pogovorna okna in poskusite ponovno.',
      'hrd.not_matching_email': 'Za prijavo uporabite svoj službeni e-poštni naslov.'
    },
    passwordless: {
      'bad.email': 'Napačen e-poštni naslov',
      'bad.phone_number': 'Napačna telefonska številka',
      'lock.fallback': 'Žal je prišlo do napake'
    },
    signUp: {
      invalid_password: 'Napačno geslo.',
      'lock.fallback': 'Žal je prišlo do napake pri poskusu prijave.',
      password_dictionary_error: 'Geslo je preveč splošno.',
      password_no_user_info_error: 'Geslo temelji na informacijah o uporabniku.',
      password_strength_error: 'Geslo je prešibko.',
      user_exists: 'Uporabnik že obstaja.',
      username_exists: 'Uporabniško ime že obstaja.'
    }
  },
  success: {
    logIn: 'Hvala za prijavo.',
    forgotPassword: 'Poslali smo vam e-pošto za ponastavitev gesla.',
    magicLink: 'Poslali smo vam povezavo za prijavo v<br /> %s.',
    signUp: 'Hvala za vpis.'
  },
  blankErrorHint: 'Ne sme biti prazno',
  codeInputPlaceholder: 'vaša koda',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ali',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ali',
  emailInputPlaceholder: 'ime@primer.com',
  enterpriseLoginIntructions: 'Prijavite se s službenimi podatki.',
  enterpriseActiveLoginInstructions: 'Vnesite svoje službene podatke v %s.',
  failedLabel: 'Napaka!',
  forgotPasswordTitle: 'Ponastavite svoje geslo',
  forgotPasswordAction: 'Ste pozabili geslo?',
  forgotPasswordInstructions:
    'Vnesite svoj e-poštni naslov. Poslali vam bomo sporočilo za ponastavitev gesla.',
  forgotPasswordSubmitLabel: 'Pošlji e-pošto',
  invalidErrorHint: 'Napaka',
  lastLoginInstructions: 'Nazadnje ste se prijavili z',
  loginAtLabel: 'Prijava v %s',
  loginLabel: 'Prijava',
  loginSubmitLabel: 'Prijava',
  loginWithLabel: 'Prijava v %s',
  notYourAccountAction: 'Ni vaš račun?',
  passwordInputPlaceholder: 'vaše geslo',
  passwordStrength: {
    containsAtLeast: 'Vsebovati mora vsaj %d naslednjih %d vrst znakov:',
    identicalChars: 'Največ %d enakih znakov zaporedoma (npr. "%s" ni dovoljeno)',
    nonEmpty: 'Geslo ne sme biti brez znakov',
    numbers: 'Številke (npr. 0-9)',
    lengthAtLeast: 'Vsebovati mora vsaj %d znakov',
    lowerCase: 'Male črke (a-z)',
    shouldContain: 'Vsebovati mora:',
    specialCharacters: 'Posebne znake (npr. !@#$%^&*)',
    upperCase: 'Velike črke (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Lahko tudi vnesete svoj e-poštni naslov za prijavo<br/>ali ustvarjanje računa',
  passwordlessEmailCodeInstructions: 'Poslali smo e-pošto s kodo na naslov %s.',
  passwordlessEmailInstructions:
    'Vnesite svoj e-poštni naslov za prijavo<br/>ali ustvarjanje računa',
  passwordlessSMSAlternativeInstructions:
    'Lahko tudi vnesete svojo telefonsko številko za prijavo<br/>ali ustvarjanje računa',
  passwordlessSMSCodeInstructions: 'Poslali smo SMS s kodo<br/>na številko %s.',
  passwordlessSMSInstructions:
    'Vnesite svojo telefonsko številko za prijavo<br/>ali ustvarjanje računa',
  phoneNumberInputPlaceholder: 'vaša telefonska številka',
  resendCodeAction: 'Niste prejeli kode?',
  resendLabel: 'Pošlji ponovno',
  resendingLabel: 'Ponovno pošiljanje ...',
  retryLabel: 'Ponovni poskus',
  sentLabel: 'Poslano!',
  showPassword: 'Pokaži geslo',
  signupTitle: 'Vpis',
  signUpLabel: 'Vpis',
  signUpSubmitLabel: 'Vpis',
  signUpTerms: '',
  signUpWithLabel: 'Vpis z %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Omogočen posamezen vpis',
  submitLabel: 'Pošlji',
  unrecoverableError: 'Prišlo je do napake.<br />Obrnite se na tehnično pomoč.',
  usernameFormatErrorHint:
    'Uporabite lahko črke %d-%d, števila in naslednje znake: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'vaše uporabniško ime',
  usernameOrEmailInputPlaceholder: 'uporabniško ime/e-pošta',
  title: 'Auth0',
  welcome: 'Dobrodošli, %s!',
  windowsAuthInstructions: 'Povezani ste iz svojega službenega omrežja&hellip;',
  windowsAuthLabel: 'Avtentikacija Windows',
  mfaInputPlaceholder: 'Koda',
  mfaLoginTitle: '2-stopenjsko preverjanje',
  mfaLoginInstructions: 'Vnesite kodo za preverjanje, ki jo je sestavila vaša mobilna aplikacija.',
  mfaSubmitLabel: 'Prijava',
  mfaCodeErrorHint: 'Uporabite številke %d'
};
