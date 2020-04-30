Auth0.registerLanguageDictionary('ar', {
  error: {
    forgotPassword: {
      too_many_requests:
        'لقد تجاوزت الحد المسموح لمحاولات تغيير كلمة المرور. رجاءً انتظر قبل إعادة المحاولة.',
      'lock.fallback': 'المعذرة، حصل خطأ ما خلال طلب تغيير كلمة المرور.',
      enterprise_email:
        'نطاق بريدك الإلكتروني يتبع لمؤسسة، لإعادة تعيين كلمة المرور، رجاءً تواصل مع أحد مسؤولي النظام.'
    },
    login: {
      blocked_user: 'المستخدم محظور.',
      invalid_user_password: 'بيانات خاطئة.',
      'lock.fallback': 'المعذرة، حصل خطأ ما خلال محاولة الدخول.',
      'lock.invalid_code': 'رمز خاطئ.',
      'lock.invalid_email_password': 'بريد إلكتروني أو كلمة مرور خاطئة.',
      'lock.invalid_username_password': 'اسم مستخدم أو كلمة مرور خاطئة.',
      'lock.network': 'تعذر الوصول إلى الخادم، رجاءً تفقد الاتصال وأعد المحاولة.',
      'lock.popup_closed': 'تم إغلاق النافذة المنبثقة، أعد المحاولة.',
      'lock.unauthorized': 'لم يتم منح الصلاحيات، أعد المحاولة.',
      'lock.mfa_registration_required':
        'المصادقة المتعددة مطلوبة ولكن جهازك غير مسجل، رجاء سجّل جهازك قبل المضي قدماً.',
      'lock.mfa_invalid_code': 'رمز خاطئ، رجاءً أعد المحاولة.',
      password_change_required:
        'يجب تحديث كلمة المرور لأنها المرة الأولى للدخول، أو لانتهاء صلاحية كلمة المرور.',
      password_leaked:
        'لقد اكتشفنا مشكلة أمنية محتملة في هذا الحساب. لحماية حسابك ، قمنا بحظر هذا الدخول. تم إرسال بريد إلكتروني عن كيفية رفع الحظر عن حسابك.',
      too_many_attempts: 'تم حظر حسابك بعد عدة محاولات متتالية للدخول.',
      session_missing:
        'لم نتمكن من إكمال طلب المصادقة. رجاءً أعد المحاولة بعد إغلاق جميع مربعات الحوار المفتوحة.',
      'hrd.not_matching_email': 'يرجى استخدام بريد الشركة الإلكتروني للدخول.',
      too_many_requests:
        'نحن آسفون. هناك الكثير من الطلبات في الوقت الحالي. يرجى إعادة تحميل الصفحة وحاول مرة أخرى. إذا استمر هذا الأمر ، يرجى إعادة المحاولة لاحقًا.'
    },
    passwordless: {
      'bad.email': 'البريد الإلكتروني غير صالح.',
      'bad.phone_number': 'رقم الهاتف غير صالح.',
      'lock.fallback': 'المعذرة، حصل خطأ ما.'
    },
    signUp: {
      invalid_password: 'كلمة المرور غير صالحة.',
      'lock.fallback': 'المعذرة، حصل خطأ ما خلال محاولة إنشاء الحساب.',
      password_dictionary_error: 'كلمة المرور متداولة جداً.',
      password_no_user_info_error: 'ترتكز كلمة المرور على اسم المستخدم.',
      password_strength_error: 'كلمة المرور ضعيفة جداً.',
      user_exists: 'المستخدم موجود بالفعل.',
      username_exists: 'اسم المستخدم موجود بالفعل.'
    }
  },
  success: {
    logIn: 'شكراً للدخول.',
    forgotPassword: 'أرسلنا لك بريداً إلكترونياً لإعادة تعيين كلمة المرور خاصتك.',
    magicLink: 'أرسلنا لك رابطاً للدخول<br/>إلى %s.',
    signUp: 'شكراً لإنشاء الحساب.'
  },
  blankErrorHint: 'لا ينبغي أن يكون فارغاً.',
  codeInputPlaceholder: 'الرمز',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'أو',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'أو',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'الدخول ببيانات الدخول الخاصة بالشركة.',
  enterpriseActiveLoginInstructions: 'رجاءً أدخل بيانات الدخول الخاصة بالشركة على %s.',
  failedLabel: 'فشل!',
  forgotPasswordTitle: 'أعد تعيين كلمة المرور',
  forgotPasswordAction: 'لا تتذكر كلمة المرور؟',
  forgotPasswordInstructions:
    'رجاء أدخل بريدك الإلكتروني. سنرسل لك رسالة لإعادة تعيين كلمة المرور.',
  forgotPasswordSubmitLabel: 'أرسل بريداً إلكترونياً',
  invalidErrorHint: 'غير صالح',
  lastLoginInstructions: 'دخلت آخر مرة باستخدام',
  loginAtLabel: 'ادخل إلى %s',
  loginLabel: 'دخول',
  loginSubmitLabel: 'دخول',
  loginWithLabel: 'دخول باستخدام %s',
  notYourAccountAction: 'ليس حسابك؟',
  passwordInputPlaceholder: 'كلمة المرور',
  passwordStrength: {
    containsAtLeast: 'استخدم على الأقل %d من الأنواع الـ %d التالية من المحارف:',
    identicalChars: 'لا تستخدم أكثر من %d من المحارف المتماثلة المتتالية (مثل: "%s" غير مسموح)',
    nonEmpty: 'كلمة المرور لا ينبغي أن تترك فارغة',
    numbers: 'أرقام (مثل: 0-9)',
    lengthAtLeast: 'الطول لا يجب أن يقل عن %d محرفاً',
    lowerCase: 'أحرف صغيرة (a – z)',
    shouldContain: 'يجب استخدام:',
    specialCharacters: 'محارف خاصة (مثل: !@#$%^&*)',
    upperCase: 'أحرف كبيرة (A – Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'وإلا، أدخل بريدك الإلكتروني للدخول <br/>أو أنشئ حساباً',
  passwordlessEmailCodeInstructions: 'تم إرسال الرمز إلى البريد الإلكتروني %s',
  passwordlessEmailInstructions: 'أدخل بريدك الإلكتروني للدخول <br/>أو أنشئ حساباً',
  passwordlessSMSAlternativeInstructions: 'وإلا، أدخل رقم هاتفك للدخول <br/>أو أنشئ حساباً',
  passwordlessSMSCodeInstructions: 'تم إرسال الرمز إلى برسالة نصية<br/>إلى %s',
  passwordlessSMSInstructions: 'أدخل رقم هاتفك للدخول <br/>أو أنشئ حساباً',
  phoneNumberInputPlaceholder: 'رقم هاتفك',
  resendCodeAction: 'هل استلمت الرمز؟',
  resendLabel: 'إعادة إرسال',
  resendingLabel: 'إعادة الإرسال...',
  retryLabel: 'أعد المحاولة',
  sentLabel: 'تم الإرسال!',
  showPassword: 'أظهر كلمة المرور',
  signUpTitle: 'إنشاء حساب',
  signUpLabel: 'إنشاء حساب',
  signUpSubmitLabel: 'إنشاء حساب',
  signUpTerms: 'عند إنشائك للحساب، فأنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا.',
  signUpWithLabel: 'إنشاء حساب باستخدام %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'تسجيل الدخول الموحد مفعل',
  submitLabel: 'إرسال',
  unrecoverableError: 'حصل خطأ ما.<br/>رجاءً اتصل بالدعم الفني.',
  usernameFormatErrorHint: 'استخدم %d-%d، أرقام، والمحارف التالية: "_"، "."، "+"، "-"',
  usernameInputPlaceholder: 'اسم المستخدم',
  usernameOrEmailInputPlaceholder: 'اسم المستخدم/البريد الإلكتروني',
  title: 'Auth0',
  welcome: 'مرحباً %s!',
  windowsAuthInstructions: 'أنت متصل من الشبكة الخاصة بمؤسستك...',
  windowsAuthLabel: 'مصادقة ويندوز',
  mfaInputPlaceholder: 'الرمز',
  mfaLoginTitle: 'التحقق بخطوتين',
  mfaLoginInstructions: 'رجاءً أدخل رمز التأكيد المولّد باستخدام التطبيق',
  mfaSubmitLabel: 'دخول',
  mfaCodeErrorHint: 'استخدم %d رقم'
});
