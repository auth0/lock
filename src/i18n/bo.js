export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'གསང་ཚིག་རྗེས་བསྒྱུར་གྱི་གྲངས་ཚད་ལོངས་འདུག ཏོག་ཙམ་སྒྲུག་ནས་ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།',
      'lock.fallback': "དགོངས་དག གསང་ཚིག་རྗེས་བསྒྱུར་བྱེད་སྐབས་གནད་དོན་ཞིག་བྱུང་སོང་།",
      enterprise_email:
        "Your email's domain is part of an Enterprise identity provider. To reset your password, please see your security administrator."
    },
    login: {
      blocked_user: 'སྤྱོད་མཁན་བཀག་བཞག་འདུག',
      invalid_user_password: 'Wrong credentials.',
      invalid_captcha: 'རང་ཉིད་འཕྲུལ་ཆས་མིན་པར་ར་སྤྲོད་ཆེད་དྲི་བ་ཁག་ལན་རྒྱོབས།',
      invalid_recaptcha: 'སྒམ་འདིའི་ནང་འགྲིག་རྟགས་རྒྱོབས།',
      'lock.fallback': "དགོངས་དག ནང་འཛུལ་བྱེད་ཐུབ་མ་སོང་།",
      'lock.invalid_code': 'ཚབ་ཨང་ནོར་འདུག',
      'lock.invalid_email_password': 'གློག་འཕྲིན་ནམ་གསང་ཚིག་གང་རུང་ནོར་འདུག',
      'lock.invalid_username_password': 'སྤྱོད་མཁན་གྱི་མིང་ངམ་གསང་ཚིག་གང་རུང་ནོར་འདུག',
      'lock.network': 'དྲ་ཚིགས་ལ་མཐུད་ཐུབ་མ་སོང་། དྲ་རྒྱ་ཡོད་མེད་ལ་བལྟས་རྗེས་ཡང་བསྐྱར་མཐུད་རོགས།',
      'lock.popup_closed': 'སྒེའུ་ཁུང་སྒོ་རྒྱབས་བཞག ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།',
      'lock.unauthorized': 'ཆོག་མཆན་སྤྲད་མ་སོང་། ཡང་བསྐྱར་ཞུས།',
      'lock.mfa_registration_required':
        'Multifactor authentication is required but your device is not enrolled. Please enroll it before moving on.',
      'lock.mfa_invalid_code': 'ཚབ་ཨང་ནོར་འདུག ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།',
      password_change_required:
        'ཁྱེད་ཀྱི་གསང་ཚིག་བརྗེས་དགོས་ཀྱི་འདུག རྒྱུ་མཚན་ནི་གསང་ཚིག་གི་དུས་ཚོད་ཡོལ་ནས་ནུས་མེད་ཆགས་པའམ་ནང་འཛུལ་ཐེངས་དང་པོ་བྱེད་བཞིན་པས་ཡིན།', // TODO: verify error code
      password_leaked:
        'ཐོ་གཞུང་འདིའི་གསང་གནས་སྲུང་སྐྱོབ་དང་འབྲེལ་བའི་གནད་དོན་ཞིག་ཐོན་པས། གནས་སྐབས་རིང་བཀག་ཡོད་པས་ནང་འཛུལ་བྱེད་མི་ཐུབ། ཁྱེད་ལ་ནང་འཛུལ་བྱེད་སྟངས་སྐོར་ཀྱི་གློག་འཕྲིན་ཞིག་བཏང་ཡོད། དེ་བརྒྱུད་ནས་ནང་འཛུལ་བྱེད་རོགས། ',
      too_many_attempts: 'ནང་འཛུལ་བསྟུད་མར་ཐེངས་མང་བྱས་པའི་རྐྱེན་གྱིས་ཁྱེད་ཀྱི་ཐོ་གཞུང་བཀག་འདུག',
      too_many_requests:
        "We're sorry. There are too many requests right now. Please reload the page and try again. If this persists, please try again later.",
      session_missing:
        "Couldn't complete your authentication request. Please try again after closing all open dialogs",
      'hrd.not_matching_email': 'ཚོགས་པའི་གློག་འཕྲིན་སྤྱད་ནས་ནང་འཛུལ་བྱེད་རོགས།'
    },
    passwordless: {
      'bad.email': 'གློག་འཕྲིན་ནོར་འདུག',
      'bad.phone_number': 'ཁ་པར་ཨང་གྲངས་ནོར་འདུག',
      'lock.fallback': "དགོངས་དག གནད་དོན་ཞིག་བྱུང་སོང་།"
    },
    signUp: {
      invalid_password: 'གསང་ཚིག་ནོར་འདུག',
      'lock.fallback': "དགོངས་དག ཐོ་འགོད་བྱེད་སྐབས་གནད་དོན་ཞིག་བྱུང་སོང་།",
      password_dictionary_error: 'Password is too common.',
      password_no_user_info_error: 'Password is based on user information.',
      password_strength_error: 'Password is too weak.',
      user_exists: 'The user already exists.',
      username_exists: 'The username already exists.',
      social_signup_needs_terms_acception: 'Please agree to the Terms of Service below to continue.'
    }
  },
  success: {
    // success messages show above the form or in a confirmation pane
    logIn: 'Thanks for logging in.',
    forgotPassword: "We've just sent you an email to reset your password.",
    magicLink: 'We sent you a link to log in<br />to %s.',
    signUp: 'Thanks for signing up.'
  },
  blankErrorHint: "Can't be blank",
  codeInputPlaceholder: 'your code',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'or',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'or',
  emailInputPlaceholder: 'yours@example.com',
  captchaCodeInputPlaceholder: 'Enter the code shown above',
  captchaMathInputPlaceholder: 'Solve the formula shown above',
  enterpriseLoginIntructions: 'Login with your corporate credentials.',
  enterpriseActiveLoginInstructions: 'Please enter your corporate credentials at %s.',
  failedLabel: 'Failed!',
  forgotPasswordTitle: 'གསང་ཚིག་བསྐྱར་བཟོ་བྱོས།',
  forgotPasswordAction: "གསང་ཚིག་བརྗེད་སོང་ངམ།",
  forgotPasswordInstructions:
    'ཁྱེད་ཀྱི་གློག་འཕྲིན་ཕྲིས་དང་། གསང་ཚིག་བསྐྱར་བཟོའི་ཆོག་པའི་དྲ་ཐག་བསྐུར་ཡོང་།',
  forgotPasswordSubmitLabel: 'ཀློག་འཕྲིན་ཐོངས་།',
  invalidErrorHint: 'Invalid',
  lastLoginInstructions: 'ཐེངས་སྔོན་མ་ནང་འཛུལ་བྱེད་དུས།',
  loginAtLabel: 'Log in at %s',
  loginLabel: 'ནང་འཛུལ།',
  loginSubmitLabel: 'ནང་འཛུལ།',
  loginWithLabel: 'Sign in with %s',
  notYourAccountAction: 'Not your account?',
  passwordInputPlaceholder: 'your password',
  passwordStrength: {
    containsAtLeast: 'Contain at least %d of the following %d types of characters:',
    identicalChars: 'No more than %d identical characters in a row (e.g., "%s" not allowed)',
    nonEmpty: 'Non-empty password required',
    numbers: 'ཨང་གྲངས་དགོས། (i.e. 0-9)',
    lengthAtLeast: 'At least %d characters in length',
    lowerCase: 'ཡིག་ཆུང་། (a-z)',
    shouldContain: 'Should contain:',
    specialCharacters: 'དམིགས་བསལ་ཨང་རྟགས། (e.g. !@#$%^&*)',
    upperCase: 'ཡིག་ཆེན། (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Otherwise, enter your email to sign in<br/>or create an account',
  passwordlessEmailCodeInstructions: 'An email with the code has been sent to %s.',
  passwordlessEmailInstructions: 'Enter your email to sign in<br/>or create an account',
  passwordlessSMSAlternativeInstructions:
    'Otherwise, enter your phone to sign in<br/>or create an account',
  passwordlessSMSCodeInstructions: 'An SMS with the code has been sent to %s.',
  passwordlessSMSInstructions: 'Enter your phone to sign in<br/>or create an account',
  phoneNumberInputPlaceholder: 'your phone number',
  resendCodeAction: 'Did not get the code?',
  resendLabel: 'Resend',
  resendingLabel: 'Resending...',
  retryLabel: 'Retry',
  sentLabel: 'Sent!',
  showPassword: 'Show password',
  signUpTitle: 'ཐོ་འགོད།',
  signUpLabel: 'ཐོ་འགོད།',
  signUpSubmitLabel: 'ཐོ་འགོད།',
  signUpTerms: 'By signing up, you agree to our terms of service and privacy policy.',
  signUpWithLabel: 'Sign up with %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On enabled',
  submitLabel: 'སྤེལ།',
  unrecoverableError: 'གནད་དོན་ཞིག་བྱུང་སོང་།<br />ང་ཚོའི་འཕྲུལ་ལས་ཞབས་ཞུ་བར་འབྲེལ་བ་བྱོས།',
  usernameFormatErrorHint:
    'Use %d-%d letters, numbers and the following characters: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'སྤྱོད་མཁན་གྱི་མིང་།',
  usernameOrEmailInputPlaceholder: 'སྤྱོད་མཁན་གྱི་མིང་།/གློག་འཕྲིན།',
  title: 'Auth0',
  welcome: 'Welcome %s!',
  windowsAuthInstructions: 'You are connected from your corporate network&hellip;',
  windowsAuthLabel: 'Windows Authentication',
  mfaInputPlaceholder: 'གསང་བརྡའི་ཨང་།',
  mfaLoginTitle: '2-Step Verification',
  mfaLoginInstructions: 'Please enter the verification code generated by your mobile application.',
  mfaSubmitLabel: 'ནང་འཛུལ།',
  mfaCodeErrorHint: 'Use %d numbers'
};
