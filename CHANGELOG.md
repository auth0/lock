## [10.2.1] - 2016-08-18

### Fixed

- Allow dots in HRD username and clear errors before leaving the HRD screen (#574)

## [10.2.0] - 2016-08-18

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

## [10.1.0] - 2016-08-09

### Added

- Add `de` translation (#546)

## [10.0.2] - 2016-08-05

### Fixed

- Fix header in Edge (#528)
- Allow to reuse a given container id (#533)
- Stop showing last login screen when the initial screen is not login (#534)
- Fix email input in IE 10 (#537)

## [10.0.1] - 2016-07-27

### Fixed

- Stopped dropping keys on email input in IE (#505)
- Protect against svgs background colors set by other stylesheets (#506)
- Ensure header styling looks fine in IE (#507)

## [10.0.0] - 2016-07-20

### Changed

- The `parseHash` method was removed given that now it is
  automatically handled by Lock.

### Fixed

- Stopped hiding errors that are raised from event listeners.

### Added

- Handle the new variants of password policy errors during sign up.

## [10.0.0-rc.2] - 2016-07-05

### Fixed

- Fixed issue with the blueimp library when bundling with webpack.
- Stopped fetching SSO data when SSO is disabled.
- The location hash is no longer cleared every time Lock is
  initialized.

### Added

- The validator function for additional sign up fields now allows to
  specify a hint that will be displayed when the field is invalid.

## [10.0.0-rc.1] - 2016-06-22

### Changed

- Show Auth0 badge in the bottom only for free plans.

## [10.0.0-beta.5] - 2016-06-21

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

## [10.0.0-beta.4] - 2016-05-17

### Fixed

- A proper error message is shown when no connection is available.

### Changed

- Removed JSONP support.

### Added

- Support for the new Bitbucket and Dropbox social connections.
- Additional sign up fields can now be prefilled and have a `select`
  type, which allows the user to choose the value from a predefined
  list of options.

## [10.0.0-beta.3] - 2016-05-10

### Fixed

- Allow to translate password strength messages.

### Changed

- Don't fetch profile automatically after a successful login.
- Display just an email input in the forgot password screen. Before,
  an username input was displayed when the connection required an
  username.

## [10.0.0-beta.2] - 2016-04-25

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

## [10.0.0-beta.1] - 2016-03-23

First preview release, see [https://auth0.com/docs/libraries/lock/v10](https://auth0.com/docs/libraries/lock/v10) for details.
