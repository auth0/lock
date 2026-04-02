import * as auth0 from "auth0-js";
import Auth0Lock, { Auth0LockPasswordless } from "auth0-lock";

const CLIENT_ID = "YOUR_AUTH0_APP_CLIENTID";
const DOMAIN = "YOUR_DOMAIN_AT.auth0.com";

// Basic instantiation
const lock: Auth0LockStatic = new Auth0Lock(CLIENT_ID, DOMAIN);

lock.show();
lock.hide();
lock.logout(() => {});

// checkSession
lock.checkSession({}, function (error: auth0.Auth0Error, authResult: AuthResult | undefined): void {
    if (error || !authResult) {
        lock.show();
    } else {
        lock.getUserInfo(authResult.accessToken, function (error, profile) {
            console.log(error, profile);
        });
    }
});

// show with options
const showOptions: Auth0LockShowOptions = {
    allowedConnections: ["twitter", "facebook"],
    allowAutocomplete: true,
    allowPasswordAutocomplete: false,
    allowShowPassword: true,
    allowSignUp: true,
    allowForgotPassword: false,
    auth: {
        autoParseHash: true,
        params: { state: "foo" },
        redirect: true,
        redirectUrl: "some url",
        responseType: "token",
        sso: true,
    },
    initialScreen: "login",
    flashMessage: {
        type: "error",
        text: "an error has occurred",
    },
    language: "en",
    languageDictionary: { title: "test" },
    rememberLastLogin: false,
};

lock.show(showOptions);

// on / off events
lock.on("authenticated", function (authResult: AuthResult) {
    lock.getUserInfo(authResult.accessToken, function (error, profile) {
        console.log(error, profile);
    });
});

lock.off("authenticated", (authResult) => {});

// Theme options
new Auth0Lock(CLIENT_ID, DOMAIN, {
    theme: {
        authButtons: {
            fooProvider: { displayName: "foo" },
        },
        hideMainScreenTitle: false,
        labeledSubmitButton: false,
        logo: "https://example.com/assets/logo.png",
        primaryColor: "green",
    },
});

// Auth options
new Auth0Lock(CLIENT_ID, DOMAIN, {
    auth: {
        autoParseHash: true,
        params: { state: "foo" },
        redirect: true,
        redirectUrl: "some url",
        responseType: "token",
        sso: true,
        audience: "https://api.example.com",
    },
});

// Previously missing options — these are the options added in this release
new Auth0Lock(CLIENT_ID, DOMAIN, {
    forceAutoHeight: true,
    mobile: true,
    disableWarnings: true,
    preferConnectionDisplayName: true,
    useCustomPasswordlessConnection: true,
    emailFirst: true,
    connectionResolver: (userInput, context, callback) => {
        callback({ name: "my-connection" });
    },
    hooks: {
        loggingIn: (context, cb) => {
            cb();
        },
        signingUp: (context, cb) => {
            cb();
        },
    },
});

// All constructor options
const allOptions: Auth0LockConstructorOptions = {
    additionalSignUpFields: [{ name: "address", placeholder: "enter your address" }],
    allowedConnections: ["Username-Password-Authentication"],
    allowAutocomplete: true,
    allowForgotPassword: true,
    allowLogin: true,
    allowPasswordAutocomplete: false,
    allowSignUp: true,
    allowShowPassword: true,
    assetsUrl: "https://example.com/assets",
    autoclose: true,
    autofocus: false,
    avatar: null,
    clientBaseUrl: "http://www.example.com",
    closable: true,
    configurationBaseUrl: "https://cdn.auth0.com",
    connectionResolver: (userInput, context, callback) => { callback({ name: "my-connection" }); },
    container: "myContainer",
    defaultADUsernameFromEmailPrefix: false,
    defaultDatabaseConnection: "Username-Password-Authentication",
    defaultEnterpriseConnection: "my-enterprise",
    disableWarnings: false,
    emailFirst: false,
    flashMessage: { type: "success", text: "Logged in!" },
    forceAutoHeight: false,
    forgotPasswordLink: "https://example.com/forgot",
    hashCleanup: true,
    hooks: {
        loggingIn: (context, cb) => { cb(); },
        signingUp: (context, cb) => { cb(); },
    },
    initialScreen: "login",
    language: "en",
    languageBaseUrl: "http://www.example.com",
    languageDictionary: { title: "My App" },
    leeway: 30,
    legacySameSiteCookie: false,
    loginAfterSignUp: true,
    mobile: false,
    mustAcceptTerms: false,
    popupOptions: { width: 500, height: 600, left: 100, top: 100 },
    preferConnectionDisplayName: false,
    prefill: { email: "user@example.com" },
    rememberLastLogin: true,
    scrollGlobalMessagesIntoView: true,
    showTerms: true,
    signUpFieldsStrictValidation: true,
    signUpHideUsernameField: false,
    signUpLink: "https://example.com/signup",
    socialButtonStyle: "big",
    theme: { primaryColor: "#ea5323" },
    useCustomPasswordlessConnection: false,
    usernameStyle: "username",
    _enableImpersonation: false,
    _enableIdPInitiatedLogin: false,
    _sendTelemetry: true,
    _telemetryInfo: { name: "my-sdk", version: "1.0.0", env: { "auth0.js": "9.0.0" } },
    __useTenantInfo: false,
};

new Auth0Lock(CLIENT_ID, DOMAIN, allOptions);

// Passwordless
new Auth0LockPasswordless(CLIENT_ID, DOMAIN);

new Auth0LockPasswordless(CLIENT_ID, DOMAIN, {
    passwordlessMethod: "code",
    forceAutoHeight: true,
});
