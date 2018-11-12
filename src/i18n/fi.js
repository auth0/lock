// This file was automatically translated.
// Feel free to submit a PR if you find a more accurate translation.

export default {
  error: {
    forgotPassword: {
      too_many_requests:
        'Olet yrittänyt vaihtaa salasanaa liian monta kertaa. Ole hyvä ja odota ennen kuin yrität uudelleen.',
      'lock.fallback':
        'Olemme pahoillamme, mutta jotain meni vikaan kun salasanaa yritettiin vaihtaa.',
      enterprise_email:
        'Sähköpostisi verkkotunnus on osa yrityspalvelun tarjoajaa. Voit palauttaa salasanasi turva-järjestelmänvalvojalta.'
    },
    login: {
      blocked_user: 'Käyttäjä on estetty.',
      invalid_user_password: 'Väärät tunnukset.',
      'lock.fallback': 'Olemme pahoillamme, mutta jotain meni vikaan kirjautumisen yhteydessä.',
      'lock.invalid_code': 'Väärä koodi.',
      'lock.invalid_email_password': 'Väärä sähköposti tai salasana.',
      'lock.invalid_username_password': 'Väärä käyttäjätunnus tai salasana.',
      'lock.network':
        'Emme saa yhteyttä palvelimelle. Ole hyvä ja tarkista yhteys ja yritä sitten uudelleen.',
      'lock.popup_closed': 'Popup ikkuna suljettu. Yritä uudelleen.',
      'lock.unauthorized': 'Käyttöoikeuksia ei myönnetty. Yritä uudelleen.',
      'lock.mfa_registration_required':
        'Monivaiheinen tunnistautuminen vaaditaan, mutta laitettasi ei ole kirjattu. Ole hyvä ja kirjaa laitteesi ennen kuin jatkat.',
      'lock.mfa_invalid_code': 'Väärä koodi. Ole hyvä ja yritä uudelleen.',
      password_change_required:
        'Sinun tulee päivittää salasanasi, koska tämä on ensimmäinen kerta kun olet kirjautumassa tai koska salasanasi on vanhentunut.',
      password_leaked:
        'Olemme havainneet mahdollisen tietoturvaongelman tämän tunnuksen kanssa. Suojellaksemme tunnustasi, olemme estäneet tämän kirjautumisen. Sinulle lähetettiin sähköposti, jossa on ohjeet, kuinka saat avattua tunnuksen.',
      too_many_attempts:
        'Tunnuksesi on suljettu useiden peräkkäisten kirjautumisyritysten jälkeen.',
      session_missing:
        'Kirjautumispyyntöäsi ei voitu suorittaa loppuun. Ole hyvä ja yritä uudelleen suljettuasi kaikki avoimet ikkunat',
      'hrd.not_matching_email': 'Ole hyvä ja käytä yrityssähköpostiasi kirjautumiseen.'
    },
    passwordless: {
      'bad.email': 'Sähköposti ei kelpaa',
      'bad.phone_number': 'Puhelinnumero ei kelpaa',
      'lock.fallback': 'Olemme pahoillamme, jotain meni vikaan'
    },
    signUp: {
      invalid_password: 'Salasana ei kelpaa.',
      'lock.fallback': 'Olemme pahoillamme, mutta jotain meni vikaan kirjautumisen yhteydessä.',
      password_dictionary_error: 'Salasana on liian yleinen.',
      password_no_user_info_error: 'Salasana perustuu käyttäjätietoihin.',
      password_strength_error: 'Salasana on liian heikko.',
      user_exists: 'Käyttäjä on jo olemassa.',
      username_exists: 'Käyttäjätunnus on jo olemassa.'
    }
  },
  success: {
    logIn: 'Kiitos kirjautumisesta.',
    forgotPassword: 'Olemme juuri lähettäneet sinulle sähköpostin salasanan alustusta varten.',
    magicLink: 'Lähetimme sinulle linkin, josta pääset kirjautumaan<br />%s.',
    signUp: 'Kiitos rekisteröitymisestä.'
  },
  blankErrorHint: 'Ei voi olla tyhjä',
  codeInputPlaceholder: 'koodisi',
  databaseEnterpriseLoginInstructions: '',
  databaseEnterpriseAlternativeLoginInstructions: 'tai',
  databaseSignUpInstructions: '',
  databaseAlternativeSignUpInstructions: 'tai',
  emailInputPlaceholder: 'sinun@esimerkki.fi',
  enterpriseLoginIntructions: 'Kirjaudu yritystunnuksillasi.',
  enterpriseActiveLoginInstructions: 'Ole hyvä ja anna yritystunnuksesi osoitteessa %s.',
  failedLabel: 'Epäonnistui!',
  forgotPasswordTitle: 'Alusta salasanasi',
  forgotPasswordAction: 'Etkö muista salasanaasi?',
  forgotPasswordInstructions:
    'Ole hyvä ja anna sähköpostiosoitteesi. Lähetämme sinulle sähköpostin salasanan alustusta varten.',
  forgotPasswordSubmitLabel: 'Lähetä sähköposti',
  invalidErrorHint: 'Epäkelpo',
  lastLoginInstructions: 'Viimeksi kirjauduit',
  loginAtLabel: 'Kirjauduttu %s',
  loginLabel: 'Kirjaudu',
  loginSubmitLabel: 'Kirjaudu',
  loginWithLabel: 'Kirjaudu %s',
  notYourAccountAction: 'Ei käyttäjätunnuksesi?',
  passwordInputPlaceholder: 'salasanasi',
  passwordStrength: {
    containsAtLeast: 'Sisältää vähintään %d seuraavista %d tyyppisistä kirjaimista:',
    identicalChars: 'Maksimissaan %d samaa kirjainta peräkkäin (esim., "%s" ei ole sallittu)',
    nonEmpty: 'Salasana ei saa olla tyhjä',
    numbers: 'Numeroita (ts. 0-9)',
    lengthAtLeast: 'Pituus vähintään %d kirjainta',
    lowerCase: 'Pieniä kirjaimia (a-z)',
    shouldContain: 'Tulee sisältää:',
    specialCharacters: 'Erikoismerkkejä (esim. !@#$%^&*)',
    upperCase: 'Isoja kirjaimia (A-Z)'
  },
  passwordlessEmailAlternativeInstructions:
    'Muussa tapauksessa, syötä sähköpostisi kirjautuaksesi<br/>tai luo käyttäjätunnus',
  passwordlessEmailCodeInstructions: 'Koodin sisältävä sähköposti on lähetetty osoitteeseen %s.',
  passwordlessEmailInstructions: 'Syötä sähköpostisi kirjautuaksesi<br/>tai luo käyttäjätunnus',
  passwordlessSMSAlternativeInstructions:
    'Muussa tapauksessa, syötä puhelinnumerosi kirjautuaksesi<br/>tai luo käyttäjätunnus',
  passwordlessSMSCodeInstructions: 'Koodin sisältävä tekstiviesti on lähetetty<br/>numeroon %s.',
  passwordlessSMSInstructions: 'Syötä puhelinnumerosi kirjautuaksesi<br/>tai luo käyttäjätunnus',
  phoneNumberInputPlaceholder: 'puhelinnumerosi',
  resendCodeAction: 'Etkö saanut koodia?',
  resendLabel: 'Lähetä uudelleen',
  resendingLabel: 'Lähettää uudelleen...',
  retryLabel: 'Yritä uudelleen',
  sentLabel: 'Lähetetty!',
  signUpTitle: 'Rekisteröidy',
  signUpLabel: 'Rekisteröidy',
  signUpSubmitLabel: 'Rekisteröidy',
  signUpWithLabel: 'Rekisteröidy %s',
  socialLoginInstructions: '',
  socialSignUpInstructions: '',
  ssoEnabled: 'Kertakirjautuminen toiminnassa',
  submitLabel: 'Lähetä',
  unrecoverableError: 'Jotain meni vikaan.<br />Ole hyvä ja ota yhteyttä tekniseen tukeen.',
  usernameFormatErrorHint:
    'Käytä %d-%d kirjaimia, numeroita ja seuraavia merkkejä: "_", ".", "+", "-"',
  usernameInputPlaceholder: 'käyttäjätunnuksesi',
  usernameOrEmailInputPlaceholder: 'käyttäjätunnus/sähköposti',
  title: 'Auth0',
  welcome: 'Tervetuloa %s!',
  windowsAuthInstructions: 'Olet yhteydessä yritysverkostasi&hellip;',
  windowsAuthLabel: 'Windows kirjautuminen',
  mfaInputPlaceholder: 'Koodi',
  mfaLoginTitle: 'Kaksivaiheinen tarkistus',
  mfaLoginInstructions: 'Ole hyvä ja anna mobiilisovelluksesi luoma tarkistuskoodi.',
  mfaSubmitLabel: 'Kirjaudu',
  mfaCodeErrorHint: 'Käytä %d numeroa',
  showPassword: 'Näytä salasana',
  signUpTerms: 'Ilmoittautumalla hyväksyt käyttöehdot ja tietosuojakäytännöt.'
};
