#Change Log

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
# Change Log

## [v10.7.3](https://github.com/auth0/lock/tree/v10.7.3) (2016-12-19)
[Full Changelog](https://github.com/auth0/lock/compare/v10.7.2...v10.7.3)

**Fixed**
- Shorten Russian signUpLabel to fit into the widget width [\#743](https://github.com/auth0/lock/pull/743) ([cyxou](https://github.com/cyxou))

## [v10.7.2](https://github.com/auth0/lock/tree/v10.7.2) (2016-12-01)
[Full Changelog](https://github.com/auth0/lock/compare/v10.7.1...v10.7.2)

**Fixed**
- Fix how the tenant and client info url is build to avoid format issues [\#740](https://github.com/auth0/lock/pull/740) ([glena](https://github.com/glena))
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
- Add min/max username validation from client info settings [\#611](https://github.com/auth0/lock/pull/611) ([cristiandouce](https://github.com/cristiandouce))
- Introduce clientBaseUrl and languageBaseUrl options to deprecate assetsUrl [\#601](https://github.com/auth0/lock/pull/601) ([cristiandouce](https://github.com/cristiandouce))
- Added Hungarian translations [\#599](https://github.com/auth0/lock/pull/599) ([nagyv](https://github.com/nagyv))
- Add french translation [\#596](https://github.com/auth0/lock/pull/596) ([RomainFallet](https://github.com/RomainFallet))
- Added Swedish (sv) translation. [\#593](https://github.com/auth0/lock/pull/593) ([kuljaninemir](https://github.com/kuljaninemir))

**Changed:**
- use ReactCSSTransitionGroup for global messages [\#595](https://github.com/auth0/lock/pull/595) ([robbiewxyz](https://github.com/robbiewxyz))

**Deprecation notice:**

This version introduces `languageBaseUrl` and `clientBaseUrl` in replacement of `assetsUrl`.

- The client will be fetched from `${clientBaseUrl}/${clientID}.js` and will default to the CDN url including the region (e.g. `https://cdn.eu.auth0.com/client`). The region is inferred from the `domain`.
- The language will be fetched from `${languageBaseUrl}/${lang}.js` and will default to the CDN without the region (e.g. `https://cdn.auth0.com/js/lock/${lockVersion}/`).
- The new options have priority over `assetsUrl`.
- If `assetsUrl` is provided, keep the current behavior: fetch client from `${assetsUrl}/client/${clientID}.js` and languages from `{assetsUrl}/js/lock/${lockVersion}/${language}.js`.

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
