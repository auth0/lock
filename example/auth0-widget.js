;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var fs          = require('fs');
var insertCss   = require('insert-css');

var Auth0Widget = require('./widget');

insertCss("@charset \"UTF-8\";#auth0-widget{/*!\n* CleanSlate\n*   github.com/premasagar/cleanslate\n*\n*//*!\n\tZocial Butons\n\thttp://zocial.smcllns.com\n\tby Sam Collins (@smcllns)\n\tLicense: http://opensource.org/licenses/mit-license.php\n\t\n\tYou are free to use and modify, as long as you keep this license comment intact or link back to zocial.smcllns.com on your site.\n*//*! normalize.css v1.0.1 | MIT License | git.io/normalize */}#auth0-widget .cleanslate,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate p,#auth0-widget .cleanslate td,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate tr,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate table,#auth0-widget .cleanslate th,#auth0-widget .cleanslate tbody,#auth0-widget .cleanslate tfoot,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate thead,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate li,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate li,#auth0-widget .cleanslate iframe,#auth0-widget .cleanslate strong,#auth0-widget .cleanslate legend,#auth0-widget .cleanslate em,#auth0-widget .cleanslate s,#auth0-widget .cleanslate cite,#auth0-widget .cleanslate span,#auth0-widget .cleanslate input,#auth0-widget .cleanslate sup,#auth0-widget .cleanslate label,#auth0-widget .cleanslate dfn,#auth0-widget .cleanslate object,#auth0-widget .cleanslate big,#auth0-widget .cleanslate q,#auth0-widget .cleanslate font,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate acronym,#auth0-widget .cleanslate small,#auth0-widget .cleanslate img,#auth0-widget .cleanslate strike,#auth0-widget .cleanslate code,#auth0-widget .cleanslate sub,#auth0-widget .cleanslate ins,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate var,#auth0-widget .cleanslate a,#auth0-widget .cleanslate abbr,#auth0-widget .cleanslate applet,#auth0-widget .cleanslate del,#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate tt,#auth0-widget .cleanslate b,#auth0-widget .cleanslate i,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section,#auth0-widget .cleanslate time,#auth0-widget .cleanslate mark,#auth0-widget .cleanslate audio,#auth0-widget .cleanslate video{background-attachment:scroll!important;background-color:transparent!important;background-image:none!important;background-position:0 0!important;background-repeat:repeat!important;border-color:black!important;border-color:currentColor!important;border-radius:0!important;border-style:none!important;border-width:medium!important;bottom:auto!important;clear:none!important;clip:auto!important;color:inherit!important;counter-increment:none!important;counter-reset:none!important;cursor:auto!important;direction:inherit!important;display:inline!important;float:none!important;font-family:inherit!important;font-size:inherit!important;font-style:inherit!important;font-variant:normal!important;font-weight:inherit!important;height:auto!important;left:auto!important;letter-spacing:normal!important;line-height:inherit!important;list-style-type:inherit!important;list-style-position:outside!important;list-style-image:none!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1;outline:invert none medium!important;overflow:visible!important;padding:0!important;position:static!important;quotes:\"\" \"\"!important;right:auto!important;table-layout:auto!important;text-align:inherit!important;text-decoration:inherit!important;text-indent:0!important;text-transform:none!important;top:auto!important;unicode-bidi:normal!important;vertical-align:baseline!important;visibility:inherit!important;white-space:normal!important;width:auto!important;word-spacing:normal!important;z-index:auto!important;-moz-border-radius:0!important;-webkit-border-radius:0!important;-moz-box-sizing:content-box!important;-webkit-box-sizing:content-box!important;box-sizing:content-box!important;text-shadow:none!important}#auth0-widget .cleanslate,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate p,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section{display:block!important}#auth0-widget .cleanslate table{display:table!important}#auth0-widget .cleanslate thead{display:table-header-group!important}#auth0-widget .cleanslate tbody{display:table-row-group!important}#auth0-widget .cleanslate tfoot{display:table-footer-group!important}#auth0-widget .cleanslate tr{display:table-row!important}#auth0-widget .cleanslate th,#auth0-widget .cleanslate td{display:table-cell!important}#auth0-widget .cleanslate nav ul,#auth0-widget .cleanslate nav ol{list-style-type:none!important}#auth0-widget .cleanslate ul,#auth0-widget .cleanslate menu{list-style-type:disc!important}#auth0-widget .cleanslate ol{list-style-type:decimal!important}#auth0-widget .cleanslate ol ul,#auth0-widget .cleanslate ul ul,#auth0-widget .cleanslate menu ul,#auth0-widget .cleanslate ol menu,#auth0-widget .cleanslate ul menu,#auth0-widget .cleanslate menu menu{list-style-type:circle!important}#auth0-widget .cleanslate ol ol ul,#auth0-widget .cleanslate ol ul ul,#auth0-widget .cleanslate ol menu ul,#auth0-widget .cleanslate ol ol menu,#auth0-widget .cleanslate ol ul menu,#auth0-widget .cleanslate ol menu menu,#auth0-widget .cleanslate ul ol ul,#auth0-widget .cleanslate ul ul ul,#auth0-widget .cleanslate ul menu ul,#auth0-widget .cleanslate ul ol menu,#auth0-widget .cleanslate ul ul menu,#auth0-widget .cleanslate ul menu menu,#auth0-widget .cleanslate menu ol ul,#auth0-widget .cleanslate menu ul ul,#auth0-widget .cleanslate menu menu ul,#auth0-widget .cleanslate menu ol menu,#auth0-widget .cleanslate menu ul menu,#auth0-widget .cleanslate menu menu menu{list-style-type:square!important}#auth0-widget .cleanslate li{display:list-item!important;min-height:auto!important;min-width:auto!important}#auth0-widget .cleanslate strong{font-weight:bold!important}#auth0-widget .cleanslate em{font-style:italic!important}#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate code{font-family:monospace!important}#auth0-widget .cleanslate a,#auth0-widget .cleanslate a *,#auth0-widget .cleanslate input[type=submit],#auth0-widget .cleanslate input[type=radio],#auth0-widget .cleanslate input[type=checkbox],#auth0-widget .cleanslate select{cursor:pointer!important}#auth0-widget .cleanslate a:hover{text-decoration:underline!important}#auth0-widget .cleanslate button,#auth0-widget .cleanslate input[type=submit]{text-align:center!important}#auth0-widget .cleanslate input[type=hidden]{display:none!important}#auth0-widget .cleanslate abbr[title],#auth0-widget .cleanslate acronym[title],#auth0-widget .cleanslate dfn[title]{cursor:help!important;border-bottom-width:1px!important;border-bottom-style:dotted!important}#auth0-widget .cleanslate ins{background-color:#ff9!important;color:black!important}#auth0-widget .cleanslate del{text-decoration:line-through!important}#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate q{quotes:none!important}#auth0-widget .cleanslate blockquote:before,#auth0-widget .cleanslate blockquote:after,#auth0-widget .cleanslate q:before,#auth0-widget .cleanslate q:after,#auth0-widget .cleanslate li:before,#auth0-widget .cleanslate li:after{content:\"\"!important}#auth0-widget .cleanslate input,#auth0-widget .cleanslate select{vertical-align:middle!important}#auth0-widget .cleanslate select,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate input{border:1px solid #ccc!important}#auth0-widget .cleanslate table{border-collapse:collapse!important;border-spacing:0!important}#auth0-widget .cleanslate hr{display:block!important;height:1px!important;border:0!important;border-top:1px solid #ccc!important;margin:1em 0!important}#auth0-widget .cleanslate *[dir=rtl]{direction:rtl!important}#auth0-widget .cleanslate mark{background-color:#ff9!important;color:black!important;font-style:italic!important;font-weight:bold!important}#auth0-widget .cleanslate{font-size:medium!important;line-height:1!important;direction:ltr!important;text-align:left!important;font-family:\"Times New Roman\",Times,serif!important;color:black!important;font-style:normal!important;font-weight:normal!important;text-decoration:none!important;list-style-type:disc!important}#auth0-widget .zocial,#auth0-widget a.zocial{border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);color:#fff;-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);cursor:pointer;display:inline-block;font:bold 100%/2.1 \"Lucida Grande\",Tahoma,sans-serif;padding:0 .95em 0 0;text-align:center;text-decoration:none;text-shadow:0 1px 0 rgba(0,0,0,0.5);white-space:nowrap;-moz-user-select:none;-webkit-user-select:none;user-select:none;position:relative;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .zocial:before{content:\"\";border-right:.075em solid rgba(0,0,0,0.1);float:left;font:120%/1.65 zocial;font-style:normal;font-weight:normal;margin:0 .5em 0 0;padding:0 .5em;text-align:center;text-decoration:none;text-transform:none;-moz-box-shadow:.075em 0 0 rgba(255,255,255,0.25);-webkit-box-shadow:.075em 0 0 rgba(255,255,255,0.25);box-shadow:.075em 0 0 rgba(255,255,255,0.25);-moz-font-smoothing:antialiased;-webkit-font-smoothing:antialiased;font-smoothing:antialiased}#auth0-widget .zocial:active{outline:0}#auth0-widget .zocial.icon{overflow:hidden;max-width:2.4em;padding-left:0;padding-right:0;max-height:2.15em;white-space:nowrap}#auth0-widget .zocial.icon:before{padding:0;width:2em;height:2em;box-shadow:none;border:0}#auth0-widget .zocial{background-image:-moz-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(49%,rgba(255,255,255,0.05)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1))}#auth0-widget .zocial:hover,#auth0-widget .zocial:focus{background-image:-moz-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.15)),color-stop(49%,rgba(255,255,255,0.15)),color-stop(51%,rgba(0,0,0,0.1)),to(rgba(0,0,0,0.15)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial:active{background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,transparent),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.dropbox,#auth0-widget .zocial.github,#auth0-widget .zocial.gmail,#auth0-widget .zocial.openid,#auth0-widget .zocial.secondary,#auth0-widget .zocial.stackoverflow,#auth0-widget .zocial.salesforce{border:1px solid #aaa;border-color:rgba(0,0,0,0.3);border-bottom-color:#777;border-bottom-color:rgba(0,0,0,0.5);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial.dropbox:focus,#auth0-widget .zocial.dropbox:hover,#auth0-widget .zocial.github:focus,#auth0-widget .zocial.github:hover,#auth0-widget .zocial.gmail:focus,#auth0-widget .zocial.gmail:hover,#auth0-widget .zocial.openid:focus,#auth0-widget .zocial.openid:hover,#auth0-widget .zocial.secondary:focus,#auth0-widget .zocial.secondary:hover,#auth0-widget .zocial.stackoverflow:focus,#auth0-widget .zocial.stackoverflow:hover,#auth0-widget .zocial.twitter:focus .zocial.twitter:hover,#auth0-widget .zocial.salesforce:focus .zocial.salesforce:hover{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.5)),color-stop(49%,rgba(255,255,255,0.2)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.15)));background-image:-moz-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-webkit-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial.dropbox:active,#auth0-widget .zocial.github:active,#auth0-widget .zocial.gmail:active,#auth0-widget .zocial.openid:active,#auth0-widget .zocial.secondary:active,#auth0-widget .zocial.stackoverflow:active,#auth0-widget .zocial.wikipedia:active,#auth0-widget .zocial.salesforce:active{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,rgba(0,0,0,0)),to(rgba(0,0,0,0.1)));background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.amazon:before{content:\"a\"}#auth0-widget .zocial.dropbox:before{content:\"d\";color:#1f75cc}#auth0-widget .zocial.facebook:before{content:\"f\"}#auth0-widget .zocial.github:before{content:\"\\00E8\"}#auth0-widget .zocial.gmail:before{content:\"m\";color:#f00}#auth0-widget .zocial.google:before{content:\"G\"}#auth0-widget .zocial.googleplus:before{content:\"+\"}#auth0-widget .zocial.guest:before{content:\"?\"}#auth0-widget .zocial.ie:before{content:\"6\"}#auth0-widget .zocial.linkedin:before{content:\"L\"}#auth0-widget .zocial.openid:before{content:\"o\";color:#ff921d}#auth0-widget .zocial.paypal:before{content:\"$\"}#auth0-widget .zocial.stackoverflow:before{content:\"\\00EC\";color:#ff7a15}#auth0-widget .zocial.twitter:before{content:\"T\"}#auth0-widget .zocial.vk:before{content:\"N\"}#auth0-widget .zocial.windows:before{content:\"W\"}#auth0-widget .zocial.yahoo:before{content:\"Y\"}#auth0-widget .zocial.office365:before{content:\"z\"}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.amazon{background-color:#ffad1d;color:#030037;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.dropbox{background-color:#fff;color:#312c2a}#auth0-widget .zocial.facebook{background-color:#4863ae}#auth0-widget .zocial.github{background-color:#fbfbfb;color:#050505}#auth0-widget .zocial.gmail{background-color:#efefef;color:#222}#auth0-widget .zocial.google{background-color:#4e6cf7}#auth0-widget .zocial.googleplus{background-color:#dd4b39}#auth0-widget .zocial.guest{background-color:#1b4d6d}#auth0-widget .zocial.ie{background-color:#00a1d9}#auth0-widget .zocial.linkedin{background-color:#0083a8}#auth0-widget .zocial.openid{background-color:#f5f5f5;color:#333}#auth0-widget .zocial.paypal{background-color:#fff;color:#32689a;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.twitter{background-color:#46c0fb}#auth0-widget .zocial.vk{background-color:#45688e}#auth0-widget .zocial.windows{background-color:#0052a4;color:#fff}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:.1em 0;padding:0 1em}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#333}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget button:-moz-focus-inner{border:0;padding:0}@font-face{font-family:'zocial';src:url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.eot')}@font-face{font-family:'zocial';src:url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABeQAA0AAAAAIGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcZnuAykdERUYAAAFMAAAAHwAAACAATgAGT1MvMgAAAWwAAABIAAAAVk/l3EBjbWFwAAABtAAAAPYAAAIKnl567Gdhc3AAAAKsAAAACAAAAAj//wADZ2x5ZgAAArQAABKLAAAZsAMpJrBoZWFkAAAVQAAAADAAAAA2/3JSWWhoZWEAABVwAAAAIAAAACQFfQH5aG10eAAAFZAAAABjAAAAgDtOAbdsb2NhAAAV9AAAAEQAAABEWZZf+G1heHAAABY4AAAAHgAAACAAcAC+bmFtZQAAFlgAAADeAAABhlbD9/Jwb3N0AAAXOAAAAFYAAABsUemhhHicY2BgYGQAgpOd+YYg+lwlxxkYDQBA+QYqAAB4nGNgZGBg4ANiCQYQYGJgZGBmUACSLGAeAwAFxABVAHicY2BkEmOcwMDKwMHow5jGwMDgDqW/MkgytDAwMDGwMjPAALMAAwIEpLmmMDgwKH5gYHzw/wGDHuNrBvUGBgZGkBwAj6YLSHictZC9LkRRFIW/O67xzx2GYQwzElHMNBMvoBKNqIQoiVBKJBLxMlSimnJoKGi8gxeQUCh1y7o/jZurtJO1917n7HWy1wEGSNEgcCYIzYKEh7y7rtNyN+1ulTU6dNlgky222WGXfQ444phTzjjngkuurPr8QopfY8Wadk6zZ82hNSfFGn3rTR961Yue9aRHPehefZ/3jFv1dKcbXaujdpRu2qU4WhnyUbe3pj1F1KhQtecyqfnYf8mplFPEl/VGM2TZzWA5Plr8PTGU5GFG4jLKWELHmZhkKpuIav7ESjVjs8lqSzDPQtHuM8bcH77+JX4A6/Y7NwAAAAAAAf//AAJ4nJ1YeYwkV32u33tV79V9H313T/f0MdMzPdNnzeGZ2WN2vYftXXbXF2vvrtc2uw7GDkZADARI2BChiFh2hL1BcsAKicLhkEgJRJEwREFKLMcRoBAnUkKwEsFi5AASOIqTzOT3qmcdkv9I1/T0O6pevXrv+33f9ysJJGn320SCb0tEkjyYIdIOVnYk8ZGx77vwA7gmWVJF6kjLkjQOhoMK4TZ0gTeSYTocTNJJO95rCERD0sNysgnpaDJu3PtyfrntqM5bts/Vrgyv1M4dut+1Z13decuhu2ceev98vA+4nHP3zea6ClmvwvNBa719+OTV9KmThw51W/1DJ58C6xxx/PdBowAySGR3d/cazvd7Uk3axBmPJlvAojCp0ChkjXqrzePEJqJAW+NkNBkO4iRttQebIEpBjGc5MBmPWu2Wa91f+yWnUPYbSWV/NFdeVGJPtSJ6Bl5qRPktu9rrw0KZZy2udSx3dO12eAhruWb/3FCxo6IT55LgrOsCkz0TLjCaBJHv3JFTTeZaO59kFE/2ZudXjgUVScZ5f4ech+9KbekG6bB0CtdyNFmH1niUinlnFd6oQBTiYkZhnIhi1pOGMS7zeNTusXar0WJpBYbxpEeYMh6Oh9EwakSN8dn9xUhV9PH2mcknZge54mJglOxq7syR7XOrNyxupBRklVuqL4fB0qE6G1Qrs/pwYxZmLuUvXcpvLxwOc44DB5eXDhe0YW1p1vYtraLHvUZvezjvzfYXmzpXdJ0ZikkZ9P9zbg3SN62QyUhcfumSBBIgVn4V/hhxIqWjFPdfPNMAF5xnD8W4LTfqrAu4NdkxBmbu73b23bGvMznaJAr1a0ELQIHNwklFky0tOGXEC0e92mBhY2NhUAvuSpdURVUtVVbAszWTqmpDoojRa/As4uEh6f3SRwQiUoTkOogV24C9SpzEyQChGU+PN6aDU8SJirNjm+Cisy51lLBCppdPpzmqR6EDjDfq2bx70G6l43TU5wJ2IT4PZ8pkGCejdgOLqqxpzrJqMO6zSK+EIbWNYtD3IqbIlKg2d6xcGKZtPWeqlk0AgBCgivjIWJJlh3plLwgX3SLRZcWmprO/aXI1oISeAwbKsm9SmDHMJKgSh6twLNQ5VQzVMCuWZigUVDUhjLNS6USvEtt3zMdFl5PCfFI08F5UVqmsU1FSGNcUYufbRby9PgSoFy0TUeIyxz8feYfhLqCGbcwrDJ4koHZBN5ATqMAxHM9wvPn/RnG2aohjXOc0a4Ns8aLwZ4AxXag3BJBJ2bNBGVZIxbN/RhzncojjQlxWtbkVKERlVTzff+2+Qlz4DnKeJ81LEhEcMoUMzpp6Q28dxgLfw0EZhggSnHjU34BGHNLZcsn3PL8MpdIjW2+X1XK8+siR9QPNtwM8PpxxvWLe9XbeC7ftfObLvu7lbv7iV2+6ZQVg2f0sRs9/SG3yNnhMehInMUWwgGy6hsGO7IawrTAE80isFmlvwjqt0jhBBOKyCSQiwDfpeLIlZ1eKtR5UIJu3jXxNkzAbI3sOgWScdQPBTEWvaMAxsSojKBDOCkcgIRcqBqNc4RCWgFGmMEZtolLNlXmzatmWbehczgAMxMLIpHouhyepqqHolseVwHZ1QnzNLylgMgaUyTo0o7CAVxq6Zum03qSWZnOTE5nX7aCzv5WMl0GVGYV3i3AAoETXPDo/R1SFyzKGyqqutmwmpqIhmrluIp69SDFNTU9UqsoWVEemlU0MyUSmslN2cg0OruowmWuyBjPFouHJYtJKl3iaCqTQ4CaRZ2bL2/dQT3NsxPlUF9+FuthHjONypshb4qcHGxAPewIDuL4C8QiPScq4+EahTXExHffNh+cOmrrtu4vrxVqx6i//2gl6fLLSWmza881mvl3ZvO3RQ289WyArgzZR1CM94nqrM43K+hHZs8Y3zWnJUl5x2yVvdPn80YW16XyukePIc/uR4zbpFoj7VhQMsEyDERatbFexPBwMpztty5zVBWER3F8beGllfkbVGNNVy7M0plIvNMyFggVyrHA/b64uLDI2DjSqj7aOToK4WU9U7ZQqeCCx4e6ZUcmlgq3y1W5zwd43We3nY6YUObEPdqryfJh3vNGDZ44vWiaSTgCGjjRDTf26l7hGfgHnHyBzrEsncFUxiLYEVhPegyXAydtYRz4e/u+2ABe6imuOGp4iqziA8P0/bQ2ObRN/6Pn50iie+Ium7blqcX0w9keeVyiO4rG/aFm+g20vjgMsZt3O2B+7XqE0bI+DhayttIZtI98tFkbV53RkTEWPnnM8gh/ze8/pZla3fQFNc+cHX7J9RD8xjOmpBqhf2uszxLlMk4Q+SYfIVxBHx/GZT+Pe4Y5VyTCJyxAKUeH1MswgjXRJfQNa6GYm+Pz4H7Wr1UdTFcZVOuRt0ba8CaIVz+RRM6FtniacEgS6tvobGDFk1WGgIbcfkwFryi9vK7JGKfyTiCRTW/+5d0ZcblCskNdlIPecn6/ZZIXA7+kUx1D+gPGLsiiUyoTwy4ARwt4ja7Kiil3k+JjyfR8jBsiUCx1J6c634OIKWZEyb3ONDHFvc9Lt0mXpo+gAJoKChAuYxEJrQTgyDJYtGE2EJKcCr11ATDIu2sfTba8oZRru0RZqGPJTmwl6ak3VYzhJN8mG0I5kOkqm6NlCZqQ2DQOhJBwVZxkI++CT999DdcI1rjkLD45O/vqKTD5erxbn7Co3EtnLU6Ktadp2z1qbUTSUYODIY3KXMg05UCflop/vDO4IPZTeyGQKVJzFl5DtjNBXlEQhoYcBgSQVEJZopmlQclaWj7XQqVJLYVqhvDIkuBdPNAaWqRCizRgOBMiKHA/SWyAVxdR8FhPXPmfFOrKuTJtUkVGeHFrjynIa5oDFWuK4lmx9HQegCvIWkjH1+w7eWV70sAK4pSA44jH0Qr+dxZiUojkUahyhSKJQZSbxsROH+idOcPPixXu/ebE/Pn7RtQYXX301i8/df9/9IeGoewbqXiQVJamdttMEIZbwtgPjJC0DTdI2Mk+SRuxtb/vE5bd+/P77n758ebB8+cmnrj6Fs7k0eun06ct33nnvmdvPnzxZL5dOwhdg/dx9t+088AU4Wa3hfTDL2H0FduH7OEd0DzeA2MdsG7MdFx4rFWKG9Lpnv9LWlBAmgmYnGPR8Dx0cd/4N5tvbdjzCufNLDyydm4uiuXNYOD8XducPRYZd8JcKpm0oapCvblRD3+XcMgolNx8VooPdec8rlztz3bn5dqXseV+8vHy+E0Wd8/37+xfmwnDuwr1HVleSuaqF9GeUj7aLlQZhnoqGjgE0KsX2ahmlhNiVuWR19caFDo7i+r5brrQ7Ess86su4L21Uk3XpoHSj9ADyXxhnLrMxD42WcBT4JBgYaDPwWZgwT0LXbZhkWYxwUXxqqFm95YsSFigmAOkw6qO4Z15qi2SBsASjNu5/Y4y7vnV2375FxIdpNgeyo+arNFdqT/KhbSWlzdhxYvxGxWYR/z6Ta+RyDXs7VyZOGDCO3hXlFWIT2Q9pY2lps5zO9HoztZ5RcMho1jaovO6641ZuzvJDPzTqX6zncvXcH1lBYNlBAFfEeLmdb7322p897sY6Q3+ryEMOwPH76HhpaerfSRfXZhYzhxRXpbUpb0FkK840r5OrEPWUseKlXiBkrQo8GWfiAMX50ahrWeV+JWdy4RVYsT5b1vTByf6sq4F81KNBGBtG95OT6Fix+HQtnS25BpAt4sb5HD4fVw3dz0UWkuZYKdSajbL6OfjrwU4HuOAB1ev8YjUuEsHhXPgBeAJ5nGOEOIjeBGOkKknROOEzuAtNDLExRkv7p74YKryNcdHZ+dHzzyvPy182/9x6On42ub3xrlmzO9Ot/S187rN/8/PzxxfC7oPz6fxvNS+3vpH/VP6f+V/wLFZ8SScJ/Im0IX0AIzq+nr+kk71jD/r/c6A2XI+D6wfSYxLG6eiNi5A2JxVZjDN8oykRVnI6uqDf69fuDbvcChkz3Up3brQ6Thfm6zrjKDFIRVY+rlabYWJaClFdRQgFM80kbtcqUajho9dRILlHDY37LlMMqlMVbI1zbmACrdsKUyhVwshxfY2F4GsAfr+7ikzf6qK1gAdV7pg5y0Zjyjyvoqm6qjksUOSVfne2ERpc+DjceUVzivOd0WAVs0LREKM15GFJ8Ww1p6BgoaUBR6agmaWGYRPBySA7kRvErtakVZ9ALXARnIrjlbhGhV95QqrQy/B53OO2tCSUG+oMcYfLO+6PWhigfQy7zHxl/0ctud7KojLe+03a6XjSw8yxz9v9Hmpd0k94n1WQtPppgtduQpvkOwd9/0BnqeUmHpxa6xzw/YOdtVOndn54eDA43P/L7P9rR45w2U/45hZPfMqOHEH6R3RtYk3msDJXr8+V3m24rvHK2ptE5fQ7T73cz67M/m9cuABaYlHt9GmNWol2zwU9tqc1O0Z3piC2/wHj+9uZT1MlU3LRp/TTiCdRe5w2Iwui5vgb+Pk+JDvfy75PlV+A+IXy5/9l7sc0/+POX009nin58BNcs560Ld0lPSxJAeZJEwEpgbJNwNIb0Opl1B8P46xnCmVlggi8fkJ93NoD52B6pQ3t+h4is3Y+mUKWh3tI7YFJHM3nbJ8PcFSTA03TaO5ux3bifF0zCHpgH2LL1FHN6VlHhic0Dzedt5p51+YIaDVMqsUR0RVFMwnidHGm7KMoE6Kauea7ZG7lOn0LXEMLZmuuyuA3NQs8+1NdAl/JaapMA33tWtsLuKqAqzkiBTH0PLXQVfzjrBZTpBRfCV2RpRN0GJ4f+78i0OppOA5F7cf0FjMWmZ9GQdfcAvNcJjOzkHNUtJKSsvv67t/jPr2MHKQjNxSkuiQ1G7yRDpPGEvBZoQwIPVZnQloESLNfmDttHL/z5J03FwsFKF196erVl/LPPPLIM4+854lLl5649Ez71VfP3nrrO0T71QOPiJ4Ll0SPtHfPf4N/ha9LMWrXDZh93IiR0AOx4gwXPoqjCmQ+L51QhpuQbTPuFPYy3Ju96iR7N5CZwbag9XQicn54JTnWqRQeeKaoG/HjF868k0LUfW3fB5otdaHzvhSc+MYHNPXWjcMPGNQowy2HzmxsdjoHAN6xvZ0/ppBmBT5dCSydxfdexjShBG++T1ev3Fmr37Tzh0F/de3KpN9IQofqtx5be6uqv+nGhMOJh756w1xnH8CBuflHzf0HLBJsoZaLZ1Uznf4malFJulW6T3pQelT6iPSM9KcCx3Q4tSHCbgrbKnJmEP5E5IBZJrNJpnDNTqsQRKx412hTgdlGXbxCEka4nb1HSqcp+3DcFv6MX5dzLsbCBCASdhlZuwpDIeF4ow1oBD+V2kVisGkwjJKReCeLxtlWuiAyeSCm7aDQxl6IXjFBoTN116GkjplmYtmQr+ia64WK7CIAZXdURn5F6LG4PKoGMfcMS9G0vBlqkPN8dhC4Ud5fbjg5qtZ6tVrPRrp1SgXVJOccVT1Wq8oMqkUaBz6VY9dUQi9H5ZLB4a4Vr2BhpCmq4Wk0tCyTwmJQtFXww1BFSq7nZZxS2dFU5cca5t1xHvOoqOa7hpFRNQsnsV4p5dGSa5GB9oGI5EVk7p7nH+bcdWL2NHQjA9j+Xm//0usYOpot7zMUS7coefgMoOc+BkouHyn5EFWjnITomWM3Vj96sxOLOFWoa9g6ZjksH0qZ5n5w93U4C19DfZ9BpGdOLEEoo73aQhsd4u/YG9HrL7siOHN4cuSWuzEj6jJypiq35F5hptetVuFrp46fbzwrM+XTn1YUeIHtSuNxmv6dJFmSs/sa/AhexDj20EW0MLI2MK5OS3dLb5HeLr1XuiJJswISNtTTEJkwE5T2ng+st5TrjpC1mqJYgezVd9aQZn3pnk/EmKtP31GIOp0OhKXJtHM44G+Yy9a0BwsjvqdgDA6GlRii8tXIdqKoGjwbOXYUlaOdF0M0jaICQ1GCGIsfxpPwZMcJDzpRXM66I9uO8IQwKof4wTbbuRpm7U74nkoYTk+OsPRwOYxK4YdxxBDPvQ0vKUXhbW4QliIc0w7xN7TtEGLbCXAo0VIOr2BTFFlOuPMw9uPNwo/hTylsOKI3eF1cEZaWAyxXAtQ5S7oLXoWLmKdWpa40kNYwsjFSY8xUCaaYdqYxQkcmqPRIanFaIVNtGU04qhhrT7CKHRX4rFr0uemaqlfEfNh2882iZ6gy+VCix6NG8pPeupJozkQlUDK6dDWtfmiyZrQ4a8FFRCfT8c+SnYP1fjBDK2EhXNj3YvnIxpLyO7+rb5+ed/Xmpju79PvWSM7nW61czlpS1Z4k/Tc/tXiPAHicY2BkYGAA4qooY554fpuvDNxMDCBwrpLjDIz+//P/TeYMxtdALgcDWBoAKlkMKXicY2BkYGB8/f8mgx4Lw/+f/xiYMxiAIihAHgCk1AZ5eJxjYoCCVRCK8RMDAxOQZooDsjsYGBnXAGkvIF/k/z+m3P9/mEqBbBC/HIgPAbERUH4RQz8T2/9fIH2MD4BiWkB6ItgcIRYGhklg8xgYeJgY/v8GYcYrYH4DAz8DLwDcABUuAAAAAAAAAAAAAA4AWAC0ASQBYAIYAogCxAOMA9QENASwBSIF5gYEBjgGsgdAB5QHzgiMCQIJJgnWChAKhguIC7oMdgzYeJxjYGRgYFBk2M3AywACTEDMyAAScwDzGQAZIgEvAAB4nHWOMWoDMRBF39prh+AQUoWUgjRpdpE2jfEB9gAp3BsjlgXbAtkGnyRVjpAyx8gBcoQcI9/raVJYMOjN15/5Au54p+B8Cm54MB6JX4zHPHMyLqV/Gk+Y8W08lf4rZ1HeSrkfps48Ej8Zj2nxxqX0D+MJj3wZT6X/0LMmsVUldtCv0zYlwRuRjiMbVmS1sTtuVoJ28B2GO8sRcTTUSnMsVP/3XbQ5FUGOSk4vetWatDu0KXfRNbV3C2e5onkVfNX4INO1vy2Vmtnr/ZIRhnyWMe977Qi1vzr7BwDvOdMAAHicY2BiwA8UgZiRgYmRiYGdgZeBj0GJQYNBi0GfwZDBnMGSwYrBhsGFwZPBnaGQwYshiKGUwZUhmiGWgYVBmIGVIYKBk4GNIZS9NC/TzcDAAADphwhaAAA=) format('woff'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.ttf') format('truetype'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.svg#zocialregular') format('svg');font-weight:normal;font-style:normal}#auth0-widget .zocial.auth0:before{content:\"?\"}#auth0-widget .zocial.auth0{background-color:#ff4500;width:auto}#auth0-widget .zocial.block{display:block;margin:10px 0;text-overflow:ellipsis;overflow:hidden}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:0;padding:0 1em;font-size:14px;line-height:42px}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#747e85}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial{-webkit-font-smoothing:antialiased}#auth0-widget .popup .overlay{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;z-index:9999;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background:#000;background:rgba(0,0,0,0.8);background:-webkit-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-moz-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-ms-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);opacity:0;-webkit-transition:400ms opacity ease;-moz-transition:400ms opacity ease;transition:400ms opacity ease;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}#auth0-widget .popup .overlay.active{opacity:1}#auth0-widget .popup .overlay .panel{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;left:50%;display:none}#auth0-widget .popup .overlay .panel.active{display:block;-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:showPanel}#auth0-widget .popup .overlay .panel{-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:hidePanel;width:280px;margin:0 0 0 -140px}#auth0-widget .popup .overlay .email{margin-bottom:14px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:14px}#auth0-widget .popup .overlay .email-readonly{text-align:center;display:inherit;color:#41444a;font-weight:bold;margin-bottom:25px}#auth0-widget .panel .signup .header,#auth0-widget .panel .reset .header{margin-bottom:15px;font-size:14px;color:#41444a}#auth0-widget .panel .signup .footer{margin-bottom:15px;font-size:12px;color:#41444a;text-align:left;margin-top:10px}@-moz-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-webkit-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-o-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-ms-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-moz-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-webkit-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-o-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-ms-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}#auth0-widget .popup .panel{background:#fafafa;background-image:-webkit-linear-gradient(#fff,#fafafa);background-image:-moz-linear-gradient(#fff,#fafafa);background-image:-ms-linear-gradient(#fff,#fafafa);background-image:-o-linear-gradient(#fff,#fafafa);background-image:linear-gradient(#fff,#fafafa);z-index:10;-moz-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-webkit-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;-webkit-touch-callout:none}#auth0-widget .popup .panel:after{content:\"\";position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;-moz-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);-webkit-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4)}#auth0-widget .popup .panel header{display:block;position:relative;min-height:65px;overflow:hidden;-moz-border-radius:6px 6px 0 0;-webkit-border-radius:6px 6px 0 0;border-radius:6px 6px 0 0;background:#f1f4f6;background-image:-webkit-linear-gradient(#f1f4f6,#e9edf0);background-image:-moz-linear-gradient(#f1f4f6,#e9edf0);background-image:-ms-linear-gradient(#f1f4f6,#e9edf0);background-image:-o-linear-gradient(#f1f4f6,#e9edf0);background-image:linear-gradient(#f1f4f6,#e9edf0);border-bottom:1px solid rgba(40,69,85,0.11)}#auth0-widget .popup .panel header:before{content:'';position:absolute;height:5px;bottom:-1px;left:0;right:0;background-image:-webkit-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-moz-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-ms-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-o-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1))}#auth0-widget .popup .panel header:after{content:'';position:absolute;height:4px;bottom:0;left:0;right:0;background-image:-webkit-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-moz-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-ms-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-o-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0)}#auth0-widget .popup .panel header h1{padding:21px 20px;margin:0;font-size:18px;color:#41444a;font-weight:bold;border-bottom:1px solid #dde3e6}#auth0-widget .popup .panel header a{display:block;overflow:hidden;text-indent:200%;position:absolute;width:12px;opacity:.4;padding:5px;z-index:5}#auth0-widget .popup .panel header a:hover{opacity:.66}#auth0-widget .popup .panel header a:active{opacity:1}#auth0-widget .popup .panel header a.close{height:12px;background:url(\"https://s3.amazonaws.com/assets.auth0.com/w2/img/close.png\") 50% 50% no-repeat;background-size:12px 12px;right:19px;top:21px;cursor:pointer}#auth0-widget .popup .panel header a.close:hover{opacity:.66}#auth0-widget .popup .panel header img{height:32px;margin:16px 10px 10px 20px;position:relative;float:left}#auth0-widget .action .spinner{width:100%;background-color:#6a777f;background-image:url('https://s3.amazonaws.com/assets.auth0.com/w2/img/spinner.gif');background-repeat:no-repeat;background-position:center;margin:0;height:44px;border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-moz-user-select:none;user-select:none;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .popup .panel footer{display:block;position:relative;-moz-border-radius:0 0 5px 5px;-webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;height:25px;line-height:25px;vertical-align:middle;margin:0 15px;border-top:1px solid #dde3e6;z-index:5}#auth0-widget .popup .panel footer span{font-size:10px;color:#666}#auth0-widget .popup .panel footer a{font-size:9px;color:#333;font-weight:bold;text-decoration:none;cursor:pointer}#auth0-widget .list,#auth0-widget .iconlist{margin:25px 0;position:relative;z-index:5}#auth0-widget .list:before,#auth0-widget .list:after,#auth0-widget .iconlist:before,#auth0-widget .iconlist:after{display:table;content:\"\"}#auth0-widget .list:after,#auth0-widget .iconlist:after{clear:both}#auth0-widget .list span{display:block;margin:10px 0;cursor:pointer}#auth0-widget .iconlist{text-align:center}#auth0-widget .iconlist span{margin:0 2px}#auth0-widget .forgot-pass{font-size:12px;color:#666;font-weight:normal}#auth0-widget .create-account{display:none;margin-top:20px;text-align:center}#auth0-widget .create-account a{font-size:12px;color:#6d6d6d;text-decoration:none}#auth0-widget .create-account a:hover{text-decoration:underline}#auth0-widget .loggedin span.centered.all{color:#008cdd;cursor:pointer}#auth0-widget .loggedin span.centered{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget .loggedin span.centered.all:hover{text-decoration:underline}#auth0-widget .signup .options a.cancel,#auth0-widget .reset .options a.cancel{color:#008cdd;cursor:pointer;text-decoration:none}#auth0-widget .signup .options a.cancel:hover,#auth0-widget .reset .options a.cancel:hover{text-decoration:underline}#auth0-widget .signup .options,#auth0-widget .reset .options{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget form{margin:30px!important;margin-bottom:22px;position:relative;z-index:5}#auth0-widget form label{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;font-size:18px;padding:10px 12px;border:1px solid #b4becd;border-top-color:#b0baca;border-bottom-color:#d3d9e2;-moz-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-webkit-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:black;margin:0;font-family:'Helvetica Neue',Helvetica,Arial Geneva,sans-serif}#auth0-widget .placeholder{color:#ccc}#auth0-widget form input:focus{border-color:#5695db #70a7e4 #89b8ec #70a7e4;outline:0;-moz-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;-webkit-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db}#auth0-widget form .invalid input{outline:0;border-color:#ff7076;border-top-color:#ff5c61;-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5)}#auth0-widget header .error{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#b95353;text-align:center}#auth0-widget header .success{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#0fad29;text-align:center}#auth0-widget form .note{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form .note a{color:#008cdd;text-decoration:none}#auth0-widget form .invalid .error{visibility:visible}#auth0-widget form button{display:block;margin:20px 0 0 0;cursor:pointer;width:100%}#auth0-widget .action{text-align:right;margin:0 30px 30px 30px;position:relative;z-index:5}#auth0-widget form .action{margin:0}#auth0-widget .action button{width:auto}#auth0-widget .separator{position:relative;text-align:center;margin:0 0 25px 0}#auth0-widget .separator:before{content:\"\";display:block;border-top:1px solid #7f8899;width:200px;left:50%;margin-left:-100px;height:1px;position:absolute;top:50%;z-index:1}#auth0-widget .separator span{background:#fafafa;padding:0 10px;position:relative;z-index:5;color:#7f8899;font-size:13px;font-weight:bold;text-shadow:0 1px 0 white}#auth0-widget span.back{display:block;color:#008cdd;text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;cursor:pointer;position:relative;z-index:5;outline:0}#auth0-widget span.back:hover{text-decoration:underline}#auth0-widget .signin .panel.strategies .list .email{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;text-align:center}#auth0-widget .zocial.office365:before{content:\"W\"}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.fitbit:before{content:\"#\"}#auth0-widget .zocial.fitbit{background-color:#45c2c5;color:#fff}#auth0-widget .zocial.yandex:before{content:\"&\"}#auth0-widget .zocial.yandex{background-color:#f00;color:#fff}#auth0-widget .zocial.renren:before{content:\"r\"}#auth0-widget .zocial.renren{background-color:#0056b5;color:#fff}#auth0-widget .zocial.baidu:before{content:\"u\"}#auth0-widget .zocial.baidu{background-color:#2832e1;color:#fff}#auth0-widget .popup .overlay .onestep{width:345px;margin:0 0 0 -172px}@media(max-width:280px){#auth0-widget .popup .overlay .panel{width:240px;margin:0 0 0 -120px}#auth0-widget .signin .popup .panel.strategies .list{margin:12px}#auth0-widget form{margin:12px}#auth0-widget form input{padding:5px}#auth0-widget .popup .panel header{margin:0;padding:0}#auth0-widget .popup .panel header h1{padding:14px 16px;margin:0;font-size:22px}#auth0-widget .popup .panel header a.close{right:14px;top:16px}}@media(min-width:281px) and (max-width:340px){#auth0-widget .popup .overlay .panel{margin:0;left:0;height:100%;width:100%;border-radius:0}#auth0-widget .popup .zocial,#auth0-widget .popup a.zocial{font-size:18px}#auth0-widget .signin .popup .panel.strategies .list{margin:15px}#auth0-widget form{margin:15px 25px}#auth0-widget form input{padding:6px;font-size:18px}#auth0-widget .popup .panel header{margin:0;padding:0;min-height:32px}#auth0-widget .popup .panel header h1{padding:12px 16px;margin-top:1px;font-size:20px}#auth0-widget .popup .panel header img{height:32px;margin:9px 10px 6px 18px}#auth0-widget .zocial.primary{line-height:34px}#auth0-widget .action .spinner{height:34px}#auth0-widget .create-account{margin-top:20px}#auth0-widget .popup .overlay .email{margin-bottom:5px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:5px}}#auth0-widget .loading{display:none;border:0;overflow:hidden;position:fixed;visibility:visible;margin:0;padding:0;left:0;top:0;width:100%;height:100%;z-index:100000;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background-color:rgba(255,255,255,0.5)}#auth0-widget .loading .message{position:absolute;top:50%;margin-top:-110px;width:100%;text-align:center;font-size:22px;font-family:Helvetica,arial,freesans,clean,sans-serif;color:#333}#auth0-widget .loading .balls{position:absolute;left:50%;top:50%;margin-left:-45px;margin-top:-45px;width:90px;height:90px}#auth0-widget .loading .balls>div{position:absolute;width:86px;height:86px;opacity:0;-moz-transform:rotate(225deg);-moz-animation:orbit 7.15s infinite;-webkit-transform:rotate(225deg);-webkit-animation:orbit 7.15s infinite;-ms-transform:rotate(225deg);-ms-animation:orbit 7.15s infinite;-o-transform:rotate(225deg);-o-animation:orbit 7.15s infinite;transform:rotate(225deg);animation:orbit 7.15s infinite}#auth0-widget .loading .balls>div>div{position:absolute;width:11px;height:11px;background:#333;left:0;top:0;-moz-border-radius:11px;-webkit-border-radius:11px;-ms-border-radius:11px;-o-border-radius:11px;border-radius:11px}#auth0-widget .loading .balls .ball01{-moz-animation-delay:1.56s;-webkit-animation-delay:1.56s;-ms-animation-delay:1.56s;-o-animation-delay:1.56s;animation-delay:1.56s}#auth0-widget .loading .balls .ball02{-moz-animation-delay:.31s;-webkit-animation-delay:.31s;-ms-animation-delay:.31s;-o-animation-delay:.31s;animation-delay:.31s}#auth0-widget .loading .balls .ball03{-moz-animation-delay:.62s;-webkit-animation-delay:.62s;-ms-animation-delay:.62s;-o-animation-delay:.62s;animation-delay:.62s}#auth0-widget .loading .balls .ball04{-moz-animation-delay:.94s;-webkit-animation-delay:.94s;-ms-animation-delay:.94s;-o-animation-delay:.94s;animation-delay:.94s}#auth0-widget .loading .balls .ball05{-moz-animation-delay:1.25s;-webkit-animation-delay:1.25s;-ms-animation-delay:1.25s;-o-animation-delay:1.25s;animation-delay:1.25s}@-moz-keyframes orbit{0%{opacity:1;z-index:99;-moz-transform:rotate(180deg);-moz-animation-timing-function:ease-out}7%{opacity:1;-moz-transform:rotate(300deg);-moz-animation-timing-function:linear;-moz-origin:0}30%{opacity:1;-moz-transform:rotate(410deg);-moz-animation-timing-function:ease-in-out;-moz-origin:7%}39%{opacity:1;-moz-transform:rotate(645deg);-moz-animation-timing-function:linear;-moz-origin:30%}70%{opacity:1;-moz-transform:rotate(770deg);-moz-animation-timing-function:ease-out;-moz-origin:39%}75%{opacity:1;-moz-transform:rotate(900deg);-moz-animation-timing-function:ease-out;-moz-origin:70%}76%{opacity:0;-moz-transform:rotate(900deg)}100%{opacity:0;-moz-transform:rotate(900deg)}}@-webkit-keyframes orbit{0%{opacity:1;z-index:99;-webkit-transform:rotate(180deg);-webkit-animation-timing-function:ease-out}7%{opacity:1;-webkit-transform:rotate(300deg);-webkit-animation-timing-function:linear;-webkit-origin:0}30%{opacity:1;-webkit-transform:rotate(410deg);-webkit-animation-timing-function:ease-in-out;-webkit-origin:7%}39%{opacity:1;-webkit-transform:rotate(645deg);-webkit-animation-timing-function:linear;-webkit-origin:30%}70%{opacity:1;-webkit-transform:rotate(770deg);-webkit-animation-timing-function:ease-out;-webkit-origin:39%}75%{opacity:1;-webkit-transform:rotate(900deg);-webkit-animation-timing-function:ease-out;-webkit-origin:70%}76%{opacity:0;-webkit-transform:rotate(900deg)}100%{opacity:0;-webkit-transform:rotate(900deg)}}@-ms-keyframes orbit{0%{opacity:1;z-index:99;-ms-transform:rotate(180deg);-ms-animation-timing-function:ease-out}7%{opacity:1;-ms-transform:rotate(300deg);-ms-animation-timing-function:linear;-ms-origin:0}30%{opacity:1;-ms-transform:rotate(410deg);-ms-animation-timing-function:ease-in-out;-ms-origin:7%}39%{opacity:1;-ms-transform:rotate(645deg);-ms-animation-timing-function:linear;-ms-origin:30%}70%{opacity:1;-ms-transform:rotate(770deg);-ms-animation-timing-function:ease-out;-ms-origin:39%}75%{opacity:1;-ms-transform:rotate(900deg);-ms-animation-timing-function:ease-out;-ms-origin:70%}76%{opacity:0;-ms-transform:rotate(900deg)}100%{opacity:0;-ms-transform:rotate(900deg)}}@-o-keyframes orbit{0%{opacity:1;z-index:99;-o-transform:rotate(180deg);-o-animation-timing-function:ease-out}7%{opacity:1;-o-transform:rotate(300deg);-o-animation-timing-function:linear;-o-origin:0}30%{opacity:1;-o-transform:rotate(410deg);-o-animation-timing-function:ease-in-out;-o-origin:7%}39%{opacity:1;-o-transform:rotate(645deg);-o-animation-timing-function:linear;-o-origin:30%}70%{opacity:1;-o-transform:rotate(770deg);-o-animation-timing-function:ease-out;-o-origin:39%}75%{opacity:1;-o-transform:rotate(900deg);-o-animation-timing-function:ease-out;-o-origin:70%}76%{opacity:0;-o-transform:rotate(900deg)}100%{opacity:0;-o-transform:rotate(900deg)}}@keyframes orbit{0%{opacity:1;z-index:99;transform:rotate(180deg);animation-timing-function:ease-out}7%{opacity:1;transform:rotate(300deg);animation-timing-function:linear;origin:0}30%{opacity:1;transform:rotate(410deg);animation-timing-function:ease-in-out;origin:7%}39%{opacity:1;transform:rotate(645deg);animation-timing-function:linear;origin:30%}70%{opacity:1;transform:rotate(770deg);animation-timing-function:ease-out;origin:39%}75%{opacity:1;transform:rotate(900deg);animation-timing-function:ease-out;origin:70%}76%{opacity:0;transform:rotate(900deg)}100%{opacity:0;transform:rotate(900deg)}}#auth0-widget input[disabled]{background-color:#d9dee0}#auth0-widget article,#auth0-widget aside,#auth0-widget details,#auth0-widget figcaption,#auth0-widget figure,#auth0-widget footer,#auth0-widget header,#auth0-widget hgroup,#auth0-widget nav,#auth0-widget section,#auth0-widget summary{display:block}#auth0-widget audio,#auth0-widget canvas,#auth0-widget video{display:inline-block;*display:inline;*zoom:1}#auth0-widget audio:not([controls]){display:none;height:0}#auth0-widget [hidden]{display:none}#auth0-widget html{font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}#auth0-widget html,#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea,#auth0-widget h1,#auth0-widget h2,#auth0-widget div,#auth0-widget span,#auth0-widget a{font-family:sans-serif}#auth0-widget body{margin:0}#auth0-widget a:focus{outline:thin dotted}#auth0-widget a:active,#auth0-widget a:hover{outline:0}#auth0-widget h1{font-size:2em;margin:.67em 0}#auth0-widget h2{font-size:1.5em;margin:.83em 0}#auth0-widget h3{font-size:1.17em;margin:1em 0}#auth0-widget h4{font-size:1em;margin:1.33em 0}#auth0-widget h5{font-size:.83em;margin:1.67em 0}#auth0-widget h6{font-size:.75em;margin:2.33em 0}#auth0-widget abbr[title]{border-bottom:1px dotted}#auth0-widget b,#auth0-widget strong{font-weight:bold}#auth0-widget blockquote{margin:1em 40px}#auth0-widget dfn{font-style:italic}#auth0-widget mark{background:#ff0;color:#000}#auth0-widget p,#auth0-widget pre{margin:1em 0}#auth0-widget code,#auth0-widget kbd,#auth0-widget pre,#auth0-widget samp{font-family:monospace,serif;_font-family:'courier new',monospace;font-size:1em}#auth0-widget pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}#auth0-widget q{quotes:none}#auth0-widget q:before,#auth0-widget q:after{content:'';content:none}#auth0-widget small{font-size:80%}#auth0-widget sub,#auth0-widget sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}#auth0-widget sup{top:-0.5em}#auth0-widget sub{bottom:-0.25em}#auth0-widget dl,#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{margin:1em 0}#auth0-widget dd{margin:0 0 0 40px}#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{padding:0 0 0 40px}#auth0-widget nav ul,#auth0-widget nav ol{list-style:none;list-style-image:none}#auth0-widget img{border:0;-ms-interpolation-mode:bicubic}#auth0-widget svg:not(:root){overflow:hidden}#auth0-widget figure{margin:0}#auth0-widget form{margin:0}#auth0-widget fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}#auth0-widget legend{border:0;padding:0;white-space:normal;*margin-left:-7px}#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}#auth0-widget button,#auth0-widget input{line-height:normal}#auth0-widget button,#auth0-widget html input[type=\"button\"],#auth0-widget input[type=\"reset\"],#auth0-widget input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer;*overflow:visible}#auth0-widget button[disabled],#auth0-widget input[disabled]{cursor:default}#auth0-widget input[type=\"checkbox\"],#auth0-widget input[type=\"radio\"]{box-sizing:border-box;padding:0;*height:13px;*width:13px}#auth0-widget input[type=\"search\"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}#auth0-widget input[type=\"search\"]::-webkit-search-cancel-button,#auth0-widget input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}#auth0-widget button::-moz-focus-inner,#auth0-widget input::-moz-focus-inner{border:0;padding:0}#auth0-widget textarea{overflow:auto;vertical-align:top}#auth0-widget table{border-collapse:collapse;border-spacing:0}");

if (global.window) {
  global.window.Auth0Widget = Auth0Widget;
}

module.exports = Auth0Widget;

},{"./widget":25,"fs":15,"insert-css":16}],2:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var assert_required   = require('./lib/assert_required');
var base64_url_decode = require('./lib/base64_url_decode');
var qs                = require('qs');
var reqwest           = require('reqwest');

var jsonp             = require('jsonp');

var use_jsonp         = require('./lib/use_jsonp');
var LoginError        = require('./lib/LoginError');
var json_parse        = require('./lib/json_parse');

function Auth0 (options) {
  if (!(this instanceof Auth0)) {
    return new Auth0(options);
  }

  assert_required(options, 'clientID');
  assert_required(options, 'callbackURL');
  assert_required(options, 'domain');

  this._clientID = options.clientID;
  this._callbackURL = options.callbackURL;
  this._domain = options.domain;
  if (options.success) {
    this.parseHash(options.success);
  }
  this._failure = options.failure;
}

Auth0.prototype._redirect = function (url) {
  global.window.location = url;
};

Auth0.prototype._renderAndSubmitWSFedForm = function (formHtml) {
  var div = document.createElement('div');
  div.innerHTML = formHtml;
  var form = document.body.appendChild(div).children[0];
  form.submit();
};

Auth0.prototype.parseHash = function (callback) {
  if(!window.location.hash.match(/access_token/)) return;
  var hash = window.location.hash.substr(1);
  var parsed_qs = qs.parse(hash);
  var id_token = parsed_qs.id_token;
  var encoded = id_token.split('.')[1];
  var prof = json_parse(base64_url_decode(encoded));
  callback(prof, id_token, parsed_qs.access_token, parsed_qs.state);
};

Auth0.prototype.signup = function (options, callback) {
  var self = this;

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  query.email = options.username || options.email;
  query.password = options.password;

  query.tenant = this._domain.split('.')[0];

  function success () {
    if ('auto_login' in options && !options.auto_login) {
      if (callback) callback();
      return;
    }
    self.login(options, callback);
  }

  function fail (status, resp) {
    var error = new LoginError(status, resp);
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error);
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/signup?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return fail(0, err);
      }
      return resp.status == 200 ?
              success() :
              fail(resp.status, resp.err);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/signup',
    method:  'post',
    type:    'html',
    data:    query,
    success: success,
    crossOrigin: true
  }).fail(function (err) {
    fail(err.status, err.responseText);
  });
};

Auth0.prototype.changePassword = function (options, callback) {
  var self = this;
  var query = {
    tenant:         this._domain.split('.')[0],
    connection:     options.connection,
    email:          options.username || options.email,
    password:       options.password
  };

  function success () {
    if (callback) callback();
  }

  function fail (status, resp) {
    var error = new LoginError(status, resp);
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error);
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/change_password?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return fail(0, err);
      }
      return resp.status == 200 ?
              success() :
              fail(resp.status, resp.err);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/change_password',
    method:  'post',
    type:    'html',
    data:    query,
    success: success,
    crossOrigin: true
  }).fail(function (err) {
    fail(err.status, err.responseText);
  });
};

Auth0.prototype.login = function (options, callback) {
  if (options.username || options.email) {
    return this.loginWithDbConnection(options, callback);
  }

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  this._redirect('https://' + this._domain + '/authorize?' + qs.stringify(query));
};

Auth0.prototype.loginWithDbConnection = function (options, callback) {
  var self = this;

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  query.username = options.username || options.email;
  query.password = options.password;

  query.tenant = this._domain.split('.')[0];

  function return_error (error) {
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error);
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/login?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return return_error(err);
      }
      if('error' in resp) {
        var error = new LoginError(resp.status, resp.error);
        return return_error(error);
      }
      self._renderAndSubmitWSFedForm(resp.form);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/login',
    method:  'post',
    type:    'html',
    data:    query,
    crossOrigin: true,
    success: function (resp) {
      self._renderAndSubmitWSFedForm(resp);
    }
  }).fail(function (err) {
    var er = err;
    if (!er.status || er.status === 0) { //ie10 trick
      er = {};
      er.status = 401;
      er.responseText = {
        code: 'invalid_user_password'
      };
    }
    var error = new LoginError(er.status, er.responseText);
    return return_error(error);
  });
};

Auth0.prototype.getSSOData = function (callback) {
  return jsonp('https://' + this._domain + '/user/ssodata', {
    param: 'cbx',
    timeout: 15000
  }, function (err, resp) {
    callback(null, err ? {} : resp); // Always return OK, regardless of any errors
  });
};

Auth0.prototype.getConnections = function (callback) {
  return jsonp('https://' + this._domain + '/public/api/' + this._clientID + '/connections', {
    param: 'cbx',
    timeout: 15000
  }, callback);
};

if (global.window) {
  global.window.Auth0 = Auth0;
}

module.exports = Auth0;
},{"./lib/LoginError":3,"./lib/assert_required":4,"./lib/base64_url_decode":5,"./lib/json_parse":6,"./lib/use_jsonp":7,"jsonp":9,"qs":11,"reqwest":12}],3:[function(require,module,exports){
var json_parse = require('./json_parse');

function LoginError(status, details) {
  var obj;

  if (typeof details == 'string') {
    try {
      obj = json_parse(details);
    } catch (er) {
      obj = {message: details};      
    }
  } else {
    obj = details;
  }

  var err = Error.call(this, obj.description || obj.message || obj.error);

  err.status = status;
  err.name = obj.code;
  err.code = obj.code;
  err.details = obj;
  
  if (status === 0) {
    err.code = "Unknown";
    err.message = "Unknown error.";
  }

  return err;
}

if (Object && Object.create) {
  LoginError.prototype = Object.create(Error.prototype, { 
    constructor: { value: LoginError } 
  });
}

module.exports = LoginError;
},{"./json_parse":6}],4:[function(require,module,exports){
module.exports = function (obj, prop) {
  if (!obj[prop]) {
    throw new Error(prop + ' is required.');
  }
};
},{}],5:[function(require,module,exports){
var Base64 = require('Base64');

module.exports = function(str) {
  var output = str.replace("-", "+").replace("_", "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }
  return Base64.atob(output);
};
},{"Base64":8}],6:[function(require,module,exports){
module.exports = function (str) {
  return window.JSON ? window.JSON.parse(str) : eval('(' + str + ')');
};
},{}],7:[function(require,module,exports){
module.exports = function () {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : null;
  
  if (xhr && 'withCredentials' in xhr) {
    return false;
  }

  return 'XDomainRequest' in window && window.location.protocol === 'http:';
};
},{}],8:[function(require,module,exports){
;(function () {

  var
    object = typeof exports != 'undefined' ? exports : this, // #8: web workers
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

},{}],9:[function(require,module,exports){

/**
 * Module dependencies
 */

var debug = require('debug')('jsonp');

/**
 * Module exports.
 */

module.exports = jsonp;

/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop(){};

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts, fn){
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  var opts = opts || {};
  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0];
  var script;
  var timer;

  // generate a unique id for this request
  var id = count++;

  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      fn && fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    target.parentNode.removeChild(script);
    window['__jp' + id] = noop;
  }

  window['__jp' + id] = function(data){
    debug('jsonp got', data);
    if (timer) clearTimeout(timer);
    cleanup();
    fn && fn(null, data);
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc('__jp' + id + '');
  url = url.replace('?&', '?');

  debug('jsonp req "%s"', url);

  // create script
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);
};

},{"debug":10}],10:[function(require,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

// persist

if (window.localStorage) debug.enable(localStorage.debug);

},{}],11:[function(require,module,exports){
/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Object#hasOwnProperty ref
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * see issue #70
 */
var isRestorableProto = (function () {
  var o;

  if (!Object.create) return false;

  o = Object.create(null);
  o.__proto__ = Object.prototype;

  return o.hasOwnProperty === hasOwnProperty;
})();

/**
 * Array#indexOf shim.
 */

var indexOf = typeof Array.prototype.indexOf === 'function'
  ? function(arr, el) { return arr.indexOf(el); }
  : function(arr, el) {
      if (typeof arr == 'string' && typeof "a"[0] == 'undefined') {
        arr = arr.split('');
      }
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) return i;
      }
      return -1;
    };

/**
 * Array.isArray shim.
 */

var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

/**
 * Object.keys shim.
 */

var objectKeys = Object.keys || function(obj) {
  var ret = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret.push(key);
    }
  }
  return ret;
};

/**
 * Array#forEach shim.
 */

var forEach = typeof Array.prototype.forEach === 'function'
  ? function(arr, fn) { return arr.forEach(fn); }
  : function(arr, fn) {
      for (var i = 0; i < arr.length; i++) fn(arr[i]);
    };

/**
 * Array#reduce shim.
 */

var reduce = function(arr, fn, initial) {
  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
  var res = initial;
  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
  return res;
};

/**
 * Create a nullary object if possible
 */

function createObject() {
  return isRestorableProto
    ? Object.create(null)
    : {};
}

/**
 * Cache non-integer test regexp.
 */

var isint = /^[0-9]+$/;

function promote(parent, key) {
  if (parent[key].length == 0) return parent[key] = createObject();
  var t = createObject();
  for (var i in parent[key]) {
    if (hasOwnProperty.call(parent[key], i)) {
      t[i] = parent[key][i];
    }
  }
  parent[key] = t;
  return t;
}

function parse(parts, parent, key, val) {
  var part = parts.shift();
  // end
  if (!part) {
    if (isArray(parent[key])) {
      parent[key].push(val);
    } else if ('object' == typeof parent[key]) {
      parent[key] = val;
    } else if ('undefined' == typeof parent[key]) {
      parent[key] = val;
    } else {
      parent[key] = [parent[key], val];
    }
    // array
  } else {
    var obj = parent[key] = parent[key] || [];
    if (']' == part) {
      if (isArray(obj)) {
        if ('' != val) obj.push(val);
      } else if ('object' == typeof obj) {
        obj[objectKeys(obj).length] = val;
      } else {
        obj = parent[key] = [parent[key], val];
      }
      // prop
    } else if (~indexOf(part, ']')) {
      part = part.substr(0, part.length - 1);
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
      // key
    } else {
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
    }
  }
}

/**
 * Merge parent key/val pair.
 */

function merge(parent, key, val){
  if (~indexOf(key, ']')) {
    var parts = key.split('[')
      , len = parts.length
      , last = len - 1;
    parse(parts, parent, 'base', val);
    // optimize
  } else {
    if (!isint.test(key) && isArray(parent.base)) {
      var t = createObject();
      for (var k in parent.base) t[k] = parent.base[k];
      parent.base = t;
    }
    set(parent.base, key, val);
  }

  return parent;
}

/**
 * Compact sparse arrays.
 */

function compact(obj) {
  if ('object' != typeof obj) return obj;

  if (isArray(obj)) {
    var ret = [];

    for (var i in obj) {
      if (hasOwnProperty.call(obj, i)) {
        ret.push(obj[i]);
      }
    }

    return ret;
  }

  for (var key in obj) {
    obj[key] = compact(obj[key]);
  }

  return obj;
}

/**
 * Restore Object.prototype.
 * see pull-request #58
 */

function restoreProto(obj) {
  if (!isRestorableProto) return obj;
  if (isArray(obj)) return obj;
  if (obj && 'object' != typeof obj) return obj;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      obj[key] = restoreProto(obj[key]);
    }
  }

  obj.__proto__ = Object.prototype;
  return obj;
}

/**
 * Parse the given obj.
 */

function parseObject(obj){
  var ret = { base: {} };

  forEach(objectKeys(obj), function(name){
    merge(ret, name, obj[name]);
  });

  return compact(ret.base);
}

/**
 * Parse the given str.
 */

function parseString(str){
  var ret = reduce(String(str).split('&'), function(ret, pair){
    var eql = indexOf(pair, '=')
      , brace = lastBraceInKey(pair)
      , key = pair.substr(0, brace || eql)
      , val = pair.substr(brace || eql, pair.length)
      , val = val.substr(indexOf(val, '=') + 1, val.length);

    // ?foo
    if ('' == key) key = pair, val = '';
    if ('' == key) return ret;

    return merge(ret, decode(key), decode(val));
  }, { base: createObject() }).base;

  return restoreProto(compact(ret));
}

/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * @param {String} str | {Object} obj
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str);
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix + '=' + encodeURIComponent(String(obj));
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    if ('' == key) continue;
    if (null == obj[key]) {
      ret.push(encodeURIComponent(key) + '=');
    } else {
      ret.push(stringify(obj[key], prefix
        ? prefix + '[' + encodeURIComponent(key) + ']'
        : encodeURIComponent(key)));
    }
  }

  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

/**
 * Decode `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function decode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (err) {
    return str;
  }
}

},{}],12:[function(require,module,exports){
/*! version: 0.9.1 */
/*!
  * Reqwest! A general purpose XHR connection manager
  * (c) Dustin Diaz 2013
  * https://github.com/ded/reqwest
  * license MIT
  */
!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , twoHundo = /^20\d$/
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          contentType: 'application/x-www-form-urlencoded'
        , requestedWith: xmlHttpRequest
        , accept: {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , xml:  'application/xml, text/xml'
            , html: 'text/html'
            , text: 'text/plain'
            , json: 'application/json, text/javascript'
            , js:   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o.crossOrigin === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (twoHundo.test(r.request.status))
          success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o.headers || {}
      , h

    headers.Accept = headers.Accept
      || defaultHeaders.accept[o.type]
      || defaultHeaders.accept['*']

    // breaks cross-origin requests with legacy browsers
    if (!o.crossOrigin && !headers[requestedWith]) headers[requestedWith] = defaultHeaders.requestedWith
    if (!headers[contentType]) headers[contentType] = o.contentType || defaultHeaders.contentType
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o.withCredentials !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o.withCredentials
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o.jsonpCallback || 'callback' // the 'callback' key
      , cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId)
      // , cbval = o.jsonpCallbackName || ('reqwest_' + reqId) // the 'callback' value
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      //
      // if this hack is used in IE10 jsonp callback are never called
      script.event = 'onclick'
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o.method || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o.url
      // convert non-string objects to query-string form unless o.processData is false
      , data = (o.processData !== false && o.data && typeof o.data !== 'string')
        ? reqwest.toQueryString(o.data)
        : (o.data || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o.type == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o.type == 'jsonp') return handleJsonp(o, fn, err, url)

    http = xhr(o)
    http.open(method, url, o.async === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o.before && o.before(http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(url) {
    var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/)
    return m ? m[1] : 'js'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o.url
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this
      , type = o.type || setType(this.url)

    fn = fn || function () {}

    if (o.timeout) {
      this.timeout = setTimeout(function () {
        self.abort()
      }, o.timeout)
    }

    if (o.success) {
      this._successHandler = function () {
        o.success.apply(o, arguments)
      }
    }

    if (o.error) {
      this._errorHandlers.push(function () {
        o.error.apply(o, arguments)
      })
    }

    if (o.complete) {
      this._completeHandlers.push(function () {
        o.complete.apply(o, arguments)
      })
    }

    function complete (resp) {
      o.timeout && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o.disabled)
            cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i].name, o[i].value)
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o.type && (o.method = o.type) && delete o.type
      o.dataType && (o.type = o.dataType)
      o.jsonpCallback && (o.jsonpCallbackName = o.jsonpCallback) && delete o.jsonpCallback
      o.jsonp && (o.jsonpCallback = o.jsonp)
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{}],13:[function(require,module,exports){
/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  * MIT license
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bean', this, function (name, context) {
  name    = name    || 'bean'
  context = context || this

  var win            = window
    , old            = context[name]
    , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
    , nameRegex      = /\..*/
    , addEvent       = 'addEventListener'
    , removeEvent    = 'removeEventListener'
    , doc            = document || {}
    , root           = doc.documentElement || {}
    , W3C_MODEL      = root[addEvent]
    , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
    , ONE            = {} // singleton for quick matching making add() do one()

    , slice          = Array.prototype.slice
    , str2arr        = function (s, d) { return s.split(d || ' ') }
    , isString       = function (o) { return typeof o == 'string' }
    , isFunction     = function (o) { return typeof o == 'function' }

      // events that we consider to be 'native', anything not in this list will
      // be treated as a custom event
    , standardNativeEvents =
        'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
        'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
        'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
        'keydown keypress keyup '                                        + // keyboard
        'orientationchange '                                             + // mobile
        'focus blur change reset select submit '                         + // form elements
        'load unload beforeunload resize move DOMContentLoaded '         + // window
        'readystatechange message '                                      + // window
        'error abort scroll '                                              // misc
      // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
      // that doesn't actually exist, so make sure we only do these on newer browsers
    , w3cNativeEvents =
        'show '                                                          + // mouse buttons
        'input invalid '                                                 + // form elements
        'touchstart touchmove touchend touchcancel '                     + // touch
        'gesturestart gesturechange gestureend '                         + // gesture
        'textinput'                                                      + // TextEvent
        'readystatechange pageshow pagehide popstate '                   + // window
        'hashchange offline online '                                     + // window
        'afterprint beforeprint '                                        + // printing
        'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
        'loadstart progress suspend emptied stalled loadmetadata '       + // media
        'loadeddata canplay canplaythrough playing waiting seeking '     + // media
        'seeked ended durationchange timeupdate play pause ratechange '  + // media
        'volumechange cuechange '                                        + // media
        'checking noupdate downloading cached updateready obsolete '       // appcache

      // convert to a hash for quick lookups
    , nativeEvents = (function (hash, events, i) {
        for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
        return hash
      }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))

      // custom events are events that we *fake*, they are not provided natively but
      // we can use native events to generate them
    , customEvents = (function () {
        var isAncestor = 'compareDocumentPosition' in root
              ? function (element, container) {
                  return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                }
              : 'contains' in root
                ? function (element, container) {
                    container = container.nodeType === 9 || container === window ? root : container
                    return container !== element && container.contains(element)
                  }
                : function (element, container) {
                    while (element = element.parentNode) if (element === container) return 1
                    return 0
                  }
          , check = function (event) {
              var related = event.relatedTarget
              return !related
                ? related == null
                : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                    && !isAncestor(related, this))
            }

        return {
            mouseenter: { base: 'mouseover', condition: check }
          , mouseleave: { base: 'mouseout', condition: check }
          , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
        }
      }())

      // we provide a consistent Event object across browsers by taking the actual DOM
      // event object and generating a new one from its properties.
    , Event = (function () {
            // a whitelist of properties (for different event types) tells us what to check for and copy
        var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
              'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
              'srcElement target timeStamp type view which propertyName')
          , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
              'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
          , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
              'axis')) // 'axis' is FF specific
          , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
              'keyLocation location'))
          , textProps    = commonProps.concat(str2arr('data'))
          , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
          , messageProps = commonProps.concat(str2arr('data origin source'))
          , stateProps   = commonProps.concat(str2arr('state'))
          , overOutRegex = /over|out/
            // some event types need special handling and some need special properties, do that all here
          , typeFixers   = [
                { // key events
                    reg: /key/i
                  , fix: function (event, newEvent) {
                      newEvent.keyCode = event.keyCode || event.which
                      return keyProps
                    }
                }
              , { // mouse events
                    reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                  , fix: function (event, newEvent, type) {
                      newEvent.rightClick = event.which === 3 || event.button === 2
                      newEvent.pos = { x: 0, y: 0 }
                      if (event.pageX || event.pageY) {
                        newEvent.clientX = event.pageX
                        newEvent.clientY = event.pageY
                      } else if (event.clientX || event.clientY) {
                        newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                        newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                      }
                      if (overOutRegex.test(type)) {
                        newEvent.relatedTarget = event.relatedTarget
                          || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                      }
                      return mouseProps
                    }
                }
              , { // mouse wheel events
                    reg: /mouse.*(wheel|scroll)/i
                  , fix: function () { return mouseWheelProps }
                }
              , { // TextEvent
                    reg: /^text/i
                  , fix: function () { return textProps }
                }
              , { // touch and gesture events
                    reg: /^touch|^gesture/i
                  , fix: function () { return touchProps }
                }
              , { // message events
                    reg: /^message$/i
                  , fix: function () { return messageProps }
                }
              , { // popstate events
                    reg: /^popstate$/i
                  , fix: function () { return stateProps }
                }
              , { // everything else
                    reg: /.*/
                  , fix: function () { return commonProps }
                }
            ]
          , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism

          , Event = function (event, element, isNative) {
              if (!arguments.length) return
              event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
              this.originalEvent = event
              this.isNative       = isNative
              this.isBean         = true

              if (!event) return

              var type   = event.type
                , target = event.target || event.srcElement
                , i, l, p, props, fixer

              this.target = target && target.nodeType === 3 ? target.parentNode : target

              if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                fixer = typeFixerMap[type]
                if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                  for (i = 0, l = typeFixers.length; i < l; i++) {
                    if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                      typeFixerMap[type] = fixer = typeFixers[i].fix
                      break
                    }
                  }
                }

                props = fixer(event, this, type)
                for (i = props.length; i--;) {
                  if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                }
              }
            }

        // preventDefault() and stopPropagation() are a consistent interface to those functions
        // on the DOM, stop() is an alias for both of them together
        Event.prototype.preventDefault = function () {
          if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
          else this.originalEvent.returnValue = false
        }
        Event.prototype.stopPropagation = function () {
          if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
          else this.originalEvent.cancelBubble = true
        }
        Event.prototype.stop = function () {
          this.preventDefault()
          this.stopPropagation()
          this.stopped = true
        }
        // stopImmediatePropagation() has to be handled internally because we manage the event list for
        // each element
        // note that originalElement may be a Bean#Event object in some situations
        Event.prototype.stopImmediatePropagation = function () {
          if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
          this.isImmediatePropagationStopped = function () { return true }
        }
        Event.prototype.isImmediatePropagationStopped = function () {
          return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
        }
        Event.prototype.clone = function (currentTarget) {
          //TODO: this is ripe for optimisation, new events are *expensive*
          // improving this will speed up delegated events
          var ne = new Event(this, this.element, this.isNative)
          ne.currentTarget = currentTarget
          return ne
        }

        return Event
      }())

      // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
    , targetElement = function (element, isNative) {
        return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
      }

      /**
        * Bean maintains an internal registry for event listeners. We don't touch elements, objects
        * or functions to identify them, instead we store everything in the registry.
        * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
        */
    , RegEntry = (function () {
        // each handler is wrapped so we can handle delegation and custom events
        var wrappedHandler = function (element, fn, condition, args) {
            var call = function (event, eargs) {
                  return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                }
              , findTarget = function (event, eventElement) {
                  return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                }
              , handler = condition
                  ? function (event) {
                      var target = findTarget(event, this) // deleated event
                      if (condition.apply(target, arguments)) {
                        if (event) event.currentTarget = target
                        return call(event, arguments)
                      }
                    }
                  : function (event) {
                      if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                      return call(event, arguments)
                    }
            handler.__beanDel = fn.__beanDel
            return handler
          }

        , RegEntry = function (element, type, handler, original, namespaces, args, root) {
            var customType     = customEvents[type]
              , isNative

            if (type == 'unload') {
              // self clean-up
              handler = once(removeListener, element, type, handler, original)
            }

            if (customType) {
              if (customType.condition) {
                handler = wrappedHandler(element, handler, customType.condition, args)
              }
              type = customType.base || type
            }

            this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
            this.customType    = !W3C_MODEL && !isNative && type
            this.element       = element
            this.type          = type
            this.original      = original
            this.namespaces    = namespaces
            this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
            this.target        = targetElement(element, isNative)
            this[eventSupport] = !!this.target[eventSupport]
            this.root          = root
            this.handler       = wrappedHandler(element, handler, null, args)
          }

        // given a list of namespaces, is our entry in any of them?
        RegEntry.prototype.inNamespaces = function (checkNamespaces) {
          var i, j, c = 0
          if (!checkNamespaces) return true
          if (!this.namespaces) return false
          for (i = checkNamespaces.length; i--;) {
            for (j = this.namespaces.length; j--;) {
              if (checkNamespaces[i] == this.namespaces[j]) c++
            }
          }
          return checkNamespaces.length === c
        }

        // match by element, original fn (opt), handler fn (opt)
        RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
          return this.element === checkElement &&
            (!checkOriginal || this.original === checkOriginal) &&
            (!checkHandler || this.handler === checkHandler)
        }

        return RegEntry
      }())

    , registry = (function () {
        // our map stores arrays by event type, just because it's better than storing
        // everything in a single array.
        // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
        // rootListeners so we can look them up fast
        var map = {}

          // generic functional search of our registry for matching listeners,
          // `fn` returns false to break out of the loop
          , forAll = function (element, type, original, handler, root, fn) {
              var pfx = root ? 'r' : '$'
              if (!type || type == '*') {
                // search the whole registry
                for (var t in map) {
                  if (t.charAt(0) == pfx) {
                    forAll(element, t.substr(1), original, handler, root, fn)
                  }
                }
              } else {
                var i = 0, l, list = map[pfx + type], all = element == '*'
                if (!list) return
                for (l = list.length; i < l; i++) {
                  if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                }
              }
            }

          , has = function (element, type, original, root) {
              // we're not using forAll here simply because it's a bit slower and this
              // needs to be fast
              var i, list = map[(root ? 'r' : '$') + type]
              if (list) {
                for (i = list.length; i--;) {
                  if (!list[i].root && list[i].matches(element, original, null)) return true
                }
              }
              return false
            }

          , get = function (element, type, original, root) {
              var entries = []
              forAll(element, type, original, null, root, function (entry) {
                return entries.push(entry)
              })
              return entries
            }

          , put = function (entry) {
              var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                , key = (entry.root ? 'r' : '$') + entry.type
              ;(map[key] || (map[key] = [])).push(entry)
              return has
            }

          , del = function (entry) {
              forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                list.splice(i, 1)
                entry.removed = true
                if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                return false
              })
            }

            // dump all entries, used for onunload
          , entries = function () {
              var t, entries = []
              for (t in map) {
                if (t.charAt(0) == '$') entries = entries.concat(map[t])
              }
              return entries
            }

        return { has: has, get: get, put: put, del: del, entries: entries }
      }())

      // we need a selector engine for delegated events, use querySelectorAll if it exists
      // but for older browsers we need Qwery, Sizzle or similar
    , selectorEngine
    , setSelectorEngine = function (e) {
        if (!arguments.length) {
          selectorEngine = doc.querySelectorAll
            ? function (s, r) {
                return r.querySelectorAll(s)
              }
            : function () {
                throw new Error('Bean: No selector engine installed') // eeek
              }
        } else {
          selectorEngine = e
        }
      }

      // we attach this listener to each DOM event that we need to listen to, only once
      // per event type per DOM element
    , rootListener = function (event, type) {
        if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return

        var listeners = registry.get(this, type || event.type, null, false)
          , l = listeners.length
          , i = 0

        event = new Event(event, this, true)
        if (type) event.type = type

        // iterate through all handlers registered for this type, calling them unless they have
        // been removed by a previous handler or stopImmediatePropagation() has been called
        for (; i < l && !event.isImmediatePropagationStopped(); i++) {
          if (!listeners[i].removed) listeners[i].handler.call(this, event)
        }
      }

      // add and remove listeners to DOM elements
    , listener = W3C_MODEL
        ? function (element, type, add) {
            // new browsers
            element[add ? addEvent : removeEvent](type, rootListener, false)
          }
        : function (element, type, add, custom) {
            // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
            // to simulate event bubbling etc.
            var entry
            if (add) {
              registry.put(entry = new RegEntry(
                  element
                , custom || type
                , function (event) { // handler
                    rootListener.call(element, event, custom)
                  }
                , rootListener
                , null
                , null
                , true // is root
              ))
              if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
              entry.target.attachEvent('on' + entry.eventType, entry.handler)
            } else {
              entry = registry.get(element, custom || type, rootListener, true)[0]
              if (entry) {
                entry.target.detachEvent('on' + entry.eventType, entry.handler)
                registry.del(entry)
              }
            }
          }

    , once = function (rm, element, type, fn, originalFn) {
        // wrap the handler in a handler that does a remove as well
        return function () {
          fn.apply(this, arguments)
          rm(element, type, originalFn)
        }
      }

    , removeListener = function (element, orgType, handler, namespaces) {
        var type     = orgType && orgType.replace(nameRegex, '')
          , handlers = registry.get(element, type, null, false)
          , removed  = {}
          , i, l

        for (i = 0, l = handlers.length; i < l; i++) {
          if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
            // TODO: this is problematic, we have a registry.get() and registry.del() that
            // both do registry searches so we waste cycles doing this. Needs to be rolled into
            // a single registry.forAll(fn) that removes while finding, but the catch is that
            // we'll be splicing the arrays that we're iterating over. Needs extra tests to
            // make sure we don't screw it up. @rvagg
            registry.del(handlers[i])
            if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
              removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
          }
        }
        // check each type/element for removed listeners and remove the rootListener where it's no longer needed
        for (i in removed) {
          if (!registry.has(element, removed[i].t, null, false)) {
            // last listener of this type, remove the rootListener
            listener(element, removed[i].t, false, removed[i].c)
          }
        }
      }

      // set up a delegate helper using the given selector, wrap the handler function
    , delegate = function (selector, fn) {
        //TODO: findTarget (therefore $) is called twice, once for match and once for
        // setting e.currentTarget, fix this so it's only needed once
        var findTarget = function (target, root) {
              var i, array = isString(selector) ? selectorEngine(selector, root) : selector
              for (; target && target !== root; target = target.parentNode) {
                for (i = array.length; i--;) {
                  if (array[i] === target) return target
                }
              }
            }
          , handler = function (e) {
              var match = findTarget(e.target, this)
              if (match) fn.apply(match, arguments)
            }

        // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
        handler.__beanDel = {
            ft       : findTarget // attach it here for customEvents to use too
          , selector : selector
        }
        return handler
      }

    , fireListener = W3C_MODEL ? function (isNative, type, element) {
        // modern browsers, do a proper dispatchEvent()
        var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
        evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
        element.dispatchEvent(evt)
      } : function (isNative, type, element) {
        // old browser use onpropertychange, just increment a custom property to trigger the event
        element = targetElement(element, isNative)
        isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
      }

      /**
        * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
        */

      /**
        * off(element[, eventType(s)[, handler ]])
        */
    , off = function (element, typeSpec, fn) {
        var isTypeStr = isString(typeSpec)
          , k, type, namespaces, i

        if (isTypeStr && typeSpec.indexOf(' ') > 0) {
          // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
          typeSpec = str2arr(typeSpec)
          for (i = typeSpec.length; i--;)
            off(element, typeSpec[i], fn)
          return element
        }

        type = isTypeStr && typeSpec.replace(nameRegex, '')
        if (type && customEvents[type]) type = customEvents[type].base

        if (!typeSpec || isTypeStr) {
          // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
          if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
          removeListener(element, type, fn, namespaces)
        } else if (isFunction(typeSpec)) {
          // off(el, fn)
          removeListener(element, null, typeSpec)
        } else {
          // off(el, { t1: fn1, t2, fn2 })
          for (k in typeSpec) {
            if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
          }
        }

        return element
      }

      /**
        * on(element, eventType(s)[, selector], handler[, args ])
        */
    , on = function(element, events, selector, fn) {
        var originalFn, type, types, i, args, entry, first

        //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
        if (selector === undefined && typeof events == 'object') {
          //TODO: this can't handle delegated events
          for (type in events) {
            if (events.hasOwnProperty(type)) {
              on.call(this, element, type, events[type])
            }
          }
          return
        }

        if (!isFunction(selector)) {
          // delegated event
          originalFn = fn
          args       = slice.call(arguments, 4)
          fn         = delegate(selector, originalFn, selectorEngine)
        } else {
          args       = slice.call(arguments, 3)
          fn         = originalFn = selector
        }

        types = str2arr(events)

        // special case for one(), wrap in a self-removing handler
        if (this === ONE) {
          fn = once(off, element, events, fn, originalFn)
        }

        for (i = types.length; i--;) {
          // add new handler to the registry and check if it's the first for this element/type
          first = registry.put(entry = new RegEntry(
              element
            , types[i].replace(nameRegex, '') // event type
            , fn
            , originalFn
            , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
            , args
            , false // not root
          ))
          if (entry[eventSupport] && first) {
            // first event of this type on this element, add root listener
            listener(element, entry.eventType, true, entry.customType)
          }
        }

        return element
      }

      /**
        * add(element[, selector], eventType(s), handler[, args ])
        *
        * Deprecated: kept (for now) for backward-compatibility
        */
    , add = function (element, events, fn, delfn) {
        return on.apply(
            null
          , !isString(fn)
              ? slice.call(arguments)
              : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
        )
      }

      /**
        * one(element, eventType(s)[, selector], handler[, args ])
        */
    , one = function () {
        return on.apply(ONE, arguments)
      }

      /**
        * fire(element, eventType(s)[, args ])
        *
        * The optional 'args' argument must be an array, if no 'args' argument is provided
        * then we can use the browser's DOM event system, otherwise we trigger handlers manually
        */
    , fire = function (element, type, args) {
        var types = str2arr(type)
          , i, j, l, names, handlers

        for (i = types.length; i--;) {
          type = types[i].replace(nameRegex, '')
          if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
          if (!names && !args && element[eventSupport]) {
            fireListener(nativeEvents[type], type, element)
          } else {
            // non-native event, either because of a namespace, arguments or a non DOM element
            // iterate over all listeners and manually 'fire'
            handlers = registry.get(element, type, null, false)
            args = [false].concat(args)
            for (j = 0, l = handlers.length; j < l; j++) {
              if (handlers[j].inNamespaces(names)) {
                handlers[j].handler.apply(element, args)
              }
            }
          }
        }
        return element
      }

      /**
        * clone(dstElement, srcElement[, eventType ])
        *
        * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
        */
    , clone = function (element, from, type) {
        var handlers = registry.get(from, type, null, false)
          , l = handlers.length
          , i = 0
          , args, beanDel

        for (; i < l; i++) {
          if (handlers[i].original) {
            args = [ element, handlers[i].type ]
            if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
            args.push(handlers[i].original)
            on.apply(null, args)
          }
        }
        return element
      }

    , bean = {
          on                : on
        , add               : add
        , one               : one
        , off               : off
        , remove            : off
        , clone             : clone
        , fire              : fire
        , Event             : Event
        , setSelectorEngine : setSelectorEngine
        , noConflict        : function () {
            context[name] = old
            return this
          }
      }

  // for IE, clean up on unload to avoid leaks
  if (win.attachEvent) {
    var cleanup = function () {
      var i, entries = registry.entries()
      for (i in entries) {
        if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
      }
      win.detachEvent('onunload', cleanup)
      win.CollectGarbage && win.CollectGarbage()
    }
    win.attachEvent('onunload', cleanup)
  }

  // initialize selector engine to internal default (qSA or throw Error)
  setSelectorEngine()

  return bean
});
},{}],14:[function(require,module,exports){
/*!
  * Bonzo: DOM Utility (c) Dustin Diaz 2012
  * https://github.com/ded/bonzo
  * License MIT
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bonzo', this, function() {
  var win = window
    , doc = win.document
    , html = doc.documentElement
    , parentNode = 'parentNode'
    , specialAttributes = /^(checked|value|selected|disabled)$/i
      // tags that we have trouble inserting *into*
    , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
    , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
    , table = ['<table>', '</table>', 1]
    , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
    , option = ['<select>', '</select>', 1]
    , noscope = ['_', '', 0, 1]
    , tagMap = { // tags that we have trouble *inserting*
          thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
        , tr: ['<table><tbody>', '</tbody></table>', 2]
        , th: td , td: td
        , col: ['<table><colgroup>', '</colgroup></table>', 2]
        , fieldset: ['<form>', '</form>', 1]
        , legend: ['<form><fieldset>', '</fieldset></form>', 2]
        , option: option, optgroup: option
        , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
      }
    , stateAttributes = /^(checked|selected|disabled)$/
    , ie = /msie/i.test(navigator.userAgent)
    , hasClass, addClass, removeClass
    , uidMap = {}
    , uuids = 0
    , digit = /^-?[\d\.]+$/
    , dattr = /^data-(.+)$/
    , px = 'px'
    , setAttribute = 'setAttribute'
    , getAttribute = 'getAttribute'
    , byTag = 'getElementsByTagName'
    , features = function() {
        var e = doc.createElement('p')
        e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
        return {
          hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
        , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
        , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
        , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
        , transform: function () {
            var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
            for (i = 0; i < props.length; i++) {
              if (props[i] in e.style) return props[i]
            }
          }()
        , classList: 'classList' in e
        , opasity: function () {
            return typeof doc.createElement('a').style.opacity !== 'undefined'
          }()
        }
      }()
    , trimReplace = /(^\s*|\s*$)/g
    , whitespaceRegex = /\s+/
    , toString = String.prototype.toString
    , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
    , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
    , trim = String.prototype.trim ?
        function (s) {
          return s.trim()
        } :
        function (s) {
          return s.replace(trimReplace, '')
        }

    , getStyle = features.computedStyle
        ? function (el, property) {
            var value = null
              , computed = doc.defaultView.getComputedStyle(el, '')
            computed && (value = computed[property])
            return el.style[property] || value
          }
        : !(ie && html.currentStyle)
          ? function (el, property) {
              return el.style[property]
            }
          :
          /**
           * @param {Element} el
           * @param {string} property
           * @return {string|number}
           */
          function (el, property) {
            var val, value
            if (property == 'opacity' && !features.opasity) {
              val = 100
              try {
                val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
              } catch (e1) {
                try {
                  val = el['filters']('alpha').opacity
                } catch (e2) {}
              }
              return val / 100
            }
            value = el.currentStyle ? el.currentStyle[property] : null
            return el.style[property] || value
          }

  function isNode(node) {
    return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
  }


  function normalize(node, host, clone) {
    var i, l, ret
    if (typeof node == 'string') return bonzo.create(node)
    if (isNode(node)) node = [ node ]
    if (clone) {
      ret = [] // don't change original array
      for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
      return ret
    }
    return node
  }

  /**
   * @param {string} c a class name to test
   * @return {boolean}
   */
  function classReg(c) {
    return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @param {boolean=} opt_rev
   * @return {Bonzo|Array}
   */
  function each(ar, fn, opt_scope, opt_rev) {
    var ind, i = 0, l = ar.length
    for (; i < l; i++) {
      ind = opt_rev ? ar.length - i - 1 : i
      fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
    }
    return ar
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {Bonzo|Array}
   */
  function deepEach(ar, fn, opt_scope) {
    for (var i = 0, l = ar.length; i < l; i++) {
      if (isNode(ar[i])) {
        deepEach(ar[i].childNodes, fn, opt_scope)
        fn.call(opt_scope || ar[i], ar[i], i, ar)
      }
    }
    return ar
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function decamelize(s) {
    return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
  }


  /**
   * @param {Element} el
   * @return {*}
   */
  function data(el) {
    el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
    var uid = el[getAttribute]('data-node-uid')
    return uidMap[uid] || (uidMap[uid] = {})
  }


  /**
   * removes the data associated with an element
   * @param {Element} el
   */
  function clearData(el) {
    var uid = el[getAttribute]('data-node-uid')
    if (uid) delete uidMap[uid]
  }


  function dataValue(d) {
    var f
    try {
      return (d === null || d === undefined) ? undefined :
        d === 'true' ? true :
          d === 'false' ? false :
            d === 'null' ? null :
              (f = parseFloat(d)) == d ? f : d;
    } catch(e) {}
    return undefined
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {boolean} whether `some`thing was found
   */
  function some(ar, fn, opt_scope) {
    for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
    return false
  }


  /**
   * this could be a giant enum of CSS properties
   * but in favor of file size sans-closure deadcode optimizations
   * we're just asking for any ol string
   * then it gets transformed into the appropriate style property for JS access
   * @param {string} p
   * @return {string}
   */
  function styleProperty(p) {
      (p == 'transform' && (p = features.transform)) ||
        (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
        (p == 'float' && (p = features.cssFloat))
      return p ? camelize(p) : null
  }

  // this insert method is intense
  function insert(target, host, fn, rev) {
    var i = 0, self = host || this, r = []
      // target nodes could be a css selector if it's a string and a selector engine is present
      // otherwise, just use target
      , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
    // normalize each node in case it's still a string and we need to create nodes on the fly
    each(normalize(nodes), function (t, j) {
      each(self, function (el) {
        fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
      }, null, rev)
    }, this, rev)
    self.length = i
    each(r, function (e) {
      self[--i] = e
    }, null, !rev)
    return self
  }


  /**
   * sets an element to an explicit x/y position on the page
   * @param {Element} el
   * @param {?number} x
   * @param {?number} y
   */
  function xy(el, x, y) {
    var $el = bonzo(el)
      , style = $el.css('position')
      , offset = $el.offset()
      , rel = 'relative'
      , isRel = style == rel
      , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]

    if (style == 'static') {
      $el.css('position', rel)
      style = rel
    }

    isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
    isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)

    x != null && (el.style.left = x - offset.left + delta[0] + px)
    y != null && (el.style.top = y - offset.top + delta[1] + px)

  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  if (features.classList) {
    hasClass = function (el, c) {
      return el.classList.contains(c)
    }
    addClass = function (el, c) {
      el.classList.add(c)
    }
    removeClass = function (el, c) {
      el.classList.remove(c)
    }
  }
  else {
    hasClass = function (el, c) {
      return classReg(c).test(el.className)
    }
    addClass = function (el, c) {
      el.className = trim(el.className + ' ' + c)
    }
    removeClass = function (el, c) {
      el.className = trim(el.className.replace(classReg(c), ' '))
    }
  }


  /**
   * this allows method calling for setting values
   *
   * @example
   * bonzo(elements).css('color', function (el) {
   *   return el.getAttribute('data-original-color')
   * })
   *
   * @param {Element} el
   * @param {function (Element)|string}
   * @return {string}
   */
  function setter(el, v) {
    return typeof v == 'function' ? v(el) : v
  }

  function scroll(x, y, type) {
    var el = this[0]
    if (!el) return this
    if (x == null && y == null) {
      return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
    }
    if (isBody(el)) {
      win.scrollTo(x, y)
    } else {
      x != null && (el.scrollLeft = x)
      y != null && (el.scrollTop = y)
    }
    return this
  }

  /**
   * @constructor
   * @param {Array.<Element>|Element|Node|string} elements
   */
  function Bonzo(elements) {
    this.length = 0
    if (elements) {
      elements = typeof elements !== 'string' &&
        !elements.nodeType &&
        typeof elements.length !== 'undefined' ?
          elements :
          [elements]
      this.length = elements.length
      for (var i = 0; i < elements.length; i++) this[i] = elements[i]
    }
  }

  Bonzo.prototype = {

      /**
       * @param {number} index
       * @return {Element|Node}
       */
      get: function (index) {
        return this[index] || null
      }

      // itetators
      /**
       * @param {function(Element|Node)} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , each: function (fn, opt_scope) {
        return each(this, fn, opt_scope)
      }

      /**
       * @param {Function} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , deepEach: function (fn, opt_scope) {
        return deepEach(this, fn, opt_scope)
      }


      /**
       * @param {Function} fn
       * @param {Function=} opt_reject
       * @return {Array}
       */
    , map: function (fn, opt_reject) {
        var m = [], n, i
        for (i = 0; i < this.length; i++) {
          n = fn.call(this, this[i], i)
          opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
        }
        return m
      }

    // text and html inserters!

    /**
     * @param {string} h the HTML to insert
     * @param {boolean=} opt_text whether to set or get text content
     * @return {Bonzo|string}
     */
    , html: function (h, opt_text) {
        var method = opt_text
              ? html.textContent === undefined ? 'innerText' : 'textContent'
              : 'innerHTML'
          , that = this
          , append = function (el, i) {
              each(normalize(h, that, i), function (node) {
                el.appendChild(node)
              })
            }
          , updateElement = function (el, i) {
              try {
                if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                  return el[method] = h
                }
              } catch (e) {}
              append(el, i)
            }
        return typeof h != 'undefined'
          ? this.empty().each(updateElement)
          : this[0] ? this[0][method] : ''
      }

      /**
       * @param {string=} opt_text the text to set, otherwise this is a getter
       * @return {Bonzo|string}
       */
    , text: function (opt_text) {
        return this.html(opt_text, true)
      }

      // more related insertion methods

      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , append: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el.appendChild(i)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , prepend: function (node) {
        var that = this
        return this.each(function (el, i) {
          var first = el.firstChild
          each(normalize(node, that, i), function (i) {
            el.insertBefore(i, first)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , appendTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.appendChild(el)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , prependTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.insertBefore(el, t.firstChild)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , before: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , after: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el.nextSibling)
          }, null, 1)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertBefore: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t[parentNode].insertBefore(el, t)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertAfter: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          var sibling = t.nextSibling
          sibling ?
            t[parentNode].insertBefore(el, sibling) :
            t[parentNode].appendChild(el)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , replaceWith: function (node) {
        bonzo(normalize(node)).insertAfter(this)
        return this.remove()
      }

      /**
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , clone: function (opt_host) {
        var ret = [] // don't change original array
          , l, i
        for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
        return bonzo(ret)
      }

      // class management

      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , addClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          // we `each` here so you can do $el.addClass('foo bar')
          each(c, function (c) {
            if (c && !hasClass(el, setter(el, c)))
              addClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , removeClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c && hasClass(el, setter(el, c)))
              removeClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {boolean}
       */
    , hasClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return some(this, function (el) {
          return some(c, function (c) {
            return c && hasClass(el, c)
          })
        })
      }


      /**
       * @param {string} c classname to toggle
       * @param {boolean=} opt_condition whether to add or remove the class straight away
       * @return {Bonzo}
       */
    , toggleClass: function (c, opt_condition) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c) {
              typeof opt_condition !== 'undefined' ?
                opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
            }
          })
        })
      }

      // display togglers

      /**
       * @param {string=} opt_type useful to set back to anything other than an empty string
       * @return {Bonzo}
       */
    , show: function (opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : ''
        return this.each(function (el) {
          el.style.display = opt_type
        })
      }


      /**
       * @return {Bonzo}
       */
    , hide: function () {
        return this.each(function (el) {
          el.style.display = 'none'
        })
      }


      /**
       * @param {Function=} opt_callback
       * @param {string=} opt_type
       * @return {Bonzo}
       */
    , toggle: function (opt_callback, opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : '';
        typeof opt_callback != 'function' && (opt_callback = null)
        return this.each(function (el) {
          el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
          opt_callback && opt_callback.call(el)
        })
      }


      // DOM Walkers & getters

      /**
       * @return {Element|Node}
       */
    , first: function () {
        return bonzo(this.length ? this[0] : [])
      }


      /**
       * @return {Element|Node}
       */
    , last: function () {
        return bonzo(this.length ? this[this.length - 1] : [])
      }


      /**
       * @return {Element|Node}
       */
    , next: function () {
        return this.related('nextSibling')
      }


      /**
       * @return {Element|Node}
       */
    , previous: function () {
        return this.related('previousSibling')
      }


      /**
       * @return {Element|Node}
       */
    , parent: function() {
        return this.related(parentNode)
      }


      /**
       * @private
       * @param {string} method the directional DOM method
       * @return {Element|Node}
       */
    , related: function (method) {
        return bonzo(this.map(
          function (el) {
            el = el[method]
            while (el && el.nodeType !== 1) {
              el = el[method]
            }
            return el || 0
          },
          function (el) {
            return el
          }
        ))
      }


      /**
       * @return {Bonzo}
       */
    , focus: function () {
        this.length && this[0].focus()
        return this
      }


      /**
       * @return {Bonzo}
       */
    , blur: function () {
        this.length && this[0].blur()
        return this
      }

      // style getter setter & related methods

      /**
       * @param {Object|string} o
       * @param {string=} opt_v
       * @return {Bonzo|string}
       */
    , css: function (o, opt_v) {
        var p, iter = o
        // is this a request for just getting a style?
        if (opt_v === undefined && typeof o == 'string') {
          // repurpose 'v'
          opt_v = this[0]
          if (!opt_v) return null
          if (opt_v === doc || opt_v === win) {
            p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
            return o == 'width' ? p.width : o == 'height' ? p.height : ''
          }
          return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
        }

        if (typeof o == 'string') {
          iter = {}
          iter[o] = opt_v
        }

        if (!features.opasity && 'opacity' in iter) {
          // oh this 'ol gamut
          iter.filter = iter.opacity != null && iter.opacity !== ''
            ? 'alpha(opacity=' + (iter.opacity * 100) + ')'
            : ''
          // give it layout
          iter.zoom = o.zoom || 1
          ;delete iter.opacity
        }

        function fn(el, p, v) {
          for (var k in iter) {
            if (iter.hasOwnProperty(k)) {
              v = iter[k];
              // change "5" to "5px" - unless you're line-height, which is allowed
              (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
              try { el.style[p] = setter(el, v) } catch(e) {}
            }
          }
        }
        return this.each(fn)
      }


      /**
       * @param {number=} opt_x
       * @param {number=} opt_y
       * @return {Bonzo|number}
       */
    , offset: function (opt_x, opt_y) {
        if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
          return this.each(function (el) {
            xy(el, opt_x.left, opt_x.top)
          })
        } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
          return this.each(function (el) {
            xy(el, opt_x, opt_y)
          })
        }
        if (!this[0]) return {
            top: 0
          , left: 0
          , height: 0
          , width: 0
        }
        var el = this[0]
          , de = el.ownerDocument.documentElement
          , bcr = el.getBoundingClientRect()
          , scroll = getWindowScroll()
          , width = el.offsetWidth
          , height = el.offsetHeight
          , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
          , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)

        return {
            top: top
          , left: left
          , height: height
          , width: width
        }
      }


      /**
       * @return {number}
       */
    , dim: function () {
        if (!this.length) return { height: 0, width: 0 }
        var el = this[0]
          , de = el.nodeType == 9 && el.documentElement // document
          , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
             // el isn't visible, can't be measured properly, so fix that
             function (t) {
               var s = {
                   position: el.style.position || ''
                 , visibility: el.style.visibility || ''
                 , display: el.style.display || ''
               }
               t.first().css({
                   position: 'absolute'
                 , visibility: 'hidden'
                 , display: 'block'
               })
               return s
            }(this) : null
          , width = de
              ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
              : el.offsetWidth
          , height = de
              ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
              : el.offsetHeight

        orig && this.first().css(orig)
        return {
            height: height
          , width: width
        }
      }

      // attributes are hard. go shopping

      /**
       * @param {string} k an attribute to get or set
       * @param {string=} opt_v the value to set
       * @return {Bonzo|string}
       */
    , attr: function (k, opt_v) {
        var el = this[0]
          , n

        if (typeof k != 'string' && !(k instanceof String)) {
          for (n in k) {
            k.hasOwnProperty(n) && this.attr(n, k[n])
          }
          return this
        }

        return typeof opt_v == 'undefined' ?
          !el ? null : specialAttributes.test(k) ?
            stateAttributes.test(k) && typeof el[k] == 'string' ?
              true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                el[getAttribute](k, 2) : el[getAttribute](k) :
          this.each(function (el) {
            specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
          })
      }


      /**
       * @param {string} k
       * @return {Bonzo}
       */
    , removeAttr: function (k) {
        return this.each(function (el) {
          stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
        })
      }


      /**
       * @param {string=} opt_s
       * @return {Bonzo|string}
       */
    , val: function (s) {
        return (typeof s == 'string' || typeof s == 'number') ?
          this.attr('value', s) :
          this.length ? this[0].value : null
      }

      // use with care and knowledge. this data() method uses data attributes on the DOM nodes
      // to do this differently costs a lot more code. c'est la vie
      /**
       * @param {string|Object=} opt_k the key for which to get or set data
       * @param {Object=} opt_v
       * @return {Bonzo|Object}
       */
    , data: function (opt_k, opt_v) {
        var el = this[0], o, m
        if (typeof opt_v === 'undefined') {
          if (!el) return null
          o = data(el)
          if (typeof opt_k === 'undefined') {
            each(el.attributes, function (a) {
              (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
            })
            return o
          } else {
            if (typeof o[opt_k] === 'undefined')
              o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
            return o[opt_k]
          }
        } else {
          return this.each(function (el) { data(el)[opt_k] = opt_v })
        }
      }

      // DOM detachment & related

      /**
       * @return {Bonzo}
       */
    , remove: function () {
        this.deepEach(clearData)
        return this.detach()
      }


      /**
       * @return {Bonzo}
       */
    , empty: function () {
        return this.each(function (el) {
          deepEach(el.childNodes, clearData)

          while (el.firstChild) {
            el.removeChild(el.firstChild)
          }
        })
      }


      /**
       * @return {Bonzo}
       */
    , detach: function () {
        return this.each(function (el) {
          el[parentNode] && el[parentNode].removeChild(el)
        })
      }

      // who uses a mouse anyway? oh right.

      /**
       * @param {number} y
       */
    , scrollTop: function (y) {
        return scroll.call(this, null, y, 'y')
      }


      /**
       * @param {number} x
       */
    , scrollLeft: function (x) {
        return scroll.call(this, x, null, 'x')
      }

  }


  function cloneNode(host, el) {
    var c = el.cloneNode(true)
      , cloneElems
      , elElems
      , i

    // check for existence of an event cloner
    // preferably https://github.com/fat/bean
    // otherwise Bonzo won't do this for you
    if (host.$ && typeof host.cloneEvents == 'function') {
      host.$(c).cloneEvents(el)

      // clone events from every child node
      cloneElems = host.$(c).find('*')
      elElems = host.$(el).find('*')

      for (i = 0; i < elElems.length; i++)
        host.$(cloneElems[i]).cloneEvents(elElems[i])
    }
    return c
  }

  function isBody(element) {
    return element === win || (/^(?:body|html)$/i).test(element.tagName)
  }

  function getWindowScroll() {
    return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
  }

  function createScriptFromHtml(html) {
    var scriptEl = document.createElement('script')
      , matches = html.match(simpleScriptTagRe)
    scriptEl.src = matches[1]
    return scriptEl
  }

  /**
   * @param {Array.<Element>|Element|Node|string} els
   * @return {Bonzo}
   */
  function bonzo(els) {
    return new Bonzo(els)
  }

  bonzo.setQueryEngine = function (q) {
    query = q;
    delete bonzo.setQueryEngine
  }

  bonzo.aug = function (o, target) {
    // for those standalone bonzo users. this love is for you.
    for (var k in o) {
      o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
    }
  }

  bonzo.create = function (node) {
    // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    return typeof node == 'string' && node !== '' ?
      function () {
        if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
        var tag = node.match(/^\s*<([^\s>]+)/)
          , el = doc.createElement('div')
          , els = []
          , p = tag ? tagMap[tag[1].toLowerCase()] : null
          , dep = p ? p[2] + 1 : 1
          , ns = p && p[3]
          , pn = parentNode
          , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)

        el.innerHTML = p ? (p[0] + node + p[1]) : node
        while (dep--) el = el.firstChild
        // for IE NoScope, we may insert cruft at the begining just to get it to work
        if (ns && el && el.nodeType !== 1) el = el.nextSibling
        do {
          // tbody special case for IE<8, creates tbody on any empty table
          // we don't want it if we're just after a <thead>, <caption>, etc.
          if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
            els.push(el)
          }
        } while (el = el.nextSibling)
        // IE < 9 gives us a parentNode which messes up insert() check for cloning
        // `dep` > 1 can also cause problems with the insert() check (must do this last)
        each(els, function(el) { el[pn] && el[pn].removeChild(el) })
        return els
      }() : isNode(node) ? [node.cloneNode(true)] : []
  }

  bonzo.doc = function () {
    var vp = bonzo.viewport()
    return {
        width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
      , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
    }
  }

  bonzo.firstChild = function (el) {
    for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
      if (c[i].nodeType === 1) e = c[j = i]
    }
    return e
  }

  bonzo.viewport = function () {
    return {
        width: ie ? html.clientWidth : self.innerWidth
      , height: ie ? html.clientHeight : self.innerHeight
    }
  }

  bonzo.isAncestor = 'compareDocumentPosition' in html ?
    function (container, element) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (container, element) {
      return container !== element && container.contains(element);
    } :
    function (container, element) {
      while (element = element[parentNode]) {
        if (element === container) {
          return true
        }
      }
      return false
    }

  return bonzo
}); // the only line we care about using a semi-colon. placed here for concatenation tools

},{}],15:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],16:[function(require,module,exports){
var inserted = [];

module.exports = function (css) {
    if (inserted.indexOf(css) >= 0) return;
    inserted.push(css);
    
    var elem = document.createElement('style');
    var text = document.createTextNode(css);
    elem.appendChild(text);
    
    if (document.head.childNodes.length) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
    }
    else {
        document.head.appendChild(elem);
    }
};

},{}],17:[function(require,module,exports){
/*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  * MIT License
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

  var walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      }
    , '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode
      }
    , '~': function (node) {
        return node && node.previousSibling
      }
    , '+': function (node, contestant, p1, p2) {
        if (!node) return false
        return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
      }
    }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  // not quite as fast as inline loops in older browsers so don't use liberally
  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  // called using `this` as element and arguments from regex group results.
  // given => div.hello[title="world"]:foo('bar')
  // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      // select is for attrib equality
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  // given a selector, first check for simple cases then collect all base candidate matches and filter
  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    // collect base candidates to filter
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    // filter elements according to the right-most part of the selector
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    // filter further according to the rest of the selector (the left side)
    each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  // compare element to a selector
  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  // given elements matching the right-most part of a selector, filter out any that don't match the rest
  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    // recursively work backwards through the tokens and up the dom, covering all options
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j;
    o:
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    // easy, fast cases that we can dispatch with simple DOM calls
    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  // where the root is not document and a relationship selector is first we have to
  // do some awkward adjustments to get it to work, even with qSA
  function collectSelector(root, collector) {
    return function (s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
          // make sure the el has an id, rewrite the query, set root to doc and run it
          if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
          s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
          collector(root.parentNode || root, s, true)
          oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
    }()
  , hasByClass = !!doc[byClass]
    // has native qSA support
  , hasQSA = doc.querySelector && doc[qSA]
    // use native qSA
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          // most work is done right here, defer to qSA
          return arrayify(root[qSA](selector))
        }
        // special case where we need the services of `collectSelector()`
        each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
    }
    // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      // configNativeQSA: use fully-internal selector or native qSA where present
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
});

},{}],18:[function(require,module,exports){
module.exports = hasKeys

function hasKeys(source) {
    return source !== null &&
        (typeof source === "object" ||
        typeof source === "function")
}

},{}],19:[function(require,module,exports){
var Keys = require("object-keys")
var hasKeys = require("./has-keys")

module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        if (!hasKeys(source)) {
            continue
        }

        var keys = Keys(source)

        for (var j = 0; j < keys.length; j++) {
            var name = keys[j]
            target[name] = source[name]
        }
    }

    return target
}

},{"./has-keys":18,"object-keys":21}],20:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var isFunction = function (fn) {
	var isFunc = (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
	if (!isFunc && typeof window !== 'undefined') {
		isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
	}
	return isFunc;
};

module.exports = function forEach(obj, fn) {
	if (!isFunction(fn)) {
		throw new TypeError('iterator must be a function');
	}
	var i, k,
		isString = typeof obj === 'string',
		l = obj.length,
		context = arguments.length > 2 ? arguments[2] : null;
	if (l === +l) {
		for (i = 0; i < l; i++) {
			if (context === null) {
				fn(isString ? obj.charAt(i) : obj[i], i, obj);
			} else {
				fn.call(context, isString ? obj.charAt(i) : obj[i], i, obj);
			}
		}
	} else {
		for (k in obj) {
			if (hasOwn.call(obj, k)) {
				if (context === null) {
					fn(obj[k], k, obj);
				} else {
					fn.call(context, obj[k], k, obj);
				}
			}
		}
	}
};


},{}],21:[function(require,module,exports){
module.exports = Object.keys || require('./shim');


},{"./shim":23}],22:[function(require,module,exports){
var toString = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toString.call(value);
	var isArguments = str === '[object Arguments]';
	if (!isArguments) {
		isArguments = str !== '[object Array]'
			&& value !== null
			&& typeof value === 'object'
			&& typeof value.length === 'number'
			&& value.length >= 0
			&& toString.call(value.callee) === '[object Function]';
	}
	return isArguments;
};


},{}],23:[function(require,module,exports){
(function () {
	"use strict";

	// modified from https://github.com/kriskowal/es5-shim
	var has = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		forEach = require('./foreach'),
		isArgs = require('./isArguments'),
		hasDontEnumBug = !({'toString': null}).propertyIsEnumerable('toString'),
		hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
		dontEnums = [
			"toString",
			"toLocaleString",
			"valueOf",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"constructor"
		],
		keysShim;

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object',
			isFunction = toString.call(object) === '[object Function]',
			isArguments = isArgs(object),
			theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError("Object.keys called on a non-object");
		}

		if (isArguments) {
			forEach(object, function (value) {
				theKeys.push(value);
			});
		} else {
			var name,
				skipProto = hasProtoEnumBug && isFunction;

			for (name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(name);
				}
			}
		}

		if (hasDontEnumBug) {
			var ctor = object.constructor,
				skipConstructor = ctor && ctor.prototype === object;

			forEach(dontEnums, function (dontEnum) {
				if (!(skipConstructor && dontEnum === 'constructor') && has.call(object, dontEnum)) {
					theKeys.push(dontEnum);
				}
			});
		}
		return theKeys;
	};

	module.exports = keysShim;
}());


},{"./foreach":20,"./isArguments":22}],24:[function(require,module,exports){
module.exports=(function() {var t = function anonymous(locals, filters, escape) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
var buf = [];
with (locals || {}) { (function(){ 
 buf.push('<div id="auth0-widget" class="cleanslate">\n	<div class="signin">\n	    <div class="popup">\n	      	<div class="overlay">\n	        	<div id="onestep" class="panel onestep">\n	          		<header class="header">\n	            		<div class="image" style="display: none">\n	            			<img src="">\n	            		</div>\n	            		<h1>Sign In</h1>\n			            <h2 class="error" style="display: none">&nbsp;</h2>\n			            <h2 class="success" style="display: none">&nbsp;</h2>\n			            <a class="close">Close</a>\n	          		</header>\n\n	          		<div class="loggedin">\n			            <form>\n							<span class="centered last-time"></span>\n							<div class="strategy"></div>\n							<div class="emailPassword" style="display:none">\n								<div class="email">\n									<span class="email-readonly"></span>\n									<input name="email" type="email" value="" disabled placeholder="Email" title="Email" style="display:none">\n								</div>\n								<div class="password">\n									<input name="password" type="password" value="" autofocus placeholder="Password" title="Password">\n								</div>\n								<div class="action">\n									<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n								  	<button type="submit" class="spinner" style="display: none"></button>\n								  	<label class="create-account"><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n								</div>\n							</div>\n							<span class="centered all">Show all</span>\n			            </form>\n	          		</div>\n\n		          	<div class="notloggedin">\n			            <form>\n			            	<div class="iconlist" style="display: none"><p style="display:none">... or sign in using</p></div>\n			              	<div class="separator" style="display: none"><span>or</span></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signin_easy_email" type="email" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password" style="display:none">\n			                  		<input name="password" id="signin_easy_password" type="password" placeholder="Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<label class="create-account"><a href="javascript: {}" class="sign-up">Sign Up</a><span class="divider" style="display:none">&nbsp;•&nbsp;</span><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n		          	<div class="signup">\n			            <form>\n			              	<div class="header"></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signup_easy_email" type="email" value="" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password">\n			                  		<input name="password" id="signup_easy_password" type="password" value="" required placeholder="Create a Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign Up</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<div class="footer"></div>\n				                  	<div class="options">\n				                    	<a href="javascript: {}" class="centered cancel">Cancel</a>\n				                  	</div>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n					<div class="reset">\n						<form id="change_password">\n						  	<div class="header"></div>\n						  	<div class="emailPassword">\n						    	<div class="email">\n						      		<input name="email" id="reset_easy_email" type="email" value="" required placeholder="Email" title="Email">\n						    	</div>\n						    	<div class="password">\n						      		<input name="password" id="reset_easy_password" type="password" value="" required placeholder="New Password" title="New Password">\n						    	</div>\n						    	<div class="repeatPassword">\n						      		<input name="repeat_password" id="reset_easy_repeat_password" type="password" value="" required placeholder="Confirm New Password" title="Confirm New Password">\n						    	</div>\n						    	<div class="action">\n						      		<button type="submit" class="zocial primary next" style="width: 100%;">Send</button>\n						      		<button type="submit" class="spinner" style="display: none"></button>\n						      		<div class="options">\n						        		<a href="javascript: {}" class="centered cancel">Cancel</a>\n						      		</div>\n						    	</div>\n						  	</div>\n						</form>\n					</div>\n					\n	          		<footer>\n	            		<span>Powered by <a href="http://auth0.com" target="_new">Auth0</a></span>\n	          		</footer>\n	        	</div>\n	      	</div>\n	    </div>\n	</div>\n</div>\n'); })();
} 
return buf.join('');
}; return function(l) { return t(l) }}())
},{}],25:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var bean      = require('bean');
var xtend     = require('xtend');

var mainTmpl = require('./html/main.html');

var $ = function (selector, root) {
  return bonzo(qwery('#auth0-widget ' + (selector || ''), root));
};

function Auth0Widget (options) {
  if (!(this instanceof Auth0Widget)) {
    return new Auth0Widget(options);
  }

  this._options = options;
  this._auth0 = new Auth0({
    clientID:     this._options.clientID, 
    callbackURL:  this._options.callbackURL,
    domain:       this._options.domain
  });
  
  this._strategies = {
    'google-openid': { css: 'google', name: 'Google OpenId', social: true },
    'google-apps': { css: 'google', name: 'Google Apps', social: false },
    'google-oauth2': { css: 'googleplus', name: 'Google', social: true },
    'facebook': { css: 'facebook', name: 'Facebook', social: true },
    'windowslive': { css: 'windows', name: 'Microsoft Account', social: true },
    'linkedin': { css: 'linkedin', name: 'LinkedIn', social: true },
    'github': { css: 'github', name: 'GitHub', social: true },
    'paypal': { css: 'paypal', name: 'PayPal', social: true },
    'twitter': { css: 'twitter', name: 'Twitter', social: true },
    'amazon': { css: 'amazon', name: 'Amazon', social: true },
    'vkontakte': { css: 'vk', name: 'vKontakte', social: true },
    'yandex': { css: 'yandex', name: 'Yandex', social: true },
    'office365': { css: 'office365', name: 'Office365', social: false },
    'waad': { css: 'waad', name: 'Windows Azure AD', social: false },
    'adfs': { css: 'windows', name: 'ADFS', social: false },
    'samlp': { css: 'guest', name: 'SAML', social: false },
    'mscrm': { css: 'guest', name: 'Dynamics CRM', social: false },
    'ad': { css: 'windows', name: 'AD / LDAP', social: false },
    'custom': { css: 'guest', name: 'Custom Auth', social: false },
    'auth0': { css: 'guest', name: 'Auth0', social: false },
    'auth0-adldap': { css: 'guest', name: 'AD/LDAP', social: false },
    'thirtysevensignals': { css: 'thirtysevensignals', name: '37 Signals', social: true },
    'box': { css: 'box', name: 'Box', social: true, imageicon: true },
    'salesforce': { css: 'salesforce', name: 'Salesforce', social: true },
    'fitbit': { css: 'fitbit', name: 'Fitbit', social: true }
  };
}

// helper methods
Auth0Widget.prototype._redirect = function (url) {
  global.window.location = url;
};

Auth0Widget.prototype._setTop = function (onTop, element) {
  if (!onTop) {
    setTimeout(function() {
      element.css({
        'marginTop': '-' + (element.offset().height / 2) + 'px',
        'top': '50%'
      });
    }, 1);
  } else {
    element.css({
      'marginTop': '2px',
      'top': '0'
    });
  }
};

Auth0Widget.prototype._showError = function (error) {
  if (!error) return;
  $('.signin h1').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin .error').html(error).css('display', '');
};

Auth0Widget.prototype._showSuccess = function (message) {
  if (!message) return;
  $('.signin h1').css('display', 'none');
  $('.signin .error').css('display', 'none');
  $('.signin .success').html(message).css('display', '');
};

Auth0Widget.prototype._isAuth0Conn = function (strategy) {
  return strategy === 'auth0' || strategy === 'auth0-adldap';
};

Auth0Widget.prototype._setTitle = function(title) {
  $('.signin .error').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin h1').html(title).css('display', '');
};

Auth0Widget.prototype._parseResponseMessage = function (responseObj, defaultValue) {
  return this._signinOptions[responseObj.code] || responseObj.message || defaultValue;
};

Auth0Widget.prototype._isAdLdapConn = function (connection) {
  return connection === 'adldap';
};

Auth0Widget.prototype._areThereAnySocialConn = function () {
  for (var s in this._client.strategies) {
    if (this._strategies[this._client.strategies[s].name] && this._strategies[this._client.strategies[s].name].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._areThereAnyEnterpriseOrDbConn = function() {
  for (var s in this._client.strategies) {
    if (this._strategies[this._client.strategies[s].name] && 
        !this._strategies[this._client.strategies[s].name].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._isEnterpriseConnection = function (email, output) {
  var emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    .exec(email.toLowerCase());

  for (var s in this._client.strategies) {
    var strategy = this._client.strategies[s];
    if (this._isAuth0Conn(strategy.name)) continue;

    for (var c in strategy.connections) {
      if (emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        output = output || {};
        output.domain = strategy.connections[c].domain;
        return true;
      }
    }
  }

  return false;
};

Auth0Widget.prototype._isEnterpriseStrategy = function (strategy) { 
  for (var s in this._strategies) {
    if (s === strategy && !this._strategies[s].social) { 
      return true; 
    } 
  } 

  return false; 
};

Auth0Widget.prototype._getConfiguredStrategy = function (name) {
  for (var s in this._client.strategies) {
    if (this._client.strategies[s] && this._client.strategies[s].name === name) {
      return this._client.strategies[s];
    }
  }
};

Auth0Widget.prototype._getAuth0Connection = function() {
  // if specified, use it, otherwise return first
  if (this._signinOptions['userPwdConnectionName']) {
    for (var i in this._auth0Strategy.connections) {
      if (this._auth0Strategy.connections[i].name === this._signinOptions['userPwdConnectionName']) {
        return this._auth0Strategy.connections[i];
      }
    }
  }

  return this._auth0Strategy ? this._auth0Strategy.connections[0] : null;
};

Auth0Widget.prototype._showOrHidePassword = function () {
  var mailField = $('.notloggedin .email input');
  var pwdField  = $('.notloggedin .password input').first();
  
  var isEnterpriseConnection = this._isEnterpriseConnection(mailField.val());

  if (isEnterpriseConnection) {
    pwdField.attr('disabled', true);
    pwdField.attr('placeholder', '');
    pwdField.removeAttr('required');
  } else {
    pwdField.removeAttr('disabled');
    pwdField.attr('required', true);
  }
};

Auth0Widget.prototype._hideSignIn = function (cb) {
  $('div.overlay').removeClass('active');

  setTimeout(function () {
    $().removeClass('mode-signin');
    $().css('display', 'none');
    if (cb) cb();
  }, 500);
};

Auth0Widget.prototype._getActiveLoginView = function() {
  var container = this._hasLoggedInBefore ? $('.loggedin') : $('.notloggedin');
  return container;
};

Auth0Widget.prototype._toggleSpinner = function (container) {
  container = container || this._getActiveLoginView();
  var spinner = $('.spinner', container);
  var signin = $('.zocial.primary', container);

  spinner.css('display', spinner.css('display') === 'none' ? '' : 'none');
  signin.css('display', signin.css('display') === 'none' ? '' : 'none');
};

Auth0Widget.prototype._showSignUpExperience = function() {
  this._setLoginView({ mode: 'signup' });
};

Auth0Widget.prototype._showResetExperience = function() {
  this._setLoginView({ mode: 'reset' });
};

Auth0Widget.prototype._setLoginView = function(options) {
  options = options || {};

  $('.loggedin').css('display', 'none');
  $('.notloggedin').css('display', 'none');
  $('.signup').css('display', 'none');
  $('.reset').css('display', 'none');
  $('.signin input[type=password]').val('');

  if (!options.mode) {
    this._hasLoggedInBefore = !!options.isReturningUser;
    this._setTitle(this._signinOptions['title']);

    $('.loggedin').css('display', options.isReturningUser ? '' : 'none');
    $('.notloggedin').css('display', options.isReturningUser ? 'none' : '');

    this._setTop(this._signinOptions.top, $('.signin div.panel.onestep'));

    try { 
      if (options.isReturningUser) $('.loggedin .password input').first().focus();
      else $('.notloggedin .email input').first().focus();
    } catch(e) {}
    
    return;
  }

  var container;

  switch (options.mode) {
    case 'signup':
      this._setTitle(this._signinOptions['signupTitle']);
      container = $('.signup').first();
      break;
    case 'reset':
      this._setTitle(this._signinOptions['resetTitle']);
      container = $('.reset').first();
      break;
  }

  if (container) {
    this._setTop(this._signinOptions.top, $('.signin div.panel.onestep'));
    container.css('display', '');

    try { 
      var email = $('.notloggedin .email input').val();
      $('.email input', container).val(email);
      $('.email input', container).first().focus();
    } catch(e) {}
  }
};

Auth0Widget.prototype._showLoggedInExperience = function() {
  var self = this;
  var strategy = this._ssoData.lastUsedConnection.strategy;
  this._setLoginView({ isReturningUser: !!strategy });

  if (!strategy) return;

  var loginView = this._getActiveLoginView();
  bean.on($('form', loginView)[0], 'submit', function (e) { self._signInEnterprise(e); });
  
  var button;
  if (strategy !== 'auth0') {
    button = bonzo(bonzo.create('<span></span>'))
      .attr('tabindex', 0)
      .attr('data-strategy', strategy)
      .attr('title', this._strategies[strategy].name)
      .addClass('zocial').addClass('block')
      .addClass(this._strategies[strategy].css)
      .addClass(this._strategies[strategy].imageicon ? 'image-icon' : '')
      .html(this._strategies[strategy].name);
    
    bean.on(button[0], 'click', function (e) { self._signInSocial(e.target); });

    $('.strategy span', loginView).each(function (el) { if (el) el.remove(); });
    $('.strategy', loginView).append(button);
  }

  $('.all', loginView).html(this._signinOptions['allButtonTemplate']);

  bean.on($('.all', loginView)[0], 'click', function () {
    self._setLoginView();
  });

  if (this._ssoData.lastUsedUsername) {
    if (strategy === 'auth0') {
      $('.email-readonly', loginView).html(this._ssoData.lastUsedUsername); 
      $('.email input', loginView).css('display', 'none');
      $('.emailPassword', loginView).css('display', '');
    } 
    else if (this._isEnterpriseStrategy(strategy)) {
      button.html(this._ssoData.lastUsedUsername || this._strategies[strategy].name)
            .attr('title', this._ssoData.lastUsedUsername || this._strategies[strategy].name);
    }
  }
};

// sign in methods
Auth0Widget.prototype._signInSocial = function (target) {
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = this._getConfiguredStrategy(strategyName);

  if (strategy) {
    this._auth0.login({
      connection: strategy.connections[0].name
    });
  }
};

Auth0Widget.prototype._signInEnterprise = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var container = this._getActiveLoginView();
  var form = $('form', container);
  var valid = true;

  var emailD = $('.email', form),
      emailE = $('input[name=email]', form),
      emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(emailE.val().toLowerCase()),
      emailP = /^\s*$/.test(emailE.val()),
      domain, connection, email = null, strategy;

  for (var s in this._client.strategies) {
    strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name)) continue;

    for (var c in strategy.connections) {
      if(!emailP && emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        domain = strategy.connections[c].domain;
        connection = strategy.connections[c].name;
        email = emailE.val();
        break;
      }
    }

    if (domain) break;
  }

  if (emailP) {
    this._showError(this._signinOptions['strategyEmailEmpty']);
  } 
  else if (!emailM) {
    this._showError(this._signinOptions['strategyEmailInvalid']);
  } 
  else if (!domain) {
    if (this._auth0Strategy) {
      return this._signInWithAuth0(emailE.val());
    }

    if (emailM && emailM.slice(-2)[0] === 'gmail.com') {
      return this._signInSocial('google-oauth2');
    }

    this._showError(
      this._signinOptions['strategyDomainInvalid']
          .replace('{domain}', emailM ? emailM.slice(-2)[0] : ''));
  }

  valid &= (!domain && !emailD.addClass('invalid')) || (!!domain && !!emailD.removeClass('invalid'));

  if (valid) {
    this._auth0.login({
      connection: connection
    });
  }
};

Auth0Widget.prototype._signInWithAuth0 = function (userName, signInPassword) {
  this._toggleSpinner();

  var self = this;
  var container = this._getActiveLoginView();
  var connection  = this._getAuth0Connection();
  
  var loginOptions = {
    connection: connection.name,
    username: this._isAdLdapConn(connection.name) ? userName.replace('@' + connection.domain, '') : userName,
    password: signInPassword || $('.password input', container).val()
  };

  for (var k in this._auth0ConnectionParams) {
    loginOptions[k] = this._auth0ConnectionParams[k];
  }

  this._auth0.login(loginOptions, function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['wrongEmailPasswordErrorText']));
    }

    self._toggleSpinner();
  });
};

Auth0Widget.prototype._signUpWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.popup .panel.onestep .signup');
  var email = $('.email input', container).val();
  var password = $('.password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.signup({
    connection: connection.name,
    username:   email,
    password:   password
  }, 
  function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['signupServerErrorText']));
      self._toggleSpinner(container);
      return;
    }

    return self._signInWithAuth0(email, password);
  });
};

Auth0Widget.prototype._resetPasswordWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.popup .panel.onestep .reset');
  var email = $('.email input', container).val();
  var password = $('.password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.changePassword({
    connection: connection.name,
    username:   email,
    password:   password
  }, 
  function (err) {
    self._toggleSpinner(container);

    $('.password input', container).val('');
    $('.repeatPassword input', container).val('');

    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['resetServerErrorText']));
      return;
    }

    $('.email input', container).val('');

    try { 
      $('.email input', container).first().focus(); 
    } catch(e) {}  

    self._setLoginView();
    self._showSuccess(self._signinOptions['resetSuccessText']);
  });
};

// initialize
Auth0Widget.prototype._initialize = function () {
  // TODO: support css option for non free subscriptions

  var self = this;
  bean.on($('.popup .panel.onestep a.close')[0], 'click', function () { self._hideSignIn(); });
  bean.on($('.popup .panel.onestep .notloggedin form')[0], 'submit', function (e) { self._signInEnterprise(e); });
  bean.on($('.popup .panel.onestep .signup form')[0], 'submit', function (e) { self._signUpWithAuth0(e); });
  bean.on($('.popup .panel.onestep .reset form')[0], 'submit', function (e) { self._resetPasswordWithAuth0(e); });
  bean.on(qwery('html')[0], 'keyup', function (e) {
    if ($().hasClass('mode-signin')) {
      if ((e.which == 27 || e.keycode == 27) && !self._signinOptions.standalone) {
        self._hideSignIn(); // close popup with ESC key
      }
    }
  });

  // load social buttons
  var list = $('.popup .panel.onestep .iconlist');
  for (var s in this._client.strategies) {
    var strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name) && strategy.connections.length > 0) {
      this._auth0Strategy = strategy;
      $('.create-account, .password').css('display', 'block');

      bean.on($('.notloggedin .email input')[0], 'input', function (e) { self._showOrHidePassword(e); });
    }

    if (this._strategies[strategy.name] && this._strategies[strategy.name].social) {
      var button = bonzo(bonzo.create('<span></span>'))
        .attr('tabindex', 0)
        .attr('data-strategy', strategy.name)
        .attr('title', this._strategies[strategy.name].name)
        .addClass('zocial').addClass('icon')
        .addClass(this._strategies[strategy.name].css)
        .addClass(this._strategies[strategy.name].imageicon ? 'image-icon' : '')
        .html(this._strategies[strategy.name].name);

      list.append(button);
      list.css('display', 'block');

      $('.popup .panel.onestep .separator').css('display', 'block');
    }
  }

  $('.popup .panel.onestep .iconlist span').each(function (button) {
    bean.on(button, 'click', function (e) {
      self._signInSocial(e.target);
    });
  });

  this._showSignIn();
};

Auth0Widget.prototype._showSignIn = function () {
  var self = this;
  $().addClass('mode-signin');

  // if no social connections and one enterprise connection only, redirect
  if (!this._areThereAnySocialConn() && 
    this._client.strategies.length === 1 &&
    this._client.strategies[0].name !== 'auth0' &&
    this._client.strategies[0].connections.length === 1) {
    
    this._auth0.login({
      connection: this._client.strategies[0].connections[0].name
    });

    return;
  }

  // labels text
  var options = xtend(this._signinOptions, this._signinOptions.resources);
  options['onestep'] = typeof options['onestep'] !== 'undefined' ? options['onestep'] : false;
  options['top'] = options['top'] || false;
  options['title'] = options['title'] || 'Sign In';
  options['allButtonTemplate'] = options['allButtonTemplate'] || "Show all";
  options['strategyEmailEmpty'] = options['strategyEmailEmpty'] || "The email is empty.";
  options['strategyEmailInvalid'] = options['strategyEmailInvalid'] || "The email is invalid.";
  options['strategyDomainInvalid'] = options['strategyDomainInvalid'] || "The domain {domain} has not been setup.";

  options['icon'] = options['icon'] || "https://s3.amazonaws.com/assets.auth0.com/w2/img/logo-32.png";
  options['showIcon'] = typeof options['showIcon'] !== 'undefined' ? options['showIcon'] : false;
  options['showSignup'] = typeof options['showSignup'] !== 'undefined' ? options['showSignup'] : true;
  options['showForgot'] = typeof options['showForgot'] !== 'undefined' ? options['showForgot'] : true;
  options['signupText'] = options['signupText'] || 'Sign Up';
  options['forgotText'] = options['forgotText'] || 'Forgot your password?';
  options['signInButtonText'] = options['signInButtonText'] || 'Sign In';
  options['emailPlaceholder'] = options['emailPlaceholder'] || 'Email';
  options['passwordPlaceholder'] = options['passwordPlaceholder'] || 'Password';
  options['separatorText'] = options['separatorText'] || 'or';
  options['serverErrorText'] = options['serverErrorText'] || 'There was an error processing the sign in.';
  options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
  options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
  options['socialBigButtons'] = typeof options['socialBigButtons'] !== 'undefined' ? options['socialBigButtons'] : !this._areThereAnyEnterpriseOrDbConn();
  options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;
  options['returnUserLabel'] = options['returnUserLabel'] || 'Last time you signed in using...';
  options['wrongEmailPasswordErrorText'] = options['wrongEmailPasswordErrorText'] || 'Wrong email or password.';

  // signup
  options['signupTitle'] = options['signupTitle'] || 'Sign Up';
  options['signupButtonText'] = options['signupButtonText'] || 'Sign Up';
  options['signupEmailPlaceholder'] = options['signupEmailPlaceholder'] || 'Email';
  options['signupPasswordPlaceholder'] = options['signupPasswordPlaceholder'] || 'Create a Password';
  options['signupCancelButtonText'] = options['signupCancelButtonText'] || 'Cancel';
  options['signupHeaderText'] = typeof options['signupHeaderText'] !== 'undefined' ? options['signupHeaderText'] : 'Please enter your email and password';
  options['signupFooterText'] = typeof options['signupFooterText'] !== 'undefined' ? options['signupFooterText'] : 'By clicking "Sign Up", you agree to our terms of service and privacy policy.';
  options['signupEnterpriseEmailWarningText'] = options['signupEnterpriseEmailWarningText'] || 'This domain {domain} has been configured for Single Sign On and you can\'t create an account. Try signing in instead.';
  options['signupServerErrorText'] = options['signupServerErrorText'] || 'There was an error processing the sign up.';

  // reset
  options['resetTitle'] = options['resetTitle'] || 'Reset Password';
  options['resetButtonText'] = options['resetButtonText'] || 'Send';
  options['resetEmailPlaceholder'] = options['resetEmailPlaceholder'] || 'Email';
  options['resetPasswordPlaceholder'] = options['resetPasswordPlaceholder'] || 'New Password';
  options['resetRepeatPasswordPlaceholder'] = options['resetRepeatPasswordPlaceholder'] || 'Confirm New Password';
  options['resetCancelButtonText'] = options['resetCancelButtonText'] || 'Cancel';
  options['resetSuccessText'] = options['resetSuccessText'] || 'We\'ve just sent you an email to reset your password.';
  options['resetEnterSamePasswordText'] = options['resetEnterSamePasswordText'] || 'Please enter the same password.';
  options['resetHeaderText'] = typeof options['resetHeaderText'] !== 'undefined' ? options['resetHeaderText'] : 'Please enter your email and the new password. We will send you an email to confirm the password change.';
  options['resetServerErrorText'] = options['resetServerErrorText'] || 'There was an error processing the reset password.';

  this._signinOptions = options;

  // theme
  if (options.theme) {
    $().addClass('theme-' + options.theme);
  }

  $('.panel a.close').css('display', options.standalone ? 'none' : 'block');

  // show icon
  if (options.showIcon) {
    $('.panel .image img').attr('src', options.icon);
    $('.panel .image').css('display', options.showIcon ? 'block' : 'none');
  }

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection();
  if (auth0Conn) {
    options.showSignup = auth0Conn.showSignup;
    options.showForgot = auth0Conn.showForgot;
  }
  
  $('.panel .create-account .sign-up')
    .css('display', options.showSignup ? '' : 'none')
    .html(options.signupText);

  $('.panel .create-account .forgot-pass')
    .css('display', options.showForgot ? '' : 'none')
    .html(options.forgotText);

  if (options.signupLink) {
    $('.panel .create-account .sign-up')
      .attr('href', options.signupLink)
      .attr('target', '_parent');
  } 
  else {
    bean.on($('.panel .create-account .sign-up')[0], 'click', function (e) { self._showSignUpExperience(e); });
  }

  if (options.forgotLink) {
    $('.panel .create-account .forgot-pass')
      .attr('href', options.forgotLink)
      .attr('target', '_parent');
  } 
  else {
    $('.panel .create-account .forgot-pass').each(function (elem) {
      bean.on(elem, 'click', function (e) { self._showResetExperience(e); });
    });
  }

  // hide divider dot if there are one of two
  $('.panel .create-account .divider')
    .css('display', options.showEmail && options.showSignup && options.showForgot ? '' : 'none');

  $('div.panel input').each(function (e) { e.value = ''; });

  // placeholders and buttons
  $('.panel .zocial.primary').html(options.signInButtonText);
  $('.panel .email input').attr('placeholder', options.emailPlaceholder);
  $('.panel .password input').attr('placeholder', options.passwordPlaceholder);
  $('.panel .separator span').html(options.separatorText);

  // signup
  $('.panel .signup .zocial.primary').html(options.signupButtonText);

  $('.panel .signup .email input').each(function (i) { 
      i.setAttribute('placeholder', options.signupEmailPlaceholder);
      i.addEventListener('input', function() {
        var output = {};
        if (self._isEnterpriseConnection(this.value, output)) {
          var warningText = options.signupEnterpriseEmailWarningText.replace(/{domain}/g, output.domain);
          this.setCustomValidity(warningText);
        } else {
          this.setCustomValidity('');
        }
      });
  });

  $('.panel .signup .password input').attr('placeholder', options.signupPasswordPlaceholder);

  $('.panel .signup .options .cancel').html(options['signupCancelButtonText']);
  bean.on($('.panel .signup .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .signup .header')
    .html(options.signupHeaderText)
    .attr('display', options.signupHeaderText ? '' : 'none');

  $('.panel .signup .footer')
    .html(options.signupFooterText)
    .attr('display', options.signupFooterText ? '' : 'none');

  // reset
  $('.panel .reset .zocial.primary').html(options.resetButtonText);
  $('.panel .reset .email input').attr('placeholder', options.resetEmailPlaceholder);
  $('.panel .reset .password input').attr('placeholder', options.resetPasswordPlaceholder);

  $('.panel .reset .repeatPassword input').each(function (i) { 
      i.setAttribute('placeholder', options.resetRepeatPasswordPlaceholder);
      i.addEventListener('input', function() {
        if ($('.panel .reset .password input').val() != this.value) {
          this.setCustomValidity(options.resetEnterSamePasswordText);
        } else {
          this.setCustomValidity('');
        }
      });
  });

  $('.panel .reset .options .cancel').html(options.resetCancelButtonText);
  bean.on($('.panel .reset .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .reset .header')
    .html(options.resetHeaderText)
    .attr('display', options.resetHeaderText ? '' : 'none');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = this._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = this._areThereAnySocialConn();

  $('.panel .email input').css('display', options.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .zocial.primary').css('display', options.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .password input').css('display', options.showEmail && options.showPassword && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .forgot-pass').css('display', options.showEmail && options.showForgot && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .sign-up').css('display', options.showEmail && options.showSignup && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .separator').css('display', options.showEmail && anyEnterpriseOrDbConnection && anySocialConnection ? '' : 'none');
  $('.panel .last-time').html(options.returnUserLabel);

  // TODO: show placeholders for IE9

  // activate panel
  $('div.panel').removeClass('active');
  $('div.overlay').addClass('active');
  $('div.panel.onestep').addClass('active');

  $('.popup h1').html(options.title);
  $('.popup .invalid').removeClass('invalid');

  // if user logged in show logged in experience
  if (this._ssoData.sso && options['enableReturnUserExperience']) {
    this._showLoggedInExperience();
  }

  if (options['socialBigButtons']) {
    $('.popup .panel.onestep .iconlist span').removeClass('icon').addClass('block');
  } else {
    $('.popup .panel.onestep .iconlist span').addClass('icon').removeClass('block');
  }

  $('div.panel.onestep h1').html(options['title']);

  // TODO: support _signinOptions.container

  if (this._ssoData.sso && this._ssoData.lastUsedUsername) {
    $('div.panel.onestep input').val(this._ssoData.lastUsedUsername);
    this._showOrHidePassword();
  }

  this._setTop(options.top, $('div.panel.onestep'));
  this._setLoginView({ isReturningUser: this._ssoData.sso });
};

Auth0Widget.prototype._getConfiguredStrategies = function (conns) {
  var strategies = [];
  for (var conn in conns) {
    if (typeof(conns[conn].status) !== 'undefined' && !conns[conn].status) continue;

    var strategy = strategies.filter(function (s) { 
      return s.name === conns[conn].strategy; 
    })[0];

    if (!strategy) {
      strategy = {
        name: conns[conn].strategy,
        connections: []
      };

      strategies.push(strategy);
    }

    var connData = {
      name: conns[conn].name,
      domain: conns[conn].domain,
      showSignup: conns[conn].showSignup,
      showForgot: conns[conn].showForgot
    };

    strategy.connections.push(connData);
  }

  return strategies;
};

Auth0Widget.prototype.getClient = function () {
  return this._auth0;
};

Auth0Widget.prototype.show = function (signinOptions) {
  var self = this;
  this._signinOptions = xtend(this._options, signinOptions);
  this._auth0 = new Auth0({
    clientID:     this._signinOptions.clientID, 
    callbackURL:  this._signinOptions.callbackURL,
    domain:       this._signinOptions.domain
  });

  // TODO: set auth0 connection parameters
  this._auth0ConnectionParams = null;

  // get configured strategies/connections
  this._auth0.getConnections(function (err, connections) {
    var allowedConnections = [];

    // use only specified connections
    if (self._signinOptions.connections) {
      for (var i in connections) {
        if (self._signinOptions.connections.indexOf(connections[i].name) > -1) {
          allowedConnections.push(connections[i]);
        }
      }
    }
    else {
      allowedConnections = connections;
    }

    self._client = {
      strategies: self._getConfiguredStrategies(allowedConnections)
    };

    // get SSO data
    self._auth0.getSSOData(function (err, ssoData) {
      self._ssoData = ssoData;
      
      // remove widget container (if exist)
      $().parent().remove();

      // widget container
      var div = document.createElement('div');
      div.innerHTML = mainTmpl();
      document.body.appendChild(div);
      
      self._initialize();
    });
  });
};

module.exports = Auth0Widget;

},{"./html/main.html":24,"auth0-js":2,"bean":13,"bonzo":14,"qwery":17,"xtend":19}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvTG9naW5FcnJvci5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvYXNzZXJ0X3JlcXVpcmVkLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvanNvbl9wYXJzZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvdXNlX2pzb25wLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9CYXNlNjQvYmFzZTY0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9qc29ucC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvanNvbnAvbm9kZV9tb2R1bGVzL2RlYnVnL2RlYnVnLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9xcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2JlYW4vYmVhbi5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9ib256by9ib256by5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9xd2VyeS9xd2VyeS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9oYXMta2V5cy5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvZm9yZWFjaC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2lzQXJndW1lbnRzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9zaGltLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2h0bWwvbWFpbi5odG1sIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3haQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNybEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdsb2JhbD10eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge307dmFyIGZzICAgICAgICAgID0gcmVxdWlyZSgnZnMnKTtcbnZhciBpbnNlcnRDc3MgICA9IHJlcXVpcmUoJ2luc2VydC1jc3MnKTtcblxudmFyIEF1dGgwV2lkZ2V0ID0gcmVxdWlyZSgnLi93aWRnZXQnKTtcblxuaW5zZXJ0Q3NzKFwiQGNoYXJzZXQgXFxcIlVURi04XFxcIjsjYXV0aDAtd2lkZ2V0ey8qIVxcbiogQ2xlYW5TbGF0ZVxcbiogICBnaXRodWIuY29tL3ByZW1hc2FnYXIvY2xlYW5zbGF0ZVxcbipcXG4qLy8qIVxcblxcdFpvY2lhbCBCdXRvbnNcXG5cXHRodHRwOi8vem9jaWFsLnNtY2xsbnMuY29tXFxuXFx0YnkgU2FtIENvbGxpbnMgKEBzbWNsbG5zKVxcblxcdExpY2Vuc2U6IGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcXG5cXHRcXG5cXHRZb3UgYXJlIGZyZWUgdG8gdXNlIGFuZCBtb2RpZnksIGFzIGxvbmcgYXMgeW91IGtlZXAgdGhpcyBsaWNlbnNlIGNvbW1lbnQgaW50YWN0IG9yIGxpbmsgYmFjayB0byB6b2NpYWwuc21jbGxucy5jb20gb24geW91ciBzaXRlLlxcbiovLyohIG5vcm1hbGl6ZS5jc3MgdjEuMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXQuaW8vbm9ybWFsaXplICovfSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg1LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZvcm0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvcHRpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBwcmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkaXYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGJvZHksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0Zm9vdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNhcHRpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aGVhZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhZGRyZXNzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmllbGRzZXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlmcmFtZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cm9uZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxlZ2VuZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGVtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNpdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzcGFuLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsYWJlbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRmbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9iamVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJpZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb250LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2FtcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFjcm9ueW0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzbWFsbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGltZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cmlrZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNvZGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdWIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHZhciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhYmJyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXBwbGV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUga2JkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBiLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXJ0aWNsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFzaWRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGlhbG9nLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmlndXJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9vdGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGVhZGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGdyb3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlY3Rpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aW1lLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWFyaywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGF1ZGlvLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdmlkZW97YmFja2dyb3VuZC1hdHRhY2htZW50OnNjcm9sbCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1pbWFnZTpub25lIWltcG9ydGFudDtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1yZXBlYXQ6cmVwZWF0IWltcG9ydGFudDtib3JkZXItY29sb3I6YmxhY2shaW1wb3J0YW50O2JvcmRlci1jb2xvcjpjdXJyZW50Q29sb3IhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7Ym9yZGVyLXN0eWxlOm5vbmUhaW1wb3J0YW50O2JvcmRlci13aWR0aDptZWRpdW0haW1wb3J0YW50O2JvdHRvbTphdXRvIWltcG9ydGFudDtjbGVhcjpub25lIWltcG9ydGFudDtjbGlwOmF1dG8haW1wb3J0YW50O2NvbG9yOmluaGVyaXQhaW1wb3J0YW50O2NvdW50ZXItaW5jcmVtZW50Om5vbmUhaW1wb3J0YW50O2NvdW50ZXItcmVzZXQ6bm9uZSFpbXBvcnRhbnQ7Y3Vyc29yOmF1dG8haW1wb3J0YW50O2RpcmVjdGlvbjppbmhlcml0IWltcG9ydGFudDtkaXNwbGF5OmlubGluZSFpbXBvcnRhbnQ7ZmxvYXQ6bm9uZSFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6aW5oZXJpdCFpbXBvcnRhbnQ7Zm9udC1zaXplOmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtc3R5bGU6aW5oZXJpdCFpbXBvcnRhbnQ7Zm9udC12YXJpYW50Om5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6aW5oZXJpdCFpbXBvcnRhbnQ7aGVpZ2h0OmF1dG8haW1wb3J0YW50O2xlZnQ6YXV0byFpbXBvcnRhbnQ7bGV0dGVyLXNwYWNpbmc6bm9ybWFsIWltcG9ydGFudDtsaW5lLWhlaWdodDppbmhlcml0IWltcG9ydGFudDtsaXN0LXN0eWxlLXR5cGU6aW5oZXJpdCFpbXBvcnRhbnQ7bGlzdC1zdHlsZS1wb3NpdGlvbjpvdXRzaWRlIWltcG9ydGFudDtsaXN0LXN0eWxlLWltYWdlOm5vbmUhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUhaW1wb3J0YW50O21heC13aWR0aDpub25lIWltcG9ydGFudDttaW4taGVpZ2h0OjAhaW1wb3J0YW50O21pbi13aWR0aDowIWltcG9ydGFudDtvcGFjaXR5OjE7b3V0bGluZTppbnZlcnQgbm9uZSBtZWRpdW0haW1wb3J0YW50O292ZXJmbG93OnZpc2libGUhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnQ7cG9zaXRpb246c3RhdGljIWltcG9ydGFudDtxdW90ZXM6XFxcIlxcXCIgXFxcIlxcXCIhaW1wb3J0YW50O3JpZ2h0OmF1dG8haW1wb3J0YW50O3RhYmxlLWxheW91dDphdXRvIWltcG9ydGFudDt0ZXh0LWFsaWduOmluaGVyaXQhaW1wb3J0YW50O3RleHQtZGVjb3JhdGlvbjppbmhlcml0IWltcG9ydGFudDt0ZXh0LWluZGVudDowIWltcG9ydGFudDt0ZXh0LXRyYW5zZm9ybTpub25lIWltcG9ydGFudDt0b3A6YXV0byFpbXBvcnRhbnQ7dW5pY29kZS1iaWRpOm5vcm1hbCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246YmFzZWxpbmUhaW1wb3J0YW50O3Zpc2liaWxpdHk6aW5oZXJpdCFpbXBvcnRhbnQ7d2hpdGUtc3BhY2U6bm9ybWFsIWltcG9ydGFudDt3aWR0aDphdXRvIWltcG9ydGFudDt3b3JkLXNwYWNpbmc6bm9ybWFsIWltcG9ydGFudDt6LWluZGV4OmF1dG8haW1wb3J0YW50Oy1tb3otYm9yZGVyLXJhZGl1czowIWltcG9ydGFudDstd2Via2l0LWJvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3ghaW1wb3J0YW50O2JveC1zaXppbmc6Y29udGVudC1ib3ghaW1wb3J0YW50O3RleHQtc2hhZG93Om5vbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg1LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgxLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb3JtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb3B0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcHJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGl2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjYXB0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFkZHJlc3MsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmaWVsZHNldCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRleHRhcmVhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaHIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhcnRpY2xlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXNpZGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkaWFsb2csI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmaWd1cmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb290ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoZWFkZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoZ3JvdXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VjdGlvbntkaXNwbGF5OmJsb2NrIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRhYmxle2Rpc3BsYXk6dGFibGUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGhlYWR7ZGlzcGxheTp0YWJsZS1oZWFkZXItZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGJvZHl7ZGlzcGxheTp0YWJsZS1yb3ctZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGZvb3R7ZGlzcGxheTp0YWJsZS1mb290ZXItZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdHJ7ZGlzcGxheTp0YWJsZS1yb3chaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGgsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZHtkaXNwbGF5OnRhYmxlLWNlbGwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2IG9se2xpc3Qtc3R5bGUtdHlwZTpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudXtsaXN0LXN0eWxlLXR5cGU6ZGlzYyFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbHtsaXN0LXN0eWxlLXR5cGU6ZGVjaW1hbCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSBtZW51e2xpc3Qtc3R5bGUtdHlwZTpjaXJjbGUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgb2wgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBvbCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51IG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudSBtZW51e2xpc3Qtc3R5bGUtdHlwZTpzcXVhcmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGl7ZGlzcGxheTpsaXN0LWl0ZW0haW1wb3J0YW50O21pbi1oZWlnaHQ6YXV0byFpbXBvcnRhbnQ7bWluLXdpZHRoOmF1dG8haW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3Ryb25ne2ZvbnQtd2VpZ2h0OmJvbGQhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZW17Zm9udC1zdHlsZTppdGFsaWMhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUga2JkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2FtcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNvZGV7Zm9udC1mYW1pbHk6bW9ub3NwYWNlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhICosI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXN1Ym1pdF0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXJhZGlvXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0W3R5cGU9Y2hlY2tib3hdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0e2N1cnNvcjpwb2ludGVyIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBidXR0b24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXN1Ym1pdF17dGV4dC1hbGlnbjpjZW50ZXIhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1oaWRkZW5de2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhYmJyW3RpdGxlXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFjcm9ueW1bdGl0bGVdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGZuW3RpdGxlXXtjdXJzb3I6aGVscCFpbXBvcnRhbnQ7Ym9yZGVyLWJvdHRvbS13aWR0aDoxcHghaW1wb3J0YW50O2JvcmRlci1ib3R0b20tc3R5bGU6ZG90dGVkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGluc3tiYWNrZ3JvdW5kLWNvbG9yOiNmZjkhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRlbHt0ZXh0LWRlY29yYXRpb246bGluZS10aHJvdWdoIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxe3F1b3Rlczpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGU6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZTphZnRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHE6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcTphZnRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpOmFmdGVye2NvbnRlbnQ6XFxcIlxcXCIhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3R7dmVydGljYWwtYWxpZ246bWlkZGxlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRleHRhcmVhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXR7Ym9yZGVyOjFweCBzb2xpZCAjY2NjIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRhYmxle2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZSFpbXBvcnRhbnQ7Ym9yZGVyLXNwYWNpbmc6MCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBocntkaXNwbGF5OmJsb2NrIWltcG9ydGFudDtoZWlnaHQ6MXB4IWltcG9ydGFudDtib3JkZXI6MCFpbXBvcnRhbnQ7Ym9yZGVyLXRvcDoxcHggc29saWQgI2NjYyFpbXBvcnRhbnQ7bWFyZ2luOjFlbSAwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlICpbZGlyPXJ0bF17ZGlyZWN0aW9uOnJ0bCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtYXJre2JhY2tncm91bmQtY29sb3I6I2ZmOSFpbXBvcnRhbnQ7Y29sb3I6YmxhY2shaW1wb3J0YW50O2ZvbnQtc3R5bGU6aXRhbGljIWltcG9ydGFudDtmb250LXdlaWdodDpib2xkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRle2ZvbnQtc2l6ZTptZWRpdW0haW1wb3J0YW50O2xpbmUtaGVpZ2h0OjEhaW1wb3J0YW50O2RpcmVjdGlvbjpsdHIhaW1wb3J0YW50O3RleHQtYWxpZ246bGVmdCFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6XFxcIlRpbWVzIE5ldyBSb21hblxcXCIsVGltZXMsc2VyaWYhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudDtmb250LXN0eWxlOm5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6bm9ybWFsIWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246bm9uZSFpbXBvcnRhbnQ7bGlzdC1zdHlsZS10eXBlOmRpc2MhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLnpvY2lhbCwjYXV0aDAtd2lkZ2V0IGEuem9jaWFse2JvcmRlcjoxcHggc29saWQgIzc3Nztib3JkZXItY29sb3I6cmdiYSgwLDAsMCwwLjIpO2JvcmRlci1ib3R0b20tY29sb3I6IzMzMztib3JkZXItYm90dG9tLWNvbG9yOnJnYmEoMCwwLDAsMC40KTtjb2xvcjojZmZmOy1tb3otYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC40KSxpbnNldCAwIDAgLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7Ym94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OmJvbGQgMTAwJS8yLjEgXFxcIkx1Y2lkYSBHcmFuZGVcXFwiLFRhaG9tYSxzYW5zLXNlcmlmO3BhZGRpbmc6MCAuOTVlbSAwIDA7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDAsMCwwLDAuNSk7d2hpdGUtc3BhY2U6bm93cmFwOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtwb3NpdGlvbjpyZWxhdGl2ZTstbW96LWJvcmRlci1yYWRpdXM6LjNlbTstd2Via2l0LWJvcmRlci1yYWRpdXM6LjNlbTtib3JkZXItcmFkaXVzOi4zZW19I2F1dGgwLXdpZGdldCAuem9jaWFsOmJlZm9yZXtjb250ZW50OlxcXCJcXFwiO2JvcmRlci1yaWdodDouMDc1ZW0gc29saWQgcmdiYSgwLDAsMCwwLjEpO2Zsb2F0OmxlZnQ7Zm9udDoxMjAlLzEuNjUgem9jaWFsO2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDttYXJnaW46MCAuNWVtIDAgMDtwYWRkaW5nOjAgLjVlbTt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LXRyYW5zZm9ybTpub25lOy1tb3otYm94LXNoYWRvdzouMDc1ZW0gMCAwIHJnYmEoMjU1LDI1NSwyNTUsMC4yNSk7LXdlYmtpdC1ib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTtib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTstbW96LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkOy13ZWJraXQtZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWQ7Zm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWR9I2F1dGgwLXdpZGdldCAuem9jaWFsOmFjdGl2ZXtvdXRsaW5lOjB9I2F1dGgwLXdpZGdldCAuem9jaWFsLmljb257b3ZlcmZsb3c6aGlkZGVuO21heC13aWR0aDoyLjRlbTtwYWRkaW5nLWxlZnQ6MDtwYWRkaW5nLXJpZ2h0OjA7bWF4LWhlaWdodDoyLjE1ZW07d2hpdGUtc3BhY2U6bm93cmFwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pY29uOmJlZm9yZXtwYWRkaW5nOjA7d2lkdGg6MmVtO2hlaWdodDoyZW07Ym94LXNoYWRvdzpub25lO2JvcmRlcjowfSNhdXRoMC13aWRnZXQgLnpvY2lhbHtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjEpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpKSxjb2xvci1zdG9wKDUxJSxyZ2JhKDAsMCwwLDAuMDUpKSx0byhyZ2JhKDAsMCwwLDAuMSkpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWw6Zm9jdXN7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkpLGNvbG9yLXN0b3AoNDklLHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4xKSksdG8ocmdiYSgwLDAsMCwwLjE1KSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbDphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xKSksY29sb3Itc3RvcCgzMCUscmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCg1MCUsdHJhbnNwYXJlbnQpLHRvKHJnYmEoMCwwLDAsMC4xKSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWIsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtib3JkZXI6MXB4IHNvbGlkICNhYWE7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4zKTtib3JkZXItYm90dG9tLWNvbG9yOiM3Nzc7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNSk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksaW5zZXQgMCAwIC4wOGVtIHJnYmEoMjU1LDI1NSwyNTUsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO2JveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1Yjpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWw6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQ6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnR3aXR0ZXI6Zm9jdXMgLnpvY2lhbC50d2l0dGVyOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmZvY3VzIC56b2NpYWwuc2FsZXNmb3JjZTpob3ZlcntiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjUpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4wNSkpLHRvKHJnYmEoMCwwLDAsMC4xNSkpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC53aWtpcGVkaWE6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmFjdGl2ZXtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCgzMCUscmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCg1MCUscmdiYSgwLDAsMCwwKSksdG8ocmdiYSgwLDAsMCwwLjEpKSk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmFtYXpvbjpiZWZvcmV7Y29udGVudDpcXFwiYVxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6YmVmb3Jle2NvbnRlbnQ6XFxcImRcXFwiO2NvbG9yOiMxZjc1Y2N9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZhY2Vib29rOmJlZm9yZXtjb250ZW50OlxcXCJmXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViOmJlZm9yZXtjb250ZW50OlxcXCJcXFxcMDBFOFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmJlZm9yZXtjb250ZW50OlxcXCJtXFxcIjtjb2xvcjojZjAwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGU6YmVmb3Jle2NvbnRlbnQ6XFxcIkdcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGVwbHVzOmJlZm9yZXtjb250ZW50OlxcXCIrXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ3Vlc3Q6YmVmb3Jle2NvbnRlbnQ6XFxcIj9cXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pZTpiZWZvcmV7Y29udGVudDpcXFwiNlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmxpbmtlZGluOmJlZm9yZXtjb250ZW50OlxcXCJMXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkOmJlZm9yZXtjb250ZW50OlxcXCJvXFxcIjtjb2xvcjojZmY5MjFkfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wYXlwYWw6YmVmb3Jle2NvbnRlbnQ6XFxcIiRcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93OmJlZm9yZXtjb250ZW50OlxcXCJcXFxcMDBFQ1xcXCI7Y29sb3I6I2ZmN2ExNX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudHdpdHRlcjpiZWZvcmV7Y29udGVudDpcXFwiVFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnZrOmJlZm9yZXtjb250ZW50OlxcXCJOXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93czpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnlhaG9vOmJlZm9yZXtjb250ZW50OlxcXCJZXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub2ZmaWNlMzY1OmJlZm9yZXtjb250ZW50OlxcXCJ6XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudGhpcnR5c2V2ZW5zaWduYWxzOmJlZm9yZXtjb250ZW50OlxcXCJiXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZTpiZWZvcmV7Y29udGVudDpcXFwiKlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWQ6YmVmb3Jle2NvbnRlbnQ6XFxcInpcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ib3g6YmVmb3Jle2NvbnRlbnQ6XFxcInhcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hbWF6b257YmFja2dyb3VuZC1jb2xvcjojZmZhZDFkO2NvbG9yOiMwMzAwMzc7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuNSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3h7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiMzMTJjMmF9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZhY2Vib29re2JhY2tncm91bmQtY29sb3I6IzQ4NjNhZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHVie2JhY2tncm91bmQtY29sb3I6I2ZiZmJmYjtjb2xvcjojMDUwNTA1fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbHtiYWNrZ3JvdW5kLWNvbG9yOiNlZmVmZWY7Y29sb3I6IzIyMn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xle2JhY2tncm91bmQtY29sb3I6IzRlNmNmN30jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xlcGx1c3tiYWNrZ3JvdW5kLWNvbG9yOiNkZDRiMzl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmd1ZXN0e2JhY2tncm91bmQtY29sb3I6IzFiNGQ2ZH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuaWV7YmFja2dyb3VuZC1jb2xvcjojMDBhMWQ5fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5saW5rZWRpbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDgzYTh9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZHtiYWNrZ3JvdW5kLWNvbG9yOiNmNWY1ZjU7Y29sb3I6IzMzM30jYXV0aDAtd2lkZ2V0IC56b2NpYWwucGF5cGFse2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojMzI2ODlhO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjUpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC50d2l0dGVye2JhY2tncm91bmQtY29sb3I6IzQ2YzBmYn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudmt7YmFja2dyb3VuZC1jb2xvcjojNDU2ODhlfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dze2JhY2tncm91bmQtY29sb3I6IzAwNTJhNDtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vZmZpY2UzNjV7YmFja2dyb3VuZC1jb2xvcjojMDBhY2VkO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNle2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojZjAwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dze2JhY2tncm91bmQtY29sb3I6IzI2NzJlYztjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7bWFyZ2luOi4xZW0gMDtwYWRkaW5nOjAgMWVtfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5OmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmJlZm9yZXtkaXNwbGF5Om5vbmV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnl7YmFja2dyb3VuZC1jb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjojZjBmMGViO2NvbG9yOiMyMjI7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuOCl9I2F1dGgwLXdpZGdldCBidXR0b246LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MDtwYWRkaW5nOjB9QGZvbnQtZmFjZXtmb250LWZhbWlseTonem9jaWFsJztzcmM6dXJsKCdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9mb250L3pvY2lhbC1yZWd1bGFyLXdlYmZvbnQuZW90Jyl9QGZvbnQtZmFjZXtmb250LWZhbWlseTonem9jaWFsJztzcmM6dXJsKGRhdGE6YXBwbGljYXRpb24vZm9udC13b2ZmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGQwOUdSZ0FCQUFBQUFCZVFBQTBBQUFBQUlHZ0FBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCR1JsUk5BQUFCTUFBQUFCb0FBQUFjWm51QXlrZEVSVVlBQUFGTUFBQUFId0FBQUNBQVRnQUdUMU12TWdBQUFXd0FBQUJJQUFBQVZrL2wzRUJqYldGd0FBQUJ0QUFBQVBZQUFBSUtubDU2N0dkaGMzQUFBQUtzQUFBQUNBQUFBQWovL3dBRFoyeDVaZ0FBQXJRQUFCS0xBQUFac0FNcEpyQm9aV0ZrQUFBVlFBQUFBREFBQUFBMi8zSlNXV2hvWldFQUFCVndBQUFBSUFBQUFDUUZmUUg1YUcxMGVBQUFGWkFBQUFCakFBQUFnRHRPQWJkc2IyTmhBQUFWOUFBQUFFUUFBQUJFV1paZitHMWhlSEFBQUJZNEFBQUFIZ0FBQUNBQWNBQytibUZ0WlFBQUZsZ0FBQURlQUFBQmhsYkQ5L0p3YjNOMEFBQVhPQUFBQUZZQUFBQnNVZW1oaEhpY1kyQmdZR1FBZ3BPZCtZWWcrbHdseHhrWURRQkErUVlxQUFCNG5HTmdaR0JnNEFOaUNRWVFZR0pnWkdCbVVBQ1NMR0FlQXdBRnhBQlZBSGljWTJCa0VtT2N3TURLd01Ib3c1akd3TURnRHFXL01rZ3l0REF3TURHd01qUEFBTE1BQXdJRXBMbW1NRGd3S0g1Z1lIencvd0dESHVOckJ2VUdCZ1pHa0J3QWo2WUxTSGljdFpDOUxrUlJGSVcvTzY3eHp4MkdZUXd6RWxITU5CTXZvQktOcUlRb2lWQktKQkx4TWxTaW1uSm9LR2k4Z3hlUVVDaDF5N28valp1cnRKTzE5MTduN0hXeTF3RUdTTkVnY0NZSXpZS0VoN3k3cnROeU4rMXVsVFU2ZE5sZ2t5MjIyV0dYZlE0NDRwaFR6ampuZ2t1dXJQcjhRb3BmWThXYWRrNnpaODJoTlNmRkduM3JUUjk2MVl1ZTlhUkhQZWhlZlovM2pGdjFkS2NiWGF1amRwUnUycVU0V2hueVViZTNwajFGMUtoUXRlY3lxZm5ZZjhtcGxGUEVsL1ZHTTJUWnpXQTVQbHI4UFRHVTVHRkc0akxLV0VMSG1aaGtLcHVJYXY3RVNqVmpzOGxxU3pEUFF0SHVNOGJjSDc3K0pYNEE2L1k3TndBQUFBQUFBZi8vQUFKNG5KMVllWXdrVjMydTMzdFY3OVY5SDMxM1QvZjBNZE16UGRObnplR1oyV04ydllmdFhYYlhGMnZ2cnRjMnV3N0dEa1pBREFSSTJCQ2hpRmgyaEwxQmNzQUtpY0xoa0VnSlJKRXdSRUZLTE1jUm9CQW5Va0t3RXNGaTVBQVNPSXFUek9UM3FtY2RrdjlJMS9UME82cGV2WHJ2KzMzZjl5c0pKR24zMjBTQ2IwdEVranlZSWRJT1ZuWWs4Wkd4Nzd2d0E3Z21XVkpGNmtqTGtqUU9ob01LNFRaMGdUZVNZVG9jVE5KSk85NXJDRVJEMHNOeXNnbnBhREp1M1B0eWZybnRxTTVidHMvVnJneXYxTTRkdXQrMVoxM2RlY3VodTJjZWV2OTh2QSs0bkhQM3plYTZDbG12d3ZOQmE3MTkrT1RWOUttVGh3NTFXLzFESjU4QzZ4eHgvUGRCb3dBeVNHUjNkL2NhenZkN1VrM2F4Qm1QSmx2QW9qQ3AwQ2hralhxcnplUEVKcUpBVytOa05Ca080aVJ0dFFlYklFcEJqR2M1TUJtUFd1MldhOTFmK3lXblVQWWJTV1YvTkZkZVZHSlB0U0o2Qmw1cVJQa3R1OXJydzBLWlp5MnVkU3gzZE8xMmVBaHJ1V2IvM0ZDeG82SVQ1NUxnck9zQ2t6MFRMakNhQkpIdjNKRlRUZVphTzU5a0ZFLzJadWRYamdVVlNjWjVmNGVjaCs5S2Jla0c2YkIwQ3RkeU5GbUgxbmlVaW5sbkZkNm9RQlRpWWtaaG5JaGkxcE9HTVM3emVOVHVzWGFyMFdKcEJZYnhwRWVZTWg2T2g5RXdha1NOOGRuOXhVaFY5UEgybWNrblpnZTU0bUpnbE94cTdzeVI3WE9yTnl4dXBCUmtsVnVxTDRmQjBxRTZHMVFycy9wd1l4Wm1MdVV2WGNwdkx4d09jNDREQjVlWERoZTBZVzFwMXZZdHJhTEh2VVp2ZXpqdnpmWVhtenBYZEowWmlra1o5UDl6YmczU042MlF5VWhjZnVtU0JCSWdWbjRWL2hoeElxV2pGUGRmUE5NQUY1eG5EOFc0TFRmcXJBdTROZGt4Qm1idTczYjIzYkd2TXpuYUpBcjFhMEVMUUlITndrbEZreTB0T0dYRUMwZTkybUJoWTJOaFVBdnVTcGRVUlZVdFZWYkFzeldUcW1wRG9valJhL0FzNHVFaDZmM1NSd1FpVW9Ua09vZ1YyNEM5U3B6RXlRQ2hHVStQTjZhRFU4U0ppck5qbStDaXN5NTFsTEJDcHBkUHB6bXFSNkVEakRmcTJieDcwRzZsNDNUVTV3SjJJVDRQWjhwa0dDZWpkZ09McXF4cHpySnFNTzZ6U0srRUliV05ZdEQzSXFiSWxLZzJkNnhjR0tadFBXZXFsazBBZ0JDZ2l2aklXSkpsaDNwbEx3Z1gzU0xSWmNXbXByTy9hWEkxb0lTZUF3YktzbTlTbURITUpLZ1NoNnR3TE5RNVZRelZNQ3VXWmlnVVZEVWhqTE5TNlVTdkV0dDN6TWRGbDVQQ2ZGSTA4RjVVVnFtc1UxRlNHTmNVWXVmYlJieTlQZ1NvRnkwVFVlSXl4ejhmZVlmaExxQ0diY3dyREo0a29IWkJONUFUcU1BeEhNOXd2UG4vUm5HMmFvaGpYT2MwYTROczhhTHdaNEF4WGFnM0JKQkoyYk5CR1ZaSXhiTi9SaHpuY29qalFseFd0YmtWS0VSbFZUemZmKzIrUWx6NERuS2VKODFMRWhFY01vVU16cHA2UTI4ZHhnTGZ3MEVaaGdnU25IalUzNEJHSE5MWmNzbjNQTDhNcGRJalcyK1gxWEs4K3NpUjlRUE50d004UHB4eHZXTGU5WGJlQzdmdGZPYkx2dTdsYnY3aVYyKzZaUVZnMmYwc1JzOS9TRzN5Tm5oTWVoSW5NVVd3Z0d5NmhzR083SWF3clRBRTgwaXNGbWx2d2pxdDBqaEJCT0t5Q1NRaXdEZnBlTElsWjFlS3RSNVVJSnUzalh4Tmt6QWJJM3NPZ1dTY2RRUEJURVd2YU1BeHNTb2pLQkRPQ2tjZ0lSY3FCcU5jNFJDV2dGR21NRVp0b2xMTmxYbXphdG1XYmVoY3pnQU14TUxJcEhvdWh5ZXBxcUhvbHNlVndIWjFRbnpOTHlsZ01nYVV5VG8wbzdDQVZ4cTZadW0wM3FTV1puT1RFNW5YN2FDenY1V01sMEdWR1lWM2kzQUFvRVRYUERvL1IxU0Z5ektHeXFxdXRtd21wcUlobXJsdUlwNjlTREZOVFU5VXFzb1dWRWVtbFUwTXlVU21zbE4yY2cwT3J1b3dtV3V5QmpQRm91SEpZdEpLbDNpYUNxVFE0Q2FSWjJiTDIvZFFUM05zeFBsVUY5K0Z1dGhIak9OeXBzaGI0cWNIR3hBUGV3SUR1TDRDOFFpUFNjcTQrRWFoVFhFeEhmZk5oK2NPbXJydHU0dnJ4VnF4NmkvLzJnbDZmTExTV216YTg4MW12bDNadk8zUlEyODlXeUFyZ3paUjFDTTk0bnFyTTQzSytoSFpzOFkzelduSlVsNXgyeVZ2ZFBuODBZVzE2WHl1a2VQSWMvdVI0emJwRm9qN1ZoUU1zRXlERVJhdGJGZXhQQndNcHp0dHk1elZCV0VSM0Y4YmVHbGxma2JWR05OVnk3TTBwbEl2Tk15RmdnVnlySEEvYjY0dUxESTJEalNxajdhT1RvSzRXVTlVN1pRcWVDQ3g0ZTZaVWNtbGdxM3kxVzV6d2Q0M1dlM25ZNllVT2JFUGRxcnlmSmgzdk5HRFo0NHZXaWFTVGdDR2pqUkRUZjI2bDdoR2ZnSG5IeUJ6ckVzbmNGVXhpTFlFVmhQZWd5WEF5ZHRZUno0ZS91KzJBQmU2aW11T0dwNGlxemlBOFAwL2JRMk9iUk4vNlBuNTBpaWUrSXVtN2JscWNYMHc5a2VlVnlpTzRyRy9hRm0rZzIwdmpnTXNadDNPMkIrN1hxRTBiSStEaGF5dHRJWnRJOTh0RmtiVjUzUmtURVdQbm5NOGdoL3plOC9wWmxhM2ZRRk5jK2NIWDdKOVJEOHhqT21wQnFoZjJ1c3p4TGxNazRRK1NZZklWeEJIeC9HWlQrUGU0WTVWeVRDSnl4QUtVZUgxTXN3Z2pYUkpmUU5hNkdZbStQejRIN1dyMVVkVEZjWlZPdVJ0MGJhOENhSVZ6K1JSTTZGdG5pYWNFZ1M2dHZvYkdERmsxV0dnSWJjZmt3RnJ5aTl2SzdKR0tmeVRpQ1JUVy8rNWQwWmNibENza05kbElQZWNuNi9aWklYQTcra1V4MUQrZ1BHTHNpaVV5b1R3eTRBUnd0NGphN0tpaWwzaytKanlmUjhqQnNpVUN4MUo2YzYzNE9JS1daRXliM09OREhGdmM5THQwbVhwbytnQUpvS0NoQXVZeEVKclFUZ3lESll0R0UyRUpLY0NyMTFBVERJdTJzZlRiYThvWlJydTBSWnFHUEpUbXdsNmFrM1ZZemhKTjhtRzBJNWtPa3FtNk5sQ1pxUTJEUU9oSkJ3Vlp4a0krK0NUOTk5RGRjSTFyamtMRDQ1Ty92cUtURDVlcnhibjdDbzNFdG5MVTZLdGFkcDJ6MXFiVVRTVVlPRElZM0tYTWcwNVVDZmxvcC92RE80SVBaVGV5R1FLVkp6Rmw1RHRqTkJYbEVRaG9ZY0JnU1FWRUpab3BtbFFjbGFXajdYUXFWSkxZVnFodkRJa3VCZFBOQWFXcVJDaXpSZ09CTWlLSEEvU1d5QVZ4ZFI4RmhQWFBtZkZPckt1VEp0VWtWR2VIRnJqeW5JYTVvREZXdUs0bG14OUhRZWdDdklXa2pIMSt3N2VXVjcwc0FLNHBTQTQ0akgwUXIrZHhaaVVvamtVYWh5aFNLSlFaU2J4c1JPSCtpZE9jUFBpeFh1L2ViRS9QbjdSdFFZWFgzMDFpOC9kZjkvOUllR29ld2JxWGlRVkphbWR0dE1FSVpid3RnUGpKQzBEVGRJMk1rK1NSdXh0Yi92RTViZCsvUDc3bjc1OGViQjgrY21ucmo2RnM3azBldW4wNmN0MzNubnZtZHZQbnp4Wkw1ZE93aGRnL2R4OXQrMDg4QVU0V2EzaGZUREwySDBGZHVIN09FZDBEemVBMk1kc0c3TWRGeDRyRldLRzlMcG52OUxXbEJBbWdtWW5HUFI4RHgwY2QvNE41dHZiZGp6Q3VmTkxEeXlkbTR1aXVYTllPRDhYZHVjUFJZWmQ4SmNLcG0wb2FwQ3ZibFJEMytYY01nb2xOeDhWb29QZGVjOHJsenR6M2JuNWRxWHNlVis4dkh5K0UwV2Q4LzM3K3hmbXduRHV3cjFIVmxlU3VhcUY5R2VVajdhTGxRWmhub3FHamdFMEtzWDJhaG1saE5pVnVXUjE5Y2FGRG83aStyNWJyclE3RXNzODZzdTRMMjFVazNYcG9IU2o5QUR5WHhobkxyTXhENDJXY0JUNEpCZ1lhRFB3V1pnd1QwTFhiWmhrV1l4d1VYeHFxRm05NVlzU0ZpZ21BT2t3NnFPNFoxNXFpMlNCc0FTak51NS9ZNHk3dm5WMjM3NUZ4SWRwTmdleW8rYXJORmRxVC9LaGJTV2x6ZGh4WXZ4R3hXWVIvejZUYStSeURYczdWeVpPR0RDTzNoWGxGV0lUMlE5cFkybHBzNXpPOUhvenRaNVJjTWhvMWphb3ZPNjY0MVp1enZKRFB6VHFYNnpuY3ZYY0gxbEJZTmxCQUZmRWVMbWRiNzMyMnA4OTdzWTZRMytyeUVNT3dQSDc2SGhwYWVyZlNSZlhaaFl6aHhSWHBiVXBiMEZrSzg0MHI1T3JFUFdVc2VLbFhpQmtyUW84R1dmaUFNWDUwYWhyV2VWK0pXZHk0UlZZc1Q1YjF2VEJ5ZjZzcTRGODFLTkJHQnRHOTVPVDZGaXgrSFF0blMyNUJwQXQ0c2I1SEQ0ZlZ3M2R6MFVXa3VaWUtkU2FqYkw2T2ZqcndVNEh1T0FCMWV2OFlqVXVFc0hoWFBnQmVBSjVuR09FT0lqZUJHT2tLa25ST09FenVBdE5ETEV4Umt2N3A3NFlLcnlOY2RIWitkSHp6eXZQeTE4Mi85eDZPbjQydWIzeHJsbXpPOU90L1MxODdyTi84L1B6eHhmQzdvUHo2Znh2TlMrM3ZwSC9WUDZmK1Yvd0xGWjhTU2NKL0ltMElYMEFJenErbnIra2s3MWpEL3IvYzZBMlhJK0Q2d2ZTWXhMRzZlaU5pNUEySnhWWmpETjhveWtSVm5JNnVxRGY2OWZ1RGJ2Y0Noa3ozVXAzYnJRNlRoZm02enJqS0RGSVJWWStybGFiWVdKYUNsRmRSUWdGTTgwa2J0Y3FVYWpobzlkUklMbEhEWTM3TGxNTXFsTVZiSTF6Ym1BQ3Jkc0tVeWhWd3NoeGZZMkY0R3NBZnIrN2lremY2cUsxZ0FkVjdwZzV5MFpqeWp5dm9xbTZxamtzVU9TVmZuZTJFUnBjK0RqY2VVVnppdk9kMFdBVnMwTFJFS00xNUdGSjhXdzFwNkJnb2FVQlI2YWdtYVdHWVJQQnlTQTdrUnZFcnRha1ZaOUFMWEFSbklyamxiaEdoVjk1UXFyUXkvQjUzT08ydENTVUcrb01jWWZMTys2UFdoaWdmUXk3ekh4bC8wY3R1ZDdLb2pMZSswM2E2WGpTdzh5eHo5djlIbXBkMGs5NG4xV1F0UHBwZ3RkdVFwdmtPd2Q5LzBCbnFlVW1IcHhhNnh6dy9ZT2R0Vk9uZG41NGVEQTQzUC9MN1A5clI0NXcyVS80NWhaUGZNcU9IRUg2UjNSdFlrM21zREpYcjgrVjNtMjRydkhLMnB0RTVmUTdUNzNjejY3TS9tOWN1QUJhWWxIdDlHbU5Xb2wyendVOXRxYzFPMFozcGlDMi93SGorOXVaVDFNbFUzTFJwL1RUaUNkUmU1dzJJd3VpNXZnYitQaytKRHZmeTc1UGxWK0ErSVh5NS85bDdzYzAvK1BPWDAwOW5pbjU4Qk5jczU2MExkMGxQU3hKQWVaSkV3RXBnYkpOd05JYjBPcGwxQjhQNDZ4bkNtVmxnZ2k4ZmtKOTNOb0Q1MkI2cFEzdCtoNGlzM1krbVVLV2gzdEk3WUZKSE0zbmJKOFBjRlNUQTAzVGFPNXV4M2JpZkYwekNIcGdIMkxMMUZITjZWbEhoaWMwRHplZHQ1cDUxK1lJYURWTXFzVVIwUlZGTXduaWRIR203S01vRTZLYXVlYTdaRzdsT24wTFhFTUxabXV1eXVBM05RczgrMU5kQWwvSmFhcE1BMzN0V3RzTHVLcUFxemtpQlRIMFBMWFFWZnpqckJaVHBCUmZDVjJScFJOMEdKNGYrNzhpME9wcE9BNUY3Y2YwRmpNV21aOUdRZGZjQXZOY0pqT3prSE5VdEpLU3N2djY3dC9qUHIyTUhLUWpOeFNrdWlRMUc3eVJEcFBHRXZCWm9Rd0lQVlpuUWxvRVNMTmZtRHR0SEwvejVKMDNGd3NGS0YxOTZlclZsL0xQUFBMSU00Kzg1NGxMbDU2NDlFejcxVmZQM25yck8wVDcxUU9QaUo0TGwwU1B0SGZQZjROL2hhOUxNV3JYRFpoOTNJaVIwQU94NGd3WFBvcWpDbVErTDUxUWhwdVFiVFB1RlBZeTNKdTk2aVI3TjVDWndiYWc5WFFpY241NEpUbldxUlFlZUthb0cvSGpGODY4azBMVWZXM2ZCNW90ZGFIenZoU2MrTVlITlBYV2pjTVBHTlFvd3kySHpteHNkam9IQU42eHZaMC9wcEJtQlQ1ZENTeWR4ZmRleGpTaEJHKytUMWV2M0ZtcjM3VHpoMEYvZGUzS3BOOUlRb2ZxdHg1YmU2dXF2K25HaE1PSmg3NTZ3MXhuSDhDQnVmbEh6ZjBITEJKc29aYUxaMVV6bmY0bWFsRkp1bFc2VDNwUWVsVDZpUFNNOUtjQ3gzUTR0U0hDYmdyYktuSm1FUDVFNUlCWkpyTkpwbkROVHFzUVJLeDQxMmhUZ2RsR1hieENFa2E0bmIxSFNxY3ArM0RjRnY2TVg1ZHpMc2JDQkNBU2RobFp1d3BESWVGNG93MW9CRCtWMmtWaXNHa3dqSktSZUNlTHh0bFd1aUF5ZVNDbTdhRFF4bDZJWGpGQm9UTjExNkdranBsbVl0bVFyK2lhNjRXSzdDSUFaWGRVUm41RjZMRzRQS29HTWZjTVM5RzB2Qmxxa1BOOGRoQzRVZDVmYmpnNXF0WjZ0VnJQUnJwMVNnWFZKT2NjVlQxV3E4b01xa1VhQno2Vlk5ZFVRaTlINVpMQjRhNFZyMkJocENtcTRXazB0Q3lUd21KUXRGWHd3MUJGU3E3blpaeFMyZEZVNWNjYTV0MXhIdk9vcU9hN2hwRlJOUXNuc1Y0cDVkR1NhNUdCOW9HSTVFVms3cDduSCtiY2RXTDJOSFFqQTlqK1htLy8wdXNZT3BvdDd6TVVTN2NvZWZnTW9PYytCa291SHluNUVGV2puSVRvbVdNM1ZqOTZzeE9MT0ZXb2E5ZzZaamtzSDBxWjVuNXc5M1U0QzE5RGZaOUJwR2RPTEVFb283M2FRaHNkNHUvWUc5SHJMN3NpT0hONGN1U1d1ekVqNmpKeXBpcTM1RjVocHRldFZ1RnJwNDZmYnp3ck0rWFRuMVlVZUlIdFN1TnhtdjZkSkZtU3Mvc2EvQWhleERqMjBFVzBNTEkyTUs1T1MzZExiNUhlTHIxWHVpSkpzd0lTTnRUVEVKa3dFNVQybmcrc3Q1VHJqcEMxbXFKWWdlelZkOWFRWm4zcG5rL0VtS3RQMzFHSU9wME9oS1hKdEhNNDRHK1l5OWEwQndzanZxZGdEQTZHbFJpaTh0WElkcUtvR2p3Yk9YWVVsYU9kRjBNMGphSUNRMUdDR0lzZnhwUHdaTWNKRHpwUlhNNjZJOXVPOElRd0tvZjR3VGJidVJwbTdVNzRua29ZVGsrT3NQUndPWXhLNFlkeHhCRFB2UTB2S1VYaGJXNFFsaUljMHc3eE43VHRFR0xiQ1hBbzBWSU9yMkJURkZsT3VQTXc5dVBOd28vaFR5bHNPS0kzZUYxY0VaYVdBeXhYQXRRNVM3b0xYb1dMbUtkV3BhNDBrTll3c2pGU1k4eFVDYWFZZHFZeFFrY21xUFJJYW5GYUlWTnRHVTA0cWhoclQ3Q0tIUlg0ckZyMHVlbWFxbGZFZk5oMjg4MmlaNmd5K1ZDaXg2Tkc4cFBldXBKb3prUWxVREs2ZERXdGZtaXlaclE0YThGRlJDZlQ4YytTbllQMWZqQkRLMkVoWE5qM1l2bkl4cEx5TzcrcmI1K2VkL1htcGp1NzlQdldTTTduVzYxY3pscFMxWjRrL1RjL3RYaVBBSGljWTJCa1lHQUE0cW9vWTU1NGZwdXZETnhNRENCd3JwTGpESXorLy9QL1RlWU14dGRBTGdjRFdCb0FLbGtNS1hpY1kyQmtZR0I4L2Y4bWd4NEx3LytmL3hpWU14aUFJaWhBSGdDazFBWjVlSnhqWW9DQ1ZSQ0s4Uk1EQXhPUVpvb0RzanNZR0JuWEFHa3ZJRi9rL3orbTNQOS9tRXFCYkJDL0hJZ1BBYkVSVUg0UlF6OFQyLzlmSUgyTUQ0QmlXa0I2SXRnY0lSWUdoa2xnOHhnWWVKZ1kvdjhHWWNZcllINERBejhETHdEY0FCVXVBQUFBQUFBQUFBQUFBQTRBV0FDMEFTUUJZQUlZQW9nQ3hBT01BOVFFTkFTd0JTSUY1Z1lFQmpnR3NnZEFCNVFIemdpTUNRSUpKZ25XQ2hBS2hndUlDN29NZGd6WWVKeGpZR1JnWUZCazJNM0F5d0FDVEVETXlBQVNjd0R6R1FBWklnRXZBQUI0bkhXT01Xb0RNUkJGMzlwcmgrQVFVb1dVZ2pScGRwRTJqZkVCOWdBcDNCc2psZ1hiQXRrR255UlZqcEF5eDhnQmNvUWNJOS9yYVZKWU1Pak4xNS81QXU1NHArQjhDbTU0TUI2Slg0ekhQSE15THFWL0drK1k4VzA4bGY0cloxSGVTcmtmcHM0OEVqOFpqMm54eHFYMEQrTUpqM3daVDZYLzBMTW1zVlVsZHRDdjB6WWx3UnVSamlNYlZtUzFzVHR1Vm9KMjhCMkdPOHNSY1RUVVNuTXNWUC8zWGJRNUZVR09TazR2ZXRXYXREdTBLWGZSTmJWM0MyZTVvbmtWZk5YNElOTzF2eTJWbXRuci9aSVJobnlXTWU5NzdRaTF2enI3QndEdk9kTUFBSGljWTJCaXdBOFVnWmlSZ1ltUmlZR2RnWmVCajBHSlFZTkJpMEdmd1pEQm5NR1N3WXJCaHNHRndaUEJuYUdRd1lzaGlLR1V3WlVobWlHV2dZVkJtSUdWSVlLQms0R05JWlM5TkMvVHpjREFBQURwaHdoYUFBQT0pIGZvcm1hdCgnd29mZicpLHVybCgnaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LnR0ZicpIGZvcm1hdCgndHJ1ZXR5cGUnKSx1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ZvbnQvem9jaWFsLXJlZ3VsYXItd2ViZm9udC5zdmcjem9jaWFscmVndWxhcicpIGZvcm1hdCgnc3ZnJyk7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3R5bGU6bm9ybWFsfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hdXRoMDpiZWZvcmV7Y29udGVudDpcXFwiP1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmF1dGgwe2JhY2tncm91bmQtY29sb3I6I2ZmNDUwMDt3aWR0aDphdXRvfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ibG9ja3tkaXNwbGF5OmJsb2NrO21hcmdpbjoxMHB4IDA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztvdmVyZmxvdzpoaWRkZW59I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnksI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXttYXJnaW46MDtwYWRkaW5nOjAgMWVtO2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjQycHh9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnk6YmVmb3JlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6YmVmb3Jle2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtiYWNrZ3JvdW5kLWNvbG9yOiM3NDdlODV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXtiYWNrZ3JvdW5kLWNvbG9yOiNmMGYwZWI7Y29sb3I6IzIyMjt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC44KX0jYXV0aDAtd2lkZ2V0IC56b2NpYWx7LXdlYmtpdC1mb250LXNtb290aGluZzphbnRpYWxpYXNlZH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheXtwb3NpdGlvbjpmaXhlZDtsZWZ0OjA7dG9wOjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtvdmVyZmxvdzpoaWRkZW47ei1pbmRleDo5OTk5O2ZvbnQtd2VpZ2h0OjIwMDstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kOiMwMDA7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLDAuOCk7YmFja2dyb3VuZDotd2Via2l0LXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDotbW96LXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDotbXMtcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsZWxsaXBzZSBjbG9zZXN0LWNvcm5lcixyZ2JhKDAsMCwwLDAuNDUpIDElLHJnYmEoMCwwLDAsMC44KSAxMDAlKTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNpdGlvbjo0MDBtcyBvcGFjaXR5IGVhc2U7LW1vei10cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTt0cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7LW1vei10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1tcy10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1vLXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheS5hY3RpdmV7b3BhY2l0eToxfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHstd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo1MCU7ZGlzcGxheTpub25lfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbC5hY3RpdmV7ZGlzcGxheTpibG9jazstd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjo0MDBtczstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZTstd2Via2l0LWFuaW1hdGlvbi1uYW1lOnNob3dQYW5lbH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFuZWx7LXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb246NDAwbXM7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2U7LXdlYmtpdC1hbmltYXRpb24tbmFtZTpoaWRlUGFuZWw7d2lkdGg6MjgwcHg7bWFyZ2luOjAgMCAwIC0xNDBweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAuZW1haWx7bWFyZ2luLWJvdHRvbToxNHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbToxNHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5lbWFpbC1yZWFkb25seXt0ZXh0LWFsaWduOmNlbnRlcjtkaXNwbGF5OmluaGVyaXQ7Y29sb3I6IzQxNDQ0YTtmb250LXdlaWdodDpib2xkO21hcmdpbi1ib3R0b206MjVweH0jYXV0aDAtd2lkZ2V0IC5wYW5lbCAuc2lnbnVwIC5oZWFkZXIsI2F1dGgwLXdpZGdldCAucGFuZWwgLnJlc2V0IC5oZWFkZXJ7bWFyZ2luLWJvdHRvbToxNXB4O2ZvbnQtc2l6ZToxNHB4O2NvbG9yOiM0MTQ0NGF9I2F1dGgwLXdpZGdldCAucGFuZWwgLnNpZ251cCAuZm9vdGVye21hcmdpbi1ib3R0b206MTVweDtmb250LXNpemU6MTJweDtjb2xvcjojNDE0NDRhO3RleHQtYWxpZ246bGVmdDttYXJnaW4tdG9wOjEwcHh9QC1tb3ota2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC13ZWJraXQta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1vLWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbXMta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QGtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbW96LWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1vLWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW1zLWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1Aa2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbHtiYWNrZ3JvdW5kOiNmYWZhZmE7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7ei1pbmRleDoxMDstbW96LWJveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTstd2Via2l0LWJveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTtib3gtc2hhZG93OjAgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4yKSwwIDEwcHggMjdweCByZ2JhKDAsMCwwLDAuNyk7LW1vei1ib3JkZXItcmFkaXVzOjZweDstd2Via2l0LWJvcmRlci1yYWRpdXM6NnB4O2JvcmRlci1yYWRpdXM6NnB4Oy13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbDphZnRlcntjb250ZW50OlxcXCJcXFwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtyaWdodDowO3RvcDowO2JvdHRvbTowO3otaW5kZXg6MTstbW96LWJveC1zaGFkb3c6aW5zZXQgMCAtMXB4IDJweCByZ2JhKDgyLDkzLDExMiwwLjQpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCk7Ym94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO21pbi1oZWlnaHQ6NjVweDtvdmVyZmxvdzpoaWRkZW47LW1vei1ib3JkZXItcmFkaXVzOjZweCA2cHggMCAwOy13ZWJraXQtYm9yZGVyLXJhZGl1czo2cHggNnB4IDAgMDtib3JkZXItcmFkaXVzOjZweCA2cHggMCAwO2JhY2tncm91bmQ6I2YxZjRmNjtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtib3JkZXItYm90dG9tOjFweCBzb2xpZCByZ2JhKDQwLDY5LDg1LDAuMTEpfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXI6YmVmb3Jle2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjVweDtib3R0b206LTFweDtsZWZ0OjA7cmlnaHQ6MDtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcjphZnRlcntjb250ZW50OicnO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDo0cHg7Ym90dG9tOjA7bGVmdDowO3JpZ2h0OjA7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MjFweCAyMHB4O21hcmdpbjowO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM0MTQ0NGE7Zm9udC13ZWlnaHQ6Ym9sZDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGRlM2U2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYXtkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbjt0ZXh0LWluZGVudDoyMDAlO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEycHg7b3BhY2l0eTouNDtwYWRkaW5nOjVweDt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhOmhvdmVye29wYWNpdHk6LjY2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYTphY3RpdmV7b3BhY2l0eToxfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtoZWlnaHQ6MTJweDtiYWNrZ3JvdW5kOnVybChcXFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvaW1nL2Nsb3NlLnBuZ1xcXCIpIDUwJSA1MCUgbm8tcmVwZWF0O2JhY2tncm91bmQtc2l6ZToxMnB4IDEycHg7cmlnaHQ6MTlweDt0b3A6MjFweDtjdXJzb3I6cG9pbnRlcn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGEuY2xvc2U6aG92ZXJ7b3BhY2l0eTouNjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBpbWd7aGVpZ2h0OjMycHg7bWFyZ2luOjE2cHggMTBweCAxMHB4IDIwcHg7cG9zaXRpb246cmVsYXRpdmU7ZmxvYXQ6bGVmdH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gLnNwaW5uZXJ7d2lkdGg6MTAwJTtiYWNrZ3JvdW5kLWNvbG9yOiM2YTc3N2Y7YmFja2dyb3VuZC1pbWFnZTp1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ltZy9zcGlubmVyLmdpZicpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlcjttYXJnaW46MDtoZWlnaHQ6NDRweDtib3JkZXI6MXB4IHNvbGlkICM3Nzc7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4yKTtib3JkZXItYm90dG9tLWNvbG9yOiMzMzM7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNCk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy1tb3otdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lOy1tb3otYm9yZGVyLXJhZGl1czouM2VtOy13ZWJraXQtYm9yZGVyLXJhZGl1czouM2VtO2JvcmRlci1yYWRpdXM6LjNlbX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgZm9vdGVye2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7LW1vei1ib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czowIDAgNXB4IDVweDtib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4O2hlaWdodDoyNXB4O2xpbmUtaGVpZ2h0OjI1cHg7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbjowIDE1cHg7Ym9yZGVyLXRvcDoxcHggc29saWQgI2RkZTNlNjt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBzcGFue2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiM2NjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBhe2ZvbnQtc2l6ZTo5cHg7Y29sb3I6IzMzMztmb250LXdlaWdodDpib2xkO3RleHQtZGVjb3JhdGlvbjpub25lO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxpc3QsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3R7bWFyZ2luOjI1cHggMDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAubGlzdDphZnRlciwjYXV0aDAtd2lkZ2V0IC5pY29ubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7ZGlzcGxheTp0YWJsZTtjb250ZW50OlxcXCJcXFwifSNhdXRoMC13aWRnZXQgLmxpc3Q6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7Y2xlYXI6Ym90aH0jYXV0aDAtd2lkZ2V0IC5saXN0IHNwYW57ZGlzcGxheTpibG9jazttYXJnaW46MTBweCAwO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0e3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0IHNwYW57bWFyZ2luOjAgMnB4fSNhdXRoMC13aWRnZXQgLmZvcmdvdC1wYXNze2ZvbnQtc2l6ZToxMnB4O2NvbG9yOiM2NjY7Zm9udC13ZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50e2Rpc3BsYXk6bm9uZTttYXJnaW4tdG9wOjIwcHg7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuY3JlYXRlLWFjY291bnQgYXtmb250LXNpemU6MTJweDtjb2xvcjojNmQ2ZDZkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50IGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZX0jYXV0aDAtd2lkZ2V0IC5sb2dnZWRpbiBzcGFuLmNlbnRlcmVkLmFsbHtjb2xvcjojMDA4Y2RkO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWR7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtkaXNwbGF5OmJsb2NrfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWQuYWxsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2Vse2NvbG9yOiMwMDhjZGQ7Y3Vyc29yOnBvaW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2VsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NXB4IDA7bWFyZ2luOjE1cHggMCA1cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTpibG9ja30jYXV0aDAtd2lkZ2V0IGZvcm17bWFyZ2luOjMwcHghaW1wb3J0YW50O21hcmdpbi1ib3R0b206MjJweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCBmb3JtIGxhYmVse2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gaW5wdXR7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7Zm9udC1zaXplOjE4cHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyOjFweCBzb2xpZCAjYjRiZWNkO2JvcmRlci10b3AtY29sb3I6I2IwYmFjYTtib3JkZXItYm90dG9tLWNvbG9yOiNkM2Q5ZTI7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwxMzcsMTUwLDAuMjMpLDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpOy1tb3otYm9yZGVyLXJhZGl1czo0cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjRweDtib3JkZXItcmFkaXVzOjRweDtjb2xvcjpibGFjazttYXJnaW46MDtmb250LWZhbWlseTonSGVsdmV0aWNhIE5ldWUnLEhlbHZldGljYSxBcmlhbCBHZW5ldmEsc2Fucy1zZXJpZn0jYXV0aDAtd2lkZ2V0IC5wbGFjZWhvbGRlcntjb2xvcjojY2NjfSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dDpmb2N1c3tib3JkZXItY29sb3I6IzU2OTVkYiAjNzBhN2U0ICM4OWI4ZWMgIzcwYTdlNDtvdXRsaW5lOjA7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRiOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSg3MCwxMjMsMTgxLDAuMzUpLDAgMCA0cHggIzU2OTVkYjtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRifSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCBpbnB1dHtvdXRsaW5lOjA7Ym9yZGVyLWNvbG9yOiNmZjcwNzY7Ym9yZGVyLXRvcC1jb2xvcjojZmY1YzYxOy1tb3otYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yKSwwIDAgNHB4IDAgcmdiYSgyNTUsMCwwLDAuNSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KX0jYXV0aDAtd2lkZ2V0IGhlYWRlciAuZXJyb3J7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiNiOTUzNTM7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBoZWFkZXIgLnN1Y2Nlc3N7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiMwZmFkMjk7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBmb3JtIC5ub3Rle2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gLm5vdGUgYXtjb2xvcjojMDA4Y2RkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCAuZXJyb3J7dmlzaWJpbGl0eTp2aXNpYmxlfSNhdXRoMC13aWRnZXQgZm9ybSBidXR0b257ZGlzcGxheTpibG9jazttYXJnaW46MjBweCAwIDAgMDtjdXJzb3I6cG9pbnRlcjt3aWR0aDoxMDAlfSNhdXRoMC13aWRnZXQgLmFjdGlvbnt0ZXh0LWFsaWduOnJpZ2h0O21hcmdpbjowIDMwcHggMzBweCAzMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NX0jYXV0aDAtd2lkZ2V0IGZvcm0gLmFjdGlvbnttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gYnV0dG9ue3dpZHRoOmF1dG99I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9ye3Bvc2l0aW9uOnJlbGF0aXZlO3RleHQtYWxpZ246Y2VudGVyO21hcmdpbjowIDAgMjVweCAwfSNhdXRoMC13aWRnZXQgLnNlcGFyYXRvcjpiZWZvcmV7Y29udGVudDpcXFwiXFxcIjtkaXNwbGF5OmJsb2NrO2JvcmRlci10b3A6MXB4IHNvbGlkICM3Zjg4OTk7d2lkdGg6MjAwcHg7bGVmdDo1MCU7bWFyZ2luLWxlZnQ6LTEwMHB4O2hlaWdodDoxcHg7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt6LWluZGV4OjF9I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9yIHNwYW57YmFja2dyb3VuZDojZmFmYWZhO3BhZGRpbmc6MCAxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NTtjb2xvcjojN2Y4ODk5O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZX0jYXV0aDAtd2lkZ2V0IHNwYW4uYmFja3tkaXNwbGF5OmJsb2NrO2NvbG9yOiMwMDhjZGQ7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtjdXJzb3I6cG9pbnRlcjtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjU7b3V0bGluZTowfSNhdXRoMC13aWRnZXQgc3Bhbi5iYWNrOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbmluIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0IC5lbWFpbHtkaXNwbGF5OmJsb2NrO2NvbG9yOiM3Zjg4OTk7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW46MCAwIDdweCAwO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGU7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NTpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NXtiYWNrZ3JvdW5kLWNvbG9yOiMwMGFjZWQ7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2FhZDpiZWZvcmV7Y29udGVudDpcXFwielxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsczpiZWZvcmV7Y29udGVudDpcXFwiYlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94OmJlZm9yZXtjb250ZW50OlxcXCJ4XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmJlZm9yZXtjb250ZW50OlxcXCIqXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6I2YwMH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93c3tiYWNrZ3JvdW5kLWNvbG9yOiMyNjcyZWM7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0OmJlZm9yZXtjb250ZW50OlxcXCIjXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0e2JhY2tncm91bmQtY29sb3I6IzQ1YzJjNTtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXg6YmVmb3Jle2NvbnRlbnQ6XFxcIiZcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXh7YmFja2dyb3VuZC1jb2xvcjojZjAwO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbjpiZWZvcmV7Y29udGVudDpcXFwiclxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDU2YjU7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYmFpZHU6YmVmb3Jle2NvbnRlbnQ6XFxcInVcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5iYWlkdXtiYWNrZ3JvdW5kLWNvbG9yOiMyODMyZTE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAub25lc3RlcHt3aWR0aDozNDVweDttYXJnaW46MCAwIDAgLTE3MnB4fUBtZWRpYShtYXgtd2lkdGg6MjgwcHgpeyNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHt3aWR0aDoyNDBweDttYXJnaW46MCAwIDAgLTEyMHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjEycHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxMnB4fSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dHtwYWRkaW5nOjVweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVye21hcmdpbjowO3BhZGRpbmc6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTRweCAxNnB4O21hcmdpbjowO2ZvbnQtc2l6ZToyMnB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtyaWdodDoxNHB4O3RvcDoxNnB4fX1AbWVkaWEobWluLXdpZHRoOjI4MXB4KSBhbmQgKG1heC13aWR0aDozNDBweCl7I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVse21hcmdpbjowO2xlZnQ6MDtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAuem9jaWFsLCNhdXRoMC13aWRnZXQgLnBvcHVwIGEuem9jaWFse2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjE1cHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxNXB4IDI1cHh9I2F1dGgwLXdpZGdldCBmb3JtIGlucHV0e3BhZGRpbmc6NnB4O2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXJ7bWFyZ2luOjA7cGFkZGluZzowO21pbi1oZWlnaHQ6MzJweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTJweCAxNnB4O21hcmdpbi10b3A6MXB4O2ZvbnQtc2l6ZToyMHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaW1ne2hlaWdodDozMnB4O21hcmdpbjo5cHggMTBweCA2cHggMThweH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtsaW5lLWhlaWdodDozNHB4fSNhdXRoMC13aWRnZXQgLmFjdGlvbiAuc3Bpbm5lcntoZWlnaHQ6MzRweH0jYXV0aDAtd2lkZ2V0IC5jcmVhdGUtYWNjb3VudHttYXJnaW4tdG9wOjIwcHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLmVtYWlse21hcmdpbi1ib3R0b206NXB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbTo1cHh9fSNhdXRoMC13aWRnZXQgLmxvYWRpbmd7ZGlzcGxheTpub25lO2JvcmRlcjowO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpmaXhlZDt2aXNpYmlsaXR5OnZpc2libGU7bWFyZ2luOjA7cGFkZGluZzowO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3otaW5kZXg6MTAwMDAwO2ZvbnQtd2VpZ2h0OjIwMDstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC41KX0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5tZXNzYWdle3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bWFyZ2luLXRvcDotMTEwcHg7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MjJweDtmb250LWZhbWlseTpIZWx2ZXRpY2EsYXJpYWwsZnJlZXNhbnMsY2xlYW4sc2Fucy1zZXJpZjtjb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxze3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NTAlO3RvcDo1MCU7bWFyZ2luLWxlZnQ6LTQ1cHg7bWFyZ2luLXRvcDotNDVweDt3aWR0aDo5MHB4O2hlaWdodDo5MHB4fSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzPmRpdntwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo4NnB4O2hlaWdodDo4NnB4O29wYWNpdHk6MDstbW96LXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstbW96LWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstd2Via2l0LWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTstbXMtdHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpOy1tcy1hbmltYXRpb246b3JiaXQgNy4xNXMgaW5maW5pdGU7LW8tdHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpOy1vLWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTt0cmFuc2Zvcm06cm90YXRlKDIyNWRlZyk7YW5pbWF0aW9uOm9yYml0IDcuMTVzIGluZmluaXRlfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzPmRpdj5kaXZ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTFweDtoZWlnaHQ6MTFweDtiYWNrZ3JvdW5kOiMzMzM7bGVmdDowO3RvcDowOy1tb3otYm9yZGVyLXJhZGl1czoxMXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoxMXB4Oy1tcy1ib3JkZXItcmFkaXVzOjExcHg7LW8tYm9yZGVyLXJhZGl1czoxMXB4O2JvcmRlci1yYWRpdXM6MTFweH0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDAxey1tb3otYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy1tcy1hbmltYXRpb24tZGVsYXk6MS41NnM7LW8tYW5pbWF0aW9uLWRlbGF5OjEuNTZzO2FuaW1hdGlvbi1kZWxheToxLjU2c30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDAyey1tb3otYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LjMxczstbXMtYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LW8tYW5pbWF0aW9uLWRlbGF5Oi4zMXM7YW5pbWF0aW9uLWRlbGF5Oi4zMXN9I2F1dGgwLXdpZGdldCAubG9hZGluZyAuYmFsbHMgLmJhbGwwM3stbW96LWFuaW1hdGlvbi1kZWxheTouNjJzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi42MnM7LW1zLWFuaW1hdGlvbi1kZWxheTouNjJzOy1vLWFuaW1hdGlvbi1kZWxheTouNjJzO2FuaW1hdGlvbi1kZWxheTouNjJzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDR7LW1vei1hbmltYXRpb24tZGVsYXk6Ljk0czstd2Via2l0LWFuaW1hdGlvbi1kZWxheTouOTRzOy1tcy1hbmltYXRpb24tZGVsYXk6Ljk0czstby1hbmltYXRpb24tZGVsYXk6Ljk0czthbmltYXRpb24tZGVsYXk6Ljk0c30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDA1ey1tb3otYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy1tcy1hbmltYXRpb24tZGVsYXk6MS4yNXM7LW8tYW5pbWF0aW9uLWRlbGF5OjEuMjVzO2FuaW1hdGlvbi1kZWxheToxLjI1c31ALW1vei1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW1vei10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tb3otb3JpZ2luOjB9MzAle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW1vei1vcmlnaW46NyV9Mzkle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tb3otb3JpZ2luOjMwJX03MCV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbW96LW9yaWdpbjozOSV9NzUle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW1vei1vcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LXdlYmtpdC1vcmlnaW46MH0zMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstd2Via2l0LW9yaWdpbjo3JX0zOSV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LXdlYmtpdC1vcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy13ZWJraXQtb3JpZ2luOjM5JX03NSV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstd2Via2l0LW9yaWdpbjo3MCV9NzYle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC1tcy1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1zLW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstbXMtb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1zLW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1tcy1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbXMtb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1tcy10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC1vLWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstby10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1vLW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW8tb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1vLW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstby1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW8tb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1vLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstby10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUBrZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7dHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjtvcmlnaW46MH0zMCV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0O29yaWdpbjo3JX0zOSV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjtvcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7b3JpZ2luOjM5JX03NSV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0O29yaWdpbjo3MCV9NzYle29wYWNpdHk6MDt0cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX0jYXV0aDAtd2lkZ2V0IGlucHV0W2Rpc2FibGVkXXtiYWNrZ3JvdW5kLWNvbG9yOiNkOWRlZTB9I2F1dGgwLXdpZGdldCBhcnRpY2xlLCNhdXRoMC13aWRnZXQgYXNpZGUsI2F1dGgwLXdpZGdldCBkZXRhaWxzLCNhdXRoMC13aWRnZXQgZmlnY2FwdGlvbiwjYXV0aDAtd2lkZ2V0IGZpZ3VyZSwjYXV0aDAtd2lkZ2V0IGZvb3RlciwjYXV0aDAtd2lkZ2V0IGhlYWRlciwjYXV0aDAtd2lkZ2V0IGhncm91cCwjYXV0aDAtd2lkZ2V0IG5hdiwjYXV0aDAtd2lkZ2V0IHNlY3Rpb24sI2F1dGgwLXdpZGdldCBzdW1tYXJ5e2Rpc3BsYXk6YmxvY2t9I2F1dGgwLXdpZGdldCBhdWRpbywjYXV0aDAtd2lkZ2V0IGNhbnZhcywjYXV0aDAtd2lkZ2V0IHZpZGVve2Rpc3BsYXk6aW5saW5lLWJsb2NrOypkaXNwbGF5OmlubGluZTsqem9vbToxfSNhdXRoMC13aWRnZXQgYXVkaW86bm90KFtjb250cm9sc10pe2Rpc3BsYXk6bm9uZTtoZWlnaHQ6MH0jYXV0aDAtd2lkZ2V0IFtoaWRkZW5de2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IGh0bWx7Zm9udC1zaXplOjEwMCU7LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OjEwMCU7LW1zLXRleHQtc2l6ZS1hZGp1c3Q6MTAwJX0jYXV0aDAtd2lkZ2V0IGh0bWwsI2F1dGgwLXdpZGdldCBidXR0b24sI2F1dGgwLXdpZGdldCBpbnB1dCwjYXV0aDAtd2lkZ2V0IHNlbGVjdCwjYXV0aDAtd2lkZ2V0IHRleHRhcmVhLCNhdXRoMC13aWRnZXQgaDEsI2F1dGgwLXdpZGdldCBoMiwjYXV0aDAtd2lkZ2V0IGRpdiwjYXV0aDAtd2lkZ2V0IHNwYW4sI2F1dGgwLXdpZGdldCBhe2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWZ9I2F1dGgwLXdpZGdldCBib2R5e21hcmdpbjowfSNhdXRoMC13aWRnZXQgYTpmb2N1c3tvdXRsaW5lOnRoaW4gZG90dGVkfSNhdXRoMC13aWRnZXQgYTphY3RpdmUsI2F1dGgwLXdpZGdldCBhOmhvdmVye291dGxpbmU6MH0jYXV0aDAtd2lkZ2V0IGgxe2ZvbnQtc2l6ZToyZW07bWFyZ2luOi42N2VtIDB9I2F1dGgwLXdpZGdldCBoMntmb250LXNpemU6MS41ZW07bWFyZ2luOi44M2VtIDB9I2F1dGgwLXdpZGdldCBoM3tmb250LXNpemU6MS4xN2VtO21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGg0e2ZvbnQtc2l6ZToxZW07bWFyZ2luOjEuMzNlbSAwfSNhdXRoMC13aWRnZXQgaDV7Zm9udC1zaXplOi44M2VtO21hcmdpbjoxLjY3ZW0gMH0jYXV0aDAtd2lkZ2V0IGg2e2ZvbnQtc2l6ZTouNzVlbTttYXJnaW46Mi4zM2VtIDB9I2F1dGgwLXdpZGdldCBhYmJyW3RpdGxlXXtib3JkZXItYm90dG9tOjFweCBkb3R0ZWR9I2F1dGgwLXdpZGdldCBiLCNhdXRoMC13aWRnZXQgc3Ryb25ne2ZvbnQtd2VpZ2h0OmJvbGR9I2F1dGgwLXdpZGdldCBibG9ja3F1b3Rle21hcmdpbjoxZW0gNDBweH0jYXV0aDAtd2lkZ2V0IGRmbntmb250LXN0eWxlOml0YWxpY30jYXV0aDAtd2lkZ2V0IG1hcmt7YmFja2dyb3VuZDojZmYwO2NvbG9yOiMwMDB9I2F1dGgwLXdpZGdldCBwLCNhdXRoMC13aWRnZXQgcHJle21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGNvZGUsI2F1dGgwLXdpZGdldCBrYmQsI2F1dGgwLXdpZGdldCBwcmUsI2F1dGgwLXdpZGdldCBzYW1we2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtfZm9udC1mYW1pbHk6J2NvdXJpZXIgbmV3Jyxtb25vc3BhY2U7Zm9udC1zaXplOjFlbX0jYXV0aDAtd2lkZ2V0IHByZXt3aGl0ZS1zcGFjZTpwcmU7d2hpdGUtc3BhY2U6cHJlLXdyYXA7d29yZC13cmFwOmJyZWFrLXdvcmR9I2F1dGgwLXdpZGdldCBxe3F1b3Rlczpub25lfSNhdXRoMC13aWRnZXQgcTpiZWZvcmUsI2F1dGgwLXdpZGdldCBxOmFmdGVye2NvbnRlbnQ6Jyc7Y29udGVudDpub25lfSNhdXRoMC13aWRnZXQgc21hbGx7Zm9udC1zaXplOjgwJX0jYXV0aDAtd2lkZ2V0IHN1YiwjYXV0aDAtd2lkZ2V0IHN1cHtmb250LXNpemU6NzUlO2xpbmUtaGVpZ2h0OjA7cG9zaXRpb246cmVsYXRpdmU7dmVydGljYWwtYWxpZ246YmFzZWxpbmV9I2F1dGgwLXdpZGdldCBzdXB7dG9wOi0wLjVlbX0jYXV0aDAtd2lkZ2V0IHN1Yntib3R0b206LTAuMjVlbX0jYXV0aDAtd2lkZ2V0IGRsLCNhdXRoMC13aWRnZXQgbWVudSwjYXV0aDAtd2lkZ2V0IG9sLCNhdXRoMC13aWRnZXQgdWx7bWFyZ2luOjFlbSAwfSNhdXRoMC13aWRnZXQgZGR7bWFyZ2luOjAgMCAwIDQwcHh9I2F1dGgwLXdpZGdldCBtZW51LCNhdXRoMC13aWRnZXQgb2wsI2F1dGgwLXdpZGdldCB1bHtwYWRkaW5nOjAgMCAwIDQwcHh9I2F1dGgwLXdpZGdldCBuYXYgdWwsI2F1dGgwLXdpZGdldCBuYXYgb2x7bGlzdC1zdHlsZTpub25lO2xpc3Qtc3R5bGUtaW1hZ2U6bm9uZX0jYXV0aDAtd2lkZ2V0IGltZ3tib3JkZXI6MDstbXMtaW50ZXJwb2xhdGlvbi1tb2RlOmJpY3ViaWN9I2F1dGgwLXdpZGdldCBzdmc6bm90KDpyb290KXtvdmVyZmxvdzpoaWRkZW59I2F1dGgwLXdpZGdldCBmaWd1cmV7bWFyZ2luOjB9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjowfSNhdXRoMC13aWRnZXQgZmllbGRzZXR7Ym9yZGVyOjFweCBzb2xpZCAjYzBjMGMwO21hcmdpbjowIDJweDtwYWRkaW5nOi4zNWVtIC42MjVlbSAuNzVlbX0jYXV0aDAtd2lkZ2V0IGxlZ2VuZHtib3JkZXI6MDtwYWRkaW5nOjA7d2hpdGUtc3BhY2U6bm9ybWFsOyptYXJnaW4tbGVmdDotN3B4fSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXQsI2F1dGgwLXdpZGdldCBzZWxlY3QsI2F1dGgwLXdpZGdldCB0ZXh0YXJlYXtmb250LXNpemU6MTAwJTttYXJnaW46MDt2ZXJ0aWNhbC1hbGlnbjpiYXNlbGluZTsqdmVydGljYWwtYWxpZ246bWlkZGxlfSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXR7bGluZS1oZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaHRtbCBpbnB1dFt0eXBlPVxcXCJidXR0b25cXFwiXSwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInJlc2V0XFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzdWJtaXRcXFwiXXstd2Via2l0LWFwcGVhcmFuY2U6YnV0dG9uO2N1cnNvcjpwb2ludGVyOypvdmVyZmxvdzp2aXNpYmxlfSNhdXRoMC13aWRnZXQgYnV0dG9uW2Rpc2FibGVkXSwjYXV0aDAtd2lkZ2V0IGlucHV0W2Rpc2FibGVkXXtjdXJzb3I6ZGVmYXVsdH0jYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJde2JveC1zaXppbmc6Ym9yZGVyLWJveDtwYWRkaW5nOjA7KmhlaWdodDoxM3B4Oyp3aWR0aDoxM3B4fSNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl17LXdlYmtpdC1hcHBlYXJhbmNlOnRleHRmaWVsZDstbW96LWJveC1zaXppbmc6Y29udGVudC1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O2JveC1zaXppbmc6Y29udGVudC1ib3h9I2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uey13ZWJraXQtYXBwZWFyYW5jZTpub25lfSNhdXRoMC13aWRnZXQgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLCNhdXRoMC13aWRnZXQgaW5wdXQ6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjA7cGFkZGluZzowfSNhdXRoMC13aWRnZXQgdGV4dGFyZWF7b3ZlcmZsb3c6YXV0bzt2ZXJ0aWNhbC1hbGlnbjp0b3B9I2F1dGgwLXdpZGdldCB0YWJsZXtib3JkZXItY29sbGFwc2U6Y29sbGFwc2U7Ym9yZGVyLXNwYWNpbmc6MH1cIik7XG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aDBXaWRnZXQgPSBBdXRoMFdpZGdldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMFdpZGdldDtcbiIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9O3ZhciBhc3NlcnRfcmVxdWlyZWQgICA9IHJlcXVpcmUoJy4vbGliL2Fzc2VydF9yZXF1aXJlZCcpO1xudmFyIGJhc2U2NF91cmxfZGVjb2RlID0gcmVxdWlyZSgnLi9saWIvYmFzZTY0X3VybF9kZWNvZGUnKTtcbnZhciBxcyAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ3FzJyk7XG52YXIgcmVxd2VzdCAgICAgICAgICAgPSByZXF1aXJlKCdyZXF3ZXN0Jyk7XG5cbnZhciBqc29ucCAgICAgICAgICAgICA9IHJlcXVpcmUoJ2pzb25wJyk7XG5cbnZhciB1c2VfanNvbnAgICAgICAgICA9IHJlcXVpcmUoJy4vbGliL3VzZV9qc29ucCcpO1xudmFyIExvZ2luRXJyb3IgICAgICAgID0gcmVxdWlyZSgnLi9saWIvTG9naW5FcnJvcicpO1xudmFyIGpzb25fcGFyc2UgICAgICAgID0gcmVxdWlyZSgnLi9saWIvanNvbl9wYXJzZScpO1xuXG5mdW5jdGlvbiBBdXRoMCAob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQXV0aDApKSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoMChvcHRpb25zKTtcbiAgfVxuXG4gIGFzc2VydF9yZXF1aXJlZChvcHRpb25zLCAnY2xpZW50SUQnKTtcbiAgYXNzZXJ0X3JlcXVpcmVkKG9wdGlvbnMsICdjYWxsYmFja1VSTCcpO1xuICBhc3NlcnRfcmVxdWlyZWQob3B0aW9ucywgJ2RvbWFpbicpO1xuXG4gIHRoaXMuX2NsaWVudElEID0gb3B0aW9ucy5jbGllbnRJRDtcbiAgdGhpcy5fY2FsbGJhY2tVUkwgPSBvcHRpb25zLmNhbGxiYWNrVVJMO1xuICB0aGlzLl9kb21haW4gPSBvcHRpb25zLmRvbWFpbjtcbiAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgIHRoaXMucGFyc2VIYXNoKG9wdGlvbnMuc3VjY2Vzcyk7XG4gIH1cbiAgdGhpcy5fZmFpbHVyZSA9IG9wdGlvbnMuZmFpbHVyZTtcbn1cblxuQXV0aDAucHJvdG90eXBlLl9yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgZ2xvYmFsLndpbmRvdy5sb2NhdGlvbiA9IHVybDtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5fcmVuZGVyQW5kU3VibWl0V1NGZWRGb3JtID0gZnVuY3Rpb24gKGZvcm1IdG1sKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGZvcm1IdG1sO1xuICB2YXIgZm9ybSA9IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KS5jaGlsZHJlblswXTtcbiAgZm9ybS5zdWJtaXQoKTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5wYXJzZUhhc2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYoIXdpbmRvdy5sb2NhdGlvbi5oYXNoLm1hdGNoKC9hY2Nlc3NfdG9rZW4vKSkgcmV0dXJuO1xuICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgdmFyIHBhcnNlZF9xcyA9IHFzLnBhcnNlKGhhc2gpO1xuICB2YXIgaWRfdG9rZW4gPSBwYXJzZWRfcXMuaWRfdG9rZW47XG4gIHZhciBlbmNvZGVkID0gaWRfdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgdmFyIHByb2YgPSBqc29uX3BhcnNlKGJhc2U2NF91cmxfZGVjb2RlKGVuY29kZWQpKTtcbiAgY2FsbGJhY2socHJvZiwgaWRfdG9rZW4sIHBhcnNlZF9xcy5hY2Nlc3NfdG9rZW4sIHBhcnNlZF9xcy5zdGF0ZSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuc2lnbnVwID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgcXVlcnkuZW1haWwgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWw7XG4gIHF1ZXJ5LnBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZDtcblxuICBxdWVyeS50ZW5hbnQgPSB0aGlzLl9kb21haW4uc3BsaXQoJy4nKVswXTtcblxuICBmdW5jdGlvbiBzdWNjZXNzICgpIHtcbiAgICBpZiAoJ2F1dG9fbG9naW4nIGluIG9wdGlvbnMgJiYgIW9wdGlvbnMuYXV0b19sb2dpbikge1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmxvZ2luKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWwgKHN0YXR1cywgcmVzcCkge1xuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHN0YXR1cywgcmVzcCk7XG4gICAgaWYgKGNhbGxiYWNrKSAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgaWYgKHNlbGYuX2ZhaWx1cmUpIHJldHVybiBzZWxmLl9mYWlsdXJlKGVycm9yKTtcbiAgfVxuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL3NpZ251cD8nICsgcXMuc3RyaW5naWZ5KHF1ZXJ5KSwge1xuICAgICAgcGFyYW06ICdjYngnLFxuICAgICAgdGltZW91dDogMTUwMDBcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBmYWlsKDAsIGVycik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcC5zdGF0dXMgPT0gMjAwID9cbiAgICAgICAgICAgICAgc3VjY2VzcygpIDpcbiAgICAgICAgICAgICAgZmFpbChyZXNwLnN0YXR1cywgcmVzcC5lcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxd2VzdCh7XG4gICAgdXJsOiAgICAgJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9zaWdudXAnLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICBjcm9zc09yaWdpbjogdHJ1ZVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBmYWlsKGVyci5zdGF0dXMsIGVyci5yZXNwb25zZVRleHQpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBxdWVyeSA9IHtcbiAgICB0ZW5hbnQ6ICAgICAgICAgdGhpcy5fZG9tYWluLnNwbGl0KCcuJylbMF0sXG4gICAgY29ubmVjdGlvbjogICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICBlbWFpbDogICAgICAgICAgb3B0aW9ucy51c2VybmFtZSB8fCBvcHRpb25zLmVtYWlsLFxuICAgIHBhc3N3b3JkOiAgICAgICBvcHRpb25zLnBhc3N3b3JkXG4gIH07XG5cbiAgZnVuY3Rpb24gc3VjY2VzcyAoKSB7XG4gICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFpbCAoc3RhdHVzLCByZXNwKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IExvZ2luRXJyb3Ioc3RhdHVzLCByZXNwKTtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpO1xuICB9XG5cbiAgaWYgKHVzZV9qc29ucCgpKSB7XG4gICAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvY2hhbmdlX3Bhc3N3b3JkPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhaWwoMCwgZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwLnN0YXR1cyA9PSAyMDAgP1xuICAgICAgICAgICAgICBzdWNjZXNzKCkgOlxuICAgICAgICAgICAgICBmYWlsKHJlc3Auc3RhdHVzLCByZXNwLmVycik7XG4gICAgfSk7XG4gIH1cblxuICByZXF3ZXN0KHtcbiAgICB1cmw6ICAgICAnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL2NoYW5nZV9wYXNzd29yZCcsXG4gICAgbWV0aG9kOiAgJ3Bvc3QnLFxuICAgIHR5cGU6ICAgICdodG1sJyxcbiAgICBkYXRhOiAgICBxdWVyeSxcbiAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlXG4gIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xuICAgIGZhaWwoZXJyLnN0YXR1cywgZXJyLnJlc3BvbnNlVGV4dCk7XG4gIH0pO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWwpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbldpdGhEYkNvbm5lY3Rpb24ob3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG5cbiAgdmFyIHF1ZXJ5ID0ge1xuICAgIHJlc3BvbnNlX3R5cGU6ICd0b2tlbicsXG4gICAgY2xpZW50X2lkOiAgICAgdGhpcy5fY2xpZW50SUQsXG4gICAgY29ubmVjdGlvbjogICAgb3B0aW9ucy5jb25uZWN0aW9uLFxuICAgIHJlZGlyZWN0X3VyaTogIHRoaXMuX2NhbGxiYWNrVVJMLFxuICAgIHNjb3BlOiAgICAgICAgICdvcGVuaWQgcHJvZmlsZSdcbiAgfTtcblxuICBpZiAob3B0aW9ucy5zdGF0ZSkge1xuICAgIHF1ZXJ5LnN0YXRlID0gb3B0aW9ucy5zdGF0ZTtcbiAgfVxuXG4gIHRoaXMuX3JlZGlyZWN0KCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2F1dGhvcml6ZT8nICsgcXMuc3RyaW5naWZ5KHF1ZXJ5KSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUubG9naW5XaXRoRGJDb25uZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgcXVlcnkudXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWw7XG4gIHF1ZXJ5LnBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZDtcblxuICBxdWVyeS50ZW5hbnQgPSB0aGlzLl9kb21haW4uc3BsaXQoJy4nKVswXTtcblxuICBmdW5jdGlvbiByZXR1cm5fZXJyb3IgKGVycm9yKSB7XG4gICAgaWYgKGNhbGxiYWNrKSAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgaWYgKHNlbGYuX2ZhaWx1cmUpIHJldHVybiBzZWxmLl9mYWlsdXJlKGVycm9yKTtcbiAgfVxuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL2xvZ2luPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgaWYoJ2Vycm9yJyBpbiByZXNwKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHJlc3Auc3RhdHVzLCByZXNwLmVycm9yKTtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcC5mb3JtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXdlc3Qoe1xuICAgIHVybDogICAgICdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvbG9naW4nLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgY3Jvc3NPcmlnaW46IHRydWUsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgIHNlbGYuX3JlbmRlckFuZFN1Ym1pdFdTRmVkRm9ybShyZXNwKTtcbiAgICB9XG4gIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xuICAgIHZhciBlciA9IGVycjtcbiAgICBpZiAoIWVyLnN0YXR1cyB8fCBlci5zdGF0dXMgPT09IDApIHsgLy9pZTEwIHRyaWNrXG4gICAgICBlciA9IHt9O1xuICAgICAgZXIuc3RhdHVzID0gNDAxO1xuICAgICAgZXIucmVzcG9uc2VUZXh0ID0ge1xuICAgICAgICBjb2RlOiAnaW52YWxpZF91c2VyX3Bhc3N3b3JkJ1xuICAgICAgfTtcbiAgICB9XG4gICAgdmFyIGVycm9yID0gbmV3IExvZ2luRXJyb3IoZXIuc3RhdHVzLCBlci5yZXNwb25zZVRleHQpO1xuICAgIHJldHVybiByZXR1cm5fZXJyb3IoZXJyb3IpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5nZXRTU09EYXRhID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy91c2VyL3Nzb2RhdGEnLCB7XG4gICAgcGFyYW06ICdjYngnLFxuICAgIHRpbWVvdXQ6IDE1MDAwXG4gIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICBjYWxsYmFjayhudWxsLCBlcnIgP8Kge30gOiByZXNwKTsgLy8gQWx3YXlzIHJldHVybiBPSywgcmVnYXJkbGVzcyBvZiBhbnkgZXJyb3JzXG4gIH0pO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmdldENvbm5lY3Rpb25zID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9wdWJsaWMvYXBpLycgKyB0aGlzLl9jbGllbnRJRCArICcvY29ubmVjdGlvbnMnLCB7XG4gICAgcGFyYW06ICdjYngnLFxuICAgIHRpbWVvdXQ6IDE1MDAwXG4gIH0sIGNhbGxiYWNrKTtcbn07XG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aDAgPSBBdXRoMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDsiLCJ2YXIganNvbl9wYXJzZSA9IHJlcXVpcmUoJy4vanNvbl9wYXJzZScpO1xuXG5mdW5jdGlvbiBMb2dpbkVycm9yKHN0YXR1cywgZGV0YWlscykge1xuICB2YXIgb2JqO1xuXG4gIGlmICh0eXBlb2YgZGV0YWlscyA9PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBvYmogPSBqc29uX3BhcnNlKGRldGFpbHMpO1xuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICBvYmogPSB7bWVzc2FnZTogZGV0YWlsc307ICAgICAgXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG9iaiA9IGRldGFpbHM7XG4gIH1cblxuICB2YXIgZXJyID0gRXJyb3IuY2FsbCh0aGlzLCBvYmouZGVzY3JpcHRpb24gfHwgb2JqLm1lc3NhZ2UgfHwgb2JqLmVycm9yKTtcblxuICBlcnIuc3RhdHVzID0gc3RhdHVzO1xuICBlcnIubmFtZSA9IG9iai5jb2RlO1xuICBlcnIuY29kZSA9IG9iai5jb2RlO1xuICBlcnIuZGV0YWlscyA9IG9iajtcbiAgXG4gIGlmIChzdGF0dXMgPT09IDApIHtcbiAgICBlcnIuY29kZSA9IFwiVW5rbm93blwiO1xuICAgIGVyci5tZXNzYWdlID0gXCJVbmtub3duIGVycm9yLlwiO1xuICB9XG5cbiAgcmV0dXJuIGVycjtcbn1cblxuaWYgKE9iamVjdCAmJiBPYmplY3QuY3JlYXRlKSB7XG4gIExvZ2luRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUsIHsgXG4gICAgY29uc3RydWN0b3I6IHsgdmFsdWU6IExvZ2luRXJyb3IgfSBcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9naW5FcnJvcjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmosIHByb3ApIHtcbiAgaWYgKCFvYmpbcHJvcF0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocHJvcCArICcgaXMgcmVxdWlyZWQuJyk7XG4gIH1cbn07IiwidmFyIEJhc2U2NCA9IHJlcXVpcmUoJ0Jhc2U2NCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cikge1xuICB2YXIgb3V0cHV0ID0gc3RyLnJlcGxhY2UoXCItXCIsIFwiK1wiKS5yZXBsYWNlKFwiX1wiLCBcIi9cIik7XG4gIHN3aXRjaCAob3V0cHV0Lmxlbmd0aCAlIDQpIHtcbiAgICBjYXNlIDA6XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBvdXRwdXQgKz0gXCI9PVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzOlxuICAgICAgb3V0cHV0ICs9IFwiPVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IFwiSWxsZWdhbCBiYXNlNjR1cmwgc3RyaW5nIVwiO1xuICB9XG4gIHJldHVybiBCYXNlNjQuYXRvYihvdXRwdXQpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHdpbmRvdy5KU09OID8gd2luZG93LkpTT04ucGFyc2Uoc3RyKSA6IGV2YWwoJygnICsgc3RyICsgJyknKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB4aHIgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG51bGw7XG4gIFxuICBpZiAoeGhyICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAnWERvbWFpblJlcXVlc3QnIGluIHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOic7XG59OyIsIjsoZnVuY3Rpb24gKCkge1xuXG4gIHZhclxuICAgIG9iamVjdCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IHRoaXMsIC8vICM4OiB3ZWIgd29ya2Vyc1xuICAgIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JyxcbiAgICBJTlZBTElEX0NIQVJBQ1RFUl9FUlIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZmFicmljYXRlIGEgc3VpdGFibGUgZXJyb3Igb2JqZWN0XG4gICAgICB0cnkgeyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCckJyk7IH1cbiAgICAgIGNhdGNoIChlcnJvcikgeyByZXR1cm4gZXJyb3I7IH19KCkpO1xuXG4gIC8vIGVuY29kZXJcbiAgLy8gW2h0dHBzOi8vZ2lzdC5naXRodWIuY29tLzk5OTE2Nl0gYnkgW2h0dHBzOi8vZ2l0aHViLmNvbS9uaWduYWddXG4gIG9iamVjdC5idG9hIHx8IChcbiAgb2JqZWN0LmJ0b2EgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBmb3IgKFxuICAgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJcbiAgICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzLCBvdXRwdXQgPSAnJztcbiAgICAgIC8vIGlmIHRoZSBuZXh0IGlucHV0IGluZGV4IGRvZXMgbm90IGV4aXN0OlxuICAgICAgLy8gICBjaGFuZ2UgdGhlIG1hcHBpbmcgdGFibGUgdG8gXCI9XCJcbiAgICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICAgIGlucHV0LmNoYXJBdChpZHggfCAwKSB8fCAobWFwID0gJz0nLCBpZHggJSAxKTtcbiAgICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgICBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpZHggJSAxICogOClcbiAgICApIHtcbiAgICAgIGNoYXJDb2RlID0gaW5wdXQuY2hhckNvZGVBdChpZHggKz0gMy80KTtcbiAgICAgIGlmIChjaGFyQ29kZSA+IDB4RkYpIHRocm93IElOVkFMSURfQ0hBUkFDVEVSX0VSUjtcbiAgICAgIGJsb2NrID0gYmxvY2sgPDwgOCB8IGNoYXJDb2RlO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9KTtcblxuICAvLyBkZWNvZGVyXG4gIC8vIFtodHRwczovL2dpc3QuZ2l0aHViLmNvbS8xMDIwMzk2XSBieSBbaHR0cHM6Ly9naXRodWIuY29tL2F0a11cbiAgb2JqZWN0LmF0b2IgfHwgKFxuICBvYmplY3QuYXRvYiA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvPSskLywgJycpXG4gICAgaWYgKGlucHV0Lmxlbmd0aCAlIDQgPT0gMSkgdGhyb3cgSU5WQUxJRF9DSEFSQUNURVJfRVJSO1xuICAgIGZvciAoXG4gICAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlcnNcbiAgICAgIHZhciBiYyA9IDAsIGJzLCBidWZmZXIsIGlkeCA9IDAsIG91dHB1dCA9ICcnO1xuICAgICAgLy8gZ2V0IG5leHQgY2hhcmFjdGVyXG4gICAgICBidWZmZXIgPSBpbnB1dC5jaGFyQXQoaWR4KyspO1xuICAgICAgLy8gY2hhcmFjdGVyIGZvdW5kIGluIHRhYmxlPyBpbml0aWFsaXplIGJpdCBzdG9yYWdlIGFuZCBhZGQgaXRzIGFzY2lpIHZhbHVlO1xuICAgICAgfmJ1ZmZlciAmJiAoYnMgPSBiYyAlIDQgPyBicyAqIDY0ICsgYnVmZmVyIDogYnVmZmVyLFxuICAgICAgICAvLyBhbmQgaWYgbm90IGZpcnN0IG9mIGVhY2ggNCBjaGFyYWN0ZXJzLFxuICAgICAgICAvLyBjb252ZXJ0IHRoZSBmaXJzdCA4IGJpdHMgdG8gb25lIGFzY2lpIGNoYXJhY3RlclxuICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICApIHtcbiAgICAgIC8vIHRyeSB0byBmaW5kIGNoYXJhY3RlciBpbiB0YWJsZSAoMC02Mywgbm90IGZvdW5kID0+IC0xKVxuICAgICAgYnVmZmVyID0gY2hhcnMuaW5kZXhPZihidWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9KTtcblxufSgpKTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnanNvbnAnKTtcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25wO1xuXG4vKipcbiAqIENhbGxiYWNrIGluZGV4LlxuICovXG5cbnZhciBjb3VudCA9IDA7XG5cbi8qKlxuICogTm9vcCBmdW5jdGlvbi5cbiAqL1xuXG5mdW5jdGlvbiBub29wKCl7fTtcblxuLyoqXG4gKiBKU09OUCBoYW5kbGVyXG4gKlxuICogT3B0aW9uczpcbiAqICAtIHBhcmFtIHtTdHJpbmd9IHFzIHBhcmFtZXRlciAoYGNhbGxiYWNrYClcbiAqICAtIHRpbWVvdXQge051bWJlcn0gaG93IGxvbmcgYWZ0ZXIgYSB0aW1lb3V0IGVycm9yIGlzIGVtaXR0ZWQgKGA2MDAwMGApXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IG9wdGlvbmFsIG9wdGlvbnMgLyBjYWxsYmFja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9uYWwgY2FsbGJhY2tcbiAqL1xuXG5mdW5jdGlvbiBqc29ucCh1cmwsIG9wdHMsIGZuKXtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIG9wdHMpIHtcbiAgICBmbiA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgdmFyIG9wdHMgPSBvcHRzIHx8IHt9O1xuICB2YXIgcGFyYW0gPSBvcHRzLnBhcmFtIHx8ICdjYWxsYmFjayc7XG4gIHZhciB0aW1lb3V0ID0gbnVsbCAhPSBvcHRzLnRpbWVvdXQgPyBvcHRzLnRpbWVvdXQgOiA2MDAwMDtcbiAgdmFyIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudDtcbiAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgdmFyIHNjcmlwdDtcbiAgdmFyIHRpbWVyO1xuXG4gIC8vIGdlbmVyYXRlIGEgdW5pcXVlIGlkIGZvciB0aGlzIHJlcXVlc3RcbiAgdmFyIGlkID0gY291bnQrKztcblxuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgY2xlYW51cCgpO1xuICAgICAgZm4gJiYgZm4obmV3IEVycm9yKCdUaW1lb3V0JykpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYW51cCgpe1xuICAgIHRhcmdldC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgd2luZG93WydfX2pwJyArIGlkXSA9IG5vb3A7XG4gIH1cblxuICB3aW5kb3dbJ19fanAnICsgaWRdID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgZGVidWcoJ2pzb25wIGdvdCcsIGRhdGEpO1xuICAgIGlmICh0aW1lcikgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICBjbGVhbnVwKCk7XG4gICAgZm4gJiYgZm4obnVsbCwgZGF0YSk7XG4gIH07XG5cbiAgLy8gYWRkIHFzIGNvbXBvbmVudFxuICB1cmwgKz0gKH51cmwuaW5kZXhPZignPycpID8gJyYnIDogJz8nKSArIHBhcmFtICsgJz0nICsgZW5jKCdfX2pwJyArIGlkICsgJycpO1xuICB1cmwgPSB1cmwucmVwbGFjZSgnPyYnLCAnPycpO1xuXG4gIGRlYnVnKCdqc29ucCByZXEgXCIlc1wiJywgdXJsKTtcblxuICAvLyBjcmVhdGUgc2NyaXB0XG4gIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuc3JjID0gdXJsO1xuICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCB0YXJnZXQpO1xufTtcbiIsIlxuLyoqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJ1ZztcblxuLyoqXG4gKiBDcmVhdGUgYSBkZWJ1Z2dlciB3aXRoIHRoZSBnaXZlbiBgbmFtZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge1R5cGV9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlYnVnKG5hbWUpIHtcbiAgaWYgKCFkZWJ1Zy5lbmFibGVkKG5hbWUpKSByZXR1cm4gZnVuY3Rpb24oKXt9O1xuXG4gIHJldHVybiBmdW5jdGlvbihmbXQpe1xuICAgIHZhciBjdXJyID0gbmV3IERhdGU7XG4gICAgdmFyIG1zID0gY3VyciAtIChkZWJ1Z1tuYW1lXSB8fCBjdXJyKTtcbiAgICBkZWJ1Z1tuYW1lXSA9IGN1cnI7XG5cbiAgICBmbXQgPSBuYW1lXG4gICAgICArICcgJ1xuICAgICAgKyBmbXRcbiAgICAgICsgJyArJyArIGRlYnVnLmh1bWFuaXplKG1zKTtcblxuICAgIC8vIFRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4XG4gICAgLy8gd2hlcmUgYGNvbnNvbGUubG9nYCBkb2Vzbid0IGhhdmUgJ2FwcGx5J1xuICAgIHdpbmRvdy5jb25zb2xlXG4gICAgICAmJiBjb25zb2xlLmxvZ1xuICAgICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBkZWJ1ZyBtb2RlIG5hbWVzLlxuICovXG5cbmRlYnVnLm5hbWVzID0gW107XG5kZWJ1Zy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWUuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcbiAqIHNlcGFyYXRlZCBieSBhIGNvbG9uIGFuZCB3aWxkY2FyZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZGVidWcuZW5hYmxlID0gZnVuY3Rpb24obmFtZSkge1xuICB0cnkge1xuICAgIGxvY2FsU3RvcmFnZS5kZWJ1ZyA9IG5hbWU7XG4gIH0gY2F0Y2goZSl7fVxuXG4gIHZhciBzcGxpdCA9IChuYW1lIHx8ICcnKS5zcGxpdCgvW1xccyxdKy8pXG4gICAgLCBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG5hbWUgPSBzcGxpdFtpXS5yZXBsYWNlKCcqJywgJy4qPycpO1xuICAgIGlmIChuYW1lWzBdID09PSAnLScpIHtcbiAgICAgIGRlYnVnLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lLnN1YnN0cigxKSArICckJykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGRlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lICsgJyQnKSk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZGVidWcuZGlzYWJsZSA9IGZ1bmN0aW9uKCl7XG4gIGRlYnVnLmVuYWJsZSgnJyk7XG59O1xuXG4vKipcbiAqIEh1bWFuaXplIHRoZSBnaXZlbiBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5kZWJ1Zy5odW1hbml6ZSA9IGZ1bmN0aW9uKG1zKSB7XG4gIHZhciBzZWMgPSAxMDAwXG4gICAgLCBtaW4gPSA2MCAqIDEwMDBcbiAgICAsIGhvdXIgPSA2MCAqIG1pbjtcblxuICBpZiAobXMgPj0gaG91cikgcmV0dXJuIChtcyAvIGhvdXIpLnRvRml4ZWQoMSkgKyAnaCc7XG4gIGlmIChtcyA+PSBtaW4pIHJldHVybiAobXMgLyBtaW4pLnRvRml4ZWQoMSkgKyAnbSc7XG4gIGlmIChtcyA+PSBzZWMpIHJldHVybiAobXMgLyBzZWMgfCAwKSArICdzJztcbiAgcmV0dXJuIG1zICsgJ21zJztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5kZWJ1Zy5lbmFibGVkID0gZnVuY3Rpb24obmFtZSkge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gZGVidWcuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZGVidWcuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gZGVidWcubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZGVidWcubmFtZXNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIHBlcnNpc3RcblxuaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIGRlYnVnLmVuYWJsZShsb2NhbFN0b3JhZ2UuZGVidWcpO1xuIiwiLyoqXG4gKiBPYmplY3QjdG9TdHJpbmcoKSByZWYgZm9yIHN0cmluZ2lmeSgpLlxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogT2JqZWN0I2hhc093blByb3BlcnR5IHJlZlxuICovXG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogc2VlIGlzc3VlICM3MFxuICovXG52YXIgaXNSZXN0b3JhYmxlUHJvdG8gPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgbztcblxuICBpZiAoIU9iamVjdC5jcmVhdGUpIHJldHVybiBmYWxzZTtcblxuICBvID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgby5fX3Byb3RvX18gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIHJldHVybiBvLmhhc093blByb3BlcnR5ID09PSBoYXNPd25Qcm9wZXJ0eTtcbn0pKCk7XG5cbi8qKlxuICogQXJyYXkjaW5kZXhPZiBzaGltLlxuICovXG5cbnZhciBpbmRleE9mID0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nXG4gID8gZnVuY3Rpb24oYXJyLCBlbCkgeyByZXR1cm4gYXJyLmluZGV4T2YoZWwpOyB9XG4gIDogZnVuY3Rpb24oYXJyLCBlbCkge1xuICAgICAgaWYgKHR5cGVvZiBhcnIgPT0gJ3N0cmluZycgJiYgdHlwZW9mIFwiYVwiWzBdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGFyciA9IGFyci5zcGxpdCgnJyk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJyW2ldID09PSBlbCkgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuLyoqXG4gKiBBcnJheS5pc0FycmF5IHNoaW0uXG4gKi9cblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG4vKipcbiAqIE9iamVjdC5rZXlzIHNoaW0uXG4gKi9cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxuLyoqXG4gKiBBcnJheSNmb3JFYWNoIHNoaW0uXG4gKi9cblxudmFyIGZvckVhY2ggPSB0eXBlb2YgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPT09ICdmdW5jdGlvbidcbiAgPyBmdW5jdGlvbihhcnIsIGZuKSB7IHJldHVybiBhcnIuZm9yRWFjaChmbik7IH1cbiAgOiBmdW5jdGlvbihhcnIsIGZuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgZm4oYXJyW2ldKTtcbiAgICB9O1xuXG4vKipcbiAqIEFycmF5I3JlZHVjZSBzaGltLlxuICovXG5cbnZhciByZWR1Y2UgPSBmdW5jdGlvbihhcnIsIGZuLCBpbml0aWFsKSB7XG4gIGlmICh0eXBlb2YgYXJyLnJlZHVjZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGFyci5yZWR1Y2UoZm4sIGluaXRpYWwpO1xuICB2YXIgcmVzID0gaW5pdGlhbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHJlcyA9IGZuKHJlcywgYXJyW2ldKTtcbiAgcmV0dXJuIHJlcztcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbnVsbGFyeSBvYmplY3QgaWYgcG9zc2libGVcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3QoKSB7XG4gIHJldHVybiBpc1Jlc3RvcmFibGVQcm90b1xuICAgID8gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgIDoge307XG59XG5cbi8qKlxuICogQ2FjaGUgbm9uLWludGVnZXIgdGVzdCByZWdleHAuXG4gKi9cblxudmFyIGlzaW50ID0gL15bMC05XSskLztcblxuZnVuY3Rpb24gcHJvbW90ZShwYXJlbnQsIGtleSkge1xuICBpZiAocGFyZW50W2tleV0ubGVuZ3RoID09IDApIHJldHVybiBwYXJlbnRba2V5XSA9IGNyZWF0ZU9iamVjdCgpO1xuICB2YXIgdCA9IGNyZWF0ZU9iamVjdCgpO1xuICBmb3IgKHZhciBpIGluIHBhcmVudFtrZXldKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwocGFyZW50W2tleV0sIGkpKSB7XG4gICAgICB0W2ldID0gcGFyZW50W2tleV1baV07XG4gICAgfVxuICB9XG4gIHBhcmVudFtrZXldID0gdDtcbiAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHBhcnRzLCBwYXJlbnQsIGtleSwgdmFsKSB7XG4gIHZhciBwYXJ0ID0gcGFydHMuc2hpZnQoKTtcbiAgLy8gZW5kXG4gIGlmICghcGFydCkge1xuICAgIGlmIChpc0FycmF5KHBhcmVudFtrZXldKSkge1xuICAgICAgcGFyZW50W2tleV0ucHVzaCh2YWwpO1xuICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIHBhcmVudFtrZXldKSB7XG4gICAgICBwYXJlbnRba2V5XSA9IHZhbDtcbiAgICB9IGVsc2UgaWYgKCd1bmRlZmluZWQnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudFtrZXldID0gW3BhcmVudFtrZXldLCB2YWxdO1xuICAgIH1cbiAgICAvLyBhcnJheVxuICB9IGVsc2Uge1xuICAgIHZhciBvYmogPSBwYXJlbnRba2V5XSA9IHBhcmVudFtrZXldIHx8IFtdO1xuICAgIGlmICgnXScgPT0gcGFydCkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBpZiAoJycgIT0gdmFsKSBvYmoucHVzaCh2YWwpO1xuICAgICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2Ygb2JqKSB7XG4gICAgICAgIG9ialtvYmplY3RLZXlzKG9iaikubGVuZ3RoXSA9IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iaiA9IHBhcmVudFtrZXldID0gW3BhcmVudFtrZXldLCB2YWxdO1xuICAgICAgfVxuICAgICAgLy8gcHJvcFxuICAgIH0gZWxzZSBpZiAofmluZGV4T2YocGFydCwgJ10nKSkge1xuICAgICAgcGFydCA9IHBhcnQuc3Vic3RyKDAsIHBhcnQubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAoIWlzaW50LnRlc3QocGFydCkgJiYgaXNBcnJheShvYmopKSBvYmogPSBwcm9tb3RlKHBhcmVudCwga2V5KTtcbiAgICAgIHBhcnNlKHBhcnRzLCBvYmosIHBhcnQsIHZhbCk7XG4gICAgICAvLyBrZXlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHBhcmVudCBrZXkvdmFsIHBhaXIuXG4gKi9cblxuZnVuY3Rpb24gbWVyZ2UocGFyZW50LCBrZXksIHZhbCl7XG4gIGlmICh+aW5kZXhPZihrZXksICddJykpIHtcbiAgICB2YXIgcGFydHMgPSBrZXkuc3BsaXQoJ1snKVxuICAgICAgLCBsZW4gPSBwYXJ0cy5sZW5ndGhcbiAgICAgICwgbGFzdCA9IGxlbiAtIDE7XG4gICAgcGFyc2UocGFydHMsIHBhcmVudCwgJ2Jhc2UnLCB2YWwpO1xuICAgIC8vIG9wdGltaXplXG4gIH0gZWxzZSB7XG4gICAgaWYgKCFpc2ludC50ZXN0KGtleSkgJiYgaXNBcnJheShwYXJlbnQuYmFzZSkpIHtcbiAgICAgIHZhciB0ID0gY3JlYXRlT2JqZWN0KCk7XG4gICAgICBmb3IgKHZhciBrIGluIHBhcmVudC5iYXNlKSB0W2tdID0gcGFyZW50LmJhc2Vba107XG4gICAgICBwYXJlbnQuYmFzZSA9IHQ7XG4gICAgfVxuICAgIHNldChwYXJlbnQuYmFzZSwga2V5LCB2YWwpO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLyoqXG4gKiBDb21wYWN0IHNwYXJzZSBhcnJheXMuXG4gKi9cblxuZnVuY3Rpb24gY29tcGFjdChvYmopIHtcbiAgaWYgKCdvYmplY3QnICE9IHR5cGVvZiBvYmopIHJldHVybiBvYmo7XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIHZhciByZXQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB7XG4gICAgICAgIHJldC5wdXNoKG9ialtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBvYmpba2V5XSA9IGNvbXBhY3Qob2JqW2tleV0pO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIE9iamVjdC5wcm90b3R5cGUuXG4gKiBzZWUgcHVsbC1yZXF1ZXN0ICM1OFxuICovXG5cbmZ1bmN0aW9uIHJlc3RvcmVQcm90byhvYmopIHtcbiAgaWYgKCFpc1Jlc3RvcmFibGVQcm90bykgcmV0dXJuIG9iajtcbiAgaWYgKGlzQXJyYXkob2JqKSkgcmV0dXJuIG9iajtcbiAgaWYgKG9iaiAmJiAnb2JqZWN0JyAhPSB0eXBlb2Ygb2JqKSByZXR1cm4gb2JqO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gcmVzdG9yZVByb3RvKG9ialtrZXldKTtcbiAgICB9XG4gIH1cblxuICBvYmouX19wcm90b19fID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gb2JqLlxuICovXG5cbmZ1bmN0aW9uIHBhcnNlT2JqZWN0KG9iail7XG4gIHZhciByZXQgPSB7IGJhc2U6IHt9IH07XG5cbiAgZm9yRWFjaChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgIG1lcmdlKHJldCwgbmFtZSwgb2JqW25hbWVdKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbXBhY3QocmV0LmJhc2UpO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBzdHIuXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKXtcbiAgdmFyIHJldCA9IHJlZHVjZShTdHJpbmcoc3RyKS5zcGxpdCgnJicpLCBmdW5jdGlvbihyZXQsIHBhaXIpe1xuICAgIHZhciBlcWwgPSBpbmRleE9mKHBhaXIsICc9JylcbiAgICAgICwgYnJhY2UgPSBsYXN0QnJhY2VJbktleShwYWlyKVxuICAgICAgLCBrZXkgPSBwYWlyLnN1YnN0cigwLCBicmFjZSB8fCBlcWwpXG4gICAgICAsIHZhbCA9IHBhaXIuc3Vic3RyKGJyYWNlIHx8IGVxbCwgcGFpci5sZW5ndGgpXG4gICAgICAsIHZhbCA9IHZhbC5zdWJzdHIoaW5kZXhPZih2YWwsICc9JykgKyAxLCB2YWwubGVuZ3RoKTtcblxuICAgIC8vID9mb29cbiAgICBpZiAoJycgPT0ga2V5KSBrZXkgPSBwYWlyLCB2YWwgPSAnJztcbiAgICBpZiAoJycgPT0ga2V5KSByZXR1cm4gcmV0O1xuXG4gICAgcmV0dXJuIG1lcmdlKHJldCwgZGVjb2RlKGtleSksIGRlY29kZSh2YWwpKTtcbiAgfSwgeyBiYXNlOiBjcmVhdGVPYmplY3QoKSB9KS5iYXNlO1xuXG4gIHJldHVybiByZXN0b3JlUHJvdG8oY29tcGFjdChyZXQpKTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gcXVlcnkgYHN0cmAgb3IgYG9iamAsIHJldHVybmluZyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciB8IHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oc3RyKXtcbiAgaWYgKG51bGwgPT0gc3RyIHx8ICcnID09IHN0cikgcmV0dXJuIHt9O1xuICByZXR1cm4gJ29iamVjdCcgPT0gdHlwZW9mIHN0clxuICAgID8gcGFyc2VPYmplY3Qoc3RyKVxuICAgIDogcGFyc2VTdHJpbmcoc3RyKTtcbn07XG5cbi8qKlxuICogVHVybiB0aGUgZ2l2ZW4gYG9iamAgaW50byBhIHF1ZXJ5IHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxudmFyIHN0cmluZ2lmeSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIHJldHVybiBzdHJpbmdpZnlBcnJheShvYmosIHByZWZpeCk7XG4gIH0gZWxzZSBpZiAoJ1tvYmplY3QgT2JqZWN0XScgPT0gdG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeU9iamVjdChvYmosIHByZWZpeCk7XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIG9iaikge1xuICAgIHJldHVybiBzdHJpbmdpZnlTdHJpbmcob2JqLCBwcmVmaXgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmVmaXggKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKG9iaikpO1xuICB9XG59O1xuXG4vKipcbiAqIFN0cmluZ2lmeSB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5U3RyaW5nKHN0ciwgcHJlZml4KSB7XG4gIGlmICghcHJlZml4KSB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmdpZnkgZXhwZWN0cyBhbiBvYmplY3QnKTtcbiAgcmV0dXJuIHByZWZpeCArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChzdHIpO1xufVxuXG4vKipcbiAqIFN0cmluZ2lmeSB0aGUgZ2l2ZW4gYGFycmAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlBcnJheShhcnIsIHByZWZpeCkge1xuICB2YXIgcmV0ID0gW107XG4gIGlmICghcHJlZml4KSB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmdpZnkgZXhwZWN0cyBhbiBvYmplY3QnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICByZXQucHVzaChzdHJpbmdpZnkoYXJyW2ldLCBwcmVmaXggKyAnWycgKyBpICsgJ10nKSk7XG4gIH1cbiAgcmV0dXJuIHJldC5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogU3RyaW5naWZ5IHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlPYmplY3Qob2JqLCBwcmVmaXgpIHtcbiAgdmFyIHJldCA9IFtdXG4gICAgLCBrZXlzID0gb2JqZWN0S2V5cyhvYmopXG4gICAgLCBrZXk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICgnJyA9PSBrZXkpIGNvbnRpbnVlO1xuICAgIGlmIChudWxsID09IG9ialtrZXldKSB7XG4gICAgICByZXQucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldC5wdXNoKHN0cmluZ2lmeShvYmpba2V5XSwgcHJlZml4XG4gICAgICAgID8gcHJlZml4ICsgJ1snICsgZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnXSdcbiAgICAgICAgOiBlbmNvZGVVUklDb21wb25lbnQoa2V5KSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQuam9pbignJicpO1xufVxuXG4vKipcbiAqIFNldCBgb2JqYCdzIGBrZXlgIHRvIGB2YWxgIHJlc3BlY3RpbmdcbiAqIHRoZSB3ZWlyZCBhbmQgd29uZGVyZnVsIHN5bnRheCBvZiBhIHFzLFxuICogd2hlcmUgXCJmb289YmFyJmZvbz1iYXpcIiBiZWNvbWVzIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNldChvYmosIGtleSwgdmFsKSB7XG4gIHZhciB2ID0gb2JqW2tleV07XG4gIGlmICh1bmRlZmluZWQgPT09IHYpIHtcbiAgICBvYmpba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHYpKSB7XG4gICAgdi5wdXNoKHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSBbdiwgdmFsXTtcbiAgfVxufVxuXG4vKipcbiAqIExvY2F0ZSBsYXN0IGJyYWNlIGluIGBzdHJgIHdpdGhpbiB0aGUga2V5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxhc3RCcmFjZUluS2V5KHN0cikge1xuICB2YXIgbGVuID0gc3RyLmxlbmd0aFxuICAgICwgYnJhY2VcbiAgICAsIGM7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBjID0gc3RyW2ldO1xuICAgIGlmICgnXScgPT0gYykgYnJhY2UgPSBmYWxzZTtcbiAgICBpZiAoJ1snID09IGMpIGJyYWNlID0gdHJ1ZTtcbiAgICBpZiAoJz0nID09IGMgJiYgIWJyYWNlKSByZXR1cm4gaTtcbiAgfVxufVxuXG4vKipcbiAqIERlY29kZSBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBkZWNvZGUoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG4iLCIvKiEgdmVyc2lvbjogMC45LjEgKi9cbi8qIVxuICAqIFJlcXdlc3QhIEEgZ2VuZXJhbCBwdXJwb3NlIFhIUiBjb25uZWN0aW9uIG1hbmFnZXJcbiAgKiAoYykgRHVzdGluIERpYXogMjAxM1xuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcmVxd2VzdFxuICAqIGxpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdyZXF3ZXN0JywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciB3aW4gPSB3aW5kb3dcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCB0d29IdW5kbyA9IC9eMjBcXGQkL1xuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCByZWFkeVN0YXRlID0gJ3JlYWR5U3RhdGUnXG4gICAgLCBjb250ZW50VHlwZSA9ICdDb250ZW50LVR5cGUnXG4gICAgLCByZXF1ZXN0ZWRXaXRoID0gJ1gtUmVxdWVzdGVkLVdpdGgnXG4gICAgLCBoZWFkID0gZG9jW2J5VGFnXSgnaGVhZCcpWzBdXG4gICAgLCB1bmlxaWQgPSAwXG4gICAgLCBjYWxsYmFja1ByZWZpeCA9ICdyZXF3ZXN0XycgKyAoK25ldyBEYXRlKCkpXG4gICAgLCBsYXN0VmFsdWUgLy8gZGF0YSBzdG9yZWQgYnkgdGhlIG1vc3QgcmVjZW50IEpTT05QIGNhbGxiYWNrXG4gICAgLCB4bWxIdHRwUmVxdWVzdCA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAsIHhEb21haW5SZXF1ZXN0ID0gJ1hEb21haW5SZXF1ZXN0J1xuICAgICwgbm9vcCA9IGZ1bmN0aW9uICgpIHt9XG5cbiAgICAsIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PSAnZnVuY3Rpb24nXG4gICAgICAgID8gQXJyYXkuaXNBcnJheVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gYSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgfVxuXG4gICAgLCBkZWZhdWx0SGVhZGVycyA9IHtcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgLCByZXF1ZXN0ZWRXaXRoOiB4bWxIdHRwUmVxdWVzdFxuICAgICAgICAsIGFjY2VwdDoge1xuICAgICAgICAgICAgICAnKic6ICAndGV4dC9qYXZhc2NyaXB0LCB0ZXh0L2h0bWwsIGFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwsICovKidcbiAgICAgICAgICAgICwgeG1sOiAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnXG4gICAgICAgICAgICAsIGh0bWw6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAsIHRleHQ6ICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgLCBqc29uOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgICAgLCBqczogICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgeGhyID0gZnVuY3Rpb24obykge1xuICAgICAgICAvLyBpcyBpdCB4LWRvbWFpblxuICAgICAgICBpZiAoby5jcm9zc09yaWdpbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciB4aHIgPSB3aW5beG1sSHR0cFJlcXVlc3RdID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsXG4gICAgICAgICAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjcm9zcy1vcmlnaW4gcmVxdWVzdHMnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh3aW5beG1sSHR0cFJlcXVlc3RdKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGdsb2JhbFNldHVwT3B0aW9ucyA9IHtcbiAgICAgICAgZGF0YUZpbHRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVhZHlTdGF0ZShyLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB1c2UgX2Fib3J0ZWQgdG8gbWl0aWdhdGUgYWdhaW5zdCBJRSBlcnIgYzAwYzAyM2ZcbiAgICAgIC8vIChjYW4ndCByZWFkIHByb3BzIG9uIGFib3J0ZWQgcmVxdWVzdCBvYmplY3RzKVxuICAgICAgaWYgKHIuX2Fib3J0ZWQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QpXG4gICAgICBpZiAoci5yZXF1ZXN0ICYmIHIucmVxdWVzdFtyZWFkeVN0YXRlXSA9PSA0KSB7XG4gICAgICAgIHIucmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wXG4gICAgICAgIGlmICh0d29IdW5kby50ZXN0KHIucmVxdWVzdC5zdGF0dXMpKVxuICAgICAgICAgIHN1Y2Nlc3Moci5yZXF1ZXN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoaHR0cCwgbykge1xuICAgIHZhciBoZWFkZXJzID0gby5oZWFkZXJzIHx8IHt9XG4gICAgICAsIGhcblxuICAgIGhlYWRlcnMuQWNjZXB0ID0gaGVhZGVycy5BY2NlcHRcbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzLmFjY2VwdFtvLnR5cGVdXG4gICAgICB8fCBkZWZhdWx0SGVhZGVycy5hY2NlcHRbJyonXVxuXG4gICAgLy8gYnJlYWtzIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyB3aXRoIGxlZ2FjeSBicm93c2Vyc1xuICAgIGlmICghby5jcm9zc09yaWdpbiAmJiAhaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSkgaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSA9IGRlZmF1bHRIZWFkZXJzLnJlcXVlc3RlZFdpdGhcbiAgICBpZiAoIWhlYWRlcnNbY29udGVudFR5cGVdKSBoZWFkZXJzW2NvbnRlbnRUeXBlXSA9IG8uY29udGVudFR5cGUgfHwgZGVmYXVsdEhlYWRlcnMuY29udGVudFR5cGVcbiAgICBmb3IgKGggaW4gaGVhZGVycylcbiAgICAgIGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaCkgJiYgJ3NldFJlcXVlc3RIZWFkZXInIGluIGh0dHAgJiYgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGgsIGhlYWRlcnNbaF0pXG4gIH1cblxuICBmdW5jdGlvbiBzZXRDcmVkZW50aWFscyhodHRwLCBvKSB7XG4gICAgaWYgKHR5cGVvZiBvLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGh0dHAud2l0aENyZWRlbnRpYWxzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaHR0cC53aXRoQ3JlZGVudGlhbHMgPSAhIW8ud2l0aENyZWRlbnRpYWxzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhbENhbGxiYWNrKGRhdGEpIHtcbiAgICBsYXN0VmFsdWUgPSBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiB1cmxhcHBlbmQgKHVybCwgcykge1xuICAgIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gJyYnIDogJz8nKSArIHNcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybCkge1xuICAgIHZhciByZXFJZCA9IHVuaXFpZCsrXG4gICAgICAsIGNia2V5ID0gby5qc29ucENhbGxiYWNrIHx8ICdjYWxsYmFjaycgLy8gdGhlICdjYWxsYmFjaycga2V5XG4gICAgICAsIGNidmFsID0gby5qc29ucENhbGxiYWNrTmFtZSB8fCByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4KHJlcUlkKVxuICAgICAgLy8gLCBjYnZhbCA9IG8uanNvbnBDYWxsYmFja05hbWUgfHwgKCdyZXF3ZXN0XycgKyByZXFJZCkgLy8gdGhlICdjYWxsYmFjaycgdmFsdWVcbiAgICAgICwgY2JyZWcgPSBuZXcgUmVnRXhwKCcoKF58XFxcXD98JiknICsgY2JrZXkgKyAnKT0oW14mXSspJylcbiAgICAgICwgbWF0Y2ggPSB1cmwubWF0Y2goY2JyZWcpXG4gICAgICAsIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBsb2FkZWQgPSAwXG4gICAgICAsIGlzSUUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAxMC4wJykgIT09IC0xXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGlmIChtYXRjaFszXSA9PT0gJz8nKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKGNicmVnLCAnJDE9JyArIGNidmFsKSAvLyB3aWxkY2FyZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNidmFsID0gbWF0Y2hbM10gLy8gcHJvdmlkZWQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGNia2V5ICsgJz0nICsgY2J2YWwpIC8vIG5vIGNhbGxiYWNrIGRldGFpbHMsIGFkZCAnZW1cbiAgICB9XG5cbiAgICB3aW5bY2J2YWxdID0gZ2VuZXJhbENhbGxiYWNrXG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgc2NyaXB0LnNyYyA9IHVybFxuICAgIHNjcmlwdC5hc3luYyA9IHRydWVcbiAgICBpZiAodHlwZW9mIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgIT09ICd1bmRlZmluZWQnICYmICFpc0lFMTApIHtcbiAgICAgIC8vIG5lZWQgdGhpcyBmb3IgSUUgZHVlIHRvIG91dC1vZi1vcmRlciBvbnJlYWR5c3RhdGVjaGFuZ2UoKSwgYmluZGluZyBzY3JpcHRcbiAgICAgIC8vIGV4ZWN1dGlvbiB0byBhbiBldmVudCBsaXN0ZW5lciBnaXZlcyB1cyBjb250cm9sIG92ZXIgd2hlbiB0aGUgc2NyaXB0XG4gICAgICAvLyBpcyBleGVjdXRlZC4gU2VlIGh0dHA6Ly9qYXVib3VyZy5uZXQvMjAxMC8wNy9sb2FkaW5nLXNjcmlwdC1hcy1vbmNsaWNrLWhhbmRsZXItb2YuaHRtbFxuICAgICAgLy9cbiAgICAgIC8vIGlmIHRoaXMgaGFjayBpcyB1c2VkIGluIElFMTAganNvbnAgY2FsbGJhY2sgYXJlIG5ldmVyIGNhbGxlZFxuICAgICAgc2NyaXB0LmV2ZW50ID0gJ29uY2xpY2snXG4gICAgICBzY3JpcHQuaHRtbEZvciA9IHNjcmlwdC5pZCA9ICdfcmVxd2VzdF8nICsgcmVxSWRcbiAgICB9XG5cbiAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgoc2NyaXB0W3JlYWR5U3RhdGVdICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2NvbXBsZXRlJyAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdsb2FkZWQnKSB8fCBsb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgIHNjcmlwdC5vbmNsaWNrICYmIHNjcmlwdC5vbmNsaWNrKClcbiAgICAgIC8vIENhbGwgdGhlIHVzZXIgY2FsbGJhY2sgd2l0aCB0aGUgbGFzdCB2YWx1ZSBzdG9yZWQgYW5kIGNsZWFuIHVwIHZhbHVlcyBhbmQgc2NyaXB0cy5cbiAgICAgIGZuKGxhc3RWYWx1ZSlcbiAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICBsb2FkZWQgPSAxXG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBzY3JpcHQgdG8gdGhlIERPTSBoZWFkXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cbiAgICAvLyBFbmFibGUgSlNPTlAgdGltZW91dFxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgICAgZXJyKHt9LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0Jywge30pXG4gICAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgICAgbG9hZGVkID0gMVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcXVlc3QoZm4sIGVycikge1xuICAgIHZhciBvID0gdGhpcy5vXG4gICAgICAsIG1ldGhvZCA9IChvLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxuICAgICAgLCB1cmwgPSB0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBvIDogby51cmxcbiAgICAgIC8vIGNvbnZlcnQgbm9uLXN0cmluZyBvYmplY3RzIHRvIHF1ZXJ5LXN0cmluZyBmb3JtIHVubGVzcyBvLnByb2Nlc3NEYXRhIGlzIGZhbHNlXG4gICAgICAsIGRhdGEgPSAoby5wcm9jZXNzRGF0YSAhPT0gZmFsc2UgJiYgby5kYXRhICYmIHR5cGVvZiBvLmRhdGEgIT09ICdzdHJpbmcnKVxuICAgICAgICA/IHJlcXdlc3QudG9RdWVyeVN0cmluZyhvLmRhdGEpXG4gICAgICAgIDogKG8uZGF0YSB8fCBudWxsKVxuICAgICAgLCBodHRwXG4gICAgICAsIHNlbmRXYWl0ID0gZmFsc2VcblxuICAgIC8vIGlmIHdlJ3JlIHdvcmtpbmcgb24gYSBHRVQgcmVxdWVzdCBhbmQgd2UgaGF2ZSBkYXRhIHRoZW4gd2Ugc2hvdWxkIGFwcGVuZFxuICAgIC8vIHF1ZXJ5IHN0cmluZyB0byBlbmQgb2YgVVJMIGFuZCBub3QgcG9zdCBkYXRhXG4gICAgaWYgKChvLnR5cGUgPT0gJ2pzb25wJyB8fCBtZXRob2QgPT0gJ0dFVCcpICYmIGRhdGEpIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGRhdGEpXG4gICAgICBkYXRhID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChvLnR5cGUgPT0gJ2pzb25wJykgcmV0dXJuIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybClcblxuICAgIGh0dHAgPSB4aHIobylcbiAgICBodHRwLm9wZW4obWV0aG9kLCB1cmwsIG8uYXN5bmMgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHNldEhlYWRlcnMoaHR0cCwgbylcbiAgICBzZXRDcmVkZW50aWFscyhodHRwLCBvKVxuICAgIGlmICh3aW5beERvbWFpblJlcXVlc3RdICYmIGh0dHAgaW5zdGFuY2VvZiB3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgIGh0dHAub25sb2FkID0gZm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gZXJyXG4gICAgICAgIC8vIE5PVEU6IHNlZVxuICAgICAgICAvLyBodHRwOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvZW4tVVMvaWV3ZWJkZXZlbG9wbWVudC90aHJlYWQvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlXG4gICAgICAgIGh0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge31cbiAgICAgICAgc2VuZFdhaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlUmVhZHlTdGF0ZSh0aGlzLCBmbiwgZXJyKVxuICAgIH1cbiAgICBvLmJlZm9yZSAmJiBvLmJlZm9yZShodHRwKVxuICAgIGlmIChzZW5kV2FpdCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgICAgfSwgMjAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXdlc3QobywgZm4pIHtcbiAgICB0aGlzLm8gPSBvXG4gICAgdGhpcy5mbiA9IGZuXG5cbiAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFR5cGUodXJsKSB7XG4gICAgdmFyIG0gPSB1cmwubWF0Y2goL1xcLihqc29ufGpzb25wfGh0bWx8eG1sKShcXD98JCkvKVxuICAgIHJldHVybiBtID8gbVsxXSA6ICdqcydcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQobywgZm4pIHtcblxuICAgIHRoaXMudXJsID0gdHlwZW9mIG8gPT0gJ3N0cmluZycgPyBvIDogby51cmxcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsXG5cbiAgICAvLyB3aGV0aGVyIHJlcXVlc3QgaGFzIGJlZW4gZnVsZmlsbGVkIGZvciBwdXJwb3NlXG4gICAgLy8gb2YgdHJhY2tpbmcgdGhlIFByb21pc2VzXG4gICAgdGhpcy5fZnVsZmlsbGVkID0gZmFsc2VcbiAgICAvLyBzdWNjZXNzIGhhbmRsZXJzXG4gICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbigpe31cbiAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzID0gW11cbiAgICAvLyBlcnJvciBoYW5kbGVyc1xuICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMgPSBbXVxuICAgIC8vIGNvbXBsZXRlIChib3RoIHN1Y2Nlc3MgYW5kIGZhaWwpIGhhbmRsZXJzXG4gICAgdGhpcy5fY29tcGxldGVIYW5kbGVycyA9IFtdXG4gICAgdGhpcy5fZXJyZWQgPSBmYWxzZVxuICAgIHRoaXMuX3Jlc3BvbnNlQXJncyA9IHt9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICwgdHlwZSA9IG8udHlwZSB8fCBzZXRUeXBlKHRoaXMudXJsKVxuXG4gICAgZm4gPSBmbiB8fCBmdW5jdGlvbiAoKSB7fVxuXG4gICAgaWYgKG8udGltZW91dCkge1xuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuYWJvcnQoKVxuICAgICAgfSwgby50aW1lb3V0KVxuICAgIH1cblxuICAgIGlmIChvLnN1Y2Nlc3MpIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvLnN1Y2Nlc3MuYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvLmVycm9yKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvLmVycm9yLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG8uY29tcGxldGUpIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uY29tcGxldGUuYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgby50aW1lb3V0ICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHJlc3AgPSAodHlwZSAhPT0gJ2pzb25wJykgPyBzZWxmLnJlcXVlc3QgOiByZXNwXG4gICAgICAvLyB1c2UgZ2xvYmFsIGRhdGEgZmlsdGVyIG9uIHJlc3BvbnNlIHRleHRcbiAgICAgIHZhciBmaWx0ZXJlZFJlc3BvbnNlID0gZ2xvYmFsU2V0dXBPcHRpb25zLmRhdGFGaWx0ZXIocmVzcC5yZXNwb25zZVRleHQsIHR5cGUpXG4gICAgICAgICwgciA9IGZpbHRlcmVkUmVzcG9uc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0ID0gclxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjYW4ndCBhc3NpZ24gdGhpcyBpbiBJRTw9OCwganVzdCBpZ25vcmVcbiAgICAgIH1cbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IHdpbi5KU09OID8gd2luLkpTT04ucGFyc2UocikgOiBldmFsKCcoJyArIHIgKyAnKScpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IocmVzcCwgJ0NvdWxkIG5vdCBwYXJzZSBKU09OIGluIHJlc3BvbnNlJywgZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgcmVzcCA9IGV2YWwocilcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICByZXNwID0gclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgcmVzcCA9IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yIC8vIElFIHRyb2xvbG9cbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLmVycm9yQ29kZVxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IucmVhc29uXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9mdWxmaWxsZWQgPSB0cnVlXG4gICAgICBmbihyZXNwKVxuICAgICAgc2VsZi5fc3VjY2Vzc0hhbmRsZXIocmVzcClcbiAgICAgIHdoaWxlIChzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzcCA9IHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuXG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3AsIG1zZywgdCkge1xuICAgICAgcmVzcCA9IHNlbGYucmVxdWVzdFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MubXNnID0gbXNnXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MudCA9IHRcbiAgICAgIHNlbGYuX2VycmVkID0gdHJ1ZVxuICAgICAgd2hpbGUgKHNlbGYuX2Vycm9ySGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9lcnJvckhhbmRsZXJzLnNoaWZ0KCkocmVzcCwgbXNnLCB0KVxuICAgICAgfVxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSBnZXRSZXF1ZXN0LmNhbGwodGhpcywgc3VjY2VzcywgZXJyb3IpXG4gIH1cblxuICBSZXF3ZXN0LnByb3RvdHlwZSA9IHtcbiAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWVcbiAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICwgcmV0cnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXQuY2FsbCh0aGlzLCB0aGlzLm8sIHRoaXMuZm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU21hbGwgZGV2aWF0aW9uIGZyb20gdGhlIFByb21pc2VzIEEgQ29tbW9uSnMgc3BlY2lmaWNhdGlvblxuICAgICAqIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1Byb21pc2VzL0FcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIGB0aGVuYCB3aWxsIGV4ZWN1dGUgdXBvbiBzdWNjZXNzZnVsIHJlcXVlc3RzXG4gICAgICovXG4gICwgdGhlbjogZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBmYWlsID0gZmFpbCB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCA9IHN1Y2Nlc3ModGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZhaWwodGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycy5wdXNoKHN1Y2Nlc3MpXG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmYWlsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgYWx3YXlzYCB3aWxsIGV4ZWN1dGUgd2hldGhlciB0aGUgcmVxdWVzdCBzdWNjZWVkcyBvciBmYWlsc1xuICAgICAqL1xuICAsIGFsd2F5czogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkIHx8IHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgZmFpbGAgd2lsbCBleGVjdXRlIHdoZW4gdGhlIHJlcXVlc3QgZmFpbHNcbiAgICAgKi9cbiAgLCBmYWlsOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXdlc3QobywgZm4pIHtcbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICAvLyBub3JtYWxpemUgbmV3bGluZSB2YXJpYW50cyBhY2NvcmRpbmcgdG8gc3BlYyAtPiBDUkxGXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoL1xccj9cXG4vZywgJ1xcclxcbicpIDogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbChlbCwgY2IpIHtcbiAgICB2YXIgbiA9IGVsLm5hbWVcbiAgICAgICwgdCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgLCBvcHRDYiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgLy8gSUUgZ2l2ZXMgdmFsdWU9XCJcIiBldmVuIHdoZXJlIHRoZXJlIGlzIG5vIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgIC8vICdzcGVjaWZpZWQnIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtQ29yZS9jb3JlLmh0bWwjSUQtODYyNTI5MjczXG4gICAgICAgICAgaWYgKG8gJiYgIW8uZGlzYWJsZWQpXG4gICAgICAgICAgICBjYihuLCBub3JtYWxpemUoby5hdHRyaWJ1dGVzLnZhbHVlICYmIG8uYXR0cmlidXRlcy52YWx1ZS5zcGVjaWZpZWQgPyBvLnZhbHVlIDogby50ZXh0KSlcbiAgICAgICAgfVxuICAgICAgLCBjaCwgcmEsIHZhbCwgaVxuXG4gICAgLy8gZG9uJ3Qgc2VyaWFsaXplIGVsZW1lbnRzIHRoYXQgYXJlIGRpc2FibGVkIG9yIHdpdGhvdXQgYSBuYW1lXG4gICAgaWYgKGVsLmRpc2FibGVkIHx8ICFuKSByZXR1cm5cblxuICAgIHN3aXRjaCAodCkge1xuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGlmICghL3Jlc2V0fGJ1dHRvbnxpbWFnZXxmaWxlL2kudGVzdChlbC50eXBlKSkge1xuICAgICAgICBjaCA9IC9jaGVja2JveC9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgcmEgPSAvcmFkaW8vaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHZhbCA9IGVsLnZhbHVlXG4gICAgICAgIC8vIFdlYktpdCBnaXZlcyB1cyBcIlwiIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgY2hlY2tib3ggaGFzIG5vIHZhbHVlLCBzbyBjb3JyZWN0IGl0IGhlcmVcbiAgICAgICAgOyghKGNoIHx8IHJhKSB8fCBlbC5jaGVja2VkKSAmJiBjYihuLCBub3JtYWxpemUoY2ggJiYgdmFsID09PSAnJyA/ICdvbicgOiB2YWwpKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYihuLCBub3JtYWxpemUoZWwudmFsdWUpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKGVsLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdC1vbmUnKSB7XG4gICAgICAgIG9wdENiKGVsLnNlbGVjdGVkSW5kZXggPj0gMCA/IGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0gOiBudWxsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMDsgZWwubGVuZ3RoICYmIGkgPCBlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsLm9wdGlvbnNbaV0uc2VsZWN0ZWQgJiYgb3B0Q2IoZWwub3B0aW9uc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBjb2xsZWN0IHVwIGFsbCBmb3JtIGVsZW1lbnRzIGZvdW5kIGZyb20gdGhlIHBhc3NlZCBhcmd1bWVudCBlbGVtZW50cyBhbGxcbiAgLy8gdGhlIHdheSBkb3duIHRvIGNoaWxkIGVsZW1lbnRzOyBwYXNzIGEgJzxmb3JtPicgb3IgZm9ybSBmaWVsZHMuXG4gIC8vIGNhbGxlZCB3aXRoICd0aGlzJz1jYWxsYmFjayB0byB1c2UgZm9yIHNlcmlhbCgpIG9uIGVhY2ggZWxlbWVudFxuICBmdW5jdGlvbiBlYWNoRm9ybUVsZW1lbnQoKSB7XG4gICAgdmFyIGNiID0gdGhpc1xuICAgICAgLCBlLCBpXG4gICAgICAsIHNlcmlhbGl6ZVN1YnRhZ3MgPSBmdW5jdGlvbiAoZSwgdGFncykge1xuICAgICAgICAgIHZhciBpLCBqLCBmYVxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmYSA9IGVbYnlUYWddKHRhZ3NbaV0pXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmEubGVuZ3RoOyBqKyspIHNlcmlhbChmYVtqXSwgY2IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlID0gYXJndW1lbnRzW2ldXG4gICAgICBpZiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYS9pLnRlc3QoZS50YWdOYW1lKSkgc2VyaWFsKGUsIGNiKVxuICAgICAgc2VyaWFsaXplU3VidGFncyhlLCBbICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnIF0pXG4gICAgfVxuICB9XG5cbiAgLy8gc3RhbmRhcmQgcXVlcnkgc3RyaW5nIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHJlcXdlc3QudG9RdWVyeVN0cmluZyhyZXF3ZXN0LnNlcmlhbGl6ZUFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gIH1cblxuICAvLyB7ICduYW1lJzogJ3ZhbHVlJywgLi4uIH0gc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVIYXNoKCkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSBpbiBoYXNoKSB7XG4gICAgICAgIGhhc2hbbmFtZV0gJiYgIWlzQXJyYXkoaGFzaFtuYW1lXSkgJiYgKGhhc2hbbmFtZV0gPSBbaGFzaFtuYW1lXV0pXG4gICAgICAgIGhhc2hbbmFtZV0ucHVzaCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBoYXNoW25hbWVdID0gdmFsdWVcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxuXG4gIC8vIFsgeyBuYW1lOiAnbmFtZScsIHZhbHVlOiAndmFsdWUnIH0sIC4uLiBdIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgcmVxd2VzdC5zZXJpYWxpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyID0gW11cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBhcnIucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSlcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgcmVxd2VzdC5zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIHZhciBvcHQsIGZuXG4gICAgICAsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG5cbiAgICBvcHQgPSBhcmdzLnBvcCgpXG4gICAgb3B0ICYmIG9wdC5ub2RlVHlwZSAmJiBhcmdzLnB1c2gob3B0KSAmJiAob3B0ID0gbnVsbClcbiAgICBvcHQgJiYgKG9wdCA9IG9wdC50eXBlKVxuXG4gICAgaWYgKG9wdCA9PSAnbWFwJykgZm4gPSBzZXJpYWxpemVIYXNoXG4gICAgZWxzZSBpZiAob3B0ID09ICdhcnJheScpIGZuID0gcmVxd2VzdC5zZXJpYWxpemVBcnJheVxuICAgIGVsc2UgZm4gPSBzZXJpYWxpemVRdWVyeVN0cmluZ1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cblxuICByZXF3ZXN0LnRvUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAobywgdHJhZCkge1xuICAgIHZhciBwcmVmaXgsIGlcbiAgICAgICwgdHJhZGl0aW9uYWwgPSB0cmFkIHx8IGZhbHNlXG4gICAgICAsIHMgPSBbXVxuICAgICAgLCBlbmMgPSBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICwgYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcbiAgICAgICAgICB2YWx1ZSA9ICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdmFsdWUpID8gdmFsdWUoKSA6ICh2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZSlcbiAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuYyhrZXkpICsgJz0nICsgZW5jKHZhbHVlKVxuICAgICAgICB9XG4gICAgLy8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cbiAgICBpZiAoaXNBcnJheShvKSkge1xuICAgICAgZm9yIChpID0gMDsgbyAmJiBpIDwgby5sZW5ndGg7IGkrKykgYWRkKG9baV0ubmFtZSwgb1tpXS52YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcbiAgICAgIC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuICAgICAgZm9yIChwcmVmaXggaW4gbykge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXgsIG9bcHJlZml4XSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzcGFjZXMgc2hvdWxkIGJlICsgYWNjb3JkaW5nIHRvIHNwZWNcbiAgICByZXR1cm4gcy5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkKSB7XG4gICAgdmFyIG5hbWUsIGksIHZcbiAgICAgICwgcmJyYWNrZXQgPSAvXFxbXFxdJC9cblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuICAgICAgZm9yIChpID0gMDsgb2JqICYmIGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdiA9IG9ialtpXVxuICAgICAgICBpZiAodHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdChwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuICAgICAgICAgIGFkZChwcmVmaXgsIHYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIHYsIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgbmFtZSArICddJywgb2JqW25hbWVdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cbiAgICAgIGFkZChwcmVmaXgsIG9iailcbiAgICB9XG4gIH1cblxuICByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsYmFja1ByZWZpeFxuICB9XG5cbiAgLy8galF1ZXJ5IGFuZCBaZXB0byBjb21wYXRpYmlsaXR5LCBkaWZmZXJlbmNlcyBjYW4gYmUgcmVtYXBwZWQgaGVyZSBzbyB5b3UgY2FuIGNhbGxcbiAgLy8gLmFqYXguY29tcGF0KG9wdGlvbnMsIGNhbGxiYWNrKVxuICByZXF3ZXN0LmNvbXBhdCA9IGZ1bmN0aW9uIChvLCBmbikge1xuICAgIGlmIChvKSB7XG4gICAgICBvLnR5cGUgJiYgKG8ubWV0aG9kID0gby50eXBlKSAmJiBkZWxldGUgby50eXBlXG4gICAgICBvLmRhdGFUeXBlICYmIChvLnR5cGUgPSBvLmRhdGFUeXBlKVxuICAgICAgby5qc29ucENhbGxiYWNrICYmIChvLmpzb25wQ2FsbGJhY2tOYW1lID0gby5qc29ucENhbGxiYWNrKSAmJiBkZWxldGUgby5qc29ucENhbGxiYWNrXG4gICAgICBvLmpzb25wICYmIChvLmpzb25wQ2FsbGJhY2sgPSBvLmpzb25wKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICByZXF3ZXN0LmFqYXhTZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBmb3IgKHZhciBrIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsb2JhbFNldHVwT3B0aW9uc1trXSA9IG9wdGlvbnNba11cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxd2VzdFxufSk7XG4iLCIvKiFcbiAgKiBCZWFuIC0gY29weXJpZ2h0IChjKSBKYWNvYiBUaG9ybnRvbiAyMDExLTIwMTJcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZmF0L2JlYW5cbiAgKiBNSVQgbGljZW5zZVxuICAqL1xuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSkoJ2JlYW4nLCB0aGlzLCBmdW5jdGlvbiAobmFtZSwgY29udGV4dCkge1xuICBuYW1lICAgID0gbmFtZSAgICB8fCAnYmVhbidcbiAgY29udGV4dCA9IGNvbnRleHQgfHwgdGhpc1xuXG4gIHZhciB3aW4gICAgICAgICAgICA9IHdpbmRvd1xuICAgICwgb2xkICAgICAgICAgICAgPSBjb250ZXh0W25hbWVdXG4gICAgLCBuYW1lc3BhY2VSZWdleCA9IC9bXlxcLl0qKD89XFwuLiopXFwufC4qL1xuICAgICwgbmFtZVJlZ2V4ICAgICAgPSAvXFwuLiovXG4gICAgLCBhZGRFdmVudCAgICAgICA9ICdhZGRFdmVudExpc3RlbmVyJ1xuICAgICwgcmVtb3ZlRXZlbnQgICAgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcbiAgICAsIGRvYyAgICAgICAgICAgID0gZG9jdW1lbnQgfHwge31cbiAgICAsIHJvb3QgICAgICAgICAgID0gZG9jLmRvY3VtZW50RWxlbWVudCB8fCB7fVxuICAgICwgVzNDX01PREVMICAgICAgPSByb290W2FkZEV2ZW50XVxuICAgICwgZXZlbnRTdXBwb3J0ICAgPSBXM0NfTU9ERUwgPyBhZGRFdmVudCA6ICdhdHRhY2hFdmVudCdcbiAgICAsIE9ORSAgICAgICAgICAgID0ge30gLy8gc2luZ2xldG9uIGZvciBxdWljayBtYXRjaGluZyBtYWtpbmcgYWRkKCkgZG8gb25lKClcblxuICAgICwgc2xpY2UgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAsIHN0cjJhcnIgICAgICAgID0gZnVuY3Rpb24gKHMsIGQpIHsgcmV0dXJuIHMuc3BsaXQoZCB8fCAnICcpIH1cbiAgICAsIGlzU3RyaW5nICAgICAgID0gZnVuY3Rpb24gKG8pIHsgcmV0dXJuIHR5cGVvZiBvID09ICdzdHJpbmcnIH1cbiAgICAsIGlzRnVuY3Rpb24gICAgID0gZnVuY3Rpb24gKG8pIHsgcmV0dXJuIHR5cGVvZiBvID09ICdmdW5jdGlvbicgfVxuXG4gICAgICAvLyBldmVudHMgdGhhdCB3ZSBjb25zaWRlciB0byBiZSAnbmF0aXZlJywgYW55dGhpbmcgbm90IGluIHRoaXMgbGlzdCB3aWxsXG4gICAgICAvLyBiZSB0cmVhdGVkIGFzIGEgY3VzdG9tIGV2ZW50XG4gICAgLCBzdGFuZGFyZE5hdGl2ZUV2ZW50cyA9XG4gICAgICAgICdjbGljayBkYmxjbGljayBtb3VzZXVwIG1vdXNlZG93biBjb250ZXh0bWVudSAnICAgICAgICAgICAgICAgICAgKyAvLyBtb3VzZSBidXR0b25zXG4gICAgICAgICdtb3VzZXdoZWVsIG1vdXNlbXVsdGl3aGVlbCBET01Nb3VzZVNjcm9sbCAnICAgICAgICAgICAgICAgICAgICAgKyAvLyBtb3VzZSB3aGVlbFxuICAgICAgICAnbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlbW92ZSBzZWxlY3RzdGFydCBzZWxlY3RlbmQgJyAgICAgICAgICAgICsgLy8gbW91c2UgbW92ZW1lbnRcbiAgICAgICAgJ2tleWRvd24ga2V5cHJlc3Mga2V5dXAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGtleWJvYXJkXG4gICAgICAgICdvcmllbnRhdGlvbmNoYW5nZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBtb2JpbGVcbiAgICAgICAgJ2ZvY3VzIGJsdXIgY2hhbmdlIHJlc2V0IHNlbGVjdCBzdWJtaXQgJyAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGZvcm0gZWxlbWVudHNcbiAgICAgICAgJ2xvYWQgdW5sb2FkIGJlZm9yZXVubG9hZCByZXNpemUgbW92ZSBET01Db250ZW50TG9hZGVkICcgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAncmVhZHlzdGF0ZWNoYW5nZSBtZXNzYWdlICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdlcnJvciBhYm9ydCBzY3JvbGwgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtaXNjXG4gICAgICAvLyBlbGVtZW50LmZpcmVFdmVudCgnb25YWVonLi4uIGlzIG5vdCBmb3JnaXZpbmcgaWYgd2UgdHJ5IHRvIGZpcmUgYW4gZXZlbnRcbiAgICAgIC8vIHRoYXQgZG9lc24ndCBhY3R1YWxseSBleGlzdCwgc28gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhlc2Ugb24gbmV3ZXIgYnJvd3NlcnNcbiAgICAsIHczY05hdGl2ZUV2ZW50cyA9XG4gICAgICAgICdzaG93ICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBtb3VzZSBidXR0b25zXG4gICAgICAgICdpbnB1dCBpbnZhbGlkICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBmb3JtIGVsZW1lbnRzXG4gICAgICAgICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCAnICAgICAgICAgICAgICAgICAgICAgKyAvLyB0b3VjaFxuICAgICAgICAnZ2VzdHVyZXN0YXJ0IGdlc3R1cmVjaGFuZ2UgZ2VzdHVyZWVuZCAnICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gZ2VzdHVyZVxuICAgICAgICAndGV4dGlucHV0JyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gVGV4dEV2ZW50XG4gICAgICAgICdyZWFkeXN0YXRlY2hhbmdlIHBhZ2VzaG93IHBhZ2VoaWRlIHBvcHN0YXRlICcgICAgICAgICAgICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ2hhc2hjaGFuZ2Ugb2ZmbGluZSBvbmxpbmUgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAnYWZ0ZXJwcmludCBiZWZvcmVwcmludCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gcHJpbnRpbmdcbiAgICAgICAgJ2RyYWdzdGFydCBkcmFnZW50ZXIgZHJhZ292ZXIgZHJhZ2xlYXZlIGRyYWcgZHJvcCBkcmFnZW5kICcgICAgICArIC8vIGRuZFxuICAgICAgICAnbG9hZHN0YXJ0IHByb2dyZXNzIHN1c3BlbmQgZW1wdGllZCBzdGFsbGVkIGxvYWRtZXRhZGF0YSAnICAgICAgICsgLy8gbWVkaWFcbiAgICAgICAgJ2xvYWRlZGRhdGEgY2FucGxheSBjYW5wbGF5dGhyb3VnaCBwbGF5aW5nIHdhaXRpbmcgc2Vla2luZyAnICAgICArIC8vIG1lZGlhXG4gICAgICAgICdzZWVrZWQgZW5kZWQgZHVyYXRpb25jaGFuZ2UgdGltZXVwZGF0ZSBwbGF5IHBhdXNlIHJhdGVjaGFuZ2UgJyAgKyAvLyBtZWRpYVxuICAgICAgICAndm9sdW1lY2hhbmdlIGN1ZWNoYW5nZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gbWVkaWFcbiAgICAgICAgJ2NoZWNraW5nIG5vdXBkYXRlIGRvd25sb2FkaW5nIGNhY2hlZCB1cGRhdGVyZWFkeSBvYnNvbGV0ZSAnICAgICAgIC8vIGFwcGNhY2hlXG5cbiAgICAgIC8vIGNvbnZlcnQgdG8gYSBoYXNoIGZvciBxdWljayBsb29rdXBzXG4gICAgLCBuYXRpdmVFdmVudHMgPSAoZnVuY3Rpb24gKGhhc2gsIGV2ZW50cywgaSkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSBldmVudHNbaV0gJiYgKGhhc2hbZXZlbnRzW2ldXSA9IDEpXG4gICAgICAgIHJldHVybiBoYXNoXG4gICAgICB9KHt9LCBzdHIyYXJyKHN0YW5kYXJkTmF0aXZlRXZlbnRzICsgKFczQ19NT0RFTCA/IHczY05hdGl2ZUV2ZW50cyA6ICcnKSkpKVxuXG4gICAgICAvLyBjdXN0b20gZXZlbnRzIGFyZSBldmVudHMgdGhhdCB3ZSAqZmFrZSosIHRoZXkgYXJlIG5vdCBwcm92aWRlZCBuYXRpdmVseSBidXRcbiAgICAgIC8vIHdlIGNhbiB1c2UgbmF0aXZlIGV2ZW50cyB0byBnZW5lcmF0ZSB0aGVtXG4gICAgLCBjdXN0b21FdmVudHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gcm9vdFxuICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PT0gMTZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDogJ2NvbnRhaW5zJyBpbiByb290XG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gOSB8fCBjb250YWluZXIgPT09IHdpbmRvdyA/IHJvb3QgOiBjb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lciAhPT0gZWxlbWVudCAmJiBjb250YWluZXIuY29udGFpbnMoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgLCBjaGVjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICB2YXIgcmVsYXRlZCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXRcbiAgICAgICAgICAgICAgcmV0dXJuICFyZWxhdGVkXG4gICAgICAgICAgICAgICAgPyByZWxhdGVkID09IG51bGxcbiAgICAgICAgICAgICAgICA6IChyZWxhdGVkICE9PSB0aGlzICYmIHJlbGF0ZWQucHJlZml4ICE9PSAneHVsJyAmJiAhL2RvY3VtZW50Ly50ZXN0KHRoaXMudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgJiYgIWlzQW5jZXN0b3IocmVsYXRlZCwgdGhpcykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vdXNlZW50ZXI6IHsgYmFzZTogJ21vdXNlb3ZlcicsIGNvbmRpdGlvbjogY2hlY2sgfVxuICAgICAgICAgICwgbW91c2VsZWF2ZTogeyBiYXNlOiAnbW91c2VvdXQnLCBjb25kaXRpb246IGNoZWNrIH1cbiAgICAgICAgICAsIG1vdXNld2hlZWw6IHsgYmFzZTogL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgPyAnRE9NTW91c2VTY3JvbGwnIDogJ21vdXNld2hlZWwnIH1cbiAgICAgICAgfVxuICAgICAgfSgpKVxuXG4gICAgICAvLyB3ZSBwcm92aWRlIGEgY29uc2lzdGVudCBFdmVudCBvYmplY3QgYWNyb3NzIGJyb3dzZXJzIGJ5IHRha2luZyB0aGUgYWN0dWFsIERPTVxuICAgICAgLy8gZXZlbnQgb2JqZWN0IGFuZCBnZW5lcmF0aW5nIGEgbmV3IG9uZSBmcm9tIGl0cyBwcm9wZXJ0aWVzLlxuICAgICwgRXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gYSB3aGl0ZWxpc3Qgb2YgcHJvcGVydGllcyAoZm9yIGRpZmZlcmVudCBldmVudCB0eXBlcykgdGVsbHMgdXMgd2hhdCB0byBjaGVjayBmb3IgYW5kIGNvcHlcbiAgICAgICAgdmFyIGNvbW1vblByb3BzICA9IHN0cjJhcnIoJ2FsdEtleSBhdHRyQ2hhbmdlIGF0dHJOYW1lIGJ1YmJsZXMgY2FuY2VsYWJsZSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgJyArXG4gICAgICAgICAgICAgICdkZXRhaWwgZXZlbnRQaGFzZSBnZXRNb2RpZmllclN0YXRlIGlzVHJ1c3RlZCBtZXRhS2V5IHJlbGF0ZWROb2RlIHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgJyAgK1xuICAgICAgICAgICAgICAnc3JjRWxlbWVudCB0YXJnZXQgdGltZVN0YW1wIHR5cGUgdmlldyB3aGljaCBwcm9wZXJ0eU5hbWUnKVxuICAgICAgICAgICwgbW91c2VQcm9wcyAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2J1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBkYXRhVHJhbnNmZXIgJyAgICAgICtcbiAgICAgICAgICAgICAgJ2Zyb21FbGVtZW50IG9mZnNldFggb2Zmc2V0WSBwYWdlWCBwYWdlWSBzY3JlZW5YIHNjcmVlblkgdG9FbGVtZW50JykpXG4gICAgICAgICAgLCBtb3VzZVdoZWVsUHJvcHMgPSBtb3VzZVByb3BzLmNvbmNhdChzdHIyYXJyKCd3aGVlbERlbHRhIHdoZWVsRGVsdGFYIHdoZWVsRGVsdGFZIHdoZWVsRGVsdGFaICcgK1xuICAgICAgICAgICAgICAnYXhpcycpKSAvLyAnYXhpcycgaXMgRkYgc3BlY2lmaWNcbiAgICAgICAgICAsIGtleVByb3BzICAgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdjaGFyIGNoYXJDb2RlIGtleSBrZXlDb2RlIGtleUlkZW50aWZpZXIgJyAgICAgICAgICArXG4gICAgICAgICAgICAgICdrZXlMb2NhdGlvbiBsb2NhdGlvbicpKVxuICAgICAgICAgICwgdGV4dFByb3BzICAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2RhdGEnKSlcbiAgICAgICAgICAsIHRvdWNoUHJvcHMgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCd0b3VjaGVzIHRhcmdldFRvdWNoZXMgY2hhbmdlZFRvdWNoZXMgc2NhbGUgcm90YXRpb24nKSlcbiAgICAgICAgICAsIG1lc3NhZ2VQcm9wcyA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdkYXRhIG9yaWdpbiBzb3VyY2UnKSlcbiAgICAgICAgICAsIHN0YXRlUHJvcHMgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdzdGF0ZScpKVxuICAgICAgICAgICwgb3Zlck91dFJlZ2V4ID0gL292ZXJ8b3V0L1xuICAgICAgICAgICAgLy8gc29tZSBldmVudCB0eXBlcyBuZWVkIHNwZWNpYWwgaGFuZGxpbmcgYW5kIHNvbWUgbmVlZCBzcGVjaWFsIHByb3BlcnRpZXMsIGRvIHRoYXQgYWxsIGhlcmVcbiAgICAgICAgICAsIHR5cGVGaXhlcnMgICA9IFtcbiAgICAgICAgICAgICAgICB7IC8vIGtleSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAva2V5L2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoZXZlbnQsIG5ld0V2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQua2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgfHwgZXZlbnQud2hpY2hcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIG1vdXNlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9jbGlja3xtb3VzZSg/ISguKndoZWVsfHNjcm9sbCkpfG1lbnV8ZHJhZ3xkcm9wL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoZXZlbnQsIG5ld0V2ZW50LCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQucmlnaHRDbGljayA9IGV2ZW50LndoaWNoID09PSAzIHx8IGV2ZW50LmJ1dHRvbiA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LnBvcyA9IHsgeDogMCwgeTogMCB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnBhZ2VYIHx8IGV2ZW50LnBhZ2VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRYID0gZXZlbnQucGFnZVhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFkgPSBldmVudC5wYWdlWVxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY2xpZW50WCB8fCBldmVudC5jbGllbnRZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRYID0gZXZlbnQuY2xpZW50WCArIGRvYy5ib2R5LnNjcm9sbExlZnQgKyByb290LnNjcm9sbExlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFkgPSBldmVudC5jbGllbnRZICsgZG9jLmJvZHkuc2Nyb2xsVG9wICsgcm9vdC5zY3JvbGxUb3BcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJPdXRSZWdleC50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5yZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBldmVudFsodHlwZSA9PSAnbW91c2VvdmVyJyA/ICdmcm9tJyA6ICd0bycpICsgJ0VsZW1lbnQnXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW91c2VQcm9wc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gbW91c2Ugd2hlZWwgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL21vdXNlLiood2hlZWx8c2Nyb2xsKS9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbW91c2VXaGVlbFByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBUZXh0RXZlbnRcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXnRleHQvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRleHRQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gdG91Y2ggYW5kIGdlc3R1cmUgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL150b3VjaHxeZ2VzdHVyZS9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdG91Y2hQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gbWVzc2FnZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXm1lc3NhZ2UkL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtZXNzYWdlUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIHBvcHN0YXRlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9ecG9wc3RhdGUkL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdGF0ZVByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvLiovXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29tbW9uUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICAsIHR5cGVGaXhlck1hcCA9IHt9IC8vIHVzZWQgdG8gbWFwIGV2ZW50IHR5cGVzIHRvIGZpeGVyIGZ1bmN0aW9ucyAoYWJvdmUpLCBhIGJhc2ljIGNhY2hlIG1lY2hhbmlzbVxuXG4gICAgICAgICAgLCBFdmVudCA9IGZ1bmN0aW9uIChldmVudCwgZWxlbWVudCwgaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm5cbiAgICAgICAgICAgICAgZXZlbnQgPSBldmVudCB8fCAoKGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCBlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQpLnBhcmVudFdpbmRvdyB8fCB3aW4pLmV2ZW50XG4gICAgICAgICAgICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IGV2ZW50XG4gICAgICAgICAgICAgIHRoaXMuaXNOYXRpdmUgICAgICAgPSBpc05hdGl2ZVxuICAgICAgICAgICAgICB0aGlzLmlzQmVhbiAgICAgICAgID0gdHJ1ZVxuXG4gICAgICAgICAgICAgIGlmICghZXZlbnQpIHJldHVyblxuXG4gICAgICAgICAgICAgIHZhciB0eXBlICAgPSBldmVudC50eXBlXG4gICAgICAgICAgICAgICAgLCB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudFxuICAgICAgICAgICAgICAgICwgaSwgbCwgcCwgcHJvcHMsIGZpeGVyXG5cbiAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQgJiYgdGFyZ2V0Lm5vZGVUeXBlID09PSAzID8gdGFyZ2V0LnBhcmVudE5vZGUgOiB0YXJnZXRcblxuICAgICAgICAgICAgICBpZiAoaXNOYXRpdmUpIHsgLy8gd2Ugb25seSBuZWVkIGJhc2ljIGF1Z21lbnRhdGlvbiBvbiBjdXN0b20gZXZlbnRzLCB0aGUgcmVzdCBleHBlbnNpdmUgJiBwb2ludGxlc3NcbiAgICAgICAgICAgICAgICBmaXhlciA9IHR5cGVGaXhlck1hcFt0eXBlXVxuICAgICAgICAgICAgICAgIGlmICghZml4ZXIpIHsgLy8gaGF2ZW4ndCBlbmNvdW50ZXJlZCB0aGlzIGV2ZW50IHR5cGUgYmVmb3JlLCBtYXAgYSBmaXhlciBmdW5jdGlvbiBmb3IgaXRcbiAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSB0eXBlRml4ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUZpeGVyc1tpXS5yZWcudGVzdCh0eXBlKSkgeyAvLyBndWFyYW50ZWVkIHRvIG1hdGNoIGF0IGxlYXN0IG9uZSwgbGFzdCBpcyAuKlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGVGaXhlck1hcFt0eXBlXSA9IGZpeGVyID0gdHlwZUZpeGVyc1tpXS5maXhcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJvcHMgPSBmaXhlcihldmVudCwgdGhpcywgdHlwZSlcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBwcm9wcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICAgIGlmICghKChwID0gcHJvcHNbaV0pIGluIHRoaXMpICYmIHAgaW4gZXZlbnQpIHRoaXNbcF0gPSBldmVudFtwXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZXZlbnREZWZhdWx0KCkgYW5kIHN0b3BQcm9wYWdhdGlvbigpIGFyZSBhIGNvbnNpc3RlbnQgaW50ZXJmYWNlIHRvIHRob3NlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBvbiB0aGUgRE9NLCBzdG9wKCkgaXMgYW4gYWxpYXMgZm9yIGJvdGggb2YgdGhlbSB0b2dldGhlclxuICAgICAgICBFdmVudC5wcm90b3R5cGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCkgdGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICBlbHNlIHRoaXMub3JpZ2luYWxFdmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbikgdGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgZWxzZSB0aGlzLm9yaWdpbmFsRXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgLy8gc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgaGFzIHRvIGJlIGhhbmRsZWQgaW50ZXJuYWxseSBiZWNhdXNlIHdlIG1hbmFnZSB0aGUgZXZlbnQgbGlzdCBmb3JcbiAgICAgICAgLy8gZWFjaCBlbGVtZW50XG4gICAgICAgIC8vIG5vdGUgdGhhdCBvcmlnaW5hbEVsZW1lbnQgbWF5IGJlIGEgQmVhbiNFdmVudCBvYmplY3QgaW4gc29tZSBzaXR1YXRpb25zXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHRoaXMub3JpZ2luYWxFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKVxuICAgICAgICAgIHRoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlIH1cbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxFdmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCAmJiB0aGlzLm9yaWdpbmFsRXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uIChjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgLy9UT0RPOiB0aGlzIGlzIHJpcGUgZm9yIG9wdGltaXNhdGlvbiwgbmV3IGV2ZW50cyBhcmUgKmV4cGVuc2l2ZSpcbiAgICAgICAgICAvLyBpbXByb3ZpbmcgdGhpcyB3aWxsIHNwZWVkIHVwIGRlbGVnYXRlZCBldmVudHNcbiAgICAgICAgICB2YXIgbmUgPSBuZXcgRXZlbnQodGhpcywgdGhpcy5lbGVtZW50LCB0aGlzLmlzTmF0aXZlKVxuICAgICAgICAgIG5lLmN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0XG4gICAgICAgICAgcmV0dXJuIG5lXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gRXZlbnRcbiAgICAgIH0oKSlcblxuICAgICAgLy8gaWYgd2UncmUgaW4gb2xkIElFIHdlIGNhbid0IGRvIG9ucHJvcGVydHljaGFuZ2Ugb24gZG9jIG9yIHdpbiBzbyB3ZSB1c2UgZG9jLmRvY3VtZW50RWxlbWVudCBmb3IgYm90aFxuICAgICwgdGFyZ2V0RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBpc05hdGl2ZSkge1xuICAgICAgICByZXR1cm4gIVczQ19NT0RFTCAmJiAhaXNOYXRpdmUgJiYgKGVsZW1lbnQgPT09IGRvYyB8fCBlbGVtZW50ID09PSB3aW4pID8gcm9vdCA6IGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogQmVhbiBtYWludGFpbnMgYW4gaW50ZXJuYWwgcmVnaXN0cnkgZm9yIGV2ZW50IGxpc3RlbmVycy4gV2UgZG9uJ3QgdG91Y2ggZWxlbWVudHMsIG9iamVjdHNcbiAgICAgICAgKiBvciBmdW5jdGlvbnMgdG8gaWRlbnRpZnkgdGhlbSwgaW5zdGVhZCB3ZSBzdG9yZSBldmVyeXRoaW5nIGluIHRoZSByZWdpc3RyeS5cbiAgICAgICAgKiBFYWNoIGV2ZW50IGxpc3RlbmVyIGhhcyBhIFJlZ0VudHJ5IG9iamVjdCwgd2UgaGF2ZSBvbmUgJ3JlZ2lzdHJ5JyBmb3IgdGhlIHdob2xlIGluc3RhbmNlLlxuICAgICAgICAqL1xuICAgICwgUmVnRW50cnkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBlYWNoIGhhbmRsZXIgaXMgd3JhcHBlZCBzbyB3ZSBjYW4gaGFuZGxlIGRlbGVnYXRpb24gYW5kIGN1c3RvbSBldmVudHNcbiAgICAgICAgdmFyIHdyYXBwZWRIYW5kbGVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZuLCBjb25kaXRpb24sIGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBjYWxsID0gZnVuY3Rpb24gKGV2ZW50LCBlYXJncykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIGFyZ3MgPyBzbGljZS5jYWxsKGVhcmdzLCBldmVudCA/IDAgOiAxKS5jb25jYXQoYXJncykgOiBlYXJncylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgZmluZFRhcmdldCA9IGZ1bmN0aW9uIChldmVudCwgZXZlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZm4uX19iZWFuRGVsID8gZm4uX19iZWFuRGVsLmZ0KGV2ZW50LnRhcmdldCwgZWxlbWVudCkgOiBldmVudEVsZW1lbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgaGFuZGxlciA9IGNvbmRpdGlvblxuICAgICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZmluZFRhcmdldChldmVudCwgdGhpcykgLy8gZGVsZWF0ZWQgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uZGl0aW9uLmFwcGx5KHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50KSBldmVudC5jdXJyZW50VGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbChldmVudCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZm4uX19iZWFuRGVsKSBldmVudCA9IGV2ZW50LmNsb25lKGZpbmRUYXJnZXQoZXZlbnQpKSAvLyBkZWxlZ2F0ZWQgZXZlbnQsIGZpeCB0aGUgZml4XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGwoZXZlbnQsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFuZGxlci5fX2JlYW5EZWwgPSBmbi5fX2JlYW5EZWxcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyXG4gICAgICAgICAgfVxuXG4gICAgICAgICwgUmVnRW50cnkgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgaGFuZGxlciwgb3JpZ2luYWwsIG5hbWVzcGFjZXMsIGFyZ3MsIHJvb3QpIHtcbiAgICAgICAgICAgIHZhciBjdXN0b21UeXBlICAgICA9IGN1c3RvbUV2ZW50c1t0eXBlXVxuICAgICAgICAgICAgICAsIGlzTmF0aXZlXG5cbiAgICAgICAgICAgIGlmICh0eXBlID09ICd1bmxvYWQnKSB7XG4gICAgICAgICAgICAgIC8vIHNlbGYgY2xlYW4tdXBcbiAgICAgICAgICAgICAgaGFuZGxlciA9IG9uY2UocmVtb3ZlTGlzdGVuZXIsIGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIsIG9yaWdpbmFsKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3VzdG9tVHlwZSkge1xuICAgICAgICAgICAgICBpZiAoY3VzdG9tVHlwZS5jb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gd3JhcHBlZEhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY3VzdG9tVHlwZS5jb25kaXRpb24sIGFyZ3MpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHlwZSA9IGN1c3RvbVR5cGUuYmFzZSB8fCB0eXBlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNOYXRpdmUgICAgICA9IGlzTmF0aXZlID0gbmF0aXZlRXZlbnRzW3R5cGVdICYmICEhZWxlbWVudFtldmVudFN1cHBvcnRdXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVR5cGUgICAgPSAhVzNDX01PREVMICYmICFpc05hdGl2ZSAmJiB0eXBlXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgICAgICAgPSBlbGVtZW50XG4gICAgICAgICAgICB0aGlzLnR5cGUgICAgICAgICAgPSB0eXBlXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsICAgICAgPSBvcmlnaW5hbFxuICAgICAgICAgICAgdGhpcy5uYW1lc3BhY2VzICAgID0gbmFtZXNwYWNlc1xuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgICAgID0gVzNDX01PREVMIHx8IGlzTmF0aXZlID8gdHlwZSA6ICdwcm9wZXJ0eWNoYW5nZSdcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ICAgICAgICA9IHRhcmdldEVsZW1lbnQoZWxlbWVudCwgaXNOYXRpdmUpXG4gICAgICAgICAgICB0aGlzW2V2ZW50U3VwcG9ydF0gPSAhIXRoaXMudGFyZ2V0W2V2ZW50U3VwcG9ydF1cbiAgICAgICAgICAgIHRoaXMucm9vdCAgICAgICAgICA9IHJvb3RcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlciAgICAgICA9IHdyYXBwZWRIYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIG51bGwsIGFyZ3MpXG4gICAgICAgICAgfVxuXG4gICAgICAgIC8vIGdpdmVuIGEgbGlzdCBvZiBuYW1lc3BhY2VzLCBpcyBvdXIgZW50cnkgaW4gYW55IG9mIHRoZW0/XG4gICAgICAgIFJlZ0VudHJ5LnByb3RvdHlwZS5pbk5hbWVzcGFjZXMgPSBmdW5jdGlvbiAoY2hlY2tOYW1lc3BhY2VzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGMgPSAwXG4gICAgICAgICAgaWYgKCFjaGVja05hbWVzcGFjZXMpIHJldHVybiB0cnVlXG4gICAgICAgICAgaWYgKCF0aGlzLm5hbWVzcGFjZXMpIHJldHVybiBmYWxzZVxuICAgICAgICAgIGZvciAoaSA9IGNoZWNrTmFtZXNwYWNlcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IHRoaXMubmFtZXNwYWNlcy5sZW5ndGg7IGotLTspIHtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrTmFtZXNwYWNlc1tpXSA9PSB0aGlzLm5hbWVzcGFjZXNbal0pIGMrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hlY2tOYW1lc3BhY2VzLmxlbmd0aCA9PT0gY1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWF0Y2ggYnkgZWxlbWVudCwgb3JpZ2luYWwgZm4gKG9wdCksIGhhbmRsZXIgZm4gKG9wdClcbiAgICAgICAgUmVnRW50cnkucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAoY2hlY2tFbGVtZW50LCBjaGVja09yaWdpbmFsLCBjaGVja0hhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50ID09PSBjaGVja0VsZW1lbnQgJiZcbiAgICAgICAgICAgICghY2hlY2tPcmlnaW5hbCB8fCB0aGlzLm9yaWdpbmFsID09PSBjaGVja09yaWdpbmFsKSAmJlxuICAgICAgICAgICAgKCFjaGVja0hhbmRsZXIgfHwgdGhpcy5oYW5kbGVyID09PSBjaGVja0hhbmRsZXIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVnRW50cnlcbiAgICAgIH0oKSlcblxuICAgICwgcmVnaXN0cnkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBvdXIgbWFwIHN0b3JlcyBhcnJheXMgYnkgZXZlbnQgdHlwZSwganVzdCBiZWNhdXNlIGl0J3MgYmV0dGVyIHRoYW4gc3RvcmluZ1xuICAgICAgICAvLyBldmVyeXRoaW5nIGluIGEgc2luZ2xlIGFycmF5LlxuICAgICAgICAvLyB1c2VzICckJyBhcyBhIHByZWZpeCBmb3IgdGhlIGtleXMgZm9yIHNhZmV0eSBhbmQgJ3InIGFzIGEgc3BlY2lhbCBwcmVmaXggZm9yXG4gICAgICAgIC8vIHJvb3RMaXN0ZW5lcnMgc28gd2UgY2FuIGxvb2sgdGhlbSB1cCBmYXN0XG4gICAgICAgIHZhciBtYXAgPSB7fVxuXG4gICAgICAgICAgLy8gZ2VuZXJpYyBmdW5jdGlvbmFsIHNlYXJjaCBvZiBvdXIgcmVnaXN0cnkgZm9yIG1hdGNoaW5nIGxpc3RlbmVycyxcbiAgICAgICAgICAvLyBgZm5gIHJldHVybnMgZmFsc2UgdG8gYnJlYWsgb3V0IG9mIHRoZSBsb29wXG4gICAgICAgICAgLCBmb3JBbGwgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIGhhbmRsZXIsIHJvb3QsIGZuKSB7XG4gICAgICAgICAgICAgIHZhciBwZnggPSByb290ID8gJ3InIDogJyQnXG4gICAgICAgICAgICAgIGlmICghdHlwZSB8fCB0eXBlID09ICcqJykge1xuICAgICAgICAgICAgICAgIC8vIHNlYXJjaCB0aGUgd2hvbGUgcmVnaXN0cnlcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0IGluIG1hcCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHQuY2hhckF0KDApID09IHBmeCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JBbGwoZWxlbWVudCwgdC5zdWJzdHIoMSksIG9yaWdpbmFsLCBoYW5kbGVyLCByb290LCBmbilcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBsLCBsaXN0ID0gbWFwW3BmeCArIHR5cGVdLCBhbGwgPSBlbGVtZW50ID09ICcqJ1xuICAgICAgICAgICAgICAgIGlmICghbGlzdCkgcmV0dXJuXG4gICAgICAgICAgICAgICAgZm9yIChsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmICgoYWxsIHx8IGxpc3RbaV0ubWF0Y2hlcyhlbGVtZW50LCBvcmlnaW5hbCwgaGFuZGxlcikpICYmICFmbihsaXN0W2ldLCBsaXN0LCBpLCB0eXBlKSkgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIGhhcyA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgcm9vdCkge1xuICAgICAgICAgICAgICAvLyB3ZSdyZSBub3QgdXNpbmcgZm9yQWxsIGhlcmUgc2ltcGx5IGJlY2F1c2UgaXQncyBhIGJpdCBzbG93ZXIgYW5kIHRoaXNcbiAgICAgICAgICAgICAgLy8gbmVlZHMgdG8gYmUgZmFzdFxuICAgICAgICAgICAgICB2YXIgaSwgbGlzdCA9IG1hcFsocm9vdCA/ICdyJyA6ICckJykgKyB0eXBlXVxuICAgICAgICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxpc3RbaV0ucm9vdCAmJiBsaXN0W2ldLm1hdGNoZXMoZWxlbWVudCwgb3JpZ2luYWwsIG51bGwpKSByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgZ2V0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCByb290KSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyaWVzID0gW11cbiAgICAgICAgICAgICAgZm9yQWxsKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCBudWxsLCByb290LCBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cmllcy5wdXNoKGVudHJ5KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm4gZW50cmllc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBwdXQgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgdmFyIGhhcyA9ICFlbnRyeS5yb290ICYmICF0aGlzLmhhcyhlbnRyeS5lbGVtZW50LCBlbnRyeS50eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAsIGtleSA9IChlbnRyeS5yb290ID8gJ3InIDogJyQnKSArIGVudHJ5LnR5cGVcbiAgICAgICAgICAgICAgOyhtYXBba2V5XSB8fCAobWFwW2tleV0gPSBbXSkpLnB1c2goZW50cnkpXG4gICAgICAgICAgICAgIHJldHVybiBoYXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgZGVsID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIGZvckFsbChlbnRyeS5lbGVtZW50LCBlbnRyeS50eXBlLCBudWxsLCBlbnRyeS5oYW5kbGVyLCBlbnRyeS5yb290LCBmdW5jdGlvbiAoZW50cnksIGxpc3QsIGkpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIGVudHJ5LnJlbW92ZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSBkZWxldGUgbWFwWyhlbnRyeS5yb290ID8gJ3InIDogJyQnKSArIGVudHJ5LnR5cGVdXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGR1bXAgYWxsIGVudHJpZXMsIHVzZWQgZm9yIG9udW5sb2FkXG4gICAgICAgICAgLCBlbnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgdCwgZW50cmllcyA9IFtdXG4gICAgICAgICAgICAgIGZvciAodCBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJyQnKSBlbnRyaWVzID0gZW50cmllcy5jb25jYXQobWFwW3RdKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgaGFzOiBoYXMsIGdldDogZ2V0LCBwdXQ6IHB1dCwgZGVsOiBkZWwsIGVudHJpZXM6IGVudHJpZXMgfVxuICAgICAgfSgpKVxuXG4gICAgICAvLyB3ZSBuZWVkIGEgc2VsZWN0b3IgZW5naW5lIGZvciBkZWxlZ2F0ZWQgZXZlbnRzLCB1c2UgcXVlcnlTZWxlY3RvckFsbCBpZiBpdCBleGlzdHNcbiAgICAgIC8vIGJ1dCBmb3Igb2xkZXIgYnJvd3NlcnMgd2UgbmVlZCBRd2VyeSwgU2l6emxlIG9yIHNpbWlsYXJcbiAgICAsIHNlbGVjdG9yRW5naW5lXG4gICAgLCBzZXRTZWxlY3RvckVuZ2luZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGVjdG9yRW5naW5lID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGxcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKHMsIHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5xdWVyeVNlbGVjdG9yQWxsKHMpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmVhbjogTm8gc2VsZWN0b3IgZW5naW5lIGluc3RhbGxlZCcpIC8vIGVlZWtcbiAgICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdG9yRW5naW5lID0gZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdlIGF0dGFjaCB0aGlzIGxpc3RlbmVyIHRvIGVhY2ggRE9NIGV2ZW50IHRoYXQgd2UgbmVlZCB0byBsaXN0ZW4gdG8sIG9ubHkgb25jZVxuICAgICAgLy8gcGVyIGV2ZW50IHR5cGUgcGVyIERPTSBlbGVtZW50XG4gICAgLCByb290TGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQsIHR5cGUpIHtcbiAgICAgICAgaWYgKCFXM0NfTU9ERUwgJiYgdHlwZSAmJiBldmVudCAmJiBldmVudC5wcm9wZXJ0eU5hbWUgIT0gJ19vbicgKyB0eXBlKSByZXR1cm5cblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gcmVnaXN0cnkuZ2V0KHRoaXMsIHR5cGUgfHwgZXZlbnQudHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgLCBsID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgICAgICwgaSA9IDBcblxuICAgICAgICBldmVudCA9IG5ldyBFdmVudChldmVudCwgdGhpcywgdHJ1ZSlcbiAgICAgICAgaWYgKHR5cGUpIGV2ZW50LnR5cGUgPSB0eXBlXG5cbiAgICAgICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGFsbCBoYW5kbGVycyByZWdpc3RlcmVkIGZvciB0aGlzIHR5cGUsIGNhbGxpbmcgdGhlbSB1bmxlc3MgdGhleSBoYXZlXG4gICAgICAgIC8vIGJlZW4gcmVtb3ZlZCBieSBhIHByZXZpb3VzIGhhbmRsZXIgb3Igc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgaGFzIGJlZW4gY2FsbGVkXG4gICAgICAgIGZvciAoOyBpIDwgbCAmJiAhZXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKTsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnNbaV0ucmVtb3ZlZCkgbGlzdGVuZXJzW2ldLmhhbmRsZXIuY2FsbCh0aGlzLCBldmVudClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgYW5kIHJlbW92ZSBsaXN0ZW5lcnMgdG8gRE9NIGVsZW1lbnRzXG4gICAgLCBsaXN0ZW5lciA9IFczQ19NT0RFTFxuICAgICAgICA/IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBhZGQpIHtcbiAgICAgICAgICAgIC8vIG5ldyBicm93c2Vyc1xuICAgICAgICAgICAgZWxlbWVudFthZGQgPyBhZGRFdmVudCA6IHJlbW92ZUV2ZW50XSh0eXBlLCByb290TGlzdGVuZXIsIGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgYWRkLCBjdXN0b20pIHtcbiAgICAgICAgICAgIC8vIElFOCBhbmQgYmVsb3csIHVzZSBhdHRhY2hFdmVudC9kZXRhY2hFdmVudCBhbmQgd2UgaGF2ZSB0byBwaWdneS1iYWNrIHByb3BlcnR5Y2hhbmdlIGV2ZW50c1xuICAgICAgICAgICAgLy8gdG8gc2ltdWxhdGUgZXZlbnQgYnViYmxpbmcgZXRjLlxuICAgICAgICAgICAgdmFyIGVudHJ5XG4gICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgIHJlZ2lzdHJ5LnB1dChlbnRyeSA9IG5ldyBSZWdFbnRyeShcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAsIGN1c3RvbSB8fCB0eXBlXG4gICAgICAgICAgICAgICAgLCBmdW5jdGlvbiAoZXZlbnQpIHsgLy8gaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICByb290TGlzdGVuZXIuY2FsbChlbGVtZW50LCBldmVudCwgY3VzdG9tKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICwgcm9vdExpc3RlbmVyXG4gICAgICAgICAgICAgICAgLCBudWxsXG4gICAgICAgICAgICAgICAgLCBudWxsXG4gICAgICAgICAgICAgICAgLCB0cnVlIC8vIGlzIHJvb3RcbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgaWYgKGN1c3RvbSAmJiBlbGVtZW50Wydfb24nICsgY3VzdG9tXSA9PSBudWxsKSBlbGVtZW50Wydfb24nICsgY3VzdG9tXSA9IDBcbiAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LmF0dGFjaEV2ZW50KCdvbicgKyBlbnRyeS5ldmVudFR5cGUsIGVudHJ5LmhhbmRsZXIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbnRyeSA9IHJlZ2lzdHJ5LmdldChlbGVtZW50LCBjdXN0b20gfHwgdHlwZSwgcm9vdExpc3RlbmVyLCB0cnVlKVswXVxuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS50YXJnZXQuZGV0YWNoRXZlbnQoJ29uJyArIGVudHJ5LmV2ZW50VHlwZSwgZW50cnkuaGFuZGxlcilcbiAgICAgICAgICAgICAgICByZWdpc3RyeS5kZWwoZW50cnkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAsIG9uY2UgPSBmdW5jdGlvbiAocm0sIGVsZW1lbnQsIHR5cGUsIGZuLCBvcmlnaW5hbEZuKSB7XG4gICAgICAgIC8vIHdyYXAgdGhlIGhhbmRsZXIgaW4gYSBoYW5kbGVyIHRoYXQgZG9lcyBhIHJlbW92ZSBhcyB3ZWxsXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJtKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsRm4pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgcmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3JnVHlwZSwgaGFuZGxlciwgbmFtZXNwYWNlcykge1xuICAgICAgICB2YXIgdHlwZSAgICAgPSBvcmdUeXBlICYmIG9yZ1R5cGUucmVwbGFjZShuYW1lUmVnZXgsICcnKVxuICAgICAgICAgICwgaGFuZGxlcnMgPSByZWdpc3RyeS5nZXQoZWxlbWVudCwgdHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgLCByZW1vdmVkICA9IHt9XG4gICAgICAgICAgLCBpLCBsXG5cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmICgoIWhhbmRsZXIgfHwgaGFuZGxlcnNbaV0ub3JpZ2luYWwgPT09IGhhbmRsZXIpICYmIGhhbmRsZXJzW2ldLmluTmFtZXNwYWNlcyhuYW1lc3BhY2VzKSkge1xuICAgICAgICAgICAgLy8gVE9ETzogdGhpcyBpcyBwcm9ibGVtYXRpYywgd2UgaGF2ZSBhIHJlZ2lzdHJ5LmdldCgpIGFuZCByZWdpc3RyeS5kZWwoKSB0aGF0XG4gICAgICAgICAgICAvLyBib3RoIGRvIHJlZ2lzdHJ5IHNlYXJjaGVzIHNvIHdlIHdhc3RlIGN5Y2xlcyBkb2luZyB0aGlzLiBOZWVkcyB0byBiZSByb2xsZWQgaW50b1xuICAgICAgICAgICAgLy8gYSBzaW5nbGUgcmVnaXN0cnkuZm9yQWxsKGZuKSB0aGF0IHJlbW92ZXMgd2hpbGUgZmluZGluZywgYnV0IHRoZSBjYXRjaCBpcyB0aGF0XG4gICAgICAgICAgICAvLyB3ZSdsbCBiZSBzcGxpY2luZyB0aGUgYXJyYXlzIHRoYXQgd2UncmUgaXRlcmF0aW5nIG92ZXIuIE5lZWRzIGV4dHJhIHRlc3RzIHRvXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3Qgc2NyZXcgaXQgdXAuIEBydmFnZ1xuICAgICAgICAgICAgcmVnaXN0cnkuZGVsKGhhbmRsZXJzW2ldKVxuICAgICAgICAgICAgaWYgKCFyZW1vdmVkW2hhbmRsZXJzW2ldLmV2ZW50VHlwZV0gJiYgaGFuZGxlcnNbaV1bZXZlbnRTdXBwb3J0XSlcbiAgICAgICAgICAgICAgcmVtb3ZlZFtoYW5kbGVyc1tpXS5ldmVudFR5cGVdID0geyB0OiBoYW5kbGVyc1tpXS5ldmVudFR5cGUsIGM6IGhhbmRsZXJzW2ldLnR5cGUgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBlYWNoIHR5cGUvZWxlbWVudCBmb3IgcmVtb3ZlZCBsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGUgcm9vdExpc3RlbmVyIHdoZXJlIGl0J3Mgbm8gbG9uZ2VyIG5lZWRlZFxuICAgICAgICBmb3IgKGkgaW4gcmVtb3ZlZCkge1xuICAgICAgICAgIGlmICghcmVnaXN0cnkuaGFzKGVsZW1lbnQsIHJlbW92ZWRbaV0udCwgbnVsbCwgZmFsc2UpKSB7XG4gICAgICAgICAgICAvLyBsYXN0IGxpc3RlbmVyIG9mIHRoaXMgdHlwZSwgcmVtb3ZlIHRoZSByb290TGlzdGVuZXJcbiAgICAgICAgICAgIGxpc3RlbmVyKGVsZW1lbnQsIHJlbW92ZWRbaV0udCwgZmFsc2UsIHJlbW92ZWRbaV0uYylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHVwIGEgZGVsZWdhdGUgaGVscGVyIHVzaW5nIHRoZSBnaXZlbiBzZWxlY3Rvciwgd3JhcCB0aGUgaGFuZGxlciBmdW5jdGlvblxuICAgICwgZGVsZWdhdGUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGZuKSB7XG4gICAgICAgIC8vVE9ETzogZmluZFRhcmdldCAodGhlcmVmb3JlICQpIGlzIGNhbGxlZCB0d2ljZSwgb25jZSBmb3IgbWF0Y2ggYW5kIG9uY2UgZm9yXG4gICAgICAgIC8vIHNldHRpbmcgZS5jdXJyZW50VGFyZ2V0LCBmaXggdGhpcyBzbyBpdCdzIG9ubHkgbmVlZGVkIG9uY2VcbiAgICAgICAgdmFyIGZpbmRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0LCByb290KSB7XG4gICAgICAgICAgICAgIHZhciBpLCBhcnJheSA9IGlzU3RyaW5nKHNlbGVjdG9yKSA/IHNlbGVjdG9yRW5naW5lKHNlbGVjdG9yLCByb290KSA6IHNlbGVjdG9yXG4gICAgICAgICAgICAgIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSByb290OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IGFycmF5Lmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0YXJnZXQpIHJldHVybiB0YXJnZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAsIGhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBmaW5kVGFyZ2V0KGUudGFyZ2V0LCB0aGlzKVxuICAgICAgICAgICAgICBpZiAobWF0Y2gpIGZuLmFwcGx5KG1hdGNoLCBhcmd1bWVudHMpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gX19iZWFuRGVsIGlzbid0IHBsZWFzYW50IGJ1dCBpdCdzIGEgcHJpdmF0ZSBmdW5jdGlvbiwgbm90IGV4cG9zZWQgb3V0c2lkZSBvZiBCZWFuXG4gICAgICAgIGhhbmRsZXIuX19iZWFuRGVsID0ge1xuICAgICAgICAgICAgZnQgICAgICAgOiBmaW5kVGFyZ2V0IC8vIGF0dGFjaCBpdCBoZXJlIGZvciBjdXN0b21FdmVudHMgdG8gdXNlIHRvb1xuICAgICAgICAgICwgc2VsZWN0b3IgOiBzZWxlY3RvclxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVyXG4gICAgICB9XG5cbiAgICAsIGZpcmVMaXN0ZW5lciA9IFczQ19NT0RFTCA/IGZ1bmN0aW9uIChpc05hdGl2ZSwgdHlwZSwgZWxlbWVudCkge1xuICAgICAgICAvLyBtb2Rlcm4gYnJvd3NlcnMsIGRvIGEgcHJvcGVyIGRpc3BhdGNoRXZlbnQoKVxuICAgICAgICB2YXIgZXZ0ID0gZG9jLmNyZWF0ZUV2ZW50KGlzTmF0aXZlID8gJ0hUTUxFdmVudHMnIDogJ1VJRXZlbnRzJylcbiAgICAgICAgZXZ0W2lzTmF0aXZlID8gJ2luaXRFdmVudCcgOiAnaW5pdFVJRXZlbnQnXSh0eXBlLCB0cnVlLCB0cnVlLCB3aW4sIDEpXG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgICB9IDogZnVuY3Rpb24gKGlzTmF0aXZlLCB0eXBlLCBlbGVtZW50KSB7XG4gICAgICAgIC8vIG9sZCBicm93c2VyIHVzZSBvbnByb3BlcnR5Y2hhbmdlLCBqdXN0IGluY3JlbWVudCBhIGN1c3RvbSBwcm9wZXJ0eSB0byB0cmlnZ2VyIHRoZSBldmVudFxuICAgICAgICBlbGVtZW50ID0gdGFyZ2V0RWxlbWVudChlbGVtZW50LCBpc05hdGl2ZSlcbiAgICAgICAgaXNOYXRpdmUgPyBlbGVtZW50LmZpcmVFdmVudCgnb24nICsgdHlwZSwgZG9jLmNyZWF0ZUV2ZW50T2JqZWN0KCkpIDogZWxlbWVudFsnX29uJyArIHR5cGVdKytcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogUHVibGljIEFQSTogb2ZmKCksIG9uKCksIGFkZCgpLCAocmVtb3ZlKCkpLCBvbmUoKSwgZmlyZSgpLCBjbG9uZSgpXG4gICAgICAgICovXG5cbiAgICAgIC8qKlxuICAgICAgICAqIG9mZihlbGVtZW50WywgZXZlbnRUeXBlKHMpWywgaGFuZGxlciBdXSlcbiAgICAgICAgKi9cbiAgICAsIG9mZiA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlU3BlYywgZm4pIHtcbiAgICAgICAgdmFyIGlzVHlwZVN0ciA9IGlzU3RyaW5nKHR5cGVTcGVjKVxuICAgICAgICAgICwgaywgdHlwZSwgbmFtZXNwYWNlcywgaVxuXG4gICAgICAgIGlmIChpc1R5cGVTdHIgJiYgdHlwZVNwZWMuaW5kZXhPZignICcpID4gMCkge1xuICAgICAgICAgIC8vIG9mZihlbCwgJ3QxIHQyIHQzJywgZm4pIG9yIG9mZihlbCwgJ3QxIHQyIHQzJylcbiAgICAgICAgICB0eXBlU3BlYyA9IHN0cjJhcnIodHlwZVNwZWMpXG4gICAgICAgICAgZm9yIChpID0gdHlwZVNwZWMubGVuZ3RoOyBpLS07KVxuICAgICAgICAgICAgb2ZmKGVsZW1lbnQsIHR5cGVTcGVjW2ldLCBmbilcbiAgICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9IGlzVHlwZVN0ciAmJiB0eXBlU3BlYy5yZXBsYWNlKG5hbWVSZWdleCwgJycpXG4gICAgICAgIGlmICh0eXBlICYmIGN1c3RvbUV2ZW50c1t0eXBlXSkgdHlwZSA9IGN1c3RvbUV2ZW50c1t0eXBlXS5iYXNlXG5cbiAgICAgICAgaWYgKCF0eXBlU3BlYyB8fCBpc1R5cGVTdHIpIHtcbiAgICAgICAgICAvLyBvZmYoZWwpIG9yIG9mZihlbCwgdDEubnMpIG9yIG9mZihlbCwgLm5zKSBvciBvZmYoZWwsIC5uczEubnMyLm5zMylcbiAgICAgICAgICBpZiAobmFtZXNwYWNlcyA9IGlzVHlwZVN0ciAmJiB0eXBlU3BlYy5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpIG5hbWVzcGFjZXMgPSBzdHIyYXJyKG5hbWVzcGFjZXMsICcuJylcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcihlbGVtZW50LCB0eXBlLCBmbiwgbmFtZXNwYWNlcylcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHR5cGVTcGVjKSkge1xuICAgICAgICAgIC8vIG9mZihlbCwgZm4pXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZWxlbWVudCwgbnVsbCwgdHlwZVNwZWMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gb2ZmKGVsLCB7IHQxOiBmbjEsIHQyLCBmbjIgfSlcbiAgICAgICAgICBmb3IgKGsgaW4gdHlwZVNwZWMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlU3BlYy5oYXNPd25Qcm9wZXJ0eShrKSkgb2ZmKGVsZW1lbnQsIGssIHR5cGVTcGVjW2tdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIG9uKGVsZW1lbnQsIGV2ZW50VHlwZShzKVssIHNlbGVjdG9yXSwgaGFuZGxlclssIGFyZ3MgXSlcbiAgICAgICAgKi9cbiAgICAsIG9uID0gZnVuY3Rpb24oZWxlbWVudCwgZXZlbnRzLCBzZWxlY3RvciwgZm4pIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsRm4sIHR5cGUsIHR5cGVzLCBpLCBhcmdzLCBlbnRyeSwgZmlyc3RcblxuICAgICAgICAvL1RPRE86IHRoZSB1bmRlZmluZWQgY2hlY2sgbWVhbnMgeW91IGNhbid0IHBhc3MgYW4gJ2FyZ3MnIGFyZ3VtZW50LCBmaXggdGhpcyBwZXJoYXBzP1xuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZXZlbnRzID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy9UT0RPOiB0aGlzIGNhbid0IGhhbmRsZSBkZWxlZ2F0ZWQgZXZlbnRzXG4gICAgICAgICAgZm9yICh0eXBlIGluIGV2ZW50cykge1xuICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICAgICAgICBvbi5jYWxsKHRoaXMsIGVsZW1lbnQsIHR5cGUsIGV2ZW50c1t0eXBlXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRnVuY3Rpb24oc2VsZWN0b3IpKSB7XG4gICAgICAgICAgLy8gZGVsZWdhdGVkIGV2ZW50XG4gICAgICAgICAgb3JpZ2luYWxGbiA9IGZuXG4gICAgICAgICAgYXJncyAgICAgICA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCA0KVxuICAgICAgICAgIGZuICAgICAgICAgPSBkZWxlZ2F0ZShzZWxlY3Rvciwgb3JpZ2luYWxGbiwgc2VsZWN0b3JFbmdpbmUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncyAgICAgICA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuICAgICAgICAgIGZuICAgICAgICAgPSBvcmlnaW5hbEZuID0gc2VsZWN0b3JcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGVzID0gc3RyMmFycihldmVudHMpXG5cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBvbmUoKSwgd3JhcCBpbiBhIHNlbGYtcmVtb3ZpbmcgaGFuZGxlclxuICAgICAgICBpZiAodGhpcyA9PT0gT05FKSB7XG4gICAgICAgICAgZm4gPSBvbmNlKG9mZiwgZWxlbWVudCwgZXZlbnRzLCBmbiwgb3JpZ2luYWxGbilcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IHR5cGVzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgIC8vIGFkZCBuZXcgaGFuZGxlciB0byB0aGUgcmVnaXN0cnkgYW5kIGNoZWNrIGlmIGl0J3MgdGhlIGZpcnN0IGZvciB0aGlzIGVsZW1lbnQvdHlwZVxuICAgICAgICAgIGZpcnN0ID0gcmVnaXN0cnkucHV0KGVudHJ5ID0gbmV3IFJlZ0VudHJ5KFxuICAgICAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAsIHR5cGVzW2ldLnJlcGxhY2UobmFtZVJlZ2V4LCAnJykgLy8gZXZlbnQgdHlwZVxuICAgICAgICAgICAgLCBmblxuICAgICAgICAgICAgLCBvcmlnaW5hbEZuXG4gICAgICAgICAgICAsIHN0cjJhcnIodHlwZXNbaV0ucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpLCAnLicpIC8vIG5hbWVzcGFjZXNcbiAgICAgICAgICAgICwgYXJnc1xuICAgICAgICAgICAgLCBmYWxzZSAvLyBub3Qgcm9vdFxuICAgICAgICAgICkpXG4gICAgICAgICAgaWYgKGVudHJ5W2V2ZW50U3VwcG9ydF0gJiYgZmlyc3QpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGV2ZW50IG9mIHRoaXMgdHlwZSBvbiB0aGlzIGVsZW1lbnQsIGFkZCByb290IGxpc3RlbmVyXG4gICAgICAgICAgICBsaXN0ZW5lcihlbGVtZW50LCBlbnRyeS5ldmVudFR5cGUsIHRydWUsIGVudHJ5LmN1c3RvbVR5cGUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogYWRkKGVsZW1lbnRbLCBzZWxlY3Rvcl0sIGV2ZW50VHlwZShzKSwgaGFuZGxlclssIGFyZ3MgXSlcbiAgICAgICAgKlxuICAgICAgICAqIERlcHJlY2F0ZWQ6IGtlcHQgKGZvciBub3cpIGZvciBiYWNrd2FyZC1jb21wYXRpYmlsaXR5XG4gICAgICAgICovXG4gICAgLCBhZGQgPSBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnRzLCBmbiwgZGVsZm4pIHtcbiAgICAgICAgcmV0dXJuIG9uLmFwcGx5KFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICwgIWlzU3RyaW5nKGZuKVxuICAgICAgICAgICAgICA/IHNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgICAgICAgICAgICA6IFsgZWxlbWVudCwgZm4sIGV2ZW50cywgZGVsZm4gXS5jb25jYXQoYXJndW1lbnRzLmxlbmd0aCA+IDMgPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgNSkgOiBbXSlcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBvbmUoZWxlbWVudCwgZXZlbnRUeXBlKHMpWywgc2VsZWN0b3JdLCBoYW5kbGVyWywgYXJncyBdKVxuICAgICAgICAqL1xuICAgICwgb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gb24uYXBwbHkoT05FLCBhcmd1bWVudHMpXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIGZpcmUoZWxlbWVudCwgZXZlbnRUeXBlKHMpWywgYXJncyBdKVxuICAgICAgICAqXG4gICAgICAgICogVGhlIG9wdGlvbmFsICdhcmdzJyBhcmd1bWVudCBtdXN0IGJlIGFuIGFycmF5LCBpZiBubyAnYXJncycgYXJndW1lbnQgaXMgcHJvdmlkZWRcbiAgICAgICAgKiB0aGVuIHdlIGNhbiB1c2UgdGhlIGJyb3dzZXIncyBET00gZXZlbnQgc3lzdGVtLCBvdGhlcndpc2Ugd2UgdHJpZ2dlciBoYW5kbGVycyBtYW51YWxseVxuICAgICAgICAqL1xuICAgICwgZmlyZSA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBhcmdzKSB7XG4gICAgICAgIHZhciB0eXBlcyA9IHN0cjJhcnIodHlwZSlcbiAgICAgICAgICAsIGksIGosIGwsIG5hbWVzLCBoYW5kbGVyc1xuXG4gICAgICAgIGZvciAoaSA9IHR5cGVzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgIHR5cGUgPSB0eXBlc1tpXS5yZXBsYWNlKG5hbWVSZWdleCwgJycpXG4gICAgICAgICAgaWYgKG5hbWVzID0gdHlwZXNbaV0ucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKSBuYW1lcyA9IHN0cjJhcnIobmFtZXMsICcuJylcbiAgICAgICAgICBpZiAoIW5hbWVzICYmICFhcmdzICYmIGVsZW1lbnRbZXZlbnRTdXBwb3J0XSkge1xuICAgICAgICAgICAgZmlyZUxpc3RlbmVyKG5hdGl2ZUV2ZW50c1t0eXBlXSwgdHlwZSwgZWxlbWVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbm9uLW5hdGl2ZSBldmVudCwgZWl0aGVyIGJlY2F1c2Ugb2YgYSBuYW1lc3BhY2UsIGFyZ3VtZW50cyBvciBhIG5vbiBET00gZWxlbWVudFxuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBsaXN0ZW5lcnMgYW5kIG1hbnVhbGx5ICdmaXJlJ1xuICAgICAgICAgICAgaGFuZGxlcnMgPSByZWdpc3RyeS5nZXQoZWxlbWVudCwgdHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgICBhcmdzID0gW2ZhbHNlXS5jb25jYXQoYXJncylcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzW2pdLmluTmFtZXNwYWNlcyhuYW1lcykpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyc1tqXS5oYW5kbGVyLmFwcGx5KGVsZW1lbnQsIGFyZ3MpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogY2xvbmUoZHN0RWxlbWVudCwgc3JjRWxlbWVudFssIGV2ZW50VHlwZSBdKVxuICAgICAgICAqXG4gICAgICAgICogVE9ETzogcGVyaGFwcyBmb3IgY29uc2lzdGVuY3kgd2Ugc2hvdWxkIGFsbG93IHRoZSBzYW1lIGZsZXhpYmlsaXR5IGluIHR5cGUgc3BlY2lmaWVycz9cbiAgICAgICAgKi9cbiAgICAsIGNsb25lID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZyb20sIHR5cGUpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gcmVnaXN0cnkuZ2V0KGZyb20sIHR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICwgbCA9IGhhbmRsZXJzLmxlbmd0aFxuICAgICAgICAgICwgaSA9IDBcbiAgICAgICAgICAsIGFyZ3MsIGJlYW5EZWxcblxuICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChoYW5kbGVyc1tpXS5vcmlnaW5hbCkge1xuICAgICAgICAgICAgYXJncyA9IFsgZWxlbWVudCwgaGFuZGxlcnNbaV0udHlwZSBdXG4gICAgICAgICAgICBpZiAoYmVhbkRlbCA9IGhhbmRsZXJzW2ldLmhhbmRsZXIuX19iZWFuRGVsKSBhcmdzLnB1c2goYmVhbkRlbC5zZWxlY3RvcilcbiAgICAgICAgICAgIGFyZ3MucHVzaChoYW5kbGVyc1tpXS5vcmlnaW5hbClcbiAgICAgICAgICAgIG9uLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAsIGJlYW4gPSB7XG4gICAgICAgICAgb24gICAgICAgICAgICAgICAgOiBvblxuICAgICAgICAsIGFkZCAgICAgICAgICAgICAgIDogYWRkXG4gICAgICAgICwgb25lICAgICAgICAgICAgICAgOiBvbmVcbiAgICAgICAgLCBvZmYgICAgICAgICAgICAgICA6IG9mZlxuICAgICAgICAsIHJlbW92ZSAgICAgICAgICAgIDogb2ZmXG4gICAgICAgICwgY2xvbmUgICAgICAgICAgICAgOiBjbG9uZVxuICAgICAgICAsIGZpcmUgICAgICAgICAgICAgIDogZmlyZVxuICAgICAgICAsIEV2ZW50ICAgICAgICAgICAgIDogRXZlbnRcbiAgICAgICAgLCBzZXRTZWxlY3RvckVuZ2luZSA6IHNldFNlbGVjdG9yRW5naW5lXG4gICAgICAgICwgbm9Db25mbGljdCAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250ZXh0W25hbWVdID0gb2xkXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAvLyBmb3IgSUUsIGNsZWFuIHVwIG9uIHVubG9hZCB0byBhdm9pZCBsZWFrc1xuICBpZiAod2luLmF0dGFjaEV2ZW50KSB7XG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaSwgZW50cmllcyA9IHJlZ2lzdHJ5LmVudHJpZXMoKVxuICAgICAgZm9yIChpIGluIGVudHJpZXMpIHtcbiAgICAgICAgaWYgKGVudHJpZXNbaV0udHlwZSAmJiBlbnRyaWVzW2ldLnR5cGUgIT09ICd1bmxvYWQnKSBvZmYoZW50cmllc1tpXS5lbGVtZW50LCBlbnRyaWVzW2ldLnR5cGUpXG4gICAgICB9XG4gICAgICB3aW4uZGV0YWNoRXZlbnQoJ29udW5sb2FkJywgY2xlYW51cClcbiAgICAgIHdpbi5Db2xsZWN0R2FyYmFnZSAmJiB3aW4uQ29sbGVjdEdhcmJhZ2UoKVxuICAgIH1cbiAgICB3aW4uYXR0YWNoRXZlbnQoJ29udW5sb2FkJywgY2xlYW51cClcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgc2VsZWN0b3IgZW5naW5lIHRvIGludGVybmFsIGRlZmF1bHQgKHFTQSBvciB0aHJvdyBFcnJvcilcbiAgc2V0U2VsZWN0b3JFbmdpbmUoKVxuXG4gIHJldHVybiBiZWFuXG59KTsiLCIvKiFcbiAgKiBCb256bzogRE9NIFV0aWxpdHkgKGMpIER1c3RpbiBEaWF6IDIwMTJcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL2JvbnpvXG4gICogTGljZW5zZSBNSVRcbiAgKi9cbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdib256bycsIHRoaXMsIGZ1bmN0aW9uKCkge1xuICB2YXIgd2luID0gd2luZG93XG4gICAgLCBkb2MgPSB3aW4uZG9jdW1lbnRcbiAgICAsIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gICAgLCBwYXJlbnROb2RlID0gJ3BhcmVudE5vZGUnXG4gICAgLCBzcGVjaWFsQXR0cmlidXRlcyA9IC9eKGNoZWNrZWR8dmFsdWV8c2VsZWN0ZWR8ZGlzYWJsZWQpJC9pXG4gICAgICAvLyB0YWdzIHRoYXQgd2UgaGF2ZSB0cm91YmxlIGluc2VydGluZyAqaW50bypcbiAgICAsIHNwZWNpYWxUYWdzID0gL14oc2VsZWN0fGZpZWxkc2V0fHRhYmxlfHRib2R5fHRmb290fHRkfHRyfGNvbGdyb3VwKSQvaVxuICAgICwgc2ltcGxlU2NyaXB0VGFnUmUgPSAvXFxzKjxzY3JpcHQgK3NyYz1bJ1wiXShbXidcIl0rKVsnXCJdPi9cbiAgICAsIHRhYmxlID0gWyc8dGFibGU+JywgJzwvdGFibGU+JywgMV1cbiAgICAsIHRkID0gWyc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+JywgM11cbiAgICAsIG9wdGlvbiA9IFsnPHNlbGVjdD4nLCAnPC9zZWxlY3Q+JywgMV1cbiAgICAsIG5vc2NvcGUgPSBbJ18nLCAnJywgMCwgMV1cbiAgICAsIHRhZ01hcCA9IHsgLy8gdGFncyB0aGF0IHdlIGhhdmUgdHJvdWJsZSAqaW5zZXJ0aW5nKlxuICAgICAgICAgIHRoZWFkOiB0YWJsZSwgdGJvZHk6IHRhYmxlLCB0Zm9vdDogdGFibGUsIGNvbGdyb3VwOiB0YWJsZSwgY2FwdGlvbjogdGFibGVcbiAgICAgICAgLCB0cjogWyc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+JywgMl1cbiAgICAgICAgLCB0aDogdGQgLCB0ZDogdGRcbiAgICAgICAgLCBjb2w6IFsnPHRhYmxlPjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPicsIDJdXG4gICAgICAgICwgZmllbGRzZXQ6IFsnPGZvcm0+JywgJzwvZm9ybT4nLCAxXVxuICAgICAgICAsIGxlZ2VuZDogWyc8Zm9ybT48ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+PC9mb3JtPicsIDJdXG4gICAgICAgICwgb3B0aW9uOiBvcHRpb24sIG9wdGdyb3VwOiBvcHRpb25cbiAgICAgICAgLCBzY3JpcHQ6IG5vc2NvcGUsIHN0eWxlOiBub3Njb3BlLCBsaW5rOiBub3Njb3BlLCBwYXJhbTogbm9zY29wZSwgYmFzZTogbm9zY29wZVxuICAgICAgfVxuICAgICwgc3RhdGVBdHRyaWJ1dGVzID0gL14oY2hlY2tlZHxzZWxlY3RlZHxkaXNhYmxlZCkkL1xuICAgICwgaWUgPSAvbXNpZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICAsIGhhc0NsYXNzLCBhZGRDbGFzcywgcmVtb3ZlQ2xhc3NcbiAgICAsIHVpZE1hcCA9IHt9XG4gICAgLCB1dWlkcyA9IDBcbiAgICAsIGRpZ2l0ID0gL14tP1tcXGRcXC5dKyQvXG4gICAgLCBkYXR0ciA9IC9eZGF0YS0oLispJC9cbiAgICAsIHB4ID0gJ3B4J1xuICAgICwgc2V0QXR0cmlidXRlID0gJ3NldEF0dHJpYnV0ZSdcbiAgICAsIGdldEF0dHJpYnV0ZSA9ICdnZXRBdHRyaWJ1dGUnXG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIGZlYXR1cmVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBlLmlubmVySFRNTCA9ICc8YSBocmVmPVwiI3hcIj54PC9hPjx0YWJsZSBzdHlsZT1cImZsb2F0OmxlZnQ7XCI+PC90YWJsZT4nXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZkV4dGVuZGVkOiBlW2J5VGFnXSgnYScpWzBdW2dldEF0dHJpYnV0ZV0oJ2hyZWYnKSAhPSAnI3gnIC8vIElFIDwgOFxuICAgICAgICAsIGF1dG9UYm9keTogZVtieVRhZ10oJ3Rib2R5JykubGVuZ3RoICE9PSAwIC8vIElFIDwgOFxuICAgICAgICAsIGNvbXB1dGVkU3R5bGU6IGRvYy5kZWZhdWx0VmlldyAmJiBkb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZVxuICAgICAgICAsIGNzc0Zsb2F0OiBlW2J5VGFnXSgndGFibGUnKVswXS5zdHlsZS5zdHlsZUZsb2F0ID8gJ3N0eWxlRmxvYXQnIDogJ2Nzc0Zsb2F0J1xuICAgICAgICAsIHRyYW5zZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb3BzID0gWyd0cmFuc2Zvcm0nLCAnd2Via2l0VHJhbnNmb3JtJywgJ01velRyYW5zZm9ybScsICdPVHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJ10sIGlcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAocHJvcHNbaV0gaW4gZS5zdHlsZSkgcmV0dXJuIHByb3BzW2ldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSgpXG4gICAgICAgICwgY2xhc3NMaXN0OiAnY2xhc3NMaXN0JyBpbiBlXG4gICAgICAgICwgb3Bhc2l0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBkb2MuY3JlYXRlRWxlbWVudCgnYScpLnN0eWxlLm9wYWNpdHkgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgfSgpXG4gICAgICAgIH1cbiAgICAgIH0oKVxuICAgICwgdHJpbVJlcGxhY2UgPSAvKF5cXHMqfFxccyokKS9nXG4gICAgLCB3aGl0ZXNwYWNlUmVnZXggPSAvXFxzKy9cbiAgICAsIHRvU3RyaW5nID0gU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZ1xuICAgICwgdW5pdGxlc3MgPSB7IGxpbmVIZWlnaHQ6IDEsIHpvb206IDEsIHpJbmRleDogMSwgb3BhY2l0eTogMSwgYm94RmxleDogMSwgV2Via2l0Qm94RmxleDogMSwgTW96Qm94RmxleDogMSB9XG4gICAgLCBxdWVyeSA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsICYmIGZ1bmN0aW9uIChzZWxlY3RvcikgeyByZXR1cm4gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpIH1cbiAgICAsIHRyaW0gPSBTdHJpbmcucHJvdG90eXBlLnRyaW0gP1xuICAgICAgICBmdW5jdGlvbiAocykge1xuICAgICAgICAgIHJldHVybiBzLnRyaW0oKVxuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICByZXR1cm4gcy5yZXBsYWNlKHRyaW1SZXBsYWNlLCAnJylcbiAgICAgICAgfVxuXG4gICAgLCBnZXRTdHlsZSA9IGZlYXR1cmVzLmNvbXB1dGVkU3R5bGVcbiAgICAgICAgPyBmdW5jdGlvbiAoZWwsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsXG4gICAgICAgICAgICAgICwgY29tcHV0ZWQgPSBkb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgJycpXG4gICAgICAgICAgICBjb21wdXRlZCAmJiAodmFsdWUgPSBjb21wdXRlZFtwcm9wZXJ0eV0pXG4gICAgICAgICAgICByZXR1cm4gZWwuc3R5bGVbcHJvcGVydHldIHx8IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICA6ICEoaWUgJiYgaHRtbC5jdXJyZW50U3R5bGUpXG4gICAgICAgICAgPyBmdW5jdGlvbiAoZWwsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbC5zdHlsZVtwcm9wZXJ0eV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ3xudW1iZXJ9XG4gICAgICAgICAgICovXG4gICAgICAgICAgZnVuY3Rpb24gKGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHZhbCwgdmFsdWVcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnb3BhY2l0eScgJiYgIWZlYXR1cmVzLm9wYXNpdHkpIHtcbiAgICAgICAgICAgICAgdmFsID0gMTAwXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFsID0gZWxbJ2ZpbHRlcnMnXVsnRFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQWxwaGEnXS5vcGFjaXR5XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhbCA9IGVsWydmaWx0ZXJzJ10oJ2FscGhhJykub3BhY2l0eVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7fVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWwgLyAxMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gZWwuY3VycmVudFN0eWxlID8gZWwuY3VycmVudFN0eWxlW3Byb3BlcnR5XSA6IG51bGxcbiAgICAgICAgICAgIHJldHVybiBlbC5zdHlsZVtwcm9wZXJ0eV0gfHwgdmFsdWVcbiAgICAgICAgICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLm5vZGVOYW1lICYmIChub2RlLm5vZGVUeXBlID09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PSAxMSlcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplKG5vZGUsIGhvc3QsIGNsb25lKSB7XG4gICAgdmFyIGksIGwsIHJldFxuICAgIGlmICh0eXBlb2Ygbm9kZSA9PSAnc3RyaW5nJykgcmV0dXJuIGJvbnpvLmNyZWF0ZShub2RlKVxuICAgIGlmIChpc05vZGUobm9kZSkpIG5vZGUgPSBbIG5vZGUgXVxuICAgIGlmIChjbG9uZSkge1xuICAgICAgcmV0ID0gW10gLy8gZG9uJ3QgY2hhbmdlIG9yaWdpbmFsIGFycmF5XG4gICAgICBmb3IgKGkgPSAwLCBsID0gbm9kZS5sZW5ndGg7IGkgPCBsOyBpKyspIHJldFtpXSA9IGNsb25lTm9kZShob3N0LCBub2RlW2ldKVxuICAgICAgcmV0dXJuIHJldFxuICAgIH1cbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjIGEgY2xhc3MgbmFtZSB0byB0ZXN0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBjbGFzc1JlZyhjKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJyhefFxcXFxzKyknICsgYyArICcoXFxcXHMrfCQpJylcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9uem98QXJyYXl9IGFyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBudW1iZXIsIChCb256b3xBcnJheSkpfSBmblxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfcmV2XG4gICAqIEByZXR1cm4ge0JvbnpvfEFycmF5fVxuICAgKi9cbiAgZnVuY3Rpb24gZWFjaChhciwgZm4sIG9wdF9zY29wZSwgb3B0X3Jldikge1xuICAgIHZhciBpbmQsIGkgPSAwLCBsID0gYXIubGVuZ3RoXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGluZCA9IG9wdF9yZXYgPyBhci5sZW5ndGggLSBpIC0gMSA6IGlcbiAgICAgIGZuLmNhbGwob3B0X3Njb3BlIHx8IGFyW2luZF0sIGFyW2luZF0sIGluZCwgYXIpXG4gICAgfVxuICAgIHJldHVybiBhclxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtCb256b3xBcnJheX0gYXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsIG51bWJlciwgKEJvbnpvfEFycmF5KSl9IGZuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAqIEByZXR1cm4ge0JvbnpvfEFycmF5fVxuICAgKi9cbiAgZnVuY3Rpb24gZGVlcEVhY2goYXIsIGZuLCBvcHRfc2NvcGUpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGlzTm9kZShhcltpXSkpIHtcbiAgICAgICAgZGVlcEVhY2goYXJbaV0uY2hpbGROb2RlcywgZm4sIG9wdF9zY29wZSlcbiAgICAgICAgZm4uY2FsbChvcHRfc2NvcGUgfHwgYXJbaV0sIGFyW2ldLCBpLCBhcilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBjYW1lbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvLSguKS9nLCBmdW5jdGlvbiAobSwgbTEpIHtcbiAgICAgIHJldHVybiBtMS50b1VwcGVyQ2FzZSgpXG4gICAgfSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGRlY2FtZWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpIDogc1xuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZnVuY3Rpb24gZGF0YShlbCkge1xuICAgIGVsW2dldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnKSB8fCBlbFtzZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJywgKyt1dWlkcylcbiAgICB2YXIgdWlkID0gZWxbZ2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcpXG4gICAgcmV0dXJuIHVpZE1hcFt1aWRdIHx8ICh1aWRNYXBbdWlkXSA9IHt9KVxuICB9XG5cblxuICAvKipcbiAgICogcmVtb3ZlcyB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggYW4gZWxlbWVudFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqL1xuICBmdW5jdGlvbiBjbGVhckRhdGEoZWwpIHtcbiAgICB2YXIgdWlkID0gZWxbZ2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcpXG4gICAgaWYgKHVpZCkgZGVsZXRlIHVpZE1hcFt1aWRdXG4gIH1cblxuXG4gIGZ1bmN0aW9uIGRhdGFWYWx1ZShkKSB7XG4gICAgdmFyIGZcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChkID09PSBudWxsIHx8IGQgPT09IHVuZGVmaW5lZCkgPyB1bmRlZmluZWQgOlxuICAgICAgICBkID09PSAndHJ1ZScgPyB0cnVlIDpcbiAgICAgICAgICBkID09PSAnZmFsc2UnID8gZmFsc2UgOlxuICAgICAgICAgICAgZCA9PT0gJ251bGwnID8gbnVsbCA6XG4gICAgICAgICAgICAgIChmID0gcGFyc2VGbG9hdChkKSkgPT0gZCA/IGYgOiBkO1xuICAgIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0JvbnpvfEFycmF5fSBhclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCwgbnVtYmVyLCAoQm9uem98QXJyYXkpKX0gZm5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciBgc29tZWB0aGluZyB3YXMgZm91bmRcbiAgICovXG4gIGZ1bmN0aW9uIHNvbWUoYXIsIGZuLCBvcHRfc2NvcGUpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFyLmxlbmd0aDsgaSA8IGo7ICsraSkgaWYgKGZuLmNhbGwob3B0X3Njb3BlIHx8IG51bGwsIGFyW2ldLCBpLCBhcikpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuXG4gIC8qKlxuICAgKiB0aGlzIGNvdWxkIGJlIGEgZ2lhbnQgZW51bSBvZiBDU1MgcHJvcGVydGllc1xuICAgKiBidXQgaW4gZmF2b3Igb2YgZmlsZSBzaXplIHNhbnMtY2xvc3VyZSBkZWFkY29kZSBvcHRpbWl6YXRpb25zXG4gICAqIHdlJ3JlIGp1c3QgYXNraW5nIGZvciBhbnkgb2wgc3RyaW5nXG4gICAqIHRoZW4gaXQgZ2V0cyB0cmFuc2Zvcm1lZCBpbnRvIHRoZSBhcHByb3ByaWF0ZSBzdHlsZSBwcm9wZXJ0eSBmb3IgSlMgYWNjZXNzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHN0eWxlUHJvcGVydHkocCkge1xuICAgICAgKHAgPT0gJ3RyYW5zZm9ybScgJiYgKHAgPSBmZWF0dXJlcy50cmFuc2Zvcm0pKSB8fFxuICAgICAgICAoL150cmFuc2Zvcm0tP1tPb11yaWdpbiQvLnRlc3QocCkgJiYgKHAgPSBmZWF0dXJlcy50cmFuc2Zvcm0gKyAnT3JpZ2luJykpIHx8XG4gICAgICAgIChwID09ICdmbG9hdCcgJiYgKHAgPSBmZWF0dXJlcy5jc3NGbG9hdCkpXG4gICAgICByZXR1cm4gcCA/IGNhbWVsaXplKHApIDogbnVsbFxuICB9XG5cbiAgLy8gdGhpcyBpbnNlcnQgbWV0aG9kIGlzIGludGVuc2VcbiAgZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgaG9zdCwgZm4sIHJldikge1xuICAgIHZhciBpID0gMCwgc2VsZiA9IGhvc3QgfHwgdGhpcywgciA9IFtdXG4gICAgICAvLyB0YXJnZXQgbm9kZXMgY291bGQgYmUgYSBjc3Mgc2VsZWN0b3IgaWYgaXQncyBhIHN0cmluZyBhbmQgYSBzZWxlY3RvciBlbmdpbmUgaXMgcHJlc2VudFxuICAgICAgLy8gb3RoZXJ3aXNlLCBqdXN0IHVzZSB0YXJnZXRcbiAgICAgICwgbm9kZXMgPSBxdWVyeSAmJiB0eXBlb2YgdGFyZ2V0ID09ICdzdHJpbmcnICYmIHRhcmdldC5jaGFyQXQoMCkgIT0gJzwnID8gcXVlcnkodGFyZ2V0KSA6IHRhcmdldFxuICAgIC8vIG5vcm1hbGl6ZSBlYWNoIG5vZGUgaW4gY2FzZSBpdCdzIHN0aWxsIGEgc3RyaW5nIGFuZCB3ZSBuZWVkIHRvIGNyZWF0ZSBub2RlcyBvbiB0aGUgZmx5XG4gICAgZWFjaChub3JtYWxpemUobm9kZXMpLCBmdW5jdGlvbiAodCwgaikge1xuICAgICAgZWFjaChzZWxmLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZm4odCwgcltpKytdID0gaiA+IDAgPyBjbG9uZU5vZGUoc2VsZiwgZWwpIDogZWwpXG4gICAgICB9LCBudWxsLCByZXYpXG4gICAgfSwgdGhpcywgcmV2KVxuICAgIHNlbGYubGVuZ3RoID0gaVxuICAgIGVhY2gociwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGZbLS1pXSA9IGVcbiAgICB9LCBudWxsLCAhcmV2KVxuICAgIHJldHVybiBzZWxmXG4gIH1cblxuXG4gIC8qKlxuICAgKiBzZXRzIGFuIGVsZW1lbnQgdG8gYW4gZXhwbGljaXQgeC95IHBvc2l0aW9uIG9uIHRoZSBwYWdlXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHs/bnVtYmVyfSB4XG4gICAqIEBwYXJhbSB7P251bWJlcn0geVxuICAgKi9cbiAgZnVuY3Rpb24geHkoZWwsIHgsIHkpIHtcbiAgICB2YXIgJGVsID0gYm9uem8oZWwpXG4gICAgICAsIHN0eWxlID0gJGVsLmNzcygncG9zaXRpb24nKVxuICAgICAgLCBvZmZzZXQgPSAkZWwub2Zmc2V0KClcbiAgICAgICwgcmVsID0gJ3JlbGF0aXZlJ1xuICAgICAgLCBpc1JlbCA9IHN0eWxlID09IHJlbFxuICAgICAgLCBkZWx0YSA9IFtwYXJzZUludCgkZWwuY3NzKCdsZWZ0JyksIDEwKSwgcGFyc2VJbnQoJGVsLmNzcygndG9wJyksIDEwKV1cblxuICAgIGlmIChzdHlsZSA9PSAnc3RhdGljJykge1xuICAgICAgJGVsLmNzcygncG9zaXRpb24nLCByZWwpXG4gICAgICBzdHlsZSA9IHJlbFxuICAgIH1cblxuICAgIGlzTmFOKGRlbHRhWzBdKSAmJiAoZGVsdGFbMF0gPSBpc1JlbCA/IDAgOiBlbC5vZmZzZXRMZWZ0KVxuICAgIGlzTmFOKGRlbHRhWzFdKSAmJiAoZGVsdGFbMV0gPSBpc1JlbCA/IDAgOiBlbC5vZmZzZXRUb3ApXG5cbiAgICB4ICE9IG51bGwgJiYgKGVsLnN0eWxlLmxlZnQgPSB4IC0gb2Zmc2V0LmxlZnQgKyBkZWx0YVswXSArIHB4KVxuICAgIHkgIT0gbnVsbCAmJiAoZWwuc3R5bGUudG9wID0geSAtIG9mZnNldC50b3AgKyBkZWx0YVsxXSArIHB4KVxuXG4gIH1cblxuICAvLyBjbGFzc0xpc3Qgc3VwcG9ydCBmb3IgY2xhc3MgbWFuYWdlbWVudFxuICAvLyBhbHRobyB0byBiZSBmYWlyLCB0aGUgYXBpIHN1Y2tzIGJlY2F1c2UgaXQgd29uJ3QgYWNjZXB0IG11bHRpcGxlIGNsYXNzZXMgYXQgb25jZVxuICBpZiAoZmVhdHVyZXMuY2xhc3NMaXN0KSB7XG4gICAgaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoYylcbiAgICB9XG4gICAgYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYylcbiAgICB9XG4gICAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoYylcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsLmNsYXNzTmFtZSlcbiAgICB9XG4gICAgYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IHRyaW0oZWwuY2xhc3NOYW1lICsgJyAnICsgYylcbiAgICB9XG4gICAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IHRyaW0oZWwuY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NSZWcoYyksICcgJykpXG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogdGhpcyBhbGxvd3MgbWV0aG9kIGNhbGxpbmcgZm9yIHNldHRpbmcgdmFsdWVzXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJvbnpvKGVsZW1lbnRzKS5jc3MoJ2NvbG9yJywgZnVuY3Rpb24gKGVsKSB7XG4gICAqICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC1jb2xvcicpXG4gICAqIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHtmdW5jdGlvbiAoRWxlbWVudCl8c3RyaW5nfVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzZXR0ZXIoZWwsIHYpIHtcbiAgICByZXR1cm4gdHlwZW9mIHYgPT0gJ2Z1bmN0aW9uJyA/IHYoZWwpIDogdlxuICB9XG5cbiAgZnVuY3Rpb24gc2Nyb2xsKHgsIHksIHR5cGUpIHtcbiAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgaWYgKCFlbCkgcmV0dXJuIHRoaXNcbiAgICBpZiAoeCA9PSBudWxsICYmIHkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChpc0JvZHkoZWwpID8gZ2V0V2luZG93U2Nyb2xsKCkgOiB7IHg6IGVsLnNjcm9sbExlZnQsIHk6IGVsLnNjcm9sbFRvcCB9KVt0eXBlXVxuICAgIH1cbiAgICBpZiAoaXNCb2R5KGVsKSkge1xuICAgICAgd2luLnNjcm9sbFRvKHgsIHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHggIT0gbnVsbCAmJiAoZWwuc2Nyb2xsTGVmdCA9IHgpXG4gICAgICB5ICE9IG51bGwgJiYgKGVsLnNjcm9sbFRvcCA9IHkpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7QXJyYXkuPEVsZW1lbnQ+fEVsZW1lbnR8Tm9kZXxzdHJpbmd9IGVsZW1lbnRzXG4gICAqL1xuICBmdW5jdGlvbiBCb256byhlbGVtZW50cykge1xuICAgIHRoaXMubGVuZ3RoID0gMFxuICAgIGlmIChlbGVtZW50cykge1xuICAgICAgZWxlbWVudHMgPSB0eXBlb2YgZWxlbWVudHMgIT09ICdzdHJpbmcnICYmXG4gICAgICAgICFlbGVtZW50cy5ub2RlVHlwZSAmJlxuICAgICAgICB0eXBlb2YgZWxlbWVudHMubGVuZ3RoICE9PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgZWxlbWVudHMgOlxuICAgICAgICAgIFtlbGVtZW50c11cbiAgICAgIHRoaXMubGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB0aGlzW2ldID0gZWxlbWVudHNbaV1cbiAgICB9XG4gIH1cblxuICBCb256by5wcm90b3R5cGUgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzW2luZGV4XSB8fCBudWxsXG4gICAgICB9XG5cbiAgICAgIC8vIGl0ZXRhdG9yc1xuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKEVsZW1lbnR8Tm9kZSl9IGZuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGVhY2g6IGZ1bmN0aW9uIChmbiwgb3B0X3Njb3BlKSB7XG4gICAgICAgIHJldHVybiBlYWNoKHRoaXMsIGZuLCBvcHRfc2NvcGUpXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZGVlcEVhY2g6IGZ1bmN0aW9uIChmbiwgb3B0X3Njb3BlKSB7XG4gICAgICAgIHJldHVybiBkZWVwRWFjaCh0aGlzLCBmbiwgb3B0X3Njb3BlKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfcmVqZWN0XG4gICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAqL1xuICAgICwgbWFwOiBmdW5jdGlvbiAoZm4sIG9wdF9yZWplY3QpIHtcbiAgICAgICAgdmFyIG0gPSBbXSwgbiwgaVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG4gPSBmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGkpXG4gICAgICAgICAgb3B0X3JlamVjdCA/IChvcHRfcmVqZWN0KG4pICYmIG0ucHVzaChuKSkgOiBtLnB1c2gobilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbVxuICAgICAgfVxuXG4gICAgLy8gdGV4dCBhbmQgaHRtbCBpbnNlcnRlcnMhXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaCB0aGUgSFRNTCB0byBpbnNlcnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfdGV4dCB3aGV0aGVyIHRvIHNldCBvciBnZXQgdGV4dCBjb250ZW50XG4gICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAqL1xuICAgICwgaHRtbDogZnVuY3Rpb24gKGgsIG9wdF90ZXh0KSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvcHRfdGV4dFxuICAgICAgICAgICAgICA/IGh0bWwudGV4dENvbnRlbnQgPT09IHVuZGVmaW5lZCA/ICdpbm5lclRleHQnIDogJ3RleHRDb250ZW50J1xuICAgICAgICAgICAgICA6ICdpbm5lckhUTUwnXG4gICAgICAgICAgLCB0aGF0ID0gdGhpc1xuICAgICAgICAgICwgYXBwZW5kID0gZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgICAgIGVhY2gobm9ybWFsaXplKGgsIHRoYXQsIGkpLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLCB1cGRhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdF90ZXh0IHx8ICh0eXBlb2YgaCA9PSAnc3RyaW5nJyAmJiAhc3BlY2lhbFRhZ3MudGVzdChlbC50YWdOYW1lKSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbFttZXRob2RdID0gaFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgYXBwZW5kKGVsLCBpKVxuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIGggIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICA/IHRoaXMuZW1wdHkoKS5lYWNoKHVwZGF0ZUVsZW1lbnQpXG4gICAgICAgICAgOiB0aGlzWzBdID8gdGhpc1swXVttZXRob2RdIDogJydcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF90ZXh0IHRoZSB0ZXh0IHRvIHNldCwgb3RoZXJ3aXNlIHRoaXMgaXMgYSBnZXR0ZXJcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgdGV4dDogZnVuY3Rpb24gKG9wdF90ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0bWwob3B0X3RleHQsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIC8vIG1vcmUgcmVsYXRlZCBpbnNlcnRpb24gbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhcHBlbmQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoaSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHByZXBlbmQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIHZhciBmaXJzdCA9IGVsLmZpcnN0Q2hpbGRcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsLmluc2VydEJlZm9yZShpLCBmaXJzdClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFwcGVuZFRvOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdC5hcHBlbmRDaGlsZChlbClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBwcmVwZW5kVG86IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB0Lmluc2VydEJlZm9yZShlbCwgdC5maXJzdENoaWxkKVxuICAgICAgICB9LCAxKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGJlZm9yZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoaSwgZWwpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhZnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoaSwgZWwubmV4dFNpYmxpbmcpXG4gICAgICAgICAgfSwgbnVsbCwgMSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB0W3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShlbCwgdClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHZhciBzaWJsaW5nID0gdC5uZXh0U2libGluZ1xuICAgICAgICAgIHNpYmxpbmcgP1xuICAgICAgICAgICAgdFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoZWwsIHNpYmxpbmcpIDpcbiAgICAgICAgICAgIHRbcGFyZW50Tm9kZV0uYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIH0sIDEpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVwbGFjZVdpdGg6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGJvbnpvKG5vcm1hbGl6ZShub2RlKSkuaW5zZXJ0QWZ0ZXIodGhpcylcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKClcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGNsb25lOiBmdW5jdGlvbiAob3B0X2hvc3QpIHtcbiAgICAgICAgdmFyIHJldCA9IFtdIC8vIGRvbid0IGNoYW5nZSBvcmlnaW5hbCBhcnJheVxuICAgICAgICAgICwgbCwgaVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHJldFtpXSA9IGNsb25lTm9kZShvcHRfaG9zdCB8fCB0aGlzLCB0aGlzW2ldKVxuICAgICAgICByZXR1cm4gYm9uem8ocmV0KVxuICAgICAgfVxuXG4gICAgICAvLyBjbGFzcyBtYW5hZ2VtZW50XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhZGRDbGFzczogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIC8vIHdlIGBlYWNoYCBoZXJlIHNvIHlvdSBjYW4gZG8gJGVsLmFkZENsYXNzKCdmb28gYmFyJylcbiAgICAgICAgICBlYWNoKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYyAmJiAhaGFzQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpKVxuICAgICAgICAgICAgICBhZGRDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZW1vdmVDbGFzczogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVhY2goYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjICYmIGhhc0NsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKSlcbiAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICovXG4gICAgLCBoYXNDbGFzczogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gc29tZSh0aGlzLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gc29tZShjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgcmV0dXJuIGMgJiYgaGFzQ2xhc3MoZWwsIGMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjIGNsYXNzbmFtZSB0byB0b2dnbGVcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF9jb25kaXRpb24gd2hldGhlciB0byBhZGQgb3IgcmVtb3ZlIHRoZSBjbGFzcyBzdHJhaWdodCBhd2F5XG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgdG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uIChjLCBvcHRfY29uZGl0aW9uKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlYWNoKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICB0eXBlb2Ygb3B0X2NvbmRpdGlvbiAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgICAgICAgIG9wdF9jb25kaXRpb24gPyAhaGFzQ2xhc3MoZWwsIGMpICYmIGFkZENsYXNzKGVsLCBjKSA6IHJlbW92ZUNsYXNzKGVsLCBjKSA6XG4gICAgICAgICAgICAgICAgaGFzQ2xhc3MoZWwsIGMpID8gcmVtb3ZlQ2xhc3MoZWwsIGMpIDogYWRkQ2xhc3MoZWwsIGMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gZGlzcGxheSB0b2dnbGVyc1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3R5cGUgdXNlZnVsIHRvIHNldCBiYWNrIHRvIGFueXRoaW5nIG90aGVyIHRoYW4gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgc2hvdzogZnVuY3Rpb24gKG9wdF90eXBlKSB7XG4gICAgICAgIG9wdF90eXBlID0gdHlwZW9mIG9wdF90eXBlID09ICdzdHJpbmcnID8gb3B0X3R5cGUgOiAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBvcHRfdHlwZVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X2NhbGxiYWNrXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF90eXBlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgdG9nZ2xlOiBmdW5jdGlvbiAob3B0X2NhbGxiYWNrLCBvcHRfdHlwZSkge1xuICAgICAgICBvcHRfdHlwZSA9IHR5cGVvZiBvcHRfdHlwZSA9PSAnc3RyaW5nJyA/IG9wdF90eXBlIDogJyc7XG4gICAgICAgIHR5cGVvZiBvcHRfY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJyAmJiAob3B0X2NhbGxiYWNrID0gbnVsbClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gKGVsLm9mZnNldFdpZHRoIHx8IGVsLm9mZnNldEhlaWdodCkgPyAnbm9uZScgOiBvcHRfdHlwZTtcbiAgICAgICAgICBvcHRfY2FsbGJhY2sgJiYgb3B0X2NhbGxiYWNrLmNhbGwoZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLy8gRE9NIFdhbGtlcnMgJiBnZXR0ZXJzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBmaXJzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYm9uem8odGhpcy5sZW5ndGggPyB0aGlzWzBdIDogW10pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJvbnpvKHRoaXMubGVuZ3RoID8gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIDogW10pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRlZCgnbmV4dFNpYmxpbmcnKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBwcmV2aW91czogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGVkKCdwcmV2aW91c1NpYmxpbmcnKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBwYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGVkKHBhcmVudE5vZGUpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCB0aGUgZGlyZWN0aW9uYWwgRE9NIG1ldGhvZFxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCByZWxhdGVkOiBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBib256byh0aGlzLm1hcChcbiAgICAgICAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGVsID0gZWxbbWV0aG9kXVxuICAgICAgICAgICAgd2hpbGUgKGVsICYmIGVsLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgICAgICAgIGVsID0gZWxbbWV0aG9kXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsIHx8IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgfVxuICAgICAgICApKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoICYmIHRoaXNbMF0uZm9jdXMoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGJsdXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggJiYgdGhpc1swXS5ibHVyKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cblxuICAgICAgLy8gc3R5bGUgZ2V0dGVyIHNldHRlciAmIHJlbGF0ZWQgbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gb1xuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdlxuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCBjc3M6IGZ1bmN0aW9uIChvLCBvcHRfdikge1xuICAgICAgICB2YXIgcCwgaXRlciA9IG9cbiAgICAgICAgLy8gaXMgdGhpcyBhIHJlcXVlc3QgZm9yIGp1c3QgZ2V0dGluZyBhIHN0eWxlP1xuICAgICAgICBpZiAob3B0X3YgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIHJlcHVycG9zZSAndidcbiAgICAgICAgICBvcHRfdiA9IHRoaXNbMF1cbiAgICAgICAgICBpZiAoIW9wdF92KSByZXR1cm4gbnVsbFxuICAgICAgICAgIGlmIChvcHRfdiA9PT0gZG9jIHx8IG9wdF92ID09PSB3aW4pIHtcbiAgICAgICAgICAgIHAgPSAob3B0X3YgPT09IGRvYykgPyBib256by5kb2MoKSA6IGJvbnpvLnZpZXdwb3J0KClcbiAgICAgICAgICAgIHJldHVybiBvID09ICd3aWR0aCcgPyBwLndpZHRoIDogbyA9PSAnaGVpZ2h0JyA/IHAuaGVpZ2h0IDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChvID0gc3R5bGVQcm9wZXJ0eShvKSkgPyBnZXRTdHlsZShvcHRfdiwgbykgOiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpdGVyID0ge31cbiAgICAgICAgICBpdGVyW29dID0gb3B0X3ZcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZmVhdHVyZXMub3Bhc2l0eSAmJiAnb3BhY2l0eScgaW4gaXRlcikge1xuICAgICAgICAgIC8vIG9oIHRoaXMgJ29sIGdhbXV0XG4gICAgICAgICAgaXRlci5maWx0ZXIgPSBpdGVyLm9wYWNpdHkgIT0gbnVsbCAmJiBpdGVyLm9wYWNpdHkgIT09ICcnXG4gICAgICAgICAgICA/ICdhbHBoYShvcGFjaXR5PScgKyAoaXRlci5vcGFjaXR5ICogMTAwKSArICcpJ1xuICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgIC8vIGdpdmUgaXQgbGF5b3V0XG4gICAgICAgICAgaXRlci56b29tID0gby56b29tIHx8IDFcbiAgICAgICAgICA7ZGVsZXRlIGl0ZXIub3BhY2l0eVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZm4oZWwsIHAsIHYpIHtcbiAgICAgICAgICBmb3IgKHZhciBrIGluIGl0ZXIpIHtcbiAgICAgICAgICAgIGlmIChpdGVyLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgIHYgPSBpdGVyW2tdO1xuICAgICAgICAgICAgICAvLyBjaGFuZ2UgXCI1XCIgdG8gXCI1cHhcIiAtIHVubGVzcyB5b3UncmUgbGluZS1oZWlnaHQsIHdoaWNoIGlzIGFsbG93ZWRcbiAgICAgICAgICAgICAgKHAgPSBzdHlsZVByb3BlcnR5KGspKSAmJiBkaWdpdC50ZXN0KHYpICYmICEocCBpbiB1bml0bGVzcykgJiYgKHYgKz0gcHgpXG4gICAgICAgICAgICAgIHRyeSB7IGVsLnN0eWxlW3BdID0gc2V0dGVyKGVsLCB2KSB9IGNhdGNoKGUpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZm4pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcj19IG9wdF94XG4gICAgICAgKiBAcGFyYW0ge251bWJlcj19IG9wdF95XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xudW1iZXJ9XG4gICAgICAgKi9cbiAgICAsIG9mZnNldDogZnVuY3Rpb24gKG9wdF94LCBvcHRfeSkge1xuICAgICAgICBpZiAob3B0X3ggJiYgdHlwZW9mIG9wdF94ID09ICdvYmplY3QnICYmICh0eXBlb2Ygb3B0X3gudG9wID09ICdudW1iZXInIHx8IHR5cGVvZiBvcHRfeC5sZWZ0ID09ICdudW1iZXInKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB4eShlbCwgb3B0X3gubGVmdCwgb3B0X3gudG9wKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdF94ID09ICdudW1iZXInIHx8IHR5cGVvZiBvcHRfeSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB4eShlbCwgb3B0X3gsIG9wdF95KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzWzBdKSByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgLCBsZWZ0OiAwXG4gICAgICAgICAgLCBoZWlnaHQ6IDBcbiAgICAgICAgICAsIHdpZHRoOiAwXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsID0gdGhpc1swXVxuICAgICAgICAgICwgZGUgPSBlbC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgICAgICAgICwgYmNyID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAsIHNjcm9sbCA9IGdldFdpbmRvd1Njcm9sbCgpXG4gICAgICAgICAgLCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoXG4gICAgICAgICAgLCBoZWlnaHQgPSBlbC5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAsIHRvcCA9IGJjci50b3AgKyBzY3JvbGwueSAtIE1hdGgubWF4KDAsIGRlICYmIGRlLmNsaWVudFRvcCwgZG9jLmJvZHkuY2xpZW50VG9wKVxuICAgICAgICAgICwgbGVmdCA9IGJjci5sZWZ0ICsgc2Nyb2xsLnggLSBNYXRoLm1heCgwLCBkZSAmJiBkZS5jbGllbnRMZWZ0LCBkb2MuYm9keS5jbGllbnRMZWZ0KVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHRvcFxuICAgICAgICAgICwgbGVmdDogbGVmdFxuICAgICAgICAgICwgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAsIHdpZHRoOiB3aWR0aFxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgKi9cbiAgICAsIGRpbTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm4geyBoZWlnaHQ6IDAsIHdpZHRoOiAwIH1cbiAgICAgICAgdmFyIGVsID0gdGhpc1swXVxuICAgICAgICAgICwgZGUgPSBlbC5ub2RlVHlwZSA9PSA5ICYmIGVsLmRvY3VtZW50RWxlbWVudCAvLyBkb2N1bWVudFxuICAgICAgICAgICwgb3JpZyA9ICFkZSAmJiAhIWVsLnN0eWxlICYmICFlbC5vZmZzZXRXaWR0aCAmJiAhZWwub2Zmc2V0SGVpZ2h0ID9cbiAgICAgICAgICAgICAvLyBlbCBpc24ndCB2aXNpYmxlLCBjYW4ndCBiZSBtZWFzdXJlZCBwcm9wZXJseSwgc28gZml4IHRoYXRcbiAgICAgICAgICAgICBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgdmFyIHMgPSB7XG4gICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGVsLnN0eWxlLnBvc2l0aW9uIHx8ICcnXG4gICAgICAgICAgICAgICAgICwgdmlzaWJpbGl0eTogZWwuc3R5bGUudmlzaWJpbGl0eSB8fCAnJ1xuICAgICAgICAgICAgICAgICAsIGRpc3BsYXk6IGVsLnN0eWxlLmRpc3BsYXkgfHwgJydcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHQuZmlyc3QoKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICAgICAgICwgdmlzaWJpbGl0eTogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICAgLCBkaXNwbGF5OiAnYmxvY2snXG4gICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgcmV0dXJuIHNcbiAgICAgICAgICAgIH0odGhpcykgOiBudWxsXG4gICAgICAgICAgLCB3aWR0aCA9IGRlXG4gICAgICAgICAgICAgID8gTWF0aC5tYXgoZWwuYm9keS5zY3JvbGxXaWR0aCwgZWwuYm9keS5vZmZzZXRXaWR0aCwgZGUuc2Nyb2xsV2lkdGgsIGRlLm9mZnNldFdpZHRoLCBkZS5jbGllbnRXaWR0aClcbiAgICAgICAgICAgICAgOiBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICwgaGVpZ2h0ID0gZGVcbiAgICAgICAgICAgICAgPyBNYXRoLm1heChlbC5ib2R5LnNjcm9sbEhlaWdodCwgZWwuYm9keS5vZmZzZXRIZWlnaHQsIGRlLnNjcm9sbEhlaWdodCwgZGUub2Zmc2V0SGVpZ2h0LCBkZS5jbGllbnRIZWlnaHQpXG4gICAgICAgICAgICAgIDogZWwub2Zmc2V0SGVpZ2h0XG5cbiAgICAgICAgb3JpZyAmJiB0aGlzLmZpcnN0KCkuY3NzKG9yaWcpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICAgICwgd2lkdGg6IHdpZHRoXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXR0cmlidXRlcyBhcmUgaGFyZC4gZ28gc2hvcHBpbmdcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gayBhbiBhdHRyaWJ1dGUgdG8gZ2V0IG9yIHNldFxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdiB0aGUgdmFsdWUgdG8gc2V0XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIGF0dHI6IGZ1bmN0aW9uIChrLCBvcHRfdikge1xuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICAgICAgLCBuXG5cbiAgICAgICAgaWYgKHR5cGVvZiBrICE9ICdzdHJpbmcnICYmICEoayBpbnN0YW5jZW9mIFN0cmluZykpIHtcbiAgICAgICAgICBmb3IgKG4gaW4gaykge1xuICAgICAgICAgICAgay5oYXNPd25Qcm9wZXJ0eShuKSAmJiB0aGlzLmF0dHIobiwga1tuXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlb2Ygb3B0X3YgPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgICFlbCA/IG51bGwgOiBzcGVjaWFsQXR0cmlidXRlcy50ZXN0KGspID9cbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlcy50ZXN0KGspICYmIHR5cGVvZiBlbFtrXSA9PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgIHRydWUgOiBlbFtrXSA6IChrID09ICdocmVmJyB8fCBrID09J3NyYycpICYmIGZlYXR1cmVzLmhyZWZFeHRlbmRlZCA/XG4gICAgICAgICAgICAgICAgZWxbZ2V0QXR0cmlidXRlXShrLCAyKSA6IGVsW2dldEF0dHJpYnV0ZV0oaykgOlxuICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHNwZWNpYWxBdHRyaWJ1dGVzLnRlc3QoaykgPyAoZWxba10gPSBzZXR0ZXIoZWwsIG9wdF92KSkgOiBlbFtzZXRBdHRyaWJ1dGVdKGssIHNldHRlcihlbCwgb3B0X3YpKVxuICAgICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlbW92ZUF0dHI6IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzLnRlc3QoaykgPyAoZWxba10gPSBmYWxzZSkgOiBlbC5yZW1vdmVBdHRyaWJ1dGUoaylcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3NcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgdmFsOiBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBzID09ICdzdHJpbmcnIHx8IHR5cGVvZiBzID09ICdudW1iZXInKSA/XG4gICAgICAgICAgdGhpcy5hdHRyKCd2YWx1ZScsIHMpIDpcbiAgICAgICAgICB0aGlzLmxlbmd0aCA/IHRoaXNbMF0udmFsdWUgOiBudWxsXG4gICAgICB9XG5cbiAgICAgIC8vIHVzZSB3aXRoIGNhcmUgYW5kIGtub3dsZWRnZS4gdGhpcyBkYXRhKCkgbWV0aG9kIHVzZXMgZGF0YSBhdHRyaWJ1dGVzIG9uIHRoZSBET00gbm9kZXNcbiAgICAgIC8vIHRvIGRvIHRoaXMgZGlmZmVyZW50bHkgY29zdHMgYSBsb3QgbW9yZSBjb2RlLiBjJ2VzdCBsYSB2aWVcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0PX0gb3B0X2sgdGhlIGtleSBmb3Igd2hpY2ggdG8gZ2V0IG9yIHNldCBkYXRhXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF92XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xPYmplY3R9XG4gICAgICAgKi9cbiAgICAsIGRhdGE6IGZ1bmN0aW9uIChvcHRfaywgb3B0X3YpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpc1swXSwgbywgbVxuICAgICAgICBpZiAodHlwZW9mIG9wdF92ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmICghZWwpIHJldHVybiBudWxsXG4gICAgICAgICAgbyA9IGRhdGEoZWwpXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRfayA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVhY2goZWwuYXR0cmlidXRlcywgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgKG0gPSAoJycgKyBhLm5hbWUpLm1hdGNoKGRhdHRyKSkgJiYgKG9bY2FtZWxpemUobVsxXSldID0gZGF0YVZhbHVlKGEudmFsdWUpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb1tvcHRfa10gPT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICBvW29wdF9rXSA9IGRhdGFWYWx1ZSh0aGlzLmF0dHIoJ2RhdGEtJyArIGRlY2FtZWxpemUob3B0X2spKSlcbiAgICAgICAgICAgIHJldHVybiBvW29wdF9rXVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkgeyBkYXRhKGVsKVtvcHRfa10gPSBvcHRfdiB9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERPTSBkZXRhY2htZW50ICYgcmVsYXRlZFxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kZWVwRWFjaChjbGVhckRhdGEpXG4gICAgICAgIHJldHVybiB0aGlzLmRldGFjaCgpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBkZWVwRWFjaChlbC5jaGlsZE5vZGVzLCBjbGVhckRhdGEpXG5cbiAgICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZGV0YWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWxbcGFyZW50Tm9kZV0gJiYgZWxbcGFyZW50Tm9kZV0ucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIHdobyB1c2VzIGEgbW91c2UgYW55d2F5PyBvaCByaWdodC5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgICAgICovXG4gICAgLCBzY3JvbGxUb3A6IGZ1bmN0aW9uICh5KSB7XG4gICAgICAgIHJldHVybiBzY3JvbGwuY2FsbCh0aGlzLCBudWxsLCB5LCAneScpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAgICovXG4gICAgLCBzY3JvbGxMZWZ0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gc2Nyb2xsLmNhbGwodGhpcywgeCwgbnVsbCwgJ3gnKVxuICAgICAgfVxuXG4gIH1cblxuXG4gIGZ1bmN0aW9uIGNsb25lTm9kZShob3N0LCBlbCkge1xuICAgIHZhciBjID0gZWwuY2xvbmVOb2RlKHRydWUpXG4gICAgICAsIGNsb25lRWxlbXNcbiAgICAgICwgZWxFbGVtc1xuICAgICAgLCBpXG5cbiAgICAvLyBjaGVjayBmb3IgZXhpc3RlbmNlIG9mIGFuIGV2ZW50IGNsb25lclxuICAgIC8vIHByZWZlcmFibHkgaHR0cHM6Ly9naXRodWIuY29tL2ZhdC9iZWFuXG4gICAgLy8gb3RoZXJ3aXNlIEJvbnpvIHdvbid0IGRvIHRoaXMgZm9yIHlvdVxuICAgIGlmIChob3N0LiQgJiYgdHlwZW9mIGhvc3QuY2xvbmVFdmVudHMgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaG9zdC4kKGMpLmNsb25lRXZlbnRzKGVsKVxuXG4gICAgICAvLyBjbG9uZSBldmVudHMgZnJvbSBldmVyeSBjaGlsZCBub2RlXG4gICAgICBjbG9uZUVsZW1zID0gaG9zdC4kKGMpLmZpbmQoJyonKVxuICAgICAgZWxFbGVtcyA9IGhvc3QuJChlbCkuZmluZCgnKicpXG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBlbEVsZW1zLmxlbmd0aDsgaSsrKVxuICAgICAgICBob3N0LiQoY2xvbmVFbGVtc1tpXSkuY2xvbmVFdmVudHMoZWxFbGVtc1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQm9keShlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQgPT09IHdpbiB8fCAoL14oPzpib2R5fGh0bWwpJC9pKS50ZXN0KGVsZW1lbnQudGFnTmFtZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbCgpIHtcbiAgICByZXR1cm4geyB4OiB3aW4ucGFnZVhPZmZzZXQgfHwgaHRtbC5zY3JvbGxMZWZ0LCB5OiB3aW4ucGFnZVlPZmZzZXQgfHwgaHRtbC5zY3JvbGxUb3AgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2NyaXB0RnJvbUh0bWwoaHRtbCkge1xuICAgIHZhciBzY3JpcHRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICAsIG1hdGNoZXMgPSBodG1sLm1hdGNoKHNpbXBsZVNjcmlwdFRhZ1JlKVxuICAgIHNjcmlwdEVsLnNyYyA9IG1hdGNoZXNbMV1cbiAgICByZXR1cm4gc2NyaXB0RWxcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5LjxFbGVtZW50PnxFbGVtZW50fE5vZGV8c3RyaW5nfSBlbHNcbiAgICogQHJldHVybiB7Qm9uem99XG4gICAqL1xuICBmdW5jdGlvbiBib256byhlbHMpIHtcbiAgICByZXR1cm4gbmV3IEJvbnpvKGVscylcbiAgfVxuXG4gIGJvbnpvLnNldFF1ZXJ5RW5naW5lID0gZnVuY3Rpb24gKHEpIHtcbiAgICBxdWVyeSA9IHE7XG4gICAgZGVsZXRlIGJvbnpvLnNldFF1ZXJ5RW5naW5lXG4gIH1cblxuICBib256by5hdWcgPSBmdW5jdGlvbiAobywgdGFyZ2V0KSB7XG4gICAgLy8gZm9yIHRob3NlIHN0YW5kYWxvbmUgYm9uem8gdXNlcnMuIHRoaXMgbG92ZSBpcyBmb3IgeW91LlxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgby5oYXNPd25Qcm9wZXJ0eShrKSAmJiAoKHRhcmdldCB8fCBCb256by5wcm90b3R5cGUpW2tdID0gb1trXSlcbiAgICB9XG4gIH1cblxuICBib256by5jcmVhdGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoXG4gICAgcmV0dXJuIHR5cGVvZiBub2RlID09ICdzdHJpbmcnICYmIG5vZGUgIT09ICcnID9cbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNpbXBsZVNjcmlwdFRhZ1JlLnRlc3Qobm9kZSkpIHJldHVybiBbY3JlYXRlU2NyaXB0RnJvbUh0bWwobm9kZSldXG4gICAgICAgIHZhciB0YWcgPSBub2RlLm1hdGNoKC9eXFxzKjwoW15cXHM+XSspLylcbiAgICAgICAgICAsIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgLCBlbHMgPSBbXVxuICAgICAgICAgICwgcCA9IHRhZyA/IHRhZ01hcFt0YWdbMV0udG9Mb3dlckNhc2UoKV0gOiBudWxsXG4gICAgICAgICAgLCBkZXAgPSBwID8gcFsyXSArIDEgOiAxXG4gICAgICAgICAgLCBucyA9IHAgJiYgcFszXVxuICAgICAgICAgICwgcG4gPSBwYXJlbnROb2RlXG4gICAgICAgICAgLCB0YiA9IGZlYXR1cmVzLmF1dG9UYm9keSAmJiBwICYmIHBbMF0gPT0gJzx0YWJsZT4nICYmICEoLzx0Ym9keS9pKS50ZXN0KG5vZGUpXG5cbiAgICAgICAgZWwuaW5uZXJIVE1MID0gcCA/IChwWzBdICsgbm9kZSArIHBbMV0pIDogbm9kZVxuICAgICAgICB3aGlsZSAoZGVwLS0pIGVsID0gZWwuZmlyc3RDaGlsZFxuICAgICAgICAvLyBmb3IgSUUgTm9TY29wZSwgd2UgbWF5IGluc2VydCBjcnVmdCBhdCB0aGUgYmVnaW5pbmcganVzdCB0byBnZXQgaXQgdG8gd29ya1xuICAgICAgICBpZiAobnMgJiYgZWwgJiYgZWwubm9kZVR5cGUgIT09IDEpIGVsID0gZWwubmV4dFNpYmxpbmdcbiAgICAgICAgZG8ge1xuICAgICAgICAgIC8vIHRib2R5IHNwZWNpYWwgY2FzZSBmb3IgSUU8OCwgY3JlYXRlcyB0Ym9keSBvbiBhbnkgZW1wdHkgdGFibGVcbiAgICAgICAgICAvLyB3ZSBkb24ndCB3YW50IGl0IGlmIHdlJ3JlIGp1c3QgYWZ0ZXIgYSA8dGhlYWQ+LCA8Y2FwdGlvbj4sIGV0Yy5cbiAgICAgICAgICBpZiAoKCF0YWcgfHwgZWwubm9kZVR5cGUgPT0gMSkgJiYgKCF0YiB8fCAoZWwudGFnTmFtZSAmJiBlbC50YWdOYW1lICE9ICdUQk9EWScpKSkge1xuICAgICAgICAgICAgZWxzLnB1c2goZWwpXG4gICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChlbCA9IGVsLm5leHRTaWJsaW5nKVxuICAgICAgICAvLyBJRSA8IDkgZ2l2ZXMgdXMgYSBwYXJlbnROb2RlIHdoaWNoIG1lc3NlcyB1cCBpbnNlcnQoKSBjaGVjayBmb3IgY2xvbmluZ1xuICAgICAgICAvLyBgZGVwYCA+IDEgY2FuIGFsc28gY2F1c2UgcHJvYmxlbXMgd2l0aCB0aGUgaW5zZXJ0KCkgY2hlY2sgKG11c3QgZG8gdGhpcyBsYXN0KVxuICAgICAgICBlYWNoKGVscywgZnVuY3Rpb24oZWwpIHsgZWxbcG5dICYmIGVsW3BuXS5yZW1vdmVDaGlsZChlbCkgfSlcbiAgICAgICAgcmV0dXJuIGVsc1xuICAgICAgfSgpIDogaXNOb2RlKG5vZGUpID8gW25vZGUuY2xvbmVOb2RlKHRydWUpXSA6IFtdXG4gIH1cblxuICBib256by5kb2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZwID0gYm9uem8udmlld3BvcnQoKVxuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBNYXRoLm1heChkb2MuYm9keS5zY3JvbGxXaWR0aCwgaHRtbC5zY3JvbGxXaWR0aCwgdnAud2lkdGgpXG4gICAgICAsIGhlaWdodDogTWF0aC5tYXgoZG9jLmJvZHkuc2Nyb2xsSGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCwgdnAuaGVpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIGJvbnpvLmZpcnN0Q2hpbGQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICBmb3IgKHZhciBjID0gZWwuY2hpbGROb2RlcywgaSA9IDAsIGogPSAoYyAmJiBjLmxlbmd0aCkgfHwgMCwgZTsgaSA8IGo7IGkrKykge1xuICAgICAgaWYgKGNbaV0ubm9kZVR5cGUgPT09IDEpIGUgPSBjW2ogPSBpXVxuICAgIH1cbiAgICByZXR1cm4gZVxuICB9XG5cbiAgYm9uem8udmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IGllID8gaHRtbC5jbGllbnRXaWR0aCA6IHNlbGYuaW5uZXJXaWR0aFxuICAgICAgLCBoZWlnaHQ6IGllID8gaHRtbC5jbGllbnRIZWlnaHQgOiBzZWxmLmlubmVySGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgYm9uem8uaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGNvbnRhaW5lciwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT0gMTZcbiAgICB9IDogJ2NvbnRhaW5zJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KTtcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnRbcGFyZW50Tm9kZV0pIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICByZXR1cm4gYm9uem9cbn0pOyAvLyB0aGUgb25seSBsaW5lIHdlIGNhcmUgYWJvdXQgdXNpbmcgYSBzZW1pLWNvbG9uLiBwbGFjZWQgaGVyZSBmb3IgY29uY2F0ZW5hdGlvbiB0b29sc1xuIiwiXG4vLyBub3QgaW1wbGVtZW50ZWRcbi8vIFRoZSByZWFzb24gZm9yIGhhdmluZyBhbiBlbXB0eSBmaWxlIGFuZCBub3QgdGhyb3dpbmcgaXMgdG8gYWxsb3dcbi8vIHVudHJhZGl0aW9uYWwgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtb2R1bGUuXG4iLCJ2YXIgaW5zZXJ0ZWQgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gICAgaWYgKGluc2VydGVkLmluZGV4T2YoY3NzKSA+PSAwKSByZXR1cm47XG4gICAgaW5zZXJ0ZWQucHVzaChjc3MpO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgZWxlbS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBcbiAgICBpZiAoZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShlbGVtLCBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbMF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwiLyohXG4gICogQHByZXNlcnZlIFF3ZXJ5IC0gQSBCbGF6aW5nIEZhc3QgcXVlcnkgc2VsZWN0b3IgZW5naW5lXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9xd2VyeVxuICAqIGNvcHlyaWdodCBEdXN0aW4gRGlheiAyMDEyXG4gICogTUlUIExpY2Vuc2VcbiAgKi9cblxuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSkoJ3F3ZXJ5JywgdGhpcywgZnVuY3Rpb24gKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnRcbiAgICAsIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gICAgLCBieUNsYXNzID0gJ2dldEVsZW1lbnRzQnlDbGFzc05hbWUnXG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIHFTQSA9ICdxdWVyeVNlbGVjdG9yQWxsJ1xuICAgICwgdXNlTmF0aXZlUVNBID0gJ3VzZU5hdGl2ZVFTQSdcbiAgICAsIHRhZ05hbWUgPSAndGFnTmFtZSdcbiAgICAsIG5vZGVUeXBlID0gJ25vZGVUeXBlJ1xuICAgICwgc2VsZWN0IC8vIG1haW4gc2VsZWN0KCkgbWV0aG9kLCBhc3NpZ24gbGF0ZXJcblxuICAgICwgaWQgPSAvIyhbXFx3XFwtXSspL1xuICAgICwgY2xhcyA9IC9cXC5bXFx3XFwtXSsvZ1xuICAgICwgaWRPbmx5ID0gL14jKFtcXHdcXC1dKykkL1xuICAgICwgY2xhc3NPbmx5ID0gL15cXC4oW1xcd1xcLV0rKSQvXG4gICAgLCB0YWdPbmx5ID0gL14oW1xcd1xcLV0rKSQvXG4gICAgLCB0YWdBbmRPckNsYXNzID0gL14oW1xcd10rKT9cXC4oW1xcd1xcLV0rKSQvXG4gICAgLCBzcGxpdHRhYmxlID0gLyhefCwpXFxzKls+fitdL1xuICAgICwgbm9ybWFsaXpyID0gL15cXHMrfFxccyooWyxcXHNcXCtcXH4+XXwkKVxccyovZ1xuICAgICwgc3BsaXR0ZXJzID0gL1tcXHNcXD5cXCtcXH5dL1xuICAgICwgc3BsaXR0ZXJzTW9yZSA9IC8oPyFbXFxzXFx3XFwtXFwvXFw/XFwmXFw9XFw6XFwuXFwoXFwpXFwhLEAjJTw+XFx7XFx9XFwkXFwqXFxeJ1wiXSpcXF18W1xcc1xcd1xcK1xcLV0qXFwpKS9cbiAgICAsIHNwZWNpYWxDaGFycyA9IC8oWy4qKz9cXF49IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZ1xuICAgICwgc2ltcGxlID0gL14oXFwqfFthLXowLTldKyk/KD86KFtcXC5cXCNdK1tcXHdcXC1cXC4jXSspPykvXG4gICAgLCBhdHRyID0gL1xcWyhbXFx3XFwtXSspKD86KFtcXHxcXF5cXCRcXCpcXH5dP1xcPSlbJ1wiXT8oWyBcXHdcXC1cXC9cXD9cXCZcXD1cXDpcXC5cXChcXClcXCEsQCMlPD5cXHtcXH1cXCRcXCpcXF5dKylbXCInXT8pP1xcXS9cbiAgICAsIHBzZXVkbyA9IC86KFtcXHdcXC1dKykoXFwoWydcIl0/KFteKCldKylbJ1wiXT9cXCkpPy9cbiAgICAsIGVhc3kgPSBuZXcgUmVnRXhwKGlkT25seS5zb3VyY2UgKyAnfCcgKyB0YWdPbmx5LnNvdXJjZSArICd8JyArIGNsYXNzT25seS5zb3VyY2UpXG4gICAgLCBkaXZpZGVycyA9IG5ldyBSZWdFeHAoJygnICsgc3BsaXR0ZXJzLnNvdXJjZSArICcpJyArIHNwbGl0dGVyc01vcmUuc291cmNlLCAnZycpXG4gICAgLCB0b2tlbml6ciA9IG5ldyBSZWdFeHAoc3BsaXR0ZXJzLnNvdXJjZSArIHNwbGl0dGVyc01vcmUuc291cmNlKVxuICAgICwgY2h1bmtlciA9IG5ldyBSZWdFeHAoc2ltcGxlLnNvdXJjZSArICcoJyArIGF0dHIuc291cmNlICsgJyk/JyArICcoJyArIHBzZXVkby5zb3VyY2UgKyAnKT8nKVxuXG4gIHZhciB3YWxrZXIgPSB7XG4gICAgICAnICc6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUgIT09IGh0bWwgJiYgbm9kZS5wYXJlbnROb2RlXG4gICAgICB9XG4gICAgLCAnPic6IGZ1bmN0aW9uIChub2RlLCBjb250ZXN0YW50KSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUucGFyZW50Tm9kZSA9PSBjb250ZXN0YW50LnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlXG4gICAgICB9XG4gICAgLCAnfic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUucHJldmlvdXNTaWJsaW5nXG4gICAgICB9XG4gICAgLCAnKyc6IGZ1bmN0aW9uIChub2RlLCBjb250ZXN0YW50LCBwMSwgcDIpIHtcbiAgICAgICAgaWYgKCFub2RlKSByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIChwMSA9IHByZXZpb3VzKG5vZGUpKSAmJiAocDIgPSBwcmV2aW91cyhjb250ZXN0YW50KSkgJiYgcDEgPT0gcDIgJiYgcDFcbiAgICAgIH1cbiAgICB9XG5cbiAgZnVuY3Rpb24gY2FjaGUoKSB7XG4gICAgdGhpcy5jID0ge31cbiAgfVxuICBjYWNoZS5wcm90b3R5cGUgPSB7XG4gICAgZzogZnVuY3Rpb24gKGspIHtcbiAgICAgIHJldHVybiB0aGlzLmNba10gfHwgdW5kZWZpbmVkXG4gICAgfVxuICAsIHM6IGZ1bmN0aW9uIChrLCB2LCByKSB7XG4gICAgICB2ID0gciA/IG5ldyBSZWdFeHAodikgOiB2XG4gICAgICByZXR1cm4gKHRoaXMuY1trXSA9IHYpXG4gICAgfVxuICB9XG5cbiAgdmFyIGNsYXNzQ2FjaGUgPSBuZXcgY2FjaGUoKVxuICAgICwgY2xlYW5DYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCBhdHRyQ2FjaGUgPSBuZXcgY2FjaGUoKVxuICAgICwgdG9rZW5DYWNoZSA9IG5ldyBjYWNoZSgpXG5cbiAgZnVuY3Rpb24gY2xhc3NSZWdleChjKSB7XG4gICAgcmV0dXJuIGNsYXNzQ2FjaGUuZyhjKSB8fCBjbGFzc0NhY2hlLnMoYywgJyhefFxcXFxzKyknICsgYyArICcoXFxcXHMrfCQpJywgMSlcbiAgfVxuXG4gIC8vIG5vdCBxdWl0ZSBhcyBmYXN0IGFzIGlubGluZSBsb29wcyBpbiBvbGRlciBicm93c2VycyBzbyBkb24ndCB1c2UgbGliZXJhbGx5XG4gIGZ1bmN0aW9uIGVhY2goYSwgZm4pIHtcbiAgICB2YXIgaSA9IDAsIGwgPSBhLmxlbmd0aFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSBmbihhW2ldKVxuICB9XG5cbiAgZnVuY3Rpb24gZmxhdHRlbihhcikge1xuICAgIGZvciAodmFyIHIgPSBbXSwgaSA9IDAsIGwgPSBhci5sZW5ndGg7IGkgPCBsOyArK2kpIGFycmF5TGlrZShhcltpXSkgPyAociA9IHIuY29uY2F0KGFyW2ldKSkgOiAocltyLmxlbmd0aF0gPSBhcltpXSlcbiAgICByZXR1cm4gclxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlpZnkoYXIpIHtcbiAgICB2YXIgaSA9IDAsIGwgPSBhci5sZW5ndGgsIHIgPSBbXVxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSByW2ldID0gYXJbaV1cbiAgICByZXR1cm4gclxuICB9XG5cbiAgZnVuY3Rpb24gcHJldmlvdXMobikge1xuICAgIHdoaWxlIChuID0gbi5wcmV2aW91c1NpYmxpbmcpIGlmIChuW25vZGVUeXBlXSA9PSAxKSBicmVhaztcbiAgICByZXR1cm4gblxuICB9XG5cbiAgZnVuY3Rpb24gcShxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5tYXRjaChjaHVua2VyKVxuICB9XG5cbiAgLy8gY2FsbGVkIHVzaW5nIGB0aGlzYCBhcyBlbGVtZW50IGFuZCBhcmd1bWVudHMgZnJvbSByZWdleCBncm91cCByZXN1bHRzLlxuICAvLyBnaXZlbiA9PiBkaXYuaGVsbG9bdGl0bGU9XCJ3b3JsZFwiXTpmb28oJ2JhcicpXG4gIC8vIGRpdi5oZWxsb1t0aXRsZT1cIndvcmxkXCJdOmZvbygnYmFyJyksIGRpdiwgLmhlbGxvLCBbdGl0bGU9XCJ3b3JsZFwiXSwgdGl0bGUsID0sIHdvcmxkLCA6Zm9vKCdiYXInKSwgZm9vLCAoJ2JhcicpLCBiYXJdXG4gIGZ1bmN0aW9uIGludGVycHJldCh3aG9sZSwgdGFnLCBpZHNBbmRDbGFzc2VzLCB3aG9sZUF0dHJpYnV0ZSwgYXR0cmlidXRlLCBxdWFsaWZpZXIsIHZhbHVlLCB3aG9sZVBzZXVkbywgcHNldWRvLCB3aG9sZVBzZXVkb1ZhbCwgcHNldWRvVmFsKSB7XG4gICAgdmFyIGksIG0sIGssIG8sIGNsYXNzZXNcbiAgICBpZiAodGhpc1tub2RlVHlwZV0gIT09IDEpIHJldHVybiBmYWxzZVxuICAgIGlmICh0YWcgJiYgdGFnICE9PSAnKicgJiYgdGhpc1t0YWdOYW1lXSAmJiB0aGlzW3RhZ05hbWVdLnRvTG93ZXJDYXNlKCkgIT09IHRhZykgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGlkc0FuZENsYXNzZXMgJiYgKG0gPSBpZHNBbmRDbGFzc2VzLm1hdGNoKGlkKSkgJiYgbVsxXSAhPT0gdGhpcy5pZCkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGlkc0FuZENsYXNzZXMgJiYgKGNsYXNzZXMgPSBpZHNBbmRDbGFzc2VzLm1hdGNoKGNsYXMpKSkge1xuICAgICAgZm9yIChpID0gY2xhc3Nlcy5sZW5ndGg7IGktLTspIGlmICghY2xhc3NSZWdleChjbGFzc2VzW2ldLnNsaWNlKDEpKS50ZXN0KHRoaXMuY2xhc3NOYW1lKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmIChwc2V1ZG8gJiYgcXdlcnkucHNldWRvc1twc2V1ZG9dICYmICFxd2VyeS5wc2V1ZG9zW3BzZXVkb10odGhpcywgcHNldWRvVmFsKSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHdob2xlQXR0cmlidXRlICYmICF2YWx1ZSkgeyAvLyBzZWxlY3QgaXMganVzdCBmb3IgZXhpc3RhbmNlIG9mIGF0dHJpYlxuICAgICAgbyA9IHRoaXMuYXR0cmlidXRlc1xuICAgICAgZm9yIChrIGluIG8pIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSAmJiAob1trXS5uYW1lIHx8IGspID09IGF0dHJpYnV0ZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdob2xlQXR0cmlidXRlICYmICFjaGVja0F0dHIocXVhbGlmaWVyLCBnZXRBdHRyKHRoaXMsIGF0dHJpYnV0ZSkgfHwgJycsIHZhbHVlKSkge1xuICAgICAgLy8gc2VsZWN0IGlzIGZvciBhdHRyaWIgZXF1YWxpdHlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYW4ocykge1xuICAgIHJldHVybiBjbGVhbkNhY2hlLmcocykgfHwgY2xlYW5DYWNoZS5zKHMsIHMucmVwbGFjZShzcGVjaWFsQ2hhcnMsICdcXFxcJDEnKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrQXR0cihxdWFsaWZ5LCBhY3R1YWwsIHZhbCkge1xuICAgIHN3aXRjaCAocXVhbGlmeSkge1xuICAgIGNhc2UgJz0nOlxuICAgICAgcmV0dXJuIGFjdHVhbCA9PSB2YWxcbiAgICBjYXNlICdePSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCdePScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCdePScgKyB2YWwsICdeJyArIGNsZWFuKHZhbCksIDEpKVxuICAgIGNhc2UgJyQ9JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJyQ9JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJyQ9JyArIHZhbCwgY2xlYW4odmFsKSArICckJywgMSkpXG4gICAgY2FzZSAnKj0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZyh2YWwpIHx8IGF0dHJDYWNoZS5zKHZhbCwgY2xlYW4odmFsKSwgMSkpXG4gICAgY2FzZSAnfj0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnfj0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnfj0nICsgdmFsLCAnKD86XnxcXFxccyspJyArIGNsZWFuKHZhbCkgKyAnKD86XFxcXHMrfCQpJywgMSkpXG4gICAgY2FzZSAnfD0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnfD0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnfD0nICsgdmFsLCAnXicgKyBjbGVhbih2YWwpICsgJygtfCQpJywgMSkpXG4gICAgfVxuICAgIHJldHVybiAwXG4gIH1cblxuICAvLyBnaXZlbiBhIHNlbGVjdG9yLCBmaXJzdCBjaGVjayBmb3Igc2ltcGxlIGNhc2VzIHRoZW4gY29sbGVjdCBhbGwgYmFzZSBjYW5kaWRhdGUgbWF0Y2hlcyBhbmQgZmlsdGVyXG4gIGZ1bmN0aW9uIF9xd2VyeShzZWxlY3RvciwgX3Jvb3QpIHtcbiAgICB2YXIgciA9IFtdLCByZXQgPSBbXSwgaSwgbCwgbSwgdG9rZW4sIHRhZywgZWxzLCBpbnRyLCBpdGVtLCByb290ID0gX3Jvb3RcbiAgICAgICwgdG9rZW5zID0gdG9rZW5DYWNoZS5nKHNlbGVjdG9yKSB8fCB0b2tlbkNhY2hlLnMoc2VsZWN0b3IsIHNlbGVjdG9yLnNwbGl0KHRva2VuaXpyKSlcbiAgICAgICwgZGl2aWRlZFRva2VucyA9IHNlbGVjdG9yLm1hdGNoKGRpdmlkZXJzKVxuXG4gICAgaWYgKCF0b2tlbnMubGVuZ3RoKSByZXR1cm4gclxuXG4gICAgdG9rZW4gPSAodG9rZW5zID0gdG9rZW5zLnNsaWNlKDApKS5wb3AoKSAvLyBjb3B5IGNhY2hlZCB0b2tlbnMsIHRha2UgdGhlIGxhc3Qgb25lXG4gICAgaWYgKHRva2Vucy5sZW5ndGggJiYgKG0gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLm1hdGNoKGlkT25seSkpKSByb290ID0gYnlJZChfcm9vdCwgbVsxXSlcbiAgICBpZiAoIXJvb3QpIHJldHVybiByXG5cbiAgICBpbnRyID0gcSh0b2tlbilcbiAgICAvLyBjb2xsZWN0IGJhc2UgY2FuZGlkYXRlcyB0byBmaWx0ZXJcbiAgICBlbHMgPSByb290ICE9PSBfcm9vdCAmJiByb290W25vZGVUeXBlXSAhPT0gOSAmJiBkaXZpZGVkVG9rZW5zICYmIC9eWyt+XSQvLnRlc3QoZGl2aWRlZFRva2Vuc1tkaXZpZGVkVG9rZW5zLmxlbmd0aCAtIDFdKSA/XG4gICAgICBmdW5jdGlvbiAocikge1xuICAgICAgICB3aGlsZSAocm9vdCA9IHJvb3QubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICByb290W25vZGVUeXBlXSA9PSAxICYmIChpbnRyWzFdID8gaW50clsxXSA9PSByb290W3RhZ05hbWVdLnRvTG93ZXJDYXNlKCkgOiAxKSAmJiAocltyLmxlbmd0aF0gPSByb290KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByXG4gICAgICB9KFtdKSA6XG4gICAgICByb290W2J5VGFnXShpbnRyWzFdIHx8ICcqJylcbiAgICAvLyBmaWx0ZXIgZWxlbWVudHMgYWNjb3JkaW5nIHRvIHRoZSByaWdodC1tb3N0IHBhcnQgb2YgdGhlIHNlbGVjdG9yXG4gICAgZm9yIChpID0gMCwgbCA9IGVscy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChpdGVtID0gaW50ZXJwcmV0LmFwcGx5KGVsc1tpXSwgaW50cikpIHJbci5sZW5ndGhdID0gaXRlbVxuICAgIH1cbiAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHJldHVybiByXG5cbiAgICAvLyBmaWx0ZXIgZnVydGhlciBhY2NvcmRpbmcgdG8gdGhlIHJlc3Qgb2YgdGhlIHNlbGVjdG9yICh0aGUgbGVmdCBzaWRlKVxuICAgIGVhY2gociwgZnVuY3Rpb24gKGUpIHsgaWYgKGFuY2VzdG9yTWF0Y2goZSwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zKSkgcmV0W3JldC5sZW5ndGhdID0gZSB9KVxuICAgIHJldHVybiByZXRcbiAgfVxuXG4gIC8vIGNvbXBhcmUgZWxlbWVudCB0byBhIHNlbGVjdG9yXG4gIGZ1bmN0aW9uIGlzKGVsLCBzZWxlY3Rvciwgcm9vdCkge1xuICAgIGlmIChpc05vZGUoc2VsZWN0b3IpKSByZXR1cm4gZWwgPT0gc2VsZWN0b3JcbiAgICBpZiAoYXJyYXlMaWtlKHNlbGVjdG9yKSkgcmV0dXJuICEhfmZsYXR0ZW4oc2VsZWN0b3IpLmluZGV4T2YoZWwpIC8vIGlmIHNlbGVjdG9yIGlzIGFuIGFycmF5LCBpcyBlbCBhIG1lbWJlcj9cblxuICAgIHZhciBzZWxlY3RvcnMgPSBzZWxlY3Rvci5zcGxpdCgnLCcpLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnNcbiAgICB3aGlsZSAoc2VsZWN0b3IgPSBzZWxlY3RvcnMucG9wKCkpIHtcbiAgICAgIHRva2VucyA9IHRva2VuQ2FjaGUuZyhzZWxlY3RvcikgfHwgdG9rZW5DYWNoZS5zKHNlbGVjdG9yLCBzZWxlY3Rvci5zcGxpdCh0b2tlbml6cikpXG4gICAgICBkaXZpZGVkVG9rZW5zID0gc2VsZWN0b3IubWF0Y2goZGl2aWRlcnMpXG4gICAgICB0b2tlbnMgPSB0b2tlbnMuc2xpY2UoMCkgLy8gY29weSBhcnJheVxuICAgICAgaWYgKGludGVycHJldC5hcHBseShlbCwgcSh0b2tlbnMucG9wKCkpKSAmJiAoIXRva2Vucy5sZW5ndGggfHwgYW5jZXN0b3JNYXRjaChlbCwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zLCByb290KSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBnaXZlbiBlbGVtZW50cyBtYXRjaGluZyB0aGUgcmlnaHQtbW9zdCBwYXJ0IG9mIGEgc2VsZWN0b3IsIGZpbHRlciBvdXQgYW55IHRoYXQgZG9uJ3QgbWF0Y2ggdGhlIHJlc3RcbiAgZnVuY3Rpb24gYW5jZXN0b3JNYXRjaChlbCwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zLCByb290KSB7XG4gICAgdmFyIGNhbmRcbiAgICAvLyByZWN1cnNpdmVseSB3b3JrIGJhY2t3YXJkcyB0aHJvdWdoIHRoZSB0b2tlbnMgYW5kIHVwIHRoZSBkb20sIGNvdmVyaW5nIGFsbCBvcHRpb25zXG4gICAgZnVuY3Rpb24gY3Jhd2woZSwgaSwgcCkge1xuICAgICAgd2hpbGUgKHAgPSB3YWxrZXJbZGl2aWRlZFRva2Vuc1tpXV0ocCwgZSkpIHtcbiAgICAgICAgaWYgKGlzTm9kZShwKSAmJiAoaW50ZXJwcmV0LmFwcGx5KHAsIHEodG9rZW5zW2ldKSkpKSB7XG4gICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIGlmIChjYW5kID0gY3Jhd2wocCwgaSAtIDEsIHApKSByZXR1cm4gY2FuZFxuICAgICAgICAgIH0gZWxzZSByZXR1cm4gcFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoY2FuZCA9IGNyYXdsKGVsLCB0b2tlbnMubGVuZ3RoIC0gMSwgZWwpKSAmJiAoIXJvb3QgfHwgaXNBbmNlc3RvcihjYW5kLCByb290KSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShlbCwgdCkge1xuICAgIHJldHVybiBlbCAmJiB0eXBlb2YgZWwgPT09ICdvYmplY3QnICYmICh0ID0gZWxbbm9kZVR5cGVdKSAmJiAodCA9PSAxIHx8IHQgPT0gOSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaXEoYXIpIHtcbiAgICB2YXIgYSA9IFtdLCBpLCBqO1xuICAgIG86XG4gICAgZm9yIChpID0gMDsgaSA8IGFyLmxlbmd0aDsgKytpKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgYS5sZW5ndGg7ICsraikgaWYgKGFbal0gPT0gYXJbaV0pIGNvbnRpbnVlIG9cbiAgICAgIGFbYS5sZW5ndGhdID0gYXJbaV1cbiAgICB9XG4gICAgcmV0dXJuIGFcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5TGlrZShvKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgaXNGaW5pdGUoby5sZW5ndGgpKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplUm9vdChyb290KSB7XG4gICAgaWYgKCFyb290KSByZXR1cm4gZG9jXG4gICAgaWYgKHR5cGVvZiByb290ID09ICdzdHJpbmcnKSByZXR1cm4gcXdlcnkocm9vdClbMF1cbiAgICBpZiAoIXJvb3Rbbm9kZVR5cGVdICYmIGFycmF5TGlrZShyb290KSkgcmV0dXJuIHJvb3RbMF1cbiAgICByZXR1cm4gcm9vdFxuICB9XG5cbiAgZnVuY3Rpb24gYnlJZChyb290LCBpZCwgZWwpIHtcbiAgICAvLyBpZiBkb2MsIHF1ZXJ5IG9uIGl0LCBlbHNlIHF1ZXJ5IHRoZSBwYXJlbnQgZG9jIG9yIGlmIGEgZGV0YWNoZWQgZnJhZ21lbnQgcmV3cml0ZSB0aGUgcXVlcnkgYW5kIHJ1biBvbiB0aGUgZnJhZ21lbnRcbiAgICByZXR1cm4gcm9vdFtub2RlVHlwZV0gPT09IDkgPyByb290LmdldEVsZW1lbnRCeUlkKGlkKSA6XG4gICAgICByb290Lm93bmVyRG9jdW1lbnQgJiZcbiAgICAgICAgKCgoZWwgPSByb290Lm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKSAmJiBpc0FuY2VzdG9yKGVsLCByb290KSAmJiBlbCkgfHxcbiAgICAgICAgICAoIWlzQW5jZXN0b3Iocm9vdCwgcm9vdC5vd25lckRvY3VtZW50KSAmJiBzZWxlY3QoJ1tpZD1cIicgKyBpZCArICdcIl0nLCByb290KVswXSkpXG4gIH1cblxuICBmdW5jdGlvbiBxd2VyeShzZWxlY3RvciwgX3Jvb3QpIHtcbiAgICB2YXIgbSwgZWwsIHJvb3QgPSBub3JtYWxpemVSb290KF9yb290KVxuXG4gICAgLy8gZWFzeSwgZmFzdCBjYXNlcyB0aGF0IHdlIGNhbiBkaXNwYXRjaCB3aXRoIHNpbXBsZSBET00gY2FsbHNcbiAgICBpZiAoIXJvb3QgfHwgIXNlbGVjdG9yKSByZXR1cm4gW11cbiAgICBpZiAoc2VsZWN0b3IgPT09IHdpbmRvdyB8fCBpc05vZGUoc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gIV9yb290IHx8IChzZWxlY3RvciAhPT0gd2luZG93ICYmIGlzTm9kZShyb290KSAmJiBpc0FuY2VzdG9yKHNlbGVjdG9yLCByb290KSkgPyBbc2VsZWN0b3JdIDogW11cbiAgICB9XG4gICAgaWYgKHNlbGVjdG9yICYmIGFycmF5TGlrZShzZWxlY3RvcikpIHJldHVybiBmbGF0dGVuKHNlbGVjdG9yKVxuICAgIGlmIChtID0gc2VsZWN0b3IubWF0Y2goZWFzeSkpIHtcbiAgICAgIGlmIChtWzFdKSByZXR1cm4gKGVsID0gYnlJZChyb290LCBtWzFdKSkgPyBbZWxdIDogW11cbiAgICAgIGlmIChtWzJdKSByZXR1cm4gYXJyYXlpZnkocm9vdFtieVRhZ10obVsyXSkpXG4gICAgICBpZiAoaGFzQnlDbGFzcyAmJiBtWzNdKSByZXR1cm4gYXJyYXlpZnkocm9vdFtieUNsYXNzXShtWzNdKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0KHNlbGVjdG9yLCByb290KVxuICB9XG5cbiAgLy8gd2hlcmUgdGhlIHJvb3QgaXMgbm90IGRvY3VtZW50IGFuZCBhIHJlbGF0aW9uc2hpcCBzZWxlY3RvciBpcyBmaXJzdCB3ZSBoYXZlIHRvXG4gIC8vIGRvIHNvbWUgYXdrd2FyZCBhZGp1c3RtZW50cyB0byBnZXQgaXQgdG8gd29yaywgZXZlbiB3aXRoIHFTQVxuICBmdW5jdGlvbiBjb2xsZWN0U2VsZWN0b3Iocm9vdCwgY29sbGVjdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzKSB7XG4gICAgICB2YXIgb2lkLCBuaWRcbiAgICAgIGlmIChzcGxpdHRhYmxlLnRlc3QocykpIHtcbiAgICAgICAgaWYgKHJvb3Rbbm9kZVR5cGVdICE9PSA5KSB7XG4gICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBlbCBoYXMgYW4gaWQsIHJld3JpdGUgdGhlIHF1ZXJ5LCBzZXQgcm9vdCB0byBkb2MgYW5kIHJ1biBpdFxuICAgICAgICAgIGlmICghKG5pZCA9IG9pZCA9IHJvb3QuZ2V0QXR0cmlidXRlKCdpZCcpKSkgcm9vdC5zZXRBdHRyaWJ1dGUoJ2lkJywgbmlkID0gJ19fcXdlcnltZXVwc2NvdHR5JylcbiAgICAgICAgICBzID0gJ1tpZD1cIicgKyBuaWQgKyAnXCJdJyArIHMgLy8gYXZvaWQgYnlJZCBhbmQgYWxsb3cgdXMgdG8gbWF0Y2ggY29udGV4dCBlbGVtZW50XG4gICAgICAgICAgY29sbGVjdG9yKHJvb3QucGFyZW50Tm9kZSB8fCByb290LCBzLCB0cnVlKVxuICAgICAgICAgIG9pZCB8fCByb290LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHMubGVuZ3RoICYmIGNvbGxlY3Rvcihyb290LCBzLCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT0gMTZcbiAgICB9IDogJ2NvbnRhaW5zJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIgPSBjb250YWluZXJbbm9kZVR5cGVdID09PSA5IHx8IGNvbnRhaW5lciA9PSB3aW5kb3cgPyBodG1sIDogY29udGFpbmVyXG4gICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSByZXR1cm4gMVxuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gICwgZ2V0QXR0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGRldGVjdCBidWdneSBJRSBzcmMvaHJlZiBnZXRBdHRyaWJ1dGUoKSBjYWxsXG4gICAgICB2YXIgZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgIHJldHVybiAoKGUuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjeFwiPng8L2E+JykgJiYgZS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSgnaHJlZicpICE9ICcjeCcpID9cbiAgICAgICAgZnVuY3Rpb24gKGUsIGEpIHtcbiAgICAgICAgICByZXR1cm4gYSA9PT0gJ2NsYXNzJyA/IGUuY2xhc3NOYW1lIDogKGEgPT09ICdocmVmJyB8fCBhID09PSAnc3JjJykgP1xuICAgICAgICAgICAgZS5nZXRBdHRyaWJ1dGUoYSwgMikgOiBlLmdldEF0dHJpYnV0ZShhKVxuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24gKGUsIGEpIHsgcmV0dXJuIGUuZ2V0QXR0cmlidXRlKGEpIH1cbiAgICB9KClcbiAgLCBoYXNCeUNsYXNzID0gISFkb2NbYnlDbGFzc11cbiAgICAvLyBoYXMgbmF0aXZlIHFTQSBzdXBwb3J0XG4gICwgaGFzUVNBID0gZG9jLnF1ZXJ5U2VsZWN0b3IgJiYgZG9jW3FTQV1cbiAgICAvLyB1c2UgbmF0aXZlIHFTQVxuICAsIHNlbGVjdFFTQSA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLCBzcywgZVxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHJvb3Rbbm9kZVR5cGVdID09PSA5IHx8ICFzcGxpdHRhYmxlLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgLy8gbW9zdCB3b3JrIGlzIGRvbmUgcmlnaHQgaGVyZSwgZGVmZXIgdG8gcVNBXG4gICAgICAgICAgcmV0dXJuIGFycmF5aWZ5KHJvb3RbcVNBXShzZWxlY3RvcikpXG4gICAgICAgIH1cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIHdoZXJlIHdlIG5lZWQgdGhlIHNlcnZpY2VzIG9mIGBjb2xsZWN0U2VsZWN0b3IoKWBcbiAgICAgICAgZWFjaChzcyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIGNvbGxlY3RTZWxlY3Rvcihyb290LCBmdW5jdGlvbiAoY3R4LCBzKSB7XG4gICAgICAgICAgZSA9IGN0eFtxU0FdKHMpXG4gICAgICAgICAgaWYgKGUubGVuZ3RoID09IDEpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGUuaXRlbSgwKVxuICAgICAgICAgIGVsc2UgaWYgKGUubGVuZ3RoKSByZXN1bHQgPSByZXN1bHQuY29uY2F0KGFycmF5aWZ5KGUpKVxuICAgICAgICB9KSlcbiAgICAgICAgcmV0dXJuIHNzLmxlbmd0aCA+IDEgJiYgcmVzdWx0Lmxlbmd0aCA+IDEgPyB1bmlxKHJlc3VsdCkgOiByZXN1bHRcbiAgICAgIH0gY2F0Y2ggKGV4KSB7IH1cbiAgICAgIHJldHVybiBzZWxlY3ROb25OYXRpdmUoc2VsZWN0b3IsIHJvb3QpXG4gICAgfVxuICAgIC8vIG5vIG5hdGl2ZSBzZWxlY3RvciBzdXBwb3J0XG4gICwgc2VsZWN0Tm9uTmF0aXZlID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW10sIGl0ZW1zLCBtLCBpLCBsLCByLCBzc1xuICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKG5vcm1hbGl6ciwgJyQxJylcbiAgICAgIGlmIChtID0gc2VsZWN0b3IubWF0Y2godGFnQW5kT3JDbGFzcykpIHtcbiAgICAgICAgciA9IGNsYXNzUmVnZXgobVsyXSlcbiAgICAgICAgaXRlbXMgPSByb290W2J5VGFnXShtWzFdIHx8ICcqJylcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChyLnRlc3QoaXRlbXNbaV0uY2xhc3NOYW1lKSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gaXRlbXNbaV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgICAvLyBtb3JlIGNvbXBsZXggc2VsZWN0b3IsIGdldCBgX3F3ZXJ5KClgIHRvIGRvIHRoZSB3b3JrIGZvciB1c1xuICAgICAgZWFjaChzcyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIGNvbGxlY3RTZWxlY3Rvcihyb290LCBmdW5jdGlvbiAoY3R4LCBzLCByZXdyaXRlKSB7XG4gICAgICAgIHIgPSBfcXdlcnkocywgY3R4KVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3R4W25vZGVUeXBlXSA9PT0gOSB8fCByZXdyaXRlIHx8IGlzQW5jZXN0b3IocltpXSwgcm9vdCkpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHJbaV1cbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICByZXR1cm4gc3MubGVuZ3RoID4gMSAmJiByZXN1bHQubGVuZ3RoID4gMSA/IHVuaXEocmVzdWx0KSA6IHJlc3VsdFxuICAgIH1cbiAgLCBjb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgLy8gY29uZmlnTmF0aXZlUVNBOiB1c2UgZnVsbHktaW50ZXJuYWwgc2VsZWN0b3Igb3IgbmF0aXZlIHFTQSB3aGVyZSBwcmVzZW50XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnNbdXNlTmF0aXZlUVNBXSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHNlbGVjdCA9ICFvcHRpb25zW3VzZU5hdGl2ZVFTQV0gPyBzZWxlY3ROb25OYXRpdmUgOiBoYXNRU0EgPyBzZWxlY3RRU0EgOiBzZWxlY3ROb25OYXRpdmVcbiAgICB9XG5cbiAgY29uZmlndXJlKHsgdXNlTmF0aXZlUVNBOiB0cnVlIH0pXG5cbiAgcXdlcnkuY29uZmlndXJlID0gY29uZmlndXJlXG4gIHF3ZXJ5LnVuaXEgPSB1bmlxXG4gIHF3ZXJ5LmlzID0gaXNcbiAgcXdlcnkucHNldWRvcyA9IHt9XG5cbiAgcmV0dXJuIHF3ZXJ5XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gaGFzS2V5c1xuXG5mdW5jdGlvbiBoYXNLZXlzKHNvdXJjZSkge1xuICAgIHJldHVybiBzb3VyY2UgIT09IG51bGwgJiZcbiAgICAgICAgKHR5cGVvZiBzb3VyY2UgPT09IFwib2JqZWN0XCIgfHxcbiAgICAgICAgdHlwZW9mIHNvdXJjZSA9PT0gXCJmdW5jdGlvblwiKVxufVxuIiwidmFyIEtleXMgPSByZXF1aXJlKFwib2JqZWN0LWtleXNcIilcbnZhciBoYXNLZXlzID0gcmVxdWlyZShcIi4vaGFzLWtleXNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXVxuXG4gICAgICAgIGlmICghaGFzS2V5cyhzb3VyY2UpKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXMgPSBLZXlzKHNvdXJjZSlcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0ga2V5c1tqXVxuICAgICAgICAgICAgdGFyZ2V0W25hbWVdID0gc291cmNlW25hbWVdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCJ2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBpc0Z1bmMgPSAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmICEoZm4gaW5zdGFuY2VvZiBSZWdFeHApKSB8fCB0b1N0cmluZy5jYWxsKGZuKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0aWYgKCFpc0Z1bmMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpc0Z1bmMgPSBmbiA9PT0gd2luZG93LnNldFRpbWVvdXQgfHwgZm4gPT09IHdpbmRvdy5hbGVydCB8fCBmbiA9PT0gd2luZG93LmNvbmZpcm0gfHwgZm4gPT09IHdpbmRvdy5wcm9tcHQ7XG5cdH1cblx0cmV0dXJuIGlzRnVuYztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG5cdGlmICghaXNGdW5jdGlvbihmbikpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0fVxuXHR2YXIgaSwgayxcblx0XHRpc1N0cmluZyA9IHR5cGVvZiBvYmogPT09ICdzdHJpbmcnLFxuXHRcdGwgPSBvYmoubGVuZ3RoLFxuXHRcdGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG5cdGlmIChsID09PSArbCkge1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdGlmIChjb250ZXh0ID09PSBudWxsKSB7XG5cdFx0XHRcdGZuKGlzU3RyaW5nID8gb2JqLmNoYXJBdChpKSA6IG9ialtpXSwgaSwgb2JqKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZuLmNhbGwoY29udGV4dCwgaXNTdHJpbmcgPyBvYmouY2hhckF0KGkpIDogb2JqW2ldLCBpLCBvYmopO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IgKGsgaW4gb2JqKSB7XG5cdFx0XHRpZiAoaGFzT3duLmNhbGwob2JqLCBrKSkge1xuXHRcdFx0XHRpZiAoY29udGV4dCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdGZuKG9ialtrXSwgaywgb2JqKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmbi5jYWxsKGNvbnRleHQsIG9ialtrXSwgaywgb2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCByZXF1aXJlKCcuL3NoaW0nKTtcblxuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuXHR2YXIgc3RyID0gdG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cdHZhciBpc0FyZ3VtZW50cyA9IHN0ciA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cdGlmICghaXNBcmd1bWVudHMpIHtcblx0XHRpc0FyZ3VtZW50cyA9IHN0ciAhPT0gJ1tvYmplY3QgQXJyYXldJ1xuXHRcdFx0JiYgdmFsdWUgIT09IG51bGxcblx0XHRcdCYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblx0XHRcdCYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInXG5cdFx0XHQmJiB2YWx1ZS5sZW5ndGggPj0gMFxuXHRcdFx0JiYgdG9TdHJpbmcuY2FsbCh2YWx1ZS5jYWxsZWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR9XG5cdHJldHVybiBpc0FyZ3VtZW50cztcbn07XG5cbiIsIihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8vIG1vZGlmaWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbVxuXHR2YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcblx0XHR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdFx0Zm9yRWFjaCA9IHJlcXVpcmUoJy4vZm9yZWFjaCcpLFxuXHRcdGlzQXJncyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcblx0XHRoYXNEb250RW51bUJ1ZyA9ICEoeyd0b1N0cmluZyc6IG51bGx9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKSxcblx0XHRoYXNQcm90b0VudW1CdWcgPSAoZnVuY3Rpb24gKCkge30pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdwcm90b3R5cGUnKSxcblx0XHRkb250RW51bXMgPSBbXG5cdFx0XHRcInRvU3RyaW5nXCIsXG5cdFx0XHRcInRvTG9jYWxlU3RyaW5nXCIsXG5cdFx0XHRcInZhbHVlT2ZcIixcblx0XHRcdFwiaGFzT3duUHJvcGVydHlcIixcblx0XHRcdFwiaXNQcm90b3R5cGVPZlwiLFxuXHRcdFx0XCJwcm9wZXJ0eUlzRW51bWVyYWJsZVwiLFxuXHRcdFx0XCJjb25zdHJ1Y3RvclwiXG5cdFx0XSxcblx0XHRrZXlzU2hpbTtcblxuXHRrZXlzU2hpbSA9IGZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG5cdFx0dmFyIGlzT2JqZWN0ID0gb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnLFxuXHRcdFx0aXNGdW5jdGlvbiA9IHRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcblx0XHRcdGlzQXJndW1lbnRzID0gaXNBcmdzKG9iamVjdCksXG5cdFx0XHR0aGVLZXlzID0gW107XG5cblx0XHRpZiAoIWlzT2JqZWN0ICYmICFpc0Z1bmN0aW9uICYmICFpc0FyZ3VtZW50cykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5rZXlzIGNhbGxlZCBvbiBhIG5vbi1vYmplY3RcIik7XG5cdFx0fVxuXG5cdFx0aWYgKGlzQXJndW1lbnRzKSB7XG5cdFx0XHRmb3JFYWNoKG9iamVjdCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHRoZUtleXMucHVzaCh2YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG5hbWUsXG5cdFx0XHRcdHNraXBQcm90byA9IGhhc1Byb3RvRW51bUJ1ZyAmJiBpc0Z1bmN0aW9uO1xuXG5cdFx0XHRmb3IgKG5hbWUgaW4gb2JqZWN0KSB7XG5cdFx0XHRcdGlmICghKHNraXBQcm90byAmJiBuYW1lID09PSAncHJvdG90eXBlJykgJiYgaGFzLmNhbGwob2JqZWN0LCBuYW1lKSkge1xuXHRcdFx0XHRcdHRoZUtleXMucHVzaChuYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChoYXNEb250RW51bUJ1Zykge1xuXHRcdFx0dmFyIGN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG5cdFx0XHRcdHNraXBDb25zdHJ1Y3RvciA9IGN0b3IgJiYgY3Rvci5wcm90b3R5cGUgPT09IG9iamVjdDtcblxuXHRcdFx0Zm9yRWFjaChkb250RW51bXMsIGZ1bmN0aW9uIChkb250RW51bSkge1xuXHRcdFx0XHRpZiAoIShza2lwQ29uc3RydWN0b3IgJiYgZG9udEVudW0gPT09ICdjb25zdHJ1Y3RvcicpICYmIGhhcy5jYWxsKG9iamVjdCwgZG9udEVudW0pKSB7XG5cdFx0XHRcdFx0dGhlS2V5cy5wdXNoKGRvbnRFbnVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGVLZXlzO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0ga2V5c1NoaW07XG59KCkpO1xuXG4iLCJtb2R1bGUuZXhwb3J0cz0oZnVuY3Rpb24oKSB7dmFyIHQgPSBmdW5jdGlvbiBhbm9ueW1vdXMobG9jYWxzLCBmaWx0ZXJzLCBlc2NhcGUpIHtcbmVzY2FwZSA9IGVzY2FwZSB8fCBmdW5jdGlvbiAoaHRtbCl7XG4gIHJldHVybiBTdHJpbmcoaHRtbClcbiAgICAucmVwbGFjZSgvJig/IVxcdys7KS9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbn07XG52YXIgYnVmID0gW107XG53aXRoIChsb2NhbHMgfHwge30pIHsgKGZ1bmN0aW9uKCl7IFxuIGJ1Zi5wdXNoKCc8ZGl2IGlkPVwiYXV0aDAtd2lkZ2V0XCIgY2xhc3M9XCJjbGVhbnNsYXRlXCI+XFxuXHQ8ZGl2IGNsYXNzPVwic2lnbmluXCI+XFxuXHQgICAgPGRpdiBjbGFzcz1cInBvcHVwXCI+XFxuXHQgICAgICBcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCI+XFxuXHQgICAgICAgIFx0PGRpdiBpZD1cIm9uZXN0ZXBcIiBjbGFzcz1cInBhbmVsIG9uZXN0ZXBcIj5cXG5cdCAgICAgICAgICBcdFx0PGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxcblx0ICAgICAgICAgICAgXHRcdDxkaXYgY2xhc3M9XCJpbWFnZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPlxcblx0ICAgICAgICAgICAgXHRcdFx0PGltZyBzcmM9XCJcIj5cXG5cdCAgICAgICAgICAgIFx0XHQ8L2Rpdj5cXG5cdCAgICAgICAgICAgIFx0XHQ8aDE+U2lnbiBJbjwvaDE+XFxuXHRcdFx0ICAgICAgICAgICAgPGgyIGNsYXNzPVwiZXJyb3JcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj4mbmJzcDs8L2gyPlxcblx0XHRcdCAgICAgICAgICAgIDxoMiBjbGFzcz1cInN1Y2Nlc3NcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj4mbmJzcDs8L2gyPlxcblx0XHRcdCAgICAgICAgICAgIDxhIGNsYXNzPVwiY2xvc2VcIj5DbG9zZTwvYT5cXG5cdCAgICAgICAgICBcdFx0PC9oZWFkZXI+XFxuXFxuXHQgICAgICAgICAgXHRcdDxkaXYgY2xhc3M9XCJsb2dnZWRpblwiPlxcblx0XHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjZW50ZXJlZCBsYXN0LXRpbWVcIj48L3NwYW4+XFxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic3RyYXRlZ3lcIj48L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJlbWFpbC1yZWFkb25seVwiPjwvc3Bhbj5cXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgdHlwZT1cImVtYWlsXCIgdmFsdWU9XCJcIiBkaXNhYmxlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJcIiBhdXRvZm9jdXMgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHRpdGxlPVwiUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cXG5cdFx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gSW48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHRcdFx0ICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdFx0XHRcdFx0XHQgIFx0PGxhYmVsIGNsYXNzPVwiY3JlYXRlLWFjY291bnRcIj48YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImZvcmdvdC1wYXNzXCI+Rm9yZ290IHlvdXIgcGFzc3dvcmQ/PC9hPjwvbGFiZWw+XFxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNlbnRlcmVkIGFsbFwiPlNob3cgYWxsPC9zcGFuPlxcblx0XHRcdCAgICAgICAgICAgIDwvZm9ybT5cXG5cdCAgICAgICAgICBcdFx0PC9kaXY+XFxuXFxuXHRcdCAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJub3Rsb2dnZWRpblwiPlxcblx0XHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHRcdCAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImljb25saXN0XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PHAgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj4uLi4gb3Igc2lnbiBpbiB1c2luZzwvcD48L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cInNlcGFyYXRvclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjxzcGFuPm9yPC9zcGFuPjwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgaWQ9XCJzaWduaW5fZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiRW1haWxcIiB0aXRsZT1cIkVtYWlsXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cInBhc3N3b3JkXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwic2lnbmluX2Vhc3lfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCIgdGl0bGU9XCJQYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJ6b2NpYWwgcHJpbWFyeSBuZXh0XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIj5TaWduIEluPC9idXR0b24+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8bGFiZWwgY2xhc3M9XCJjcmVhdGUtYWNjb3VudFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwic2lnbi11cFwiPlNpZ24gVXA8L2E+PHNwYW4gY2xhc3M9XCJkaXZpZGVyXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj4mbmJzcDvigKImbmJzcDs8L3NwYW4+PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJmb3Jnb3QtcGFzc1wiPkZvcmdvdCB5b3VyIHBhc3N3b3JkPzwvYT48L2xhYmVsPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgIDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICA8L2Zvcm0+XFxuXHRcdCAgICAgICAgICBcdDwvZGl2Plxcblxcblx0XHQgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwic2lnbnVwXCI+XFxuXHRcdFx0ICAgICAgICAgICAgPGZvcm0+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj48L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIGlkPVwic2lnbnVwX2Vhc3lfZW1haWxcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiRW1haWxcIiB0aXRsZT1cIkVtYWlsXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cInBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiBpZD1cInNpZ251cF9lYXN5X3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkNyZWF0ZSBhIFBhc3N3b3JkXCIgdGl0bGU9XCJQYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJ6b2NpYWwgcHJpbWFyeSBuZXh0XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIj5TaWduIFVwPC9idXR0b24+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZm9vdGVyXCI+PC9kaXY+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJvcHRpb25zXCI+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICAgIFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJjZW50ZXJlZCBjYW5jZWxcIj5DYW5jZWw8L2E+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdFx0ICAgICAgICAgICAgICAgIDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICA8L2Zvcm0+XFxuXHRcdCAgICAgICAgICBcdDwvZGl2Plxcblxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzZXRcIj5cXG5cdFx0XHRcdFx0XHQ8Zm9ybSBpZD1cImNoYW5nZV9wYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgXHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICBcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiBpZD1cInJlc2V0X2Vhc3lfZW1haWxcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiRW1haWxcIiB0aXRsZT1cIkVtYWlsXCI+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cInBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiBpZD1cInJlc2V0X2Vhc3lfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiTmV3IFBhc3N3b3JkXCIgdGl0bGU9XCJOZXcgUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwicmVwZWF0UGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJyZXBlYXRfcGFzc3dvcmRcIiBpZD1cInJlc2V0X2Vhc3lfcmVwZWF0X3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkNvbmZpcm0gTmV3IFBhc3N3b3JkXCIgdGl0bGU9XCJDb25maXJtIE5ldyBQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJ6b2NpYWwgcHJpbWFyeSBuZXh0XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIj5TZW5kPC9idXR0b24+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwib3B0aW9uc1wiPlxcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiY2VudGVyZWQgY2FuY2VsXCI+Q2FuY2VsPC9hPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0PC9mb3JtPlxcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XFxuXHQgICAgICAgICAgXHRcdDxmb290ZXI+XFxuXHQgICAgICAgICAgICBcdFx0PHNwYW4+UG93ZXJlZCBieSA8YSBocmVmPVwiaHR0cDovL2F1dGgwLmNvbVwiIHRhcmdldD1cIl9uZXdcIj5BdXRoMDwvYT48L3NwYW4+XFxuXHQgICAgICAgICAgXHRcdDwvZm9vdGVyPlxcblx0ICAgICAgICBcdDwvZGl2Plxcblx0ICAgICAgXHQ8L2Rpdj5cXG5cdCAgICA8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2PlxcbicpOyB9KSgpO1xufSBcbnJldHVybiBidWYuam9pbignJyk7XG59OyByZXR1cm4gZnVuY3Rpb24obCkgeyByZXR1cm4gdChsKSB9fSgpKSIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9O3ZhciBBdXRoMCAgICAgPSByZXF1aXJlKCdhdXRoMC1qcycpO1xudmFyIHF3ZXJ5ICAgICA9IHJlcXVpcmUoJ3F3ZXJ5Jyk7XG52YXIgYm9uem8gICAgID0gcmVxdWlyZSgnYm9uem8nKTtcbnZhciBiZWFuICAgICAgPSByZXF1aXJlKCdiZWFuJyk7XG52YXIgeHRlbmQgICAgID0gcmVxdWlyZSgneHRlbmQnKTtcblxudmFyIG1haW5UbXBsID0gcmVxdWlyZSgnLi9odG1sL21haW4uaHRtbCcpO1xuXG52YXIgJCA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICByZXR1cm4gYm9uem8ocXdlcnkoJyNhdXRoMC13aWRnZXQgJyArIChzZWxlY3RvciB8fCAnJyksIHJvb3QpKTtcbn07XG5cbmZ1bmN0aW9uIEF1dGgwV2lkZ2V0IChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBdXRoMFdpZGdldCkpIHtcbiAgICByZXR1cm4gbmV3IEF1dGgwV2lkZ2V0KG9wdGlvbnMpO1xuICB9XG5cbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuX2F1dGgwID0gbmV3IEF1dGgwKHtcbiAgICBjbGllbnRJRDogICAgIHRoaXMuX29wdGlvbnMuY2xpZW50SUQsIFxuICAgIGNhbGxiYWNrVVJMOiAgdGhpcy5fb3B0aW9ucy5jYWxsYmFja1VSTCxcbiAgICBkb21haW46ICAgICAgIHRoaXMuX29wdGlvbnMuZG9tYWluXG4gIH0pO1xuICBcbiAgdGhpcy5fc3RyYXRlZ2llcyA9IHtcbiAgICAnZ29vZ2xlLW9wZW5pZCc6IHsgY3NzOiAnZ29vZ2xlJywgbmFtZTogJ0dvb2dsZSBPcGVuSWQnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnZ29vZ2xlLWFwcHMnOiB7IGNzczogJ2dvb2dsZScsIG5hbWU6ICdHb29nbGUgQXBwcycsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnZ29vZ2xlLW9hdXRoMic6IHsgY3NzOiAnZ29vZ2xlcGx1cycsIG5hbWU6ICdHb29nbGUnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnZmFjZWJvb2snOiB7IGNzczogJ2ZhY2Vib29rJywgbmFtZTogJ0ZhY2Vib29rJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ3dpbmRvd3NsaXZlJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ01pY3Jvc29mdCBBY2NvdW50Jywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2xpbmtlZGluJzogeyBjc3M6ICdsaW5rZWRpbicsIG5hbWU6ICdMaW5rZWRJbicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdnaXRodWInOiB7IGNzczogJ2dpdGh1YicsIG5hbWU6ICdHaXRIdWInLCBzb2NpYWw6IHRydWUgfSxcbiAgICAncGF5cGFsJzogeyBjc3M6ICdwYXlwYWwnLCBuYW1lOiAnUGF5UGFsJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ3R3aXR0ZXInOiB7IGNzczogJ3R3aXR0ZXInLCBuYW1lOiAnVHdpdHRlcicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdhbWF6b24nOiB7IGNzczogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBzb2NpYWw6IHRydWUgfSxcbiAgICAndmtvbnRha3RlJzogeyBjc3M6ICd2aycsIG5hbWU6ICd2S29udGFrdGUnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAneWFuZGV4JzogeyBjc3M6ICd5YW5kZXgnLCBuYW1lOiAnWWFuZGV4Jywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ29mZmljZTM2NSc6IHsgY3NzOiAnb2ZmaWNlMzY1JywgbmFtZTogJ09mZmljZTM2NScsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnd2FhZCc6IHsgY3NzOiAnd2FhZCcsIG5hbWU6ICdXaW5kb3dzIEF6dXJlIEFEJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhZGZzJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ0FERlMnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ3NhbWxwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdTQU1MJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdtc2NybSc6IHsgY3NzOiAnZ3Vlc3QnLCBuYW1lOiAnRHluYW1pY3MgQ1JNJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhZCc6IHsgY3NzOiAnd2luZG93cycsIG5hbWU6ICdBRCAvIExEQVAnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2N1c3RvbSc6IHsgY3NzOiAnZ3Vlc3QnLCBuYW1lOiAnQ3VzdG9tIEF1dGgnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2F1dGgwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdBdXRoMCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnYXV0aDAtYWRsZGFwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdBRC9MREFQJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICd0aGlydHlzZXZlbnNpZ25hbHMnOiB7IGNzczogJ3RoaXJ0eXNldmVuc2lnbmFscycsIG5hbWU6ICczNyBTaWduYWxzJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2JveCc6IHsgY3NzOiAnYm94JywgbmFtZTogJ0JveCcsIHNvY2lhbDogdHJ1ZSwgaW1hZ2VpY29uOiB0cnVlIH0sXG4gICAgJ3NhbGVzZm9yY2UnOiB7IGNzczogJ3NhbGVzZm9yY2UnLCBuYW1lOiAnU2FsZXNmb3JjZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdmaXRiaXQnOiB7IGNzczogJ2ZpdGJpdCcsIG5hbWU6ICdGaXRiaXQnLCBzb2NpYWw6IHRydWUgfVxuICB9O1xufVxuXG4vLyBoZWxwZXIgbWV0aG9kc1xuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgZ2xvYmFsLndpbmRvdy5sb2NhdGlvbiA9IHVybDtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2V0VG9wID0gZnVuY3Rpb24gKG9uVG9wLCBlbGVtZW50KSB7XG4gIGlmICghb25Ub3ApIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZWxlbWVudC5jc3Moe1xuICAgICAgICAnbWFyZ2luVG9wJzogJy0nICsgKGVsZW1lbnQub2Zmc2V0KCkuaGVpZ2h0IC8gMikgKyAncHgnLFxuICAgICAgICAndG9wJzogJzUwJSdcbiAgICAgIH0pO1xuICAgIH0sIDEpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICdtYXJnaW5Ub3AnOiAnMnB4JyxcbiAgICAgICd0b3AnOiAnMCdcbiAgICB9KTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgaWYgKCFlcnJvcikgcmV0dXJuO1xuICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLmVycm9yJykuaHRtbChlcnJvcikuY3NzKCdkaXNwbGF5JywgJycpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93U3VjY2VzcyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuZXJyb3InKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5zdWNjZXNzJykuaHRtbChtZXNzYWdlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzQXV0aDBDb25uID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7XG4gIHJldHVybiBzdHJhdGVneSA9PT0gJ2F1dGgwJyB8fCBzdHJhdGVneSA9PT0gJ2F1dGgwLWFkbGRhcCc7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NldFRpdGxlID0gZnVuY3Rpb24odGl0bGUpIHtcbiAgJCgnLnNpZ25pbiAuZXJyb3InKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5zdWNjZXNzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiBoMScpLmh0bWwodGl0bGUpLmNzcygnZGlzcGxheScsICcnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fcGFyc2VSZXNwb25zZU1lc3NhZ2UgPSBmdW5jdGlvbiAocmVzcG9uc2VPYmosIGRlZmF1bHRWYWx1ZSkge1xuICByZXR1cm4gdGhpcy5fc2lnbmluT3B0aW9uc1tyZXNwb25zZU9iai5jb2RlXSB8fCByZXNwb25zZU9iai5tZXNzYWdlIHx8IGRlZmF1bHRWYWx1ZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faXNBZExkYXBDb25uID0gZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbiAgcmV0dXJuIGNvbm5lY3Rpb24gPT09ICdhZGxkYXAnO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9hcmVUaGVyZUFueVNvY2lhbENvbm4gPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBpZiAodGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXSAmJiB0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdLnNvY2lhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubiA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0gJiYgXG4gICAgICAgICF0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdLnNvY2lhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0VudGVycHJpc2VDb25uZWN0aW9uID0gZnVuY3Rpb24gKGVtYWlsLCBvdXRwdXQpIHtcbiAgdmFyIGVtYWlsTSA9IC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvXG4gICAgICAgICAgICAgICAgICAgIC5leGVjKGVtYWlsLnRvTG93ZXJDYXNlKCkpO1xuXG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcbiAgICBpZiAodGhpcy5faXNBdXRoMENvbm4oc3RyYXRlZ3kubmFtZSkpIGNvbnRpbnVlO1xuXG4gICAgZm9yICh2YXIgYyBpbiBzdHJhdGVneS5jb25uZWN0aW9ucykge1xuICAgICAgaWYgKGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbikge1xuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgfHzCoHt9O1xuICAgICAgICBvdXRwdXQuZG9tYWluID0gc3RyYXRlZ3kuY29ubmVjdGlvbnNbY10uZG9tYWluO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzRW50ZXJwcmlzZVN0cmF0ZWd5ID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7IFxuICBmb3IgKHZhciBzIGluIHRoaXMuX3N0cmF0ZWdpZXMpIHtcbiAgICBpZiAocyA9PT0gc3RyYXRlZ3kgJiYgIXRoaXMuX3N0cmF0ZWdpZXNbc10uc29jaWFsKSB7IFxuICAgICAgcmV0dXJuIHRydWU7IFxuICAgIH0gXG4gIH0gXG5cbiAgcmV0dXJuIGZhbHNlOyBcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fZ2V0Q29uZmlndXJlZFN0cmF0ZWd5ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgIGlmICh0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXSAmJiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG4gICAgfVxuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldEF1dGgwQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBpZiBzcGVjaWZpZWQsIHVzZSBpdCwgb3RoZXJ3aXNlIHJldHVybiBmaXJzdFxuICBpZiAodGhpcy5fc2lnbmluT3B0aW9uc1sndXNlclB3ZENvbm5lY3Rpb25OYW1lJ10pIHtcbiAgICBmb3IgKHZhciBpIGluIHRoaXMuX2F1dGgwU3RyYXRlZ3kuY29ubmVjdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLl9hdXRoMFN0cmF0ZWd5LmNvbm5lY3Rpb25zW2ldLm5hbWUgPT09IHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3VzZXJQd2RDb25uZWN0aW9uTmFtZSddKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRoMFN0cmF0ZWd5LmNvbm5lY3Rpb25zW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLl9hdXRoMFN0cmF0ZWd5ID8gdGhpcy5fYXV0aDBTdHJhdGVneS5jb25uZWN0aW9uc1swXSA6IG51bGw7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dPckhpZGVQYXNzd29yZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1haWxGaWVsZCA9ICQoJy5ub3Rsb2dnZWRpbiAuZW1haWwgaW5wdXQnKTtcbiAgdmFyIHB3ZEZpZWxkICA9ICQoJy5ub3Rsb2dnZWRpbiAucGFzc3dvcmQgaW5wdXQnKS5maXJzdCgpO1xuICBcbiAgdmFyIGlzRW50ZXJwcmlzZUNvbm5lY3Rpb24gPSB0aGlzLl9pc0VudGVycHJpc2VDb25uZWN0aW9uKG1haWxGaWVsZC52YWwoKSk7XG5cbiAgaWYgKGlzRW50ZXJwcmlzZUNvbm5lY3Rpb24pIHtcbiAgICBwd2RGaWVsZC5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIHB3ZEZpZWxkLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xuICAgIHB3ZEZpZWxkLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XG4gIH0gZWxzZSB7XG4gICAgcHdkRmllbGQucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICBwd2RGaWVsZC5hdHRyKCdyZXF1aXJlZCcsIHRydWUpO1xuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2hpZGVTaWduSW4gPSBmdW5jdGlvbiAoY2IpIHtcbiAgJCgnZGl2Lm92ZXJsYXknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgJCgpLnJlbW92ZUNsYXNzKCdtb2RlLXNpZ25pbicpO1xuICAgICQoKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIGlmIChjYikgY2IoKTtcbiAgfSwgNTAwKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fZ2V0QWN0aXZlTG9naW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb250YWluZXIgPSB0aGlzLl9oYXNMb2dnZWRJbkJlZm9yZSA/ICQoJy5sb2dnZWRpbicpIDogJCgnLm5vdGxvZ2dlZGluJyk7XG4gIHJldHVybiBjb250YWluZXI7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3RvZ2dsZVNwaW5uZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XG4gIGNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCB0aGlzLl9nZXRBY3RpdmVMb2dpblZpZXcoKTtcbiAgdmFyIHNwaW5uZXIgPSAkKCcuc3Bpbm5lcicsIGNvbnRhaW5lcik7XG4gIHZhciBzaWduaW4gPSAkKCcuem9jaWFsLnByaW1hcnknLCBjb250YWluZXIpO1xuXG4gIHNwaW5uZXIuY3NzKCdkaXNwbGF5Jywgc3Bpbm5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnID8gJycgOiAnbm9uZScpO1xuICBzaWduaW4uY3NzKCdkaXNwbGF5Jywgc2lnbmluLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgPyAnJyA6ICdub25lJyk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Nob3dTaWduVXBFeHBlcmllbmNlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NldExvZ2luVmlldyh7IG1vZGU6ICdzaWdudXAnIH0pO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93UmVzZXRFeHBlcmllbmNlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NldExvZ2luVmlldyh7IG1vZGU6ICdyZXNldCcgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NldExvZ2luVmlldyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHzCoHt9O1xuXG4gICQoJy5sb2dnZWRpbicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5ub3Rsb2dnZWRpbicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWdudXAnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcucmVzZXQnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIGlucHV0W3R5cGU9cGFzc3dvcmRdJykudmFsKCcnKTtcblxuICBpZiAoIW9wdGlvbnMubW9kZSkge1xuICAgIHRoaXMuX2hhc0xvZ2dlZEluQmVmb3JlID0gISFvcHRpb25zLmlzUmV0dXJuaW5nVXNlcjtcbiAgICB0aGlzLl9zZXRUaXRsZSh0aGlzLl9zaWduaW5PcHRpb25zWyd0aXRsZSddKTtcblxuICAgICQoJy5sb2dnZWRpbicpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyID8gJycgOiAnbm9uZScpO1xuICAgICQoJy5ub3Rsb2dnZWRpbicpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyID8gJ25vbmUnIDogJycpO1xuXG4gICAgdGhpcy5fc2V0VG9wKHRoaXMuX3NpZ25pbk9wdGlvbnMudG9wLCAkKCcuc2lnbmluIGRpdi5wYW5lbC5vbmVzdGVwJykpO1xuXG4gICAgdHJ5IHsgXG4gICAgICBpZiAob3B0aW9ucy5pc1JldHVybmluZ1VzZXIpICQoJy5sb2dnZWRpbiAucGFzc3dvcmQgaW5wdXQnKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgICBlbHNlICQoJy5ub3Rsb2dnZWRpbiAuZW1haWwgaW5wdXQnKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgfSBjYXRjaChlKSB7fVxuICAgIFxuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjb250YWluZXI7XG5cbiAgc3dpdGNoIChvcHRpb25zLm1vZGUpIHtcbiAgICBjYXNlICdzaWdudXAnOlxuICAgICAgdGhpcy5fc2V0VGl0bGUodGhpcy5fc2lnbmluT3B0aW9uc1snc2lnbnVwVGl0bGUnXSk7XG4gICAgICBjb250YWluZXIgPSAkKCcuc2lnbnVwJykuZmlyc3QoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3Jlc2V0JzpcbiAgICAgIHRoaXMuX3NldFRpdGxlKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3Jlc2V0VGl0bGUnXSk7XG4gICAgICBjb250YWluZXIgPSAkKCcucmVzZXQnKS5maXJzdCgpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBpZiAoY29udGFpbmVyKSB7XG4gICAgdGhpcy5fc2V0VG9wKHRoaXMuX3NpZ25pbk9wdGlvbnMudG9wLCAkKCcuc2lnbmluIGRpdi5wYW5lbC5vbmVzdGVwJykpO1xuICAgIGNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknLCAnJyk7XG5cbiAgICB0cnkgeyBcbiAgICAgIHZhciBlbWFpbCA9ICQoJy5ub3Rsb2dnZWRpbiAuZW1haWwgaW5wdXQnKS52YWwoKTtcbiAgICAgICQoJy5lbWFpbCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKGVtYWlsKTtcbiAgICAgICQoJy5lbWFpbCBpbnB1dCcsIGNvbnRhaW5lcikuZmlyc3QoKS5mb2N1cygpO1xuICAgIH0gY2F0Y2goZSkge31cbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93TG9nZ2VkSW5FeHBlcmllbmNlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fc3NvRGF0YS5sYXN0VXNlZENvbm5lY3Rpb24uc3RyYXRlZ3k7XG4gIHRoaXMuX3NldExvZ2luVmlldyh7IGlzUmV0dXJuaW5nVXNlcjogISFzdHJhdGVneSB9KTtcblxuICBpZiAoIXN0cmF0ZWd5KSByZXR1cm47XG5cbiAgdmFyIGxvZ2luVmlldyA9IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICBiZWFuLm9uKCQoJ2Zvcm0nLCBsb2dpblZpZXcpWzBdLCAnc3VibWl0JywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2lnbkluRW50ZXJwcmlzZShlKTsgfSk7XG4gIFxuICB2YXIgYnV0dG9uO1xuICBpZiAoc3RyYXRlZ3kgIT09ICdhdXRoMCcpIHtcbiAgICBidXR0b24gPSBib256byhib256by5jcmVhdGUoJzxzcGFuPjwvc3Bhbj4nKSlcbiAgICAgIC5hdHRyKCd0YWJpbmRleCcsIDApXG4gICAgICAuYXR0cignZGF0YS1zdHJhdGVneScsIHN0cmF0ZWd5KVxuICAgICAgLmF0dHIoJ3RpdGxlJywgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSlcbiAgICAgIC5hZGRDbGFzcygnem9jaWFsJykuYWRkQ2xhc3MoJ2Jsb2NrJylcbiAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5jc3MpXG4gICAgICAuYWRkQ2xhc3ModGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0uaW1hZ2VpY29uID8gJ2ltYWdlLWljb24nIDogJycpXG4gICAgICAuaHRtbCh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKTtcbiAgICBcbiAgICBiZWFuLm9uKGJ1dHRvblswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2lnbkluU29jaWFsKGUudGFyZ2V0KTsgfSk7XG5cbiAgICAkKCcuc3RyYXRlZ3kgc3BhbicsIGxvZ2luVmlldykuZWFjaChmdW5jdGlvbiAoZWwpIHsgaWYgKGVsKSBlbC5yZW1vdmUoKTsgfSk7XG4gICAgJCgnLnN0cmF0ZWd5JywgbG9naW5WaWV3KS5hcHBlbmQoYnV0dG9uKTtcbiAgfVxuXG4gICQoJy5hbGwnLCBsb2dpblZpZXcpLmh0bWwodGhpcy5fc2lnbmluT3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSk7XG5cbiAgYmVhbi5vbigkKCcuYWxsJywgbG9naW5WaWV3KVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3NldExvZ2luVmlldygpO1xuICB9KTtcblxuICBpZiAodGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKSB7XG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnYXV0aDAnKSB7XG4gICAgICAkKCcuZW1haWwtcmVhZG9ubHknLCBsb2dpblZpZXcpLmh0bWwodGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKTsgXG4gICAgICAkKCcuZW1haWwgaW5wdXQnLCBsb2dpblZpZXcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAkKCcuZW1haWxQYXNzd29yZCcsIGxvZ2luVmlldykuY3NzKCdkaXNwbGF5JywgJycpO1xuICAgIH0gXG4gICAgZWxzZSBpZiAodGhpcy5faXNFbnRlcnByaXNlU3RyYXRlZ3koc3RyYXRlZ3kpKSB7XG4gICAgICBidXR0b24uaHRtbCh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUgfHwgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSlcbiAgICAgICAgICAgIC5hdHRyKCd0aXRsZScsIHRoaXMuX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSB8fCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIHNpZ24gaW4gbWV0aG9kc1xuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaWduSW5Tb2NpYWwgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHZhciBzdHJhdGVneU5hbWUgPSB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IHRhcmdldCA6IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RyYXRlZ3knKTtcbiAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fZ2V0Q29uZmlndXJlZFN0cmF0ZWd5KHN0cmF0ZWd5TmFtZSk7XG5cbiAgaWYgKHN0cmF0ZWd5KSB7XG4gICAgdGhpcy5fYXV0aDAubG9naW4oe1xuICAgICAgY29ubmVjdGlvbjogc3RyYXRlZ3kuY29ubmVjdGlvbnNbMF0ubmFtZVxuICAgIH0pO1xuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NpZ25JbkVudGVycHJpc2UgPSBmdW5jdGlvbiAoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICB2YXIgZm9ybSA9ICQoJ2Zvcm0nLCBjb250YWluZXIpO1xuICB2YXIgdmFsaWQgPSB0cnVlO1xuXG4gIHZhciBlbWFpbEQgPSAkKCcuZW1haWwnLCBmb3JtKSxcbiAgICAgIGVtYWlsRSA9ICQoJ2lucHV0W25hbWU9ZW1haWxdJywgZm9ybSksXG4gICAgICBlbWFpbE0gPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLy5leGVjKGVtYWlsRS52YWwoKS50b0xvd2VyQ2FzZSgpKSxcbiAgICAgIGVtYWlsUCA9IC9eXFxzKiQvLnRlc3QoZW1haWxFLnZhbCgpKSxcbiAgICAgIGRvbWFpbiwgY29ubmVjdGlvbiwgZW1haWwgPSBudWxsLCBzdHJhdGVneTtcblxuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcblxuICAgIGlmICh0aGlzLl9pc0F1dGgwQ29ubihzdHJhdGVneS5uYW1lKSkgY29udGludWU7XG5cbiAgICBmb3IgKHZhciBjIGluIHN0cmF0ZWd5LmNvbm5lY3Rpb25zKSB7XG4gICAgICBpZighZW1haWxQICYmIGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbikge1xuICAgICAgICBkb21haW4gPSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5kb21haW47XG4gICAgICAgIGNvbm5lY3Rpb24gPSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5uYW1lO1xuICAgICAgICBlbWFpbCA9IGVtYWlsRS52YWwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRvbWFpbikgYnJlYWs7XG4gIH1cblxuICBpZiAoZW1haWxQKSB7XG4gICAgdGhpcy5fc2hvd0Vycm9yKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddKTtcbiAgfSBcbiAgZWxzZSBpZiAoIWVtYWlsTSkge1xuICAgIHRoaXMuX3Nob3dFcnJvcih0aGlzLl9zaWduaW5PcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddKTtcbiAgfSBcbiAgZWxzZSBpZiAoIWRvbWFpbikge1xuICAgIGlmICh0aGlzLl9hdXRoMFN0cmF0ZWd5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2lnbkluV2l0aEF1dGgwKGVtYWlsRS52YWwoKSk7XG4gICAgfVxuXG4gICAgaWYgKGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09PSAnZ21haWwuY29tJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25JblNvY2lhbCgnZ29vZ2xlLW9hdXRoMicpO1xuICAgIH1cblxuICAgIHRoaXMuX3Nob3dFcnJvcihcbiAgICAgIHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddXG4gICAgICAgICAgLnJlcGxhY2UoJ3tkb21haW59JywgZW1haWxNID8gZW1haWxNLnNsaWNlKC0yKVswXSA6ICcnKSk7XG4gIH1cblxuICB2YWxpZCAmPSAoIWRvbWFpbiAmJiAhZW1haWxELmFkZENsYXNzKCdpbnZhbGlkJykpIHx8ICghIWRvbWFpbiAmJiAhIWVtYWlsRC5yZW1vdmVDbGFzcygnaW52YWxpZCcpKTtcblxuICBpZiAodmFsaWQpIHtcbiAgICB0aGlzLl9hdXRoMC5sb2dpbih7XG4gICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gICAgfSk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluV2l0aEF1dGgwID0gZnVuY3Rpb24gKHVzZXJOYW1lLCBzaWduSW5QYXNzd29yZCkge1xuICB0aGlzLl90b2dnbGVTcGlubmVyKCk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udGFpbmVyID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIHZhciBjb25uZWN0aW9uICA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuICBcbiAgdmFyIGxvZ2luT3B0aW9ucyA9IHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgdXNlcm5hbWU6IHRoaXMuX2lzQWRMZGFwQ29ubihjb25uZWN0aW9uLm5hbWUpID8gdXNlck5hbWUucmVwbGFjZSgnQCcgKyBjb25uZWN0aW9uLmRvbWFpbiwgJycpIDogdXNlck5hbWUsXG4gICAgcGFzc3dvcmQ6IHNpZ25JblBhc3N3b3JkIHx8wqAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpXG4gIH07XG5cbiAgZm9yICh2YXIgayBpbiB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMpIHtcbiAgICBsb2dpbk9wdGlvbnNba10gPSB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXNba107XG4gIH1cblxuICB0aGlzLl9hdXRoMC5sb2dpbihsb2dpbk9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSkpO1xuICAgIH1cblxuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoKTtcbiAgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NpZ25VcFdpdGhBdXRoMCA9IGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNpZ251cCcpO1xuICB2YXIgZW1haWwgPSAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgcGFzc3dvcmQgPSAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgY29ubmVjdGlvbiAgPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcblxuICB0aGlzLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG5cbiAgdGhpcy5fYXV0aDAuc2lnbnVwKHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgdXNlcm5hbWU6ICAgZW1haWwsXG4gICAgcGFzc3dvcmQ6ICAgcGFzc3dvcmRcbiAgfSwgXG4gIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWydzaWdudXBTZXJ2ZXJFcnJvclRleHQnXSkpO1xuICAgICAgc2VsZi5fdG9nZ2xlU3Bpbm5lcihjb250YWluZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmLl9zaWduSW5XaXRoQXV0aDAoZW1haWwsIHBhc3N3b3JkKTtcbiAgfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3Jlc2V0UGFzc3dvcmRXaXRoQXV0aDAgPSBmdW5jdGlvbiAoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udGFpbmVyID0gJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5yZXNldCcpO1xuICB2YXIgZW1haWwgPSAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgcGFzc3dvcmQgPSAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpO1xuICB2YXIgY29ubmVjdGlvbiAgPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcblxuICB0aGlzLl90b2dnbGVTcGlubmVyKGNvbnRhaW5lcik7XG5cbiAgdGhpcy5fYXV0aDAuY2hhbmdlUGFzc3dvcmQoe1xuICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24ubmFtZSxcbiAgICB1c2VybmFtZTogICBlbWFpbCxcbiAgICBwYXNzd29yZDogICBwYXNzd29yZFxuICB9LCBcbiAgZnVuY3Rpb24gKGVycikge1xuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoY29udGFpbmVyKTtcblxuICAgICQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKCcnKTtcbiAgICAkKCcucmVwZWF0UGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgnJyk7XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWydyZXNldFNlcnZlckVycm9yVGV4dCddKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJCgnLmVtYWlsIGlucHV0JywgY29udGFpbmVyKS52YWwoJycpO1xuXG4gICAgdHJ5IHsgXG4gICAgICAkKCcuZW1haWwgaW5wdXQnLCBjb250YWluZXIpLmZpcnN0KCkuZm9jdXMoKTsgXG4gICAgfSBjYXRjaChlKSB7fSAgXG5cbiAgICBzZWxmLl9zZXRMb2dpblZpZXcoKTtcbiAgICBzZWxmLl9zaG93U3VjY2VzcyhzZWxmLl9zaWduaW5PcHRpb25zWydyZXNldFN1Y2Nlc3NUZXh0J10pO1xuICB9KTtcbn07XG5cbi8vIGluaXRpYWxpemVcbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVE9ETzogc3VwcG9ydCBjc3Mgb3B0aW9uIGZvciBub24gZnJlZSBzdWJzY3JpcHRpb25zXG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBiZWFuLm9uKCQoJy5wb3B1cCAucGFuZWwub25lc3RlcCBhLmNsb3NlJylbMF0sICdjbGljaycsIGZ1bmN0aW9uICgpIHsgc2VsZi5faGlkZVNpZ25JbigpOyB9KTtcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLm5vdGxvZ2dlZGluIGZvcm0nKVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25JbkVudGVycHJpc2UoZSk7IH0pO1xuICBiZWFuLm9uKCQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuc2lnbnVwIGZvcm0nKVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25VcFdpdGhBdXRoMChlKTsgfSk7XG4gIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5yZXNldCBmb3JtJylbMF0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZSkgeyBzZWxmLl9yZXNldFBhc3N3b3JkV2l0aEF1dGgwKGUpOyB9KTtcbiAgYmVhbi5vbihxd2VyeSgnaHRtbCcpWzBdLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmICgkKCkuaGFzQ2xhc3MoJ21vZGUtc2lnbmluJykpIHtcbiAgICAgIGlmICgoZS53aGljaCA9PSAyNyB8fCBlLmtleWNvZGUgPT0gMjcpICYmICFzZWxmLl9zaWduaW5PcHRpb25zLnN0YW5kYWxvbmUpIHtcbiAgICAgICAgc2VsZi5faGlkZVNpZ25JbigpOyAvLyBjbG9zZSBwb3B1cCB3aXRoIEVTQyBrZXlcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIGxvYWQgc29jaWFsIGJ1dHRvbnNcbiAgdmFyIGxpc3QgPSAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0Jyk7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICB2YXIgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcblxuICAgIGlmICh0aGlzLl9pc0F1dGgwQ29ubihzdHJhdGVneS5uYW1lKSAmJiBzdHJhdGVneS5jb25uZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdXRoMFN0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAkKCcuY3JlYXRlLWFjY291bnQsIC5wYXNzd29yZCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICBiZWFuLm9uKCQoJy5ub3Rsb2dnZWRpbiAuZW1haWwgaW5wdXQnKVswXSwgJ2lucHV0JywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2hvd09ySGlkZVBhc3N3b3JkKGUpOyB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXSAmJiB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLnNvY2lhbCkge1xuICAgICAgdmFyIGJ1dHRvbiA9IGJvbnpvKGJvbnpvLmNyZWF0ZSgnPHNwYW4+PC9zcGFuPicpKVxuICAgICAgICAuYXR0cigndGFiaW5kZXgnLCAwKVxuICAgICAgICAuYXR0cignZGF0YS1zdHJhdGVneScsIHN0cmF0ZWd5Lm5hbWUpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsIHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0ubmFtZSlcbiAgICAgICAgLmFkZENsYXNzKCd6b2NpYWwnKS5hZGRDbGFzcygnaWNvbicpXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLmNzcylcbiAgICAgICAgLmFkZENsYXNzKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0uaW1hZ2VpY29uID8gJ2ltYWdlLWljb24nIDogJycpXG4gICAgICAgIC5odG1sKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0ubmFtZSk7XG5cbiAgICAgIGxpc3QuYXBwZW5kKGJ1dHRvbik7XG4gICAgICBsaXN0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNlcGFyYXRvcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH1cbiAgfVxuXG4gICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgIGJlYW4ub24oYnV0dG9uLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5fc2lnbkluU29jaWFsKGUudGFyZ2V0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGhpcy5fc2hvd1NpZ25JbigpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93U2lnbkluID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gICQoKS5hZGRDbGFzcygnbW9kZS1zaWduaW4nKTtcblxuICAvLyBpZiBubyBzb2NpYWwgY29ubmVjdGlvbnMgYW5kIG9uZSBlbnRlcnByaXNlIGNvbm5lY3Rpb24gb25seSwgcmVkaXJlY3RcbiAgaWYgKCF0aGlzLl9hcmVUaGVyZUFueVNvY2lhbENvbm4oKSAmJiBcbiAgICB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcy5sZW5ndGggPT09IDEgJiZcbiAgICB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1swXS5uYW1lICE9PSAnYXV0aDAnICYmXG4gICAgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbMF0uY29ubmVjdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgXG4gICAgdGhpcy5fYXV0aDAubG9naW4oe1xuICAgICAgY29ubmVjdGlvbjogdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbMF0uY29ubmVjdGlvbnNbMF0ubmFtZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gbGFiZWxzIHRleHRcbiAgdmFyIG9wdGlvbnMgPSB4dGVuZCh0aGlzLl9zaWduaW5PcHRpb25zLCB0aGlzLl9zaWduaW5PcHRpb25zLnJlc291cmNlcyk7XG4gIG9wdGlvbnNbJ29uZXN0ZXAnXSA9IHR5cGVvZiBvcHRpb25zWydvbmVzdGVwJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snb25lc3RlcCddIDogZmFsc2U7XG4gIG9wdGlvbnNbJ3RvcCddID0gb3B0aW9uc1sndG9wJ10gfHwgZmFsc2U7XG4gIG9wdGlvbnNbJ3RpdGxlJ10gPSBvcHRpb25zWyd0aXRsZSddIHx8ICdTaWduIEluJztcbiAgb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSA9IG9wdGlvbnNbJ2FsbEJ1dHRvblRlbXBsYXRlJ10gfHwgXCJTaG93IGFsbFwiO1xuICBvcHRpb25zWydzdHJhdGVneUVtYWlsRW1wdHknXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddIHx8IFwiVGhlIGVtYWlsIGlzIGVtcHR5LlwiO1xuICBvcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddID0gb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEludmFsaWQnXSB8fCBcIlRoZSBlbWFpbCBpcyBpbnZhbGlkLlwiO1xuICBvcHRpb25zWydzdHJhdGVneURvbWFpbkludmFsaWQnXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddIHx8IFwiVGhlIGRvbWFpbiB7ZG9tYWlufSBoYXMgbm90IGJlZW4gc2V0dXAuXCI7XG5cbiAgb3B0aW9uc1snaWNvbiddID0gb3B0aW9uc1snaWNvbiddIHx8IFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvaW1nL2xvZ28tMzIucG5nXCI7XG4gIG9wdGlvbnNbJ3Nob3dJY29uJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0ljb24nXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93SWNvbiddIDogZmFsc2U7XG4gIG9wdGlvbnNbJ3Nob3dTaWdudXAnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93U2lnbnVwJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd1NpZ251cCddIDogdHJ1ZTtcbiAgb3B0aW9uc1snc2hvd0ZvcmdvdCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dGb3Jnb3QnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93Rm9yZ290J10gOiB0cnVlO1xuICBvcHRpb25zWydzaWdudXBUZXh0J10gPSBvcHRpb25zWydzaWdudXBUZXh0J10gfHwgJ1NpZ24gVXAnO1xuICBvcHRpb25zWydmb3Jnb3RUZXh0J10gPSBvcHRpb25zWydmb3Jnb3RUZXh0J10gfHwgJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkPyc7XG4gIG9wdGlvbnNbJ3NpZ25JbkJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3NpZ25JbkJ1dHRvblRleHQnXSB8fCAnU2lnbiBJbic7XG4gIG9wdGlvbnNbJ2VtYWlsUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ2VtYWlsUGxhY2Vob2xkZXInXSB8fCAnRW1haWwnO1xuICBvcHRpb25zWydwYXNzd29yZFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydwYXNzd29yZFBsYWNlaG9sZGVyJ10gfHwgJ1Bhc3N3b3JkJztcbiAgb3B0aW9uc1snc2VwYXJhdG9yVGV4dCddID0gb3B0aW9uc1snc2VwYXJhdG9yVGV4dCddIHx8ICdvcic7XG4gIG9wdGlvbnNbJ3NlcnZlckVycm9yVGV4dCddID0gb3B0aW9uc1snc2VydmVyRXJyb3JUZXh0J10gfHwgJ1RoZXJlIHdhcyBhbiBlcnJvciBwcm9jZXNzaW5nIHRoZSBzaWduIGluLic7XG4gIG9wdGlvbnNbJ3Nob3dFbWFpbCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dFbWFpbCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dFbWFpbCddIDogdHJ1ZTtcbiAgb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gOiB0cnVlO1xuICBvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10gPSB0eXBlb2Ygb3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3NvY2lhbEJpZ0J1dHRvbnMnXSA6ICF0aGlzLl9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubigpO1xuICBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddID0gdHlwZW9mIG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3JldHVyblVzZXJMYWJlbCddID0gb3B0aW9uc1sncmV0dXJuVXNlckxhYmVsJ10gfHwgJ0xhc3QgdGltZSB5b3Ugc2lnbmVkIGluIHVzaW5nLi4uJztcbiAgb3B0aW9uc1snd3JvbmdFbWFpbFBhc3N3b3JkRXJyb3JUZXh0J10gPSBvcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSB8fCAnV3JvbmcgZW1haWwgb3IgcGFzc3dvcmQuJztcblxuICAvLyBzaWdudXBcbiAgb3B0aW9uc1snc2lnbnVwVGl0bGUnXSA9IG9wdGlvbnNbJ3NpZ251cFRpdGxlJ10gfHwgJ1NpZ24gVXAnO1xuICBvcHRpb25zWydzaWdudXBCdXR0b25UZXh0J10gPSBvcHRpb25zWydzaWdudXBCdXR0b25UZXh0J10gfHwgJ1NpZ24gVXAnO1xuICBvcHRpb25zWydzaWdudXBFbWFpbFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydzaWdudXBFbWFpbFBsYWNlaG9sZGVyJ10gfHwgJ0VtYWlsJztcbiAgb3B0aW9uc1snc2lnbnVwUGFzc3dvcmRQbGFjZWhvbGRlciddID0gb3B0aW9uc1snc2lnbnVwUGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdDcmVhdGUgYSBQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSB8fCAnQ2FuY2VsJztcbiAgb3B0aW9uc1snc2lnbnVwSGVhZGVyVGV4dCddID0gdHlwZW9mIG9wdGlvbnNbJ3NpZ251cEhlYWRlclRleHQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaWdudXBIZWFkZXJUZXh0J10gOiAnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkJztcbiAgb3B0aW9uc1snc2lnbnVwRm9vdGVyVGV4dCddID0gdHlwZW9mIG9wdGlvbnNbJ3NpZ251cEZvb3RlclRleHQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaWdudXBGb290ZXJUZXh0J10gOiAnQnkgY2xpY2tpbmcgXCJTaWduIFVwXCIsIHlvdSBhZ3JlZSB0byBvdXIgdGVybXMgb2Ygc2VydmljZSBhbmQgcHJpdmFjeSBwb2xpY3kuJztcbiAgb3B0aW9uc1snc2lnbnVwRW50ZXJwcmlzZUVtYWlsV2FybmluZ1RleHQnXSA9IG9wdGlvbnNbJ3NpZ251cEVudGVycHJpc2VFbWFpbFdhcm5pbmdUZXh0J10gfHwgJ1RoaXMgZG9tYWluIHtkb21haW59IGhhcyBiZWVuIGNvbmZpZ3VyZWQgZm9yIFNpbmdsZSBTaWduIE9uIGFuZCB5b3UgY2FuXFwndCBjcmVhdGUgYW4gYWNjb3VudC4gVHJ5IHNpZ25pbmcgaW4gaW5zdGVhZC4nO1xuICBvcHRpb25zWydzaWdudXBTZXJ2ZXJFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cFNlcnZlckVycm9yVGV4dCddIHx8ICdUaGVyZSB3YXMgYW4gZXJyb3IgcHJvY2Vzc2luZyB0aGUgc2lnbiB1cC4nO1xuXG4gIC8vIHJlc2V0XG4gIG9wdGlvbnNbJ3Jlc2V0VGl0bGUnXSA9IG9wdGlvbnNbJ3Jlc2V0VGl0bGUnXSB8fCAnUmVzZXQgUGFzc3dvcmQnO1xuICBvcHRpb25zWydyZXNldEJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0QnV0dG9uVGV4dCddIHx8ICdTZW5kJztcbiAgb3B0aW9uc1sncmVzZXRFbWFpbFBsYWNlaG9sZGVyJ10gPSBvcHRpb25zWydyZXNldEVtYWlsUGxhY2Vob2xkZXInXSB8fCAnRW1haWwnO1xuICBvcHRpb25zWydyZXNldFBhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Jlc2V0UGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdOZXcgUGFzc3dvcmQnO1xuICBvcHRpb25zWydyZXNldFJlcGVhdFBhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Jlc2V0UmVwZWF0UGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdDb25maXJtIE5ldyBQYXNzd29yZCc7XG4gIG9wdGlvbnNbJ3Jlc2V0Q2FuY2VsQnV0dG9uVGV4dCddID0gb3B0aW9uc1sncmVzZXRDYW5jZWxCdXR0b25UZXh0J10gfHwgJ0NhbmNlbCc7XG4gIG9wdGlvbnNbJ3Jlc2V0U3VjY2Vzc1RleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0U3VjY2Vzc1RleHQnXSB8fCAnV2VcXCd2ZSBqdXN0IHNlbnQgeW91IGFuIGVtYWlsIHRvIHJlc2V0IHlvdXIgcGFzc3dvcmQuJztcbiAgb3B0aW9uc1sncmVzZXRFbnRlclNhbWVQYXNzd29yZFRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0RW50ZXJTYW1lUGFzc3dvcmRUZXh0J10gfHwgJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSBwYXNzd29yZC4nO1xuICBvcHRpb25zWydyZXNldEhlYWRlclRleHQnXSA9IHR5cGVvZiBvcHRpb25zWydyZXNldEhlYWRlclRleHQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydyZXNldEhlYWRlclRleHQnXSA6ICdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhbmQgdGhlIG5ldyBwYXNzd29yZC4gV2Ugd2lsbCBzZW5kIHlvdSBhbiBlbWFpbCB0byBjb25maXJtIHRoZSBwYXNzd29yZCBjaGFuZ2UuJztcbiAgb3B0aW9uc1sncmVzZXRTZXJ2ZXJFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3Jlc2V0U2VydmVyRXJyb3JUZXh0J10gfHwgJ1RoZXJlIHdhcyBhbiBlcnJvciBwcm9jZXNzaW5nIHRoZSByZXNldCBwYXNzd29yZC4nO1xuXG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMgPSBvcHRpb25zO1xuXG4gIC8vIHRoZW1lXG4gIGlmIChvcHRpb25zLnRoZW1lKSB7XG4gICAgJCgpLmFkZENsYXNzKCd0aGVtZS0nICsgb3B0aW9ucy50aGVtZSk7XG4gIH1cblxuICAkKCcucGFuZWwgYS5jbG9zZScpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc3RhbmRhbG9uZSA/ICdub25lJyA6ICdibG9jaycpO1xuXG4gIC8vIHNob3cgaWNvblxuICBpZiAob3B0aW9ucy5zaG93SWNvbikge1xuICAgICQoJy5wYW5lbCAuaW1hZ2UgaW1nJykuYXR0cignc3JjJywgb3B0aW9ucy5pY29uKTtcbiAgICAkKCcucGFuZWwgLmltYWdlJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93SWNvbiA/ICdibG9jaycgOiAnbm9uZScpO1xuICB9XG5cbiAgLy8gc2hvdyBzaWdudXAvZm9yZ290IGxpbmtzXG4gIHZhciBhdXRoMENvbm4gPSB0aGlzLl9nZXRBdXRoMENvbm5lY3Rpb24oKTtcbiAgaWYgKGF1dGgwQ29ubikge1xuICAgIG9wdGlvbnMuc2hvd1NpZ251cCA9IGF1dGgwQ29ubi5zaG93U2lnbnVwO1xuICAgIG9wdGlvbnMuc2hvd0ZvcmdvdCA9IGF1dGgwQ29ubi5zaG93Rm9yZ290O1xuICB9XG4gIFxuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5zaWduLXVwJylcbiAgICAuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93U2lnbnVwID8gJycgOiAnbm9uZScpXG4gICAgLmh0bWwob3B0aW9ucy5zaWdudXBUZXh0KTtcblxuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpXG4gICAgLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0ZvcmdvdCA/ICcnIDogJ25vbmUnKVxuICAgIC5odG1sKG9wdGlvbnMuZm9yZ290VGV4dCk7XG5cbiAgaWYgKG9wdGlvbnMuc2lnbnVwTGluaykge1xuICAgICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLnNpZ24tdXAnKVxuICAgICAgLmF0dHIoJ2hyZWYnLCBvcHRpb25zLnNpZ251cExpbmspXG4gICAgICAuYXR0cigndGFyZ2V0JywgJ19wYXJlbnQnKTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgYmVhbi5vbigkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5zaWduLXVwJylbMF0sICdjbGljaycsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3Nob3dTaWduVXBFeHBlcmllbmNlKGUpOyB9KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmZvcmdvdExpbmspIHtcbiAgICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpXG4gICAgICAuYXR0cignaHJlZicsIG9wdGlvbnMuZm9yZ290TGluaylcbiAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX3BhcmVudCcpO1xuICB9IFxuICBlbHNlIHtcbiAgICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpLmVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIGJlYW4ub24oZWxlbSwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2hvd1Jlc2V0RXhwZXJpZW5jZShlKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBoaWRlIGRpdmlkZXIgZG90IGlmIHRoZXJlIGFyZSBvbmUgb2YgdHdvXG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmRpdmlkZXInKVxuICAgIC5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBvcHRpb25zLnNob3dTaWdudXAgJiYgb3B0aW9ucy5zaG93Rm9yZ290ID8gJycgOiAnbm9uZScpO1xuXG4gICQoJ2Rpdi5wYW5lbCBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKGUpIHsgZS52YWx1ZSA9ICcnOyB9KTtcblxuICAvLyBwbGFjZWhvbGRlcnMgYW5kIGJ1dHRvbnNcbiAgJCgnLnBhbmVsIC56b2NpYWwucHJpbWFyeScpLmh0bWwob3B0aW9ucy5zaWduSW5CdXR0b25UZXh0KTtcbiAgJCgnLnBhbmVsIC5lbWFpbCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5lbWFpbFBsYWNlaG9sZGVyKTtcbiAgJCgnLnBhbmVsIC5wYXNzd29yZCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5wYXNzd29yZFBsYWNlaG9sZGVyKTtcbiAgJCgnLnBhbmVsIC5zZXBhcmF0b3Igc3BhbicpLmh0bWwob3B0aW9ucy5zZXBhcmF0b3JUZXh0KTtcblxuICAvLyBzaWdudXBcbiAgJCgnLnBhbmVsIC5zaWdudXAgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChvcHRpb25zLnNpZ251cEJ1dHRvblRleHQpO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5lbWFpbCBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKGkpIHsgXG4gICAgICBpLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCBvcHRpb25zLnNpZ251cEVtYWlsUGxhY2Vob2xkZXIpO1xuICAgICAgaS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0ge307XG4gICAgICAgIGlmIChzZWxmLl9pc0VudGVycHJpc2VDb25uZWN0aW9uKHRoaXMudmFsdWUsIG91dHB1dCkpIHtcbiAgICAgICAgICB2YXIgd2FybmluZ1RleHQgPSBvcHRpb25zLnNpZ251cEVudGVycHJpc2VFbWFpbFdhcm5pbmdUZXh0LnJlcGxhY2UoL3tkb21haW59L2csIG91dHB1dC5kb21haW4pO1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkod2FybmluZ1RleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnNpZ251cFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuXG4gICQoJy5wYW5lbCAuc2lnbnVwIC5vcHRpb25zIC5jYW5jZWwnKS5odG1sKG9wdGlvbnNbJ3NpZ251cENhbmNlbEJ1dHRvblRleHQnXSk7XG4gIGJlYW4ub24oJCgnLnBhbmVsIC5zaWdudXAgLm9wdGlvbnMgLmNhbmNlbCcpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7IHNlbGYuX3NldExvZ2luVmlldygpOyB9KTtcblxuICAkKCcucGFuZWwgLnNpZ251cCAuaGVhZGVyJylcbiAgICAuaHRtbChvcHRpb25zLnNpZ251cEhlYWRlclRleHQpXG4gICAgLmF0dHIoJ2Rpc3BsYXknLCBvcHRpb25zLnNpZ251cEhlYWRlclRleHQgPyAnJyA6ICdub25lJyk7XG5cbiAgJCgnLnBhbmVsIC5zaWdudXAgLmZvb3RlcicpXG4gICAgLmh0bWwob3B0aW9ucy5zaWdudXBGb290ZXJUZXh0KVxuICAgIC5hdHRyKCdkaXNwbGF5Jywgb3B0aW9ucy5zaWdudXBGb290ZXJUZXh0ID8gJycgOiAnbm9uZScpO1xuXG4gIC8vIHJlc2V0XG4gICQoJy5wYW5lbCAucmVzZXQgLnpvY2lhbC5wcmltYXJ5JykuaHRtbChvcHRpb25zLnJlc2V0QnV0dG9uVGV4dCk7XG4gICQoJy5wYW5lbCAucmVzZXQgLmVtYWlsIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnJlc2V0RW1haWxQbGFjZWhvbGRlcik7XG4gICQoJy5wYW5lbCAucmVzZXQgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnJlc2V0UGFzc3dvcmRQbGFjZWhvbGRlcik7XG5cbiAgJCgnLnBhbmVsIC5yZXNldCAucmVwZWF0UGFzc3dvcmQgaW5wdXQnKS5lYWNoKGZ1bmN0aW9uIChpKSB7IFxuICAgICAgaS5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5yZXNldFJlcGVhdFBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuICAgICAgaS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCgnLnBhbmVsIC5yZXNldCAucGFzc3dvcmQgaW5wdXQnKS52YWwoKSAhPSB0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRDdXN0b21WYWxpZGl0eShvcHRpb25zLnJlc2V0RW50ZXJTYW1lUGFzc3dvcmRUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH0pO1xuXG4gICQoJy5wYW5lbCAucmVzZXQgLm9wdGlvbnMgLmNhbmNlbCcpLmh0bWwob3B0aW9ucy5yZXNldENhbmNlbEJ1dHRvblRleHQpO1xuICBiZWFuLm9uKCQoJy5wYW5lbCAucmVzZXQgLm9wdGlvbnMgLmNhbmNlbCcpWzBdLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7IHNlbGYuX3NldExvZ2luVmlldygpOyB9KTtcblxuICAkKCcucGFuZWwgLnJlc2V0IC5oZWFkZXInKVxuICAgIC5odG1sKG9wdGlvbnMucmVzZXRIZWFkZXJUZXh0KVxuICAgIC5hdHRyKCdkaXNwbGF5Jywgb3B0aW9ucy5yZXNldEhlYWRlclRleHQgPyAnJyA6ICdub25lJyk7XG5cbiAgLy8gc2hvdyBlbWFpbCwgcGFzc3dvcmQsIHNlcGFyYXRvciBhbmQgYnV0dG9uIGlmIHRoZXJlIGFyZSBlbnRlcnByaXNlL2RiIGNvbm5lY3Rpb25zXG4gIHZhciBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPSB0aGlzLl9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubigpO1xuICB2YXIgYW55U29jaWFsQ29ubmVjdGlvbiA9IHRoaXMuX2FyZVRoZXJlQW55U29jaWFsQ29ubigpO1xuXG4gICQoJy5wYW5lbCAuZW1haWwgaW5wdXQnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuem9jaWFsLnByaW1hcnknKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAucGFzc3dvcmQgaW5wdXQnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBvcHRpb25zLnNob3dQYXNzd29yZCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgb3B0aW9ucy5zaG93Rm9yZ290ICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuc2lnbi11cCcpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd1NpZ251cCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuc2VwYXJhdG9yJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uICYmIGFueVNvY2lhbENvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAubGFzdC10aW1lJykuaHRtbChvcHRpb25zLnJldHVyblVzZXJMYWJlbCk7XG5cbiAgLy8gVE9ETzogc2hvdyBwbGFjZWhvbGRlcnMgZm9yIElFOVxuXG4gIC8vIGFjdGl2YXRlIHBhbmVsXG4gICQoJ2Rpdi5wYW5lbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnZGl2Lm92ZXJsYXknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICQoJy5wb3B1cCBoMScpLmh0bWwob3B0aW9ucy50aXRsZSk7XG4gICQoJy5wb3B1cCAuaW52YWxpZCcpLnJlbW92ZUNsYXNzKCdpbnZhbGlkJyk7XG5cbiAgLy8gaWYgdXNlciBsb2dnZWQgaW4gc2hvdyBsb2dnZWQgaW4gZXhwZXJpZW5jZVxuICBpZiAodGhpcy5fc3NvRGF0YS5zc28gJiYgb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSkge1xuICAgIHRoaXMuX3Nob3dMb2dnZWRJbkV4cGVyaWVuY2UoKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10pIHtcbiAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5yZW1vdmVDbGFzcygnaWNvbicpLmFkZENsYXNzKCdibG9jaycpO1xuICB9IGVsc2Uge1xuICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmFkZENsYXNzKCdpY29uJykucmVtb3ZlQ2xhc3MoJ2Jsb2NrJyk7XG4gIH1cblxuICAkKCdkaXYucGFuZWwub25lc3RlcCBoMScpLmh0bWwob3B0aW9uc1sndGl0bGUnXSk7XG5cbiAgLy8gVE9ETzogc3VwcG9ydCBfc2lnbmluT3B0aW9ucy5jb250YWluZXJcblxuICBpZiAodGhpcy5fc3NvRGF0YS5zc28gJiYgdGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKSB7XG4gICAgJCgnZGl2LnBhbmVsLm9uZXN0ZXAgaW5wdXQnKS52YWwodGhpcy5fc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKTtcbiAgICB0aGlzLl9zaG93T3JIaWRlUGFzc3dvcmQoKTtcbiAgfVxuXG4gIHRoaXMuX3NldFRvcChvcHRpb25zLnRvcCwgJCgnZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG4gIHRoaXMuX3NldExvZ2luVmlldyh7IGlzUmV0dXJuaW5nVXNlcjogdGhpcy5fc3NvRGF0YS5zc28gfSk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldENvbmZpZ3VyZWRTdHJhdGVnaWVzID0gZnVuY3Rpb24gKGNvbm5zKSB7XG4gIHZhciBzdHJhdGVnaWVzID0gW107XG4gIGZvciAodmFyIGNvbm4gaW4gY29ubnMpIHtcbiAgICBpZiAodHlwZW9mKGNvbm5zW2Nvbm5dLnN0YXR1cykgIT09ICd1bmRlZmluZWQnICYmICFjb25uc1tjb25uXS5zdGF0dXMpIGNvbnRpbnVlO1xuXG4gICAgdmFyIHN0cmF0ZWd5ID0gc3RyYXRlZ2llcy5maWx0ZXIoZnVuY3Rpb24gKHMpIHsgXG4gICAgICByZXR1cm4gcy5uYW1lID09PSBjb25uc1tjb25uXS5zdHJhdGVneTsgXG4gICAgfSlbMF07XG5cbiAgICBpZiAoIXN0cmF0ZWd5KSB7XG4gICAgICBzdHJhdGVneSA9IHtcbiAgICAgICAgbmFtZTogY29ubnNbY29ubl0uc3RyYXRlZ3ksXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfTtcblxuICAgICAgc3RyYXRlZ2llcy5wdXNoKHN0cmF0ZWd5KTtcbiAgICB9XG5cbiAgICB2YXIgY29ubkRhdGEgPSB7XG4gICAgICBuYW1lOiBjb25uc1tjb25uXS5uYW1lLFxuICAgICAgZG9tYWluOiBjb25uc1tjb25uXS5kb21haW4sXG4gICAgICBzaG93U2lnbnVwOiBjb25uc1tjb25uXS5zaG93U2lnbnVwLFxuICAgICAgc2hvd0ZvcmdvdDogY29ubnNbY29ubl0uc2hvd0ZvcmdvdFxuICAgIH07XG5cbiAgICBzdHJhdGVneS5jb25uZWN0aW9ucy5wdXNoKGNvbm5EYXRhKTtcbiAgfVxuXG4gIHJldHVybiBzdHJhdGVnaWVzO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2F1dGgwO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoc2lnbmluT3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMgPSB4dGVuZCh0aGlzLl9vcHRpb25zLCBzaWduaW5PcHRpb25zKTtcbiAgdGhpcy5fYXV0aDAgPSBuZXcgQXV0aDAoe1xuICAgIGNsaWVudElEOiAgICAgdGhpcy5fc2lnbmluT3B0aW9ucy5jbGllbnRJRCwgXG4gICAgY2FsbGJhY2tVUkw6ICB0aGlzLl9zaWduaW5PcHRpb25zLmNhbGxiYWNrVVJMLFxuICAgIGRvbWFpbjogICAgICAgdGhpcy5fc2lnbmluT3B0aW9ucy5kb21haW5cbiAgfSk7XG5cbiAgLy8gVE9ETzogc2V0IGF1dGgwIGNvbm5lY3Rpb24gcGFyYW1ldGVyc1xuICB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMgPSBudWxsO1xuXG4gIC8vIGdldCBjb25maWd1cmVkIHN0cmF0ZWdpZXMvY29ubmVjdGlvbnNcbiAgdGhpcy5fYXV0aDAuZ2V0Q29ubmVjdGlvbnMoZnVuY3Rpb24gKGVyciwgY29ubmVjdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZENvbm5lY3Rpb25zID0gW107XG5cbiAgICAvLyB1c2Ugb25seSBzcGVjaWZpZWQgY29ubmVjdGlvbnNcbiAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucykge1xuICAgICAgZm9yICh2YXIgaSBpbiBjb25uZWN0aW9ucykge1xuICAgICAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucy5pbmRleE9mKGNvbm5lY3Rpb25zW2ldLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBhbGxvd2VkQ29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhbGxvd2VkQ29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICBzZWxmLl9jbGllbnQgPSB7XG4gICAgICBzdHJhdGVnaWVzOiBzZWxmLl9nZXRDb25maWd1cmVkU3RyYXRlZ2llcyhhbGxvd2VkQ29ubmVjdGlvbnMpXG4gICAgfTtcblxuICAgIC8vIGdldCBTU08gZGF0YVxuICAgIHNlbGYuX2F1dGgwLmdldFNTT0RhdGEoZnVuY3Rpb24gKGVyciwgc3NvRGF0YSkge1xuICAgICAgc2VsZi5fc3NvRGF0YSA9IHNzb0RhdGE7XG4gICAgICBcbiAgICAgIC8vIHJlbW92ZSB3aWRnZXQgY29udGFpbmVyIChpZiBleGlzdClcbiAgICAgICQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcblxuICAgICAgLy8gd2lkZ2V0IGNvbnRhaW5lclxuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IG1haW5UbXBsKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICBcbiAgICAgIHNlbGYuX2luaXRpYWxpemUoKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwV2lkZ2V0O1xuIl19
;