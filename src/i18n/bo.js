export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'གསང་ཚིག་རྗེས་བསྒྱུར་གྱི་གྲངས་ཚད་ལོངས་འདུག ཏོག་ཙམ་སྒྲུག་ནས་ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།',
      'lock.fallback': "དགོངས་དག གསང་ཚིག་རྗེས་བསྒྱུར་བྱེད་སྐབས་གནད་དོན་ཞིག་བྱུང་སོང་།",
      enterprise_email:
        "ཁྱེད་ཀྱི་གློག་འཕྲིན་ཚོགས་པའི་གློག་འཕྲིན་རེད་འདུག སྒེར་གྱི་གློག་འཕྲིན་རེད་མི་འདུག གསང་ཚིག་བརྗེས་བར་ཚོགས་པའི་གློག་འཕྲིན་དོ་དམ་པར་འབྲེལ་བ་བྱོས།"
    },
    login: {
      blocked_user: 'སྤྱོད་མཁན་བཀག་བཞག་འདུག',
      invalid_user_password: 'སྤྱོད་མཁན་ནམ་གསང་ཚིག་གང་རུང་ནོར་འདུག',
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
        'གོ་རིམ་མང་པོ་ཅན་གྱི་བདེན་དབང་ར་སྤྲོད་བྱེད་དགོས་ཀྱི་འདུག ཁྱེད་རང་གི་གློག་ཀླད་དམ་ཁ་པར་ཐོ་འགོད་བྱས་མི་འདུག ཐོ་འགོད་བྱས་རྗེས་མུ་མཐུད།',
      'lock.mfa_invalid_code': 'ཚབ་ཨང་ནོར་འདུག ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།',
      password_change_required:
        'ཁྱེད་ཀྱི་གསང་ཚིག་བརྗེས་དགོས་ཀྱི་འདུག རྒྱུ་མཚན་ནི་གསང་ཚིག་གི་དུས་ཚོད་ཡོལ་ནས་ནུས་མེད་ཆགས་པའམ་ནང་འཛུལ་ཐེངས་དང་པོ་བྱེད་བཞིན་པས་ཡིན།', // TODO: verify error code
      password_leaked:
        'ཐོ་གཞུང་འདིའི་གསང་གནས་སྲུང་སྐྱོབ་དང་འབྲེལ་བའི་གནད་དོན་ཞིག་ཐོན་པས། གནས་སྐབས་རིང་བཀག་ཡོད་པས་ནང་འཛུལ་བྱེད་མི་ཐུབ། ཁྱེད་ལ་ནང་འཛུལ་བྱེད་སྟངས་སྐོར་ཀྱི་གློག་འཕྲིན་ཞིག་བཏང་ཡོད། དེ་བརྒྱུད་ནས་ནང་འཛུལ་བྱེད་རོགས། ',
      too_many_attempts: 'ནང་འཛུལ་བསྟུད་མར་ཐེངས་མང་བྱས་པའི་རྐྱེན་གྱིས་ཁྱེད་ཀྱི་ཐོ་གཞུང་བཀག་འདུག',
      too_many_requests:
      "དགོངས་དག གནད་དོན་ཞིག་བྱུང་སོང་། དྲ་ཚིགས་གསར་དུ་ཁ་ཕྱེ་ནས་ཚོད་ལྟ་བྱོས། དཀའ་ངལ་སེལ་མ་ཐུབ་ཏོག་ཙམ་རྗེས་ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།",
      session_missing:
        "ར་སྤྲོད་གནས་ཚུལ་ལ་གནད་དོན་བྱུང་སོང་། འདི་དང་འབྲེལ་ཡོད་ཀྱི་གནས་ཚུལ་ཚང་མ་སྒོ་བརྒྱབ་རྗེས་བསྐྱར་དུ་ཚོད་ལྟ་བྱོས།",
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
      password_dictionary_error: 'གསང་ཚིག་ཆེས་སྤྱིར་བཏང་ཞིག་རེད་འདུག',
      password_no_user_info_error: 'གསང་ཚིག་སྤྱོད་མཁན་གྱི་གནས་ཚུལ་དང་འབྲེལ་ནས་བཟོས་འདུག',
      password_strength_error: 'གསང་ཚིག་ལས་སླ་དྲགས་འདུག',
      user_exists: 'སྤྱོད་མཁན་འདི་སྔོན་ནས་འདུག',
      username_exists: 'སྤྱོད་མཁན་གྱི་མིང་འདི་གཞན་གྱིས་བཀོལ་ཟིན་འདུག',
      social_signup_needs_terms_acception: 'བཀོལ་སྤྱོད་གན་རྒྱར་མོས་མཐུན་བྱས་རྗེས་དྲ་ཚིགས་སྤྱོད་འགོ་ཚུགས།'
    }
  },
  success: {
    // success messages show above the form or in a confirmation pane
    logIn: 'ནང་འཛུལ་བྱས་པར་རྟེན་འབྲེལ་ཞུ།',
    forgotPassword: "གསང་ཚིག་བསྐྱར་བཟོ་ཆེད་ཁྱེད་ལ་གློག་འཕྲིན་བཏང་ཡོད།",
    magicLink: 'ནང་འཛུལ་བྱེད་ཆེད་ཁྱེད་ལ་དྲ་ཐག་ཅིག་བསྐུར་ཡོད། <br /> %s.',
    signUp: 'ཐོ་འགོད་བྱས་པར་རྟེན་འབྲེལ་ཞུ།'
  },
  blankErrorHint: "སྟོང་པ་བཞག་མི་ཆོག",
  codeInputPlaceholder: 'ཚབ་ཨང་།',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ཡང་ན་',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ཡང་ན་',
  emailInputPlaceholder: 'yours@example.com',
  captchaCodeInputPlaceholder: 'གོང་གི་ཚབ་ཨང་ནང་འཇུག་བྱོས།',
  captchaMathInputPlaceholder: 'གོང་གི་སྦྱོར་ཐབས་འདི་སྒྲུབསརོགས།',
  enterpriseLoginIntructions: 'ཚོགས་པའི་གློག་འཕྲིན་སོགས་བཀོལ་ནས་ནང་འཛུལ་བྱོས།',
  enterpriseActiveLoginInstructions: 'ཚོགས་པའི་ར་སྤྲོད་གནས་ཚུལ་ཕྲིས། %s.',
  failedLabel: 'འགྲུབ་མ་སོང་།',
  forgotPasswordTitle: 'གསང་ཚིག་བསྐྱར་བཟོ་བྱོས།',
  forgotPasswordAction: "གསང་ཚིག་བརྗེད་སོང་ངམ།",
  forgotPasswordInstructions:
    'ཁྱེད་ཀྱི་གློག་འཕྲིན་ཕྲིས་དང་། གསང་ཚིག་བསྐྱར་བཟོའི་ཆོག་པའི་དྲ་ཐག་བསྐུར་ཡོང་།',
  forgotPasswordSubmitLabel: 'ཀློག་འཕྲིན་ཐོངས་།',
  invalidErrorHint: 'Invalid',
  lastLoginInstructions: 'ཐེངས་སྔོན་མ་ནང་འཛུལ་བྱེད་དུས།',
  loginAtLabel: 'ནང་འཛུལ་འདི་ནས་བྱོས། %s',
  loginLabel: 'ནང་འཛུལ།',
  loginSubmitLabel: 'ནང་འཛུལ།',
  loginWithLabel: 'ནང་འཛུལ། %s',
  notYourAccountAction: 'ཁྱེད་ཀྱི་ཐོ་གཞུང་རེད་དམ།',
  passwordInputPlaceholder: 'ཁྱེད་ཀྱི་གསང་ཚིག',
  passwordStrength: {
    containsAtLeast: 'ཡི་གེ་རིགས་མི་འདྲ་བ་ཁག་ %d ནང་ནས་ཉུང་མཐར་ %d དགོས།',
    identicalChars: 'ཐིག་ཕྲེང་གཅིག་གི་ནང་དུ་ཡི་གེ་གཅིག་པ་གཅིག་རྐྱང་བྱས་པ་ %d མང་བ་རྒྱུན་མཐུད་ནས་ཡོད་མི་ཆོག (དཔེར་ན། "%s" ལྟ་བུ་ཡོད་མི་ཆོག)',
    nonEmpty: 'གསང་ཚིག་ངེས་པར་དུ་འབྲི་དགོས།',
    numbers: 'ཨང་གྲངས་དགོས། (0-9)',
    lengthAtLeast: 'རིང་ཐུང་ལ་ཉུང་མཐར་ཡི་གེ་ %d དགོས།',
    lowerCase: 'ཡིག་ཆུང་། (a-z)',
    shouldContain: 'ངེས་པར་དུ་དགོས།',
    specialCharacters: 'དམིགས་བསལ་ཨང་རྟགས། (དཔེར་ན། !@#$%^&*)',
    upperCase: 'ཡིག་ཆེན། (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'གློག་འཕྲིན་སྤྱད་ནས་ནང་འཛུལ་བྱེད་པའམ་<br/>ཐོ་གཞུང་གསར་བ་བཟོས།',
  passwordlessEmailCodeInstructions: 'ཚབ་ཨང་ཡོད་པའི་གློག་འཕྲིན་ཞིག་བསྐུར་ཡོད། %s.',
  passwordlessEmailInstructions: 'གློག་འཕྲིན་སྤྱད་ནས་ནང་འཛུལ་བྱེད་པའམ་<br/>ཐོ་གཞུང་གསར་བ་བཟོས།',
  passwordlessSMSAlternativeInstructions:
    'ཁ་པར་ཨང་བྲིས་ནས་ནང་འཛུལ་བྱེད་པའམ་<br/>ཐོ་གཞུང་གསར་བ་བཟོས།',
  passwordlessSMSCodeInstructions: 'ཚབ་ཨང་ཡོད་པའི་འཕྲིན་ཐུང་ཞིག་བསྐུར་ཡོད། %s.',
  passwordlessSMSInstructions: 'ཁ་པར་ཨང་བྲིས་ནས་ནང་འཛུལ་བྱེད་པའམ་<br/>ཐོ་གཞུང་གསར་བ་བཟོས།',
  phoneNumberInputPlaceholder: 'ཁྱེད་ཀྱི་ཁ་པར་ཨང་།',
  resendCodeAction: 'ཚབ་ཨང་འབྱོར་མ་སོང་ངམ།',
  resendLabel: 'བསྐྱར་དུ་སྐུར།',
  resendingLabel: 'བསྐྱར་དུ་སྐུར་བཞིན་ཡོད། ...',
  retryLabel: 'ཡང་བསྐྱར་ཚོད་ལྟ་བྱོས།',
  sentLabel: 'བསྐུར་ཡོད།',
  showPassword: 'གསང་ཚིག་སྟོན།',
  signUpTitle: 'ཐོ་འགོད།',
  signUpLabel: 'ཐོ་འགོད།',
  signUpSubmitLabel: 'ཐོ་འགོད།',
  signUpTerms: 'ཐོ་འགོད་བྱས་པ་དང་མཉམ་དུ་དྲ་ཚིགས་ཀྱི་བཀོལ་སྤྱོད་གན་རྒྱ་དང་གསང་སྟོན་སྲིད་བྱུས་ཚུལ་བཞིན་སྲུང་རྒྱུའི་ཁས་ལེན་བྱས་པ་ཡིན།',
  signUpWithLabel: 'ནང་འཛུལ། %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On enabled དྲ་ཚིགས་གཅིག་གི་ནང་བཟོས་བའི་གློག་འཕྲིན་སྤྱད་ནས་དྲ་ཚིགས་གཞན་པའི་ནང་ཐོ་འགོད་དང་ནང་འཛུལ་བྱེད་ཆོག་པ་བཟོས་ཡོད།',
  submitLabel: 'སྤེལ།',
  unrecoverableError: 'གནད་དོན་ཞིག་བྱུང་སོང་། <br />ང་ཚོའི་འཕྲུལ་ལས་ཞབས་ཞུ་བར་འབྲེལ་བ་བྱོས།',
  usernameFormatErrorHint:
    'ཡི་གེ་ %d-%d དང་། ཨང་གྲངས། རྟགས་འདི་དག་ "_", ".", "+", "-" བེད་སྤྱོད་བྱོས།',
  usernameInputPlaceholder: 'སྤྱོད་མཁན་གྱི་མིང་།',
  usernameOrEmailInputPlaceholder: 'སྤྱོད་མཁན་གྱི་མིང་།/གློག་འཕྲིན།',
  title: 'Auth0',
  welcome: 'དགའ་བསུ་ཞུ %s!',
  windowsAuthInstructions: 'ཁྱེད་རང་ཚོགས་པའི་དྲ་རྒྱ་བརྒྱུད་ནས་མཐུད་འདུག',
  windowsAuthLabel: 'སྒེའུ་ཁུང་བདེན་དབང་ར་སྤྲོད།',
  mfaInputPlaceholder: 'གསང་བརྡའི་ཨང་།',
  mfaLoginTitle: 'གོ་རིམ་གཉིས་ལྡན་གྱི་བདེན་དབང་ར་སྤྲོད།',
  mfaLoginInstructions: 'ཁྱེད་ཀྱི་ཁ་པར་ཨང་ནང་བསྐུར་ཡོང་བའི་གསང་བརྡའི་ཨང་འབྲི་རོགས།',
  mfaSubmitLabel: 'ནང་འཛུལ།',
  mfaCodeErrorHint: 'ཨང་གྲངས་ %d བེད་སྤྱོད་བྱོས།'
};
