# Change Log
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

This version introduces `languageBaseUrl` and `cliengBaseUrl` in replacement of `assetsUrl`.

- The client will be fetched from `${clientBaseUrl}/${clientID}.js` and will default to the CDN url including the region (e.g. `https://cdn.eu.auth0.com/client`). The region is inferred from the `domain`.
- The language will be fetched from `${languageBaseUrl}/${lang}.js` and will default to the CDN without the region (e.g. `https://cdn.auth0.com/js/lock/${lockVersion}/`).
- The new options have priority over `assetsUrl`.
- If `assetsUrl` is provided, keep the current behavior: fetch client from `${assetsUrl}/client/${clientID}.js` and languages from `{assetsUrl}/js/lock/${lockVersion}/${language}.js`.

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
