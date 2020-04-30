Auth0.registerLanguageDictionary('uk', {
  error: {
    forgotPassword: {
      too_many_requests:
        'Ви досягли обмеження на кількість спроб зміни пароля. Почекайте, перш ніж продовжити спроби.',
      'lock.fallback': 'На жаль, при запиті на заміну пароля сталася помилка.',
      enterprise_email:
        'Ваш домен електронної пошти є частиною постачальника корпоративної ідентифікації. Щоб скинути свій пароль, зверніться до адміністратора безпеки.'
    },
    login: {
      blocked_user: 'Користувача заблоковано.',
      invalid_user_password: 'Неправильні облікові дані.',
      'lock.fallback': 'На жаль, при спробі входу в систему сталася помилка.',
      'lock.invalid_code': 'Неправильний код.',
      'lock.invalid_email_password': 'Неправильна адреса електронної пошти або пароль.',
      'lock.invalid_username_password': 'Неправильне ім’я користувача або пароль.',
      'lock.network':
        'Не вдалося зв’язатися з сервером. Перевірте з’єднання та повторіть спробу пізніше.',
      'lock.popup_closed': 'Спливаюче вікно закрите. Повторіть спробу.',
      'lock.unauthorized': 'Дозволи не надані. Повторіть спробу.',
      'lock.mfa_registration_required':
        'Потрібна багатофакторна автентифікація, але пристрій не призначений. Призначте його перед продовженням.',
      'lock.mfa_invalid_code': 'Неправильний код. Повторіть спробу.',
      password_change_required:
        'Вам потрібно оновити пароль, оскільки ви вперше входите в систему або оскільки термін дії пароля закінчився.',
      password_leaked:
        'У цьому обліковому записі виявлено потенційну проблему, що стосується безпеки. Для захисту вашого облікового запису ми заблокували цей логін. Вам надіслано електронне повідомлення з інформацією, як розблокувати обліковий запис.',
      too_many_attempts:
        'Ваш обліковий запис заблоковано після декількох послідовних спроб входу в систему.',
      session_missing:
        'Не вдалося виконати запит на автентифікацію. Повторіть спробу, закривши усі відкриті діалогові вікна',
      'hrd.not_matching_email': 'Щоб увійти, використовуйте корпоративну адресу електронної пошти.'
    },
    passwordless: {
      'bad.email': 'Неправильна адреса електронної пошти',
      'bad.phone_number': 'Неправильний номер телефону',
      'lock.fallback': 'На жаль, сталася помилка'
    },
    signUp: {
      invalid_password: 'Неправильний пароль.',
      'lock.fallback': 'На жаль, при спробі реєстрації сталася помилка.',
      password_dictionary_error: 'Пароль надто поширений.',
      password_no_user_info_error: 'Пароль базується на інформації про користувача.',
      password_strength_error: 'Ненадійний пароль.',
      user_exists: 'Такий користувач уже існує.',
      username_exists: 'Таке ім’я користувача уже існує.'
    }
  },
  success: {
    logIn: 'Дякуємо за вхід в систему.',
    forgotPassword: 'Ми щойно надіслали вам електронний лист для скидання пароля.',
    magicLink: 'Ми надіслали вам посилання для входу в систему <br /> %s.',
    signUp: 'Дякуємо за реєстрацію.'
  },
  blankErrorHint: 'Не може бути порожнім',
  codeInputPlaceholder: 'ваш код',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'або',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'або',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Увійдіть в систему, використавши корпоративні облікові дані.',
  enterpriseActiveLoginInstructions: 'Введіть корпоративні облікові дані в %s.',
  failedLabel: 'Помилка!',
  forgotPasswordTitle: 'Скиньте свій пароль',
  forgotPasswordAction: 'Забули свій пароль?',
  forgotPasswordInstructions:
    'Введіть свою адресу електронної пошти. Ми надішлемо вам електронного листа для скидання пароля.',
  forgotPasswordSubmitLabel: 'Відправити електронне повідомлення',
  invalidErrorHint: 'Неприпустимо',
  lastLoginInstructions: 'Останній раз ви увійшли в систему, використовуючи',
  loginAtLabel: 'Вхід в %s',
  loginLabel: 'Вхід',
  loginSubmitLabel: 'Вхід',
  loginWithLabel: 'Вхід, використовуючи %s',
  notYourAccountAction: 'Чужий обліковий запис?',
  passwordInputPlaceholder: 'ваш пароль',
  passwordStrength: {
    containsAtLeast: 'Містить щонайменше %d наступних типів символів %d:',
    identicalChars: 'Не більше ніж %d ідентичних символів підряд (напр., «%s» заборонено)',
    nonEmpty: 'Пароль не повинен залишатися порожнім',
    numbers: 'Цифри (напр., 0–9)',
    lengthAtLeast: 'Довжина не менше %d символів',
    lowerCase: 'Літери нижнього регістру (A–Z)',
    shouldContain: 'Має містити:',
    specialCharacters: 'Спеціальні символи (напр., !@#$%^&*)',
    upperCase: 'Літери верхнього регістру (A–Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'В іншому випадку введіть адресу електронної пошти, щоб увійти в <br/> або створити обліковий запис',
  passwordlessEmailCodeInstructions: 'Електронне повідомлення з кодом відправлено на %s.',
  passwordlessEmailInstructions:
    'Введіть адресу електронної пошти, щоб увійти в <br/> або створити обліковий запис',
  passwordlessSMSAlternativeInstructions:
    'В іншому випадку введіть номер телефону, щоб увійти в <br/> або створити обліковий запис',
  passwordlessSMSCodeInstructions: 'SMS-повідомлення з кодом відправлено <br/> на %s.',
  passwordlessSMSInstructions:
    'Введіть номер телефону, щоб увійти в <br/> або створити обліковий запис',
  phoneNumberInputPlaceholder: 'ваш номер телефону',
  resendCodeAction: 'Не отримали код?',
  resendLabel: 'Відправити повторно',
  resendingLabel: 'Повторне відправлення...',
  retryLabel: 'Повторна спроба',
  sentLabel: 'Відправлено!',
  showPassword: 'Показати пароль',
  signUpTitle: 'Реєстрація',
  signUpLabel: 'Реєстрація',
  signUpSubmitLabel: 'Реєстрація',
  signUpTerms:
    'Реєструючись, ви виражаєте свою згоду з умовами надання послуг та політикою конфіденційності.',
  signUpWithLabel: 'Реєструйтесь, використовуючи %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Активований єдиний вхід',
  submitLabel: 'Відправити',
  unrecoverableError: 'Сталася помилка.<br />Зверніться до служби технічної підтримки.',
  usernameFormatErrorHint:
    'Використайте %d-%d літер, цифр та наступних символів: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'ваше ім’я користувача',
  usernameOrEmailInputPlaceholder: 'ім’я користувача/адреса електронної пошти',
  title: 'Auth0',
  welcome: 'Ласкаво просимо %s!',
  windowsAuthInstructions: 'Ви з’єднані з корпоративною мережею network&hellip;',
  windowsAuthLabel: 'Автентифікація Windows',
  mfaInputPlaceholder: 'Код',
  mfaLoginTitle: 'Двоетапна перевірка',
  mfaLoginInstructions: 'Введіть код підтвердження, згенерований вашим мобільним застосунком.',
  mfaSubmitLabel: 'Вхід',
  mfaCodeErrorHint: 'Використайте %d цифр'
});
