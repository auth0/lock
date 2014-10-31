
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
