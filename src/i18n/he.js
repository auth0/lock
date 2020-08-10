// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests: 'הגעת למגבלת הנסיונות לשינוי סיסמא. אנא המתן לפני הנסיון הבא.',
      'lock.fallback': 'אנחנו מתנצלים, משהו השתבש בעת הנסיון לשינוי הסיסמא',
      enterprise_email:
        'הדומיין של כתובת המייל שלך הוא חלק מספק זהויות ארגוני. על מנת לאפס את הסיסמא שלך, אנא צור קשר עם אחראי האבטחה בארגון.'
    },
    login: {
      blocked_user: 'המשתמש חסום.',
      invalid_user_password: 'פרטים לא נכונים.',
      'lock.fallback': 'אנחנו מתנצלים, משהו השתבש בעת הנסיון להיכנס.',
      'lock.invalid_code': 'קוד שגוי.',
      'lock.invalid_email_password': 'כתובת מייל או סיסמא שגויים.',
      'lock.invalid_username_password': 'שם משתמש או סיסמא שגויים.',
      'lock.network': 'לא ניתן ליצור קשר עם השרת. אנא בדוק את החיבור שלך ונסה שנית.',
      'lock.popup_closed': 'חלון קופץ נסגר. אנא נסה שנית.',
      'lock.unauthorized': 'הרשאות לא ניתנו. אנא נסה שנית.',
      'lock.mfa_registration_required':
        'הזדהות דו-שלבית דרושה אבל המכשיר שברשותך לא רשום. אנא הרשם לפני שתמשיך.',
      'lock.mfa_invalid_code': 'קוד שגוי, אנא נסה שנית.',
      password_change_required:
        'עליך לעדכן את הסיסמא שלך מכיוון שזו הפעם הראשונה שאתה נכנס למערכת, או מכיוון שפג תוקף הסיסמא שברשותך.',
      password_leaked:
        'בחשבון זה זוהתה בעיית אבטחה פוטנציאלית. על מנת להגן על החשבון שלך, ניסיון הכניסה הנוכחי נחסם. נשלח מייל המכיל הוראות לפתיחת החשבון לשימוש.',
      too_many_attempts: 'חשבונך נחסם לאחר ניסיונות מרובים ורצופים לכניסה.',
      session_missing:
        'לא ניתן להשלים את ניסיון ההזדהות. אנא נסה שנית לאחר סגירת כל החלונות הפתוחים.',
      'hrd.not_matching_email': 'על מנת להיכנס, אנא השתמש בחשבון המייל הארגוני שלך',
      too_many_requests:
        'אנחנו מצטערים. יש יותר מדי בקשות כרגע. טען מחדש את הדף ונסה שוב. אם פעולה זו נמשכת, נסה שוב מאוחר יותר.',
      invalid_captcha: 'לפתור את שאלת האתגר כדי לוודא שאתה לא רובוט.',
      invalid_recaptcha: 'בחר בתיבת הסימון כדי לוודא שאתה לא רובוט.'
    },
    passwordless: {
      'bad.email': 'כתובת המייל אינה תקינה',
      'bad.phone_number': 'מספר הטלפון לא תקין',
      'lock.fallback': 'אנו מתנצלים, משהו השתבש'
    },
    signUp: {
      invalid_password: 'סיסמא לא תקינה.',
      'lock.fallback': 'אנו מתנצלים, משהו השתבש במהלך ניסיון ההרשמה.',
      password_dictionary_error: 'סיסמא שכיחה מדי.',
      password_no_user_info_error: 'סיסמא מבוססת על פרטי המשתמש.',
      password_strength_error: 'סיסמא חלשה מדי.',
      user_exists: 'משתמש קיים במערכת.',
      username_exists: 'שם המשתמש קיים במערכת.',
      social_signup_needs_terms_acception: 'אנא הסכים לתנאי השירות שלהלן כדי להמשיך.'
    }
  },
  success: {
    logIn: 'תודה שנכנסת.',
    forgotPassword: 'מייל לשחזור סיסמא נשלח.',
    magicLink: 'מייל עם קישור לכניסה נשלח אל<br />%s',
    signUp: 'תודה על ההרשמה.'
  },
  blankErrorHint: 'לא יכול להישאר ריק',
  codeInputPlaceholder: 'הקוד שלך',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'או',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'או',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'כניסה עם פרטי המשתמש הארגוניים שלך.',
  enterpriseActiveLoginInstructions: 'אנא הכנס את פרטי המשתמש הארגוניים שלך ב%s.',
  failedLabel: 'נכשל!',
  forgotPasswordTitle: 'אפס את הסיסמא שלך',
  forgotPasswordAction: 'לא זוכר את הסיסמא שלך?',
  forgotPasswordInstructions: 'אנא הכנס את כתובת המייל שלך. אנחנו נשלח לך מייל לשחזור סיסמא.',
  forgotPasswordSubmitLabel: 'שלח מייל',
  invalidErrorHint: 'לא תקין',
  lastLoginInstructions: 'פעם אחרונה שנכנסת עם',
  loginAtLabel: '%sכניסה ב',
  loginLabel: 'כניסה',
  loginSubmitLabel: 'כניסה',
  loginWithLabel: '%s כניסה עם',
  notYourAccountAction: 'לא החשבון שלך?',
  passwordInputPlaceholder: 'הסיסמא שלך',
  passwordStrength: {
    containsAtLeast: 'מכיל לפחות %d מתוך %d סוגי התווים הבאים',
    identicalChars: 'לא יותר מ %d תווים זהים ברצף (לדוגמא, "%s" לא תקין)',
    nonEmpty: 'דרושה סיסמא לא ריקה',
    numbers: 'מספרים (0-9)',
    lengthAtLeast: 'באורך %d תווים לפחות',
    lowerCase: 'אותיות קטנות (a-z)',
    shouldContain: 'צריך להכיל:',
    specialCharacters: 'תווים מיוחדים (לדוגמא: !@#$%^&*)',
    upperCase: 'אותיות גדולות (A-Z)'
  },
  passwordlessEmailAlternativeInstructions: 'או הכנס את כתובת המייל שלך לכניסה<br/>או צור חשבון',
  passwordlessEmailCodeInstructions: 'מייל עם הקוד נשלח אל %s.',
  passwordlessEmailInstructions: 'הכנס כתובת מייל לכניסה<br/>או צור חשבון',
  passwordlessSMSAlternativeInstructions: 'או הכנס את מספר הטלפון שלך לכניסה<br/>או צור חשבון',
  passwordlessSMSCodeInstructions: 'מסרון עם הקוד נשלח <br/>אל %s.',
  passwordlessSMSInstructions: 'הכנס את מספר הטלפון שלך לכניסה<br/>או צור חשבון',
  phoneNumberInputPlaceholder: 'מספר הטלפון שלך',
  resendCodeAction: 'לא קיבלת את הקוד?',
  resendLabel: 'שלח שוב',
  resendingLabel: 'שולח שוב...',
  retryLabel: 'נסה שוב',
  sentLabel: 'נשלח!',
  showPassword: 'הצג סיסמא',
  signUpTitle: 'הרשמה',
  signUpLabel: 'הרשמה',
  signUpSubmitLabel: 'הרשמה',
  signUpTerms: 'בכך שאתה מתחבר למערכת, אתה מסכים לתנאי השימוש שלנו ולמדיניות הפרטיות.',
  signUpWithLabel: 'הרשמה עם %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'הזדהות חד-פעמית (SSO) מאופשרת',
  submitLabel: 'שלח',
  unrecoverableError: 'משהו השתבש.<br />אנא צור קשר עם התמיכה הטכנית.',
  usernameFormatErrorHint: 'השתמש ב%d-%d אותיות, ספרות והתווים הבאים: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'שם המשתמש שלך',
  usernameOrEmailInputPlaceholder: 'שם משתמש/כתובת מייל',
  title: 'Auth0',
  welcome: 'ברוך הבא %s!',
  windowsAuthInstructions: '&hellip;אתה מחובר מהרשת הארגונית שלך',
  windowsAuthLabel: 'אימות של ווינדוס',
  mfaInputPlaceholder: 'קוד',
  mfaLoginTitle: 'אימות דו-שלבי',
  mfaLoginInstructions: 'אנא הזן את קוד האימות שנוצר על ידי האפליקציה שלך.',
  mfaSubmitLabel: 'כניסה',
  mfaCodeErrorHint: 'השתמש ב%d ספרות',
  captchaCodeInputPlaceholder: 'הזן את הקוד שמוצג למעלה',
  captchaMathInputPlaceholder: 'לפתור את הנוסחה שמוצגת למעלה'
};
