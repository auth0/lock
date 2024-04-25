export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Você atingiu o limite máximo de tentativas. Por favor aguarde antes de tentar novamente.',
      'lock.fallback': 'Sentimos muito, mas algo deu errado ao requisitar a mudança de senha.',
      enterprise_email:
        "O domínio do seu e-mail faz parte de um provedor de identidade 'Enterprise'. Para redefinir sua senha, consulte seu administrador de segurança.",
      invalid_captcha: 'Resolva a questão do desafio para verificar se você não é um robô.',
      invalid_recaptcha: 'Marque a caixa de seleção para verificar se você não é um robô.'
    },
    login: {
      blocked_user: 'O usuário está bloqueado.',
      invalid_user_password: 'Credenciais inválidas.',
      'lock.fallback': 'Sentimos muito, mas algo deu errado ao tentar entrar.',
      'lock.invalid_code': 'Código inválido.',
      'lock.invalid_email_password': 'Email ou senha inválidos.',
      'lock.invalid_username_password': 'Usuário ou senha inválidos.',
      'lock.network':
        'Não foi possível acessar o servidor. Por favor verifique sua conexão e tente novamente.',
      'lock.popup_closed': 'Popup fechada. Tente novamente.',
      'lock.unauthorized': 'Permissões não foram concedidas. Tente novamente.',
      password_change_required:
        'Você precisa atualizar sua senha porque é seu primeiro login, ou porque sua senha expirou.',
      password_leaked:
        'Esse login está bloqueado porque sua senha foi vazada em outro website. Nós lhe enviamos um email com instruções sobre como desbloqueá-lo.',
      too_many_attempts: 'A sua conta foi bloqueada após várias tentativas de login consecutivas.',
      'lock.mfa_registration_required':
        'Autenticação por vários fatores é necessária, mas o dispositivo não está inscrito. Por favor, o inscreva antes de prosseguir.',
      'lock.mfa_invalid_code': 'Código errado. Por favor, tente novamente.',
      session_missing:
        'Não foi possível concluir o seu pedido de autenticação. Por favor tente novamente depois de fechar todos os diálogos abertos',
      'hrd.not_matching_email': 'Por favor, use seu email corporativo para acessar.',
      too_many_requests:
        'Sentimos muito, mas existem muitos acessos agora. Por favor, recarregue a página e tente novamente. Se isso persistir, tente novamente mais tarde.',
      invalid_captcha: 'Resolva a questão do desafio para verificar se você não é um robô.',
      invalid_recaptcha: 'Marque a caixa de seleção para verificar se você não é um robô.'
    },
    passwordless: {
      'bad.email': 'O email é inválido',
      'bad.phone_number': 'O número de telefone é inválido',
      'lock.fallback': 'Sentimos muito, algo deu errado',
      invalid_captcha: 'Resolva a questão do desafio para verificar se você não é um robô.',
      invalid_recaptcha: 'Marque a caixa de seleção para verificar se você não é um robô.'
    },
    signUp: {
      invalid_password: 'A senha é inválida.',
      'lock.fallback': 'Sentimos muito, algo deu errado ao tentar se inscrever.',
      password_dictionary_error: 'A senha é muito comum.',
      password_leaked: 'Essa combinação de credenciais foi detectada em uma violação de dados públicos em outro site. Antes de criar sua conta, use uma senha diferente para mantê-la segura.',
      password_no_user_info_error: 'A senha é baseado em informações do usuário.',
      password_strength_error: 'A senha é muito fraca.',
      user_exists: 'O usuário já existe.',
      username_exists: 'O nome de usuário já existe.',
      social_signup_needs_terms_acception:
        'Concorde com os Termos de Serviço abaixo para continuar.'
    }
  },
  success: {
    logIn: 'Obrigado por fazer login.',
    forgotPassword: 'Acabamos de enviar um email para redefinir sua senha.',
    magicLink: 'Nós enviamos um link para fazer login<br />em %s.',
    signUp: 'Obrigado por se inscrever.'
  },
  blankErrorHint: '',
  blankPasswordErrorHint: 'Não pode estar em branco',
  blankEmailErrorHint: 'Não pode estar em branco',
  blankUsernameErrorHint: 'Não pode estar em branco',
  blankCaptchaErrorHint: 'Não pode estar em branco',
  codeInputPlaceholder: 'seu código',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'ou',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'ou',
  emailInputPlaceholder: 'seu@exemplo.com',
  enterpriseLoginIntructions: 'Entre com suas credenciais corporativas.',
  enterpriseActiveLoginInstructions: 'Por favor entre com suas credenciais corporativas em %s.',
  failedLabel: 'Falha!',
  forgotPasswordAction: 'Esqueceu sua senha?',
  forgotPasswordInstructions:
    'Por favor digite seu endereço de email. Enviaremos um email para redefinir sua senha.',
  forgotPasswordSubmitLabel: 'Enviar email',
  invalidErrorHint: '',
  invalidPasswordErrorHint: 'Inválido',
  invalidEmailErrorHint: 'Inválido',
  invalidUsernameErrorHint: 'Inválido',
  lastLoginInstructions: 'Na última vez você entrou com',
  loginAtLabel: 'Login em %s',
  loginLabel: 'Login',
  loginSubmitLabel: 'Log in',
  loginWithLabel: 'Login com %s',
  notYourAccountAction: 'Não é sua conta?',
  passwordInputPlaceholder: 'sua senha',
  passwordStrength: {
    containsAtLeast: 'Deve conter no mínimo %d dos seguintes %d tipos de caracteres:',
    identicalChars: 'Não mais de %d caracteres idênticos em sequência (ex: "%s" não é permitido)',
    nonEmpty: 'Senha não pode estar em branco',
    numbers: 'Números (0-9)',
    lengthAtLeast: 'No mínimo %d caracteres',
    lowerCase: 'Letras minúsculas (a-z)',
    shouldContain: 'Deve conter:',
    specialCharacters: 'Caracteres especiais (ex: !@#$%^&*)',
    upperCase: 'Letras maiúsculas (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Senão, digite seu email para entrar<br/>ou criar uma conta',
  passwordlessEmailCodeInstructions: 'Um email com o código foi enviado para %s.',
  passwordlessEmailInstructions: 'Digite seu email para entrar<br/>ou criar uma conta',
  passwordlessSMSAlternativeInstructions:
    'Senão, digite seu telefone para entrar<br/>ou criar uma conta',
  passwordlessSMSCodeInstructions: 'Um SMS com o código foi enviado para %s.',
  passwordlessSMSInstructions: 'Digite seu telefone para entrar<br/>ou criar uma conta',
  phoneNumberInputPlaceholder: 'seu número de telefone',
  resendCodeAction: 'Não recebeu o código?',
  resendLabel: 'Reenviar',
  resendingLabel: 'Reenviando...',
  retryLabel: 'Tentar novamente',
  sentLabel: 'Enviado!',
  signUpLabel: 'Inscrever',
  signUpSubmitLabel: 'Inscrever',
  signUpWithLabel: 'Inscreva-se com %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Single Sign-On habilitado',
  submitLabel: 'Enviar',
  unrecoverableError: 'Algo deu errado.<br />Por favor entre em contato com o suporte.',
  usernameFormatErrorHint:
    'Use %d-%d letras, números e os seguintes caracteres: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'seu nome de usuário',
  usernameOrEmailInputPlaceholder: 'usuário/email',
  title: 'Auth0',
  welcome: 'Bem-vindo %s!',
  windowsAuthInstructions: 'Você está conectado da sua rede corporativa&hellip;',
  windowsAuthLabel: 'Autenticação Windows',
  forgotPasswordTitle: 'Redefinir sua senha',
  signUpTitle: 'Inscrever-se',
  mfaInputPlaceholder: 'Código',
  mfaLoginTitle: 'Verificação 2-Step',
  mfaLoginInstructions: 'Digite o código de verificação gerado pela sua aplicação móvel.',
  mfaSubmitLabel: 'Entrar',
  mfaCodeErrorHint: 'Use números %d',
  showPassword: 'Mostrar senha',
  signUpTerms:
    'Ao se inscrever, você concorda com nossos termos de serviço e política de privacidade.',
  captchaCodeInputPlaceholder: 'Digite o código mostrado acima',
  captchaMathInputPlaceholder: 'Resolva a fórmula mostrada acima'
};
