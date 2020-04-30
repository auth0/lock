Auth0.registerLanguageDictionary('tr', {
  error: {
    forgotPassword: {
      too_many_requests:
        'Şifre değiştirme deneme sayısında limite ulaştınız. Tekrar denemeden önce lütfen bekleyin.',
      'lock.fallback':
        'Özür dileriz, şifre değiştirme isteğiniz gerçekleştirilirken bir hata oluştu.',
      enterprise_email:
        'E-postanızın alanı, bir kurumsal kimlik sağlayıcısının parçasıdır. Parolanızı sıfırlamak için lütfen güvenlik yöneticinize başvurun.'
    },
    login: {
      blocked_user: 'Kullanıcı engellendi.',
      invalid_user_password: 'Kimlik bilgileri hatalı.',
      'lock.fallback': 'Özür dileriz, giriş yaparken bir hata oluştu.',
      'lock.invalid_code': 'Hatalı kod.',
      'lock.invalid_email_password': 'Yanlış e-posta veya şifre.',
      'lock.invalid_username_password': 'Yanlış kullanıcı adı veya şifre.',
      'lock.network': 'Sunucuya ulaşamadık. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.',
      'lock.popup_closed': 'Pop-up penceresi kapandı. Tekrar deneyin.',
      'lock.unauthorized': 'Yetkiler alınamadı. Tekrar deneyin.',
      'lock.mfa_registration_required':
        'Çok faktörlü kimlik doğrulama gerekmektedir ancak cihazınız kayıtlı değil. Devam etmeden önce lütfen cihazınızı kaydettirin.',
      'lock.mfa_invalid_code': 'Hatalı kod. Lütfen tekrar deneyin.',
      password_change_required:
        'İlk defa giriş yaptığınız veya şifrenizin kullanım süresi dolduğu için şifrenizi güncellenmeniz gerekmektedir.',
      password_leaked:
        'Şifreniz başka bir websitesinde açığa çıktığı için bu giriş denemesi engellendi. Engeli kaldırmak için gereken adımları size e-posta olarak gönderdik.',
      too_many_attempts: 'Çok fazla giriş denemesi sonucunda hesabınız bloke oldu.',
      session_missing:
        'Kimlik doğrulama isteği tamamlanamadı. Tüm açık diyalogları kapattıktan sonra tekrar deneyiniz',
      'hrd.not_matching_email': ', Giriş için kurumsal e-posta kullanın.',
      too_many_requests:
        'Üzgünüz. Şu anda çok fazla istek var. Lütfen sayfayı tekrar yükleyin ve tekrar deneyin. Bu devam ederse, lütfen daha sonra tekrar deneyin.'
    },
    passwordless: {
      'bad.email': 'E-posta geçerli değil',
      'bad.phone_number': 'Telefon numarası geçerli değil',
      'lock.fallback': 'Özür dileriz, bir hata oluştu'
    },
    signUp: {
      invalid_password: 'Şifre geçersiz.',
      'lock.fallback': 'Özür dileriz, kaydolurken bir hata oluştu.',
      password_dictionary_error: 'Şifre çok genel.',
      password_no_user_info_error: 'Şifre kullanıcı bilgilerini içeriyor.',
      password_strength_error: 'Şifre çok zayıf.',
      user_exists: 'Bu kullanıcı zaten var.',
      username_exists: 'Bu kullanıcı adı kullanımda.'
    }
  },
  success: {
    logIn: 'Giriş yaptığınız için teşekkürler.',
    forgotPassword: 'Şifrenizi yenilemeniz için size az önce bir e-posta gönderdik.',
    magicLink: 'Giriş yapmanız için size bir link gönderdik<br /> %s.',
    signUp: 'Kaydolduğunuz için teşekkürler.'
  },
  blankErrorHint: 'Boş kalamaz',
  codeInputPlaceholder: 'kodunuz',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'veya',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'veya',
  emailInputPlaceholder: 'sizin@ornek.com',
  enterpriseLoginIntructions: 'Şirket kimliğiniz ile giriş yapın.',
  enterpriseActiveLoginInstructions: 'Lütfen %s deki şirket kimliğinizi girin.',
  failedLabel: 'Başarısız!',
  forgotPasswordAction: 'Şifrenizi hatırlamıyor musunuz?',
  forgotPasswordInstructions:
    'Lütfen e-posta adresinizi girin. Şifrenizi yenilemek için size e-posta göndereceğiz.',
  forgotPasswordSubmitLabel: 'Email gönder',
  invalidErrorHint: 'Geçersiz',
  lastLoginInstructions: 'En son giriş yaptığınız',
  loginAtLabel: '%s ile giriş yap',
  loginLabel: 'Giriş yap',
  loginSubmitLabel: 'Giriş yap',
  loginWithLabel: '%s ile giriş',
  notYourAccountAction: 'Sizin hesabınız değil mi?',
  passwordInputPlaceholder: 'şifreniz',
  passwordStrength: {
    containsAtLeast:
      'En az %d farklı tip karakter kullanılmalıdır. Altta kullanılabilir %d farklı tip listelenmiştir.',
    identicalChars: 'Tek satırda %d den fazla aynı karakter olamaz (ör., "%s" izin verilmez)',
    nonEmpty: 'Boşluksuz şifre gerekli',
    numbers: 'Sayılar (ör. 0-9)',
    lengthAtLeast: 'En az %d karakter uzunluğunda',
    lowerCase: 'Küçük harfler (a-z)',
    shouldContain: 'İçermeli:',
    specialCharacters: 'Özel karakterler (ör. !@#$%^&*)',
    upperCase: 'Büyük harfler (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Aksi halde, giriş yapmak için e-posta adresinizi girin<br/>veya bir hesap oluşturun',
  passwordlessEmailCodeInstructions: '%s adresine kod içeren bir e-posta gönderildi.',
  passwordlessEmailInstructions:
    'Giriş yapmak için e-posta adresinizi girin<br/>veya bir hesap oluşturun',
  passwordlessSMSAlternativeInstructions:
    'Aksi halde, giriş yapmak için telefon numaranızı girin<br/>veya bir hesap oluşturun',
  passwordlessSMSCodeInstructions: 'Size kod içeren bir SMS gönderdik<br/>%s.',
  passwordlessSMSInstructions:
    'Giriş yapmak için telefon numaranızı girin<br/>veya bir hesap oluşturun',
  phoneNumberInputPlaceholder: 'telefon numaranız',
  resendCodeAction: 'Kodu almadınız mı?',
  resendLabel: 'Tekrar gönder',
  resendingLabel: 'Tekrar gönderiliyor...',
  retryLabel: 'Yeniden dene',
  sentLabel: 'Gönderildi!',
  signUpLabel: 'Kaydol',
  signUpSubmitLabel: 'Kaydol',
  signUpWithLabel: '%s ile kaydol',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Tek oturum açma (SSO) etkinleştirildi',
  submitLabel: 'Gönder',
  unrecoverableError: 'Bir hata oluştu.<br />Lütfen teknik destek ile iletişime geçin.',
  usernameFormatErrorHint:
    '%d-%d harf, sayı ve aşağıdaki karakterleri kullanın: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'kullanıcı adınız',
  usernameOrEmailInputPlaceholder: 'kullanıcı adı/e-posta',
  title: 'Auth0',
  welcome: 'Hoşgeldin %s!',
  windowsAuthInstructions: 'İş ağınızdan bağlandınız&hellip;',
  windowsAuthLabel: 'Windows Kimlik Doğrulama',
  mfaInputPlaceholder: 'Kod',
  mfaLoginTitle: '2 adımda doğrulama',
  mfaLoginInstructions: 'Lütfen mobil uygulamanız ile üretilen doğrulama kodunu girin.',
  mfaSubmitLabel: 'Giriş yap',
  mfaCodeErrorHint: '%d numaralarını kullanın',
  forgotPasswordTitle: 'Parolanızı sıfırlayın',
  signUpTitle: 'Kaydol',
  showPassword: 'Şifreni göster',
  signUpTerms: 'Kaydolarak, hizmet şartlarımızı ve gizlilik politikamızı kabul etmiş olursunuz.'
});
