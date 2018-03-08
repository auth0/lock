// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Dosáhl jsi limitu pro počet pokusů o změnu hesla. Prosím počkej před dalším pokusem.',
      'lock.fallback': 'Je nám líto, ale něco se pokazilo při změně hesla.',
      enterprise_email:
        'Doména vašeho e-mailu je součástí poskytovatele podnikové identity. Chcete-li obnovit heslo, obraťte se na správce zabezpečení.'
    },
    login: {
      blocked_user: 'Uživatel je blokován.',
      invalid_user_password: 'Chybné heslo.',
      'lock.fallback': 'Je nám líto, ale něco se pokazilo při pokusu o přihlášení.',
      'lock.invalid_code': 'Chybný kód.',
      'lock.invalid_email_password': 'Chybný email nebo heslo.',
      'lock.invalid_username_password': 'Chybné uživatelské jméno nebo heslo.',
      'lock.network':
        'Nepodařilo se spojit se serverem. Prosím zkontroluj připojení a zkus to znovu.',
      'lock.popup_closed': 'Vyskakovací okno zavřeno. Zkus to znovu.',
      'lock.unauthorized': 'Práva nebyla udělena. Zkus to znovu.',
      'lock.mfa_registration_required':
        'Je požadováno vícefaktorové ověření, ale zařízení není registrováno. Prosím registruj jej, než budeš pokračovat.',
      'lock.mfa_invalid_code': 'Chybný kód. Prosím zkus to znovu.',
      password_change_required:
        'Je třeba aktualizovat heslo, neboť jde o první přihlášení; mohla také vypršet platnost hesla.',
      password_leaked:
        'Zablokovali jsme uživatelský účet, protože došlo k možnému úniku hesla na jiné webové stránce. Poslali jsme instrukce k odblokování na email.',
      too_many_attempts: 'Účet byl zablokován z důvodu příliš velkého počtu pokusů o přihlášení.',
      session_missing:
        'Nemohl jsem dokončit váš požadavek na ověření. Zkus to znovu po zavření všech otevřených dialogových oken.',
      'hrd.not_matching_email': 'Prosím, použijte pro přihlášení firemní e-mail.'
    },
    passwordless: {
      'bad.email': 'Email je neplatný.',
      'bad.phone_number': 'Telefonní číslo je neplatné.',
      'lock.fallback': 'Je nám líto, něco se pokazilo.'
    },
    signUp: {
      invalid_password: 'Heslo je neplatné.',
      'lock.fallback': 'Je nám líto, něco se pokazilo při pokusu o registraci.',
      password_dictionary_error: 'Heslo je příliš obyčejné.',
      password_no_user_info_error: 'Heslo vychází z uživatelského jména.',
      password_strength_error: 'Heslo je příliš slabé.',
      user_exists: 'Uživatel už existuje.',
      username_exists: 'Uživatelské jméno už existuje.'
    }
  },
  success: {
    logIn: 'Děkujeme za přihlášení.',
    forgotPassword: 'Právě jsme ti poslali email s instrukcemi ke změně hesla.',
    magicLink: 'Poslali jsme ti odkaz pro přihlášení<br />k %s.',
    signUp: 'Děkujeme za registraci.'
  },
  blankErrorHint: 'Nemůže zůstat prázdné',
  codeInputPlaceholder: 'kód',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'nebo',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'nebo',
  emailInputPlaceholder: 'vas@priklad.cz',
  enterpriseLoginIntructions: 'Přihlaš se svým firemním účtem.',
  enterpriseActiveLoginInstructions: 'Prosím zadej údaje k firemnímu účtu %s.',
  failedLabel: 'Chyba!',
  forgotPasswordTitle: 'Obnovit heslo',
  forgotPasswordAction: 'Zapomněl jsi heslo?',
  forgotPasswordInstructions:
    'Prosím zadej emailovou adresu. Pošleme ti email, díky němuž si budeš moci změnit heslo.',
  forgotPasswordSubmitLabel: 'Poslat email',
  invalidErrorHint: 'Nesprávný',
  lastLoginInstructions: 'Naposled ses přihlásil s',
  loginAtLabel: 'Přihlásit k %s',
  loginLabel: 'Přihlášení',
  loginSubmitLabel: 'Přihlásit',
  loginWithLabel: 'Přihlásit se s %s',
  notYourAccountAction: 'Není to tvůj účet?',
  passwordInputPlaceholder: 'heslo',
  passwordStrength: {
    containsAtLeast: 'Musí obsahovat nejméně %d z těchto %d skupin znaků:',
    identicalChars: 'Ne více než %d stejných znaků za sebou (např. "%s" není dovoleno).',
    nonEmpty: 'Heslo nesmí být prázdné.',
    numbers: 'Čísla (např. 0-9)',
    lengthAtLeast: 'Délka nejméně %d znaků',
    lowerCase: 'Malá písmena (a-z)',
    shouldContain: 'Mělo by obsahovat:',
    specialCharacters: 'Zvláštní znaky (např. !@#$%^&*)',
    upperCase: 'Velká písmena (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Případně zadej email pro přihlášení <br/>nebo vytvoření účtu',
  passwordlessEmailCodeInstructions: 'Email s kódem byl odeslán na %s.',
  passwordlessEmailInstructions: 'Zadej email pro přihlášení<br/>nebo vytvoření účtu.',
  passwordlessSMSAlternativeInstructions:
    'Případně zadej telefon pro přihlášení<br/>nebo vytvoření účtu.',
  passwordlessSMSCodeInstructions: 'SMS s kódem byla odeslána <br/>na %s.',
  passwordlessSMSInstructions: 'Zadej telefon pro přihlášení<br/>nebo vytvoření účtu',
  phoneNumberInputPlaceholder: 'telefonní číslo',
  resendCodeAction: 'Nedostal jsi kód?',
  resendLabel: 'Poslat znovu',
  resendingLabel: 'Posíláme znovu...',
  retryLabel: 'Znovu',
  sentLabel: 'Posláno!',
  showPassword: 'Ukaž heslo',
  signupTitle: 'Registrace',
  signUpLabel: 'Registrace',
  signUpSubmitLabel: 'Registrovat',
  signUpTerms: '',
  signUpWithLabel: 'Registrovat se s %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On aktivován',
  submitLabel: 'Odeslat',
  unrecoverableError: 'Něco se pokazilo.<br />Prosíme spoj se s technickou podporou.',
  usernameFormatErrorHint: 'Použij písmena %d-%d, číslice a následující znaky: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'uživatelské jméno',
  usernameOrEmailInputPlaceholder: 'uživatelské jméno či email',
  title: 'Auth0',
  welcome: 'Vítej, %s!',
  windowsAuthInstructions: 'Jsi připojen z firemní sítě&hellip;',
  windowsAuthLabel: 'Ověření Windows',
  mfaInputPlaceholder: 'Kód',
  mfaLoginTitle: 'Dvoufázové ověření',
  mfaLoginInstructions: 'Prosím zadej ověřovací kód vygenerovaný mobilní aplikací.',
  mfaSubmitLabel: 'Přihlásit',
  mfaCodeErrorHint: 'Použijte %d číslic'
};
