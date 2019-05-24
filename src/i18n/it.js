export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Hai raggiunto il limite di tentativi di modifica della password. Attendi prima di riprovare.',
      'lock.fallback':
        'Ci dispiace, qualcosa è andato storto durante la richiesta di modifica della password.',
      enterprise_email:
        "Il dominio della tua email fa parte di un provider di identità aziendale. Per reimpostare la password, consultare l'amministratore della sicurezza."
    },
    login: {
      blocked_user: "L'utente è bloccato.",
      invalid_user_password: 'Credenziali non corrette.',
      'lock.fallback': 'Ci dispiace, qualcosa è andato storto quando si tenta di accedere.',
      'lock.invalid_code': 'Codice errato.',
      'lock.invalid_email_password': 'Email o password sbagliata.',
      'lock.invalid_username_password': 'Nome utente o password sbagliata.',
      'lock.network':
        'Non siamo riusciti a raggiungere il server. Si prega di controllare la connessione e riprovare.',
      'lock.popup_closed': 'Finestra popup chiusa. Riprova per favore.',
      'lock.unauthorized': 'Autorizzazioni non concesse. Riprova per favore.',
      password_change_required:
        'È necessario aggiornare la password perché questo è il tuo primo login, o perché la password è scaduta.',
      password_leaked:
        "Questo accesso è stato bloccato perché la password è trapelata in un altro sito. Ti abbiamo inviato un'email con le istruzioni su come sbloccarla.",
      too_many_attempts:
        'Il suo account è stato bloccato dopo vari tentativi di accesso consecutivi.',
      'lock.mfa_registration_required':
        'Autenticazione a più fattori richiesta, ma il dispositivo non è abilitato. Si prega di iscriversi prima di passare.',
      'lock.mfa_invalid_code': 'Codice errato. Riprova.',
      session_missing:
        'Impossibile completare la richiesta di autenticazione. Riprova dopo aver chiuso tutte le finestre di dialogo aperte',
      'hrd.not_matching_email':
        'Si prega di utilizzare la posta elettronica aziendale per effettuare il login.',
      too_many_requests:
        'Ci dispiace. Ci sono troppe richieste in questo momento. Si prega di ricaricare la pagina e riprovare. Se persiste, riprova più tardi.'
    },
    passwordless: {
      'bad.email': "L'email non è valida",
      'bad.phone_number': 'Il numero di telefono non è valido',
      'lock.fallback': 'Ci dispiace, qualcosa è andato storto'
    },
    signUp: {
      invalid_password: 'La password non è valida.',
      'lock.fallback': "Ci dispiace, qualcosa è andato storto quando si tenta l'iscrizione.",
      password_dictionary_error: 'La password è troppo comune.',
      password_no_user_info_error: "La password si basa sulle informazioni dell'utente.",
      password_strength_error: 'La password è troppo debole.',
      user_exists: "L'utente esiste già.",
      username_exists: 'Il nome utente esiste già.'
    }
  },
  success: {
    logIn: 'Login effettuato con successo.',
    forgotPassword: "Abbiamo appena inviato un'email per reimpostare la password.",
    magicLink: 'Abbiamo inviato un link per il login<br />a %s.',
    signUp: 'Grazie per esserti iscritto.'
  },
  blankErrorHint: 'Non può essere vuoto',
  codeInputPlaceholder: 'il tuo codice',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'o',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'o',
  emailInputPlaceholder: 'email@esempio.com',
  enterpriseLoginIntructions: 'Effettuare il login con le credenziali aziendali.',
  enterpriseActiveLoginInstructions: 'Si prega di inserire le credenziali aziendali a  %s.',
  failedLabel: 'Fallito!',
  forgotPasswordAction: 'Non ricordi la password?',
  forgotPasswordInstructions:
    "Inserisci il tuo indirizzo email. Ti invieremo un'email per reimpostare la password.",
  forgotPasswordSubmitLabel: "Inviare l'email",
  invalidErrorHint: 'Non valido',
  lastLoginInstructions: "L'ultima volta hai effettuato l’accesso con",
  loginAtLabel: 'Accedere a %s',
  loginLabel: 'Accesso',
  loginSubmitLabel: 'Accesso',
  loginWithLabel: 'Accedi con %s',
  notYourAccountAction: 'Non è il tuo account?',
  passwordInputPlaceholder: 'la tua password',
  passwordStrength: {
    containsAtLeast: 'Essa deve contenere almeno %d dei seguenti %d tipi di caratteri:',
    identicalChars: 'Non più di %d caratteri identici in una fila (e.g., "%s" non autorizzato)',
    nonEmpty: "E' richiesta una password non vuota",
    numbers: 'Numeri (i.e. 0-9)',
    lengthAtLeast: 'Almeno %d caratteri di lunghezza',
    lowerCase: 'Lettere minuscole (a-z)',
    shouldContain: 'Dovrebbe contenere:',
    specialCharacters: 'Caratteri speciali (e.g. !@#$%^&*)',
    upperCase: 'Caratteri maiuscoli (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    "Altrimenti, si prega di inserire l'email per accedere<br/>o creare un account",
  passwordlessEmailCodeInstructions: "Un'email con il codice è stata inviata a %s.",
  passwordlessEmailInstructions: "Si prega di inserire l'email<br/>o creare un account",
  passwordlessSMSAlternativeInstructions:
    'Altrimenti, si prega d’inserire il numero di telefono per accedere<br/>o creare un account',
  passwordlessSMSCodeInstructions: 'Un SMS con il codice è stato inviato<br/>a %s.',
  passwordlessSMSInstructions: 'Si prega di inserire il numero di telefono<br/>o creare un account',
  phoneNumberInputPlaceholder: 'il tuo numero di telefono',
  resendCodeAction: 'Non hai ottenuto il codice?',
  resendLabel: 'Inviare di nuovo',
  resendingLabel: 'Reinvio...',
  retryLabel: 'Riprovare per favore',
  sentLabel: 'Inviato!',
  signUpLabel: 'Registrati',
  signUpSubmitLabel: 'Registrati',
  signUpWithLabel: 'Registrati con %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On abilitato',
  submitLabel: 'Invia',
  unrecoverableError: 'Qualcosa è andato storto.<br />Si prega di contattare il supporto tecnico.',
  usernameFormatErrorHint: 'Usa %d-%d lettere, numeri e i seguenti caratteri: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'Nome utente',
  usernameOrEmailInputPlaceholder: 'Nome utente o email',
  title: 'Auth0',
  welcome: 'Benvenuto %s!',
  windowsAuthInstructions: 'Si è connessi dalla rete aziendale&hellip;',
  windowsAuthLabel: 'Autenticazione Windows',
  forgotPasswordTitle: 'Reimposta la tua password',
  signUpTitle: 'Registrati',
  mfaInputPlaceholder: 'Codice',
  mfaLoginTitle: '2-fase di verifica',
  mfaLoginInstructions:
    'Si prega di inserire il codice di verifica generato dalla tua applicazione mobile.',
  mfaSubmitLabel: 'Accedere',
  mfaCodeErrorHint: 'Usare %d numeri',
  showPassword: 'Mostra password',
  signUpTerms: "Iscrivendoti, accetti i nostri termini di servizio e l'informativa sulla privacy."
};
