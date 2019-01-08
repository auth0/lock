export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Έχετε φτάσει το όριο στις προσπάθειες αλλαγής κωδικού πρόσβασης. Περιμένετε πριν προσπαθήσετε ξανά.',
      'lock.fallback':
        'Λυπούμαστε, κάτι πήγε στραβά όταν ζητήσατε την αλλαγή του κωδικού πρόσβασης.',
      enterprise_email:
        'Ο τομέας του email σας είναι μέρος ενός επιχειρηματικού παρόχου ταυτοποίησης. Για να επαναφέρετε τον κωδικό πρόσβασής σας, ζητήστε το από τον διαχειριστή ασφαλείας.'
    },
    login: {
      blocked_user: 'Ο χρήστης είναι αποκλεισμένος.',
      invalid_user_password: 'Λανθασμένα στοιχεία σύνδεσης.',
      'lock.fallback': 'Λυπούμαστε, κάτι πήγε στραβά όταν επιχειρήσατε να συνδεθείτε.',
      'lock.invalid_code': 'Λάθος κωδικός.',
      'lock.invalid_email_password': 'Λάθος email ή κωδικός πρόσβασης.',
      'lock.invalid_username_password': 'Λάθος όνομα χρήστη ή κωδικός.',
      'lock.network':
        'Δεν μπορούμε να επικοινωνήσουμε με τον διακομιστή. Ελέγξτε τη σύνδεση σας και δοκιμάστε ξανά.',
      'lock.popup_closed': 'Το κουτί διαλόγου έκλεισε. Προσπαθήστε ξανά.',
      'lock.unauthorized': 'Δεν δόθηκαν δικαιώματα. Προσπάθησε ξανά.',
      'lock.mfa_registration_required':
        'Απαιτείται έλεγχος ταυτότητας πολλαπλών παραμέτρων, αλλά η συσκευή σας δεν είναι εγγεγραμμένη. Παρακαλούμε εγγραφείτε πριν προχωρήσετε.',
      'lock.mfa_invalid_code': 'Λάθος κωδικός. Παρακαλώ προσπάθησε ξανά.',
      password_change_required:
        'Πρέπει να ενημερώσετε τον κωδικό πρόσβασής σας, επειδή είτε είναι η πρώτη φορά που συνδέεστε ή ο κωδικός σας έχει λήξει.',
      password_leaked:
        'Εντοπίσαμε ένα πιθανό πρόβλημα ασφαλείας με τον λογαριασμό σας. Για να τον προστατεύσουμε, τον απενεργοποιήσαμε. Σας Στείλαμαι email με οδηγίες επανενεργοποίησης',
      too_many_attempts:
        'Ο λογαριασμός σας έχει απενεργοποιηθεί μετά από πολλαπλές προσπάθειες σύνδεσης.',
      session_missing:
        'Δεν ήταν δυνατή η ολοκλήρωση του αιτήματος επαλήθευσης ταυτότητας. Δοκιμάστε ξανά μετά το κλείσιμο όλων των ανοιχτών παραθύρων διαλόγου',
      'hrd.not_matching_email': 'Παρακαλώ χρησιμοποιήστε το εταιρικό σας email για να συνδεθείτε.'
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
      password_no_user_info_error: 'Ο κωδικός πρόσβασης βασίζεται σε πληροφορίες σας.',
      password_strength_error: 'Ο κωδικός πρόσβασης είναι πολύ αδύναμος.',
      user_exists: 'Ο χρήστης υπάρχει ήδη.',
      username_exists: 'Το όνομα χρήστη υπάρχει ήδη.'
    }
  },
  success: {
    logIn: 'Ευχαριστώ που συνδεθήκατε.',
    forgotPassword: 'Μόλις σας στείλαμε ένα email για να επαναφέρουμε τον κωδικό σας.',
    magicLink: 'Σας στείλαμε ένα σύνδεσμο για να συνδεθείτε <br /> στο %s.',
    signUp: 'Σας ευχαριστούμε για την εγγραφή σας.'
  },
  blankErrorHint: 'Δεν μπορεί να είναι κενό',
  codeInputPlaceholder: 'ο κωδικός σας',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ή',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ή',
  emailInputPlaceholder: 'yours@example.com',
  enterpriseLoginIntructions: 'Συνδεθείτε με τα εταιρικά σας στοιχεία.',
  enterpriseActiveLoginInstructions:
    'Παρακαλώ εισαγάγετε τα εταιρικά σας στοιχεία στη διεύθυνση %s.',
  failedLabel: 'Απέτυχε!',
  forgotPasswordTitle: 'Επαναφορά του κωδικού πρόσβασής σας',
  forgotPasswordAction: 'Δεν θυμάστε τον κωδικό πρόσβασής σας;',
  forgotPasswordInstructions:
    'Παρακαλώ εισάγετε τη διεύθυνση email σας. Θα σας στείλουμε ένα email για να επαναφέρετε τον κωδικό σας.',
  forgotPasswordSubmitLabel: 'Αποστολή email',
  invalidErrorHint: 'Μη έγκυρο',
  lastLoginInstructions: 'Την τελευταία φορά συνδεθήκατε με',
  loginAtLabel: 'Συνδεθείτε στο %s',
  loginLabel: 'Σύνδεση',
  loginSubmitLabel: 'Σύνδεση',
  loginWithLabel: 'Συνδέσου με %s',
  notYourAccountAction: 'Δεν είναι ο λογαριασμός σας;',
  passwordInputPlaceholder: 'ο κωδικός σας',
  passwordStrength: {
    containsAtLeast: 'Περιέχουν τουλάχιστον %d από τους ακόλουθους τύπους %d χαρακτήρων:',
    identicalChars:
      'Δεν επιτρέπονται περισσότερους από %d ίδιους χαρακτήρες συνεχόμενα (π.χ. %s δεν επιτρέπεται)',
    nonEmpty: 'Απαιτείται μη κενός κωδικός πρόσβασης',
    numbers: 'Αριθμοί (0-9)',
    lengthAtLeast: 'Τουλάχιστον %d χαρακτήρες σε μήκος',
    lowerCase: 'Μικρά γράμματα (a-z)',
    shouldContain: 'Πρέπει να περιέχει:',
    specialCharacters: 'Ειδικοί χαρακτήρες (π.χ. !@#$%^&*)',
    upperCase: 'Kεφαλαία γράμματα (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Διαφορετικά, εισάγετε το email σας για να συνδεθείτε <br/> ή δημιουργήστε ένα λογαριασμό',
  passwordlessEmailCodeInstructions: 'Ένα email με τον κωδικό πρόσβασης έχει σταλεί στο %s.',
  passwordlessEmailInstructions:
    'Εισαγάγετε το email σας για να συνδεθείτε <br/> ή δημιουργήστε ένα λογαριασμό',
  passwordlessSMSAlternativeInstructions:
    'Διαφορετικά, εισάγετε τοv αριθμό κινητού σας για να συνδεθείτε <br/> ή δημιουργήστε ένα λογαριασμό',
  passwordlessSMSCodeInstructions: 'Ένα μήνυμα SMS με τον κωδικό σας έχει σταλεί <br/> στο %s.',
  passwordlessSMSInstructions:
    'Εισαγάγετε τοv αριθμό κινητού σας για να συνδεθείτε <br/> ή δημιουργήστε ένα λογαριασμό',
  phoneNumberInputPlaceholder: 'τοv αριθμό κινητού σας',
  resendCodeAction: 'Δεν λάβατε τον κωδικό;',
  resendLabel: 'αποστολή ξανά',
  resendingLabel: 'Επαναποστολή...',
  retryLabel: 'Δοκιμάσετε ξανά',
  sentLabel: 'Αποστάλθηκε!',
  showPassword: 'Εμφάνιση κωδικού',
  signUpTitle: 'Εγγραφή',
  signUpLabel: 'Εγγραφή',
  signUpSubmitLabel: 'Εγγραφή',
  signUpTerms:
    'Με την εγγραφή σας, συμφωνείτε με τους όρους παροχής υπηρεσιών και την πολιτική απορρήτου.',
  signUpWithLabel: 'Εγγράψου με %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Ενεργοποίηση ενιαίας σύνδεσης',
  submitLabel: 'Υποβολή',
  unrecoverableError: 'Κάτι πήγε στραβά. <br /> Επικοινωνήστε με την τεχνική υποστήριξη.',
  usernameFormatErrorHint:
    'Χρησιμοποιήστε τα γράμματα %d-%d, αριθμούς και τους ακόλουθους χαρακτήρες: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'το όνομα χρήστη σας',
  usernameOrEmailInputPlaceholder: 'όνομα χρήστη / email',
  title: 'Auth0',
  welcome: 'καλώς ήρθατε %s!',
  windowsAuthInstructions: 'Είστε συνδεδεμένοι από το εταιρικό σας δίκτυο &hellip;',
  windowsAuthLabel: 'Windows Authentication',
  mfaInputPlaceholder: 'Κωδικός',
  mfaLoginTitle: 'Επαλήθευση με δύο βήματα',
  mfaLoginInstructions:
    'Εισαγάγετε τον κωδικό επαλήθευσης που δημιουργήθηκε από την εφαρμογή στο κινητό σας.',
  mfaSubmitLabel: 'Σύνδεση',
  mfaCodeErrorHint: 'Χρησιμοποιήστε %d αριθμούς'
};
