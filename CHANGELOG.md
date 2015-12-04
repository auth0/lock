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
