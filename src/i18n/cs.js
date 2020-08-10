// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Dosáhl jste limitu pro počet pokusů o změnu hesla. Prosím počkejte před dalším pokusem.',
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
        'Nepodařilo se spojit se serverem. Prosím zkontrolujte připojení a zkuste to znovu.',
      'lock.popup_closed': 'Vyskakovací okno zavřeno. Zkuste to znovu.',
      'lock.unauthorized': 'Práva nebyla udělena. Zkuste to znovu.',
      'lock.mfa_registration_required':
        'Je požadováno vícefaktorové ověření, ale zařízení není registrováno. Prosím registrujte jej, než budete pokračovat.',
      'lock.mfa_invalid_code': 'Chybný kód. Prosím zkuste to znovu.',
      password_change_required:
        'Je třeba aktualizovat heslo, neboť jde o první přihlášení; mohla také vypršet platnost hesla.',
      password_leaked:
        'Zablokovali jsme uživatelský účet, protože došlo k možnému úniku hesla na jiné webové stránce. Poslali jsme instrukce k odblokování na email.',
      too_many_attempts: 'Účet byl zablokován z důvodu příliš velkého počtu pokusů o přihlášení.',
      session_missing:
        'Nemohli jsme dokončit váš požadavek na ověření. Zkuste to znovu po zavření všech otevřených dialogových oken.',
      'hrd.not_matching_email': 'Prosím, použijte pro přihlášení firemní e-mail.',
      too_many_requests:
        'Omlouváme se. Právě teď je příliš mnoho žádostí. Načtěte stránku znovu a zkuste to znovu. Pokud to trvá, zkuste to znovu později.',
      invalid_captcha: 'Vyřešte výzvu a ověřte, že nejste robot.',
      invalid_recaptcha: 'Zaškrtnutím políčka ověřte, že nejste robot.'
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
      username_exists: 'Uživatelské jméno už existuje.',
      social_signup_needs_terms_acception:
        'Pokračujte prosím souhlasem s níže uvedenými smluvními podmínkami.'
    }
  },
  success: {
    logIn: 'Děkujeme za přihlášení.',
    forgotPassword: 'Právě jsme vám poslali email s instrukcemi ke změně hesla.',
    magicLink: 'Poslali jsme vám odkaz pro přihlášení<br />k %s.',
    signUp: 'Děkujeme za registraci.'
  },
  blankErrorHint: 'Nemůže zůstat prázdné',
  codeInputPlaceholder: 'kód',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'nebo',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'nebo',
  emailInputPlaceholder: 'vas@priklad.cz',
  enterpriseLoginIntructions: 'Přihlaste se svým firemním účtem.',
  enterpriseActiveLoginInstructions: 'Prosím zadejte údaje k firemnímu účtu %s.',
  failedLabel: 'Chyba!',
  forgotPasswordTitle: 'Obnovit heslo',
  forgotPasswordAction: 'Zapomněli jste heslo?',
  forgotPasswordInstructions:
    'Prosím zadejte emailovou adresu. Pošleme vám email, díky němuž si budete moci změnit heslo.',
  forgotPasswordSubmitLabel: 'Poslat email',
  invalidErrorHint: 'Nesprávný',
  lastLoginInstructions: 'Naposled jste se přihlásil s',
  loginAtLabel: 'Přihlásit k %s',
  loginLabel: 'Přihlášení',
  loginSubmitLabel: 'Přihlásit',
  loginWithLabel: 'Přihlásit se s %s',
  notYourAccountAction: 'Není to váš účet?',
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
    'Případně zadejte email pro přihlášení <br/>nebo vytvoření účtu',
  passwordlessEmailCodeInstructions: 'Email s kódem byl odeslán na %s.',
  passwordlessEmailInstructions: 'Zadejte email pro přihlášení<br/>nebo vytvoření účtu.',
  passwordlessSMSAlternativeInstructions:
    'Případně zadejte telefon pro přihlášení<br/>nebo vytvoření účtu.',
  passwordlessSMSCodeInstructions: 'SMS s kódem byla odeslána <br/>na %s.',
  passwordlessSMSInstructions: 'Zadejte telefon pro přihlášení<br/>nebo vytvoření účtu',
  phoneNumberInputPlaceholder: 'telefonní číslo',
  resendCodeAction: 'Nedostal jste kód?',
  resendLabel: 'Poslat znovu',
  resendingLabel: 'Posíláme znovu...',
  retryLabel: 'Znovu',
  sentLabel: 'Posláno!',
  showPassword: 'Ukaž heslo',
  signUpTitle: 'Registrace',
  signUpLabel: 'Registrace',
  signUpSubmitLabel: 'Registrovat',
  signUpWithLabel: 'Registrovat se s %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On aktivován',
  submitLabel: 'Odeslat',
  unrecoverableError: 'Něco se pokazilo.<br />Prosíme spojte se s technickou podporou.',
  usernameFormatErrorHint:
    'Použijte písmena %d-%d, číslice a následující znaky: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'uživatelské jméno',
  usernameOrEmailInputPlaceholder: 'uživatelské jméno či email',
  title: 'Auth0',
  welcome: 'Vítejte, %s!',
  windowsAuthInstructions: 'Jste připojen z firemní sítě&hellip;',
  windowsAuthLabel: 'Ověření Windows',
  mfaInputPlaceholder: 'Kód',
  mfaLoginTitle: 'Dvoufázové ověření',
  mfaLoginInstructions: 'Prosím zadejte ověřovací kód vygenerovaný mobilní aplikací.',
  mfaSubmitLabel: 'Přihlásit',
  mfaCodeErrorHint: 'Použijte %d číslic',
  signUpTerms:
    'Tím, že se zaregistrujete, souhlasíte s našimi smluvními podmínkami a zásadami ochrany osobních údajů.',
  captchaCodeInputPlaceholder: 'Zadejte výše uvedený kód',
  captchaMathInputPlaceholder: 'Vyřešte výše uvedený vzorec'
};
