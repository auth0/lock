## [0.1.11] - 2015-09-27

### Changed

- [] Restore responseType authentication option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/13af294d5912279d3b85116eb684391ac04c00a7

### Fixed

- [] Fetch Gravatar when taking email from localStorage (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/3aeff30cf95d9d4b16c9a1dc220cad87061a137b
- [] Show close button in confirmation panes (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/1c44878d1881ff4e79a5c53b82e28a94040fec40
- [] Fix Auth0 monkey patch for making requests (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/4e6261ecf5468e385e8a9021ff7c0bd68be4a17e
- [] Add missing lockID param in WebAPI.getProfile (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/add2a9cd0667b9cda2b358be243eb6284bd8a397

### Added

- [] Add some private API methods for the landing page (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/f532963d7762f6a82067d89ee0e836a942e241aa

## [0.1.10] - 2015-09-26

### Fixed

- [] missing returns (`Matias Woloski`)
  https://github.com/auth0/lock-passwordless/commit/10eff93123ef563b5eecb387a26181a1e807e019
- [] Minor fix border confirmation screen (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/812269c8b1ba1b9ef4a728415b0dcc6517a257ad
- [] Update README.md (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/d0d234e81384ab1f73d6b5fa4e24c196133ea376

## [0.1.9] - 2015-09-24

### Changed

- [] Update auth0.js dependency (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/898bddaa9f3626b4b3f79811504125150cd7335c
- [] Remove responseType authentication option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/a9f2daae99aeb2e25b022704fce7103a396a8734
- [] Add rememberLastLogin option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/8cd892eb46a1085402e0b5736549ede369f90071
- [] Destroy Lock data after it has been closed (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/494ad94a7d612f3affc1892b1ad8dc7cdcd05cf9

### Fixed

- [] Fix magiclink reponse type (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/e74ec2884af93b0e9001de2bbad2a6b672875dba
- [] Support callbackURL in magiclink (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/3e40b1af02619a09dbdee925f529347f7853a34c
- [] Use callbackURL to trigger redirect mode (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/67cb277a53ba1f72466b3b26cbf349780fa2bf7e
- [] Merge pull request #27 from auth0/refactor-playground (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/fc42a10bc5be0e2cec7721da50a48bc4f41e4608
- [] Change timing check animation (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/ed656916f52733c4994536037554ce49bdc5c943
- [] Show bg solid on mobile (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/6b7357f9b0b0d5658969af045e7aae2b1a867f90
- [] Improve strategy for solid background on mobile (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/7feba7e0fc18e94d090440ceebead32355bbfaba
- [] Use an A tag for the "did not receive code?" link (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/9127fb8b52a8d2fdb2de90ebbb24c36247cbf3d4
- [] Fix pop up modal (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/381fe071df6a7d32280643e03f56c630af4e16f5
- [] Change order of phone number and location inputs (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/824ed900362d1459a2576c1d631f51ddc1b8be66
- [] Fix animation mobile (blur disabled for the moment) (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/b67fcc77a556c5a8d2a8f577783c066139526898
- [] Upper case defaultLocation option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/3eba37086542734989b33d8e1c36b9cdd6ad8efa
- [] Fix border radius opened (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/6a8220f774fe01f058cdfe07495bf71970a92960
- [] Do not allow to close on mobile (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/87c53b8e2de75b7641e99b6bb1127c4ac2508492
- [] Reduce "did not receive code?" font size (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/87ed47f96b87a030686bce460ac914794268dc49
- [] Shorten sms and emailcode headerText messages (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/108a2000c079bc5738ecf49047f1cad09f228b51
- [] Protect against empty primaryColor (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/5d2f003eb9c113fe4845090175a61590e49043e2
- [] Fix visibility content mobile (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/9dbb6be2d40faf37ba6dab491e17850f2397b37b
- [] Hide everything besides Lock when in small screen (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/e185d3e2a3e753cd82dfcd00f2bc560d9d6a4240

### Added

- [] Add getProfile and parseHash methods (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/975b721a5e6f4f59910b2422b00445b59c63377e

## [0.1.8] - 2015-09-22

### Fixed

- [] First iteration to show better errors (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/ff6a4e4f9059ae94a28223ed6461aabcaa4ee013
- [] Fix header blur browser mobile (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/2d834aba76e83e6116ce9896997c8f5d8b4a5472
- [] First approach mobile-friendly (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/d307667b9c64b960d0e6059b2e01002123012f33
- [] Clean up of style (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/22b5a4a76bb64c00bd9392daf527224cdd033558

### Added

- [] Redirect mode and auth options (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/b104ee4b8a84f5179582f2c9cb96df214b274838
- [] Rename submitButtonColor option to primaryColor (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/dcacbca3f61cb90778475cf7982a1167c1b6ff13
- [] Add submitButtonColor option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/97c5fdbc66bdb03451072353afc4c4239a14bfd5
- [] Add a hint to resend the code for sms and email (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/7158326a2b2c8cb8833a1c3a65bc6f605fc5ee49


## [0.1.7] - 2015-09-17

### Changed

- [] Remove error hint as soon as the value changes (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/658cab150fafbe2254e0fa8a97b79e964726cd46
- [] Consider screens up to 380px wide as small screens (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/ab1406d97c371fd81256ac6e7521c626567433f5
- [] Improve location filtering algorithm (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/ed373f2b85859e4024457a3f6b03dee7e55a686f

### Fixed

- [] Try lock widget mobile-friendly (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/0cd55434da8c8bf9620fe984f2b36f2c6802b382
- [] Fix auto focus after location select (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/2697f3eb6a3b678abfe0443b597af6fbf0446dd9
- [] Put all strings in a dict (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/28b19706dab558537c49344f040ca7ca2179e6c0
- [] Fix location animate (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/9c6abf6f4c3db08aaf341c7aa6713fb9c7d91b7b
- [] Don't close with ESC when selecting location (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/67464dc3c4e713c6621aa4e576c474823937321d
- [] Add focus submit (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/08976264c4f9cb9cfaa5d155a8b9285141e053d0
- [] Shorten magiclink confirmation message (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/d50971b5b1290ab73afe96917fda41baa026b934
- [] Show email in magiclink confirmation (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/56b02f07186557429c5ae18a21cb87799b773c9e
- [] Change fadein mobile (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/d2d2e3ae2a9dfa4871fbc9235964637c5979727e
- [] Capitalize resending label (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/07a1a6939cf98fe2199d767f8c10778c3420334f
- [] Focus verification code input automatically (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/684830284d4868f86c30ba70b5b84b30bed0fe30
- [] Highlight on focus VcodeInput (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/87652a1f9ca8ae62f33cf2a64e080fd96e193abd
- [] Disable autocapitalize in email and vcode inputs (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/7581188e9683c592ead24dee7a83ecb5ca44a2b1
- [] Disable autocomplete/autofill (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/70c0b0eee60b883e86b28c8f8b37aef9548b6486
- [] Fix design page (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/9d7fdb6cb74537d8f9379783711081ebfcb5954f
- [] Ensure location selector is over the close button (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/c467a10e62cd4a52b0982f7977c7c6acc1dadb90
- [] Support tab navigation (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/25d456378c3abeb04ec62aae732a77ec708fbca9

### Added

- [] Remember last email/phone number (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/952fea6411cb6034853337a5b07f3777a358757d
- [] Autohighlight if there's only one location (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/05656355d605fb19ea4c238f1802f77c80db1c0e
- [] Support authParams option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/103c5b80373af72f15a4d11bce38225a0363168b


## [0.1.6] - 2015-09-17

### Fixed

- [] Uncomment some CSS so the Lock can show up (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/5cba92b0356d42d2e04ddf9bca40d99570e1e071

## [0.1.5] - 2015-09-16

### Changed

- [] Use ISO code to configure the default location (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/ad74cfa17b632cf7d7c65f9a9e763cb057d12816
- [] Update Argentina dialling code (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/38c00218e519e6e078c4cf6c0b37942691d93c5e

### Fixed

- [] Optimize location items render (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/c68063b7619edd5fef958aeef76b23c71062ec34
- [] Keep location items content in one line (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/e419bec8c2028eb4070b48b537189de2de499f2c
- [] Fix search input (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/7ce423132e170e9e21bdca27552a40147cb61e0c
- [] Put a space in the AR dialling code (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/dc6a36931045c3b80e535efc525129d4e382b470
- [] Use -webkit-transition also when animating height (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/2555d1e3ae78b7142cd6624fd594d08f562c7553
- [] Add a CSS class in InputWrap when input has focus (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/6b167049524d0f1f52a7e135f41a2b2bc41a964c
- [] Add focus style (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/6991e082712bd7401cb4f12000c53c867974f9ba
- [] Fix tablet view (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/1390339464555434f172aba4df8ea2c634503c3e
- [] Clear the verification code when going back (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/c20cf41c5418baf765790ee6e54d074f409052ce
- [] Truncate long names in location input (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/80c8ebf72d91413dcedaafe334cd4dff00f9c851

### Added
- [] Add the autoclose option (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/40bcdcb2affc29f699f82a3afda9cadc2651768f
- [] Scroll to next/prev location item when using keys (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/2d0fdb61a1fcf7689106b1015b5bb98ce68625fa

## [0.1.4] - 2015-09-14

### Changed

- [] Don't guarantee support for IE9 just yet (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/999fcfead3f3dedd92e7cea9cd852077b39e6c4e

### Fixed

- [] Improved location selector UX (`Gabriel Andretta`)
- [] Fix fade out avatar in the last step (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/239d74506c76e5a822183294f52904d09e755bf4
- [] Update instructions when asking the phone number (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/56fe64aa5aed1fa2949095f36e2bb5c1200a8e75
- [] Remove unneeded SMS heading (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/b72cba237c51c8421bdb9e66ec394bbc1fba5523
- [] Ensure tests are run correctly in the CI (`Gabriel Andretta`)
- [] Explicitly test in safari 8 (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/8f02e240d3f5fe5d882e7e865273e434191c205b
- [] Don't show cred pane buttons in confirmation panes (`Gabriel Andretta`)
- [] Fix reverse animation (`Benjamin Flores`)
  https://github.com/auth0/lock-passwordless/commit/1a668413ffd8b7b9205de8cd2585c281ebbc2493

## [0.1.3] - 2015-09-14

### Fixed

- [] Fix submit button styling (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/f594a62668fff8216b47365f471026b42e63ed1d

## [0.1.2] - 2015-09-14

### Fixed

- [] Fix submit button styling (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/f594a62668fff8216b47365f471026b42e63ed1d

## [0.1.1] - 2015-09-07

### Changed

- [] Change default location for phone number to US (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/d81e623bb4990d5022b6de7d95832a25d25ef299

### Fixed

- [] Protect against box-sizing * reset (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/58b1d25c7ac6ea3df6fbf75477cab67991f5be00
- [] Improve the animation between credential panes (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/e44b5eb59029b182542497cb36ff9157c2f83658
- [] Don't use error.message as a custom error (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/beddac607390745b664c9ea1be58f744263c23d3
- [] Close the lock even when in inline mode (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/5cbfca23da29de71a36eb9d0b6e27bf5d659f1b0
- [] Don't display terms when entering the vcode (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/c3b170d5fa0e167721dcc7542c3af2aebba30556
- [] Disable inputs when submitting (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/a41f4e02d16bfea5a7a2274b31d45d84d14cb469

### Added

- [] Allow to set a default location for phone number (`Gabriel Andretta`)
  https://github.com/auth0/lock-passwordless/commit/6e335f1fbcfb2ddd84562af6074471ce5e11b403

## [0.1.0] - 2015-09-07

- Initial release
