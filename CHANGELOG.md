
## 7.3.1 - (March 24, 2015)

### Fixed

 - [translation] Small fix to German translations (de.json) (`cristiandouce - Jeroenr1`)
  https://github.com/auth0/lock/commit/9bdadf3445a94a84c06f9923b76cbbb920505f72
  https://github.com/auth0/lock/commit/945fb2654bd36810028b57e86c4a768383a46e4e

## 7.3.0 - (March 19, 2015)

### Added

 - [error] Improving offline error reporting. (Updated to auth0.js@6.1.0) (`pose`)
  https://github.com/auth0/lock/commit/f978d548d37cfb451a24b2d86ac1419081a82964
  https://github.com/auth0/lock/commit/42726ae2d273d6cb3a268e5ca6d70c211e9e2393
 - [translation] Added Swedish translations (sv.json) (`pose - alexkerber`)
  https://github.com/auth0/lock/commit/01edbdb198ca0c0f23fbddeef48e39a26d736428
  https://github.com/auth0/lock/commit/2f0fa9632603ad63a54741fbc70dfe59dfc65235
  https://github.com/auth0/lock/commit/e8ee91fcff5743bfd2d3f5c90bb5e4ed99e351da

## 7.2.0 - (March 16, 2015)

### Changed

 - [jsonp] Make `getClientConfiguration` JSONP script insertion into DOM more reliable (Use `<head>` instead of last `<script>` tag) (`barneycarroll`)
  https://github.com/auth0/lock/commit/0f2c0f8ae700d6eca0df226a7eac5c8589bf763a

### Fixed

 - [errors] Fixed [#141](https://github.com/auth0/lock/issues/141): Clear errors when the view has changed. (`cristiandouce - tehsis`)
  https://github.com/auth0/lock/commit/72057654d4f69c768d54ce2037fd58ebf79dbef3
  https://github.com/auth0/lock/commit/5ac3abad9862f1e830df0fade4524ce82dbddbe4

### Added

 - [general] Add `footerText` to signin and reset views (`cristiandouce - rolodato`)
  https://github.com/auth0/lock/commit/adf0390b6612f45f73965060e34420c52fa3c2c2
  https://github.com/auth0/lock/commit/68dcd672f7f8ff9ac94e6f8854c1cc627aadb7ff

## 7.1.8 - (March 06, 2015)

### Changed

 - [lock] Changed console.log's calls with debug module. Fixes https://github.com/auth0/lock/issues/106 (`tehsis`)
  https://github.com/auth0/lock/commit/8f84b883ea19a4acd1ef820304ed849c27972edb
   https://github.com/auth0/lock/commit/bb88ffc9dcd0ed76f199485eb095b122a457a3a0
   https://github.com/auth0/lock/commit/c00b483dd54b5cfc57b7f63185461273ef92bf01

## 7.1.7 - (March 04, 2015)

### Fixed
 - [lock] Improved password error display. Fixes https://github.com/auth0/lock/issues/83 (`tehsis`)
  https://github.com/auth0/lock/commit/2902e7b0eb3f53f6a627a613c0faccfb93813efe

## 7.1.6 - (March 03, 2015)

### Fixed

 - [lock] Properly handles signup when only social connections are used. Fixes https://github.com/auth0/lock/issues/119 (`tehsis`)
  https://github.com/auth0/lock/commit/17b93a694d74c01d3ab45f5970203fcca83faecb


## 7.1.5 - (Feb 25, 2015)

### Fixed

 - [lock] fix(i18n): fix some minor german translation inconsistencies (`gjungb`)
  https://github.com/auth0/lock/commit/5aa6cd9284e803d158071a8575bf4fa9359e8449

## 7.1.4 - (Feb 24, 2015)

### Fixed

 - [lock] Fixes #129: /ro mode not working when called with popup: true and sso: false (`pose`)
  https://github.com/auth0/lock/commit/c80972a89f32a8ea358dd90d54e09c0b7eac2c49

## 7.1.3 - (Feb 17, 2015)

### Changed

 - [lock] Updating to auth0.js 6.0.6:
   * #112: Fixes problems with Phonegap and db connections.
   * If dbconn and callback.length <1 arguments we don't open a popup.
   * Adding popup blocker warning. (`pose`)

  https://github.com/auth0/lock/commit/0e0d726ca58e1119b8914cfadb9ebf1be99741f4

## 7.1.2 - (Feb 17, 2015)

### Fixed

 - [lock] Fixes #122: Correct german translations. (`pose`)
  https://github.com/auth0/lock/commit/9bb2546f2669eef78c74903ce9fca7088cf9dabe

## 7.1.1 - (Feb 2, 2015)

### Added

 - [lock] Update fr-FR.json (Updated to reflect the lastest en.json): When default language is switched to french, it causes an issue with ionic automatic generated sample downloadable from auth0.com, and probably with any configuration using Lock : (`bonatoc`)
  https://github.com/auth0/lock/commit/6cc8bdf358fd660e2b641a011b2d342e3dc29362

### Fixed

 - [lock] Fixes #115: Wrong error message on sign up with sso domain. (`pose`)
  https://github.com/auth0/lock/commit/4d25f3257a97a0fe041c75fadbc3f3a7be4da329

## 7.1.0 - (Feb 2, 2015) [YANKED]

## 7.0.0 - (Jan 27, 2015)

### Changed

 - [lock] Now sso: true works for real (`pose`)
  https://github.com/auth0/lock/commit/525c1f41f9a1df57baf84b6749cbf2629a8c7915
 - [lock] Updating to auth0.js 6.0.2 (`pose`)
  https://github.com/auth0/lock/commit/ece664925a2643ee6be274d353309d1a32c3ed9f

## 6.12.1 - (Jan 23, 2015)

### Changed

 - [lock] Updating to auth0-js 5.5.1 (`pose`)
  https://github.com/auth0/lock/commit/d0f2d1916963dfccd977017d5cf9418a491309f8

## 6.12.0 - (Jan 23, 2015)

### Added

 - [lock] Add flag to enable cordova plugin auth for Lock. (`hzalaz`)
  https://github.com/auth0/lock/commit/cf0a7c07a9a84da432da416e177ae92cb4246ad0

## 6.11.0 - (Jan 23, 2015)

### Changed

 - [lock] Updating to auth0.js 5.5.0 (`pose`)
  https://github.com/auth0/lock/commit/b4da2345ed2827d13300a0d8f42d85ea0d85d68a

## 6.10.6 - (Jan 22, 2015)

### Fixed

 - [lock] Improving iOS detection. (`pose`)
  https://github.com/auth0/lock/commit/7ea0e77cce25fce09bd09e01537d47cecb81b66e

## 6.10.5 - (Jan 22, 2015)

### Fixed

 - [lock] Fixes #107: Lock looks bad on iPhone. (`pose`)
  https://github.com/auth0/lock/commit/b0403e3a177129cc22136af131c4bd080362ef68

## 6.10.4 - (Jan 20, 2015)

### Added

 - [lock] add exact as strategy (`siacomuzzi`)
  https://github.com/auth0/lock/commit/618fe469e3d4a3448664c6960e0bb59268e82011

## 6.10.3 - (Jan 20, 2015)

### Added

 - [lock] Add "exact" social provider icon to Lock (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/a7ea4f0c3f7212c17feb370313b461719d8c38e5

### Fixed

 - [lock] Remove ttf data-uri to reduce file size (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/a9a46fa05eb0a9cfbafe9abb19601f530b963638

## 6.10.2 - (Jan 19, 2015)

### Fixed

 - [lock] fix build for windows (`jfromaniello`)
  https://github.com/auth0/lock/commit/52bcd01b6c7e71aa82815365634dd7a3289d3919


## 6.10.1 - (Jan 16, 2015)

### Added

 - [lock] Update pt-BR.json (`gabrielmoreira`)
  https://github.com/auth0/lock/commit/9884061ddf71ba3ca4a9d58109802e9f4b1e3497
 - [lock] Better message for identicalChars (`gabrielmoreira`)
  https://github.com/auth0/lock/commit/65ef017d381d7babd835408438c000205bdc18d3
 - [lock] Smaller social button text for a better UI (`gabrielmoreira`)
  https://github.com/auth0/lock/commit/9efe72537abcc07412d321cb39c3afc4870bddde
 - [lock] added danish translation (`carnevalle`)
  https://github.com/auth0/lock/commit/1b7d05f9bb2bbf10789218515213faaa4412ebd3
 - [lock] Fix path for danish translations (`cristiandouce`)
  https://github.com/auth0/lock/commit/64a77404874f50aeec0f4831cc015268c3b077fc
 - [lock] Added da.json to dics_data in lib/i18n/index.js (`carnevalle`)
  https://github.com/auth0/lock/commit/18b65bbc04cdf5e191dd039bf6629d6d4080486e
 - [lock] Add support for "signing starting" event (`sandrinodimattia`)
  https://github.com/auth0/lock/commit/49fe7c650cadf231850498b05f96ac6d5fbd00ed
 - [lock] Renamed event 'signing starting' to 'signin' + test (`sandrinodimattia`)
  https://github.com/auth0/lock/commit/d2b387b6a19d4fff2b1986845f5bf1edfed57b79
 - [lock] Make signin event more verbose. Renamed to signin submit. (`sandrinodimattia`)
  https://github.com/auth0/lock/commit/b191cd026f796f69f87396b694d04df06694e9de

### Fixed

 - [lock] remove trailing commas to improve compatibility (`nelix`)
  https://github.com/auth0/lock/commit/20876e56aecedb3a2bde6530e3038a98c0bb6642
 - [lock] Fixes check for console by doing window.close (`pose`)
  https://github.com/auth0/lock/commit/adf0ad269f2980f951bb01bf592fd1dd3e15ce20

### Changed

 - [lock] Using auth0.js version 5.2.2 (`pose`)
  https://github.com/auth0/lock/commit/6b4f5ed8efc7b3e8ebb3a1c1d33b40f474d84e96


## 6.10.0 - (Jan 16, 2015) [YANKED]

## 6.9.0 - (Jan 16, 2015) [YANKED]

## 6.8.4 - (Jan 8, 2015) [YANKED]

## 6.8.3 - (Jan 6, 2015) [YANKED]

## 6.8.2 - (Jan 2, 2015) [YANKED]

## 6.8.1 - (Jan 2, 2015) [YANKED]

## 6.8.0 - (Dec 31, 2014) [YANKED]

## 6.7.1 - (Dec 30, 2014) [YANKED]

## 6.7.0 - (Dec 24, 2014) [YANKED]

## 6.6.5 - (Dec 15, 2014)

### Fixed

 - [lock] remove duplicate keys which break json5

This relates to #54, because most of the other translations require json5-loader for this project to be built with webpack (browserify alternative).
Another idea would be to fix the trailing commas in some of the other translations so they could be loaded with json-loader (which supports duplicate keys). (`nelix`)
  https://github.com/auth0/lock/commit/72d5c63ad12a18f019a8deeadd7f3bb6108c97d2

## 6.6.4 - (Dec 15, 2014)

### Fixed

 - [lock] Password Strength: Fix positioning of pwd strength tooltip, move to css only positioning. (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/8e9bc397526d338ef8d61da92a3b4b08f2d2b2d7

## 6.6.3 - (Dec 15, 2014)

### Changed

 - [lock] override usernameStyle if required by connection (`siacomuzzi`)
  https://github.com/auth0/lock/commit/58f97c2433aa0b93f3b1b77c36c5ce5734751008

### Fixed

 - [lock] Fix strict equal to null. We need to make the null handling clearer in future updates as @pose well suggested (`cristiandouce`)
  https://github.com/auth0/lock/commit/af118f4a1197f305013ba001f44c9201c01560dd

## 6.6.2 - (Dec 3, 2014)

### Added

 - [lock] auth0 lock norwegian translation included (`Nichiatu`)
  https://github.com/auth0/lock/commit/e477e8eda0f9bd8f06587a1669a1336c17e1bcc3
  https://github.com/auth0/lock/commit/206fe4b682691a4d3f77c679fb2c34e2978e9ab1
  https://github.com/auth0/lock/commit/35baf21d4cf51ac07574b21059552e6d21eaec2b

### Changed

 - [lock] Updated auth0.js version (`mgonto`)
  https://github.com/auth0/lock/commit/c661e697e90b830aa0e6dce2041db4471c7d9bdc

## 6.6.1 - (Nov 18, 2014)

### Fixed

 - [lock] Fixes for network error showing async to the load success due to timeout malfunction (`cristiandouce`)
  https://github.com/auth0/lock/commit/f5db6155eddd4690d163c1ba7273a7bb0993186f

## 6.6.0 - (Nov 11, 2014)

### Fixed

 - [lock] Fixing broken translation (`pose`)
  https://github.com/auth0/lock/commit/1f0cd7549a9c1253aa26d7668f2b8f63774c82df
 - [lock] fix overflow problem (`gravityonmars`)
  https://github.com/auth0/lock/commit/efa4c413aae26dbc5faa2a298f254f26fc894bce
 - [lock] fixes css (`gravityonmars`)
  https://github.com/auth0/lock/commit/77ddfaed1276a0281082761e68617553c29e6a8c
 - [lock] pixel perfect (`gravityonmars`)
  https://github.com/auth0/lock/commit/e52dbf0d25fae6c52559c2142d939bde2a629f8c
 - [lock] Fixing default.less merge errors (`pose`)
  https://github.com/auth0/lock/commit/cf4bc13a08d68ef39984e817e700e5ad7290ecf7

### Added

 - [lock] Password strength test (first approach). (`pose`)
  https://github.com/auth0/lock/commit/4e08e2f103f43701e1e14b3ebce175d74574d0af

## 6.5.0 - (Nov 7, 2014)

### Added

 - [lock] Fixes #74: Make Lock fetch Auth0 information from CDN (`pose`)
  https://github.com/auth0/lock/commit/d2cc52f482d30fab826d2241c6ac8388b227cf53
 - [lock] Revert "Fixes #74: Make Lock fetch Auth0 information from CDN" (`pose`)
  https://github.com/auth0/lock/commit/51915631b72a32dacfe6bad67c3f5a75aeec6727
 - [lock] Fixing broken test. (`pose`)
  https://github.com/auth0/lock/commit/b1dbf0005e8055e1b6eacc8e26c13b589885f9be
 - [lock] Fixes #74: Make Lock fetch Auth0 information from CDN (`pose`)
  https://github.com/auth0/lock/commit/3be05bf90ce63219f8a728d9c40542899dece6c2
 - [lock] Password strength implemented (first approach) in Auth0 Lock. (`pose`)
  https://github.com/auth0/lock/commit/a9fe02b9524df73c6f80866a8be932aa78a315a2
 - [lock] Adding password strength to reset mode. (`pose`)
  https://github.com/auth0/lock/commit/e53ed893e8387e150e8ee8a6feb013ccb1041e52
 - [lock] i18n: Adding invalidPassword message to reset. (`pose`)
  https://github.com/auth0/lock/commit/1d9e980db8d6dbde2a56c5c07c13a2b08ae6943e
 - [lock] Moving password strength into bindAll. (`pose`)
  https://github.com/auth0/lock/commit/6c001a1ece02c277ce8e8fe8c2e85070f22f9014
 - [lock] Merge remote-tracking branch 'vctrfrnndz/password-strength' into password-strength (`pose`)
  https://github.com/auth0/lock/commit/70d1444b6ae8a953d6e2b77c7cf255d6999f1d51

### Fixed

 - [lock] Better error handling on weak password. (`pose`)
  https://github.com/auth0/lock/commit/4bee74e92070dbda3b0441b09067b968e493b428
 - [lock] Fixing broken package.json (`pose`)
  https://github.com/auth0/lock/commit/96662a443bde70b2ff8b0d653c503a55b92c0933

## 6.4.1 - (Nov 7, 2014) [YANKED]

## 6.4.0 - (Nov 5, 2014)

### Added

 - [lock] handle `requires_username` in db connection (`[object Object]`)
  https://github.com/auth0/lock/commit/1e53915fafca55cb821fadc65049a1f7068a1d66
 - [lock] sign-up tests with `requires_username` (`[object Object]`)
  https://github.com/auth0/lock/commit/72053c72f23d402089069994a560263deb3b0b86
 - [lock] Move _isUsernameRequired to options-manager lib module (`cristiandouce`)
  https://github.com/auth0/lock/commit/eedf8af250cae6990edfb7546091d5afccb2ed40
 - [lock] Remove forgotten debugger (`cristiandouce`)
  https://github.com/auth0/lock/commit/5b389fa50483861a6ee00f879c51a3fb5088f840
 - [lock] Update input borders for new setup of username+email and any combination (`cristiandouce`)
  https://github.com/auth0/lock/commit/906552fc65c61749bff5dd8f86fc56e64d0d062b
 - [lock] Update to parse and mark username exists error when creating with requires_username database (`cristiandouce`)
  https://github.com/auth0/lock/commit/5eb414707a992ee55a70e24e8e762f1e0c69bacc
 - [lock] Fix styles for input borders (`cristiandouce`)
  https://github.com/auth0/lock/commit/e8fe6c9cecda386331444af985a828f23df9f148
 - [lock] Fix placeholder for username when requires_username enabled (`cristiandouce`)
  https://github.com/auth0/lock/commit/3df63b32c5c6bc6a0366af120c91e4be14f15b98
 - [lock] Fix appearace of icons for email/username/password inputs in different modes (`cristiandouce`)
  https://github.com/auth0/lock/commit/f7a0e8b6937040cee95cb7ca6acd66d40706bfcf
 - [lock] Adding i18n for password policies. (`pose`)
  https://github.com/auth0/lock/commit/b235c3e0b5fba598c8a01643ca2b6002c7481e3d
 - [lock] Update tests for requires_username mode for database connection (`cristiandouce`)
  https://github.com/auth0/lock/commit/574512c4e964303485f4c5f8e69bc695923e0dcd

### Changed

 - [lock] Update package.json with auth0-js 5.1.0 release (`cristiandouce`)
  https://github.com/auth0/lock/commit/500a3564cba4bd76cbce5d952a30c52457a04390

## 6.3.7 - (Nov 3, 2014)

### Added

 - [lock] Add theme option with a0-theme-default as default theme. Enables theme-less lock by setting to false (`cristiandouce`)
  https://github.com/auth0/lock/commit/21037dc4d888a6b226dad3132913b1e678721cce
 - [lock] Move zocial.less as part of the theme default (`cristiandouce`)
  https://github.com/auth0/lock/commit/7110d4bc06c457683a51dca93ac51988fd9ac5d8
 - [lock] Fix chaining of CSS for theme default (`cristiandouce`)
  https://github.com/auth0/lock/commit/cc6769b4b2b1a2699a679dfcc6720bb6917503e7
 - [lock] Change styling to 2nd iteration (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/22d8bebd67864e338dda6df58b81427d5596f7a4
 - [lock] Switch .checked rules to darker green on mobile (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/78e466ee6d4e1ecc58b0dc96308c5bd40623e6ce
 - [lock] Unify child list color mobile/desktop (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/4592226931ee36fe35dc1010e81a3a593c46cf12
 - [lock] Update font for icons (`cristiandouce`)
  https://github.com/auth0/lock/commit/5e2ecf63eea6352a84bc8efad09964ecc56f92c4

### Fixed

 - [lock] Fix iOS focus issue (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/a8846d6f234762ea3e91a73bfc70f713c6f27e7e
 - [lock] Fixing how password strength list was rendered. (`pose`)
  https://github.com/auth0/lock/commit/6df1ae2b7a62c8d8c99d54d03a0ec7c9aff39d33


## 6.3.6 - (Oct 30, 2014)

### Added

 - [lock] Update credentials in example file, add styles and new behavior to password-strength module (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/73e168ec307692d270bdca184848305efb6d6034
 - [lock] Prevent blur from removing the ruleset on smaller screens, as user may need to unfocus to read the whole list (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/c4ba6a9755cc563b41080ff2e4ae7fc19943c87b
 - [lock] Always show all the rules (`vctrfrnndz`)
  https://github.com/auth0/lock/commit/209f59c3b48ad88341182b696bdae672d2b19666

## 6.3.5 - (Oct 24, 2014) [YANKED]

## 6.3.4 - (Oct 23, 2014)

### Added

 - [lock] Update pt-BR dictionary (`cristiandouce`)
  https://github.com/auth0/lock/commit/2f69fdc4d44d8da26e6c40a0c07a99663773077e

## 6.3.3 - (Oct 23, 2014)

### Fixed

 - [lock] Load Gravatar over HTTPS

To avoid Google Chrome (and other browsers) display insecure resources warning:

> However, this page includes other resources which are not secure. These resources can be viewed by others while in transit, and can be modified by an attacker to change the look of the page. (`dentarg`)
  https://github.com/auth0/lock/commit/6db06661a17e382a6a0c8a6f4a8b40c90549dd2f

## 6.3.2 - (Oct 17, 2014)

### Fixed
 - [lock] Fix socialBigButtons for showSignup render (`cristiandouce`)
  https://github.com/auth0/lock/commit/2e66ed3aa3c02be1ab8f5d5db681f31fe52bd56a

## 6.3.1 - (Oct 17, 2014)

### Fixed

 - [lock] Fix invoke of callback on password reset action (`cristiandouce`)
  https://github.com/auth0/lock/commit/9d199395f4a35dbea25b8ac29f6707c53242cfbb

## 6.3.0 - (Oct 15, 2014)

### Added

 - [lock] Add signupAutoLogin first attempt. Related #57 and auth0/widget#29 (`cristiandouce`)
  https://github.com/auth0/lock/commit/ab585f0359f06eb838deabfd21866c59731d5512
 - [lock] Add usernameFromEmail default to true for AD signin connections. Related #57 (`cristiandouce`)
  https://github.com/auth0/lock/commit/fb0651730393483a9005cbe1dee5e1020f329ad4

### Changed

 - [lock] Update validate and submit methods. Make them part of the constructor and cleanup onsubmit event handler (`cristiandouce`)
  https://github.com/auth0/lock/commit/aad05db65aff5365c51efe4f77f2085dc80a6480
 - [lock] Rename signupAutoLogin to loginAfterSignup (`cristiandouce`)
  https://github.com/auth0/lock/commit/f3bc7e9374b1154c9dbf5107256dee174a5b84e6
 - [lock] Rename usernameFromEmail option to defaultADUsernameFromEmail (`cristiandouce`)
  https://github.com/auth0/lock/commit/7c00af1cad7254f20a03a25f59b3d3d7757f62c3
 - [lock] Rename defaultADUsernameFromEmail to defaultADUsernameFromEmailPrefix (`cristiandouce`)
  https://github.com/auth0/lock/commit/f96a92a5c470fe3c6cef4a9624704430c880b973
 - [lock] Bump auth0-js@5.0.0 and fix tests (`cristiandouce`)
  https://github.com/auth0/lock/commit/42f04c8fbe524f56fcc324437e62865e216d3ab7

### Fixed

 - [lock] Add properly handling of callback if provided (`cristiandouce`)
  https://github.com/auth0/lock/commit/5d5f2253b08789d8100c2ef33be800f9576edd51
 - [lock] Fix container check call (`cristiandouce`)
  https://github.com/auth0/lock/commit/8e2f2f8eb82ebd4b3632e80bd1ae605b03b4b655



## 6.2.21 - (Oct 15, 2014)

### Added

 - [lock] Password strength implemented (but disabled) in Auth0 Lock. (`pose`)
  https://github.com/auth0/lock/commit/2c56ebe8602c815a71b7fae78264f82f5b602bde
  https://github.com/auth0/lock/commit/a1cdca37da5e5e8348c083f3c1d91b2a9ffcc4b8
  https://github.com/auth0/lock/commit/cbe1d1af3d4eb0348d4a8a129f9824c60a58034e
  https://github.com/auth0/lock/commit/58c6aeacb66d210ea435a01c590bbd437fcb195b
  https://github.com/auth0/lock/commit/626465ffe33af5cda41b33c85baf6f687833eea3
  https://github.com/auth0/lock/commit/8433f874802e62959bc62f565e814cedd093223d
  https://github.com/auth0/lock/commit/71b475dcb2cd0f8162e0714351ec955cdb88ff75

### Changed

 - [lock] Bump auth0-js@4.3 (`cristiandouce`)
  https://github.com/auth0/lock/commit/19219a5328a3ce2f500b2cfdda07b1769879b69c

## 6.2.20 - (Oct 7, 2014)

### Fixed

 - [lock] Fix constructor not passing all parameters when not called with new (`cristiandouce`)
  https://github.com/auth0/lock/commit/97402a25ed760d51d054750905146c947d3889eb
 - [lock] Fix assetsUrl and cdn passed to initialization being overriden due to missing parenthesis (`cristiandouce`)
  https://github.com/auth0/lock/commit/2a09952651c99f3876601ade9841df41c0296ce9

## 6.2.19 - (Oct 7, 2014)

### Fixed

 - [lock] fix error with signup on response type code (`jfromaniello`)
  https://github.com/auth0/lock/commit/05fc749dac737e9f3249153988eed28132c6c54e

## 6.2.18 - (Oct 7, 2014)

### Fixed

 - [lock] fix login with popup and response_type=code (`jfromaniello`)
  https://github.com/auth0/lock/commit/78940479b8d868f2bdf5c698f9c9319056738574

### Changed

 - [lock] sso is true by default (`jfromaniello`)
  https://github.com/auth0/lock/commit/857a0f0db8d7a2b293fc0bc1a02074962a50eaf3

## 6.2.17 - (Oct 2, 2014)

### Fixed

 - [lock] Fixes  #52: PhoneGap "last time you signed in with" is broken (`pose`)
  https://github.com/auth0/lock/commit/71c3980e80db0791005ef0295e9da62d9c8d0672

## 6.2.16 - (Oct 1, 2014)

### Fixed

 - [lock] Fixes #53: Show gravatar picture on "last time you signed in with" (`pose`)
  https://github.com/auth0/lock/commit/f3b8c182fca8db77a33ae84bd0eacaf393c06e65

## 6.2.15 - (Sep 24, 2014)

### Fixed

 - [lock] Fixing broken event re-firing. (`pose`)
  https://github.com/auth0/lock/commit/14decea2cea7396b21f27c4f6c3db4c557ebbe3a


## 6.2.14 - (Sep 24, 2014)

### Added

 - [lock] i18n: Added norwegian (bokmal) (`johnkors`)
  https://github.com/auth0/lock/commit/cb659f64e14411fc0560bd1cae0714ddf33367cd
  https://github.com/auth0/lock/commit/7212c7f152f4900bcad0b0af81feeb0870eb2cb3

## 6.2.13 - (Sep 23, 2014)

### Fixed

 - [lock] Fix passing callback invoked at the same time to setTimeout wich expects a function (`cristiandouce`)
  https://github.com/auth0/lock/commit/73ba7d291f549e8121d502c5bf7c422abe17f183


## 6.2.12 - (Sep 22, 2014) [YANKED]

## 6.2.11 - (Sep 19, 2014)

### Fixed

 - [lock] Not entering HRD in `username` mode. (`pose`)
  https://github.com/auth0/lock/commit/24a46109788a780ca07ec3cf045ddd1e01a74f92

### Changed

 - [lock] Add handler for error on client retrieval. Related #48 (`cristiandouce`)
  https://github.com/auth0/lock/commit/f556b0b1f4ef3d495b08b97bf0f362cd8ba4d522
 - [lock] Add timeout of 3 seconds to load client configuration data. Fixes #48 (`cristiandouce`)
  https://github.com/auth0/lock/commit/eabbeaaad26a85f0bd3ef373459c0b0ec3028319

## 6.2.10 - (Sep 19, 2014)

### Fixed

 - [lock] Fixes #43: Move ImageView out of HeaderView (`pose`)
  https://github.com/auth0/lock/commit/adce57cd12844f2e7e3bb41e81509c86736e6d9c
 - [lock] Fixes #45: Gravatar animation fixes (`pose`)
  https://github.com/auth0/lock/commit/337a0b48137e4fe126274ff9457784ad996576bb

## 6.2.9 - (Sep 17, 2014)

### Fixed

 - [lock] Fixes #46: Gravatar image not being displayed on HRD mode. (`pose`)
  https://github.com/auth0/lock/commit/226473c274b36a869acc059e8a820f1ff84293f5

### Changed

 - [lock] Fixes #47: On HRD take input email and use the first part as suggested username (`pose`)
  https://github.com/auth0/lock/commit/cc33e02a07b34f7f47a4dbb0c1c637b0780639d7

## 6.2.8 - (Sep 17, 2014)

### Fixed

 - [lock] Fixing wrong filtering of AD connections on HRD mode. (`pose`)
  https://github.com/auth0/lock/commit/457bf87ca6e2343eae241cb1168d1836b70c06e3

## 6.2.7 - (Sep 16, 2014)

### Fixed

 - [lock] Minor: border-radius of a0-image to 58px. (`pose`)
  https://github.com/auth0/lock/commit/2c1f5e48bdbe48993e107ecaab1f7720c7600b24

## 6.2.6 - (Sep 16, 2014)

### Added

 - [lock] Fetching gravatar image when user types email(`pose`)
  https://github.com/auth0/lock/commit/da31a4bbd92f1527a29b75ec616ca6955c9154cd
  https://github.com/auth0/lock/commit/4fc46a159a03b5cbaebaeb80e415c5e4af9584ee
  https://github.com/auth0/lock/commit/dfea66a4e453910c5866ec220e412036778d7c8c
  https://github.com/auth0/lock/commit/facd150b5039466f0720dffdac3a24b51e5ffe05
  https://github.com/auth0/lock/commit/eca6db338d9bfc99e98cffbb42af5222d7b89b6a
  https://github.com/auth0/lock/commit/fc3453341da7fc544fb0305560d8551ae2eaefc2
  https://github.com/auth0/lock/commit/c46b77a3abb7bdb4a07829f45b222c4889670fdc
  https://github.com/auth0/lock/commit/01b5d751ff79693c7ed28b7c734f5d153790cea7
  https://github.com/auth0/lock/commit/e4e686aa492928141f0b14f880427ab45acdfa97

## 6.2.5 - (Sep 15, 2014)

### Fixed

 - [lock] fix issue when creating multiples instances with same client_id (`jfromaniello`)
  https://github.com/auth0/lock/commit/c362cf791277a58f290a00aa90da0c647705caf5


## 6.2.4 - (Sep 5, 2014)

### Fixed

 - [lock] Add character inception test (`cristiandouce`)
  https://github.com/auth0/lock/commit/2f0ae9b1c31d1c4bec394ada6f49ecdc0e561373
 - [lock] Disable show last login when connection not enabled in client configuration. Fix #26 (`cristiandouce`)
  https://github.com/auth0/lock/commit/c7672644a0cd0b2d66fe744cf5d091c13a407147


## 6.2.3 - (Sep 5, 2014)

### Fixed

 - [lock] Remove alt+space characters (`cristiandouce`)
  https://github.com/auth0/lock/commit/780ce8a09d8c7e4d95d5f2afae843f2e4b42a747


## 6.2.2 - (Sep 4, 2014) [YANKED]

## 6.2.1 - (Sep 4, 2014)

### Fixed

 - [lock] Fixing _isEnterpriseConnection (`pose`)
  https://github.com/auth0/lock/commit/e9019553aea428039277e5e57d7be1a2b1a62534

## 6.2.0 - (Sep 3, 2014)

### Added

 - [lock] Fixes #13: HRD Support for AD Connectors (widget side) (`pose`)
  https://github.com/auth0/lock/commit/64d8890b553503706054c612be03178f629c547e

## 6.1.6 - (Sep 3, 2014) [YANKED]

## 6.1.5 - (Sep 3, 2014)

### Fixed

 - [lock] Fixes #25: With emails 30 characters long or more input goes out of control! (`pose`)
  https://github.com/auth0/lock/commit/728fc588a2593d17b1629a6373a134c8e6d4734b

### Changed

 - [lock] Minor: Adding actionDomain translation. (`pose`)
  https://github.com/auth0/lock/commit/c3fae3334125d63233ec75db8659b44e0e981972

### Added

 - [lock] Options are optional now (Fixes #30) (`mgonto`)
  https://github.com/auth0/lock/commit/bd81106809e2db19cc196d50fd0a366a14f2d502
 - [lock] Added OptionsManager for ResponseType (Fixes #29) (`mgonto`)
  https://github.com/auth0/lock/commit/71270e48561d8c00d0c49e67934710fc154cc4e2
 - [lock] Bumping auth0.js version (`mgonto`)
  https://github.com/auth0/lock/commit/f8404ac6b8e80cf0f94d7257889a6ae59b6c7109

## 6.1.4 - (Aug 29, 2014)

### Fixed

 - [lock] Remove kerberos duplicated .query method (`cristiandouce`)
  https://github.com/auth0/lock/commit/4a0dc4f0f41cdef037950abce1d9f9b160d3359a

## 6.1.3 - (Aug 29, 2014)

### Fixed

 - [lock] Refix auth0/lock#17 (`cristiandouce`)
  https://github.com/auth0/lock/commit/4890ac819cfea2693403981899d7f6ab89e08d82

## 6.1.2 - (Aug 29, 2014) [YANKED]

## 6.1.1 - (Aug 29, 2014)

### Fixed

 - [lock] Fix auth0/widget#70 (`cristiandouce`)
  https://github.com/auth0/lock/commit/f8a349c6e018a641ae9eccde3eabd89378e48d2e



---

v6.1.3 / 2014-08-29
===================

  * Release: 6.1.3
  * Refix auth0/lock#17

v6.1.2 / 2014-08-29
===================

  * Release: 6.1.2
  * Fix auth0/lock#17

v6.1.1 / 2014-08-29
===================

  * Release: 6.1.1
  * Fix auth0/widget#70
  * Update built css
  * Update README.md
  * Update README.md
  * Fix css-spinner loading badge. Related auth0/widget#83

v6.1.0 / 2014-08-26
===================

  * Release: 6.1.0
  * Fix signup tests
  * Fix tests for Auth0Lock
  * Update README.md
  * Adding support for domain aliases.
  * Fix cdn script
  * Update cdn script
  * Fix bin/deploy command for CDN release

v6.0.0 / 2014-08-26
===================

  * Update file perms for bin/deploy
  * Release: 6.0.0
  * Add bump command
  * Update bump and deploy scripts
  * Fixes the fix of fixes
  * Fix typo on test/tests.js
  * Fix placeholder support tests, and no-support flag on tests description
  * Add tests for placeholder support
  * Update example/index.html
  * Remove showIcon option once and for all
  * Fix resource link in README.md
  * Update README.md
  * Fix tests for responseType
  * Rename callbackOnLocationHash {Boolean} -> responseType {String} ['code'|'token']
  * Rename userPwdConnectionName -> defaultUserPasswordConnection option
  * Rename kerberosLogin -> integratedWindowsLogin option
  * Fix tests
  * Add forgotten auth-params.js map
  * Auth0Lock. should default to {}
  * No longer support authParams in main options object, plus other fixes
  * Rename extraParameters -> authParams into allowed options
  * Fix closable option when provided and not executed
  * Add inline comment
  * Fix popupOptions merge
  * Rename username_style option to usernameStyle
  * Rename enableADRealmDiscovery -> kerberosLogin
  * Fix override of socialBigButtons option
  * Fix setTitle method for internal usage
  * No longer support title as an option for show methods
  * Fix multi-widget load issues
  * Update README.md
  * Update README.md
  * More readme.md updates
  * Update readme.md
  * Fix Readme.md
  * Update README.md
  * Update README.md
  * First steps on options whitelist
  * Update tests and examples for new Auth0Lock initialization options
  * Update Auth0Lock constructor options. Move most of them to .show methods
  * Fix kerberos mode show all click
  * Typo
  * Fix closable default value and handling
  * Restor support for IE>=9
  * Fix tests
  * Fix tests
  * Minor
  * Add multi-widget example
  * Fix phantomjs tests
  * Add .zuul.yml and update test_harness.html
  * Update package.json
  * Updating tests
  * Added missing offline_mode supported param for extra parameters
  * Add Build badge
  * Update Gruntfile.js for deploying to CDN
  * Remove test/* and example/* from .npmignore
  * Merge re-branded changes for history restore of old widget@v5.x
  * Update example/index.html
  * Remove chrome option and always render login icon on embeded mode
  * Remove unused code
  * Remove unused theme and top options
  * Force standalone option when container provided
  * Rename forgotLink -> resetLink
  * Fixes of fixes
  * Update examples
  * Remove showEmail and showPassword options
  * Update contructor API and mode initialization
  * fix tests
  * Fix odd scope issue with Monkey patchinig
  * Fix Options manager _isEnterpriseConnection check on email
  * Fix reset and signup tests
  * Fix signup/reset modes
  * Add line comment
  * Fix db_connections tests
  * Set popup: true, popupOptions: {} when callback provided
  * Fix .strategies setup by options-manager
  * Rename enableReturnUserExperience -> rememberLastLogin
  * Fix options manager initialization and handling
  * Fix options self assignation
  * Fix enableReturnUserExperience
  * Fix signin methods and modes handling by using new options-manager
  * Remove unused transition-end
  * Fix i18n local module
  * Fix header html
  * Fix some tests
  * Fix widget modes handling new options-manager
  * Add options-manager local module
  * Add assert-required local module
  * Move signin submit form validation to SigninPanel
  * Add bind local module
  * Replace qwery for sizzle for better DOM query support
  * Cleanup code
  * Support device and nonce parameters. @siacomuzzi
  * Fix signin and signup templates
  * Fix tests
  * Move regex as main local dep
  * Move strategies as main local dep
  * Fix examples
  * Renamed showForgot, showSignup options to disableResetAction, disableSignupAction and make them work
  * Rename button.ejs to zocial-button.ejs on shared html templates
  * Move login actions template to mode-signin
  * Remove unused html, moved to mode-loggedin
  * Add inline comments for mode-kerberos and mode-loggedin
  * Update renamed methods and options object
  * Update index.js with API docs and code improvements
  * Cleanup index.js
  * Update index.js
  * Update popupNoRedirect signin method
  * Update signin methods updates to loggedin and kerberos mode
  * Update signin methods updates to signup mode and some code improvements
  * Update signin methods updates to loggedin mode
  * Update signin methods updates to signin mode
  * Improve index.js code
  * Remove removal of unused animated class
  * Updates index.js
  * Improve all languages example
  * Update examples
  * Remove alias .showSignin(), .showSignup(), .showReset() and rename ._hideSignin() for .hide()
  * Fix signup mode show actions logic
  * Fix reset mode show actions logic
  * Do not open on signup nor reset mode if not enabled on connection
  * Fix modes
  * Remove unused templates
  * Code improves at index.js
  * Fix examples code
  * Improves to index.js
  * Rename properly loggedin kerberos mode
  * Add loading name to loading mode
  * Cleanup loggedin mode
  * Cleanup signin mode
  * Cleanup signup mode
  * Cleanup index.js
  * Cleanup reset mode
  * Add stop-event
  * Fix signup mode show/hide cancel button
  * Fix reset mode error messages
  * Temporary examples added to test new widget API
  * Fix error messages and setting of panels
  * Fix signup mode error messages
  * Fixes various modes
  * Fixes mode reset
  * Fixes signup mode
  * Fix signin mode
  * Add loading mode
  * Enable new mode-loggedin and mode-kerberos
  * Add whitespace to mode-signin
  * Add loggedin mode
  * Add kerberos mode to replace showAdInDomainExperience
  * Remove zocial.css and zocial.min.css since no longer useda
  * Fixes mode-reset
  * Fixes mode-signup
  * Update panels for signin, signup and reset
  * Update mode-signin
  * Add mode-signup
  * Add mode-reset
  * Update mode-signin and bind events to instance `el`
  * Add bonzo_augmented.js to use appart from widget
  * Add temporary example for new widget rendering mode
  * Monkey patch methods for new rendering mode testing
  * Create mode-signin
  * Update widget templates
  * grunt: watch index.js
  * More code improvements
  * More updates on libs
  * Move everything to lib
  * Rename _ to query()
  * Move test support resources to test/support/
  * Update README.md
  * Minor: Signup: hiding a0-separator and a0-iconlist when there are 0 social providers.
  * Update Readme.md and package.json
  * Minor
  * Minor: Changing example names Widget -> Lock
  * Update README.md
  * Add Dockerfile and npm tasks to run tests on CI
  * Update usage at Readme.md
  * Update Readme.md
  * Update Readme.md
  * Update Readme.md
  * Update Readme.md
  * Update Readme.md and add LICENSE file
  * Add badges to Readme.md
  * Update and fix Readme.md
  * Update Readme.md
  * Update Readme.md
  * Update Readme.md
  * 0.2.0
  * Update Gruntfile tasks
  * Remove unused hasTransitions
  * Add check outdated task before releasing at bin/version command
  * Update usage at Readme.md
  * Update README.md heading
  * Update constructor options
  * Update README.md
  * Update README.md
  * Update Readme.md with tables for options
  * Initial commit

v5.2.1 / 2014-08-14
===================

  * Bumped auth0.js version

v5.2.0 / 2014-08-14
===================

  * Added offline_mode for widget

v5.1.8 / 2014-08-10
===================

  * Added auth0.js 4.0

v5.1.7 / 2014-08-08
===================

  * Restore back the wrongUsernamePasswordErrorText

v5.1.6 / 2014-08-07
===================

  * Fix signin validation email broken on IE and FF

v5.1.5 / 2014-08-07
===================

  * Update triming email before form validation, fixes IE and FF bug with regex

v5.1.4 / 2014-08-06
===================

  * support device option

v5.1.3 / 2014-08-05
===================

  * Update reset and signup methods to allow extension of showForgot and showReset action buttons
  * Fix login panel load after reset success

v5.1.2 / 2014-08-04
===================

  * support nonce option
  * Update Readme.md
  * Add 'Releases' to Readme.md

v5.1.1 / 2014-08-04
===================

  * include evernote-sandbox

v5.1.0 / 2014-07-31
===================

  * Make reset and normalize more specific than any other styles on sites

v5.0.13 / 2014-07-25
====================



v5.0.12 / 2014-07-25
====================

  * update auth0.js

v5.0.11 / 2014-07-25
====================

  * Update css for responsive. cc @gravityonmars
  * Fix prevent click on a0-close button
  * Update i18n forgotText for es and en dictionaries

v5.0.10 / 2014-07-24
====================



v5.0.9 / 2014-07-24
===================

  * Merge pull request #86 from auth0/fix-signup-reset-popup
  * Fixed signup & password change popup

v5.0.8 / 2014-07-16
===================

  * Updating node-modules dependencies.

v5.0.7 / 2014-07-16
===================

  * Adding "binaries"
  * Merge pull request #81 from jjaffeux/patch-1
  * Add tr.json file to i18n/index.js

v5.0.6 / 2014-07-15
===================



v5.0.5 / 2014-07-15
===================

  * Adding latest binary versions.

v5.0.4 / 2014-07-15
===================

  * Merge branch 'jjaffeux-turkey'
  * Merge branch 'turkey' of github.com:jjaffeux/widget into jjaffeux-turkey
  * Add translations for Turkey

v5.0.3 / 2014-07-15
===================

  * Updating to Browserify 4.2.1 (https://nodesecurity.io/advisories/syntax-error-potential-script-injection)

v5.0.2 / 2014-07-14
===================



v5.0.1 / 2014-07-14
===================



v5.0.0 / 2014-07-14
===================

  * Merge pull request #79 from auth0/winchan
  * Adding Winchan & Phonegap compatibility.
  * Updating to auth0.js 3.0.1

v4.1.1 / 2014-07-04
===================

  * Update README.md
  * Merge pull request #75 from auth0/issues/74
  * Fixes #74 by adding support for connection_scopes. Bump to 4.1.0.
  * Updated dev instructions.

v4.1.0 / 2014-07-03
===================



v4.0.48 / 2014-06-18
====================

  * Pin auth0-js dependency @2.1.10

v4.0.47 / 2014-06-17
====================

  * restore waad icon

v4.0.46 / 2014-06-17
====================



v4.0.45 / 2014-06-17
====================



v4.0.44 / 2014-06-17
====================

  * restore office365 icon

v4.0.43 / 2014-06-16
====================

  * Fix _hideSignIn()

v4.0.42 / 2014-06-16
====================

  * Merge branch 'multi-instance'
  * Fix test hide, since now removes widget on close
  * Fix signup.tests.js
  * Fix _container reference and use widget._$ to bind events to instance
  * Fix input icon z-index
  * Remove unnecesary copy of build at example/
  * Fix keyword package.json
  * Update build
  * Fix awesome multi widget dancing
  * Update build for multi-instance
  * First steps into self contained dom queries. Allows multiple instances of widget

v4.0.41 / 2014-06-13
====================



v4.0.40 / 2014-06-13
====================

  * Fixing disappearing signup email when coming from  loading transition.
  * Minor: Fixing browserify error reporting.
  * Updating browserify dependency.
  * Minor: Removing tabs and using spaces

v4.0.39 / 2014-06-13
====================

  * 4.0.38

v4.0.38 / 2014-06-13
====================

  * show backend error on db conns

v4.0.37 / 2014-06-12
====================

  * Adding password policy error.

v4.0.36 / 2014-06-11
====================



v4.0.35 / 2014-06-11
====================

  * Oops, updating to auth0.js (now for real)

v4.0.34 / 2014-06-10
====================

  * remove shrinkwrap

v4.0.33 / 2014-06-10
====================

  * add transforms as deps not devDeps

v4.0.32 / 2014-06-04
====================

  * add packageify to only inline version

v4.0.31 / 2014-06-04
====================

  * minor

v4.0.30 / 2014-06-04
====================

  * update checkrepo to our fork

v4.0.29 / 2014-06-04
====================

  * add shrinkwrap

v4.0.28 / 2014-06-04
====================

  * Merge pull request #65 from levicc00123/master
  * Added bower JSON file to package.

v4.0.27 / 2014-06-03
====================

  * add version
  * Adds back Auth0Widget.version property that contains the current auth0-widget version.

v4.0.26 / 2014-06-03
====================

  * Update build
  * Revert "Adds Auth0Widget.version property that contains the current auth0-widget version."

v4.0.25 / 2014-06-03
====================

  * Update readme.md
  * 4.0.24

v4.0.24 / 2014-06-03
====================

  * Update build for 4.0.23

v4.0.23 / 2014-06-03
====================

  * Re-update build

v4.0.22 / 2014-06-03
====================

  * Update build
  * 4.0.21
  * Updating auth0-js to 2.1.5 version.
  * Merge pull request #64 from auth0/add-version-field
  * Adds Auth0Widget.version property that contains the current auth0-widget version.

v4.0.21 / 2014-06-03
====================

  * Updating auth0-js to 2.1.5 version.

v4.0.20 / 2014-06-03
====================

  * Merge remote-tracking branch 'origin/img_height'
  * fix img height

v4.0.19 / 2014-06-02
====================

  * Merge branch 'fix_padding'
  * fix padding & width
  * fix padding
  * Update README.md
  * more css fixes

v4.0.18 / 2014-05-29
====================

  * css width input
  * fixes css
  * margin signup footer
  * margin signup footer

v4.0.17 / 2014-05-29
====================

  * Updating to latest built version.
  * fixes css
  * better ux
  * fixes
  * pixel perfect
  * fixes css responsive

v4.0.16 / 2014-05-27
====================

  * Fix browserify missing verison 4.1.6

v4.0.15 / 2014-05-27
====================

  * Update build
  * fixes
  * fixes responsive
  * fix responsive
  * Merge branch 'master' into new_style
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * fixes themes
  * gradient theme
  * gradient theme
  * base64 widget font
  * unnecesary file
  * new themes

v4.0.14 / 2014-05-27
====================

  * Update build
  * Add dummy href for close link
  * Fix hiding X button on standalone render. Close #59

v4.0.13 / 2014-05-26
====================

  * Removing exorcise and re-embedding source map in auth0-widget. Using mold-source-map to create relative source map paths.
  * Updating build to 4.0.12 version.

v4.0.12 / 2014-05-26
====================

  * Sourcemaps are now created in a different file.
  * Ignoring source map file.

v4.0.11 / 2014-05-26
====================

  * Updating ejsify to 0.1.0
  * Adding grunt-checkrepo to detect when build folder differs.
  * Updated built version to latest (previous version was broken).
  * Merge pull request #54 from alyssaq/patch-1
  * function typo

v4.0.10 / 2014-05-19
====================

  * support thecity and planningcenter strategies

v4.0.9 / 2014-05-19
===================

  * Update build for fix of popup-mode + username/password login
  * Fix handle error for 401 and server error on popup mode

v4.0.8 / 2014-05-19
===================

  * Update build, broken in 4.0.7

v4.0.7 / 2014-05-19
===================

  * Update build

v4.0.6 / 2014-05-17
===================

  * Updating auth0.js to 2.1.4
  * Updating SPA example.
  * Updating README widget version to 4.0

v4.0.5 / 2014-05-15
===================

  * Fix custom icon fixed to 58px height and auto width

v4.0.4 / 2014-05-15
===================

  * No longer add a0-ie8-overlay. Delegate to CSS engine fallback support for background
  * Make ie8 overlay display for IE<10
  * Add is_old_ie check script

v4.0.3 / 2014-05-15
===================

  * Fix social buttons for dropbox, paypal, salesforce

v4.0.2 / 2014-05-15
===================

  * Merge branch 'slaykovsky-russianLanguage'
  * Merge branch 'russianLanguage' of github.com:slaykovsky/widget into slaykovsky-russianLanguage
  * Some improvements for russian language.

v4.0.1 / 2014-05-14
===================

  * Update build
  * Fix bug where users's container for widget gets removed
  * Fix for IE missing console global property
  * Fix examples callbacks
  * Update build
  * Limit body class to overlay widget only
  * Update build
  * Quick fix on widget's body class handling before closed event
  * Fix example on grunt dev command
  * Update build
  * Avoid setTimeout(0) on transitions... thanks Firefox\!
  * Updating to latest browserstack-cli version.
  * Updating to latest built version.

v4.0.0 / 2014-05-13
===================

  * Merge pull request #39 from auth0/new_style
  * Update build
  * Underline links on signup footer
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Add example of signup with footer text
  * Style to footer text
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * better focus
  * better fx
  * Merge branch 'fix-popup-auth0-ad' into new_style
  * Fix example with free subscription account
  * fixes
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Fix flickering on safari
  * fixes
  * Fix popup example for userinfo show data
  * fixes css
  * Merge branch 'master' into new_style
  * Update build
  * Test socialBigButtons property, and update login only-socials examples
  * fixing crazy badge
  * icons
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Fix resizing bug after adding a0-equal-viewport class, which reduces inner elements height
  * fixes
  * fixes overflow
  * fixes
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Add class to body and widget container to manipulate css
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * fixes
  * fixes
  * Update build
  * Fix error transition
  * fixes
  * fixes
  * fixes css
  * Revert "Add doubletap prevent"
  * fixes
  * Add doubletap prevent
  * Update databas connection name
  * No longer copy auth0 widget to example/
  * Merge branch 'master' into new_style
  * Update build
  * Fix resizing bugs when displaying error message
  * Update build
  * Fix popup example on examples/index.html
  * Undo hack since already fixed
  * Merge branch 'master' into new_style
  * Update Must match -> Debe coincidir for es translations
  * Update build
  * Add ES translations for new keys
  * Update clientID for examples
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Differ login from signup on social buttons title
  * fix clearfix
  * Fix example
  * Update build with email/username validations
  * typo
  * Fix username validations
  * Fix some transitions for error/success messages
  * Reset success message on cancel option
  * Update build
  * Reset errors on cancel options before view refresh
  * Update build
  * Add color red to .a0-error class
  * Fix resizing problems by setting error before view refresh on signup and success
  * copyright fixes
  * Update build
  * Add a0-free-subscription class to main panel
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Update build
  * Add example for non-free subscriptions
  * Fix show/hide copyright logo for non-free nor dev subscriptions
  * fixes css
  * Update build
  * Deleted unused files in example
  * Undo jade for example building
  * fixes css
  * Update example custom icon
  * Update build and example
  * Fix custom icon html/display
  * Add new examples
  * Fix layout for example
  * Add username_style example to login
  * Add example files to watch
  * Fix grunt example_https
  * Update build
  * Disable browser validation
  * Fixes example
  * Update example build
  * Update example builds
  * Update grunt-example task
  * Update builds
  * [test] - Fix Sign In: should send extraParameters to login
  * [test] - Fix Sign In: should signin with enterprise connection specifying extraParameters
  * Fix fix typo
  * [test] - Fix Sign In should signin with enterprise connection
  * [test] - Fix: should signin with social connection specifying state
  * [test:widget] - Fix social login strategy selector
  * Fix signin social tests and click event bind selector improves
  * Fix signup with social strategy and tests
  * [test:reset] - Fix reset password email mandatory
  * Fix focus password on login enterprise and still validate required field for other authentication types
  * fix reset errors
  * Add error for repeat_password_empty
  * Add basic reset form validations
  * Disable browser's form validation
  * Add must match message for english dictionary
  * Fix widget inputs width
  * Fix passwords borders
  * Signup server errors
  * Fix multiple widget instances log text
  * Fix animation on errors for signup
  * Whitespace at widget/index.js
  * Add basic form validation to signup
  * Group regular expressions on js/regex.js
  * Delegate validation to widget. Remove html5 required attributes
  * Re-shake on secuential form submision errors
  * fixes css
  * Fix animations and focus error
  * More errors fixes on show/hide messages
  * More error fixes
  * Reset focus errors on signInWithAuth0 and return in case of popup
  * Do not show error message on empty email
  * Add a0-errors to #a0-widget when there are errors. Add class only to input container div
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Add error messages on inputs
  * error form
  * fix
  * fixes js css
  * Update build
  * Clean error on next login submit
  * fix title problem
  * fix hidden social buttons on signup
  * fixes css
  * fixes css
  * fixes css
  * fixes css
  * fixes css
  * fixes css
  * fixes css
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * Update build and example
  * Remove display:none from templates in favor of a0-hide class
  * better responsive height
  * better responsive buttons
  * fix: Zocial buttons hover when they are squares
  * fixes ios
  * fixes css
  * fixes index
  * fixes
  * fixes all button
  * Update build and example/index.html
  * Fix jade inline format
  * Fix target delegation for social login
  * fixes
  * fixes general
  * Fix example js indentation
  * Fix login info
  * fixes example
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * fixes ios
  * Update README.md
  * Update README.md
  * Update README.md
  * Update build
  * Fix login only socials and only enterprise
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * fixes
  * Update build and example builds
  * Add class a0-equal-viewport to pane_container when height is smaller
  * Add get_viewport js script
  * widget icon
  * font replacement
  * font replacement
  * font replacement
  * Fix example
  * Update built assets
  * Fix broken examples
  * Fix typo on reset-password.less
  * lowercase buttons
  * lowercase buttons
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * fixes css
  * Fix indentation on example
  * fixes css
  * Merge branch 'new_style' of github.com:auth0/widget into new_style
  * fixes css
  * Little example style
  * Update build and example build
  * Extend click handling on social buttons to containing div, not just span
  * fixes css
  * fixes forgot
  * fixes forgot
  * fixes forgot
  * fixes forgot
  * fixes signup
  * reset done
  * fix fonts
  * fix fonts
  * fix fonts
  * fix fonts
  * new style improvements
  * new style
  * new style
  * fixes
  * fixes
  * fixes
  * fixes
  * fixes

v3.1.4 / 2014-05-17
===================

  * Updating auth0.js to 2.1.4
  * Revert "Update README.md"
  * Revert "Update README.md"
  * Revert "Update README.md"
  * Revert "Update README.md"
  * Update README.md
  * Update README.md
  * Update README.md
  * Update README.md
  * 3.1.3
  * Merge pull request #41 from auth0/fix-popup-auth0-ad
  * Fixing issue: signInWithAuth0 not doing popup redirect correctly.

v3.1.3 / 2014-05-13
===================

  * Oops, reverting uneccessary changes to index.html
  * 3.1.2
  * Fixing issues with DB connections and popup.
  * Update README.md

v3.1.2 / 2014-05-12
===================

  * Fixing issues with DB connections and popup.

v3.1.1 / 2014-05-09
===================

  * Updating auth0.js to 2.1.3
  * Update README.md
  * Adding integration tests section

v3.1.0 / 2014-05-08
===================

  * Merge pull request #38 from auth0/popup-mode
  * Updating auth0.js to 2.1.2
  * Adding validation for popupCallback.
  * Minor: Updating spanish translation
  * Fixing popup translation.
  * Implementing popup mode (callbackOnLocationHash) for widget.
  * Updating to 2.1.0 version of auth0.js

v3.0.13 / 2014-05-03
====================

  * point to cdn.auth0.com for zocial fonts
  * Update README.md

v3.0.12 / 2014-04-19
====================

  * update auth0.js

v3.0.11 / 2014-04-19
====================

  * do not gzip assets
  * Update README widget version to 3.0.10
  * regenerate widget

v3.0.10 / 2014-04-18
====================

  * chineese names for social chineese providers

v3.0.9 / 2014-04-03
===================

  * add forceJSONP option
  * Adding error handling.
  * Updating README

v3.0.8 / 2014-03-31
===================

  * Updating auth0.js -> 2.0.9
  * Update README.md
  * 3.0.7
  * add instagran

v3.0.6 / 2014-03-29
===================

  * add weibo

v3.0.5 / 2014-03-29
===================

  * Updating to latest version of auth0.js -> 2.0.7

v3.0.4 / 2014-03-29
===================

  * Updating to auth0.js 2.0.6
  * Update README.md

v3.0.3 / 2014-03-28
===================

  * Updating to 2.0.3 and remove inCallback method.

v3.0.2 / 2014-03-28
===================

  * Revert "Adding popup example."
  * Adding widget.inCallback to example.
  * Propagating inCallback method of auth0.js
  * Upgrading to auth0.js 2.0.2
  * Adding popup example.

v3.0.1 / 2014-03-27
===================

  * Updating to 2.0.1 auth0.js

v3.0.0 / 2014-03-27
===================

  * Updating to auth0.js 2.0.0

v2.6.8 / 2014-03-26
===================

  * update auth0-js
  * 2.6.7
  * mark sharepoint as enterprise connection

v2.6.6 / 2014-03-21
===================

  * fix issue with returning user experience on enterprise connections
  * disable browserstack ie10 test

v2.6.5 / 2014-03-21
===================

  * update auth0.js

v2.6.4 / 2014-03-18
===================

  * include pingfederate and ip strategies

v2.6.3 / 2014-03-18
===================

  * fix main field in package.json

v2.6.2 / 2014-03-07
===================

  * add sharepoint logo

v2.6.1 / 2014-03-04
===================

  * update to latest auth0js that fixes the issue of url starting with /#/

v2.6.0 / 2014-03-04
===================



v2.5.15 / 2014-03-04
====================

  * update to auth0js 1.6.0 and mark parseHash as obsolete. Using getPRofile instead

v2.5.14 / 2014-03-02
====================

  * add evernote, ebay and soundcloud

v2.5.13 / 2014-03-02
====================

  * update shopify colors

v2.5.12 / 2014-03-01
====================

  * miicard
  * bring back signup footer text

v2.5.11 / 2014-02-27
====================

  * change yammer colors

v2.5.10 / 2014-02-27
====================

  * include yammer icon

v2.5.9 / 2014-02-27
===================

  * support yammer strategy

v2.5.8 / 2014-02-26
===================

  * Bumping to version 2.5.7
  * Updating built/minified version with latest translations.
  * Updating spanish translations

v2.5.6 / 2014-02-25
===================

  * add straetgies

v2.5.5 / 2014-02-25
===================

  * shopify, dwolla, wordpress

v2.5.4 / 2014-02-24
===================

  * minor

v2.5.3 / 2014-02-24
===================

  * auth0-js: "~1.3.10"

v2.5.2 / 2014-02-24
===================

  * prevent animations in popup mode in order to trigger popup inmediately

v2.5.1 / 2014-02-24
===================

  * update auth0.js

v2.5.0 / 2014-02-23
===================

  * implement popup for signin
  * 2.4.29

v2.4.29 / 2014-02-22
====================

  * use ´réinitialiser´ instead of ´changer´
  * updating and improving fr translations
  * Merge pull request #26 from jjaffeux/alias-locales
  * alias fr and nl to fr-FR and nl-NL json files

v2.4.28 / 2014-02-20
====================

  * remove unused files
  * use grunt-maxcdn instead of grunt-invalidate-cloudfront

v2.4.27 / 2014-02-19
====================

  * add domainUserLabel translate to spanish

v2.4.26 / 2014-02-18
====================

  * signup mode: support description text
  * minor

v2.4.25 / 2014-02-18
====================

  * don't show signup/reset mode if connection does not support it

v2.4.24 / 2014-02-17
====================

  * google-oauth2 strategy: avoid "accounts selector" in loggedin mode

v2.4.23 / 2014-02-17
====================

  * keep the order of the social connections specified in the options.connections array. closes #20

v2.4.22 / 2014-02-17
====================

  * restore fitbit, yandex, renren and baidu icons

v2.4.21 / 2014-02-13
====================

  * improve error messages for signup and reset

v2.4.20 / 2014-02-13
====================

  * improve error messages

v2.4.19 / 2014-02-12
====================

  * don't hide close button (width: 281px to 340px)

v2.4.18 / 2014-02-11
====================

  * reset the password field when changing login->forgot->login. closes #18
  * copy the email field from login view to the signup/forgot view. closes #17

v2.4.17 / 2014-02-11
====================

  * add aol strategy

v2.4.16 / 2014-02-11
====================

  * make a copy of zocial.css to be used from auth0-server

v2.4.15 / 2014-02-11
====================

  * build

v2.4.14 / 2014-02-11
====================

  * add yahoo and aol

v2.4.13 / 2014-02-10
====================

  * add enableADRealmDiscovery option default to true

v2.4.12 / 2014-02-06
====================

  * support auth0-adldap strategy in ip ranges

v2.4.11 / 2014-02-06
====================

  * rebuild
  * check matching ip  for auth0-adldap connections

v2.4.10 / 2014-02-06
====================

  * if there is userAndPass connection with domain use that one during signin

v2.4.9 / 2014-02-05
===================

  * minor

v2.4.8 / 2014-02-05
===================

  * minor

v2.4.7 / 2014-02-05
===================

  * minor
  * include "signin.loadingMessage" in all dictionaries
  * take loading signing message from dictionary
  * loading message for sign-in

v2.4.6 / 2014-02-05
===================

  * internal option to avoid initial focus
  * code improvements
  * container mode: don't set focus on first input

v2.4.5 / 2014-01-30
===================

  * add more specificificitificifitcity to the reset rule 2
  * 2.4.4
  * add more specificificitificifitcity to the reset rule

v2.4.4 / 2014-01-30
===================

  * add more specificificitificifitcity to the reset rule
  * 2.4.3
  * fix for loop array

v2.4.3 / 2014-01-29
===================

  * fix for loop array
  * remove stuff from login.less

v2.4.2 / 2014-01-26
===================

  * add yahoo, renren, baidu

v2.4.1 / 2014-01-11
===================

  * minor

v2.4.0 / 2014-01-11
===================

  * add from AD experience

v2.3.18 / 2014-01-05
====================

  * support extraparameters

v2.3.17 / 2014-01-03
====================

  * expose auth0 instance from Auth0Widget.prototype.getClient
  * Merge pull request #13 from diegobim/master
  * pt-BR translation
  * pt-BR translation

v2.3.16 / 2013-12-26
====================

  * username_style: username | email

v2.3.15 / 2013-12-20
====================

  * fix issue in ie8 with Array.filter
  * add ie8

v2.3.14 / 2013-12-19
====================

  * added salesforce-sandbox strategy

v2.3.13 / 2013-12-18
====================

  * bug fixing: dont show password input if there is not any db conn

v2.3.12 / 2013-12-18
====================

  * bug fixing: showOrHidePassword is not called when there is not auth0 strategies

v2.3.11 / 2013-12-17
====================

  * use chrome options instead of containerMode

v2.3.10 / 2013-12-17
====================

  * support containerMode (plain or pro)

v2.3.9 / 2013-12-12
===================

  * increate timeout hack for ios7

v2.3.8 / 2013-12-12
===================

  * minor UI fix
  * Merge pull request #11 from JasperV/patch-1
  * Update nl-NL.json

v2.3.7 / 2013-12-05
===================

  * minor UI fix when there are only social connections

v2.3.6 / 2013-11-28
===================

  * code improvements

v2.3.5 / 2013-11-28
===================

  * ignore email validations if input type is not "email"

v2.3.4 / 2013-11-28
===================

  * password field should be disabled when the email belongs to an enterprise connection. closes  #9

v2.3.3 / 2013-11-27
===================

  * restored usernamePassword authentication with "ad" strategy

v2.3.2 / 2013-11-26
===================

  * fix iOS webview issue with on focus event
  * add /w2/ prefix to on-prem assets url
  * fix test

v2.3.1 / 2013-11-21
===================

  * Fix styles and IE10 bugs

v2.3.0 / 2013-11-21
===================

  * add logout method

v2.2.7 / 2013-11-20
===================

  * fix text-align center

v2.2.6 / 2013-11-20
===================

  * allow SSO for database connections

v2.2.5 / 2013-11-20
===================

  * escape unicode characters to ASCII - IE issue

v2.2.4 / 2013-11-20
===================

  * escape unicode characters to ASCII - IE issue

v2.2.3 / 2013-11-20
===================

  * add charset=UTF-8 to Content-Type in cdn

v2.2.2 / 2013-11-20
===================

  * fix can't find auth0 strategy when opening in signup or reset mode

v2.2.1 / 2013-11-19
===================

  * fix .signin after .signup
  * fix tests timing isuse

v2.2.0 / 2013-11-19
===================

  * add .signup and .reset
  * refactored reset

v2.1.0 / 2013-11-19
===================



v2.0.16 / 2013-11-19
====================

  * refactor and implement social sign up
  * small refactoring with underscore
  * small refactoring, remove xtend

v2.0.15 / 2013-11-18
====================

  * change overlay position to fixed, close #5
  * 2.0.14
  * improve signin with db connections on mobile

v2.0.14 / 2013-11-15
====================

  * improve signin with db connections on mobile
  * fix broken test window.matchMedia

v2.0.13 / 2013-11-14
====================

  * make links bigger on mobile
  * hide close button on mobile
  * do not focus inputs on mobile
  * fix test

v2.0.12 / 2013-11-14
====================

  * improve l&f for mobile

v2.0.11 / 2013-11-14
====================

  * fix separator and ie8 overlay
  * fix grunt deployment to cdn
  * add copy:release before upload to cdn
  * minor
  * fix hasTransitions when the script is placed in <head> (jsfiddle)

v2.0.10 / 2013-11-14
====================

  * prevent IE8 overlay when theme is static
  * minor
  * fix test harness
  * change grunt to invalidate cdn files

v2.0.9 / 2013-11-14
===================

  * minor
  * fix loading message on reset password
  * show loading during signup / fix error messages on signup
  * 2.0.8

v2.0.8 / 2013-11-14
===================

  * fix issue not returning from loading to reset pass when it fails
  * call auth0.signup() with auto_login:false in orde to use _signInWithAuth0 local method

v2.0.7 / 2013-11-13
===================

  * minor

v2.0.6 / 2013-11-13
===================

  * fix bug on error login from db connection
  * minor

v2.0.5 / 2013-11-13
===================

  * minor

v2.0.4 / 2013-11-13
===================

  * add transitionend prefixes
  * 2.0.3
  * fix several issues in ie8

v2.0.3 / 2013-11-13
===================

  * fix several issues in ie8
  * fix broken test ie9

v2.0.2 / 2013-11-13
===================

  * fix change password bug
  * fix broken tests

v2.0.1 / 2013-11-12
===================

  * fix minor
  * 2.0.0
  * big refactoring, introduce transitions
  * allow request_id as signin option
  * 1.3.7
  * accept protocol

v2.0.0 / 2013-11-12
===================

  * big refactoring, introduce transitions

v1.3.7 / 2013-11-11
===================

  * accept protocol

v1.3.6 / 2013-11-10
===================

  * allow scope in options
  * minor

v1.3.5 / 2013-11-08
===================

  * improve css reset
  * fix header h1 align

v1.3.4 / 2013-11-08
===================

  * improve css reset
  * minor

v1.3.3 / 2013-11-08
===================

  * add a css reset haaaarrmoso

v1.3.2 / 2013-11-08
===================

  * improve browserify support

v1.3.1 / 2013-11-08
===================

  * add browserify transforms to package.json

v1.3.0 / 2013-11-08
===================

  * add customization to readme
  * prefix all css classes and ids with a0-
  * minor
  * update readme
  * fix broken test
  * minor

v1.2.0 / 2013-11-07
===================

  * refactorization and add i18n

v1.1.1 / 2013-11-06
===================

  * fix callbackOnLocationHash const parameter
  * 1.1.0
  * remove borders in embedded mode
  * minor fix

v1.1.0 / 2013-11-06
===================

  * remove borders in embedded mode
  * minor
  * minor
  * upload to cdn with sourcemaps
  * removed extraParameters reference
  * minor

v1.0.0 / 2013-11-06
===================

  * add version in cdn version
  * change parseHash api and introduce callbackOnLocationHash, remove extraParams
  * if no userPass connections and one connection only, redirect
  * execute "build" task before "s3" task
  * minor
  * code improvements
  * minor
  * minor
  * fixed IE9 tests. disabled IE8 tests
  * improvements
  * ui
  * more tests
  * loggedIn: show email instead of strategy name
  * minor
  * removed getClient() method
  * minor
  * bug fixing
  * Update package.json
  * minor
  * bug fixing
  * hide footer for non free subscriptions
  * minor
  * get client from blob
  * cdn option
  * should use domain as assetsUrl if domain is not *.auth0.com
  * increase loading panel height
  * bug fixing
  * minor
  * minor
  * minor
  * updated to auth0-js 0.2.2
  * Update README.md
  * extract strategies
  * simplify tests
  * minor
  * renamed options.cdn with options.assetsUrl
  * support cdn option
  * Update README.md
  * minor
  * updated to auth0 0.2.1
  * minor
  * fix bug with password placeholders in IE9
  * minor improvement
  * minor
  * minor
  * loading panel
  * fix UI issues when options.container is specified
  * minor
  * minor
  * use the cdn instead of s3 for assets. closes #3
  * improved example
  * use underscore instead of alter the prototype of arrays. closes #1
  * Update README.md
  * support extraParameters
  * Update README.md
  * Update README.md
  * improved example
  * minor
  * Update README.md
  * Update README.md
  * Update README.md
  * minor
  * support options.container and options.theme
  * removed unused css
  * IE8 and iphone
  * chrome, FF and IE8
  * only chrome and FF tests
  * all devices for tests
  * updated .travis.yml
  * container option
  * minor
  * code improvements
  * support for auth0-adldap connections
  * improve placeholders styles for IE
  * more tests
  * only chrome tests
  * minor
  * Update README.md
  * tests for signup and change password
  * tests for login with social/db/enterprise connections
  * first tests
  * minor
  * configured browserstack/testem
  * Update README.md
  * minor
  * do not pollute windown when used as a module
  * Update README.md
  * support for IE8 (WIP)
  * code improvements
  * placeholders for IE9
  * minor
  * minor
  * bug fixing
  * if no social connections and one enterprise connection only, login
  * minor
  * bug fixing
  * minor
  * take string resources from options.resources
  * improvements
  * changePassword
  * signup
  * minor
  * move fonts and images to CDN
  * minor
  * removed base64 encoded images
  * enabled yuicompress
  * add close.png and spinner.gif as a base64 string
  * less & cleanslate
  * minor
  * show method: specify connections from options.connections
  * get configured connections using auth0.js
  * added getClient() method to return auth0js instance
  * rename Auth0 to Auth0Widget
  * removed opensans
  * code improvements
  * showOrHidePassword method
  * minor
  * get sso data
  * code improvements
  * minor
  * showError / showSuccess helper methods
  * minor
  * signIn with enterprise connection
  * signIn with social connections
  * showSignIn method
  * moved font files to widget/font
  * include all css files
  * setTop method
  * minor
  * configured insert-css
  * switch to browserify-ejs
  * widget structure and scripts
  * Delete .gitignore
  * Create .gitignore
  * Delete LICENSE
  * Update README.md
  * Initial commit
