export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Anda telah mencapai had percubaan penukaran kata laluan. Sila tunggu sebelum mencuba lagi.',
      'lock.fallback': "Harap maaf, sesuatu berlaku semasa meminta penukaran kata laluan.",
      enterprise_email:
        "Domain e-mel anda merupakan sebahagian daripada penyedia identiti Perusahaan. Untuk menetapkan semula kata laluan anda, sila berjumpa dengan pentadbir keselamatan anda."
    },
    login: {
      blocked_user: 'Pengguna ini disekat.',
      invalid_user_password: 'Kelayakan tidak betul.',
      'lock.fallback': "Harap maaf, sesuatu berlaku semasa cuba untuk log masuk.",
      'lock.invalid_code': 'Kod tidak betul.',
      'lock.invalid_email_password': 'E-mel atau kata laluan tidak betul.',
      'lock.invalid_username_password': 'Nama pengguna atau kata laluan tidak betul.',
      'lock.network': 'Kami tidak dapat mencapai pelayan. Sila periksa sambungan anda dan cuba lagi.',
      'lock.popup_closed': 'Tetingkap timbul ditutup. Cuba lagi.',
      'lock.unauthorized': 'Keizinan tidak diberikan. Cuba lagi.',
      'lock.mfa_registration_required':
        'Pengesahan berbilang faktor diperlukan tetapi peranti anda tidak didaftarkan. Sila daftarkannya sebelum meneruskan.',
      'lock.mfa_invalid_code': 'Kod tidak betul. Sila cuba lagi.',
      password_change_required:
        'Anda perlu mengemas kini kata laluan anda kerana ini merupakan kali pertama anda mengelog masuk, atau kerana kata laluan anda telah tamat tempoh.', // TODO: verify error code
      password_leaked:
        'Kami telah mengesan isu keselamatan yang berpotensi dengan akaun ini. Untuk melindungi akaun anda, kami telah menyekat log masuk ini. E-mel dengan arahan tentang cara membuka sekatan akaun anda telah dihantar.',
      too_many_attempts: 'Akaun anda telah disekat selepas berbilang percubaan log masuk yang berturut-turut.',
      session_missing:
        "Tidak dapat menyelesaikan permintaan pengesahan anda. Sila cuba lagi selepas menutup semua dialog yang terbuka",
      'hrd.not_matching_email': 'Sila gunakan e-mel korporat anda untuk log masuk.'
    },
    passwordless: {
      'bad.email': 'E-mel ini tidak sah',
      'bad.phone_number': 'Nombor telefon tidak sah',
      'lock.fallback': "Harap maaf, sesuatu berlaku"
    },
    signUp: {
      invalid_password: 'Kata laluan tidak sah.',
      'lock.fallback': "Harap maaf, sesuatu berlaku semasa cuba untuk mendaftar.",
      password_dictionary_error: 'Kata laluan terlalu biasa.',
      password_no_user_info_error: 'Kata laluan adalah berdasarkan maklumat pengguna.',
      password_strength_error: 'Kata laluan terlalu lemah.',
      user_exists: 'Pengguna ini sudah wujud.',
      username_exists: 'Nama pengguna ini sudah wujud.'
    }
  },
  success: {
    // success messages show above the form or in a confirmation pane
    logIn: 'Terima kasih kerana mengelog masuk.',
    forgotPassword: "Kami baru saja menghantar e-mel kepada anda untuk menetapkan semula kata laluan anda.",
    magicLink: 'Kami telah menghantar pautan untuk log masuk<br />kepada %s.',
    signUp: 'Terima kasih kerana mendaftar.'
  },
  blankErrorHint: "Tidak boleh kosong",
  codeInputPlaceholder: 'kod anda',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'atau',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'atau',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Log masuk dengan kelayakan korporat anda.',
  enterpriseActiveLoginInstructions: 'Sila masukkan kelayakan korporat anda di %s.',
  failedLabel: 'Gagal!',
  forgotPasswordTitle: 'Tetapkan semula kata laluan anda',
  forgotPasswordAction: "Tidak ingat kata laluan anda?",
  forgotPasswordInstructions:
    'Sila masukkan alamat e-mel anda. Kami akan menghantar e-mel kepada anda untuk menetapkan semula kata laluan anda.',
  forgotPasswordSubmitLabel: 'Hantar e-mel',
  invalidErrorHint: 'Tidak sah',
  lastLoginInstructions: 'Kali terakhir anda log masuk dengan',
  loginAtLabel: 'Log masuk di %s',
  loginLabel: 'Log Masuk',
  loginSubmitLabel: 'Log Masuk',
  loginWithLabel: 'Log masuk dengan %s',
  notYourAccountAction: 'Bukan akaun anda?',
  passwordInputPlaceholder: 'kata laluan anda',
  passwordStrength: {
    containsAtLeast: 'Mengandungi sekurang-kurangnya %d daripada %d jenis aksara berikut:',
    identicalChars: 'Tidak lebih daripada %d aksara yang serupa berturut-turut (cth."%s" tidak dibenarkan)',
    nonEmpty: 'Kata laluan bukan kosong diperlukan',
    numbers: 'Angka (iaitu 0-9)',
    lengthAtLeast: 'Sekurang-kurangnya sepanjang %d aksara',
    lowerCase: 'Abjad huruf kecil (a-z)',
    shouldContain: 'Harus mengandungi:',
    specialCharacters: 'Aksara khas (cth. !@#$%^&*)',
    upperCase: 'Abjad huruf besar (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Jika tidak, masukkan e-mel anda untuk log masuk<br/>atau mencipta akaun',
  passwordlessEmailCodeInstructions: 'E-mel dengan kod telah dihantar ke %s.',
  passwordlessEmailInstructions: 'Masukkan e-mel anda untuk log masuk<br/>atau mencipta akaun',
  passwordlessSMSAlternativeInstructions:
    'Jika tidak, masukkan nombor telefon anda untuk log masuk<br/>atau mencipta akaun',
  passwordlessSMSCodeInstructions: 'SMS dengan kod telah dihantar<br/>ke %s.',
  passwordlessSMSInstructions: 'Masukkan nombor telefon anda untuk log masuk<br/>atau mencipta akaun',
  phoneNumberInputPlaceholder: 'nombor telefon anda',
  resendCodeAction: 'Tidak menerima kod?',
  resendLabel: 'Hantar semula',
  resendingLabel: 'Menghantar semula...',
  retryLabel: 'Cuba semula',
  sentLabel: 'Dihantar!',
  showPassword: 'Tunjukkan kata laluan',
  signUpTitle: 'Daftar',
  signUpLabel: 'Daftar',
  signUpSubmitLabel: 'Daftar',
  signUpTerms: 'Dengan mendaftar, anda bersetuju dengan terma perkhidmatan dan dasar privasi kami.',
  signUpWithLabel: 'Daftar dengan %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Log Masuk Sekali didayakan',
  submitLabel: 'Serah',
  unrecoverableError: 'Sesuatu berlaku.<br />Sila hubungi sokongan teknikal.',
  usernameFormatErrorHint:
    'Gunakan %d-%d huruf, angka dan aksara berikut: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'nama pengguna anda',
  usernameOrEmailInputPlaceholder: 'nama pengguna/e-mel',
  title: 'Auth0',
  welcome: 'Selamat datang %s!',
  windowsAuthInstructions: 'Anda bersambung dari rangkaian korporat anda&hellip;',
  windowsAuthLabel: 'Pengesahan Windows',
  mfaInputPlaceholder: 'Kod',
  mfaLoginTitle: 'Pengesahan 2 Langkah',
  mfaLoginInstructions: 'Sila masukkan kod pengesahan yang dijana oleh aplikasi mudah alih anda.',
  mfaSubmitLabel: 'Log Masuk',
  mfaCodeErrorHint: 'Gunakan %d angka'
};
