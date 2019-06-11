// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Достигнахте лимита на опити за смян на паролата. Моля изчакайте преди да опитате отново.',
      'lock.fallback': 'За съжаление, получи се грешка при опита за промяна на паролата.',
      enterprise_email:
        'Вашият имейл е част от служебн доставчик на идентичност. Моля свържете се с администратора по сигурността, за да смените паролата си.'
    },
    login: {
      blocked_user: 'Потребителското име е блокирано.',
      invalid_user_password: 'Грешно потребителско име или парола.',
      'lock.fallback': 'За съжаление, получи се грешка при опита да влезете във Вашия профил.',
      'lock.invalid_code': 'Грешна парола.',
      'lock.invalid_email_password': 'Грешен имейл или парола.',
      'lock.invalid_username_password': 'Грешно потребителско име или парола.',
      'lock.network':
        'Не успяхме да се свържем със сървера. Моля проверете вашата връзка с интернет и опитайте отново.',
      'lock.popup_closed':
        'Електронното съобщение с появяващ се прозорец е затворено. Моля опитайте отново.',
      'lock.unauthorized': 'Не получихте разрешение. Моля опитайте отново.',
      'lock.mfa_registration_required':
        'Изисква се неколкократно удостоверяване на автентичност, но вашето устройство не е включено. Моля включете го преди да продължите.',
      'lock.mfa_invalid_code': 'Грешен код. Моля опитайте отново.',
      password_change_required:
        'Трябва да смените паролата си, защото това е първият път когато влизате в профила си, или паролата Ви е изтекла.',
      password_leaked:
        'Засякохме потенциялен проблем със сигурността на този профил. За да предпазим профила Ви, ние блокирахме потребителското Ви име. Ще получите имейл с инструкции как да деблокирате профила си.',
      too_many_attempts:
        'Вашият акаунт е блокиран след множество последователни опити да влезете в профила си.',
      session_missing:
        'Не успяхме да удостоверим Вашата самоличност. Моля опитайте отново след като затворите всички прозорци',
      'hrd.not_matching_email': 'Моля използвайте Вашия служебен имейл за да влезете в профила си.',
      too_many_requests:
        'Съжаляваме. В момента има твърде много искания. Моля, презаредете страницата и опитайте отново. Ако това продължи, моля, опитайте отново по-късно.'
    },
    passwordless: {
      'bad.email': 'Имейлът е невалиден',
      'bad.phone_number': 'Телефонният номер е невалиден',
      'lock.fallback': 'Съжаляваме, получи се грешка'
    },
    signUp: {
      invalid_password: 'Паролата е невалидна.',
      'lock.fallback': 'Съжаляваме, получи се грешка при опита за влизане в профила Ви.',
      password_dictionary_error: 'Паролата е много често срещана.',
      password_no_user_info_error:
        'Паролата е основана на информация, свързана със собственика на този профил.',
      password_strength_error: 'Паролата е много несигурна.',
      user_exists: 'Този профил вече съществува.',
      username_exists: 'Това потребителско име вече съществува.'
    }
  },
  success: {
    logIn: 'Благодаря, че влязохте в профила си.',
    forgotPassword: 'Току-що Ви изпратихме имейл за да рестартирате паролата си.',
    magicLink: 'Изпратихме Ви линк за да влезете в профила си<br />на %s.',
    signUp: 'Блгаодаря, че се регистрирахте.'
  },
  blankErrorHint: 'Попълването на полето е задължително',
  codeInputPlaceholder: 'Вашата парола',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'или',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'или',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Моля влезте в корпоративния си профил.',
  enterpriseActiveLoginInstructions: 'Моля напишете Вашите корпоративни данни %s.',
  failedLabel: 'Неуспешен опит!',
  forgotPasswordTitle: 'Сменете парола си',
  forgotPasswordAction: 'Забравихте паролата си?',
  forgotPasswordInstructions:
    'Моля напишете имейл адреса си. Ще Ви изпратим имейл, за да промените паролата си.',
  forgotPasswordSubmitLabel: 'Изпращане на имейл',
  invalidErrorHint: 'Грешка',
  lastLoginInstructions: 'При предходното влизане, Вие се опитахте да влезете в профила си с',
  loginAtLabel: 'Вход при %s',
  loginLabel: 'Вход',
  loginSubmitLabel: 'Вход',
  loginWithLabel: 'Вход с %s',
  notYourAccountAction: 'Това не е Вашият профил?',
  passwordInputPlaceholder: 'Вашата парола',
  passwordStrength: {
    containsAtLeast: 'Съдържа поне %d от следните %d видове символи:',
    identicalChars:
      'Не съдържа повече от %d идентични символи един след друг (например не може да използвате "%s")',
    nonEmpty: 'Изисква се задължително попълване на парола',
    numbers: 'Цифри (например 0-9)',
    lengthAtLeast: 'Поне %d символа в дължина',
    lowerCase: 'Малки букви (a-z)',
    shouldContain: 'Трябва да съдържа:',
    specialCharacters: 'Специални символи (например!@#$%^&*)',
    upperCase: 'Главни букви (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'В противен случай, напишете Вашия имейл за да влезете в профила си<br/>, или за да създадете профил',
  passwordlessEmailCodeInstructions: 'Изпратихме Ви имейл с кода на %s.',
  passwordlessEmailInstructions:
    'Изпратете имейл за да влезете в профила си на<br/>, или създайте нов профил',
  passwordlessSMSAlternativeInstructions:
    'В противен случай, напишете телефонния си номер или влезте в профила си<br/>, или създайте нов профил',
  passwordlessSMSCodeInstructions: 'Изпратихме Ви съобщение с кода<br/>на %s.',
  passwordlessSMSInstructions:
    'Моля напишете телефонния си номер за да влезете в профила си<br/>, или създайте нов профил',
  phoneNumberInputPlaceholder: 'Вашият телефонен номерr',
  resendCodeAction: 'Не получихте код?',
  resendLabel: 'Изпратете отново',
  resendingLabel: 'Изпращаме...',
  retryLabel: 'Опитайте отново',
  sentLabel: 'Изпратено!',
  showPassword: 'Покажи парола',
  signUpTitle: 'Регистрация',
  signUpLabel: 'Регистрация',
  signUpSubmitLabel: 'Регистрация',
  signUpTerms:
    'При регистрация, Вие сте съгласни с нашата политика на потребителя и на защита на личните данни.',
  signUpWithLabel: 'Влизане в профила с %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Технологията Single Sign-On (SSO) е включена',
  submitLabel: 'Изпращане',
  unrecoverableError: 'Грешка.<br />Моля свържете се с техническия екип.',
  usernameFormatErrorHint: 'Използвайте %d-%d букви, цивфри и следните символи: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'вашето потребителско име',
  usernameOrEmailInputPlaceholder: 'потребителско име/имейл',
  title: 'Auth0',
  welcome: 'Добре дошли, %s!',
  windowsAuthInstructions: 'Вие се свързахте чрез мрежата на Вашата фирма...',
  windowsAuthLabel: 'Идентификация Windows',
  mfaInputPlaceholder: 'Код',
  mfaLoginTitle: 'Проверка на 2 нива',
  mfaLoginInstructions:
    'Моля напишете кода за проверка, който беше създаден от приложението на Вашия мобилен телефон.',
  mfaSubmitLabel: 'Вход',
  mfaCodeErrorHint: 'Използвайте цифрите %d'
};
