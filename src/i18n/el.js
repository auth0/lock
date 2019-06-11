// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Έχετε υπερβεί το όριο προσπαθειών αλλαγής κωδικού πρόσβασης. Παρακαλούμε περιμένετε πριν ξαναπροσπαθήσετε.',
      'lock.fallback':
        'Λυπούμαστε, ανεπιτυχής έκβαση. Κάτι πήγε στραβά κατά την επεξεργασία του αιτήματος.',
      enterprise_email:
        'Το domain του email σας ανήκει σε επιχείρηση. Για να αντικαταστήσετε τον κωδικό πρόσβασής σας, ζητήστε το από τον υπεύθυνο διαχειριστή.'
    },
    login: {
      blocked_user: 'Ο λογαριασμός σας δεν έχει πρόσβαση.',
      invalid_user_password: 'Μη αποδεκτά διαπιστευτήρια.',
      'lock.fallback': 'Λυπούμαστε, ξαναπροσπαθήστε.',
      'lock.invalid_code': 'Λάθος κωδικός.',
      'lock.invalid_email_password': 'Λάθος email ή κωδικός πρόσβασης.',
      'lock.invalid_username_password': 'Λάθος όνομα χρήστη ή κωδικός πρόσβασης.',
      'lock.network':
        'Αδυναμία επικοινωνίας με τον διακομιστή. Ελέγξτε τη σύνδεση σας και δοκιμάστε ξανά.',
      'lock.popup_closed': 'Το αναδυόμενο παράθυρο έκλεισε. Προσπαθήστε ξανά.',
      'lock.unauthorized': 'Απορρίφτηκε. Προσπάθησε ξανά.',
      'lock.mfa_registration_required':
        'Απαιτείται ταυτοποίηση δύο βημάτων. Παρακαλούμε κατοχυρώστε την συσκευή σας πριν συνεχίσετε.',
      'lock.mfa_invalid_code': 'Λάθος κωδικός. Παρακαλώ προσπαθήστε ξανά.',
      password_change_required:
        'Πρέπει να αντικαταστήσετε τον κωδικό πρόσβασής σας, επειδή συνδέεστε για πρώτη φορά ή ο κωδικός σας έχει λήξει.',
      password_leaked:
        'Εντοπίσαμε πιθανό πρόβλημα ασφαλείας στον λογαριασμό σας. Για να τον προστατεύσουμε, τον απενεργοποιήσαμε. Αποστείλαμε email με οδηγίες επανενεργοποίησης',
      too_many_attempts:
        'Ο λογαριασμός σας έχει απενεργοποιηθεί λόγω υπέρβασης του ορίου επιτρεπόμενων προσπαθειών σύνδεσης.',
      session_missing:
        'Δεν ήταν δυνατή η ολοκλήρωση του αιτήματος επαλήθευσης ταυτότητας. Δοκιμάστε ξανά μετά το κλείσιμο όλων των ανοιχτών παραθύρων διαλόγου',
      'hrd.not_matching_email': 'Παρακαλώ χρησιμοποιήστε το εταιρικό σας email για να συνδεθείτε.',
      too_many_requests:
        'Λυπόμαστε. Υπάρχουν πολλά αιτήματα τώρα. Επαναλάβετε τη φόρτωση της σελίδας και προσπαθήστε ξανά. Αν αυτό παραμείνει, δοκιμάστε ξανά αργότερα.'
    },
    passwordless: {
      'bad.email': 'Το email δεν είναι έγκυρο',
      'bad.phone_number': 'Ο αριθμός τηλεφώνου δεν είναι έγκυρος',
      'lock.fallback': 'Λυπούμαστε, κάτι πήγε στραβά'
    },
    signUp: {
      invalid_password: 'Ο κωδικός δεν είναι έγκυρος.',
      'lock.fallback': 'Λυπούμαστε, κάτι πήγε στραβά κατά την προσπάθεια εγγραφής.',
      password_dictionary_error: 'Ο κωδικός πρόσβασης είναι πολύ συνηθισμένος.',
      password_no_user_info_error: 'Ο κωδικός πρόσβασης βασίζεται σε προσωπικά σας στοιχεία.',
      password_strength_error: 'Ο κωδικός πρόσβασης είναι πολύ προβλέψιμος.',
      user_exists: 'Ο λογαριασμός υπάρχει ήδη.',
      username_exists: 'Το όνομα χρήστη υπάρχει ήδη.'
    }
  },
  success: {
    logIn: 'Ευχαριστούμε που συνδεθήκατε.',
    forgotPassword: 'Μόλις σας στείλαμε email για να αντικαταστήσετε τον κωδικό σας.',
    magicLink: 'Σας στείλαμε ένα σύνδεσμο για να συνδεθείτε στο <br />%s.',
    signUp: 'Σας ευχαριστούμε για την εγγραφή σας.'
  },
  blankErrorHint: 'Δεν μπορεί μείνει κενό',
  codeInputPlaceholder: 'ο κωδικός σας',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ή',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ή',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Συνδεθείτε με τα εταιρικά σας στοιχεία.',
  enterpriseActiveLoginInstructions: 'Παρακαλώ εισάγετε τα εταιρικά σας στοιχεία στη διεύθυνση %s.',
  failedLabel: 'Απέτυχε!',
  forgotPasswordTitle: 'Αντικατάσταση κωδικού',
  forgotPasswordAction: 'Ξεχάσατε τον κωδικό πρόσβασης;',
  forgotPasswordInstructions:
    'Παρακαλώ εισάγετε το email σας και θα σας στείλουμε email για να αντικαταστήσετε τον κωδικό σας.',
  forgotPasswordSubmitLabel: 'Αποστολή email',
  invalidErrorHint: 'Μη έγκυρο',
  lastLoginInstructions: 'Η τελευταία συνδεσή σας έγινε με',
  loginAtLabel: 'Συνδεθείτε στο %s',
  loginLabel: 'Σύνδεση',
  loginSubmitLabel: 'Σύνδεση',
  loginWithLabel: 'Συνδεθείτε με %s',
  notYourAccountAction: 'Δεν είναι ο λογαριασμός σας;',
  passwordInputPlaceholder: 'ο κωδικός σας',
  passwordStrength: {
    containsAtLeast:
      'Πρέπει να περιέχει τουλάχιστον %d τύπους από τις ακόλουθες %d κατηγορίες χαρακτήρων:',
    identicalChars:
      'Δεν επιτρέπονται περισσότεροι από %d ίδιοι χαρακτήρες συνεχόμενα (π.χ. δεν επιτρέπεται %s)',
    nonEmpty: 'Απαιτείται συμπλήρωση',
    numbers: 'Αριθμοί (0-9)',
    lengthAtLeast: 'Τουλάχιστον %d χαρακτήρες',
    lowerCase: 'Μικρά Λατινικά (a-z)',
    shouldContain: 'Πρέπει να περιέχει:',
    specialCharacters: 'Σύμβολα (π.χ. !@#$%^&*)',
    upperCase: 'Kεφαλαία Λατινικά (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Διαφορετικά, για να συνδεθείτε εισάγετε το email σας <br/> ή δημιουργήστε έναν λογαριασμό',
  passwordlessEmailCodeInstructions: 'Εmail με τον κωδικό πρόσβασης έχει σταλεί στο %s.',
  passwordlessEmailInstructions:
    'Για να συνδεθείτε εισάγετε το email σας <br/> ή δημιουργήστε έναν λογαριασμό',
  passwordlessSMSAlternativeInstructions:
    'Διαφορετικά, για να συνδεθείτε εισάγετε τοv αριθμό κινητού σας <br/> ή δημιουργήστε έναν λογαριασμό',
  passwordlessSMSCodeInstructions: 'Ένα SMS με τον κωδικό σας έχει σταλθεί στο:<br/> %s.',
  passwordlessSMSInstructions:
    'Για να συνδεθείτε εισάγετε τοv αριθμό κινητού σας <br/> ή δημιουργήστε έναν λογαριασμό',
  phoneNumberInputPlaceholder: 'το κινητό σας',
  resendCodeAction: 'Δεν λάβατε τον κωδικό;',
  resendLabel: 'Αποστολή ξανά',
  resendingLabel: 'Επαναποστολή...',
  retryLabel: 'Δοκιμάστε ξανά',
  sentLabel: 'Αποστάλθηκε!',
  showPassword: 'Εμφάνιση κωδικού',
  signUpTitle: 'Εγγραφή',
  signUpLabel: 'Εγγραφή',
  signUpSubmitLabel: 'Εγγραφή',
  signUpTerms:
    'Με την εγγραφή σας, συμφωνείτε με τους όρους παροχής υπηρεσιών και την πολιτική απορρήτου.',
  signUpWithLabel: 'Εγγραφείτε με %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Ενεργοποίηση ενιαίας σύνδεσης',
  submitLabel: 'Υποβολή',
  unrecoverableError: 'Κάτι πήγε στραβά.<br /> Επικοινωνήστε με την τεχνική υποστήριξη.',
  usernameFormatErrorHint:
    'Επιλέξτε: 1) αριθμούς 2) από τα γράμματα %d-%d 3) από τους ακόλουθους χαρακτήρες: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'όνομα χρήστη',
  usernameOrEmailInputPlaceholder: 'όνομα χρήστη ή email',
  title: 'Auth0',
  welcome: 'Kαλωσήρθατε %s!',
  windowsAuthInstructions: 'Είστε συνδεδεμένοι από το εταιρικό σας δίκτυο &hellip;',
  windowsAuthLabel: 'Windows Authentication',
  mfaInputPlaceholder: 'Κωδικός',
  mfaLoginTitle: 'Ταυτοποίηση σε δύο βήματα',
  mfaLoginInstructions:
    'Εισάγετε τον κωδικό επαλήθευσης που δημιούργησε η εφαρμογή του κινητού σας.',
  mfaSubmitLabel: 'Σύνδεση',
  mfaCodeErrorHint: 'Χρησιμοποιήστε %d αριθμούς'
};
