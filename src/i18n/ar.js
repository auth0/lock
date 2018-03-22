export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'لقد وصلت الحد المسموح للتغير الرمز السري، رجاء أنتظر قبل أن تحاول مرة أخرى',
      'lock.fallback': "اسف لقد حصل خطاء أثناء تغيير الرمز السري.",
      enterprise_email:
        "بريدك يعود لشركتك لأعادة ضبط الرمز السري تواصل مع المدير التقني لديك في الشركة."
    },
    login: {
      blocked_user: 'المستخدم محظور',
      invalid_user_password: 'المعلومات غير صحيحة',
      'lock.fallback': "اسف حصل خطاء أثناء محاولة تسجيل الدخول.",
      'lock.invalid_code': 'الرمز غير صحيح.',
      'lock.invalid_email_password': 'البريد أو الرمز السري غير صحيح.',
      'lock.invalid_username_password': 'اسم المستخدم أو الرمز السري غير صحيح.',
      'lock.network': 'لايمكن الاتصال بالخادم نرجو التحقق من وجود اتصل بالشبكة.',
      'lock.popup_closed': 'تم أغلاق النافدة المنبثقة.',
      'lock.unauthorized': 'لم يمنح الأذن نرجو اعادة المحاولة.',
      'lock.mfa_registration_required':
        'جهازك غير مدرج في نظام التحقق الثنائي أدرج جهازك قبل التقدم.',
      'lock.mfa_invalid_code': 'الرمز التحقق غير صحيح نرجو المحاولة.',
      password_change_required:
        'يجب تحديث الرمز السري لأنك سجلت أول مرة أو أن الرمز السري أنتهاء.', // TODO: verify error code
      password_leaked:
        'هناك احتمالية مشكلة امنية في حسابك لحماية حسابك تم حظر الدخول للحساب وتم ارسال بريد الإلكتروني يحتوي على تعليمات لرفع الحظر عن حسابك.',
      too_many_attempts: 'تم حظر حسابك لتكرار محاولة دخول خاطئة',
      session_missing:
        "لم يتم اكمال التحقق نرجو المحاولة مرة أخرى بعد أغلاق جميع النوافذ.",
      'hrd.not_matching_email': 'رجاء استخدم بريدك الالكتروني الخاص بالشركتك.'
    },
    passwordless: {
      'bad.email': 'البريد الإلكترني غير صحيح',
      'bad.phone_number': 'رقم الهاتف غير صحيح',
      'lock.fallback': "اسف حصل خطاء ما."
    },
    signUp: {
      invalid_password: 'الرمز السري غير صحيح.',
      'lock.fallback': "اسف حصل خطاء أثناء التسجيل",
      password_dictionary_error: 'الرمز السري سهل التخمين',
      password_no_user_info_error: 'الرمز السري يحتوى على معلوماتك الخاصة',
      password_strength_error: 'الرمز السري ضعيف.',
      user_exists: 'المستخدم مسجل مسبقاً.',
      username_exists: 'اسم المستخدم محجوز.'
    }
  },
  success: {
    // success messages show above the form or in a confirmation pane
    logIn: 'شكرا لتسجيل الدخول.',
    forgotPassword: "ارسلنا لك رسالة على البريد الإلكتروني لإعادة ضبط الرمز السري.",
    magicLink: 'ارسلنا لك رسالة بريد الإلكترني لتسجيل الدخول<br />الى %s.',
    signUp: 'شكراً لتسجيلك معنا.'
  },
  blankErrorHint: "يجب أن لايكون فارغ",
  codeInputPlaceholder: 'رمزك',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'او',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'او',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'سجل دخول بريدك الإلكتروني الخاص بشركتك.',
  enterpriseActiveLoginInstructions: 'رجاء أدخل معلوماتك لدى شركتك %s.',
  failedLabel: 'فشل!',
  forgotPasswordTitle: 'إعادة ضبط الرمز السري',
  forgotPasswordAction: "نسيت الرمز السري?",
  forgotPasswordInstructions:
    'رجاء أدخل البريد الإلكترني وسوف نرسل لك رسالة على البريد الإلكتروني لإعادة ضبط الرمز السري.',
  forgotPasswordSubmitLabel: 'ارسل البريد الإلكتروني',
  invalidErrorHint: 'غير صحيح',
  lastLoginInstructions: 'اخر مرة قم بالتسجل الدخول ب',
  loginAtLabel: 'تسجيل دخول في %s',
  loginLabel: 'تسجيل دخول',
  loginSubmitLabel: 'دخول',
  loginWithLabel: 'تسجيل دخول ب %s',
  notYourAccountAction: 'ليس بحسابك?',
  passwordInputPlaceholder: 'رمزك السري',
  passwordStrength: {
    containsAtLeast: 'تحتوي على اقل %d احدى  %d النوع الحروف:',
    identicalChars: 'ممنوع اكثر من %d حرف متشابه في السطر (مثال, "%s" غير مسموح)',
    nonEmpty: 'لا يمكن أن يكون فارغ الرمز السري مطلوب',
    numbers: 'الارقام (مثال. 0-9)',
    lengthAtLeast: 'على الاقل %d احرف',
    lowerCase: 'حروف صغيرة (a-z)',
    shouldContain: 'يجب أن يحتوي:',
    specialCharacters: 'حروف خاصة (مثال !@#$%^&*)',
    upperCase: 'حروف كبيرة (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'إيضاً يمكنك تسجل الدخول بالبريدك الإلكترني<br/>او أنشاء حساب جديد',
  passwordlessEmailCodeInstructions: 'تم إرسال رسالة لبريدك الإلكترني %s.',
  passwordlessEmailInstructions: 'إدخل بريدك الإلكترني لتسجيل الدخول<br/>او أنشاء حساب جديد',
  passwordlessSMSAlternativeInstructions:
    'ايضاً يمكنك تسجيل الدخول بالهاتف<br/>او تنشاء حساب جديد',
  passwordlessSMSCodeInstructions: 'تم ارسال رسالة نصية الى الهاتفك<br/> %s.',
  passwordlessSMSInstructions: 'ادخل رقم الهاتف لتسجيل الدخول<br/>او انشاء حساب جديد',
  phoneNumberInputPlaceholder: 'رقم هاتفك',
  resendCodeAction: 'لم يصلني الرمز السري؟',
  resendLabel: 'إعادة ارسال',
  resendingLabel: 'جاري إعادة إرسال ...',
  retryLabel: 'محاولة',
  sentLabel: 'تم الارسال',
  showPassword: 'اظهر الرمز السري',
  signupTitle: 'حساب جديد',
  signUpLabel: 'تسجيل حساب جديد',
  signUpSubmitLabel: 'انشاء حساب جديد',
  signUpTerms: '',
  signUpWithLabel: 'انشاء حساب جديد %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'التسجيل الموحد فعال',
  submitLabel: 'ارسل',
  unrecoverableError: 'حصل خطاء.<br />تواصل مع فريق الدعم.',
  usernameFormatErrorHint:
    'استخدم %d-%d الحروف والارقام والحرف التالية: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'اسم المستخدم',
  usernameOrEmailInputPlaceholder: 'اسم المستخدم/ البريد الإلكتروني',
  title: 'Auth0',
  welcome: 'مرحبآً %s!',
  windowsAuthInstructions: 'اتصالك من داخل شبكة الشركة &hellip;',
  windowsAuthLabel: 'التحقق بالوندوز',
  mfaInputPlaceholder: 'الرمز',
  mfaLoginTitle: 'التحقق بخطوتين',
  mfaLoginInstructions: 'رجاء أدخل رمز التحقق المرسل من جوالك.',
  mfaSubmitLabel: 'دخول',
  mfaCodeErrorHint: 'استخدم %d ارقام'
};
