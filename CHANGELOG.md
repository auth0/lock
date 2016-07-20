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

## [2.2.1] - 2016-01-18

### Changed

- Some font alternatives are provided instead of defaulting to sans-serif immediately on systems without Avenir.

### Fixed

- Pass `authParams` option in a social login.

## [2.2.0] - 2016-01-14

### Changed

- Make it easy to bundle the module with [browserify](https://browserify.org) or [webpack](https://webpack.github.io/). Custom transforms or loaders are no longer needed. **Please review your bundling process when upgrading to this version**.

## [2.1.1] - 2016-01-07

### Fixed

- Namespace style normalization rules inside .auth0-lock.

## [2.1.0] - 2016-01-06

### Changed

- Allow spaces and hyphens in phone numbers.
- Upgrade to React v0.14.5.
- Upgrade to Auth0.js v6.8.0.

### Added

- Add a back button when selecting a country code.

### Fixed

- Force all characters to lower-case when creating the Gravatar's md5 hash.
- Fix resend magic link button in applications using [page.js](https://github.com/visionmedia/page.js).

## [2.0.1] - 2015-12-04

### Fixed

- Ensure Facebook page looks fine in the popup.

## [2.0.0] - 2015-12-03

### Changed

- The Lock can now be reopened after it is closed.
- When a `defaultLocation` option is not provided the country code will be derived from the user's geo-location. If it can't be obtained before the Lock is shown, it will default to _+1 (US)_.
- Some dictionary keys, used for confirmation screens have been renamed:
  - `emailcode.confirmation` was changed to `emailcode.signedIn`.
  - `magiclink.confirmation` was changed to `magiclink.emailSent`.
  - `sms.confirmation` was changed to `sms.signedIn`.
- Upgraded to React v0.14.3. Thanks @joelburget.
- Upgraded to Auth0.js 6.7.7.

### Added

- A warning will be shown when a `scope="openid profile"` is used. Can be avoided with the `disableWarnings` option.
- Now the Lock allows to authenticate with social providers by calling the `social` method. The behavior can be controlled with the new `connections` and `socialBigButtons` options.
- It is possible to mix social authentication with all the previously provided passwordless alternatives by calling `socialOrMagiclink`, `socialOrEmailcode` or `socialOrSms`.
- A `destroy` method has been added since calling `close` no longer frees the Lock's resources.

### Fixed

- Some styling tweaks in the Lock's header.
- Footer text was displayed incorrectly in small screens.

## [1.0.2] - 2015-09-30

### Changed

- Make phone number and verification code inputs bring up a numeric keyboard on mobile devices.

### Fixed

- Debounce Gravatar requests.
- Use always the same height for the header icon.
- Ensure the title always shows up always in the same place.
- Fix close and back buttons on some old IE versions, they weren't responding to the click event.
- Ensure the Lock is displayed correctly in pages with z-ordered elements (as long as their values are less than 10.000.00).
- Use colors taken from the Gravatar for the header background.

## [1.0.1] - 2015-09-30

### Added

- Specific error message for invalid phone numbers.

### Fixed

- Playground styling.

## [1.0.0] - 2015-09-30

- First public release.

## [0.9.0] - 2015-09-30

- First public pre-release.
