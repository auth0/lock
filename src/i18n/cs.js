// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Dosáhli jste limitu počtu pokusů o změnu hesla. Před dalším pokusem prosím počkejte.',
      'lock.fallback': 'Je nám líto, ale něco se pokazilo při žádosti o změnu hesla.',
      enterprise_email:
        'Doména vašeho e-mailu je součástí poskytovatele podnikové identity. Chcete-li obnovit heslo, obraťte se na svého správce zabezpečení.'
    },
    login: {
      blocked_user: 'Uživatel je blokován.',
      invalid_user_password: 'Chybné heslo.',
      invalid_captcha: 'Vyřešte úlohu, abychom ověřili, že nejste robot.',
      invalid_recaptcha: 'Zaškrtněte políčko, abychom ověřili, že nejste robot.',
      'lock.fallback': 'Je nám líto, ale něco se pokazilo při pokusu o přihlášení.',
      'lock.invalid_code': 'Chybný kód.',
      'lock.invalid_email_password': 'Chybný e-mail nebo heslo.',
      'lock.invalid_username_password': 'Chybné uživatelské jméno nebo heslo.',
      'lock.network':
        'Nepodařilo se spojit se serverem. Prosím zkontrolujte připojení a zkuste to znovu.',
      'lock.popup_closed': 'Vyskakovací okno zavřeno. Zkuste to znovu.',
      'lock.unauthorized': 'Oprávnění nebyla udělena. Zkuste to znovu.',
      'lock.mfa_registration_required':
        'Je požadováno vícefaktorové ověření, ale vaše zařízení není registrováno. Prosím registrujte jej, než budete pokračovat.',
      'lock.mfa_invalid_code': 'Chybný kód. Prosím zkuste to znovu.',
      password_change_required:
        'Musíte si aktualizovat si své heslo, protože je toto vaše první přihlášení, nebo platnost vašeho hesla vypršela.',
      password_leaked:
        'Detekovali jsme, že tento účet může být ohrožen. Abychom váš účet ochránili, zablokovali jsme toto přihlášení. Zaslali jsme vám e-mail s instrukcemi, jak svůj účet odblokovat.',
      too_many_attempts: 'Váš účet byl zablokován z důvodu velkého počtu pokusů o přihlášení.',
      too_many_requests:
        'Omlouváme se. Právě teď je příliš mnoho žádostí. Načtěte stránku znovu a zkuste to znovu. Pokud to trvá, zkuste to znovu později.',
      session_missing:
        'Nemohli jsme dokončit váš požadavek na ověření. Zkuste to znovu po zavření všech otevřených dialogových oken.',
      'hrd.not_matching_email': 'Prosím pro přihlášení použijte svůj firemní e-mail.'
    },
    passwordless: {
      'bad.email': 'E-mail je neplatný',
      'bad.phone_number': 'Telefonní číslo je neplatné',
      'lock.fallback': 'Je nám líto, něco se pokazilo'
    },
    signUp: {
      invalid_password: 'Heslo je neplatné.',
      'lock.fallback': 'Je nám líto, při pokusu o registraci se něco pokazilo.',
      password_dictionary_error: 'Heslo je příliš obvyklé.',
      password_leaked: 'Tato kombinace přihlašovacích údajů byla zjištěna při porušení veřejných údajů na jiném webu. Před vytvořením účtu použijte jiné heslo, aby byl zabezpečen.',
      password_no_user_info_error: 'Heslo vychází z uživatelských údajů.',
      password_strength_error: 'Heslo je příliš slabé.',
      user_exists: 'Uživatel již existuje.',
      username_exists: 'Uživatelské jméno již existuje.',
      social_signup_needs_terms_acception:
        'Pro pokračování prosím potvrďte souhlas s níže uvedenými smluvními podmínkami.'
    }
  },
  success: {
    // success messages show above the form or in a confirmation pane
    logIn: 'Děkujeme za přihlášení.',
    forgotPassword: 'Právě jsme vám poslali email s instrukcemi ke změně hesla.',
    magicLink: 'Poslali jsme vám odkaz pro přihlášení<br />k %s.',
    signUp: 'Děkujeme za registraci.'
  },
  blankErrorHint: '',
  blankPasswordErrorHint: 'Heslo nemůže zůstat prázdné',
  blankEmailErrorHint: 'E-mail nemůže zůstat prázdný',
  blankUsernameErrorHint: 'Uživatelské jméno nemůže zůstat prázdné',
  blankCaptchaErrorHint: 'Nemůže zůstat prázdné',
  codeInputPlaceholder: 'váš kód',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'nebo',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'nebo',
  emailInputPlaceholder: 'jmeno@ukazka.cz',
  captchaCodeInputPlaceholder: 'Zadejte kód zobrazený výše',
  captchaMathInputPlaceholder: 'Vyřešte vzorec zobrazený výše',
  enterpriseLoginIntructions: 'Přihlaste se svým firemním účtem.',
  enterpriseActiveLoginInstructions: 'Prosím zadejte údaje k firemnímu účtu %s.',
  failedLabel: 'Chyba!',
  forgotPasswordTitle: 'Obnovit heslo',
  forgotPasswordAction: 'Zapomněli jste své heslo?',
  forgotPasswordInstructions:
    'Prosím zadejte svou e-mailovou adresu. Pošleme vám e-mail, díky němuž si budete moct změnit heslo.',
  forgotPasswordSubmitLabel: 'Poslat e-mail',
  invalidErrorHint: '',
  invalidPasswordErrorHint: 'Neplatné heslo',
  invalidEmailErrorHint: 'Neplatný e-mail',
  invalidUsernameErrorHint: 'Neplatné uživatelské jméno',
  lastLoginInstructions: 'Naposledy jste se přihlásili pomocí',
  loginAtLabel: 'Přihlásit se k %s',
  loginLabel: 'Přihlášení',
  loginSubmitLabel: 'Přihlásit',
  loginWithLabel: 'Přihlásit se s %s',
  notYourAccountAction: 'Není to váš účet?',
  passwordInputPlaceholder: 'vaše heslo',
  passwordStrength: {
    containsAtLeast: 'Musí obsahovat nejméně %d z těchto %d druhů znaků:',
    identicalChars: 'Ne více než %d stejných znaků za sebou (např. "%s" není dovoleno).',
    nonEmpty: 'Heslo nesmí být prázdné',
    numbers: 'Číslice (např. 0-9)',
    lengthAtLeast: 'Délka nejméně %d znaků',
    lowerCase: 'Malá písmena (a-z)',
    shouldContain: 'Mělo by obsahovat:',
    specialCharacters: 'Zvláštní znaky (např. !@#$%^&*)',
    upperCase: 'Velká písmena (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Případně zadejte e-mail pro přihlášení,<br/>nebo vytvoření účtu',
  passwordlessEmailCodeInstructions: 'E-mail s kódem byl odeslán na %s.',
  passwordlessEmailInstructions: 'Zadejte váš e-mail pro přihlášení<br/>nebo vytvoření účtu',
  passwordlessSMSAlternativeInstructions:
    'Případně zadejte telefon pro přihlášení<br/>nebo vytvoření účtu',
  passwordlessSMSCodeInstructions: 'SMS s kódem byla odeslána na číslo %s.',
  passwordlessSMSInstructions: 'Zadejte telefon pro přihlášení<br/>nebo vytvoření účtu',
  phoneNumberInputPlaceholder: 'vaše telefonní číslo',
  resendCodeAction: 'Nedostali jste kód?',
  resendLabel: 'Poslat znovu',
  resendingLabel: 'Posíláme znovu...',
  retryLabel: 'Opakovat',
  sentLabel: 'Odesláno!',
  showPassword: 'Zobrazit heslo',
  signUpTitle: 'Registrace',
  signUpLabel: 'Registrace',
  signUpSubmitLabel: 'Registrovat',
  signUpTerms: 'Registrací souhlasíte s našimi podmínkami použití a ochrany osobních údajů.',
  signUpWithLabel: 'Registrovat se s %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Jednotné přihlášení povoleno',
  submitLabel: 'Odeslat',
  unrecoverableError: 'Něco se pokazilo.<br />Prosíme kontaktujte technickou podporu.',
  usernameFormatErrorHint:
    'Použijte písmena %d-%d, číslice a následující znaky: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'vaše uživatelské jméno',
  usernameOrEmailInputPlaceholder: 'uživatelské jméno/e-mail',
  title: 'Auth0',
  welcome: 'Vítejte, %s!',
  windowsAuthInstructions: 'Jste připojeni z vaší firemní sítě&hellip;',
  windowsAuthLabel: 'Ověření Windows',
  mfaInputPlaceholder: 'Kód',
  mfaLoginTitle: 'Dvoufázové ověření',
  mfaLoginInstructions: 'Prosím zadejte ověřovací kód vygenerovaný vaší mobilní aplikací.',
  mfaSubmitLabel: 'Přihlásit',
  mfaCodeErrorHint: 'Použijte %d číslic'
};
