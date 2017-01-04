export default {
  error: {
    forgotPassword: {
      "too_many_requests": "您尝试登录次数过多 请稍后再试。",
      "lock.fallback": "对不起，请求修改密码时出现错误。"
    },
    login: {
      "blocked_user": "该账号已被锁定。",
      "invalid_user_password": "密码错误",
      "lock.fallback": "对不起，请求登录时出现错误。",
      "lock.invalid_code": "代码错误。",
      "lock.invalid_email_password": "邮箱或密码错误。",
      "lock.invalid_username_password": "账号或密码错误。",
      "lock.network": "无法连接到服务器，请检查网络连接后重试。",
      "lock.popup_closed": "弹出窗口被关闭，请重试",
      "lock.unauthorized": "权限不足，请重试。",
      "password_change_required": "由于这是第一次登录或者您的密码已过期，请更新密码。",
      "password_leaked": "由于您的密码在其他网站已泄露，该账户已被锁定，请查看邮件解除锁定。",
      "too_many_attempts": "由于登录操作太频繁，您的帐号已被锁定。"
    },
    passwordless: {
      "bad.email": "邮箱错误",
      "bad.phone_number": "手机号码格式不正确。",
      "lock.fallback": "对不起，出现错误。"
    },
    signUp: {
      "invalid_password": "密码错误",
      "lock.fallback": "对不起，请求注册时出现错误。",
      "password_dictionary_error": "密码过于常见。",
      "password_no_user_info_error": "密码中出现账号信息。",
      "password_strength_error": "密码过于简单。",
      "user_exists": "该账号已存在。",
      "username_exists": "该用户名已存在。"
    }
  },
  success: {
    logIn: "登录成功",
    forgotPassword: "重置密码的邮件已发送",
    magicLink: "已向您发送链接<br/>到 %s 登录", // This one needs review
    signUp: "感谢您的注册。"
  },
  blankErrorHint: "不能为空",
  codeInputPlaceholder: "您的代码",
  databaseEnterpriseLoginInstructions: "",
  databaseEnterpriseAlternativeLoginInstructions: "或",
  databaseSignUpInstructions: "",
  databaseAlternativeSignUpInstructions: "或",
  emailInputPlaceholder: "yours@example.com",
  enterpriseLoginIntructions: "请用您的企业账号登录",  // This one needs review
  enterpriseActiveLoginInstructions: "请输入您的企业账号 %s。",  // This one needs review
  failedLabel: "失败!",
  forgotPasswordAction: "忘记您的密码？",
  forgotPasswordInstructions: "请输入您的邮箱，我们将为你发送重置密码的邮件。",
  forgotPasswordSubmitLabel: "发电子邮件", // needs review
  invalidErrorHint: "错误",
  lastLoginInstructions: "上次登录的信息为",
  loginAtLabel: "登录到 %s",
  loginLabel: "登录",
  loginSubmitLabel: "登录", // needs review
  loginWithLabel: "用 %s 登录",
  notYourAccountAction: "不是您的账号?",
  passwordInputPlaceholder: "您的密码",
  passwordStrength: {
    containsAtLeast: "至少包含 %d 个以上 %d 种字符:",
    identicalChars: "不能多于 %d 个相同的字符在同一行(例如,不允许出现 \"%s\" )",
    nonEmpty: "密码不能为空",
    numbers: "数字 (如 0-9)",
    lengthAtLeast: "最少长度为 %d 个字符",
    lowerCase: "小写字母 (a-z)",
    shouldContain: "应包含：",
    specialCharacters: "特殊字符 (如 !@#$%^&*)",
    upperCase: "大写字母 (A-Z)"
  },
  passwordlessEmailAlternativeInstructions: "您还可以通过邮箱登录<br/>或者创建账号", // This one needs review
  passwordlessEmailCodeInstructions: "代码已通过邮件发送到 %s。",
  passwordlessEmailInstructions: "输入邮箱登录<br/>或者创建账号。",
  passwordlessSMSAlternativeInstructions: "您还可以通过手机号码登录<br/>或者创建账号。",
  passwordlessSMSCodeInstructions: "代码已通过短信发送到<br/> %s。",
  passwordlessSMSInstructions: "输入手机号码登录<br/>或者创建账号",
  phoneNumberInputPlaceholder: "您的手机号码",
  resendCodeAction: "没有收到号码?",
  resendLabel: "重新发送",
  resendingLabel: "重新发送中...",
  retryLabel: "重试",
  sentLabel: "发送!",
  signUpLabel: "注册",
  signUpSubmitLabel: "注册", // needs review
  signUpTerms: "",
  signUpWithLabel: "使用 %s 注册",
  socialLoginInstructions: "",
  socialSignUpInstructions: "",
  ssoEnabled: "单点登录已激活",
  submitLabel: "提交", // needs review
  unrecoverableError: "出现错误。<br/>请联系技术人员。",
  usernameFormatErrorHint: "请使用 %d-%d 位字母、数字或 \"_\"的组合",
  usernameInputPlaceholder: "您的用户名",
  usernameOrEmailInputPlaceholder: "用户名/邮箱",
  title: "Auth0",
  welcome: "欢迎 %s!",
  windowsAuthInstructions: "您已连接到组织网络&hellip;",
  windowsAuthLabel: "Windows 认证",
  mfaInputPlaceholder: "验证码",
  mfaLoginTitle: "两步验证",
  mfaLoginInstructions: "请输入您手机应用上显示的验证码。",
  mfaSubmitLabel: "登录",
  mfaCodeErrorHint: "使用 %d 位数字"
};
