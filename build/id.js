Auth0.registerLanguageDictionary('id', {
  error: {
    forgotPassword: {
      too_many_requests:
        'Anda telah mencapai batas upaya perubahan kata sandi. Harap tunggu sebelum mencoba lagi.',
      'lock.fallback': 'Maaf, terjadi kesalahan saat meminta perubahan kata sandi.',
      enterprise_email:
        'Domain email Anda adalah bagian dari penyedia identitas Perusahaan. Untuk mengatur ulang kata sandi, harap lihat administrator keamanan Anda.'
    },
    login: {
      blocked_user: 'Pengguna diblokir.',
      invalid_user_password: 'Kredensial salah.',
      'lock.fallback': 'Maaf, terjadi kesalahan saat berusaha untuk masuk log.',
      'lock.invalid_code': 'Kode salah.',
      'lock.invalid_email_password': 'Email atau kata sandi salah.',
      'lock.invalid_username_password': 'Nama pengguna atau kata sandi salah.',
      'lock.network':
        'Kami tidak dapat menjangkau server. Harap periksa koneksi internet Anda dan coba lagi.',
      'lock.popup_closed': 'Jendela sembul ditutup. Coba lagi.',
      'lock.unauthorized': 'Izin tidak diberikan. Coba lagi.',
      'lock.mfa_registration_required':
        'Autentikasi multifaktor diperlukan tetapi perangkat Anda tidak terdaftar. Harap daftarkan perangkat sebelum melanjutkan.',
      'lock.mfa_invalid_code': 'Kode salah. Harap coba lagi.',
      password_change_required:
        'Anda harus memperbarui kata sandi karena ini pertama kali Anda masuk log, atau karena kata sandi Anda kedaluwarsa.',
      password_leaked:
        'Kami telah mendeteksi adanya masalah keamanan dengan akun ini. Untuk melindungi akun Anda, kami telah memblokir log ini. Email telah dikirimkan disertai instruksi untuk mengurungkan blokir akun Anda.',
      too_many_attempts: 'Akun Anda telah diblokir setelah mencoba masuk log berulang-ulang.',
      session_missing:
        'Tidak bisa menyelesaikan permintaan autentikasi Anda. Harap coba lagi setelah menutup semua dialog yang terbuka.',
      'hrd.not_matching_email': 'Harap gunakan email perusahaan Anda untuk masuk log.'
    },
    passwordless: {
      'bad.email': 'Email ini tidak valid.',
      'bad.phone_number': 'Nomor telepon tidak valid.',
      'lock.fallback': 'Maaf, terjadi kesalahan'
    },
    signUp: {
      invalid_password: 'Kata sandi tidak valid.',
      'lock.fallback': 'Maaf, terjadi kesalahan saat mencoba mendaftar.',
      password_dictionary_error: 'Kata sandi terlalu umum.',
      password_no_user_info_error: 'Kata sandi didasarkan pada informasi pengguna.',
      password_strength_error: 'Kata sandi terlalu lemah.',
      user_exists: 'Pengguna sudah ada.',
      username_exists: 'Nama pengguna sudah ada.'
    }
  },
  success: {
    logIn: 'Terima kasih sudah masuk log.',
    forgotPassword: 'Kami baru saja mengirimi Anda email untuk mengatur ulang kata sandi Anda.',
    magicLink: 'Kami mengirimi Anda tautan untuk masuk log dalam<br />hingga %s.',
    signUp: 'Terima kasih sudah mendaftar.'
  },
  blankErrorHint: 'Wajib diisi',
  codeInputPlaceholder: 'kode Anda',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'atau',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'atau',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Masuk log dengan kredensial perusahaan Anda.',
  enterpriseActiveLoginInstructions: 'Harap masukkan kredensial perusahaan pada %s.',
  failedLabel: 'Gagal!',
  forgotPasswordTitle: 'Atur ulang kata sandi Anda',
  forgotPasswordAction: 'Tidak ingat kata sandi Anda?',
  forgotPasswordInstructions:
    'Harap masukkan alamat email Anda. Kami akan mengirimi Anda email untuk mengatur ulang kata sandi Anda.',
  forgotPasswordSubmitLabel: 'Kirim email',
  invalidErrorHint: 'Tidak valid',
  lastLoginInstructions: 'Terakhir kali Anda masuk log dengan',
  loginAtLabel: 'Masuk log pada %s',
  loginLabel: 'Masuk log',
  loginSubmitLabel: 'Masuk log',
  loginWithLabel: 'Masuk log dengan %s',
  notYourAccountAction: 'Bukan akun Anda?',
  passwordInputPlaceholder: 'kata sandi Anda',
  passwordStrength: {
    containsAtLeast: 'Berisi setidaknya %d dari %d jenis karakter:',
    identicalChars:
      'Tidak boleh lebih dari %d karakter identik dalam satu baris (mis. "%s" tidak diizinkan)',
    nonEmpty: 'Kata sandi wajib diisi',
    numbers: 'Angka (yaitu: 0-9)',
    lengthAtLeast: 'Panjang setidaknya %d karakter',
    lowerCase: 'Huruf kecil (a-z)',
    shouldContain: 'Harus berisi:',
    specialCharacters: 'Karakter khusus (mis. !@#$%^&*)',
    upperCase: 'Huruf kapital (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Atau, masukkan email Anda untuk masuk<br/>atau buat akun',
  passwordlessEmailCodeInstructions: 'Email dengan kode telah dikirimkan ke %s.',
  passwordlessEmailInstructions: 'Masukkan email Anda untuk masuk<br/>atau buat akun',
  passwordlessSMSAlternativeInstructions:
    'Atau, masukkan nomor telepon Anda untuk masuk<br/>atau buat akun',
  passwordlessSMSCodeInstructions: 'SMS dengan kode telah dikirimkan<br/>ke %s.',
  passwordlessSMSInstructions: 'Masukkan nomor telepon Anda untuk masuk<br/>atau buat akun',
  phoneNumberInputPlaceholder: 'nomor telepon Anda',
  resendCodeAction: 'Tidak mendapatkan kodenya?',
  resendLabel: 'Kirim ulang',
  resendingLabel: 'Mengirim ulang ...',
  retryLabel: 'Coba ulang',
  sentLabel: 'Terkirim!',
  showPassword: 'Tampilkan kata sandi',
  signUpTitle: 'Daftar',
  signUpLabel: 'Daftar',
  signUpSubmitLabel: 'Daftar',
  signUpTerms: 'Dengan mendaftar, Anda setuju dengan syarat layanan dan kebijakan privasi kami.',
  signUpWithLabel: 'Daftar dengan %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Sign-On Tunggal diaktifkan',
  submitLabel: 'Kirim',
  unrecoverableError: 'Terjadi kesalahan.<br />Harap hubungi staf teknis.',
  usernameFormatErrorHint: 'Gunakan huruf %d-%d, angka, dan karakter berikut: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'nama pengguna Anda',
  usernameOrEmailInputPlaceholder: 'nama pengguna/email',
  title: 'Auth0',
  welcome: 'Selamat datang %s!',
  windowsAuthInstructions: 'Anda terhubung dari jaringan &hellip; perusahaan Anda',
  windowsAuthLabel: 'Autentikasi Windows',
  mfaInputPlaceholder: 'Kode',
  mfaLoginTitle: 'Verifikasi 2 Langkah',
  mfaLoginInstructions:
    'Harap masukkan kode verifikasi yang dihasilkan oleh aplikasi seluler Anda.',
  mfaSubmitLabel: 'Masuk log',
  mfaCodeErrorHint: 'Gunakan %d angka'
});
