export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Foi atingido o limite de tentativas de alteração da palavra-passe. Aguarde antes de tentar novamente.',
      'lock.fallback': 'Lamentamos, ocorreu um problema ao solicitar a alteração da palavra-passe.',
      enterprise_email:
        'O domínio do seu endereço eletrónico é parte de um fornecedor de identidade empresarial. Para repor a sua palavra-passe, consulte o seu administrador de segurança.'
    },
    login: {
      blocked_user: 'O usuário está bloqueado.',
      invalid_user_password: 'Credenciais erradas.',
      'lock.fallback': 'Lamentamos, ocorreu um problema ao tentar iniciar sessão.',
      'lock.invalid_code': 'Código errado.',
      'lock.invalid_email_password': 'Endereço de correio eletrónico ou palavra-passe errados.',
      'lock.invalid_username_password': 'Nome de usuário ou palavra-passe errados.',
      'lock.network':
        'Não foi possível comunicar com o servidor Verifique a sua ligação e tente novamente.',
      'lock.popup_closed': 'Janela instantânea fechada. Tente novamente.',
      'lock.unauthorized': 'As permissões não foram concedidas. Tente novamente.',
      password_change_required:
        'Tem de atualizar a sua palavra-passe porque é a primeira vez que está a iniciar sessão ou porque a palavra-passe expirou.',
      password_leaked:
        'Foi detetado um possível problema de segurança nesta conta. Para proteger a sua conta, o início de sessão foi bloqueado. Foi enviada uma mensagem eletrónica com instruções sobre como desbloquear a conta.',
      too_many_attempts:
        'A sua conta foi bloqueada após várias tentativas sucessivas de início de sessão.',
      'lock.mfa_registration_required':
        'É necessária a autenticação multifator, mas o seu dispositivo não está inscrito. Inscreva-o antes de avançar.',
      'lock.mfa_invalid_code': 'Código errado. Tente novamente.',
      session_missing:
        'Não foi possível concluir o seu pedido de autenticação. Tente novamente após ter fechado todas as caixas de diálogo abertas',
      'hrd.not_matching_email':
        'Utilize o seu endereço de correio eletrónico empresarial para iniciar sessão.',
      too_many_requests:
        'Nós lamentamos. Existem muitos pedidos agora. Por favor, recarregue a página e tente denovo. Se isso persistir, tente novamente mais tarde.'
    },
    passwordless: {
      'bad.email': 'O endereço de correio eletrónico é inválido',
      'bad.phone_number': 'O número de telefone é inválido',
      'lock.fallback': 'Lamentamos, correu um erro.'
    },
    signUp: {
      invalid_password: 'Palavra-passe inválida.',
      'lock.fallback': 'Lamentamos, ocorreu um problema ao tentar registar-se.',
      password_dictionary_error: 'Palavra-passe demasiado simples.',
      password_no_user_info_error: 'Palavra-passe baseada nos dados do usuário.',
      password_strength_error: 'Palavra-passe demasiado fraca.',
      user_exists: 'O usuário já existe.',
      username_exists: 'O nome de usuário já existe.'
    }
  },
  success: {
    logIn: 'Obrigado por ter iniciado sessão.',
    forgotPassword: 'Foi-lhe enviada uma mensagem eletrónica para repor a palavra-passe.',
    magicLink: 'Foi-lhe enviada uma para iniciar sessão<br />em %s.',
    signUp: 'Obrigado por se registar.'
  },
  blankErrorHint: 'Não pode ficar em branco',
  codeInputPlaceholder: 'o seu código',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ou',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ou',
  emailInputPlaceholder: 'seu@exemplo.com',
  enterpriseLoginIntructions: 'Entre com as suas credenciais empresariais.',
  enterpriseActiveLoginInstructions: 'Introduza as suas credenciais empresariais em %s.',
  failedLabel: 'Falha!',
  forgotPasswordAction: 'Esqueceu-se da palavra-passe?',
  forgotPasswordInstructions:
    'Introduza o seu endereço de correio eletrónico. Enviar-lhe-emos uma mensagem eletrónica para repor a palavra-passe.',
  forgotPasswordSubmitLabel: 'Enviar correio eletrónico',
  invalidErrorHint: 'Inválido',
  lastLoginInstructions: 'Da última vez iniciou sessão com',
  loginAtLabel: 'Iniciar sessão em %s',
  loginLabel: 'Iniciar sessão',
  loginSubmitLabel: 'Iniciar sessão',
  loginWithLabel: 'Iniciar sessão com %s',
  notYourAccountAction: 'Não é a sua conta?',
  passwordInputPlaceholder: 'a sua palavra-passe',
  passwordStrength: {
    containsAtLeast: 'Contém no mínimo %d dos seguintes %d tipos de caracteres:',
    identicalChars:
      'Não mais do que %d caracteres idênticos consecutivos (por ex., "%s" não é permitido)',
    nonEmpty: 'A palavra-passe não pode ficar em branco',
    numbers: 'Números (ou seja, 0-9)',
    lengthAtLeast: 'No mínimo, %d caracteres',
    lowerCase: 'Letras minúsculas (a-z)',
    shouldContain: 'Deve conter:',
    specialCharacters: 'Caracteres especiais (ex., !@#$%^&*)',
    upperCase: 'Letras maiúsculas (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Caso contrário, introduza o seu endereço de correio eletrónico para iniciar sessão<br/>ou criar uma conta',
  passwordlessEmailCodeInstructions: 'Foi enviada uma mensagem eletrónica com o código para %s.',
  passwordlessEmailInstructions:
    'Introduza o seu endereço de correio eletrónico para iniciar sessão<br/>ou criar uma conta',
  passwordlessSMSAlternativeInstructions:
    'Caso contrário, introduza o seu número de telefone para iniciar sessão<br/>ou criar uma conta',
  passwordlessSMSCodeInstructions: 'Foi enviada mensagem por SMS com o código<br/>para %s.',
  passwordlessSMSInstructions:
    'Introduza o seu número de telefone para iniciar sessão<br/>ou criar uma conta',
  phoneNumberInputPlaceholder: 'o seu número de telefone',
  resendCodeAction: 'Não recebeu o código?',
  resendLabel: 'Reenviar',
  resendingLabel: 'A reenviar...',
  retryLabel: 'Tentar novamente',
  sentLabel: 'Enviado!',
  signUpLabel: 'Registar-se',
  signUpSubmitLabel: 'Registar-se',
  signUpWithLabel: 'Registar-se com %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Início de sessão único ativado',
  submitLabel: 'Enviar',
  unrecoverableError: 'Ocorreu um erro.<br />Contacte a assistência técnica.',
  usernameFormatErrorHint: '_", ".", "+", "-"',
  usernameInputPlaceholder: 'o seu nome de usuário',
  usernameOrEmailInputPlaceholder: 'nome de usuário/endereço de correio eletrónico',
  title: 'Auth0',
  welcome: 'Bem-vindo(a) %s!',
  windowsAuthInstructions: 'Ligou-se a partir da sua rede empresarial&hellip;',
  windowsAuthLabel: 'Autenticação Windows',
  forgotPasswordTitle: 'Repor a sua palavra-passe',
  signUpTitle: 'Registar-se',
  mfaInputPlaceholder: 'Código',
  mfaLoginTitle: 'Verificação de dois passos',
  mfaLoginInstructions: 'Introduza o código de verificação gerado pela sua aplicação móvel.',
  mfaSubmitLabel: 'Iniciar sessão',
  mfaCodeErrorHint: 'Use %d numbers',
  showPassword: 'Mostrar palavra-passe',
  signUpTerms:
    'Ao registar-se, está a aceitar os nossos termos de serviço e a nossa política de privacidade.'
};
