# Change Log

## [v11.9.0](https://github.com/auth0/lock/tree/v11.9.0) (2018-08-28)
[Full Changelog](https://github.com/auth0/lock/compare/v11.8.1...v11.9.0)


**Added**
- Support new minimum password length parameter [\#1472](https://github.com/auth0/lock/pull/1472) ([luisrudge](https://github.com/luisrudge))
- Improve accessibility [\#1471](https://github.com/auth0/lock/pull/1471) ([andrew-me](https://github.com/andrew-me))
- Add a new type of additionalSignUpField: hidden [\#1459](https://github.com/auth0/lock/pull/1459) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fixed login_hint in some enterprise authorize call scenarios [\#1460](https://github.com/auth0/lock/pull/1460) ([cocojoe](https://github.com/cocojoe))


## [v11.8.1](https://github.com/auth0/lock/tree/v11.8.1) (2018-07-30)
[Full Changelog](https://github.com/auth0/lock/compare/v11.8.0...v11.8.1)


**Fixed**
- Fix/sign up title inconsistenty [\#1457](https://github.com/auth0/lock/pull/1457) ([luisrudge](https://github.com/luisrudge))
- Fix wrong autoComplete value in password_input [\#1456](https://github.com/auth0/lock/pull/1456) ([luisrudge](https://github.com/luisrudge))
- Fix crash when showing lock for the second time with custom select input [\#1448](https://github.com/auth0/lock/pull/1448) ([luisrudge](https://github.com/luisrudge))
- Moving the PasswordStrength component to below the password input [\#1444](https://github.com/auth0/lock/pull/1444) ([luisrudge](https://github.com/luisrudge))


## [v11.8.0](https://github.com/auth0/lock/tree/v11.8.0) (2018-07-24)
[Full Changelog](https://github.com/auth0/lock/compare/v11.7.2...v11.8.0)


**Added**
- Add allowPasswordAutocomplete option [\#1419](https://github.com/auth0/lock/pull/1419) ([jshado1](https://github.com/jshado1))

**Changed**
- Upgrade auth0.js to 9.7.3 [\#1442](https://github.com/auth0/lock/pull/1442) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fix Configuration URL when using __tenantInfo and a baseConfigurationURL [\#1425](https://github.com/auth0/lock/pull/1425) ([lbalmaceda](https://github.com/lbalmaceda))
- Fix SSO screen not showing in some cases [\#1415](https://github.com/auth0/lock/pull/1415) ([luisrudge](https://github.com/luisrudge))
- In SSO mode, hide the password input instead of removing it from the DOM [\#1407](https://github.com/auth0/lock/pull/1407) ([luisrudge](https://github.com/luisrudge))


## [v11.7.2](https://github.com/auth0/lock/tree/v11.7.2) (2018-06-07)
[Full Changelog](https://github.com/auth0/lock/compare/v11.7.1...v11.7.2)


**Added**
- Added an i18n file for the Norwegian Nynorsk language [\#1398](https://github.com/auth0/lock/pull/1398) ([cjrorvik](https://github.com/cjrorvik))

**Fixed**
- SSO: Fallback to email if the username field is empty [\#1400](https://github.com/auth0/lock/pull/1400) ([sandrinodimattia](https://github.com/sandrinodimattia))
- Fixed some typos and corrected some mistakes in the Norwegian Bokmaal [\#1399](https://github.com/auth0/lock/pull/1399) ([cjrorvik](https://github.com/cjrorvik))


## [v11.7.1](https://github.com/auth0/lock/tree/v11.7.1) (2018-06-01)
[Full Changelog](https://github.com/auth0/lock/compare/v11.7.0...v11.7.1)


**Fixed**
- Fix IE submit button display:initial issue [\#1394](https://github.com/auth0/lock/pull/1394) ([luisrudge](https://github.com/luisrudge))


## [v11.7.0](https://github.com/auth0/lock/tree/v11.7.0) (2018-05-28)
[Full Changelog](https://github.com/auth0/lock/compare/v11.6.1...v11.7.0)


**Fixed**
- Display error for all enterprise connections in the reset password screen [\#1384](https://github.com/auth0/lock/pull/1384) ([luisrudge](https://github.com/luisrudge))
- Hide password strength message when the password is valid [\#1382](https://github.com/auth0/lock/pull/1382) ([luisrudge](https://github.com/luisrudge))
- Fixed Turkish translation [\#1379](https://github.com/auth0/lock/pull/1379) ([saltukalakus](https://github.com/saltukalakus))
- Fix IE default redirect url [\#1373](https://github.com/auth0/lock/pull/1373) ([luisrudge](https://github.com/luisrudge))


## [v11.6.1](https://github.com/auth0/lock/tree/v11.6.1) (2018-05-02)
[Full Changelog](https://github.com/auth0/lock/compare/v11.6.0...v11.6.1)

**Fixed**
- Fix rendering issue on iOS devices [\#1365](https://github.com/auth0/lock/pull/1365) ([luisrudge](https://github.com/luisrudge))


## [v11.6.0](https://github.com/auth0/lock/tree/v11.6.0) (2018-04-24)
[Full Changelog](https://github.com/auth0/lock/compare/v11.5.2...v11.6.0)


**Added**
- Add signup error to valid events [\#1329](https://github.com/auth0/lock/pull/1329) ([yveswehrli](https://github.com/yveswehrli))

**Changed**
- Upgrade auth0-js to 9.5.0. See auth0-js' changelog [here](https://github.com/auth0/auth0.js/blob/master/CHANGELOG.md#v950-2018-04-24).
**Fixed**
- Show spinner when doing quick auth [\#1346](https://github.com/auth0/lock/pull/1346) ([luisrudge](https://github.com/luisrudge))
- Fix danish translation [\#1338](https://github.com/auth0/lock/pull/1338) ([luisrudge](https://github.com/luisrudge))
- Fix getSSOData not sending custom nonce/state [\#1333](https://github.com/auth0/lock/pull/1333) ([luisrudge](https://github.com/luisrudge))


## [v11.5.2](https://github.com/auth0/lock/tree/v11.5.2) (2018-03-28)
[Full Changelog](https://github.com/auth0/lock/compare/v11.5.1...v11.5.2)


**Added**
- Add jwksURI override option [\#1321](https://github.com/auth0/lock/pull/1321) ([luisrudge](https://github.com/luisrudge))


## [v11.5.1](https://github.com/auth0/lock/tree/v11.5.1) (2018-03-22)
[Full Changelog](https://github.com/auth0/lock/compare/v11.5.0...v11.5.1)



## [v11.5.0](https://github.com/auth0/lock/tree/v11.5.0) (2018-03-22)
[Full Changelog](https://github.com/auth0/lock/compare/v11.4.0...v11.5.0)


**Changed**
- updating auth0-js with impersonation and access token validation changes [\#1308](https://github.com/auth0/lock/pull/1308) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fix inconsistent state assignment when parsing a hash [\#1309](https://github.com/auth0/lock/pull/1309) ([luisrudge](https://github.com/luisrudge))
- Fixed German translations [\#1307](https://github.com/auth0/lock/pull/1307) ([roschaefer](https://github.com/roschaefer))
- Fixing IE lack of support for `includes` [\#1298](https://github.com/auth0/lock/pull/1298) ([luisrudge](https://github.com/luisrudge))
- Fix Japanese translations [\#1295](https://github.com/auth0/lock/pull/1295) ([hiro1107](https://github.com/hiro1107))


## [v11.4.0](https://github.com/auth0/lock/tree/v11.4.0) (2018-03-12)
[Full Changelog](https://github.com/auth0/lock/compare/v11.3.1...v11.4.0)


**Added**
- Update auth0.js and add flag to enable impersonation [\#1290](https://github.com/auth0/lock/pull/1290) ([luisrudge](https://github.com/luisrudge))

**Changed**
- Making HRD work in signup page and showing an error when HRD is detected in the forgot password page [\#1278](https://github.com/auth0/lock/pull/1278) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fix inconsistent screen title [\#1288](https://github.com/auth0/lock/pull/1288) ([luisrudge](https://github.com/luisrudge))
- Always remove spaces from email and username [\#1280](https://github.com/auth0/lock/pull/1280) ([luisrudge](https://github.com/luisrudge))


## [v11.3.1](https://github.com/auth0/lock/tree/v11.3.1) (2018-02-28)
[Full Changelog](https://github.com/auth0/lock/compare/v11.3.0...v11.3.1)


**Fixed**
- Add enterprise mapping to the auth0-oidc strategy [\#1275](https://github.com/auth0/lock/pull/1275) ([luisrudge](https://github.com/luisrudge))


## [v11.3.0](https://github.com/auth0/lock/tree/v11.3.0) (2018-02-22)
[Full Changelog](https://github.com/auth0/lock/compare/v11.2.3...v11.3.0)


**Fixed**
- Fix Lock Passwordless feature parity (events and quick auth screen) [\#1267](https://github.com/auth0/lock/pull/1267) ([luisrudge](https://github.com/luisrudge))
- Removing legacy COA mapping + fixing access_denied mapping [\#1266](https://github.com/auth0/lock/pull/1266) ([luisrudge](https://github.com/luisrudge))
- Only call getSSOData when rememberLastLogin is true [\#1265](https://github.com/auth0/lock/pull/1265) ([luisrudge](https://github.com/luisrudge))
- Upgrade auth0-js to 9.3.0. See auth0-js' changelog [here](https://github.com/auth0/auth0.js/blob/master/CHANGELOG.md#v930-2018-02-22).



## [v11.2.3](https://github.com/auth0/lock/tree/v11.2.3) (2018-02-08)
[Full Changelog](https://github.com/auth0/lock/compare/v11.2.2...v11.2.3)


**Fixed**
- Fixing Auth0LockPasswordless export [\#1259](https://github.com/auth0/lock/pull/1259) ([luisrudge](https://github.com/luisrudge))
- Fix sso warning [\#1258](https://github.com/auth0/lock/pull/1258) ([luisrudge](https://github.com/luisrudge))


## [v11.2.2](https://github.com/auth0/lock/tree/v11.2.2) (2018-02-06)
[Full Changelog](https://github.com/auth0/lock/compare/v11.2.1...v11.2.2)


**Fixed**
- Upgrade a0js to fix popup mode with passwordless [\#1251](https://github.com/auth0/lock/pull/1251) ([luisrudge](https://github.com/luisrudge))


## [v11.2.1](https://github.com/auth0/lock/tree/v11.2.1) (2018-02-02)
[Full Changelog](https://github.com/auth0/lock/compare/v11.2.0...v11.2.1)


**Fixed**
- DIsable HRD check for passwordless connections [\#1248](https://github.com/auth0/lock/pull/1248) ([luisrudge](https://github.com/luisrudge))


## [v11.2.0](https://github.com/auth0/lock/tree/v11.2.0) (2018-02-02)
[Full Changelog](https://github.com/auth0/lock/compare/v11.1.3...v11.2.0)


**Changed**
- call /ssodata when inside the universal login page [\#1245](https://github.com/auth0/lock/pull/1245) ([luisrudge](https://github.com/luisrudge))
- Handling embedded and universal login in the same application [\#1243](https://github.com/auth0/lock/pull/1243) ([luisrudge](https://github.com/luisrudge))


## [v11.1.3](https://github.com/auth0/lock/tree/v11.1.3) (2018-01-29)
[Full Changelog](https://github.com/auth0/lock/compare/v11.1.2...v11.1.3)

**Changed**
- Update auth0.js [auth0.js changelog](https://github.com/auth0/auth0.js/blob/master/CHANGELOG.md#v913-2018-01-29)



## [v11.1.2](https://github.com/auth0/lock/tree/v11.1.2) (2018-01-26)
[Full Changelog](https://github.com/auth0/lock/compare/v11.1.1...v11.1.2)

**Changed**
- Update auth0.js [auth0.js changelog](https://github.com/auth0/auth0.js/blob/master/CHANGELOG.md#v912-2018-01-26)


## [v11.1.1](https://github.com/auth0/lock/tree/v11.1.1) (2018-01-24)
[Full Changelog](https://github.com/auth0/lock/compare/v11.1.0...v11.1.1)

**Changed**
- Update auth0.js [auth0.js changelog](https://github.com/auth0/auth0.js/blob/master/CHANGELOG.md#v911-2018-01-24)


## [v11.1.0](https://github.com/auth0/lock/tree/v11.1.0) (2018-01-16)
[Full Changelog](https://github.com/auth0/lock/compare/v11.0.1...v11.1.0)


**Changed**
- Update auth0.js [\#1225](https://github.com/auth0/lock/pull/1225) ([luisrudge](https://github.com/luisrudge))


## [v11.0.0](https://github.com/auth0/lock/tree/v11.0.0) (2017-12-21)
[Full Changelog](https://github.com/auth0/lock/compare/v10.23.0...v11.0.0)

Lock v11 is designed for embedded login scenarios and **is not supported in centralized login scenarios** (i.e. Hosted Login Pages). You need to keep using Lock v10 in the Hosted Login Page.

We wrote a [Migration Guide](https://auth0.com/docs/libraries/lock/v11/migration-guide) to make upgrading your app easy. 

**Breaking change**
`lock.getProfile` now expects an access\_token as the first parameter. You'll need to update your code to change the parameter sent (v10 expected an id_token).

**Removed**
The `oidcConformant` flag was used to force Lock v10 to not call legacy endpoints. Lock v11 never uses legacy endpoint so the flag is not needed anymore. If specified, it will be ignored.

**Changed**
Lock v11 default the `scope` parameter to `openid profile email`. This is to make the 'Last Logged in With' window work.

## [v10.23.1](https://github.com/auth0/lock/tree/v10.23.1) (2017-10-12)
[Full Changelog](https://github.com/auth0/lock/compare/v10.23.0...v10.23.1)


**Fixed**
- Using correct suffix for animation [\#1146](https://github.com/auth0/lock/pull/1146) ([luisrudge](https://github.com/luisrudge))


## [v10.23.0](https://github.com/auth0/lock/tree/v10.23.0) (2017-10-12)
[Full Changelog](https://github.com/auth0/lock/compare/v10.22.0...v10.23.0)


**Changed**
- Pinning react version 15.6.2 [\#1142](https://github.com/auth0/lock/pull/1142) ([luisrudge](https://github.com/luisrudge))
- upgrade auth0.js [\#1137](https://github.com/auth0/lock/pull/1137) ([luisrudge](https://github.com/luisrudge))
- Upgrade react version [\#1135](https://github.com/auth0/lock/pull/1135) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fix defaultUrl sending hash content [\#1132](https://github.com/auth0/lock/pull/1132) ([luisrudge](https://github.com/luisrudge))


### ** NOTICE ** 
We're trying to figure it out how to help customers that want to upgrade to react@16. The ideal would be to move react and react-dom to peerDependencies, but this would be a breaking change for most of our customers, so we're thinking this through.

In the meantime, react@16 works just fine with this codebase. You'll just have to bundle both versions if you're not using yarn. If you are using yarn, however, you can use the `resolutions` field and pin react@16 to your repo.

```
{
  "name": "test-test",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "auth0-lock": "^10.23.0",
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "react-scripts": "^1.0.14"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "resolutions": {
    "react": "16.0.0",
    "react-dom": "16.0.0"
  }
}
```


## [v10.22.0](https://github.com/auth0/lock/tree/v10.22.0) (2017-09-26)
[Full Changelog](https://github.com/auth0/lock/compare/v10.21.1...v10.22.0)


**Added**
- Adding oidcConformant readme entry [\#1119](https://github.com/auth0/lock/pull/1119) ([luisrudge](https://github.com/luisrudge))

**Changed**
- Make cross origin authentication the default in OIDC mode [\#1124](https://github.com/auth0/lock/pull/1124) ([luisrudge](https://github.com/luisrudge))


## [v10.21.1](https://github.com/auth0/lock/tree/v10.21.1) (2017-09-21)
[Full Changelog](https://github.com/auth0/lock/compare/v10.21.0...v10.21.1)


**Fixed**
- Fix resolved connection not being a Map object [\#1116](https://github.com/auth0/lock/pull/1116) ([luisrudge](https://github.com/luisrudge))


## [v10.21.0](https://github.com/auth0/lock/tree/v10.21.0) (2017-09-21)
[Full Changelog](https://github.com/auth0/lock/compare/v10.20.0...v10.21.0)


**Added**
- Add Estonian Translations [\#1099](https://github.com/auth0/lock/pull/1099) ([meikoudras](https://github.com/meikoudras))

**Changed**
- Changed the connectionResolver to run onSubmit instead of onBlur [\#1113](https://github.com/auth0/lock/pull/1113) ([luisrudge](https://github.com/luisrudge))
- Change translate for loginAtLabel [\#1110](https://github.com/auth0/lock/pull/1110) ([radu-carmina](https://github.com/radu-carmina))

**Fixed**
- Use resolvedConnection where available [\#1111](https://github.com/auth0/lock/pull/1111) ([lukevmorris](https://github.com/lukevmorris))
- Fix a few svg errors when used with global css rule [\#1103](https://github.com/auth0/lock/pull/1103) ([luisrudge](https://github.com/luisrudge))
- Links with # should use javascript:void(0) [\#1102](https://github.com/auth0/lock/pull/1102) ([luisrudge](https://github.com/luisrudge))
- Improve Danish translation [\#1097](https://github.com/auth0/lock/pull/1097) ([havgry](https://github.com/havgry))
- Fixed translations for Romanian and Slovenian [\#1092](https://github.com/auth0/lock/pull/1092) ([AdrianSima](https://github.com/AdrianSima))


## [v10.20.0](https://github.com/auth0/lock/tree/v10.20.0) (2017-08-11)
[Full Changelog](https://github.com/auth0/lock/compare/v10.19.0...v10.20.0)


**Added**
- Add Romanian translations [\#1074](https://github.com/auth0/lock/pull/1074) ([jogee](https://github.com/jogee))
- Add Slovenian translations [\#1073](https://github.com/auth0/lock/pull/1073) ([jogee](https://github.com/jogee))

**Changed**
- Update username allowed chars regex [\#1079](https://github.com/auth0/lock/pull/1079) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fix custom theme for custom connections [\#1083](https://github.com/auth0/lock/pull/1083) ([luisrudge](https://github.com/luisrudge))
- Fix spacing using custom signup fields [\#1076](https://github.com/auth0/lock/pull/1076) ([luisrudge](https://github.com/luisrudge))
- Fixed Slovak translations [\#1069](https://github.com/auth0/lock/pull/1069) ([stajo1](https://github.com/stajo1))


## [v10.19.0](https://github.com/auth0/lock/tree/v10.19.0) (2017-07-18)
[Full Changelog](https://github.com/auth0/lock/compare/v10.18.0...v10.19.0)


**Added**
- Added `oidcConformant` entry to the readme [\#1054](https://github.com/auth0/lock/pull/1054) ([luisrudge](https://github.com/luisrudge))
- Added a custom connection resolver option [\#1052](https://github.com/auth0/lock/pull/1052) ([luisrudge](https://github.com/luisrudge))
- Added Korean translation [\#1051](https://github.com/auth0/lock/pull/1051) ([couldseeme](https://github.com/couldseeme))

**Fixed**
- Set the username to the previously used email when toggling hrd [\#1056](https://github.com/auth0/lock/pull/1056) ([luisrudge](https://github.com/luisrudge))


## [v10.18.0](https://github.com/auth0/lock/tree/v10.18.0) (2017-06-23)
[Full Changelog](https://github.com/auth0/lock/compare/v10.17.0...v10.18.0)


**Added**
- Add analytics events [\#1036](https://github.com/auth0/lock/pull/1036) ([francocorreasosa](https://github.com/francocorreasosa))
- Lang Afrikaans South Africa [\#1035](https://github.com/auth0/lock/pull/1035) ([jdunhin](https://github.com/jdunhin))
- Adding "show password" option [\#1029](https://github.com/auth0/lock/pull/1029) ([luisrudge](https://github.com/luisrudge))

**Changed**
- Upgrade React to fix IE11 issues [\#1039](https://github.com/auth0/lock/pull/1039) ([luisrudge](https://github.com/luisrudge))

**Removed**
- Removed node version restriction [\#1043](https://github.com/auth0/lock/pull/1043) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fixing empty popup on signup [\#1048](https://github.com/auth0/lock/pull/1048) ([luisrudge](https://github.com/luisrudge))
- Adding a flag for cross-auth [\#1044](https://github.com/auth0/lock/pull/1044) ([luisrudge](https://github.com/luisrudge))
- Fix custom connection scopes [\#1038](https://github.com/auth0/lock/pull/1038) ([luisrudge](https://github.com/luisrudge))


## [v10.17.0](https://github.com/auth0/lock/tree/v10.17.0) (2017-06-14)
[Full Changelog](https://github.com/auth0/lock/compare/v10.16.0...v10.17.0)


**Added**
- Added allowAutoComplete ui option [\#1022](https://github.com/auth0/lock/pull/1022) ([luisrudge](https://github.com/luisrudge))
- When in OIDC mode, enterprise connections always go to IdP page [\#1019](https://github.com/auth0/lock/pull/1019) ([luisrudge](https://github.com/luisrudge))
- Added Cross Origin Auth support in OIDC mode [\#1013](https://github.com/auth0/lock/pull/1013) ([luisrudge](https://github.com/luisrudge))
- Emit authorization_error when username/password fails (invalid_user_password) [\#999](https://github.com/auth0/lock/pull/999) ([luisrudge](https://github.com/luisrudge))

**Changed**
- Improved Danish translation [\#1033](https://github.com/auth0/lock/pull/1033) ([denkristoffer](https://github.com/denkristoffer))
- Scroll to the error message by default [\#1023](https://github.com/auth0/lock/pull/1023) ([m-idler](https://github.com/m-idler))
- Enabled HTML formatting for flashMessages [\#1017](https://github.com/auth0/lock/pull/1017) ([dariobanfi](https://github.com/dariobanfi))
- package.json: ~ range allowed for auth0-js dep [\#1015](https://github.com/auth0/lock/pull/1015) ([lexaurin](https://github.com/lexaurin))

**Fixed**
- Removed extra scroll on mobile view [\#1031](https://github.com/auth0/lock/pull/1031) ([beneliflo](https://github.com/beneliflo))
- Fixing tooltip error in the email pane [\#1030](https://github.com/auth0/lock/pull/1030) ([luisrudge](https://github.com/luisrudge))
- Fix react-addons-css-transition-group issue [\#1001](https://github.com/auth0/lock/pull/1001) ([eoinmurray](https://github.com/eoinmurray))
- Fixed overrides sent to auth0.js [\#997](https://github.com/auth0/lock/pull/997) ([sandrinodimattia](https://github.com/sandrinodimattia))


## [v10.16.0](https://github.com/auth0/lock/tree/v10.16.0) (2017-05-08)
[Full Changelog](https://github.com/auth0/lock/compare/v10.15.1...v10.16.0)


**Added**
- Add form method [\#993](https://github.com/auth0/lock/pull/993) ([luisrudge](https://github.com/luisrudge))

**Changed**
- Update badge location for better performance and bundle max-age changes [\#995](https://github.com/auth0/lock/pull/995) ([ramasilveyra](https://github.com/ramasilveyra))

**Fixed**
- Fix long header title and Error messages overflow [\#990](https://github.com/auth0/lock/pull/990) ([beneliflo](https://github.com/beneliflo))
- Fix grammar mistake RU [\#988](https://github.com/auth0/lock/pull/988) ([uladar](https://github.com/uladar))


## [v10.15.1](https://github.com/auth0/lock/tree/v10.15.1) (2017-04-25)
[Full Changelog](https://github.com/auth0/lock/compare/v10.15.0...v10.15.1)


**Fixed**
- Moving dependencies to devDependencies [\#984](https://github.com/auth0/lock/pull/984) ([luisrudge](https://github.com/luisrudge))


## [v10.15.0](https://github.com/auth0/lock/tree/v10.15.0) (2017-04-24)
[Full Changelog](https://github.com/auth0/lock/compare/v10.14.0...v10.15.0)


**Added**
- Add support for paypal-sandbox strategy [\#975](https://github.com/auth0/lock/pull/975) ([ziluvatar](https://github.com/ziluvatar))

**Changed**
- Upgrade auth0-js to v8.6.0 [\#980](https://github.com/auth0/lock/pull/980) ([luisrudge](https://github.com/luisrudge))
- Adding prettier and a precommit script to format the code :tada: :lipstick:  [\#977](https://github.com/auth0/lock/pull/977) ([luisrudge](https://github.com/luisrudge))
- Upgrading usage of prop-types to new package [\#971](https://github.com/auth0/lock/pull/971) ([luisrudge](https://github.com/luisrudge))
- Use replaceState for better browser history experience [\#967](https://github.com/auth0/lock/pull/967) ([selaux](https://github.com/selaux))
- Renaming internal `signOut` methods with `logout` to keep it consistent [\#966](https://github.com/auth0/lock/pull/966) ([luisrudge](https://github.com/luisrudge))
- Improve error handling of sync with better errors [\#961](https://github.com/auth0/lock/pull/961) ([luisrudge](https://github.com/luisrudge))
- Adding `key` to the error "An error occurred when fetching data" [\#956](https://github.com/auth0/lock/pull/956) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fixed typo in cs.js [\#979](https://github.com/auth0/lock/pull/979) ([fersman](https://github.com/fersman))
- fixed propType misspell in header.jsx [\#973](https://github.com/auth0/lock/pull/973) ([nickpisacane](https://github.com/nickpisacane))
- Fixed scrolling on mobile in landscape mode [\#963](https://github.com/auth0/lock/pull/963) ([luisrudge](https://github.com/luisrudge))


## [v10.14.0](https://github.com/auth0/lock/tree/v10.14.0) (2017-03-27)
[Full Changelog](https://github.com/auth0/lock/compare/v10.13.0...v10.14.0)

**Closed issues**
- prefill option is lost after reset password [\#933](https://github.com/auth0/lock/issues/933)

**Added**
- Throw an error when audience is used without oidcConformant flag [\#947](https://github.com/auth0/lock/pull/947) ([luisrudge](https://github.com/luisrudge))
- Added Finnish translation [\#936](https://github.com/auth0/lock/pull/936) ([kettunen](https://github.com/kettunen))
- Added Ukrainian translation [\#931](https://github.com/auth0/lock/pull/931) ([grsmv](https://github.com/grsmv))

**Changed**
- Upgrade auth0js to v8.5.0 [\#952](https://github.com/auth0/lock/pull/952) ([luisrudge](https://github.com/luisrudge))
- Disable social buttons when terms were not accepted on sign up [\#949](https://github.com/auth0/lock/pull/949) ([luisrudge](https://github.com/luisrudge))
- Better explanation about the sso option [\#948](https://github.com/auth0/lock/pull/948) ([luisrudge](https://github.com/luisrudge))
- Changed password leak error message [\#934](https://github.com/auth0/lock/pull/934) ([ntotten](https://github.com/ntotten))
- Add support for success and error messages to be in HTML [\#928](https://github.com/auth0/lock/pull/928) ([luisrudge](https://github.com/luisrudge))

**Fixed**
- Fixing Italian dictionary [\#950](https://github.com/auth0/lock/pull/950) ([ilmistra](https://github.com/ilmistra))
- Don't clear email field after reset password [\#945](https://github.com/auth0/lock/pull/945) ([luisrudge](https://github.com/luisrudge))
- Disable autoCorrect and spellCheck in the username input [\#927](https://github.com/auth0/lock/pull/927) ([luisrudge](https://github.com/luisrudge))


## [v10.13.0](https://github.com/auth0/lock/tree/v10.13.0) (2017-03-13)
[Full Changelog](https://github.com/auth0/lock/compare/v10.12.3...v10.13.0)

**Closed issues**
- State with `=`, `&` characters is incorrectly parsed from url fragment [\#913](https://github.com/auth0/lock/issues/913)
- Add support for Evernote strategy [\#895](https://github.com/auth0/lock/issues/895)

**Fixed**
- Updated auth0 js version [\#924](https://github.com/auth0/lock/pull/924) ([hzalaz](https://github.com/hzalaz))
- Adds evernote social icon [\#923](https://github.com/auth0/lock/pull/923) ([vctrfrnndz](https://github.com/vctrfrnndz))
- Add japanese translation for "OR" [\#921](https://github.com/auth0/lock/pull/921) ([vctrfrnndz](https://github.com/vctrfrnndz))
- Fix some french translations. [\#918](https://github.com/auth0/lock/pull/918) ([lucasmichot](https://github.com/lucasmichot))
- Replace querystring implementation with qs module [\#916](https://github.com/auth0/lock/pull/916) ([elger](https://github.com/elger))
- Use error.name to find the correct error message for invalid passwords [\#904](https://github.com/auth0/lock/pull/904) ([luisrudge](https://github.com/luisrudge))


## [v10.12.3](https://github.com/auth0/lock/tree/v10.12.3) (2017-03-07)
[Full Changelog](https://github.com/auth0/lock/compare/v10.12.2...v10.12.3)


**Fixed**
- Update node engine restriction [\#909](https://github.com/auth0/lock/pull/909) ([hzalaz](https://github.com/hzalaz))
- Fixed Czech translation [\#902](https://github.com/auth0/lock/pull/902) ([FilipPyrek](https://github.com/FilipPyrek))


## [v10.12.2](https://github.com/auth0/lock/tree/v10.12.2) (2017-03-03)
[Full Changelog](https://github.com/auth0/lock/compare/v10.12.1...v10.12.2)


**Fixed**
- Specify owp for non oidc web api in popup mode [\#897](https://github.com/auth0/lock/pull/897) ([hzalaz](https://github.com/hzalaz))


## [v10.12.1](https://github.com/auth0/lock/tree/v10.12.1) (2017-03-03)
[Full Changelog](https://github.com/auth0/lock/compare/v10.12.0...v10.12.1)


**Fixed**
- Fixed npm transpiled code [\#893](https://github.com/auth0/lock/pull/893) ([hzalaz](https://github.com/hzalaz))


## [v10.12.0](https://github.com/auth0/lock/tree/v10.12.0) (2017-03-02)
[Full Changelog](https://github.com/auth0/lock/compare/v10.11.0...v10.12.0)

**Closed issues**
- Bug in email field validation [\#884](https://github.com/auth0/lock/issues/884)
- Input field tab issue in IE [\#870](https://github.com/auth0/lock/issues/870)
- Bring back the integratedWindowsLogin option [\#852](https://github.com/auth0/lock/issues/852)
- Unwanted parameters in /authorize call [\#851](https://github.com/auth0/lock/issues/851)
- Back button not displaying properly in IE 11 [\#767](https://github.com/auth0/lock/issues/767)

**Added**
- Added checkbox CustomInput for additionalSignUpFields [\#860](https://github.com/auth0/lock/pull/860) ([dariobanfi](https://github.com/dariobanfi))
- Add slovak translation [\#846](https://github.com/auth0/lock/pull/846) ([Passto](https://github.com/Passto))

**Changed**
- Update password sheriff to reduce bundle size [\#879](https://github.com/auth0/lock/pull/879) ([hzalaz](https://github.com/hzalaz))
- Adding focusable=false to all svgs [\#873](https://github.com/auth0/lock/pull/873) ([luisrudge](https://github.com/luisrudge))
- Migrating to webpack2 [\#871](https://github.com/auth0/lock/pull/871) ([luisrudge](https://github.com/luisrudge))
- Review catalan translations [\#869](https://github.com/auth0/lock/pull/869) ([oscarfonts](https://github.com/oscarfonts))
- Reducing time to unpin loading pane [\#853](https://github.com/auth0/lock/pull/853) ([luisrudge](https://github.com/luisrudge))
- Throw an error if login, signUp and forgotPassword screens are not allowed [\#850](https://github.com/auth0/lock/pull/850) ([luisrudge](https://github.com/luisrudge))
- Kerberos network checking no longer depends on rememberLastLogin [\#805](https://github.com/auth0/lock/pull/805) ([patrickmcgraw](https://github.com/patrickmcgraw))

**Fixed**
- Updated auth0.js to v8.3.0 [\#889](https://github.com/auth0/lock/pull/889) ([hzalaz](https://github.com/hzalaz))
- Fix issue when submiting a form with no email [\#886](https://github.com/auth0/lock/pull/886) ([selaux](https://github.com/selaux))
- Fixing allowSignup and allowForgot options when loading tenant info [\#877](https://github.com/auth0/lock/pull/877) ([luisrudge](https://github.com/luisrudge))
-  Don't disable mfa-code input [\#872](https://github.com/auth0/lock/pull/872) ([nikolaseu](https://github.com/nikolaseu))
- Fix a box-sizing issue that happened when bootstrap was being used with lock [\#868](https://github.com/auth0/lock/pull/868) ([luisrudge](https://github.com/luisrudge))
- Cleaning params sent to auth0js [\#863](https://github.com/auth0/lock/pull/863) ([luisrudge](https://github.com/luisrudge))
- Only set prefill values when application is initialized [\#855](https://github.com/auth0/lock/pull/855) ([luisrudge](https://github.com/luisrudge))


## [v10.11.0](https://github.com/auth0/lock/tree/v10.11.0) (2017-01-30)
[Full Changelog](https://github.com/auth0/lock/compare/v10.10.2...v10.11.0)

**Closed issues**
- Input error state does not get reset when changing page [\#843](https://github.com/auth0/lock/issues/843)
- Show error when the domain part of the email does not match any enterprise connection [\#661](https://github.com/auth0/lock/issues/661)

**Added**
- inject cordova plugin and force popup/sso in cordova or electron [\#835](https://github.com/auth0/lock/pull/835) ([glena](https://github.com/glena))
- Japanese translation [\#834](https://github.com/auth0/lock/pull/834) ([stevensacks](https://github.com/stevensacks))
- disable submit button when the email does not match with any connection [\#757](https://github.com/auth0/lock/pull/757) ([glena](https://github.com/glena))

**Changed**
- Clear invalid fields on screen change [\#844](https://github.com/auth0/lock/pull/844) ([glena](https://github.com/glena))
- Bump the babel-preset-2015 version [\#838](https://github.com/auth0/lock/pull/838) ([iamkevingreen](https://github.com/iamkevingreen))


## [v10.10.2](https://github.com/auth0/lock/tree/v10.10.2) (2017-01-23)
[Full Changelog](https://github.com/auth0/lock/compare/v10.10.1...v10.10.2)


**Fixed**
- Fix casing of null in IE (bumping auth0.js version) [\#827](https://github.com/auth0/lock/pull/827) ([glena](https://github.com/glena))
- Fix ES translations [\#826](https://github.com/auth0/lock/pull/826) ([perpifran](https://github.com/perpifran))
- Translated term mfaLoginTitle into Dutch [\#820](https://github.com/auth0/lock/pull/820) ([dctoon](https://github.com/dctoon))
- For autologin, if login screen is not available, it should show the error in the signup one instead of breaking [\#817](https://github.com/auth0/lock/pull/817) ([glena](https://github.com/glena))


## [v10.10.1](https://github.com/auth0/lock/tree/v10.10.1) (2017-01-19)
[Full Changelog](https://github.com/auth0/lock/compare/v10.10.0...v10.10.1)


**Changed**
- Bump auth0.js to 8.1.2 [\#821](https://github.com/auth0/lock/pull/821) ([glena](https://github.com/glena))


## [v10.10.0](https://github.com/auth0/lock/tree/v10.10.0) (2017-01-17)
[Full Changelog](https://github.com/auth0/lock/compare/v10.9.2...v10.10.0)

**Closed issues**
- Lock v10.9.2 fails on IE 10 Windows 7 [\#801](https://github.com/auth0/lock/issues/801)

**Added**
- Add resumeAuth method and autoParseHash flag [\#790](https://github.com/auth0/lock/pull/790) ([luisrudge](https://github.com/luisrudge))
- Hide first screen title option [\#745](https://github.com/auth0/lock/pull/745) ([glena](https://github.com/glena))

**Changed**
- Update zh.js [\#774](https://github.com/auth0/lock/pull/774) ([leplay](https://github.com/leplay))

**Fixed**
- Fix: popup does not close when signup fails [\#810](https://github.com/auth0/lock/pull/810) ([glena](https://github.com/glena))
- removes scope openid warning in OIDC conformant mode. fix #780 [\#803](https://github.com/auth0/lock/pull/803) ([luisrudge](https://github.com/luisrudge))
- Clearing fields when lock closes [\#802](https://github.com/auth0/lock/pull/802) ([luisrudge](https://github.com/luisrudge))
- Fix redirect/popup login when shown in the hosted login page [\#799](https://github.com/auth0/lock/pull/799) ([glena](https://github.com/glena))

**Breaking changes**
- Bump auth0.js version - Fix profile casing (it should not convert to cammelcase) [\#815](https://github.com/auth0/lock/pull/815) ([glena](https://github.com/glena))

In lock v10.9 we introduced an issue in auth0.js that changed the casing of the calls to retrieve the user profile (using `/userinfo` or `/tokeninfo`), everything was converted to camel case. We fixed that issue in this [auth0.js pull request](https://github.com/auth0/auth0.js/pull/307) and is part of this release of Lock. If you kept an v10.8 or older no changes are needed, for those who updated to v10.9 you need to revert the changes made to handle the case changes.

## [v10.9.2](https://github.com/auth0/lock/tree/v10.9.2) (2017-01-11)
[Full Changelog](https://github.com/auth0/lock/compare/v10.9.1...v10.9.2)

**Fixed**
- Bring back support for get profile in default mode [\#794](https://github.com/auth0/lock/pull/794) ([glena](https://github.com/glena))
- Don't emit error when registering for event 'signin ready' [\#784](https://github.com/auth0/lock/pull/784) ([theopak](https://github.com/theopak))


## [v10.9.1](https://github.com/auth0/lock/tree/v10.9.1) (2017-01-10)
[Full Changelog](https://github.com/auth0/lock/compare/v10.9.0...v10.9.1)

**Fixed**
- Fix to comply legacy behaviour [\#787](https://github.com/auth0/lock/pull/787) ([glena](https://github.com/glena))
- For legacy flow, the scope should default to openid [\#783](https://github.com/auth0/lock/pull/783) ([glena](https://github.com/glena))


## [v10.9.0](https://github.com/auth0/lock/tree/v10.9.0) (2017-01-09)
[Full Changelog](https://github.com/auth0/lock/compare/v10.8.0-beta.5...v10.9.0)

**Added**
- Migrate to auth0.js v8 [\#744](https://github.com/auth0/lock/pull/744) ([glena](https://github.com/glena))

**Changed**
- Removed browserify as dependency and removed process usage [\#779](https://github.com/auth0/lock/pull/779) ([glena](https://github.com/glena))
- Auth0js v8 - configuration validation + default scope [\#775](https://github.com/auth0/lock/pull/775) ([glena](https://github.com/glena))


## [v10.8.1](https://github.com/auth0/lock/tree/v10.8.1) (2017-01-03)
[Full Changelog](https://github.com/auth0/lock/compare/v10.8.0...v10.8.1)

**Closed issues**
- username/password login doesn't work with custom domains on the appliance [\#772](https://github.com/auth0/lock/issues/772)

**Fixed**
- allow to override tenant + issuer and pass to auth0.js [\#773](https://github.com/auth0/lock/pull/773) ([glena](https://github.com/glena))


## [v10.8.0](https://github.com/auth0/lock/tree/v10.8.0) (2017-01-02)
[Full Changelog](https://github.com/auth0/lock/compare/v10.7.3...v10.8.0)

**Closed issues**
- Request to add user-facing error message. [\#751](https://github.com/auth0/lock/issues/751)
- Please throw an error for invalid events [\#748](https://github.com/auth0/lock/issues/748)
- Old errors shown when reopening Lock [\#739](https://github.com/auth0/lock/issues/739)
- Send login_hint when detecting previous session [\#729](https://github.com/auth0/lock/issues/729)
- `defaultADUsernameFromEmailPrefix` is not implemented [\#713](https://github.com/auth0/lock/issues/713)
- [v10] Enterprise connections don't strip domain from email [\#543](https://github.com/auth0/lock/issues/543)

**Added**
- Allow to override socialButtonStyle on show [\#766](https://github.com/auth0/lock/pull/766) ([glena](https://github.com/glena))
- Added new error code: session_missing [\#760](https://github.com/auth0/lock/pull/760) ([glena](https://github.com/glena))
- Add events validation and fail if it is not a valid one [\#756](https://github.com/auth0/lock/pull/756) ([glena](https://github.com/glena))
- Added flag defaultADUsernameFromEmailPrefix [\#754](https://github.com/auth0/lock/pull/754) ([glena](https://github.com/glena))
- Send login_hint when detecting previous session [\#753](https://github.com/auth0/lock/pull/753) ([glena](https://github.com/glena))
- Create fa.js [\#752](https://github.com/auth0/lock/pull/752) ([doroudi](https://github.com/doroudi))

**Changed**
- Hide errors after close lock [\#761](https://github.com/auth0/lock/pull/761) ([glena](https://github.com/glena))

**Fixed**
- removed whitespace from input name [\#764](https://github.com/auth0/lock/pull/764) ([dangler](https://github.com/dangler))
- fixed typo [\#762](https://github.com/auth0/lock/pull/762) ([dev101](https://github.com/dev101))


## [v10.7.3](https://github.com/auth0/lock/tree/v10.7.3) (2016-12-19)
[Full Changelog](https://github.com/auth0/lock/compare/v10.7.2...v10.7.3)

**Fixed**
- Shorten Russian signUpLabel to fit into the widget width [\#743](https://github.com/auth0/lock/pull/743) ([cyxou](https://github.com/cyxou))

## [v10.7.2](https://github.com/auth0/lock/tree/v10.7.2) (2016-12-01)
[Full Changelog](https://github.com/auth0/lock/compare/v10.7.1...v10.7.2)

**Fixed**
- Fix how the tenant and application info url is build to avoid format issues [\#740](https://github.com/auth0/lock/pull/740) ([glena](https://github.com/glena))
- Fix: Single saml connection with no domain shows undefined in button [\#738](https://github.com/auth0/lock/pull/738) ([glena](https://github.com/glena))

## [v10.7.1](https://github.com/auth0/lock/tree/v10.7.1) (2016-11-25)
[Full Changelog](https://github.com/auth0/lock/compare/v10.7.0...v10.7.1)

**Fixed**
- fix options override on show [\#732](https://github.com/auth0/lock/pull/732) ([glena](https://github.com/glena))
- One questionmark is enough [\#731](https://github.com/auth0/lock/pull/731) ([retorquere](https://github.com/retorquere))

## [v10.7.0](https://github.com/auth0/lock/tree/v10.7.0) (2016-11-22)
[Full Changelog](https://github.com/auth0/lock/compare/v10.6.1...v10.7.0)

**Added**
- Add missing Norwegian translations [\#721](https://github.com/auth0/lock/pull/721) ([francisrath](https://github.com/francisrath))

**Changed**
- Update auth0.js to v7.5.0 [\#730](https://github.com/auth0/lock/pull/730) ([hzalaz](https://github.com/hzalaz))
- "Email" type for email input [\#724](https://github.com/auth0/lock/pull/724) ([glena](https://github.com/glena))
- Enterprise: force username for AD connections [\#714](https://github.com/auth0/lock/pull/714) ([glena](https://github.com/glena))

**Deprecated**
- Deprecated getProfile and added getUserInfo instead [\#726](https://github.com/auth0/lock/pull/726) ([glena](https://github.com/glena))

## [v10.6.1](https://github.com/auth0/lock/tree/v10.6.1) (2016-11-09)
[Full Changelog](https://github.com/auth0/lock/compare/v10.6.0...v10.6.1)

**Fixed**
- Removed UMD bundling and using browser only [\#709](https://github.com/auth0/lock/pull/709) ([glena](https://github.com/glena))

## [v10.6.0](https://github.com/auth0/lock/tree/v10.6.0) (2016-11-07)
[Full Changelog](https://github.com/auth0/lock/compare/v10.5.1...v10.6.0)

**Changed**
- Update auth0.js to 7.4.0 [\#705](https://github.com/auth0/lock/pull/705) ([hzalaz](https://github.com/hzalaz))
- allow to override language, dict, logo and primary color on show method [\#680](https://github.com/auth0/lock/pull/680) ([glena](https://github.com/glena))
- Webpack for bundling [\#663](https://github.com/auth0/lock/pull/663) ([glena](https://github.com/glena))

**Fixed**
- Disable passwordless connections for SSO [\#691](https://github.com/auth0/lock/pull/691) ([glena](https://github.com/glena))

## [v10.5.1](https://github.com/auth0/lock/tree/v10.5.1) (2016-10-28)
[Full Changelog](https://github.com/auth0/lock/compare/v10.5.0...v10.5.1)

**Closed issues**
- [Lock 10.5.0] Prefill fails when using username [\#685](https://github.com/auth0/lock/issues/685)
- [Lock 10.5.0] "TypeError: next is not a function" when closing social connection popup [\#682](https://github.com/auth0/lock/issues/682)

**Fixed**
- Disabled username verification for prefill [\#686](https://github.com/auth0/lock/pull/686) ([glena](https://github.com/glena))
- 'TypeError: next is not a function' when closing social connection popup [\#684](https://github.com/auth0/lock/pull/684) ([glena](https://github.com/glena))
- Fix focus visual feedback in email and username inputs [\#681](https://github.com/auth0/lock/pull/681) ([gnandretta](https://github.com/gnandretta))

## [v10.5.0](https://github.com/auth0/lock/tree/v10.5.0) (2016-10-24)
[Full Changelog](https://github.com/auth0/lock/compare/v10.4.1...v10.5.0)

**Closed issues**
- [v10.4.0] Cannot read property 'get' of undefined.  [\#658](https://github.com/auth0/lock/issues/658)
- Lock not showing rule errors in redirect mode [\#637](https://github.com/auth0/lock/issues/637)
- Single AD connection without domain shows undefined in message [\#627](https://github.com/auth0/lock/issues/627)
- Issues with Overlay mode + signUpLink setting on a SPA [\#619](https://github.com/auth0/lock/issues/619)
- [UX] Password field shouldn't show error message immediately (on focus). [\#540](https://github.com/auth0/lock/issues/540)

**Added**
- Create vi.js in /src/i18n [\#662](https://github.com/auth0/lock/pull/662) ([IoHL](https://github.com/IoHL))
- Added support for custom oauth2 connections [\#648](https://github.com/auth0/lock/pull/648) ([glena](https://github.com/glena))
- Create ca.js [\#645](https://github.com/auth0/lock/pull/645) ([alexandresaiz](https://github.com/alexandresaiz))
- Support connectionScopes for oauth2 connections [\#643](https://github.com/auth0/lock/pull/643) ([glena](https://github.com/glena))
- Allow to display a flash message on lock.show [\#639](https://github.com/auth0/lock/pull/639) ([glena](https://github.com/glena))
- MFA when using  oauth/ro endpoint [\#628](https://github.com/auth0/lock/pull/628) ([dafortune](https://github.com/dafortune))

**Changed**
- Password field shouldn't show error message immediately (on focus) [\#668](https://github.com/auth0/lock/pull/668) ([glena](https://github.com/glena))
- Update auth0.js to latest [\#665](https://github.com/auth0/lock/pull/665) ([hzalaz](https://github.com/hzalaz))
- Added default values to the dictionary and warn about missing keys [\#651](https://github.com/auth0/lock/pull/651) ([glena](https://github.com/glena))
- Fix Issues with Overlay mode + signUpLink setting on a SPA [\#650](https://github.com/auth0/lock/pull/650) ([glena](https://github.com/glena))
- Only require non-empty value for username when DB connection is custom or import is enabled [\#646](https://github.com/auth0/lock/pull/646) ([glena](https://github.com/glena))
- Update uglify task to generate sourcemaps [\#638](https://github.com/auth0/lock/pull/638) ([cristiandouce](https://github.com/cristiandouce))

**Fixed**
- Fix [v10.4.0] Cannot read property 'get' of undefined. #658 [\#660](https://github.com/auth0/lock/pull/660) ([glena](https://github.com/glena))
- Changed &nbsp; to regular spaces. [\#653](https://github.com/auth0/lock/pull/653) ([nicosabena](https://github.com/nicosabena))
- Single AD connection without domain shows undefined in message [\#642](https://github.com/auth0/lock/pull/642) ([glena](https://github.com/glena))
- show properly terms on desktop and mobile [\#641](https://github.com/auth0/lock/pull/641) ([beneliflo](https://github.com/beneliflo))
- Fix typo in the word "corporate" [\#632](https://github.com/auth0/lock/pull/632) ([wags](https://github.com/wags))
- Change the term email to e-mail and emailadres to e-mailadres [\#629](https://github.com/auth0/lock/pull/629) ([ToonDC](https://github.com/ToonDC))

## [v10.4.1](https://github.com/auth0/lock/tree/v10.4.0) (2016-10-21)
[Full Changelog](https://github.com/auth0/lock/compare/v10.4.0...v10.4.1)

**Changed**
- Update auth0.js to v7.3.0

## [v10.4.0](https://github.com/auth0/lock/tree/v10.4.0) (2016-09-27)
[Full Changelog](https://github.com/auth0/lock/compare/v10.3.0...v10.4.0)

**Closed issues**
- theme.logo regression in 10.3.0 [\#617](https://github.com/auth0/lock/issues/617)

**Changed**
- Update auth0.js version to v7.2.1 [\#621](https://github.com/auth0/lock/pull/621) ([hzalaz](https://github.com/hzalaz))

**Fixed**
- Fix bad reference for unrecoverable_error event emitter [\#625](https://github.com/auth0/lock/pull/625) ([cristiandouce](https://github.com/cristiandouce))
- Fixes for 10.3.0 regression [\#618](https://github.com/auth0/lock/pull/618) ([doapp-ryanp](https://github.com/doapp-ryanp))

## [v10.3.0](https://github.com/auth0/lock/tree/v10.3.0) (2016-09-19)
[Full Changelog](https://github.com/auth0/lock/compare/v10.2.2...v10.3.0)

**Closed issues:**
- v10: KerberosScreen failing on internal Network [\#590](https://github.com/auth0/lock/issues/590)
- Languages not available on cdn.eu.auth0.com [\#576](https://github.com/auth0/lock/issues/576)
- The lock v10 with ionic2 page can not scroll. [\#532](https://github.com/auth0/lock/issues/532)
- Signup terms checkbox overlays password field on small devices. [\#525](https://github.com/auth0/lock/issues/525)
- Lock + Meteor breaks when trying to require & use blueimp-md5 [\#466](https://github.com/auth0/lock/issues/466)
- White space on bottom when running/simulating on mobile device [\#376](https://github.com/auth0/lock/issues/376)

**Fixed:**
- Bump blueimp-md5@2.3.1 [\#613](https://github.com/auth0/lock/pull/613) ([cristiandouce](https://github.com/cristiandouce))
- Handle uncaught unrecoverable_error [\#609](https://github.com/auth0/lock/pull/609) ([eddiezane](https://github.com/eddiezane))
- fixed loading unaligned with label submit [\#606](https://github.com/auth0/lock/pull/606) ([beneliflo](https://github.com/beneliflo))
- Fix EscKeyDownHandler bug in Container when `closable` is false [\#604](https://github.com/auth0/lock/pull/604) ([kevinzwh](https://github.com/kevinzwh))
- Fix checkbox terms [\#597](https://github.com/auth0/lock/pull/597) ([beneliflo](https://github.com/beneliflo))
- Fixes corporate network connection usage [\#594](https://github.com/auth0/lock/pull/594) ([CriGoT](https://github.com/CriGoT))
- fixed ionic page scroll [\#591](https://github.com/auth0/lock/pull/591) ([beneliflo](https://github.com/beneliflo))

**Added:**
- Add min/max username validation from application info settings [\#611](https://github.com/auth0/lock/pull/611) ([cristiandouce](https://github.com/cristiandouce))
- Introduce clientBaseUrl and languageBaseUrl options to deprecate assetsUrl [\#601](https://github.com/auth0/lock/pull/601) ([cristiandouce](https://github.com/cristiandouce))
- Added Hungarian translations [\#599](https://github.com/auth0/lock/pull/599) ([nagyv](https://github.com/nagyv))
- Add french translation [\#596](https://github.com/auth0/lock/pull/596) ([RomainFallet](https://github.com/RomainFallet))
- Added Swedish (sv) translation. [\#593](https://github.com/auth0/lock/pull/593) ([kuljaninemir](https://github.com/kuljaninemir))

**Changed:**
- use ReactCSSTransitionGroup for global messages [\#595](https://github.com/auth0/lock/pull/595) ([robbiewxyz](https://github.com/robbiewxyz))

**Deprecation notice:**

This version introduces `languageBaseUrl` and `clientBaseUrl` in replacement of `assetsUrl`.

- The application will be fetched from `${clientBaseUrl}/${clientID}.js` and will default to the CDN url including the region (e.g. `https://cdn.eu.auth0.com/client`). The region is inferred from the `domain`.
- The language will be fetched from `${languageBaseUrl}/${lang}.js` and will default to the CDN without the region (e.g. `https://cdn.auth0.com/js/lock/${lockVersion}/`).
- The new options have priority over `assetsUrl`.
- If `assetsUrl` is provided, keep the current behavior: fetch application from `${assetsUrl}/client/${clientID}.js` and languages from `{assetsUrl}/js/lock/${lockVersion}/${language}.js`.

## [v10.2.3](https://github.com/auth0/lock/tree/v10.2.3) (2016-10-21)
[Full Changelog](https://github.com/auth0/lock/compare/v10.2.2...v10.2.3)

### Changed

- Use auth0.js version 7.3.0

## [v10.2.2](https://github.com/auth0/lock/tree/v10.2.2) (2016-08-31)
[Full Changelog](https://github.com/auth0/lock/compare/v10.2.1...v10.2.2)

### Fixed

- Decode window.location.href before parsing hash (#583)

### Changed

- Change the default value for hash in WebApi.parseHash() internal method (#587)

## [v10.2.1](https://github.com/auth0/lock/tree/v10.2.1) (2016-08-18)
[Full Changelog](https://github.com/auth0/lock/compare/v10.2.0...v10.2.1)

### Fixed

- Allow dots in HRD username and clear errors before leaving the HRD screen (#574)

## [v10.2.0](https://github.com/auth0/lock/tree/v10.2.0) (2016-08-18)
[Full Changelog](https://github.com/auth0/lock/compare/v10.1.0...v10.2.0)

### Changed

- Show a label in the submit button by default (#524)
- Show the Auth0 badge only in modal mode and on the bottom left of the overlay (#552)
- Replace the log in / sign up segmented control for tabs (#553)

### Fixed

- German translation corrections (#549)

### Added

- Add `responseMode: "form_post"` option (#526)
- Add the `hash_parsed` event (#535)
- Add `zh` translation (#548)
- Allow to override some options in the `show` method (#550)
- Add `nb` translation (#560)

## [v10.1.0](https://github.com/auth0/lock/tree/v10.1.0) (2016-08-09)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.2...v10.1.0)

### Added

- Add `de` translation (#546)

## [v10.0.2](https://github.com/auth0/lock/tree/v10.0.2) (2016-08-05)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.1...v10.0.2)

### Fixed

- Fix header in Edge (#528)
- Allow to reuse a given container id (#533)
- Stop showing last login screen when the initial screen is not login (#534)
- Fix email input in IE 10 (#537)

## [v10.0.1](https://github.com/auth0/lock/tree/v10.0.1) (2016-07-27)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0...v10.0.1)

### Fixed

- Stopped dropping keys on email input in IE (#505)
- Protect against svgs background colors set by other stylesheets (#506)
- Ensure header styling looks fine in IE (#507)

## [v10.0.0](https://github.com/auth0/lock/tree/v10.0.0) (2016-07-20)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-rc.2...v10.0.0)

### Changed

- The `parseHash` method was removed given that now it is
  automatically handled by Lock.

### Fixed

- Stopped hiding errors that are raised from event listeners.

### Added

- Handle the new variants of password policy errors during sign up.

## [v10.0.0-rc.2](https://github.com/auth0/lock/tree/v10.0.0-rc.2) (2016-07-05)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-rc.1...v10.0.0-rc.2)

### Fixed

- Fixed issue with the blueimp library when bundling with webpack.
- Stopped fetching SSO data when SSO is disabled.
- The location hash is no longer cleared every time Lock is
  initialized.

### Added

- The validator function for additional sign up fields now allows to
  specify a hint that will be displayed when the field is invalid.

## [v10.0.0-rc.1](https://github.com/auth0/lock/tree/v10.0.0-rc.1) (2016-06-22)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-beta.5...v10.0.0-rc.1)d

### Change

- Show Auth0 badge in the bottom only for free plans.

## [v10.0.0-beta.5](https://github.com/auth0/lock/tree/v10.0.0-beta.5) (2016-06-21)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-beta.4...v10.0.0-beta.5)

### Fixed

- Fixed bug that prevented custom sign up fields from being
  validated.

### Changed

- Upgraded to React v15.
- Upgraded auth0.js to v7.0.3.

### Added

- Added the `language` option. Translations for `it`, `pt-br`, `ru`
  and `es` are provided out of the box. Thanks @yvonnewilson, @dirceu,
  @lilapustovoyt and @darkyen!
- Lock now will emit the following events.
  - `show`: emitted when Lock is shown. Has no arguments.
  - `hide`: emitted when Lock is hidden. Has no arguments.
  - `unrecoverable_error`: emitted when there is an unrecoverable
    error, for instance when no connection is available. Has the error
    as the only argument.
  - `authenticated`: emitted after a successful authentication. Has
    the authentication result as the only argument.
  - `authorization_error`: emitted when authorization fails. Has the
    error as the only argument.
  Note the `authenticated` and `authorization_error` events replace
  the callback in the constructor.
- Display a tooltip on invalid inputs with a hint on how to fix the
  error.

## [v10.0.0-beta.4](https://github.com/auth0/lock/tree/v10.0.0-beta.4) (2016-05-17)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-beta.3...v10.0.0-beta.4)

### Fixed

- A proper error message is shown when no connection is available.

### Changed

- Removed JSONP support.

### Added

- Support for the new Bitbucket and Dropbox social connections.
- Additional sign up fields can now be prefilled and have a `select`
  type, which allows the user to choose the value from a predefined
  list of options.

## [v10.0.0-beta.3](https://github.com/auth0/lock/tree/v10.0.0-beta.3) (2016-05-10)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-beta.2...v10.0.0-beta.3)

### Fixed

- Allow to translate password strength messages.

### Changed

- Don't fetch profile automatically after a successful login.
- Display just an email input in the forgot password screen. Before,
  an username input was displayed when the connection required an
  username.

## [v10.0.0-beta.2](https://github.com/auth0/lock/tree/v10.0.0-beta.2) (2016-04-25)
[Full Changelog](https://github.com/auth0/lock/compare/v10.0.0-beta.1...v10.0.0-beta.2)

### Fixed

- Fetch bigger gravatars, so they look better on high-density screens.
- Don't fetch SSO data when SSO is disabled.
- Bunch of small UI issues.
- NPM package require. Now `require('auth0-lock')` will work (previously you had to do `require('auth0-lock/lib/classic')`).

### Changed

- Renamed `close` method to `hide`.
- Renamed `connections` option to `allowedConnections`.
- Renamed `signUp.footerText` dict key to `signUp.terms`.

### Added

- Support for enterprise connections.
- Allow to specify the the default datbase connection via the
  `defaultDatabaseConnection` option.
- Optionally request users to agree to terms and conditions before
  signing up via the `mustAcceptTerms` option.

## [v10.0.0-beta.1](https://github.com/auth0/lock/tree/v10.0.0-beta.1) (2016-03-23)

First preview release, see [https://auth0.com/docs/libraries/lock/v10](https://auth0.com/docs/libraries/lock/v10) for details.
