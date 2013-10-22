;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var fs          = require('fs');
var insertCss   = require('insert-css');

var Auth0Widget = require('./widget');

insertCss("@charset \"UTF-8\";#auth0-widget{/*!\n* CleanSlate\n*   github.com/premasagar/cleanslate\n*\n*//*!\n\tZocial Butons\n\thttp://zocial.smcllns.com\n\tby Sam Collins (@smcllns)\n\tLicense: http://opensource.org/licenses/mit-license.php\n\t\n\tYou are free to use and modify, as long as you keep this license comment intact or link back to zocial.smcllns.com on your site.\n*//*! normalize.css v1.0.1 | MIT License | git.io/normalize */}#auth0-widget .cleanslate,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate p,#auth0-widget .cleanslate td,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate tr,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate table,#auth0-widget .cleanslate th,#auth0-widget .cleanslate tbody,#auth0-widget .cleanslate tfoot,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate thead,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate li,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate li,#auth0-widget .cleanslate iframe,#auth0-widget .cleanslate strong,#auth0-widget .cleanslate legend,#auth0-widget .cleanslate em,#auth0-widget .cleanslate s,#auth0-widget .cleanslate cite,#auth0-widget .cleanslate span,#auth0-widget .cleanslate input,#auth0-widget .cleanslate sup,#auth0-widget .cleanslate label,#auth0-widget .cleanslate dfn,#auth0-widget .cleanslate object,#auth0-widget .cleanslate big,#auth0-widget .cleanslate q,#auth0-widget .cleanslate font,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate acronym,#auth0-widget .cleanslate small,#auth0-widget .cleanslate img,#auth0-widget .cleanslate strike,#auth0-widget .cleanslate code,#auth0-widget .cleanslate sub,#auth0-widget .cleanslate ins,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate var,#auth0-widget .cleanslate a,#auth0-widget .cleanslate abbr,#auth0-widget .cleanslate applet,#auth0-widget .cleanslate del,#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate tt,#auth0-widget .cleanslate b,#auth0-widget .cleanslate i,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section,#auth0-widget .cleanslate time,#auth0-widget .cleanslate mark,#auth0-widget .cleanslate audio,#auth0-widget .cleanslate video{background-attachment:scroll!important;background-color:transparent!important;background-image:none!important;background-position:0 0!important;background-repeat:repeat!important;border-color:black!important;border-color:currentColor!important;border-radius:0!important;border-style:none!important;border-width:medium!important;bottom:auto!important;clear:none!important;clip:auto!important;color:inherit!important;counter-increment:none!important;counter-reset:none!important;cursor:auto!important;direction:inherit!important;display:inline!important;float:none!important;font-family:inherit!important;font-size:inherit!important;font-style:inherit!important;font-variant:normal!important;font-weight:inherit!important;height:auto!important;left:auto!important;letter-spacing:normal!important;line-height:inherit!important;list-style-type:inherit!important;list-style-position:outside!important;list-style-image:none!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1;outline:invert none medium!important;overflow:visible!important;padding:0!important;position:static!important;quotes:\"\" \"\"!important;right:auto!important;table-layout:auto!important;text-align:inherit!important;text-decoration:inherit!important;text-indent:0!important;text-transform:none!important;top:auto!important;unicode-bidi:normal!important;vertical-align:baseline!important;visibility:inherit!important;white-space:normal!important;width:auto!important;word-spacing:normal!important;z-index:auto!important;-moz-border-radius:0!important;-webkit-border-radius:0!important;-moz-box-sizing:content-box!important;-webkit-box-sizing:content-box!important;box-sizing:content-box!important;text-shadow:none!important}#auth0-widget .cleanslate,#auth0-widget .cleanslate h3,#auth0-widget .cleanslate h5,#auth0-widget .cleanslate p,#auth0-widget .cleanslate h1,#auth0-widget .cleanslate dl,#auth0-widget .cleanslate dt,#auth0-widget .cleanslate h6,#auth0-widget .cleanslate ol,#auth0-widget .cleanslate form,#auth0-widget .cleanslate select,#auth0-widget .cleanslate option,#auth0-widget .cleanslate pre,#auth0-widget .cleanslate div,#auth0-widget .cleanslate h2,#auth0-widget .cleanslate caption,#auth0-widget .cleanslate h4,#auth0-widget .cleanslate ul,#auth0-widget .cleanslate address,#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate dd,#auth0-widget .cleanslate fieldset,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate hr,#auth0-widget .cleanslate article,#auth0-widget .cleanslate aside,#auth0-widget .cleanslate dialog,#auth0-widget .cleanslate figure,#auth0-widget .cleanslate footer,#auth0-widget .cleanslate header,#auth0-widget .cleanslate hgroup,#auth0-widget .cleanslate menu,#auth0-widget .cleanslate nav,#auth0-widget .cleanslate section{display:block!important}#auth0-widget .cleanslate table{display:table!important}#auth0-widget .cleanslate thead{display:table-header-group!important}#auth0-widget .cleanslate tbody{display:table-row-group!important}#auth0-widget .cleanslate tfoot{display:table-footer-group!important}#auth0-widget .cleanslate tr{display:table-row!important}#auth0-widget .cleanslate th,#auth0-widget .cleanslate td{display:table-cell!important}#auth0-widget .cleanslate nav ul,#auth0-widget .cleanslate nav ol{list-style-type:none!important}#auth0-widget .cleanslate ul,#auth0-widget .cleanslate menu{list-style-type:disc!important}#auth0-widget .cleanslate ol{list-style-type:decimal!important}#auth0-widget .cleanslate ol ul,#auth0-widget .cleanslate ul ul,#auth0-widget .cleanslate menu ul,#auth0-widget .cleanslate ol menu,#auth0-widget .cleanslate ul menu,#auth0-widget .cleanslate menu menu{list-style-type:circle!important}#auth0-widget .cleanslate ol ol ul,#auth0-widget .cleanslate ol ul ul,#auth0-widget .cleanslate ol menu ul,#auth0-widget .cleanslate ol ol menu,#auth0-widget .cleanslate ol ul menu,#auth0-widget .cleanslate ol menu menu,#auth0-widget .cleanslate ul ol ul,#auth0-widget .cleanslate ul ul ul,#auth0-widget .cleanslate ul menu ul,#auth0-widget .cleanslate ul ol menu,#auth0-widget .cleanslate ul ul menu,#auth0-widget .cleanslate ul menu menu,#auth0-widget .cleanslate menu ol ul,#auth0-widget .cleanslate menu ul ul,#auth0-widget .cleanslate menu menu ul,#auth0-widget .cleanslate menu ol menu,#auth0-widget .cleanslate menu ul menu,#auth0-widget .cleanslate menu menu menu{list-style-type:square!important}#auth0-widget .cleanslate li{display:list-item!important;min-height:auto!important;min-width:auto!important}#auth0-widget .cleanslate strong{font-weight:bold!important}#auth0-widget .cleanslate em{font-style:italic!important}#auth0-widget .cleanslate kbd,#auth0-widget .cleanslate samp,#auth0-widget .cleanslate code{font-family:monospace!important}#auth0-widget .cleanslate a,#auth0-widget .cleanslate a *,#auth0-widget .cleanslate input[type=submit],#auth0-widget .cleanslate input[type=radio],#auth0-widget .cleanslate input[type=checkbox],#auth0-widget .cleanslate select{cursor:pointer!important}#auth0-widget .cleanslate a:hover{text-decoration:underline!important}#auth0-widget .cleanslate button,#auth0-widget .cleanslate input[type=submit]{text-align:center!important}#auth0-widget .cleanslate input[type=hidden]{display:none!important}#auth0-widget .cleanslate abbr[title],#auth0-widget .cleanslate acronym[title],#auth0-widget .cleanslate dfn[title]{cursor:help!important;border-bottom-width:1px!important;border-bottom-style:dotted!important}#auth0-widget .cleanslate ins{background-color:#ff9!important;color:black!important}#auth0-widget .cleanslate del{text-decoration:line-through!important}#auth0-widget .cleanslate blockquote,#auth0-widget .cleanslate q{quotes:none!important}#auth0-widget .cleanslate blockquote:before,#auth0-widget .cleanslate blockquote:after,#auth0-widget .cleanslate q:before,#auth0-widget .cleanslate q:after,#auth0-widget .cleanslate li:before,#auth0-widget .cleanslate li:after{content:\"\"!important}#auth0-widget .cleanslate input,#auth0-widget .cleanslate select{vertical-align:middle!important}#auth0-widget .cleanslate select,#auth0-widget .cleanslate textarea,#auth0-widget .cleanslate input{border:1px solid #ccc!important}#auth0-widget .cleanslate table{border-collapse:collapse!important;border-spacing:0!important}#auth0-widget .cleanslate hr{display:block!important;height:1px!important;border:0!important;border-top:1px solid #ccc!important;margin:1em 0!important}#auth0-widget .cleanslate *[dir=rtl]{direction:rtl!important}#auth0-widget .cleanslate mark{background-color:#ff9!important;color:black!important;font-style:italic!important;font-weight:bold!important}#auth0-widget .cleanslate{font-size:medium!important;line-height:1!important;direction:ltr!important;text-align:left!important;font-family:\"Times New Roman\",Times,serif!important;color:black!important;font-style:normal!important;font-weight:normal!important;text-decoration:none!important;list-style-type:disc!important}#auth0-widget .zocial,#auth0-widget a.zocial{border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);color:#fff;-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);cursor:pointer;display:inline-block;font:bold 100%/2.1 \"Lucida Grande\",Tahoma,sans-serif;padding:0 .95em 0 0;text-align:center;text-decoration:none;text-shadow:0 1px 0 rgba(0,0,0,0.5);white-space:nowrap;-moz-user-select:none;-webkit-user-select:none;user-select:none;position:relative;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .zocial:before{content:\"\";border-right:.075em solid rgba(0,0,0,0.1);float:left;font:120%/1.65 zocial;font-style:normal;font-weight:normal;margin:0 .5em 0 0;padding:0 .5em;text-align:center;text-decoration:none;text-transform:none;-moz-box-shadow:.075em 0 0 rgba(255,255,255,0.25);-webkit-box-shadow:.075em 0 0 rgba(255,255,255,0.25);box-shadow:.075em 0 0 rgba(255,255,255,0.25);-moz-font-smoothing:antialiased;-webkit-font-smoothing:antialiased;font-smoothing:antialiased}#auth0-widget .zocial:active{outline:0}#auth0-widget .zocial.icon{overflow:hidden;max-width:2.4em;padding-left:0;padding-right:0;max-height:2.15em;white-space:nowrap}#auth0-widget .zocial.icon:before{padding:0;width:2em;height:2em;box-shadow:none;border:0}#auth0-widget .zocial{background-image:-moz-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(49%,rgba(255,255,255,0.05)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1));background-image:linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.05) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.1))}#auth0-widget .zocial:hover,#auth0-widget .zocial:focus{background-image:-moz-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.15)),color-stop(49%,rgba(255,255,255,0.15)),color-stop(51%,rgba(0,0,0,0.1)),to(rgba(0,0,0,0.15)));background-image:-webkit-linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(rgba(255,255,255,0.15) 49%,rgba(0,0,0,0.1) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial:active{background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.1)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,transparent),to(rgba(0,0,0,0.1)));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0.1),rgba(255,255,255,0) 30%,transparent 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.dropbox,#auth0-widget .zocial.github,#auth0-widget .zocial.gmail,#auth0-widget .zocial.openid,#auth0-widget .zocial.secondary,#auth0-widget .zocial.stackoverflow,#auth0-widget .zocial.salesforce{border:1px solid #aaa;border-color:rgba(0,0,0,0.3);border-bottom-color:#777;border-bottom-color:rgba(0,0,0,0.5);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.7),inset 0 0 .08em rgba(255,255,255,0.5);text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial.dropbox:focus,#auth0-widget .zocial.dropbox:hover,#auth0-widget .zocial.github:focus,#auth0-widget .zocial.github:hover,#auth0-widget .zocial.gmail:focus,#auth0-widget .zocial.gmail:hover,#auth0-widget .zocial.openid:focus,#auth0-widget .zocial.openid:hover,#auth0-widget .zocial.secondary:focus,#auth0-widget .zocial.secondary:hover,#auth0-widget .zocial.stackoverflow:focus,#auth0-widget .zocial.stackoverflow:hover,#auth0-widget .zocial.twitter:focus .zocial.twitter:hover,#auth0-widget .zocial.salesforce:focus .zocial.salesforce:hover{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.5)),color-stop(49%,rgba(255,255,255,0.2)),color-stop(51%,rgba(0,0,0,0.05)),to(rgba(0,0,0,0.15)));background-image:-moz-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-webkit-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-o-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:-ms-linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15));background-image:linear-gradient(top,rgba(255,255,255,0.5),rgba(255,255,255,0.2) 49%,rgba(0,0,0,0.05) 51%,rgba(0,0,0,0.15))}#auth0-widget .zocial.dropbox:active,#auth0-widget .zocial.github:active,#auth0-widget .zocial.gmail:active,#auth0-widget .zocial.openid:active,#auth0-widget .zocial.secondary:active,#auth0-widget .zocial.stackoverflow:active,#auth0-widget .zocial.wikipedia:active,#auth0-widget .zocial.salesforce:active{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),color-stop(30%,rgba(255,255,255,0)),color-stop(50%,rgba(0,0,0,0)),to(rgba(0,0,0,0.1)));background-image:-moz-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-webkit-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-o-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:-ms-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1));background-image:linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.1))}#auth0-widget .zocial.amazon:before{content:\"a\"}#auth0-widget .zocial.dropbox:before{content:\"d\";color:#1f75cc}#auth0-widget .zocial.facebook:before{content:\"f\"}#auth0-widget .zocial.github:before{content:\"\\00E8\"}#auth0-widget .zocial.gmail:before{content:\"m\";color:#f00}#auth0-widget .zocial.google:before{content:\"G\"}#auth0-widget .zocial.googleplus:before{content:\"+\"}#auth0-widget .zocial.guest:before{content:\"?\"}#auth0-widget .zocial.ie:before{content:\"6\"}#auth0-widget .zocial.linkedin:before{content:\"L\"}#auth0-widget .zocial.openid:before{content:\"o\";color:#ff921d}#auth0-widget .zocial.paypal:before{content:\"$\"}#auth0-widget .zocial.stackoverflow:before{content:\"\\00EC\";color:#ff7a15}#auth0-widget .zocial.twitter:before{content:\"T\"}#auth0-widget .zocial.vk:before{content:\"N\"}#auth0-widget .zocial.windows:before{content:\"W\"}#auth0-widget .zocial.yahoo:before{content:\"Y\"}#auth0-widget .zocial.office365:before{content:\"z\"}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.amazon{background-color:#ffad1d;color:#030037;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.dropbox{background-color:#fff;color:#312c2a}#auth0-widget .zocial.facebook{background-color:#4863ae}#auth0-widget .zocial.github{background-color:#fbfbfb;color:#050505}#auth0-widget .zocial.gmail{background-color:#efefef;color:#222}#auth0-widget .zocial.google{background-color:#4e6cf7}#auth0-widget .zocial.googleplus{background-color:#dd4b39}#auth0-widget .zocial.guest{background-color:#1b4d6d}#auth0-widget .zocial.ie{background-color:#00a1d9}#auth0-widget .zocial.linkedin{background-color:#0083a8}#auth0-widget .zocial.openid{background-color:#f5f5f5;color:#333}#auth0-widget .zocial.paypal{background-color:#fff;color:#32689a;text-shadow:0 1px 0 rgba(255,255,255,0.5)}#auth0-widget .zocial.twitter{background-color:#46c0fb}#auth0-widget .zocial.vk{background-color:#45688e}#auth0-widget .zocial.windows{background-color:#0052a4;color:#fff}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:.1em 0;padding:0 1em}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#333}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget button:-moz-focus-inner{border:0;padding:0}@font-face{font-family:'zocial';src:url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.eot')}@font-face{font-family:'zocial';src:url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABeQAA0AAAAAIGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcZnuAykdERUYAAAFMAAAAHwAAACAATgAGT1MvMgAAAWwAAABIAAAAVk/l3EBjbWFwAAABtAAAAPYAAAIKnl567Gdhc3AAAAKsAAAACAAAAAj//wADZ2x5ZgAAArQAABKLAAAZsAMpJrBoZWFkAAAVQAAAADAAAAA2/3JSWWhoZWEAABVwAAAAIAAAACQFfQH5aG10eAAAFZAAAABjAAAAgDtOAbdsb2NhAAAV9AAAAEQAAABEWZZf+G1heHAAABY4AAAAHgAAACAAcAC+bmFtZQAAFlgAAADeAAABhlbD9/Jwb3N0AAAXOAAAAFYAAABsUemhhHicY2BgYGQAgpOd+YYg+lwlxxkYDQBA+QYqAAB4nGNgZGBg4ANiCQYQYGJgZGBmUACSLGAeAwAFxABVAHicY2BkEmOcwMDKwMHow5jGwMDgDqW/MkgytDAwMDGwMjPAALMAAwIEpLmmMDgwKH5gYHzw/wGDHuNrBvUGBgZGkBwAj6YLSHictZC9LkRRFIW/O67xzx2GYQwzElHMNBMvoBKNqIQoiVBKJBLxMlSimnJoKGi8gxeQUCh1y7o/jZurtJO1917n7HWy1wEGSNEgcCYIzYKEh7y7rtNyN+1ulTU6dNlgky222WGXfQ444phTzjjngkuurPr8QopfY8Wadk6zZ82hNSfFGn3rTR961Yue9aRHPehefZ/3jFv1dKcbXaujdpRu2qU4WhnyUbe3pj1F1KhQtecyqfnYf8mplFPEl/VGM2TZzWA5Plr8PTGU5GFG4jLKWELHmZhkKpuIav7ESjVjs8lqSzDPQtHuM8bcH77+JX4A6/Y7NwAAAAAAAf//AAJ4nJ1YeYwkV32u33tV79V9H313T/f0MdMzPdNnzeGZ2WN2vYftXXbXF2vvrtc2uw7GDkZADARI2BChiFh2hL1BcsAKicLhkEgJRJEwREFKLMcRoBAnUkKwEsFi5AASOIqTzOT3qmcdkv9I1/T0O6pevXrv+33f9ysJJGn320SCb0tEkjyYIdIOVnYk8ZGx77vwA7gmWVJF6kjLkjQOhoMK4TZ0gTeSYTocTNJJO95rCERD0sNysgnpaDJu3PtyfrntqM5bts/Vrgyv1M4dut+1Z13decuhu2ceev98vA+4nHP3zea6ClmvwvNBa719+OTV9KmThw51W/1DJ58C6xxx/PdBowAySGR3d/cazvd7Uk3axBmPJlvAojCp0ChkjXqrzePEJqJAW+NkNBkO4iRttQebIEpBjGc5MBmPWu2Wa91f+yWnUPYbSWV/NFdeVGJPtSJ6Bl5qRPktu9rrw0KZZy2udSx3dO12eAhruWb/3FCxo6IT55LgrOsCkz0TLjCaBJHv3JFTTeZaO59kFE/2ZudXjgUVScZ5f4ech+9KbekG6bB0CtdyNFmH1niUinlnFd6oQBTiYkZhnIhi1pOGMS7zeNTusXar0WJpBYbxpEeYMh6Oh9EwakSN8dn9xUhV9PH2mcknZge54mJglOxq7syR7XOrNyxupBRklVuqL4fB0qE6G1Qrs/pwYxZmLuUvXcpvLxwOc44DB5eXDhe0YW1p1vYtraLHvUZvezjvzfYXmzpXdJ0ZikkZ9P9zbg3SN62QyUhcfumSBBIgVn4V/hhxIqWjFPdfPNMAF5xnD8W4LTfqrAu4NdkxBmbu73b23bGvMznaJAr1a0ELQIHNwklFky0tOGXEC0e92mBhY2NhUAvuSpdURVUtVVbAszWTqmpDoojRa/As4uEh6f3SRwQiUoTkOogV24C9SpzEyQChGU+PN6aDU8SJirNjm+Cisy51lLBCppdPpzmqR6EDjDfq2bx70G6l43TU5wJ2IT4PZ8pkGCejdgOLqqxpzrJqMO6zSK+EIbWNYtD3IqbIlKg2d6xcGKZtPWeqlk0AgBCgivjIWJJlh3plLwgX3SLRZcWmprO/aXI1oISeAwbKsm9SmDHMJKgSh6twLNQ5VQzVMCuWZigUVDUhjLNS6USvEtt3zMdFl5PCfFI08F5UVqmsU1FSGNcUYufbRby9PgSoFy0TUeIyxz8feYfhLqCGbcwrDJ4koHZBN5ATqMAxHM9wvPn/RnG2aohjXOc0a4Ns8aLwZ4AxXag3BJBJ2bNBGVZIxbN/RhzncojjQlxWtbkVKERlVTzff+2+Qlz4DnKeJ81LEhEcMoUMzpp6Q28dxgLfw0EZhggSnHjU34BGHNLZcsn3PL8MpdIjW2+X1XK8+siR9QPNtwM8PpxxvWLe9XbeC7ftfObLvu7lbv7iV2+6ZQVg2f0sRs9/SG3yNnhMehInMUWwgGy6hsGO7IawrTAE80isFmlvwjqt0jhBBOKyCSQiwDfpeLIlZ1eKtR5UIJu3jXxNkzAbI3sOgWScdQPBTEWvaMAxsSojKBDOCkcgIRcqBqNc4RCWgFGmMEZtolLNlXmzatmWbehczgAMxMLIpHouhyepqqHolseVwHZ1QnzNLylgMgaUyTo0o7CAVxq6Zum03qSWZnOTE5nX7aCzv5WMl0GVGYV3i3AAoETXPDo/R1SFyzKGyqqutmwmpqIhmrluIp69SDFNTU9UqsoWVEemlU0MyUSmslN2cg0OruowmWuyBjPFouHJYtJKl3iaCqTQ4CaRZ2bL2/dQT3NsxPlUF9+FuthHjONypshb4qcHGxAPewIDuL4C8QiPScq4+EahTXExHffNh+cOmrrtu4vrxVqx6i//2gl6fLLSWmza881mvl3ZvO3RQ289WyArgzZR1CM94nqrM43K+hHZs8Y3zWnJUl5x2yVvdPn80YW16XyukePIc/uR4zbpFoj7VhQMsEyDERatbFexPBwMpztty5zVBWER3F8beGllfkbVGNNVy7M0plIvNMyFggVyrHA/b64uLDI2DjSqj7aOToK4WU9U7ZQqeCCx4e6ZUcmlgq3y1W5zwd43We3nY6YUObEPdqryfJh3vNGDZ44vWiaSTgCGjjRDTf26l7hGfgHnHyBzrEsncFUxiLYEVhPegyXAydtYRz4e/u+2ABe6imuOGp4iqziA8P0/bQ2ObRN/6Pn50iie+Ium7blqcX0w9keeVyiO4rG/aFm+g20vjgMsZt3O2B+7XqE0bI+DhayttIZtI98tFkbV53RkTEWPnnM8gh/ze8/pZla3fQFNc+cHX7J9RD8xjOmpBqhf2uszxLlMk4Q+SYfIVxBHx/GZT+Pe4Y5VyTCJyxAKUeH1MswgjXRJfQNa6GYm+Pz4H7Wr1UdTFcZVOuRt0ba8CaIVz+RRM6FtniacEgS6tvobGDFk1WGgIbcfkwFryi9vK7JGKfyTiCRTW/+5d0ZcblCskNdlIPecn6/ZZIXA7+kUx1D+gPGLsiiUyoTwy4ARwt4ja7Kiil3k+JjyfR8jBsiUCx1J6c634OIKWZEyb3ONDHFvc9Lt0mXpo+gAJoKChAuYxEJrQTgyDJYtGE2EJKcCr11ATDIu2sfTba8oZRru0RZqGPJTmwl6ak3VYzhJN8mG0I5kOkqm6NlCZqQ2DQOhJBwVZxkI++CT999DdcI1rjkLD45O/vqKTD5erxbn7Co3EtnLU6Ktadp2z1qbUTSUYODIY3KXMg05UCflop/vDO4IPZTeyGQKVJzFl5DtjNBXlEQhoYcBgSQVEJZopmlQclaWj7XQqVJLYVqhvDIkuBdPNAaWqRCizRgOBMiKHA/SWyAVxdR8FhPXPmfFOrKuTJtUkVGeHFrjynIa5oDFWuK4lmx9HQegCvIWkjH1+w7eWV70sAK4pSA44jH0Qr+dxZiUojkUahyhSKJQZSbxsROH+idOcPPixXu/ebE/Pn7RtQYXX301i8/df9/9IeGoewbqXiQVJamdttMEIZbwtgPjJC0DTdI2Mk+SRuxtb/vE5bd+/P77n758ebB8+cmnrj6Fs7k0eun06ct33nnvmdvPnzxZL5dOwhdg/dx9t+088AU4Wa3hfTDL2H0FduH7OEd0DzeA2MdsG7MdFx4rFWKG9Lpnv9LWlBAmgmYnGPR8Dx0cd/4N5tvbdjzCufNLDyydm4uiuXNYOD8XducPRYZd8JcKpm0oapCvblRD3+XcMgolNx8VooPdec8rlztz3bn5dqXseV+8vHy+E0Wd8/37+xfmwnDuwr1HVleSuaqF9GeUj7aLlQZhnoqGjgE0KsX2ahmlhNiVuWR19caFDo7i+r5brrQ7Ess86su4L21Uk3XpoHSj9ADyXxhnLrMxD42WcBT4JBgYaDPwWZgwT0LXbZhkWYxwUXxqqFm95YsSFigmAOkw6qO4Z15qi2SBsASjNu5/Y4y7vnV2375FxIdpNgeyo+arNFdqT/KhbSWlzdhxYvxGxWYR/z6Ta+RyDXs7VyZOGDCO3hXlFWIT2Q9pY2lps5zO9HoztZ5RcMho1jaovO6641ZuzvJDPzTqX6zncvXcH1lBYNlBAFfEeLmdb7322p897sY6Q3+ryEMOwPH76HhpaerfSRfXZhYzhxRXpbUpb0FkK840r5OrEPWUseKlXiBkrQo8GWfiAMX50ahrWeV+JWdy4RVYsT5b1vTByf6sq4F81KNBGBtG95OT6Fix+HQtnS25BpAt4sb5HD4fVw3dz0UWkuZYKdSajbL6OfjrwU4HuOAB1ev8YjUuEsHhXPgBeAJ5nGOEOIjeBGOkKknROOEzuAtNDLExRkv7p74YKryNcdHZ+dHzzyvPy182/9x6On42ub3xrlmzO9Ot/S187rN/8/PzxxfC7oPz6fxvNS+3vpH/VP6f+V/wLFZ8SScJ/Im0IX0AIzq+nr+kk71jD/r/c6A2XI+D6wfSYxLG6eiNi5A2JxVZjDN8oykRVnI6uqDf69fuDbvcChkz3Up3brQ6Thfm6zrjKDFIRVY+rlabYWJaClFdRQgFM80kbtcqUajho9dRILlHDY37LlMMqlMVbI1zbmACrdsKUyhVwshxfY2F4GsAfr+7ikzf6qK1gAdV7pg5y0Zjyjyvoqm6qjksUOSVfne2ERpc+DjceUVzivOd0WAVs0LREKM15GFJ8Ww1p6BgoaUBR6agmaWGYRPBySA7kRvErtakVZ9ALXARnIrjlbhGhV95QqrQy/B53OO2tCSUG+oMcYfLO+6PWhigfQy7zHxl/0ctud7KojLe+03a6XjSw8yxz9v9Hmpd0k94n1WQtPppgtduQpvkOwd9/0BnqeUmHpxa6xzw/YOdtVOndn54eDA43P/L7P9rR45w2U/45hZPfMqOHEH6R3RtYk3msDJXr8+V3m24rvHK2ptE5fQ7T73cz67M/m9cuABaYlHt9GmNWol2zwU9tqc1O0Z3piC2/wHj+9uZT1MlU3LRp/TTiCdRe5w2Iwui5vgb+Pk+JDvfy75PlV+A+IXy5/9l7sc0/+POX009nin58BNcs560Ld0lPSxJAeZJEwEpgbJNwNIb0Opl1B8P46xnCmVlggi8fkJ93NoD52B6pQ3t+h4is3Y+mUKWh3tI7YFJHM3nbJ8PcFSTA03TaO5ux3bifF0zCHpgH2LL1FHN6VlHhic0Dzedt5p51+YIaDVMqsUR0RVFMwnidHGm7KMoE6Kauea7ZG7lOn0LXEMLZmuuyuA3NQs8+1NdAl/JaapMA33tWtsLuKqAqzkiBTH0PLXQVfzjrBZTpBRfCV2RpRN0GJ4f+78i0OppOA5F7cf0FjMWmZ9GQdfcAvNcJjOzkHNUtJKSsvv67t/jPr2MHKQjNxSkuiQ1G7yRDpPGEvBZoQwIPVZnQloESLNfmDttHL/z5J03FwsFKF196erVl/LPPPLIM4+854lLl5649Ez71VfP3nrrO0T71QOPiJ4Ll0SPtHfPf4N/ha9LMWrXDZh93IiR0AOx4gwXPoqjCmQ+L51QhpuQbTPuFPYy3Ju96iR7N5CZwbag9XQicn54JTnWqRQeeKaoG/HjF868k0LUfW3fB5otdaHzvhSc+MYHNPXWjcMPGNQowy2HzmxsdjoHAN6xvZ0/ppBmBT5dCSydxfdexjShBG++T1ev3Fmr37Tzh0F/de3KpN9IQofqtx5be6uqv+nGhMOJh756w1xnH8CBuflHzf0HLBJsoZaLZ1Uznf4malFJulW6T3pQelT6iPSM9KcCx3Q4tSHCbgrbKnJmEP5E5IBZJrNJpnDNTqsQRKx412hTgdlGXbxCEka4nb1HSqcp+3DcFv6MX5dzLsbCBCASdhlZuwpDIeF4ow1oBD+V2kVisGkwjJKReCeLxtlWuiAyeSCm7aDQxl6IXjFBoTN116GkjplmYtmQr+ia64WK7CIAZXdURn5F6LG4PKoGMfcMS9G0vBlqkPN8dhC4Ud5fbjg5qtZ6tVrPRrp1SgXVJOccVT1Wq8oMqkUaBz6VY9dUQi9H5ZLB4a4Vr2BhpCmq4Wk0tCyTwmJQtFXww1BFSq7nZZxS2dFU5cca5t1xHvOoqOa7hpFRNQsnsV4p5dGSa5GB9oGI5EVk7p7nH+bcdWL2NHQjA9j+Xm//0usYOpot7zMUS7coefgMoOc+BkouHyn5EFWjnITomWM3Vj96sxOLOFWoa9g6ZjksH0qZ5n5w93U4C19DfZ9BpGdOLEEoo73aQhsd4u/YG9HrL7siOHN4cuSWuzEj6jJypiq35F5hptetVuFrp46fbzwrM+XTn1YUeIHtSuNxmv6dJFmSs/sa/AhexDj20EW0MLI2MK5OS3dLb5HeLr1XuiJJswISNtTTEJkwE5T2ng+st5TrjpC1mqJYgezVd9aQZn3pnk/EmKtP31GIOp0OhKXJtHM44G+Yy9a0BwsjvqdgDA6GlRii8tXIdqKoGjwbOXYUlaOdF0M0jaICQ1GCGIsfxpPwZMcJDzpRXM66I9uO8IQwKof4wTbbuRpm7U74nkoYTk+OsPRwOYxK4YdxxBDPvQ0vKUXhbW4QliIc0w7xN7TtEGLbCXAo0VIOr2BTFFlOuPMw9uPNwo/hTylsOKI3eF1cEZaWAyxXAtQ5S7oLXoWLmKdWpa40kNYwsjFSY8xUCaaYdqYxQkcmqPRIanFaIVNtGU04qhhrT7CKHRX4rFr0uemaqlfEfNh2882iZ6gy+VCix6NG8pPeupJozkQlUDK6dDWtfmiyZrQ4a8FFRCfT8c+SnYP1fjBDK2EhXNj3YvnIxpLyO7+rb5+ed/Xmpju79PvWSM7nW61czlpS1Z4k/Tc/tXiPAHicY2BkYGAA4qooY554fpuvDNxMDCBwrpLjDIz+//P/TeYMxtdALgcDWBoAKlkMKXicY2BkYGB8/f8mgx4Lw/+f/xiYMxiAIihAHgCk1AZ5eJxjYoCCVRCK8RMDAxOQZooDsjsYGBnXAGkvIF/k/z+m3P9/mEqBbBC/HIgPAbERUH4RQz8T2/9fIH2MD4BiWkB6ItgcIRYGhklg8xgYeJgY/v8GYcYrYH4DAz8DLwDcABUuAAAAAAAAAAAAAA4AWAC0ASQBYAIYAogCxAOMA9QENASwBSIF5gYEBjgGsgdAB5QHzgiMCQIJJgnWChAKhguIC7oMdgzYeJxjYGRgYFBk2M3AywACTEDMyAAScwDzGQAZIgEvAAB4nHWOMWoDMRBF39prh+AQUoWUgjRpdpE2jfEB9gAp3BsjlgXbAtkGnyRVjpAyx8gBcoQcI9/raVJYMOjN15/5Au54p+B8Cm54MB6JX4zHPHMyLqV/Gk+Y8W08lf4rZ1HeSrkfps48Ej8Zj2nxxqX0D+MJj3wZT6X/0LMmsVUldtCv0zYlwRuRjiMbVmS1sTtuVoJ28B2GO8sRcTTUSnMsVP/3XbQ5FUGOSk4vetWatDu0KXfRNbV3C2e5onkVfNX4INO1vy2Vmtnr/ZIRhnyWMe977Qi1vzr7BwDvOdMAAHicY2BiwA8UgZiRgYmRiYGdgZeBj0GJQYNBi0GfwZDBnMGSwYrBhsGFwZPBnaGQwYshiKGUwZUhmiGWgYVBmIGVIYKBk4GNIZS9NC/TzcDAAADphwhaAAA=) format('woff'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.ttf') format('truetype'),url('https://s3.amazonaws.com/assets.auth0.com/w2/font/zocial-regular-webfont.svg#zocialregular') format('svg');font-weight:normal;font-style:normal}#auth0-widget .zocial.auth0:before{content:\"?\"}#auth0-widget .zocial.auth0{background-color:#ff4500;width:auto}#auth0-widget .zocial.block{display:block;margin:10px 0;text-overflow:ellipsis;overflow:hidden}#auth0-widget .zocial.primary,#auth0-widget .zocial.secondary{margin:0;padding:0 1em;font-size:14px;line-height:42px}#auth0-widget .zocial.primary:before,#auth0-widget .zocial.secondary:before{display:none}#auth0-widget .zocial.primary{background-color:#747e85}#auth0-widget .zocial.secondary{background-color:#f0f0eb;color:#222;text-shadow:0 1px 0 rgba(255,255,255,0.8)}#auth0-widget .zocial{-webkit-font-smoothing:antialiased}#auth0-widget .popup .overlay{position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;z-index:9999;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background:#000;background:rgba(0,0,0,0.8);background:-webkit-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-moz-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:-ms-radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);background:radial-gradient(50% 50%,ellipse closest-corner,rgba(0,0,0,0.45) 1%,rgba(0,0,0,0.8) 100%);opacity:0;-webkit-transition:400ms opacity ease;-moz-transition:400ms opacity ease;transition:400ms opacity ease;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}#auth0-widget .popup .overlay.active{opacity:1}#auth0-widget .popup .overlay .panel{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;left:50%;display:none}#auth0-widget .popup .overlay .panel.active{display:block;-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:showPanel}#auth0-widget .popup .overlay .panel{-webkit-animation-duration:400ms;-webkit-animation-timing-function:ease;-webkit-animation-name:hidePanel;width:280px;margin:0 0 0 -140px}#auth0-widget .popup .overlay .email{margin-bottom:14px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:14px}#auth0-widget .popup .overlay .email-readonly{text-align:center;display:inherit;color:#41444a;font-weight:bold;margin-bottom:25px}#auth0-widget .panel .signup .header,#auth0-widget .panel .reset .header{margin-bottom:15px;font-size:14px;color:#41444a}#auth0-widget .panel .signup .footer{margin-bottom:15px;font-size:12px;color:#41444a;text-align:left;margin-top:10px}@-moz-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-webkit-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-o-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-ms-keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@keyframes showPanel{0%{opacity:0;-webkit-transform:scale(0.95) translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:scale(1) translate3d(0,0,0)}}@-moz-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-webkit-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-o-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@-ms-keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}@keyframes hidePanel{0%{-webkit-transform:scale(1) translate3d(0,0,0)}100%{-webkit-transform:scale(0.98) translate3d(0,0,0)}}#auth0-widget .popup .panel{background:#fafafa;background-image:-webkit-linear-gradient(#fff,#fafafa);background-image:-moz-linear-gradient(#fff,#fafafa);background-image:-ms-linear-gradient(#fff,#fafafa);background-image:-o-linear-gradient(#fff,#fafafa);background-image:linear-gradient(#fff,#fafafa);z-index:10;-moz-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-webkit-box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);box-shadow:0 0 1px 1px rgba(0,0,0,0.2),0 10px 27px rgba(0,0,0,0.7);-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;-webkit-touch-callout:none}#auth0-widget .popup .panel:after{content:\"\";position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;-moz-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);-webkit-box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4);box-shadow:inset 0 -1px 2px rgba(82,93,112,0.4)}#auth0-widget .popup .panel header{display:block;position:relative;min-height:65px;overflow:hidden;-moz-border-radius:6px 6px 0 0;-webkit-border-radius:6px 6px 0 0;border-radius:6px 6px 0 0;background:#f1f4f6;background-image:-webkit-linear-gradient(#f1f4f6,#e9edf0);background-image:-moz-linear-gradient(#f1f4f6,#e9edf0);background-image:-ms-linear-gradient(#f1f4f6,#e9edf0);background-image:-o-linear-gradient(#f1f4f6,#e9edf0);background-image:linear-gradient(#f1f4f6,#e9edf0);border-bottom:1px solid rgba(40,69,85,0.11)}#auth0-widget .popup .panel header:before{content:'';position:absolute;height:5px;bottom:-1px;left:0;right:0;background-image:-webkit-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-moz-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-ms-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:-o-linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1));background-image:linear-gradient(rgba(40,69,85,0),rgba(40,69,85,0.1))}#auth0-widget .popup .panel header:after{content:'';position:absolute;height:4px;bottom:0;left:0;right:0;background-image:-webkit-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-moz-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-ms-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:-o-linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0);background-image:linear-gradient(left,#e9edf0,rgba(241,244,246,0),#e9edf0)}#auth0-widget .popup .panel header h1{padding:21px 20px;margin:0;font-size:18px;color:#41444a;font-weight:bold;border-bottom:1px solid #dde3e6}#auth0-widget .popup .panel header a{display:block;overflow:hidden;text-indent:200%;position:absolute;width:12px;opacity:.4;padding:5px;z-index:5}#auth0-widget .popup .panel header a:hover{opacity:.66}#auth0-widget .popup .panel header a:active{opacity:1}#auth0-widget .popup .panel header a.close{height:12px;background:url(\"https://s3.amazonaws.com/assets.auth0.com/w2/img/close.png\") 50% 50% no-repeat;background-size:12px 12px;right:19px;top:21px;cursor:pointer}#auth0-widget .popup .panel header a.close:hover{opacity:.66}#auth0-widget .popup .panel header img{height:32px;margin:16px 10px 10px 20px;position:relative;float:left}#auth0-widget .action .spinner{width:100%;background-color:#6a777f;background-image:url('https://s3.amazonaws.com/assets.auth0.com/w2/img/spinner.gif');background-repeat:no-repeat;background-position:center;margin:0;height:44px;border:1px solid #777;border-color:rgba(0,0,0,0.2);border-bottom-color:#333;border-bottom-color:rgba(0,0,0,0.4);-moz-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-webkit-box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);box-shadow:inset 0 .08em 0 rgba(255,255,255,0.4),inset 0 0 .1em rgba(255,255,255,0.9);-moz-user-select:none;user-select:none;-moz-border-radius:.3em;-webkit-border-radius:.3em;border-radius:.3em}#auth0-widget .popup .panel footer{display:block;position:relative;-moz-border-radius:0 0 5px 5px;-webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;height:25px;line-height:25px;vertical-align:middle;margin:0 15px;border-top:1px solid #dde3e6;z-index:5}#auth0-widget .popup .panel footer span{font-size:10px;color:#666}#auth0-widget .popup .panel footer a{font-size:9px;color:#333;font-weight:bold;text-decoration:none;cursor:pointer}#auth0-widget .list,#auth0-widget .iconlist{margin:25px 0;position:relative;z-index:5}#auth0-widget .list:before,#auth0-widget .list:after,#auth0-widget .iconlist:before,#auth0-widget .iconlist:after{display:table;content:\"\"}#auth0-widget .list:after,#auth0-widget .iconlist:after{clear:both}#auth0-widget .list span{display:block;margin:10px 0;cursor:pointer}#auth0-widget .iconlist{text-align:center}#auth0-widget .iconlist span{margin:0 2px}#auth0-widget .forgot-pass{font-size:12px;color:#666;font-weight:normal}#auth0-widget .create-account{display:none;margin-top:20px;text-align:center}#auth0-widget .create-account a{font-size:12px;color:#6d6d6d;text-decoration:none}#auth0-widget .create-account a:hover{text-decoration:underline}#auth0-widget .loggedin span.centered.all{color:#008cdd;cursor:pointer}#auth0-widget .loggedin span.centered{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget .loggedin span.centered.all:hover{text-decoration:underline}#auth0-widget .signup .options a.cancel,#auth0-widget .reset .options a.cancel{color:#008cdd;cursor:pointer;text-decoration:none}#auth0-widget .signup .options a.cancel:hover,#auth0-widget .reset .options a.cancel:hover{text-decoration:underline}#auth0-widget .signup .options,#auth0-widget .reset .options{text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;display:block}#auth0-widget form{margin:30px!important;margin-bottom:22px;position:relative;z-index:5}#auth0-widget form label{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;font-size:18px;padding:10px 12px;border:1px solid #b4becd;border-top-color:#b0baca;border-bottom-color:#d3d9e2;-moz-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-webkit-box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);box-shadow:inset 0 1px 2px rgba(130,137,150,0.23),0 1px 0 rgba(255,255,255,0.85);-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:black;margin:0;font-family:'Helvetica Neue',Helvetica,Arial Geneva,sans-serif}#auth0-widget .placeholder{color:#ccc}#auth0-widget form input:focus{border-color:#5695db #70a7e4 #89b8ec #70a7e4;outline:0;-moz-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;-webkit-box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db;box-shadow:inset 0 1px 2px rgba(70,123,181,0.35),0 0 4px #5695db}#auth0-widget form .invalid input{outline:0;border-color:#ff7076;border-top-color:#ff5c61;-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 0 4px 0 rgba(255,0,0,0.5)}#auth0-widget header .error{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#b95353;text-align:center}#auth0-widget header .success{padding:9px 0;margin:10px auto;width:70%;font-size:14px;line-height:13px;color:#0fad29;text-align:center}#auth0-widget form .note{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}#auth0-widget form .note a{color:#008cdd;text-decoration:none}#auth0-widget form .invalid .error{visibility:visible}#auth0-widget form button{display:block;margin:20px 0 0 0;cursor:pointer;width:100%}#auth0-widget .action{text-align:right;margin:0 30px 30px 30px;position:relative;z-index:5}#auth0-widget form .action{margin:0}#auth0-widget .action button{width:auto}#auth0-widget .separator{position:relative;text-align:center;margin:0 0 25px 0}#auth0-widget .separator:before{content:\"\";display:block;border-top:1px solid #7f8899;width:200px;left:50%;margin-left:-100px;height:1px;position:absolute;top:50%;z-index:1}#auth0-widget .separator span{background:#fafafa;padding:0 10px;position:relative;z-index:5;color:#7f8899;font-size:13px;font-weight:bold;text-shadow:0 1px 0 white}#auth0-widget span.back{display:block;color:#008cdd;text-align:center;padding:5px 0;margin:15px 0 5px;font-size:13px;cursor:pointer;position:relative;z-index:5;outline:0}#auth0-widget span.back:hover{text-decoration:underline}#auth0-widget .signin .panel.strategies .list .email{display:block;color:#7f8899;font-size:13px;font-weight:bold;margin:0 0 7px 0;text-shadow:0 1px 0 white;text-align:center}#auth0-widget .zocial.office365:before{content:\"W\"}#auth0-widget .zocial.office365{background-color:#00aced;color:#fff}#auth0-widget .zocial.waad:before{content:\"z\"}#auth0-widget .zocial.waad{background-color:#00adef;color:#fff}#auth0-widget .zocial.thirtysevensignals:before{content:\"b\"}#auth0-widget .zocial.thirtysevensignals{background-color:#6ac071;color:#fff}#auth0-widget .zocial.box:before{content:\"x\"}#auth0-widget .zocial.box{background-color:#267bb6;color:#fff}#auth0-widget .zocial.salesforce:before{content:\"*\"}#auth0-widget .zocial.salesforce{background-color:#fff;color:#f00}#auth0-widget .zocial.windows{background-color:#2672ec;color:#fff}#auth0-widget .zocial.fitbit:before{content:\"#\"}#auth0-widget .zocial.fitbit{background-color:#45c2c5;color:#fff}#auth0-widget .zocial.yandex:before{content:\"&\"}#auth0-widget .zocial.yandex{background-color:#f00;color:#fff}#auth0-widget .zocial.renren:before{content:\"r\"}#auth0-widget .zocial.renren{background-color:#0056b5;color:#fff}#auth0-widget .zocial.baidu:before{content:\"u\"}#auth0-widget .zocial.baidu{background-color:#2832e1;color:#fff}#auth0-widget .popup .overlay .onestep{width:345px;margin:0 0 0 -172px}@media(max-width:280px){#auth0-widget .popup .overlay .panel{width:240px;margin:0 0 0 -120px}#auth0-widget .signin .popup .panel.strategies .list{margin:12px}#auth0-widget form{margin:12px}#auth0-widget form input{padding:5px}#auth0-widget .popup .panel header{margin:0;padding:0}#auth0-widget .popup .panel header h1{padding:14px 16px;margin:0;font-size:22px}#auth0-widget .popup .panel header a.close{right:14px;top:16px}}@media(min-width:281px) and (max-width:340px){#auth0-widget .popup .overlay .panel{margin:0;left:0;height:100%;width:100%;border-radius:0}#auth0-widget .popup .zocial,#auth0-widget .popup a.zocial{font-size:18px}#auth0-widget .signin .popup .panel.strategies .list{margin:15px}#auth0-widget form{margin:15px 25px}#auth0-widget form input{padding:6px;font-size:18px}#auth0-widget .popup .panel header{margin:0;padding:0;min-height:32px}#auth0-widget .popup .panel header h1{padding:12px 16px;margin-top:1px;font-size:20px}#auth0-widget .popup .panel header img{height:32px;margin:9px 10px 6px 18px}#auth0-widget .zocial.primary{line-height:34px}#auth0-widget .action .spinner{height:34px}#auth0-widget .create-account{margin-top:20px}#auth0-widget .popup .overlay .email{margin-bottom:5px}#auth0-widget .popup .overlay .password,#auth0-widget .popup .overlay .repeatPassword{margin-bottom:5px}}#auth0-widget .loading{display:none;border:0;overflow:hidden;position:fixed;visibility:visible;margin:0;padding:0;left:0;top:0;width:100%;height:100%;z-index:100000;font-weight:200;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;background-color:rgba(255,255,255,0.5)}#auth0-widget .loading .message{position:absolute;top:50%;margin-top:-110px;width:100%;text-align:center;font-size:22px;font-family:Helvetica,arial,freesans,clean,sans-serif;color:#333}#auth0-widget .loading .balls{position:absolute;left:50%;top:50%;margin-left:-45px;margin-top:-45px;width:90px;height:90px}#auth0-widget .loading .balls>div{position:absolute;width:86px;height:86px;opacity:0;-moz-transform:rotate(225deg);-moz-animation:orbit 7.15s infinite;-webkit-transform:rotate(225deg);-webkit-animation:orbit 7.15s infinite;-ms-transform:rotate(225deg);-ms-animation:orbit 7.15s infinite;-o-transform:rotate(225deg);-o-animation:orbit 7.15s infinite;transform:rotate(225deg);animation:orbit 7.15s infinite}#auth0-widget .loading .balls>div>div{position:absolute;width:11px;height:11px;background:#333;left:0;top:0;-moz-border-radius:11px;-webkit-border-radius:11px;-ms-border-radius:11px;-o-border-radius:11px;border-radius:11px}#auth0-widget .loading .balls .ball01{-moz-animation-delay:1.56s;-webkit-animation-delay:1.56s;-ms-animation-delay:1.56s;-o-animation-delay:1.56s;animation-delay:1.56s}#auth0-widget .loading .balls .ball02{-moz-animation-delay:.31s;-webkit-animation-delay:.31s;-ms-animation-delay:.31s;-o-animation-delay:.31s;animation-delay:.31s}#auth0-widget .loading .balls .ball03{-moz-animation-delay:.62s;-webkit-animation-delay:.62s;-ms-animation-delay:.62s;-o-animation-delay:.62s;animation-delay:.62s}#auth0-widget .loading .balls .ball04{-moz-animation-delay:.94s;-webkit-animation-delay:.94s;-ms-animation-delay:.94s;-o-animation-delay:.94s;animation-delay:.94s}#auth0-widget .loading .balls .ball05{-moz-animation-delay:1.25s;-webkit-animation-delay:1.25s;-ms-animation-delay:1.25s;-o-animation-delay:1.25s;animation-delay:1.25s}@-moz-keyframes orbit{0%{opacity:1;z-index:99;-moz-transform:rotate(180deg);-moz-animation-timing-function:ease-out}7%{opacity:1;-moz-transform:rotate(300deg);-moz-animation-timing-function:linear;-moz-origin:0}30%{opacity:1;-moz-transform:rotate(410deg);-moz-animation-timing-function:ease-in-out;-moz-origin:7%}39%{opacity:1;-moz-transform:rotate(645deg);-moz-animation-timing-function:linear;-moz-origin:30%}70%{opacity:1;-moz-transform:rotate(770deg);-moz-animation-timing-function:ease-out;-moz-origin:39%}75%{opacity:1;-moz-transform:rotate(900deg);-moz-animation-timing-function:ease-out;-moz-origin:70%}76%{opacity:0;-moz-transform:rotate(900deg)}100%{opacity:0;-moz-transform:rotate(900deg)}}@-webkit-keyframes orbit{0%{opacity:1;z-index:99;-webkit-transform:rotate(180deg);-webkit-animation-timing-function:ease-out}7%{opacity:1;-webkit-transform:rotate(300deg);-webkit-animation-timing-function:linear;-webkit-origin:0}30%{opacity:1;-webkit-transform:rotate(410deg);-webkit-animation-timing-function:ease-in-out;-webkit-origin:7%}39%{opacity:1;-webkit-transform:rotate(645deg);-webkit-animation-timing-function:linear;-webkit-origin:30%}70%{opacity:1;-webkit-transform:rotate(770deg);-webkit-animation-timing-function:ease-out;-webkit-origin:39%}75%{opacity:1;-webkit-transform:rotate(900deg);-webkit-animation-timing-function:ease-out;-webkit-origin:70%}76%{opacity:0;-webkit-transform:rotate(900deg)}100%{opacity:0;-webkit-transform:rotate(900deg)}}@-ms-keyframes orbit{0%{opacity:1;z-index:99;-ms-transform:rotate(180deg);-ms-animation-timing-function:ease-out}7%{opacity:1;-ms-transform:rotate(300deg);-ms-animation-timing-function:linear;-ms-origin:0}30%{opacity:1;-ms-transform:rotate(410deg);-ms-animation-timing-function:ease-in-out;-ms-origin:7%}39%{opacity:1;-ms-transform:rotate(645deg);-ms-animation-timing-function:linear;-ms-origin:30%}70%{opacity:1;-ms-transform:rotate(770deg);-ms-animation-timing-function:ease-out;-ms-origin:39%}75%{opacity:1;-ms-transform:rotate(900deg);-ms-animation-timing-function:ease-out;-ms-origin:70%}76%{opacity:0;-ms-transform:rotate(900deg)}100%{opacity:0;-ms-transform:rotate(900deg)}}@-o-keyframes orbit{0%{opacity:1;z-index:99;-o-transform:rotate(180deg);-o-animation-timing-function:ease-out}7%{opacity:1;-o-transform:rotate(300deg);-o-animation-timing-function:linear;-o-origin:0}30%{opacity:1;-o-transform:rotate(410deg);-o-animation-timing-function:ease-in-out;-o-origin:7%}39%{opacity:1;-o-transform:rotate(645deg);-o-animation-timing-function:linear;-o-origin:30%}70%{opacity:1;-o-transform:rotate(770deg);-o-animation-timing-function:ease-out;-o-origin:39%}75%{opacity:1;-o-transform:rotate(900deg);-o-animation-timing-function:ease-out;-o-origin:70%}76%{opacity:0;-o-transform:rotate(900deg)}100%{opacity:0;-o-transform:rotate(900deg)}}@keyframes orbit{0%{opacity:1;z-index:99;transform:rotate(180deg);animation-timing-function:ease-out}7%{opacity:1;transform:rotate(300deg);animation-timing-function:linear;origin:0}30%{opacity:1;transform:rotate(410deg);animation-timing-function:ease-in-out;origin:7%}39%{opacity:1;transform:rotate(645deg);animation-timing-function:linear;origin:30%}70%{opacity:1;transform:rotate(770deg);animation-timing-function:ease-out;origin:39%}75%{opacity:1;transform:rotate(900deg);animation-timing-function:ease-out;origin:70%}76%{opacity:0;transform:rotate(900deg)}100%{opacity:0;transform:rotate(900deg)}}#auth0-widget input[disabled]{background-color:#d9dee0}#auth0-widget article,#auth0-widget aside,#auth0-widget details,#auth0-widget figcaption,#auth0-widget figure,#auth0-widget footer,#auth0-widget header,#auth0-widget hgroup,#auth0-widget nav,#auth0-widget section,#auth0-widget summary{display:block}#auth0-widget audio,#auth0-widget canvas,#auth0-widget video{display:inline-block;*display:inline;*zoom:1}#auth0-widget audio:not([controls]){display:none;height:0}#auth0-widget [hidden]{display:none}#auth0-widget html{font-size:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}#auth0-widget html,#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea,#auth0-widget h1,#auth0-widget h2,#auth0-widget span,#auth0-widget a{font-family:sans-serif}#auth0-widget body{margin:0}#auth0-widget a:focus{outline:thin dotted}#auth0-widget a:active,#auth0-widget a:hover{outline:0}#auth0-widget h1{font-size:2em;margin:.67em 0}#auth0-widget h2{font-size:1.5em;margin:.83em 0}#auth0-widget h3{font-size:1.17em;margin:1em 0}#auth0-widget h4{font-size:1em;margin:1.33em 0}#auth0-widget h5{font-size:.83em;margin:1.67em 0}#auth0-widget h6{font-size:.75em;margin:2.33em 0}#auth0-widget abbr[title]{border-bottom:1px dotted}#auth0-widget b,#auth0-widget strong{font-weight:bold}#auth0-widget blockquote{margin:1em 40px}#auth0-widget dfn{font-style:italic}#auth0-widget mark{background:#ff0;color:#000}#auth0-widget p,#auth0-widget pre{margin:1em 0}#auth0-widget code,#auth0-widget kbd,#auth0-widget pre,#auth0-widget samp{font-family:monospace,serif;_font-family:'courier new',monospace;font-size:1em}#auth0-widget pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}#auth0-widget q{quotes:none}#auth0-widget q:before,#auth0-widget q:after{content:'';content:none}#auth0-widget small{font-size:80%}#auth0-widget sub,#auth0-widget sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}#auth0-widget sup{top:-0.5em}#auth0-widget sub{bottom:-0.25em}#auth0-widget dl,#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{margin:1em 0}#auth0-widget dd{margin:0 0 0 40px}#auth0-widget menu,#auth0-widget ol,#auth0-widget ul{padding:0 0 0 40px}#auth0-widget nav ul,#auth0-widget nav ol{list-style:none;list-style-image:none}#auth0-widget img{border:0;-ms-interpolation-mode:bicubic}#auth0-widget svg:not(:root){overflow:hidden}#auth0-widget figure{margin:0}#auth0-widget form{margin:0}#auth0-widget fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}#auth0-widget legend{border:0;padding:0;white-space:normal;*margin-left:-7px}#auth0-widget button,#auth0-widget input,#auth0-widget select,#auth0-widget textarea{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}#auth0-widget button,#auth0-widget input{line-height:normal}#auth0-widget button,#auth0-widget html input[type=\"button\"],#auth0-widget input[type=\"reset\"],#auth0-widget input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer;*overflow:visible}#auth0-widget button[disabled],#auth0-widget input[disabled]{cursor:default}#auth0-widget input[type=\"checkbox\"],#auth0-widget input[type=\"radio\"]{box-sizing:border-box;padding:0;*height:13px;*width:13px}#auth0-widget input[type=\"search\"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}#auth0-widget input[type=\"search\"]::-webkit-search-cancel-button,#auth0-widget input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}#auth0-widget button::-moz-focus-inner,#auth0-widget input::-moz-focus-inner{border:0;padding:0}#auth0-widget textarea{overflow:auto;vertical-align:top}#auth0-widget table{border-collapse:collapse;border-spacing:0}");

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
 buf.push('<div id="auth0-widget" class="cleanslate">\n	<div class="mode signin">\n	    <div class="popup">\n	      	<div class="overlay">\n	        	<div id="onestep" class="panel onestep">\n	          		<header class="header">\n	            		<div class="image" style="display: none">\n	            			<img src="">\n	            		</div>\n	            		<h1>Sign In</h1>\n			            <h2 class="error" style="display: none">&nbsp;</h2>\n			            <h2 class="success" style="display: none">&nbsp;</h2>\n			            <a class="close">Close</a>\n	          		</header>\n\n	          		<div class="loggedin">\n			            <form>\n							<span class="centered last-time"></span>\n							<div class="strategy"></div>\n							<div class="emailPassword" style="display:none">\n								<div class="email">\n									<span class="email-readonly"></span>\n									<input name="email" type="email" value="" disabled placeholder="Email" title="Email" style="display:none">\n								</div>\n								<div class="password">\n									<input name="password" type="password" value="" autofocus placeholder="Password" title="Password">\n								</div>\n								<div class="action">\n									<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n								  	<button type="submit" class="spinner" style="display: none"></button>\n								  	<label class="create-account"><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n								</div>\n							</div>\n							<span class="centered all">Show all</span>\n			            </form>\n	          		</div>\n\n		          	<div class="notloggedin">\n			            <form>\n			            	<div class="iconlist" style="display: none"><p style="display:none">... or sign in using</p></div>\n			              	<div class="separator" style="display: none"><span>or</span></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signin_easy_email" type="email" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password" style="display:none">\n			                  		<input name="password" id="signin_easy_password" type="password" placeholder="Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<label class="create-account"><a href="javascript: {}" class="sign-up">Sign Up</a><span class="divider" style="display:none">&nbsp;•&nbsp;</span><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n		          	<div class="signup">\n			            <form>\n			              	<div class="header"></div>\n			              	<div class="emailPassword">\n			                	<div class="email">\n			                  		<input name="email" id="signup_easy_email" type="email" value="" required placeholder="Email" title="Email">\n			                	</div>\n			                	<div class="password">\n			                  		<input name="password" id="signup_easy_password" type="password" value="" required placeholder="Create a Password" title="Password">\n			                	</div>\n				                <div class="action">\n				                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign Up</button>\n				                  	<button type="submit" class="spinner" style="display: none"></button>\n				                  	<div class="footer"></div>\n				                  	<div class="options">\n				                    	<a href="javascript: {}" class="centered cancel">Cancel</a>\n				                  	</div>\n				                </div>\n			              	</div>\n			            </form>\n		          	</div>\n\n					<div class="reset">\n						<form id="change_password">\n						  	<div class="header"></div>\n						  	<div class="emailPassword">\n						    	<div class="email">\n						      		<input name="email" id="reset_easy_email" type="email" value="" required placeholder="Email" title="Email">\n						    	</div>\n						    	<div class="password">\n						      		<input name="password" id="reset_easy_password" type="password" value="" required placeholder="New Password" title="New Password">\n						    	</div>\n						    	<div class="repeatPassword">\n						      		<input name="repeat_password" id="reset_easy_repeat_password" type="password" value="" required placeholder="Confirm New Password" title="Confirm New Password">\n						    	</div>\n						    	<div class="action">\n						      		<button type="submit" class="zocial primary next" style="width: 100%;">Send</button>\n						      		<button type="submit" class="spinner" style="display: none"></button>\n						      		<div class="options">\n						        		<a href="javascript: {}" class="centered cancel">Cancel</a>\n						      		</div>\n						    	</div>\n						  	</div>\n						</form>\n					</div>\n					\n	          		<footer>\n	            		<span>Powered by <a href="http://auth0.com" target="_new">Auth0</a></span>\n	          		</footer>\n	        	</div>\n	      	</div>\n	    </div>\n	</div>\n</div>\n'); })();
} 
return buf.join('');
}; return function(l) { return t(l) }}())
},{}],25:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var bean      = require('bean');
var xtend     = require('xtend');

var loginTmpl = require('./html/login.html');

var $ = function (selector, root) {
  return bonzo(qwery(selector, root));
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
  $('.signin h1').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin .error').html(error).css('display', '');
};

Auth0Widget.prototype._showSuccess = function (message) {
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

Auth0Widget.prototype._parseResponseMessage = function (responseText, defaultValue) {
  try {
    var msjObj = JSON.parse(responseText);
    return this._signInOptions[msjObj.code] || msjObj.description || defaultValue;
  }
  catch (e) {
    return defaultValue || responseText;
  }
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
    $('html').removeClass('mode-signin');
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

Auth0Widget.prototype._setLoginView = function(options) {
  this._hasLoggedInBefore = options.isReturningUser;
  this._setTitle(this._signinOptions['title']);

  $('.loggedin').css('display', 'none');
  $('.notloggedin').css('display', 'none');
  $('.signup').css('display', 'none');
  $('.reset').css('display', 'none');

  $('.loggedin').css('display', options.isReturningUser ? '' : 'none');
  $('.notloggedin').css('display', options.isReturningUser ? 'none' : '');

  this._setTop(this._signinOptions.top, $('.signin div.panel.onestep'));
  $('.notloggedin .email input').first().focus();
};

Auth0Widget.prototype._showLoggedInExperience = function() {
  var self = this;
  var strategy = this._ssoData.lastUsedConnection.strategy;
  this._setLoginView({ isReturningUser: !!strategy });

  if (!strategy) return;

  var loginView = this._getActiveLoginView();
  bean.on($('form', loginView)[0], 'submit', this._signInEnterprise);
  
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
    self._setLoginView({ isReturningUser: false });
  });

  if (this._ssoData.lastUsedUsername) {
    if (strategy === 'auth0') {
      $('.email-readonly', loginView).html(this._ssoData.lastUsedUsername); 
      $('.email input', loginView).css('display', 'none');
      $('.emailPassword', loginView).css('display', '');
    } 
    else if (this._isEnterpriseStrategy(strategy)) {
      button.html(_ssoData.lastUsedUsername || this._strategies[strategy].name)
            .attr('title', _ssoData.lastUsedUsername || this._strategies[strategy].name);
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
      domain, url, email = null, strategy;

  for (var s in this._client.strategies) {
    strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name)) continue;

    for (var c in strategy.connections) {
      if(!emailP && emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        domain = strategy.connections[c].domain;
        url = strategy.connections[c].url;
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

    this._showError(this._signinOptions['strategyDomainInvalid'], { domain: emailM && emailM.slice(-2)[0] });
  }

  valid &= (!domain && !emailD.addClass('invalid')) || (!!domain && !!emailD.removeClass('invalid'));

  if (valid) {
    this._redirect(url);
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

// initialize
Auth0Widget.prototype._initialize = function () {
  // TODO: support css option for non free subscriptions

  var self = this;
  bean.on($('.popup .panel.onestep a.close')[0], 'click', this._hideSignIn);
  bean.on($('.popup .panel.onestep .notloggedin form')[0], 'submit', function (e) { self._signInEnterprise(e); });
  bean.on($('html')[0], 'keyup', function (e) {
    if ($('html').hasClass('mode-signin')) {
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
  $('html').addClass('mode-signin');

  // if no social connections and one enterprise connection only, redirect
  if (!this._areThereAnySocialConn() && 
    this._client.strategies.length === 1 &&
    this._client.strategies[0].name !== 'auth0' &&
    this._client.strategies[0].connections.length === 1) {
    
    this._redirect(this._client.strategies[0].connections[0].url);
  }

  // labels text
  var options = this._signinOptions || {};
  options['onestep'] = typeof options['onestep'] !== 'undefined' ? options['onestep'] : false;
  options['top'] = options['top'] || false;
  options['title'] = options['title'] || 'Sign In';
  options['strategyButtonTemplate'] = options['strategyButtonTemplate'] || "{name}";
  options['allButtonTemplate'] = options['allButtonTemplate'] || "Show all";
  options['strategyBack'] = options['strategyBack'] || "Back";
  options['strategyEmailLabel'] = options['strategyEmailLabel'] || "Email:";
  options['strategyEmailEmpty'] = options['strategyEmailEmpty'] || "The email is empty.";
  options['strategyEmailInvalid'] = options['strategyEmailInvalid'] || "The email is invalid.";

  options['icon'] = options['icon'] || "https://s3.amazonaws.com/assets.auth0.com/w2/img/logo-32.png";
  options['showIcon'] = typeof options['showIcon'] !== 'undefined' ? options['showIcon'] : false;
  options['showSignup'] = typeof options['showSignup'] !== 'undefined' ? options['showSignup'] : true;
  options['showForgot'] = typeof options['showForgot'] !== 'undefined' ? options['showForgot'] : true;
  options['signupText'] = options['signupText'] || 'Sign Up';
  options['forgotText'] = options['forgotText'] || 'Forgot your password?';
  options['useAppSignInCallback'] = typeof options['useAppSignInCallback'] !== 'undefined' ? options['useAppSignInCallback'] : false;
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

  // theme
  if (options.theme) {
    $('html').addClass('theme-' + options.theme);
  }

  $('.panel a.close').css('display', options.standalone ? 'none' : 'block');

  // show icon
  if (options.showIcon) {
    $('.panel .image img').attr('src', options.icon);
    $('.panel .image').css('display', options.showIcon ? 'block' : 'none');
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
  $('div.panel.onestep').addClass('active');

  if (this._ssoData.sso && this._ssoData.lastUsedUsername) {
    $('div.panel.onestep input').val(this._ssoData.lastUsedUsername);
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
      domain: conns[conn].domain
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
      
      // widget container
      var div = document.createElement('div');
      div.innerHTML = loginTmpl({});
      document.body.appendChild(div);
      
      self._initialize();
    });
  });
};

module.exports = Auth0Widget;

},{"./html/login.html":24,"auth0-js":2,"bean":13,"bonzo":14,"qwery":17,"xtend":19}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvTG9naW5FcnJvci5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvYXNzZXJ0X3JlcXVpcmVkLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvanNvbl9wYXJzZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvdXNlX2pzb25wLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9CYXNlNjQvYmFzZTY0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9qc29ucC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvanNvbnAvbm9kZV9tb2R1bGVzL2RlYnVnL2RlYnVnLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9xcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2JlYW4vYmVhbi5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9ib256by9ib256by5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9xd2VyeS9xd2VyeS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9oYXMta2V5cy5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvZm9yZWFjaC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy94dGVuZC9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvaW5kZXguanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMveHRlbmQvbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2lzQXJndW1lbnRzLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL3h0ZW5kL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9zaGltLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvd2lkZ2V0L2h0bWwvbG9naW4uaHRtbCIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL3dpZGdldC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdsb2JhbD10eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge307dmFyIGZzICAgICAgICAgID0gcmVxdWlyZSgnZnMnKTtcbnZhciBpbnNlcnRDc3MgICA9IHJlcXVpcmUoJ2luc2VydC1jc3MnKTtcblxudmFyIEF1dGgwV2lkZ2V0ID0gcmVxdWlyZSgnLi93aWRnZXQnKTtcblxuaW5zZXJ0Q3NzKFwiQGNoYXJzZXQgXFxcIlVURi04XFxcIjsjYXV0aDAtd2lkZ2V0ey8qIVxcbiogQ2xlYW5TbGF0ZVxcbiogICBnaXRodWIuY29tL3ByZW1hc2FnYXIvY2xlYW5zbGF0ZVxcbipcXG4qLy8qIVxcblxcdFpvY2lhbCBCdXRvbnNcXG5cXHRodHRwOi8vem9jaWFsLnNtY2xsbnMuY29tXFxuXFx0YnkgU2FtIENvbGxpbnMgKEBzbWNsbG5zKVxcblxcdExpY2Vuc2U6IGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcXG5cXHRcXG5cXHRZb3UgYXJlIGZyZWUgdG8gdXNlIGFuZCBtb2RpZnksIGFzIGxvbmcgYXMgeW91IGtlZXAgdGhpcyBsaWNlbnNlIGNvbW1lbnQgaW50YWN0IG9yIGxpbmsgYmFjayB0byB6b2NpYWwuc21jbGxucy5jb20gb24geW91ciBzaXRlLlxcbiovLyohIG5vcm1hbGl6ZS5jc3MgdjEuMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXQuaW8vbm9ybWFsaXplICovfSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoNCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg1LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGZvcm0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3QsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvcHRpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBwcmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkaXYsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0YWJsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRoLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGJvZHksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0Zm9vdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNhcHRpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aGVhZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGksI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhZGRyZXNzLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmllbGRzZXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsaSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlmcmFtZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cm9uZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxlZ2VuZCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGVtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNpdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzcGFuLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBsYWJlbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRmbiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9iamVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJpZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb250LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2FtcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFjcm9ueW0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzbWFsbCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGltZywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHN0cmlrZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNvZGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzdWIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnMsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZXh0YXJlYSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHZhciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhYmJyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXBwbGV0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUga2JkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdHQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBiLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGhyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXJ0aWNsZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFzaWRlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGlhbG9nLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZmlndXJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZm9vdGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGVhZGVyLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaGdyb3VwLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG5hdiwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlY3Rpb24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0aW1lLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWFyaywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGF1ZGlvLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdmlkZW97YmFja2dyb3VuZC1hdHRhY2htZW50OnNjcm9sbCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1pbWFnZTpub25lIWltcG9ydGFudDtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMCFpbXBvcnRhbnQ7YmFja2dyb3VuZC1yZXBlYXQ6cmVwZWF0IWltcG9ydGFudDtib3JkZXItY29sb3I6YmxhY2shaW1wb3J0YW50O2JvcmRlci1jb2xvcjpjdXJyZW50Q29sb3IhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7Ym9yZGVyLXN0eWxlOm5vbmUhaW1wb3J0YW50O2JvcmRlci13aWR0aDptZWRpdW0haW1wb3J0YW50O2JvdHRvbTphdXRvIWltcG9ydGFudDtjbGVhcjpub25lIWltcG9ydGFudDtjbGlwOmF1dG8haW1wb3J0YW50O2NvbG9yOmluaGVyaXQhaW1wb3J0YW50O2NvdW50ZXItaW5jcmVtZW50Om5vbmUhaW1wb3J0YW50O2NvdW50ZXItcmVzZXQ6bm9uZSFpbXBvcnRhbnQ7Y3Vyc29yOmF1dG8haW1wb3J0YW50O2RpcmVjdGlvbjppbmhlcml0IWltcG9ydGFudDtkaXNwbGF5OmlubGluZSFpbXBvcnRhbnQ7ZmxvYXQ6bm9uZSFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6aW5oZXJpdCFpbXBvcnRhbnQ7Zm9udC1zaXplOmluaGVyaXQhaW1wb3J0YW50O2ZvbnQtc3R5bGU6aW5oZXJpdCFpbXBvcnRhbnQ7Zm9udC12YXJpYW50Om5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6aW5oZXJpdCFpbXBvcnRhbnQ7aGVpZ2h0OmF1dG8haW1wb3J0YW50O2xlZnQ6YXV0byFpbXBvcnRhbnQ7bGV0dGVyLXNwYWNpbmc6bm9ybWFsIWltcG9ydGFudDtsaW5lLWhlaWdodDppbmhlcml0IWltcG9ydGFudDtsaXN0LXN0eWxlLXR5cGU6aW5oZXJpdCFpbXBvcnRhbnQ7bGlzdC1zdHlsZS1wb3NpdGlvbjpvdXRzaWRlIWltcG9ydGFudDtsaXN0LXN0eWxlLWltYWdlOm5vbmUhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUhaW1wb3J0YW50O21heC13aWR0aDpub25lIWltcG9ydGFudDttaW4taGVpZ2h0OjAhaW1wb3J0YW50O21pbi13aWR0aDowIWltcG9ydGFudDtvcGFjaXR5OjE7b3V0bGluZTppbnZlcnQgbm9uZSBtZWRpdW0haW1wb3J0YW50O292ZXJmbG93OnZpc2libGUhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnQ7cG9zaXRpb246c3RhdGljIWltcG9ydGFudDtxdW90ZXM6XFxcIlxcXCIgXFxcIlxcXCIhaW1wb3J0YW50O3JpZ2h0OmF1dG8haW1wb3J0YW50O3RhYmxlLWxheW91dDphdXRvIWltcG9ydGFudDt0ZXh0LWFsaWduOmluaGVyaXQhaW1wb3J0YW50O3RleHQtZGVjb3JhdGlvbjppbmhlcml0IWltcG9ydGFudDt0ZXh0LWluZGVudDowIWltcG9ydGFudDt0ZXh0LXRyYW5zZm9ybTpub25lIWltcG9ydGFudDt0b3A6YXV0byFpbXBvcnRhbnQ7dW5pY29kZS1iaWRpOm5vcm1hbCFpbXBvcnRhbnQ7dmVydGljYWwtYWxpZ246YmFzZWxpbmUhaW1wb3J0YW50O3Zpc2liaWxpdHk6aW5oZXJpdCFpbXBvcnRhbnQ7d2hpdGUtc3BhY2U6bm9ybWFsIWltcG9ydGFudDt3aWR0aDphdXRvIWltcG9ydGFudDt3b3JkLXNwYWNpbmc6bm9ybWFsIWltcG9ydGFudDt6LWluZGV4OmF1dG8haW1wb3J0YW50Oy1tb3otYm9yZGVyLXJhZGl1czowIWltcG9ydGFudDstd2Via2l0LWJvcmRlci1yYWRpdXM6MCFpbXBvcnRhbnQ7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94IWltcG9ydGFudDstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3ghaW1wb3J0YW50O2JveC1zaXppbmc6Y29udGVudC1ib3ghaW1wb3J0YW50O3RleHQtc2hhZG93Om5vbmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoMywjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg1LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGgxLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGg2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb3JtLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb3B0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcHJlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGl2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBjYXB0aW9uLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaDQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFkZHJlc3MsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBibG9ja3F1b3RlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmaWVsZHNldCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRleHRhcmVhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaHIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhcnRpY2xlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYXNpZGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBkaWFsb2csI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmaWd1cmUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBmb290ZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoZWFkZXIsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBoZ3JvdXAsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VjdGlvbntkaXNwbGF5OmJsb2NrIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRhYmxle2Rpc3BsYXk6dGFibGUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGhlYWR7ZGlzcGxheTp0YWJsZS1oZWFkZXItZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGJvZHl7ZGlzcGxheTp0YWJsZS1yb3ctZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGZvb3R7ZGlzcGxheTp0YWJsZS1mb290ZXItZ3JvdXAhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdHJ7ZGlzcGxheTp0YWJsZS1yb3chaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdGgsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB0ZHtkaXNwbGF5OnRhYmxlLWNlbGwhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbmF2IG9se2xpc3Qtc3R5bGUtdHlwZTpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudXtsaXN0LXN0eWxlLXR5cGU6ZGlzYyFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbHtsaXN0LXN0eWxlLXR5cGU6ZGVjaW1hbCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSBtZW51e2xpc3Qtc3R5bGUtdHlwZTpjaXJjbGUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgb2wgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBvbCBvbCBtZW51LCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgb2wgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG9sIG1lbnUgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgdWwgdWwsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51IHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgdWwgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHVsIHVsIG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSB1bCBtZW51IG1lbnUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtZW51IG9sIHVsLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbWVudSB1bCB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudSB1bCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgb2wgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgdWwgbWVudSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIG1lbnUgbWVudSBtZW51e2xpc3Qtc3R5bGUtdHlwZTpzcXVhcmUhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgbGl7ZGlzcGxheTpsaXN0LWl0ZW0haW1wb3J0YW50O21pbi1oZWlnaHQ6YXV0byFpbXBvcnRhbnQ7bWluLXdpZHRoOmF1dG8haW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc3Ryb25ne2ZvbnQtd2VpZ2h0OmJvbGQhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZW17Zm9udC1zdHlsZTppdGFsaWMhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUga2JkLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2FtcCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGNvZGV7Zm9udC1mYW1pbHk6bW9ub3NwYWNlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGEsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhICosI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXN1Ym1pdF0sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXJhZGlvXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGlucHV0W3R5cGU9Y2hlY2tib3hdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgc2VsZWN0e2N1cnNvcjpwb2ludGVyIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBidXR0b24sI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBpbnB1dFt0eXBlPXN1Ym1pdF17dGV4dC1hbGlnbjpjZW50ZXIhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXRbdHlwZT1oaWRkZW5de2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBhYmJyW3RpdGxlXSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGFjcm9ueW1bdGl0bGVdLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgZGZuW3RpdGxlXXtjdXJzb3I6aGVscCFpbXBvcnRhbnQ7Ym9yZGVyLWJvdHRvbS13aWR0aDoxcHghaW1wb3J0YW50O2JvcmRlci1ib3R0b20tc3R5bGU6ZG90dGVkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGluc3tiYWNrZ3JvdW5kLWNvbG9yOiNmZjkhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGRlbHt0ZXh0LWRlY29yYXRpb246bGluZS10aHJvdWdoIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGUsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBxe3F1b3Rlczpub25lIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGJsb2NrcXVvdGU6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgYmxvY2txdW90ZTphZnRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHE6YmVmb3JlLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgcTphZnRlciwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpOmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIGxpOmFmdGVye2NvbnRlbnQ6XFxcIlxcXCIhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXQsI2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBzZWxlY3R7dmVydGljYWwtYWxpZ246bWlkZGxlIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHNlbGVjdCwjYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRleHRhcmVhLCNhdXRoMC13aWRnZXQgLmNsZWFuc2xhdGUgaW5wdXR7Ym9yZGVyOjFweCBzb2xpZCAjY2NjIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlIHRhYmxle2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZSFpbXBvcnRhbnQ7Ym9yZGVyLXNwYWNpbmc6MCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBocntkaXNwbGF5OmJsb2NrIWltcG9ydGFudDtoZWlnaHQ6MXB4IWltcG9ydGFudDtib3JkZXI6MCFpbXBvcnRhbnQ7Ym9yZGVyLXRvcDoxcHggc29saWQgI2NjYyFpbXBvcnRhbnQ7bWFyZ2luOjFlbSAwIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRlICpbZGlyPXJ0bF17ZGlyZWN0aW9uOnJ0bCFpbXBvcnRhbnR9I2F1dGgwLXdpZGdldCAuY2xlYW5zbGF0ZSBtYXJre2JhY2tncm91bmQtY29sb3I6I2ZmOSFpbXBvcnRhbnQ7Y29sb3I6YmxhY2shaW1wb3J0YW50O2ZvbnQtc3R5bGU6aXRhbGljIWltcG9ydGFudDtmb250LXdlaWdodDpib2xkIWltcG9ydGFudH0jYXV0aDAtd2lkZ2V0IC5jbGVhbnNsYXRle2ZvbnQtc2l6ZTptZWRpdW0haW1wb3J0YW50O2xpbmUtaGVpZ2h0OjEhaW1wb3J0YW50O2RpcmVjdGlvbjpsdHIhaW1wb3J0YW50O3RleHQtYWxpZ246bGVmdCFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6XFxcIlRpbWVzIE5ldyBSb21hblxcXCIsVGltZXMsc2VyaWYhaW1wb3J0YW50O2NvbG9yOmJsYWNrIWltcG9ydGFudDtmb250LXN0eWxlOm5vcm1hbCFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6bm9ybWFsIWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246bm9uZSFpbXBvcnRhbnQ7bGlzdC1zdHlsZS10eXBlOmRpc2MhaW1wb3J0YW50fSNhdXRoMC13aWRnZXQgLnpvY2lhbCwjYXV0aDAtd2lkZ2V0IGEuem9jaWFse2JvcmRlcjoxcHggc29saWQgIzc3Nztib3JkZXItY29sb3I6cmdiYSgwLDAsMCwwLjIpO2JvcmRlci1ib3R0b20tY29sb3I6IzMzMztib3JkZXItYm90dG9tLWNvbG9yOnJnYmEoMCwwLDAsMC40KTtjb2xvcjojZmZmOy1tb3otYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC40KSxpbnNldCAwIDAgLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7Ym94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OmJvbGQgMTAwJS8yLjEgXFxcIkx1Y2lkYSBHcmFuZGVcXFwiLFRhaG9tYSxzYW5zLXNlcmlmO3BhZGRpbmc6MCAuOTVlbSAwIDA7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDAsMCwwLDAuNSk7d2hpdGUtc3BhY2U6bm93cmFwOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtwb3NpdGlvbjpyZWxhdGl2ZTstbW96LWJvcmRlci1yYWRpdXM6LjNlbTstd2Via2l0LWJvcmRlci1yYWRpdXM6LjNlbTtib3JkZXItcmFkaXVzOi4zZW19I2F1dGgwLXdpZGdldCAuem9jaWFsOmJlZm9yZXtjb250ZW50OlxcXCJcXFwiO2JvcmRlci1yaWdodDouMDc1ZW0gc29saWQgcmdiYSgwLDAsMCwwLjEpO2Zsb2F0OmxlZnQ7Zm9udDoxMjAlLzEuNjUgem9jaWFsO2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDttYXJnaW46MCAuNWVtIDAgMDtwYWRkaW5nOjAgLjVlbTt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LXRyYW5zZm9ybTpub25lOy1tb3otYm94LXNoYWRvdzouMDc1ZW0gMCAwIHJnYmEoMjU1LDI1NSwyNTUsMC4yNSk7LXdlYmtpdC1ib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTtib3gtc2hhZG93Oi4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTstbW96LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkOy13ZWJraXQtZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWQ7Zm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWR9I2F1dGgwLXdpZGdldCAuem9jaWFsOmFjdGl2ZXtvdXRsaW5lOjB9I2F1dGgwLXdpZGdldCAuem9jaWFsLmljb257b3ZlcmZsb3c6aGlkZGVuO21heC13aWR0aDoyLjRlbTtwYWRkaW5nLWxlZnQ6MDtwYWRkaW5nLXJpZ2h0OjA7bWF4LWhlaWdodDoyLjE1ZW07d2hpdGUtc3BhY2U6bm93cmFwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pY29uOmJlZm9yZXtwYWRkaW5nOjA7d2lkdGg6MmVtO2hlaWdodDoyZW07Ym94LXNoYWRvdzpub25lO2JvcmRlcjowfSNhdXRoMC13aWRnZXQgLnpvY2lhbHtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwLjA1KSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjEpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpKSxjb2xvci1zdG9wKDUxJSxyZ2JhKDAsMCwwLDAuMDUpKSx0byhyZ2JhKDAsMCwwLDAuMSkpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWw6Zm9jdXN7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkgNDklLHJnYmEoMCwwLDAsMC4xKSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkpLGNvbG9yLXN0b3AoNDklLHJnYmEoMjU1LDI1NSwyNTUsMC4xNSkpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4xKSksdG8ocmdiYSgwLDAsMCwwLjE1KSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwwLjE1KSA0OSUscmdiYSgwLDAsMCwwLjEpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIDQ5JSxyZ2JhKDAsMCwwLDAuMSkgNTElLHJnYmEoMCwwLDAsMC4xNSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbDphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDAuMSkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsdHJhbnNwYXJlbnQgNTAlLHJnYmEoMCwwLDAsMC4xKSk7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxmcm9tKHJnYmEoMjU1LDI1NSwyNTUsMC4xKSksY29sb3Itc3RvcCgzMCUscmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCg1MCUsdHJhbnNwYXJlbnQpLHRvKHJnYmEoMCwwLDAsMC4xKSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMC4xKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSx0cmFuc3BhcmVudCA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwLjEpLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHRyYW5zcGFyZW50IDUwJSxyZ2JhKDAsMCwwLDAuMSkpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWIsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc3RhY2tvdmVyZmxvdywjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtib3JkZXI6MXB4IHNvbGlkICNhYWE7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4zKTtib3JkZXItYm90dG9tLWNvbG9yOiM3Nzc7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNSk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksaW5zZXQgMCAwIC4wOGVtIHJnYmEoMjU1LDI1NSwyNTUsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO2JveC1zaGFkb3c6aW5zZXQgMCAuMDhlbSAwIHJnYmEoMjU1LDI1NSwyNTUsMC43KSxpbnNldCAwIDAgLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5kcm9wYm94OmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdpdGh1Yjpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ21haWw6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5vcGVuaWQ6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDpob3ZlciwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmZvY3VzLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6Zm9jdXMsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6aG92ZXIsI2F1dGgwLXdpZGdldCAuem9jaWFsLnR3aXR0ZXI6Zm9jdXMgLnpvY2lhbC50d2l0dGVyOmhvdmVyLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmZvY3VzIC56b2NpYWwuc2FsZXNmb3JjZTpob3ZlcntiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjUpKSxjb2xvci1zdG9wKDQ5JSxyZ2JhKDI1NSwyNTUsMjU1LDAuMikpLGNvbG9yLXN0b3AoNTElLHJnYmEoMCwwLDAsMC4wNSkpLHRvKHJnYmEoMCwwLDAsMC4xNSkpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSk7YmFja2dyb3VuZC1pbWFnZTotbXMtbGluZWFyLWdyYWRpZW50KHRvcCxyZ2JhKDI1NSwyNTUsMjU1LDAuNSkscmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQ5JSxyZ2JhKDAsMCwwLDAuMDUpIDUxJSxyZ2JhKDAsMCwwLDAuMTUpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0b3AscmdiYSgyNTUsMjU1LDI1NSwwLjUpLHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUscmdiYSgwLDAsMCwwLjA1KSA1MSUscmdiYSgwLDAsMCwwLjE1KSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5naXRodWI6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZDphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeTphY3RpdmUsI2F1dGgwLXdpZGdldCAuem9jaWFsLnN0YWNrb3ZlcmZsb3c6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC53aWtpcGVkaWE6YWN0aXZlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmFjdGl2ZXtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCgzMCUscmdiYSgyNTUsMjU1LDI1NSwwKSksY29sb3Itc3RvcCg1MCUscmdiYSgwLDAsMCwwKSksdG8ocmdiYSgwLDAsMCwwLjEpKSk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLHJnYmEoMjU1LDI1NSwyNTUsMCkscmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChib3R0b20scmdiYSgyNTUsMjU1LDI1NSwwKSxyZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSxyZ2JhKDAsMCwwLDApIDUwJSxyZ2JhKDAsMCwwLDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KGJvdHRvbSxyZ2JhKDI1NSwyNTUsMjU1LDApLHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLHJnYmEoMCwwLDAsMCkgNTAlLHJnYmEoMCwwLDAsMC4xKSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmFtYXpvbjpiZWZvcmV7Y29udGVudDpcXFwiYVxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3g6YmVmb3Jle2NvbnRlbnQ6XFxcImRcXFwiO2NvbG9yOiMxZjc1Y2N9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZhY2Vib29rOmJlZm9yZXtjb250ZW50OlxcXCJmXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHViOmJlZm9yZXtjb250ZW50OlxcXCJcXFxcMDBFOFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmdtYWlsOmJlZm9yZXtjb250ZW50OlxcXCJtXFxcIjtjb2xvcjojZjAwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGU6YmVmb3Jle2NvbnRlbnQ6XFxcIkdcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nb29nbGVwbHVzOmJlZm9yZXtjb250ZW50OlxcXCIrXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ3Vlc3Q6YmVmb3Jle2NvbnRlbnQ6XFxcIj9cXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5pZTpiZWZvcmV7Y29udGVudDpcXFwiNlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmxpbmtlZGluOmJlZm9yZXtjb250ZW50OlxcXCJMXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub3BlbmlkOmJlZm9yZXtjb250ZW50OlxcXCJvXFxcIjtjb2xvcjojZmY5MjFkfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wYXlwYWw6YmVmb3Jle2NvbnRlbnQ6XFxcIiRcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zdGFja292ZXJmbG93OmJlZm9yZXtjb250ZW50OlxcXCJcXFxcMDBFQ1xcXCI7Y29sb3I6I2ZmN2ExNX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudHdpdHRlcjpiZWZvcmV7Y29udGVudDpcXFwiVFxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnZrOmJlZm9yZXtjb250ZW50OlxcXCJOXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93czpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnlhaG9vOmJlZm9yZXtjb250ZW50OlxcXCJZXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwub2ZmaWNlMzY1OmJlZm9yZXtjb250ZW50OlxcXCJ6XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudGhpcnR5c2V2ZW5zaWduYWxzOmJlZm9yZXtjb250ZW50OlxcXCJiXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZTpiZWZvcmV7Y29udGVudDpcXFwiKlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWQ6YmVmb3Jle2NvbnRlbnQ6XFxcInpcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ib3g6YmVmb3Jle2NvbnRlbnQ6XFxcInhcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hbWF6b257YmFja2dyb3VuZC1jb2xvcjojZmZhZDFkO2NvbG9yOiMwMzAwMzc7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuNSl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmRyb3Bib3h7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiMzMTJjMmF9I2F1dGgwLXdpZGdldCAuem9jaWFsLmZhY2Vib29re2JhY2tncm91bmQtY29sb3I6IzQ4NjNhZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ2l0aHVie2JhY2tncm91bmQtY29sb3I6I2ZiZmJmYjtjb2xvcjojMDUwNTA1fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5nbWFpbHtiYWNrZ3JvdW5kLWNvbG9yOiNlZmVmZWY7Y29sb3I6IzIyMn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xle2JhY2tncm91bmQtY29sb3I6IzRlNmNmN30jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZ29vZ2xlcGx1c3tiYWNrZ3JvdW5kLWNvbG9yOiNkZDRiMzl9I2F1dGgwLXdpZGdldCAuem9jaWFsLmd1ZXN0e2JhY2tncm91bmQtY29sb3I6IzFiNGQ2ZH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuaWV7YmFja2dyb3VuZC1jb2xvcjojMDBhMWQ5fSNhdXRoMC13aWRnZXQgLnpvY2lhbC5saW5rZWRpbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDgzYTh9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9wZW5pZHtiYWNrZ3JvdW5kLWNvbG9yOiNmNWY1ZjU7Y29sb3I6IzMzM30jYXV0aDAtd2lkZ2V0IC56b2NpYWwucGF5cGFse2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojMzI2ODlhO3RleHQtc2hhZG93OjAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjUpfSNhdXRoMC13aWRnZXQgLnpvY2lhbC50d2l0dGVye2JhY2tncm91bmQtY29sb3I6IzQ2YzBmYn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwudmt7YmFja2dyb3VuZC1jb2xvcjojNDU2ODhlfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dze2JhY2tncm91bmQtY29sb3I6IzAwNTJhNDtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5vZmZpY2UzNjV7YmFja2dyb3VuZC1jb2xvcjojMDBhY2VkO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNle2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojZjAwfSNhdXRoMC13aWRnZXQgLnpvY2lhbC53aW5kb3dze2JhY2tncm91bmQtY29sb3I6IzI2NzJlYztjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5LCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7bWFyZ2luOi4xZW0gMDtwYWRkaW5nOjAgMWVtfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5wcmltYXJ5OmJlZm9yZSwjYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2Vjb25kYXJ5OmJlZm9yZXtkaXNwbGF5Om5vbmV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnl7YmFja2dyb3VuZC1jb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjojZjBmMGViO2NvbG9yOiMyMjI7dGV4dC1zaGFkb3c6MCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuOCl9I2F1dGgwLXdpZGdldCBidXR0b246LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MDtwYWRkaW5nOjB9QGZvbnQtZmFjZXtmb250LWZhbWlseTonem9jaWFsJztzcmM6dXJsKCdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9mb250L3pvY2lhbC1yZWd1bGFyLXdlYmZvbnQuZW90Jyl9QGZvbnQtZmFjZXtmb250LWZhbWlseTonem9jaWFsJztzcmM6dXJsKGRhdGE6YXBwbGljYXRpb24vZm9udC13b2ZmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGQwOUdSZ0FCQUFBQUFCZVFBQTBBQUFBQUlHZ0FBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCR1JsUk5BQUFCTUFBQUFCb0FBQUFjWm51QXlrZEVSVVlBQUFGTUFBQUFId0FBQUNBQVRnQUdUMU12TWdBQUFXd0FBQUJJQUFBQVZrL2wzRUJqYldGd0FBQUJ0QUFBQVBZQUFBSUtubDU2N0dkaGMzQUFBQUtzQUFBQUNBQUFBQWovL3dBRFoyeDVaZ0FBQXJRQUFCS0xBQUFac0FNcEpyQm9aV0ZrQUFBVlFBQUFBREFBQUFBMi8zSlNXV2hvWldFQUFCVndBQUFBSUFBQUFDUUZmUUg1YUcxMGVBQUFGWkFBQUFCakFBQUFnRHRPQWJkc2IyTmhBQUFWOUFBQUFFUUFBQUJFV1paZitHMWhlSEFBQUJZNEFBQUFIZ0FBQUNBQWNBQytibUZ0WlFBQUZsZ0FBQURlQUFBQmhsYkQ5L0p3YjNOMEFBQVhPQUFBQUZZQUFBQnNVZW1oaEhpY1kyQmdZR1FBZ3BPZCtZWWcrbHdseHhrWURRQkErUVlxQUFCNG5HTmdaR0JnNEFOaUNRWVFZR0pnWkdCbVVBQ1NMR0FlQXdBRnhBQlZBSGljWTJCa0VtT2N3TURLd01Ib3c1akd3TURnRHFXL01rZ3l0REF3TURHd01qUEFBTE1BQXdJRXBMbW1NRGd3S0g1Z1lIencvd0dESHVOckJ2VUdCZ1pHa0J3QWo2WUxTSGljdFpDOUxrUlJGSVcvTzY3eHp4MkdZUXd6RWxITU5CTXZvQktOcUlRb2lWQktKQkx4TWxTaW1uSm9LR2k4Z3hlUVVDaDF5N28valp1cnRKTzE5MTduN0hXeTF3RUdTTkVnY0NZSXpZS0VoN3k3cnROeU4rMXVsVFU2ZE5sZ2t5MjIyV0dYZlE0NDRwaFR6ampuZ2t1dXJQcjhRb3BmWThXYWRrNnpaODJoTlNmRkduM3JUUjk2MVl1ZTlhUkhQZWhlZlovM2pGdjFkS2NiWGF1amRwUnUycVU0V2hueVViZTNwajFGMUtoUXRlY3lxZm5ZZjhtcGxGUEVsL1ZHTTJUWnpXQTVQbHI4UFRHVTVHRkc0akxLV0VMSG1aaGtLcHVJYXY3RVNqVmpzOGxxU3pEUFF0SHVNOGJjSDc3K0pYNEE2L1k3TndBQUFBQUFBZi8vQUFKNG5KMVllWXdrVjMydTMzdFY3OVY5SDMxM1QvZjBNZE16UGRObnplR1oyV04ydllmdFhYYlhGMnZ2cnRjMnV3N0dEa1pBREFSSTJCQ2hpRmgyaEwxQmNzQUtpY0xoa0VnSlJKRXdSRUZLTE1jUm9CQW5Va0t3RXNGaTVBQVNPSXFUek9UM3FtY2RrdjlJMS9UME82cGV2WHJ2KzMzZjl5c0pKR24zMjBTQ2IwdEVranlZSWRJT1ZuWWs4Wkd4Nzd2d0E3Z21XVkpGNmtqTGtqUU9ob01LNFRaMGdUZVNZVG9jVE5KSk85NXJDRVJEMHNOeXNnbnBhREp1M1B0eWZybnRxTTVidHMvVnJneXYxTTRkdXQrMVoxM2RlY3VodTJjZWV2OTh2QSs0bkhQM3plYTZDbG12d3ZOQmE3MTkrT1RWOUttVGh3NTFXLzFESjU4QzZ4eHgvUGRCb3dBeVNHUjNkL2NhenZkN1VrM2F4Qm1QSmx2QW9qQ3AwQ2hralhxcnplUEVKcUpBVytOa05Ca080aVJ0dFFlYklFcEJqR2M1TUJtUFd1MldhOTFmK3lXblVQWWJTV1YvTkZkZVZHSlB0U0o2Qmw1cVJQa3R1OXJydzBLWlp5MnVkU3gzZE8xMmVBaHJ1V2IvM0ZDeG82SVQ1NUxnck9zQ2t6MFRMakNhQkpIdjNKRlRUZVphTzU5a0ZFLzJadWRYamdVVlNjWjVmNGVjaCs5S2Jla0c2YkIwQ3RkeU5GbUgxbmlVaW5sbkZkNm9RQlRpWWtaaG5JaGkxcE9HTVM3emVOVHVzWGFyMFdKcEJZYnhwRWVZTWg2T2g5RXdha1NOOGRuOXhVaFY5UEgybWNrblpnZTU0bUpnbE94cTdzeVI3WE9yTnl4dXBCUmtsVnVxTDRmQjBxRTZHMVFycy9wd1l4Wm1MdVV2WGNwdkx4d09jNDREQjVlWERoZTBZVzFwMXZZdHJhTEh2VVp2ZXpqdnpmWVhtenBYZEowWmlra1o5UDl6YmczU042MlF5VWhjZnVtU0JCSWdWbjRWL2hoeElxV2pGUGRmUE5NQUY1eG5EOFc0TFRmcXJBdTROZGt4Qm1idTczYjIzYkd2TXpuYUpBcjFhMEVMUUlITndrbEZreTB0T0dYRUMwZTkybUJoWTJOaFVBdnVTcGRVUlZVdFZWYkFzeldUcW1wRG9valJhL0FzNHVFaDZmM1NSd1FpVW9Ua09vZ1YyNEM5U3B6RXlRQ2hHVStQTjZhRFU4U0ppck5qbStDaXN5NTFsTEJDcHBkUHB6bXFSNkVEakRmcTJieDcwRzZsNDNUVTV3SjJJVDRQWjhwa0dDZWpkZ09McXF4cHpySnFNTzZ6U0srRUliV05ZdEQzSXFiSWxLZzJkNnhjR0tadFBXZXFsazBBZ0JDZ2l2aklXSkpsaDNwbEx3Z1gzU0xSWmNXbXByTy9hWEkxb0lTZUF3YktzbTlTbURITUpLZ1NoNnR3TE5RNVZRelZNQ3VXWmlnVVZEVWhqTE5TNlVTdkV0dDN6TWRGbDVQQ2ZGSTA4RjVVVnFtc1UxRlNHTmNVWXVmYlJieTlQZ1NvRnkwVFVlSXl4ejhmZVlmaExxQ0diY3dyREo0a29IWkJONUFUcU1BeEhNOXd2UG4vUm5HMmFvaGpYT2MwYTROczhhTHdaNEF4WGFnM0JKQkoyYk5CR1ZaSXhiTi9SaHpuY29qalFseFd0YmtWS0VSbFZUemZmKzIrUWx6NERuS2VKODFMRWhFY01vVU16cHA2UTI4ZHhnTGZ3MEVaaGdnU25IalUzNEJHSE5MWmNzbjNQTDhNcGRJalcyK1gxWEs4K3NpUjlRUE50d004UHB4eHZXTGU5WGJlQzdmdGZPYkx2dTdsYnY3aVYyKzZaUVZnMmYwc1JzOS9TRzN5Tm5oTWVoSW5NVVd3Z0d5NmhzR083SWF3clRBRTgwaXNGbWx2d2pxdDBqaEJCT0t5Q1NRaXdEZnBlTElsWjFlS3RSNVVJSnUzalh4Tmt6QWJJM3NPZ1dTY2RRUEJURVd2YU1BeHNTb2pLQkRPQ2tjZ0lSY3FCcU5jNFJDV2dGR21NRVp0b2xMTmxYbXphdG1XYmVoY3pnQU14TUxJcEhvdWh5ZXBxcUhvbHNlVndIWjFRbnpOTHlsZ01nYVV5VG8wbzdDQVZ4cTZadW0wM3FTV1puT1RFNW5YN2FDenY1V01sMEdWR1lWM2kzQUFvRVRYUERvL1IxU0Z5ektHeXFxdXRtd21wcUlobXJsdUlwNjlTREZOVFU5VXFzb1dWRWVtbFUwTXlVU21zbE4yY2cwT3J1b3dtV3V5QmpQRm91SEpZdEpLbDNpYUNxVFE0Q2FSWjJiTDIvZFFUM05zeFBsVUY5K0Z1dGhIak9OeXBzaGI0cWNIR3hBUGV3SUR1TDRDOFFpUFNjcTQrRWFoVFhFeEhmZk5oK2NPbXJydHU0dnJ4VnF4NmkvLzJnbDZmTExTV216YTg4MW12bDNadk8zUlEyODlXeUFyZ3paUjFDTTk0bnFyTTQzSytoSFpzOFkzelduSlVsNXgyeVZ2ZFBuODBZVzE2WHl1a2VQSWMvdVI0emJwRm9qN1ZoUU1zRXlERVJhdGJGZXhQQndNcHp0dHk1elZCV0VSM0Y4YmVHbGxma2JWR05OVnk3TTBwbEl2Tk15RmdnVnlySEEvYjY0dUxESTJEalNxajdhT1RvSzRXVTlVN1pRcWVDQ3g0ZTZaVWNtbGdxM3kxVzV6d2Q0M1dlM25ZNllVT2JFUGRxcnlmSmgzdk5HRFo0NHZXaWFTVGdDR2pqUkRUZjI2bDdoR2ZnSG5IeUJ6ckVzbmNGVXhpTFlFVmhQZWd5WEF5ZHRZUno0ZS91KzJBQmU2aW11T0dwNGlxemlBOFAwL2JRMk9iUk4vNlBuNTBpaWUrSXVtN2JscWNYMHc5a2VlVnlpTzRyRy9hRm0rZzIwdmpnTXNadDNPMkIrN1hxRTBiSStEaGF5dHRJWnRJOTh0RmtiVjUzUmtURVdQbm5NOGdoL3plOC9wWmxhM2ZRRk5jK2NIWDdKOVJEOHhqT21wQnFoZjJ1c3p4TGxNazRRK1NZZklWeEJIeC9HWlQrUGU0WTVWeVRDSnl4QUtVZUgxTXN3Z2pYUkpmUU5hNkdZbStQejRIN1dyMVVkVEZjWlZPdVJ0MGJhOENhSVZ6K1JSTTZGdG5pYWNFZ1M2dHZvYkdERmsxV0dnSWJjZmt3RnJ5aTl2SzdKR0tmeVRpQ1JUVy8rNWQwWmNibENza05kbElQZWNuNi9aWklYQTcra1V4MUQrZ1BHTHNpaVV5b1R3eTRBUnd0NGphN0tpaWwzaytKanlmUjhqQnNpVUN4MUo2YzYzNE9JS1daRXliM09OREhGdmM5THQwbVhwbytnQUpvS0NoQXVZeEVKclFUZ3lESll0R0UyRUpLY0NyMTFBVERJdTJzZlRiYThvWlJydTBSWnFHUEpUbXdsNmFrM1ZZemhKTjhtRzBJNWtPa3FtNk5sQ1pxUTJEUU9oSkJ3Vlp4a0krK0NUOTk5RGRjSTFyamtMRDQ1Ty92cUtURDVlcnhibjdDbzNFdG5MVTZLdGFkcDJ6MXFiVVRTVVlPRElZM0tYTWcwNVVDZmxvcC92RE80SVBaVGV5R1FLVkp6Rmw1RHRqTkJYbEVRaG9ZY0JnU1FWRUpab3BtbFFjbGFXajdYUXFWSkxZVnFodkRJa3VCZFBOQWFXcVJDaXpSZ09CTWlLSEEvU1d5QVZ4ZFI4RmhQWFBtZkZPckt1VEp0VWtWR2VIRnJqeW5JYTVvREZXdUs0bG14OUhRZWdDdklXa2pIMSt3N2VXVjcwc0FLNHBTQTQ0akgwUXIrZHhaaVVvamtVYWh5aFNLSlFaU2J4c1JPSCtpZE9jUFBpeFh1L2ViRS9QbjdSdFFZWFgzMDFpOC9kZjkvOUllR29ld2JxWGlRVkphbWR0dE1FSVpid3RnUGpKQzBEVGRJMk1rK1NSdXh0Yi92RTViZCsvUDc3bjc1OGViQjgrY21ucmo2RnM3azBldW4wNmN0MzNubnZtZHZQbnp4Wkw1ZE93aGRnL2R4OXQrMDg4QVU0V2EzaGZUREwySDBGZHVIN09FZDBEemVBMk1kc0c3TWRGeDRyRldLRzlMcG52OUxXbEJBbWdtWW5HUFI4RHgwY2QvNE41dHZiZGp6Q3VmTkxEeXlkbTR1aXVYTllPRDhYZHVjUFJZWmQ4SmNLcG0wb2FwQ3ZibFJEMytYY01nb2xOeDhWb29QZGVjOHJsenR6M2JuNWRxWHNlVis4dkh5K0UwV2Q4LzM3K3hmbXduRHV3cjFIVmxlU3VhcUY5R2VVajdhTGxRWmhub3FHamdFMEtzWDJhaG1saE5pVnVXUjE5Y2FGRG83aStyNWJyclE3RXNzODZzdTRMMjFVazNYcG9IU2o5QUR5WHhobkxyTXhENDJXY0JUNEpCZ1lhRFB3V1pnd1QwTFhiWmhrV1l4d1VYeHFxRm05NVlzU0ZpZ21BT2t3NnFPNFoxNXFpMlNCc0FTak51NS9ZNHk3dm5WMjM3NUZ4SWRwTmdleW8rYXJORmRxVC9LaGJTV2x6ZGh4WXZ4R3hXWVIvejZUYStSeURYczdWeVpPR0RDTzNoWGxGV0lUMlE5cFkybHBzNXpPOUhvenRaNVJjTWhvMWphb3ZPNjY0MVp1enZKRFB6VHFYNnpuY3ZYY0gxbEJZTmxCQUZmRWVMbWRiNzMyMnA4OTdzWTZRMytyeUVNT3dQSDc2SGhwYWVyZlNSZlhaaFl6aHhSWHBiVXBiMEZrSzg0MHI1T3JFUFdVc2VLbFhpQmtyUW84R1dmaUFNWDUwYWhyV2VWK0pXZHk0UlZZc1Q1YjF2VEJ5ZjZzcTRGODFLTkJHQnRHOTVPVDZGaXgrSFF0blMyNUJwQXQ0c2I1SEQ0ZlZ3M2R6MFVXa3VaWUtkU2FqYkw2T2ZqcndVNEh1T0FCMWV2OFlqVXVFc0hoWFBnQmVBSjVuR09FT0lqZUJHT2tLa25ST09FenVBdE5ETEV4Umt2N3A3NFlLcnlOY2RIWitkSHp6eXZQeTE4Mi85eDZPbjQydWIzeHJsbXpPOU90L1MxODdyTi84L1B6eHhmQzdvUHo2Znh2TlMrM3ZwSC9WUDZmK1Yvd0xGWjhTU2NKL0ltMElYMEFJenErbnIra2s3MWpEL3IvYzZBMlhJK0Q2d2ZTWXhMRzZlaU5pNUEySnhWWmpETjhveWtSVm5JNnVxRGY2OWZ1RGJ2Y0Noa3ozVXAzYnJRNlRoZm02enJqS0RGSVJWWStybGFiWVdKYUNsRmRSUWdGTTgwa2J0Y3FVYWpobzlkUklMbEhEWTM3TGxNTXFsTVZiSTF6Ym1BQ3Jkc0tVeWhWd3NoeGZZMkY0R3NBZnIrN2lremY2cUsxZ0FkVjdwZzV5MFpqeWp5dm9xbTZxamtzVU9TVmZuZTJFUnBjK0RqY2VVVnppdk9kMFdBVnMwTFJFS00xNUdGSjhXdzFwNkJnb2FVQlI2YWdtYVdHWVJQQnlTQTdrUnZFcnRha1ZaOUFMWEFSbklyamxiaEdoVjk1UXFyUXkvQjUzT08ydENTVUcrb01jWWZMTys2UFdoaWdmUXk3ekh4bC8wY3R1ZDdLb2pMZSswM2E2WGpTdzh5eHo5djlIbXBkMGs5NG4xV1F0UHBwZ3RkdVFwdmtPd2Q5LzBCbnFlVW1IcHhhNnh6dy9ZT2R0Vk9uZG41NGVEQTQzUC9MN1A5clI0NXcyVS80NWhaUGZNcU9IRUg2UjNSdFlrM21zREpYcjgrVjNtMjRydkhLMnB0RTVmUTdUNzNjejY3TS9tOWN1QUJhWWxIdDlHbU5Xb2wyendVOXRxYzFPMFozcGlDMi93SGorOXVaVDFNbFUzTFJwL1RUaUNkUmU1dzJJd3VpNXZnYitQaytKRHZmeTc1UGxWK0ErSVh5NS85bDdzYzAvK1BPWDAwOW5pbjU4Qk5jczU2MExkMGxQU3hKQWVaSkV3RXBnYkpOd05JYjBPcGwxQjhQNDZ4bkNtVmxnZ2k4ZmtKOTNOb0Q1MkI2cFEzdCtoNGlzM1krbVVLV2gzdEk3WUZKSE0zbmJKOFBjRlNUQTAzVGFPNXV4M2JpZkYwekNIcGdIMkxMMUZITjZWbEhoaWMwRHplZHQ1cDUxK1lJYURWTXFzVVIwUlZGTXduaWRIR203S01vRTZLYXVlYTdaRzdsT24wTFhFTUxabXV1eXVBM05RczgrMU5kQWwvSmFhcE1BMzN0V3RzTHVLcUFxemtpQlRIMFBMWFFWZnpqckJaVHBCUmZDVjJScFJOMEdKNGYrNzhpME9wcE9BNUY3Y2YwRmpNV21aOUdRZGZjQXZOY0pqT3prSE5VdEpLU3N2djY3dC9qUHIyTUhLUWpOeFNrdWlRMUc3eVJEcFBHRXZCWm9Rd0lQVlpuUWxvRVNMTmZtRHR0SEwvejVKMDNGd3NGS0YxOTZlclZsL0xQUFBMSU00Kzg1NGxMbDU2NDlFejcxVmZQM25yck8wVDcxUU9QaUo0TGwwU1B0SGZQZjROL2hhOUxNV3JYRFpoOTNJaVIwQU94NGd3WFBvcWpDbVErTDUxUWhwdVFiVFB1RlBZeTNKdTk2aVI3TjVDWndiYWc5WFFpY241NEpUbldxUlFlZUthb0cvSGpGODY4azBMVWZXM2ZCNW90ZGFIenZoU2MrTVlITlBYV2pjTVBHTlFvd3kySHpteHNkam9IQU42eHZaMC9wcEJtQlQ1ZENTeWR4ZmRleGpTaEJHKytUMWV2M0ZtcjM3VHpoMEYvZGUzS3BOOUlRb2ZxdHg1YmU2dXF2K25HaE1PSmg3NTZ3MXhuSDhDQnVmbEh6ZjBITEJKc29aYUxaMVV6bmY0bWFsRkp1bFc2VDNwUWVsVDZpUFNNOUtjQ3gzUTR0U0hDYmdyYktuSm1FUDVFNUlCWkpyTkpwbkROVHFzUVJLeDQxMmhUZ2RsR1hieENFa2E0bmIxSFNxY3ArM0RjRnY2TVg1ZHpMc2JDQkNBU2RobFp1d3BESWVGNG93MW9CRCtWMmtWaXNHa3dqSktSZUNlTHh0bFd1aUF5ZVNDbTdhRFF4bDZJWGpGQm9UTjExNkdranBsbVl0bVFyK2lhNjRXSzdDSUFaWGRVUm41RjZMRzRQS29HTWZjTVM5RzB2Qmxxa1BOOGRoQzRVZDVmYmpnNXF0WjZ0VnJQUnJwMVNnWFZKT2NjVlQxV3E4b01xa1VhQno2Vlk5ZFVRaTlINVpMQjRhNFZyMkJocENtcTRXazB0Q3lUd21KUXRGWHd3MUJGU3E3blpaeFMyZEZVNWNjYTV0MXhIdk9vcU9hN2hwRlJOUXNuc1Y0cDVkR1NhNUdCOW9HSTVFVms3cDduSCtiY2RXTDJOSFFqQTlqK1htLy8wdXNZT3BvdDd6TVVTN2NvZWZnTW9PYytCa291SHluNUVGV2puSVRvbVdNM1ZqOTZzeE9MT0ZXb2E5ZzZaamtzSDBxWjVuNXc5M1U0QzE5RGZaOUJwR2RPTEVFb283M2FRaHNkNHUvWUc5SHJMN3NpT0hONGN1U1d1ekVqNmpKeXBpcTM1RjVocHRldFZ1RnJwNDZmYnp3ck0rWFRuMVlVZUlIdFN1TnhtdjZkSkZtU3Mvc2EvQWhleERqMjBFVzBNTEkyTUs1T1MzZExiNUhlTHIxWHVpSkpzd0lTTnRUVEVKa3dFNVQybmcrc3Q1VHJqcEMxbXFKWWdlelZkOWFRWm4zcG5rL0VtS3RQMzFHSU9wME9oS1hKdEhNNDRHK1l5OWEwQndzanZxZGdEQTZHbFJpaTh0WElkcUtvR2p3Yk9YWVVsYU9kRjBNMGphSUNRMUdDR0lzZnhwUHdaTWNKRHpwUlhNNjZJOXVPOElRd0tvZjR3VGJidVJwbTdVNzRua29ZVGsrT3NQUndPWXhLNFlkeHhCRFB2UTB2S1VYaGJXNFFsaUljMHc3eE43VHRFR0xiQ1hBbzBWSU9yMkJURkZsT3VQTXc5dVBOd28vaFR5bHNPS0kzZUYxY0VaYVdBeXhYQXRRNVM3b0xYb1dMbUtkV3BhNDBrTll3c2pGU1k4eFVDYWFZZHFZeFFrY21xUFJJYW5GYUlWTnRHVTA0cWhoclQ3Q0tIUlg0ckZyMHVlbWFxbGZFZk5oMjg4MmlaNmd5K1ZDaXg2Tkc4cFBldXBKb3prUWxVREs2ZERXdGZtaXlaclE0YThGRlJDZlQ4YytTbllQMWZqQkRLMkVoWE5qM1l2bkl4cEx5TzcrcmI1K2VkL1htcGp1NzlQdldTTTduVzYxY3pscFMxWjRrL1RjL3RYaVBBSGljWTJCa1lHQUE0cW9vWTU1NGZwdXZETnhNRENCd3JwTGpESXorLy9QL1RlWU14dGRBTGdjRFdCb0FLbGtNS1hpY1kyQmtZR0I4L2Y4bWd4NEx3LytmL3hpWU14aUFJaWhBSGdDazFBWjVlSnhqWW9DQ1ZSQ0s4Uk1EQXhPUVpvb0RzanNZR0JuWEFHa3ZJRi9rL3orbTNQOS9tRXFCYkJDL0hJZ1BBYkVSVUg0UlF6OFQyLzlmSUgyTUQ0QmlXa0I2SXRnY0lSWUdoa2xnOHhnWWVKZ1kvdjhHWWNZcllINERBejhETHdEY0FCVXVBQUFBQUFBQUFBQUFBQTRBV0FDMEFTUUJZQUlZQW9nQ3hBT01BOVFFTkFTd0JTSUY1Z1lFQmpnR3NnZEFCNVFIemdpTUNRSUpKZ25XQ2hBS2hndUlDN29NZGd6WWVKeGpZR1JnWUZCazJNM0F5d0FDVEVETXlBQVNjd0R6R1FBWklnRXZBQUI0bkhXT01Xb0RNUkJGMzlwcmgrQVFVb1dVZ2pScGRwRTJqZkVCOWdBcDNCc2psZ1hiQXRrR255UlZqcEF5eDhnQmNvUWNJOS9yYVZKWU1Pak4xNS81QXU1NHArQjhDbTU0TUI2Slg0ekhQSE15THFWL0drK1k4VzA4bGY0cloxSGVTcmtmcHM0OEVqOFpqMm54eHFYMEQrTUpqM3daVDZYLzBMTW1zVlVsZHRDdjB6WWx3UnVSamlNYlZtUzFzVHR1Vm9KMjhCMkdPOHNSY1RUVVNuTXNWUC8zWGJRNUZVR09TazR2ZXRXYXREdTBLWGZSTmJWM0MyZTVvbmtWZk5YNElOTzF2eTJWbXRuci9aSVJobnlXTWU5NzdRaTF2enI3QndEdk9kTUFBSGljWTJCaXdBOFVnWmlSZ1ltUmlZR2RnWmVCajBHSlFZTkJpMEdmd1pEQm5NR1N3WXJCaHNHRndaUEJuYUdRd1lzaGlLR1V3WlVobWlHV2dZVkJtSUdWSVlLQms0R05JWlM5TkMvVHpjREFBQURwaHdoYUFBQT0pIGZvcm1hdCgnd29mZicpLHVybCgnaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvZm9udC96b2NpYWwtcmVndWxhci13ZWJmb250LnR0ZicpIGZvcm1hdCgndHJ1ZXR5cGUnKSx1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ZvbnQvem9jaWFsLXJlZ3VsYXItd2ViZm9udC5zdmcjem9jaWFscmVndWxhcicpIGZvcm1hdCgnc3ZnJyk7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3R5bGU6bm9ybWFsfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5hdXRoMDpiZWZvcmV7Y29udGVudDpcXFwiP1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLmF1dGgwe2JhY2tncm91bmQtY29sb3I6I2ZmNDUwMDt3aWR0aDphdXRvfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5ibG9ja3tkaXNwbGF5OmJsb2NrO21hcmdpbjoxMHB4IDA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztvdmVyZmxvdzpoaWRkZW59I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnksI2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXttYXJnaW46MDtwYWRkaW5nOjAgMWVtO2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjQycHh9I2F1dGgwLXdpZGdldCAuem9jaWFsLnByaW1hcnk6YmVmb3JlLCNhdXRoMC13aWRnZXQgLnpvY2lhbC5zZWNvbmRhcnk6YmVmb3Jle2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtiYWNrZ3JvdW5kLWNvbG9yOiM3NDdlODV9I2F1dGgwLXdpZGdldCAuem9jaWFsLnNlY29uZGFyeXtiYWNrZ3JvdW5kLWNvbG9yOiNmMGYwZWI7Y29sb3I6IzIyMjt0ZXh0LXNoYWRvdzowIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC44KX0jYXV0aDAtd2lkZ2V0IC56b2NpYWx7LXdlYmtpdC1mb250LXNtb290aGluZzphbnRpYWxpYXNlZH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheXtwb3NpdGlvbjpmaXhlZDtsZWZ0OjA7dG9wOjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtvdmVyZmxvdzpoaWRkZW47ei1pbmRleDo5OTk5O2ZvbnQtd2VpZ2h0OjIwMDstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kOiMwMDA7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLDAuOCk7YmFja2dyb3VuZDotd2Via2l0LXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDotbW96LXJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7YmFja2dyb3VuZDotbXMtcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsZWxsaXBzZSBjbG9zZXN0LWNvcm5lcixyZ2JhKDAsMCwwLDAuNDUpIDElLHJnYmEoMCwwLDAsMC44KSAxMDAlKTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg1MCUgNTAlLGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIscmdiYSgwLDAsMCwwLjQ1KSAxJSxyZ2JhKDAsMCwwLDAuOCkgMTAwJSk7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNpdGlvbjo0MDBtcyBvcGFjaXR5IGVhc2U7LW1vei10cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTt0cmFuc2l0aW9uOjQwMG1zIG9wYWNpdHkgZWFzZTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7LW1vei10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1tcy10cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApOy1vLXRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsMCwwKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheS5hY3RpdmV7b3BhY2l0eToxfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHstd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo1MCU7ZGlzcGxheTpub25lfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbC5hY3RpdmV7ZGlzcGxheTpibG9jazstd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjo0MDBtczstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZTstd2Via2l0LWFuaW1hdGlvbi1uYW1lOnNob3dQYW5lbH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucGFuZWx7LXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb246NDAwbXM7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2U7LXdlYmtpdC1hbmltYXRpb24tbmFtZTpoaWRlUGFuZWw7d2lkdGg6MjgwcHg7bWFyZ2luOjAgMCAwIC0xNDBweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAuZW1haWx7bWFyZ2luLWJvdHRvbToxNHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbToxNHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5lbWFpbC1yZWFkb25seXt0ZXh0LWFsaWduOmNlbnRlcjtkaXNwbGF5OmluaGVyaXQ7Y29sb3I6IzQxNDQ0YTtmb250LXdlaWdodDpib2xkO21hcmdpbi1ib3R0b206MjVweH0jYXV0aDAtd2lkZ2V0IC5wYW5lbCAuc2lnbnVwIC5oZWFkZXIsI2F1dGgwLXdpZGdldCAucGFuZWwgLnJlc2V0IC5oZWFkZXJ7bWFyZ2luLWJvdHRvbToxNXB4O2ZvbnQtc2l6ZToxNHB4O2NvbG9yOiM0MTQ0NGF9I2F1dGgwLXdpZGdldCAucGFuZWwgLnNpZ251cCAuZm9vdGVye21hcmdpbi1ib3R0b206MTVweDtmb250LXNpemU6MTJweDtjb2xvcjojNDE0NDRhO3RleHQtYWxpZ246bGVmdDttYXJnaW4tdG9wOjEwcHh9QC1tb3ota2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC13ZWJraXQta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1vLWtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbXMta2V5ZnJhbWVzIHNob3dQYW5lbHswJXtvcGFjaXR5OjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwxMDAlLDApfTEwMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QGtleWZyYW1lcyBzaG93UGFuZWx7MCV7b3BhY2l0eTowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsMTAwJSwwKX0xMDAle29wYWNpdHk6MTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9fUAtbW96LWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgaGlkZVBhbmVsezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsMCwwKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsMCwwKX19QC1vLWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1ALW1zLWtleWZyYW1lcyBoaWRlUGFuZWx7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwwLDApfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwwLDApfX1Aa2V5ZnJhbWVzIGhpZGVQYW5lbHswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLDAsMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLDAsMCl9fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbHtiYWNrZ3JvdW5kOiNmYWZhZmE7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6LW1vei1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQoI2ZmZiwjZmFmYWZhKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudCgjZmZmLCNmYWZhZmEpO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KCNmZmYsI2ZhZmFmYSk7ei1pbmRleDoxMDstbW96LWJveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTstd2Via2l0LWJveC1zaGFkb3c6MCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTtib3gtc2hhZG93OjAgMCAxcHggMXB4IHJnYmEoMCwwLDAsMC4yKSwwIDEwcHggMjdweCByZ2JhKDAsMCwwLDAuNyk7LW1vei1ib3JkZXItcmFkaXVzOjZweDstd2Via2l0LWJvcmRlci1yYWRpdXM6NnB4O2JvcmRlci1yYWRpdXM6NnB4Oy13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbDphZnRlcntjb250ZW50OlxcXCJcXFwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtyaWdodDowO3RvcDowO2JvdHRvbTowO3otaW5kZXg6MTstbW96LWJveC1zaGFkb3c6aW5zZXQgMCAtMXB4IDJweCByZ2JhKDgyLDkzLDExMiwwLjQpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCk7Ym94LXNoYWRvdzppbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO21pbi1oZWlnaHQ6NjVweDtvdmVyZmxvdzpoaWRkZW47LW1vei1ib3JkZXItcmFkaXVzOjZweCA2cHggMCAwOy13ZWJraXQtYm9yZGVyLXJhZGl1czo2cHggNnB4IDAgMDtib3JkZXItcmFkaXVzOjZweCA2cHggMCAwO2JhY2tncm91bmQ6I2YxZjRmNjtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsI2U5ZWRmMCk7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQoI2YxZjRmNiwjZTllZGYwKTtib3JkZXItYm90dG9tOjFweCBzb2xpZCByZ2JhKDQwLDY5LDg1LDAuMTEpfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXI6YmVmb3Jle2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjVweDtib3R0b206LTFweDtsZWZ0OjA7cmlnaHQ6MDtiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOi1tcy1saW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSxyZ2JhKDQwLDY5LDg1LDAuMSkpO2JhY2tncm91bmQtaW1hZ2U6LW8tbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCkscmdiYSg0MCw2OSw4NSwwLjEpKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLHJnYmEoNDAsNjksODUsMC4xKSl9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlcjphZnRlcntjb250ZW50OicnO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDo0cHg7Ym90dG9tOjA7bGVmdDowO3JpZ2h0OjA7YmFja2dyb3VuZC1pbWFnZTotd2Via2l0LWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KGxlZnQsI2U5ZWRmMCxyZ2JhKDI0MSwyNDQsMjQ2LDApLCNlOWVkZjApO2JhY2tncm91bmQtaW1hZ2U6LW1zLWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOi1vLWxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChsZWZ0LCNlOWVkZjAscmdiYSgyNDEsMjQ0LDI0NiwwKSwjZTllZGYwKX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MjFweCAyMHB4O21hcmdpbjowO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM0MTQ0NGE7Zm9udC13ZWlnaHQ6Ym9sZDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGRlM2U2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYXtkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbjt0ZXh0LWluZGVudDoyMDAlO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEycHg7b3BhY2l0eTouNDtwYWRkaW5nOjVweDt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBhOmhvdmVye29wYWNpdHk6LjY2fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYTphY3RpdmV7b3BhY2l0eToxfSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtoZWlnaHQ6MTJweDtiYWNrZ3JvdW5kOnVybChcXFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2Fzc2V0cy5hdXRoMC5jb20vdzIvaW1nL2Nsb3NlLnBuZ1xcXCIpIDUwJSA1MCUgbm8tcmVwZWF0O2JhY2tncm91bmQtc2l6ZToxMnB4IDEycHg7cmlnaHQ6MTlweDt0b3A6MjFweDtjdXJzb3I6cG9pbnRlcn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGEuY2xvc2U6aG92ZXJ7b3BhY2l0eTouNjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGhlYWRlciBpbWd7aGVpZ2h0OjMycHg7bWFyZ2luOjE2cHggMTBweCAxMHB4IDIwcHg7cG9zaXRpb246cmVsYXRpdmU7ZmxvYXQ6bGVmdH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gLnNwaW5uZXJ7d2lkdGg6MTAwJTtiYWNrZ3JvdW5kLWNvbG9yOiM2YTc3N2Y7YmFja2dyb3VuZC1pbWFnZTp1cmwoJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hc3NldHMuYXV0aDAuY29tL3cyL2ltZy9zcGlubmVyLmdpZicpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlcjttYXJnaW46MDtoZWlnaHQ6NDRweDtib3JkZXI6MXB4IHNvbGlkICM3Nzc7Ym9yZGVyLWNvbG9yOnJnYmEoMCwwLDAsMC4yKTtib3JkZXItYm90dG9tLWNvbG9yOiMzMzM7Ym9yZGVyLWJvdHRvbS1jb2xvcjpyZ2JhKDAsMCwwLDAuNCk7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLGluc2V0IDAgMCAuMWVtIHJnYmEoMjU1LDI1NSwyNTUsMC45KTtib3gtc2hhZG93Omluc2V0IDAgLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksaW5zZXQgMCAwIC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOy1tb3otdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lOy1tb3otYm9yZGVyLXJhZGl1czouM2VtOy13ZWJraXQtYm9yZGVyLXJhZGl1czouM2VtO2JvcmRlci1yYWRpdXM6LjNlbX0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgZm9vdGVye2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7LW1vei1ib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czowIDAgNXB4IDVweDtib3JkZXItcmFkaXVzOjAgMCA1cHggNXB4O2hlaWdodDoyNXB4O2xpbmUtaGVpZ2h0OjI1cHg7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbjowIDE1cHg7Ym9yZGVyLXRvcDoxcHggc29saWQgI2RkZTNlNjt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBzcGFue2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiM2NjZ9I2F1dGgwLXdpZGdldCAucG9wdXAgLnBhbmVsIGZvb3RlciBhe2ZvbnQtc2l6ZTo5cHg7Y29sb3I6IzMzMztmb250LXdlaWdodDpib2xkO3RleHQtZGVjb3JhdGlvbjpub25lO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxpc3QsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3R7bWFyZ2luOjI1cHggMDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCAubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAubGlzdDphZnRlciwjYXV0aDAtd2lkZ2V0IC5pY29ubGlzdDpiZWZvcmUsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7ZGlzcGxheTp0YWJsZTtjb250ZW50OlxcXCJcXFwifSNhdXRoMC13aWRnZXQgLmxpc3Q6YWZ0ZXIsI2F1dGgwLXdpZGdldCAuaWNvbmxpc3Q6YWZ0ZXJ7Y2xlYXI6Ym90aH0jYXV0aDAtd2lkZ2V0IC5saXN0IHNwYW57ZGlzcGxheTpibG9jazttYXJnaW46MTBweCAwO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0e3RleHQtYWxpZ246Y2VudGVyfSNhdXRoMC13aWRnZXQgLmljb25saXN0IHNwYW57bWFyZ2luOjAgMnB4fSNhdXRoMC13aWRnZXQgLmZvcmdvdC1wYXNze2ZvbnQtc2l6ZToxMnB4O2NvbG9yOiM2NjY7Zm9udC13ZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50e2Rpc3BsYXk6bm9uZTttYXJnaW4tdG9wOjIwcHg7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuY3JlYXRlLWFjY291bnQgYXtmb250LXNpemU6MTJweDtjb2xvcjojNmQ2ZDZkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgLmNyZWF0ZS1hY2NvdW50IGE6aG92ZXJ7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZX0jYXV0aDAtd2lkZ2V0IC5sb2dnZWRpbiBzcGFuLmNlbnRlcmVkLmFsbHtjb2xvcjojMDA4Y2RkO2N1cnNvcjpwb2ludGVyfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWR7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtkaXNwbGF5OmJsb2NrfSNhdXRoMC13aWRnZXQgLmxvZ2dlZGluIHNwYW4uY2VudGVyZWQuYWxsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2Vse2NvbG9yOiMwMDhjZGQ7Y3Vyc29yOnBvaW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsOmhvdmVyLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2VsOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbnVwIC5vcHRpb25zLCNhdXRoMC13aWRnZXQgLnJlc2V0IC5vcHRpb25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6NXB4IDA7bWFyZ2luOjE1cHggMCA1cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTpibG9ja30jYXV0aDAtd2lkZ2V0IGZvcm17bWFyZ2luOjMwcHghaW1wb3J0YW50O21hcmdpbi1ib3R0b206MjJweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjV9I2F1dGgwLXdpZGdldCBmb3JtIGxhYmVse2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gaW5wdXR7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7Zm9udC1zaXplOjE4cHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyOjFweCBzb2xpZCAjYjRiZWNkO2JvcmRlci10b3AtY29sb3I6I2IwYmFjYTtib3JkZXItYm90dG9tLWNvbG9yOiNkM2Q5ZTI7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwxMzcsMTUwLDAuMjMpLDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuODUpOy1tb3otYm9yZGVyLXJhZGl1czo0cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjRweDtib3JkZXItcmFkaXVzOjRweDtjb2xvcjpibGFjazttYXJnaW46MDtmb250LWZhbWlseTonSGVsdmV0aWNhIE5ldWUnLEhlbHZldGljYSxBcmlhbCBHZW5ldmEsc2Fucy1zZXJpZn0jYXV0aDAtd2lkZ2V0IC5wbGFjZWhvbGRlcntjb2xvcjojY2NjfSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dDpmb2N1c3tib3JkZXItY29sb3I6IzU2OTVkYiAjNzBhN2U0ICM4OWI4ZWMgIzcwYTdlNDtvdXRsaW5lOjA7LW1vei1ib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRiOy13ZWJraXQtYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSg3MCwxMjMsMTgxLDAuMzUpLDAgMCA0cHggIzU2OTVkYjtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCByZ2JhKDcwLDEyMywxODEsMC4zNSksMCAwIDRweCAjNTY5NWRifSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCBpbnB1dHtvdXRsaW5lOjA7Ym9yZGVyLWNvbG9yOiNmZjcwNzY7Ym9yZGVyLXRvcC1jb2xvcjojZmY1YzYxOy1tb3otYm94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KTstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4yKSwwIDAgNHB4IDAgcmdiYSgyNTUsMCwwLDAuNSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpLDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KX0jYXV0aDAtd2lkZ2V0IGhlYWRlciAuZXJyb3J7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiNiOTUzNTM7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBoZWFkZXIgLnN1Y2Nlc3N7cGFkZGluZzo5cHggMDttYXJnaW46MTBweCBhdXRvO3dpZHRoOjcwJTtmb250LXNpemU6MTRweDtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiMwZmFkMjk7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCBmb3JtIC5ub3Rle2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzdmODg5OTtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO21hcmdpbjowIDAgN3B4IDA7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0jYXV0aDAtd2lkZ2V0IGZvcm0gLm5vdGUgYXtjb2xvcjojMDA4Y2RkO3RleHQtZGVjb3JhdGlvbjpub25lfSNhdXRoMC13aWRnZXQgZm9ybSAuaW52YWxpZCAuZXJyb3J7dmlzaWJpbGl0eTp2aXNpYmxlfSNhdXRoMC13aWRnZXQgZm9ybSBidXR0b257ZGlzcGxheTpibG9jazttYXJnaW46MjBweCAwIDAgMDtjdXJzb3I6cG9pbnRlcjt3aWR0aDoxMDAlfSNhdXRoMC13aWRnZXQgLmFjdGlvbnt0ZXh0LWFsaWduOnJpZ2h0O21hcmdpbjowIDMwcHggMzBweCAzMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NX0jYXV0aDAtd2lkZ2V0IGZvcm0gLmFjdGlvbnttYXJnaW46MH0jYXV0aDAtd2lkZ2V0IC5hY3Rpb24gYnV0dG9ue3dpZHRoOmF1dG99I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9ye3Bvc2l0aW9uOnJlbGF0aXZlO3RleHQtYWxpZ246Y2VudGVyO21hcmdpbjowIDAgMjVweCAwfSNhdXRoMC13aWRnZXQgLnNlcGFyYXRvcjpiZWZvcmV7Y29udGVudDpcXFwiXFxcIjtkaXNwbGF5OmJsb2NrO2JvcmRlci10b3A6MXB4IHNvbGlkICM3Zjg4OTk7d2lkdGg6MjAwcHg7bGVmdDo1MCU7bWFyZ2luLWxlZnQ6LTEwMHB4O2hlaWdodDoxcHg7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt6LWluZGV4OjF9I2F1dGgwLXdpZGdldCAuc2VwYXJhdG9yIHNwYW57YmFja2dyb3VuZDojZmFmYWZhO3BhZGRpbmc6MCAxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6NTtjb2xvcjojN2Y4ODk5O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7dGV4dC1zaGFkb3c6MCAxcHggMCB3aGl0ZX0jYXV0aDAtd2lkZ2V0IHNwYW4uYmFja3tkaXNwbGF5OmJsb2NrO2NvbG9yOiMwMDhjZGQ7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzo1cHggMDttYXJnaW46MTVweCAwIDVweDtmb250LXNpemU6MTNweDtjdXJzb3I6cG9pbnRlcjtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjU7b3V0bGluZTowfSNhdXRoMC13aWRnZXQgc3Bhbi5iYWNrOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9I2F1dGgwLXdpZGdldCAuc2lnbmluIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0IC5lbWFpbHtkaXNwbGF5OmJsb2NrO2NvbG9yOiM3Zjg4OTk7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6Ym9sZDttYXJnaW46MCAwIDdweCAwO3RleHQtc2hhZG93OjAgMXB4IDAgd2hpdGU7dGV4dC1hbGlnbjpjZW50ZXJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NTpiZWZvcmV7Y29udGVudDpcXFwiV1xcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLm9mZmljZTM2NXtiYWNrZ3JvdW5kLWNvbG9yOiMwMGFjZWQ7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2FhZDpiZWZvcmV7Y29udGVudDpcXFwielxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLndhYWR7YmFja2dyb3VuZC1jb2xvcjojMDBhZGVmO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsczpiZWZvcmV7Y29udGVudDpcXFwiYlxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsc3tiYWNrZ3JvdW5kLWNvbG9yOiM2YWMwNzE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94OmJlZm9yZXtjb250ZW50OlxcXCJ4XFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYm94e2JhY2tncm91bmQtY29sb3I6IzI2N2JiNjtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC5zYWxlc2ZvcmNlOmJlZm9yZXtjb250ZW50OlxcXCIqXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuc2FsZXNmb3JjZXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6I2YwMH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwud2luZG93c3tiYWNrZ3JvdW5kLWNvbG9yOiMyNjcyZWM7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0OmJlZm9yZXtjb250ZW50OlxcXCIjXFxcIn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuZml0Yml0e2JhY2tncm91bmQtY29sb3I6IzQ1YzJjNTtjb2xvcjojZmZmfSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXg6YmVmb3Jle2NvbnRlbnQ6XFxcIiZcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC55YW5kZXh7YmFja2dyb3VuZC1jb2xvcjojZjAwO2NvbG9yOiNmZmZ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbjpiZWZvcmV7Y29udGVudDpcXFwiclxcXCJ9I2F1dGgwLXdpZGdldCAuem9jaWFsLnJlbnJlbntiYWNrZ3JvdW5kLWNvbG9yOiMwMDU2YjU7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC56b2NpYWwuYmFpZHU6YmVmb3Jle2NvbnRlbnQ6XFxcInVcXFwifSNhdXRoMC13aWRnZXQgLnpvY2lhbC5iYWlkdXtiYWNrZ3JvdW5kLWNvbG9yOiMyODMyZTE7Y29sb3I6I2ZmZn0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAub25lc3RlcHt3aWR0aDozNDVweDttYXJnaW46MCAwIDAgLTE3MnB4fUBtZWRpYShtYXgtd2lkdGg6MjgwcHgpeyNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYW5lbHt3aWR0aDoyNDBweDttYXJnaW46MCAwIDAgLTEyMHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjEycHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxMnB4fSNhdXRoMC13aWRnZXQgZm9ybSBpbnB1dHtwYWRkaW5nOjVweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVye21hcmdpbjowO3BhZGRpbmc6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTRweCAxNnB4O21hcmdpbjowO2ZvbnQtc2l6ZToyMnB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZXtyaWdodDoxNHB4O3RvcDoxNnB4fX1AbWVkaWEobWluLXdpZHRoOjI4MXB4KSBhbmQgKG1heC13aWR0aDozNDBweCl7I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLnBhbmVse21hcmdpbjowO2xlZnQ6MDtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAuem9jaWFsLCNhdXRoMC13aWRnZXQgLnBvcHVwIGEuem9jaWFse2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnNpZ25pbiAucG9wdXAgLnBhbmVsLnN0cmF0ZWdpZXMgLmxpc3R7bWFyZ2luOjE1cHh9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjoxNXB4IDI1cHh9I2F1dGgwLXdpZGdldCBmb3JtIGlucHV0e3BhZGRpbmc6NnB4O2ZvbnQtc2l6ZToxOHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXJ7bWFyZ2luOjA7cGFkZGluZzowO21pbi1oZWlnaHQ6MzJweH0jYXV0aDAtd2lkZ2V0IC5wb3B1cCAucGFuZWwgaGVhZGVyIGgxe3BhZGRpbmc6MTJweCAxNnB4O21hcmdpbi10b3A6MXB4O2ZvbnQtc2l6ZToyMHB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5wYW5lbCBoZWFkZXIgaW1ne2hlaWdodDozMnB4O21hcmdpbjo5cHggMTBweCA2cHggMThweH0jYXV0aDAtd2lkZ2V0IC56b2NpYWwucHJpbWFyeXtsaW5lLWhlaWdodDozNHB4fSNhdXRoMC13aWRnZXQgLmFjdGlvbiAuc3Bpbm5lcntoZWlnaHQ6MzRweH0jYXV0aDAtd2lkZ2V0IC5jcmVhdGUtYWNjb3VudHttYXJnaW4tdG9wOjIwcHh9I2F1dGgwLXdpZGdldCAucG9wdXAgLm92ZXJsYXkgLmVtYWlse21hcmdpbi1ib3R0b206NXB4fSNhdXRoMC13aWRnZXQgLnBvcHVwIC5vdmVybGF5IC5wYXNzd29yZCwjYXV0aDAtd2lkZ2V0IC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmR7bWFyZ2luLWJvdHRvbTo1cHh9fSNhdXRoMC13aWRnZXQgLmxvYWRpbmd7ZGlzcGxheTpub25lO2JvcmRlcjowO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpmaXhlZDt2aXNpYmlsaXR5OnZpc2libGU7bWFyZ2luOjA7cGFkZGluZzowO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3otaW5kZXg6MTAwMDAwO2ZvbnQtd2VpZ2h0OjIwMDstbW96LXVzZXItc2VsZWN0Om5vbmU7LWtodG1sLXVzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC41KX0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5tZXNzYWdle3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bWFyZ2luLXRvcDotMTEwcHg7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6MjJweDtmb250LWZhbWlseTpIZWx2ZXRpY2EsYXJpYWwsZnJlZXNhbnMsY2xlYW4sc2Fucy1zZXJpZjtjb2xvcjojMzMzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxze3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NTAlO3RvcDo1MCU7bWFyZ2luLWxlZnQ6LTQ1cHg7bWFyZ2luLXRvcDotNDVweDt3aWR0aDo5MHB4O2hlaWdodDo5MHB4fSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzPmRpdntwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo4NnB4O2hlaWdodDo4NnB4O29wYWNpdHk6MDstbW96LXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstbW96LWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMjI1ZGVnKTstd2Via2l0LWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTstbXMtdHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpOy1tcy1hbmltYXRpb246b3JiaXQgNy4xNXMgaW5maW5pdGU7LW8tdHJhbnNmb3JtOnJvdGF0ZSgyMjVkZWcpOy1vLWFuaW1hdGlvbjpvcmJpdCA3LjE1cyBpbmZpbml0ZTt0cmFuc2Zvcm06cm90YXRlKDIyNWRlZyk7YW5pbWF0aW9uOm9yYml0IDcuMTVzIGluZmluaXRlfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzPmRpdj5kaXZ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTFweDtoZWlnaHQ6MTFweDtiYWNrZ3JvdW5kOiMzMzM7bGVmdDowO3RvcDowOy1tb3otYm9yZGVyLXJhZGl1czoxMXB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoxMXB4Oy1tcy1ib3JkZXItcmFkaXVzOjExcHg7LW8tYm9yZGVyLXJhZGl1czoxMXB4O2JvcmRlci1yYWRpdXM6MTFweH0jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDAxey1tb3otYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OjEuNTZzOy1tcy1hbmltYXRpb24tZGVsYXk6MS41NnM7LW8tYW5pbWF0aW9uLWRlbGF5OjEuNTZzO2FuaW1hdGlvbi1kZWxheToxLjU2c30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDAyey1tb3otYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LjMxczstbXMtYW5pbWF0aW9uLWRlbGF5Oi4zMXM7LW8tYW5pbWF0aW9uLWRlbGF5Oi4zMXM7YW5pbWF0aW9uLWRlbGF5Oi4zMXN9I2F1dGgwLXdpZGdldCAubG9hZGluZyAuYmFsbHMgLmJhbGwwM3stbW96LWFuaW1hdGlvbi1kZWxheTouNjJzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi42MnM7LW1zLWFuaW1hdGlvbi1kZWxheTouNjJzOy1vLWFuaW1hdGlvbi1kZWxheTouNjJzO2FuaW1hdGlvbi1kZWxheTouNjJzfSNhdXRoMC13aWRnZXQgLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDR7LW1vei1hbmltYXRpb24tZGVsYXk6Ljk0czstd2Via2l0LWFuaW1hdGlvbi1kZWxheTouOTRzOy1tcy1hbmltYXRpb24tZGVsYXk6Ljk0czstby1hbmltYXRpb24tZGVsYXk6Ljk0czthbmltYXRpb24tZGVsYXk6Ljk0c30jYXV0aDAtd2lkZ2V0IC5sb2FkaW5nIC5iYWxscyAuYmFsbDA1ey1tb3otYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OjEuMjVzOy1tcy1hbmltYXRpb24tZGVsYXk6MS4yNXM7LW8tYW5pbWF0aW9uLWRlbGF5OjEuMjVzO2FuaW1hdGlvbi1kZWxheToxLjI1c31ALW1vei1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW1vei10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0fTcle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tb3otb3JpZ2luOjB9MzAle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW1vei1vcmlnaW46NyV9Mzkle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1tb3otb3JpZ2luOjMwJX03MCV7b3BhY2l0eToxOy1tb3otdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbW96LW9yaWdpbjozOSV9NzUle29wYWNpdHk6MTstbW96LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW1vei1vcmlnaW46NzAlfTc2JXtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW1vei10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LXdlYmtpdC1vcmlnaW46MH0zMCV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstd2Via2l0LW9yaWdpbjo3JX0zOSV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LXdlYmtpdC1vcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy13ZWJraXQtb3JpZ2luOjM5JX03NSV7b3BhY2l0eToxOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstd2Via2l0LW9yaWdpbjo3MCV9NzYle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC1tcy1rZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1zLW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLWluLW91dDstbXMtb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjpsaW5lYXI7LW1zLW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstbXMtdHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpOy1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0Oy1tcy1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTstbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstbXMtb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1tcy10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7LW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX19QC1vLWtleWZyYW1lcyBvcmJpdHswJXtvcGFjaXR5OjE7ei1pbmRleDo5OTstby10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dH03JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1vLW9yaWdpbjowfTMwJXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1pbi1vdXQ7LW8tb3JpZ2luOjclfTM5JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg2NDVkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246bGluZWFyOy1vLW9yaWdpbjozMCV9NzAle29wYWNpdHk6MTstby10cmFuc2Zvcm06cm90YXRlKDc3MGRlZyk7LW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjplYXNlLW91dDstby1vcmlnaW46MzklfTc1JXtvcGFjaXR5OjE7LW8tdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpOy1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7LW8tb3JpZ2luOjcwJX03NiV7b3BhY2l0eTowOy1vLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKX0xMDAle29wYWNpdHk6MDstby10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9fUBrZXlmcmFtZXMgb3JiaXR7MCV7b3BhY2l0eToxO3otaW5kZXg6OTk7dHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXR9NyV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjtvcmlnaW46MH0zMCV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2UtaW4tb3V0O29yaWdpbjo3JX0zOSV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoNjQ1ZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmxpbmVhcjtvcmlnaW46MzAlfTcwJXtvcGFjaXR5OjE7dHJhbnNmb3JtOnJvdGF0ZSg3NzBkZWcpO2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ZWFzZS1vdXQ7b3JpZ2luOjM5JX03NSV7b3BhY2l0eToxO3RyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmVhc2Utb3V0O29yaWdpbjo3MCV9NzYle29wYWNpdHk6MDt0cmFuc2Zvcm06cm90YXRlKDkwMGRlZyl9MTAwJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpfX0jYXV0aDAtd2lkZ2V0IGlucHV0W2Rpc2FibGVkXXtiYWNrZ3JvdW5kLWNvbG9yOiNkOWRlZTB9I2F1dGgwLXdpZGdldCBhcnRpY2xlLCNhdXRoMC13aWRnZXQgYXNpZGUsI2F1dGgwLXdpZGdldCBkZXRhaWxzLCNhdXRoMC13aWRnZXQgZmlnY2FwdGlvbiwjYXV0aDAtd2lkZ2V0IGZpZ3VyZSwjYXV0aDAtd2lkZ2V0IGZvb3RlciwjYXV0aDAtd2lkZ2V0IGhlYWRlciwjYXV0aDAtd2lkZ2V0IGhncm91cCwjYXV0aDAtd2lkZ2V0IG5hdiwjYXV0aDAtd2lkZ2V0IHNlY3Rpb24sI2F1dGgwLXdpZGdldCBzdW1tYXJ5e2Rpc3BsYXk6YmxvY2t9I2F1dGgwLXdpZGdldCBhdWRpbywjYXV0aDAtd2lkZ2V0IGNhbnZhcywjYXV0aDAtd2lkZ2V0IHZpZGVve2Rpc3BsYXk6aW5saW5lLWJsb2NrOypkaXNwbGF5OmlubGluZTsqem9vbToxfSNhdXRoMC13aWRnZXQgYXVkaW86bm90KFtjb250cm9sc10pe2Rpc3BsYXk6bm9uZTtoZWlnaHQ6MH0jYXV0aDAtd2lkZ2V0IFtoaWRkZW5de2Rpc3BsYXk6bm9uZX0jYXV0aDAtd2lkZ2V0IGh0bWx7Zm9udC1zaXplOjEwMCU7LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OjEwMCU7LW1zLXRleHQtc2l6ZS1hZGp1c3Q6MTAwJX0jYXV0aDAtd2lkZ2V0IGh0bWwsI2F1dGgwLXdpZGdldCBidXR0b24sI2F1dGgwLXdpZGdldCBpbnB1dCwjYXV0aDAtd2lkZ2V0IHNlbGVjdCwjYXV0aDAtd2lkZ2V0IHRleHRhcmVhLCNhdXRoMC13aWRnZXQgaDEsI2F1dGgwLXdpZGdldCBoMiwjYXV0aDAtd2lkZ2V0IHNwYW4sI2F1dGgwLXdpZGdldCBhe2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWZ9I2F1dGgwLXdpZGdldCBib2R5e21hcmdpbjowfSNhdXRoMC13aWRnZXQgYTpmb2N1c3tvdXRsaW5lOnRoaW4gZG90dGVkfSNhdXRoMC13aWRnZXQgYTphY3RpdmUsI2F1dGgwLXdpZGdldCBhOmhvdmVye291dGxpbmU6MH0jYXV0aDAtd2lkZ2V0IGgxe2ZvbnQtc2l6ZToyZW07bWFyZ2luOi42N2VtIDB9I2F1dGgwLXdpZGdldCBoMntmb250LXNpemU6MS41ZW07bWFyZ2luOi44M2VtIDB9I2F1dGgwLXdpZGdldCBoM3tmb250LXNpemU6MS4xN2VtO21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGg0e2ZvbnQtc2l6ZToxZW07bWFyZ2luOjEuMzNlbSAwfSNhdXRoMC13aWRnZXQgaDV7Zm9udC1zaXplOi44M2VtO21hcmdpbjoxLjY3ZW0gMH0jYXV0aDAtd2lkZ2V0IGg2e2ZvbnQtc2l6ZTouNzVlbTttYXJnaW46Mi4zM2VtIDB9I2F1dGgwLXdpZGdldCBhYmJyW3RpdGxlXXtib3JkZXItYm90dG9tOjFweCBkb3R0ZWR9I2F1dGgwLXdpZGdldCBiLCNhdXRoMC13aWRnZXQgc3Ryb25ne2ZvbnQtd2VpZ2h0OmJvbGR9I2F1dGgwLXdpZGdldCBibG9ja3F1b3Rle21hcmdpbjoxZW0gNDBweH0jYXV0aDAtd2lkZ2V0IGRmbntmb250LXN0eWxlOml0YWxpY30jYXV0aDAtd2lkZ2V0IG1hcmt7YmFja2dyb3VuZDojZmYwO2NvbG9yOiMwMDB9I2F1dGgwLXdpZGdldCBwLCNhdXRoMC13aWRnZXQgcHJle21hcmdpbjoxZW0gMH0jYXV0aDAtd2lkZ2V0IGNvZGUsI2F1dGgwLXdpZGdldCBrYmQsI2F1dGgwLXdpZGdldCBwcmUsI2F1dGgwLXdpZGdldCBzYW1we2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtfZm9udC1mYW1pbHk6J2NvdXJpZXIgbmV3Jyxtb25vc3BhY2U7Zm9udC1zaXplOjFlbX0jYXV0aDAtd2lkZ2V0IHByZXt3aGl0ZS1zcGFjZTpwcmU7d2hpdGUtc3BhY2U6cHJlLXdyYXA7d29yZC13cmFwOmJyZWFrLXdvcmR9I2F1dGgwLXdpZGdldCBxe3F1b3Rlczpub25lfSNhdXRoMC13aWRnZXQgcTpiZWZvcmUsI2F1dGgwLXdpZGdldCBxOmFmdGVye2NvbnRlbnQ6Jyc7Y29udGVudDpub25lfSNhdXRoMC13aWRnZXQgc21hbGx7Zm9udC1zaXplOjgwJX0jYXV0aDAtd2lkZ2V0IHN1YiwjYXV0aDAtd2lkZ2V0IHN1cHtmb250LXNpemU6NzUlO2xpbmUtaGVpZ2h0OjA7cG9zaXRpb246cmVsYXRpdmU7dmVydGljYWwtYWxpZ246YmFzZWxpbmV9I2F1dGgwLXdpZGdldCBzdXB7dG9wOi0wLjVlbX0jYXV0aDAtd2lkZ2V0IHN1Yntib3R0b206LTAuMjVlbX0jYXV0aDAtd2lkZ2V0IGRsLCNhdXRoMC13aWRnZXQgbWVudSwjYXV0aDAtd2lkZ2V0IG9sLCNhdXRoMC13aWRnZXQgdWx7bWFyZ2luOjFlbSAwfSNhdXRoMC13aWRnZXQgZGR7bWFyZ2luOjAgMCAwIDQwcHh9I2F1dGgwLXdpZGdldCBtZW51LCNhdXRoMC13aWRnZXQgb2wsI2F1dGgwLXdpZGdldCB1bHtwYWRkaW5nOjAgMCAwIDQwcHh9I2F1dGgwLXdpZGdldCBuYXYgdWwsI2F1dGgwLXdpZGdldCBuYXYgb2x7bGlzdC1zdHlsZTpub25lO2xpc3Qtc3R5bGUtaW1hZ2U6bm9uZX0jYXV0aDAtd2lkZ2V0IGltZ3tib3JkZXI6MDstbXMtaW50ZXJwb2xhdGlvbi1tb2RlOmJpY3ViaWN9I2F1dGgwLXdpZGdldCBzdmc6bm90KDpyb290KXtvdmVyZmxvdzpoaWRkZW59I2F1dGgwLXdpZGdldCBmaWd1cmV7bWFyZ2luOjB9I2F1dGgwLXdpZGdldCBmb3Jte21hcmdpbjowfSNhdXRoMC13aWRnZXQgZmllbGRzZXR7Ym9yZGVyOjFweCBzb2xpZCAjYzBjMGMwO21hcmdpbjowIDJweDtwYWRkaW5nOi4zNWVtIC42MjVlbSAuNzVlbX0jYXV0aDAtd2lkZ2V0IGxlZ2VuZHtib3JkZXI6MDtwYWRkaW5nOjA7d2hpdGUtc3BhY2U6bm9ybWFsOyptYXJnaW4tbGVmdDotN3B4fSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXQsI2F1dGgwLXdpZGdldCBzZWxlY3QsI2F1dGgwLXdpZGdldCB0ZXh0YXJlYXtmb250LXNpemU6MTAwJTttYXJnaW46MDt2ZXJ0aWNhbC1hbGlnbjpiYXNlbGluZTsqdmVydGljYWwtYWxpZ246bWlkZGxlfSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaW5wdXR7bGluZS1oZWlnaHQ6bm9ybWFsfSNhdXRoMC13aWRnZXQgYnV0dG9uLCNhdXRoMC13aWRnZXQgaHRtbCBpbnB1dFt0eXBlPVxcXCJidXR0b25cXFwiXSwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInJlc2V0XFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzdWJtaXRcXFwiXXstd2Via2l0LWFwcGVhcmFuY2U6YnV0dG9uO2N1cnNvcjpwb2ludGVyOypvdmVyZmxvdzp2aXNpYmxlfSNhdXRoMC13aWRnZXQgYnV0dG9uW2Rpc2FibGVkXSwjYXV0aDAtd2lkZ2V0IGlucHV0W2Rpc2FibGVkXXtjdXJzb3I6ZGVmYXVsdH0jYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0sI2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJde2JveC1zaXppbmc6Ym9yZGVyLWJveDtwYWRkaW5nOjA7KmhlaWdodDoxM3B4Oyp3aWR0aDoxM3B4fSNhdXRoMC13aWRnZXQgaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl17LXdlYmtpdC1hcHBlYXJhbmNlOnRleHRmaWVsZDstbW96LWJveC1zaXppbmc6Y29udGVudC1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O2JveC1zaXppbmc6Y29udGVudC1ib3h9I2F1dGgwLXdpZGdldCBpbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbiwjYXV0aDAtd2lkZ2V0IGlucHV0W3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uey13ZWJraXQtYXBwZWFyYW5jZTpub25lfSNhdXRoMC13aWRnZXQgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLCNhdXRoMC13aWRnZXQgaW5wdXQ6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjA7cGFkZGluZzowfSNhdXRoMC13aWRnZXQgdGV4dGFyZWF7b3ZlcmZsb3c6YXV0bzt2ZXJ0aWNhbC1hbGlnbjp0b3B9I2F1dGgwLXdpZGdldCB0YWJsZXtib3JkZXItY29sbGFwc2U6Y29sbGFwc2U7Ym9yZGVyLXNwYWNpbmc6MH1cIik7XG5cbmlmIChnbG9iYWwud2luZG93KSB7XG4gIGdsb2JhbC53aW5kb3cuQXV0aDBXaWRnZXQgPSBBdXRoMFdpZGdldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMFdpZGdldDtcbiIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9O3ZhciBhc3NlcnRfcmVxdWlyZWQgICA9IHJlcXVpcmUoJy4vbGliL2Fzc2VydF9yZXF1aXJlZCcpO1xudmFyIGJhc2U2NF91cmxfZGVjb2RlID0gcmVxdWlyZSgnLi9saWIvYmFzZTY0X3VybF9kZWNvZGUnKTtcbnZhciBxcyAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ3FzJyk7XG52YXIgcmVxd2VzdCAgICAgICAgICAgPSByZXF1aXJlKCdyZXF3ZXN0Jyk7XG5cbnZhciBqc29ucCAgICAgICAgICAgICA9IHJlcXVpcmUoJ2pzb25wJyk7XG5cbnZhciB1c2VfanNvbnAgICAgICAgICA9IHJlcXVpcmUoJy4vbGliL3VzZV9qc29ucCcpO1xudmFyIExvZ2luRXJyb3IgICAgICAgID0gcmVxdWlyZSgnLi9saWIvTG9naW5FcnJvcicpO1xudmFyIGpzb25fcGFyc2UgICAgICAgID0gcmVxdWlyZSgnLi9saWIvanNvbl9wYXJzZScpO1xuXG5mdW5jdGlvbiBBdXRoMCAob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQXV0aDApKSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoMChvcHRpb25zKTtcbiAgfVxuXG4gIGFzc2VydF9yZXF1aXJlZChvcHRpb25zLCAnY2xpZW50SUQnKTtcbiAgYXNzZXJ0X3JlcXVpcmVkKG9wdGlvbnMsICdjYWxsYmFja1VSTCcpO1xuICBhc3NlcnRfcmVxdWlyZWQob3B0aW9ucywgJ2RvbWFpbicpO1xuXG4gIHRoaXMuX2NsaWVudElEID0gb3B0aW9ucy5jbGllbnRJRDtcbiAgdGhpcy5fY2FsbGJhY2tVUkwgPSBvcHRpb25zLmNhbGxiYWNrVVJMO1xuICB0aGlzLl9kb21haW4gPSBvcHRpb25zLmRvbWFpbjtcbiAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgIHRoaXMucGFyc2VIYXNoKG9wdGlvbnMuc3VjY2Vzcyk7XG4gIH1cbiAgdGhpcy5fZmFpbHVyZSA9IG9wdGlvbnMuZmFpbHVyZTtcbn1cblxuQXV0aDAucHJvdG90eXBlLl9yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgZ2xvYmFsLndpbmRvdy5sb2NhdGlvbiA9IHVybDtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5fcmVuZGVyQW5kU3VibWl0V1NGZWRGb3JtID0gZnVuY3Rpb24gKGZvcm1IdG1sKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGZvcm1IdG1sO1xuICB2YXIgZm9ybSA9IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KS5jaGlsZHJlblswXTtcbiAgZm9ybS5zdWJtaXQoKTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5wYXJzZUhhc2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYoIXdpbmRvdy5sb2NhdGlvbi5oYXNoLm1hdGNoKC9hY2Nlc3NfdG9rZW4vKSkgcmV0dXJuO1xuICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgdmFyIHBhcnNlZF9xcyA9IHFzLnBhcnNlKGhhc2gpO1xuICB2YXIgaWRfdG9rZW4gPSBwYXJzZWRfcXMuaWRfdG9rZW47XG4gIHZhciBlbmNvZGVkID0gaWRfdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgdmFyIHByb2YgPSBqc29uX3BhcnNlKGJhc2U2NF91cmxfZGVjb2RlKGVuY29kZWQpKTtcbiAgY2FsbGJhY2socHJvZiwgaWRfdG9rZW4sIHBhcnNlZF9xcy5hY2Nlc3NfdG9rZW4sIHBhcnNlZF9xcy5zdGF0ZSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuc2lnbnVwID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgcXVlcnkuZW1haWwgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWw7XG4gIHF1ZXJ5LnBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZDtcblxuICBxdWVyeS50ZW5hbnQgPSB0aGlzLl9kb21haW4uc3BsaXQoJy4nKVswXTtcblxuICBmdW5jdGlvbiBzdWNjZXNzICgpIHtcbiAgICBpZiAoJ2F1dG9fbG9naW4nIGluIG9wdGlvbnMgJiYgIW9wdGlvbnMuYXV0b19sb2dpbikge1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLmxvZ2luKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWwgKHN0YXR1cywgcmVzcCkge1xuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHN0YXR1cywgcmVzcCk7XG4gICAgaWYgKGNhbGxiYWNrKSAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgaWYgKHNlbGYuX2ZhaWx1cmUpIHJldHVybiBzZWxmLl9mYWlsdXJlKGVycm9yKTtcbiAgfVxuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL3NpZ251cD8nICsgcXMuc3RyaW5naWZ5KHF1ZXJ5KSwge1xuICAgICAgcGFyYW06ICdjYngnLFxuICAgICAgdGltZW91dDogMTUwMDBcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBmYWlsKDAsIGVycik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcC5zdGF0dXMgPT0gMjAwID9cbiAgICAgICAgICAgICAgc3VjY2VzcygpIDpcbiAgICAgICAgICAgICAgZmFpbChyZXNwLnN0YXR1cywgcmVzcC5lcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxd2VzdCh7XG4gICAgdXJsOiAgICAgJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9zaWdudXAnLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICBjcm9zc09yaWdpbjogdHJ1ZVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBmYWlsKGVyci5zdGF0dXMsIGVyci5yZXNwb25zZVRleHQpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5sb2dpbiA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAob3B0aW9ucy51c2VybmFtZSB8fCBvcHRpb25zLmVtYWlsKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW5XaXRoRGJDb25uZWN0aW9uKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICB0aGlzLl9yZWRpcmVjdCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9hdXRob3JpemU/JyArIHFzLnN0cmluZ2lmeShxdWVyeSkpO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luV2l0aERiQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHF1ZXJ5ID0ge1xuICAgIHJlc3BvbnNlX3R5cGU6ICd0b2tlbicsXG4gICAgY2xpZW50X2lkOiAgICAgdGhpcy5fY2xpZW50SUQsXG4gICAgY29ubmVjdGlvbjogICAgb3B0aW9ucy5jb25uZWN0aW9uLFxuICAgIHJlZGlyZWN0X3VyaTogIHRoaXMuX2NhbGxiYWNrVVJMLFxuICAgIHNjb3BlOiAgICAgICAgICdvcGVuaWQgcHJvZmlsZSdcbiAgfTtcblxuICBpZiAob3B0aW9ucy5zdGF0ZSkge1xuICAgIHF1ZXJ5LnN0YXRlID0gb3B0aW9ucy5zdGF0ZTtcbiAgfVxuXG4gIHF1ZXJ5LnVzZXJuYW1lID0gb3B0aW9ucy51c2VybmFtZSB8fCBvcHRpb25zLmVtYWlsO1xuICBxdWVyeS5wYXNzd29yZCA9IG9wdGlvbnMucGFzc3dvcmQ7XG5cbiAgcXVlcnkudGVuYW50ID0gdGhpcy5fZG9tYWluLnNwbGl0KCcuJylbMF07XG5cbiAgZnVuY3Rpb24gcmV0dXJuX2Vycm9yIChlcnJvcikge1xuICAgIGlmIChjYWxsYmFjaykgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICAgIGlmIChzZWxmLl9mYWlsdXJlKSByZXR1cm4gc2VsZi5fZmFpbHVyZShlcnJvcik7XG4gIH1cblxuICBpZiAodXNlX2pzb25wKCkpIHtcbiAgICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9sb2dpbj8nICsgcXMuc3RyaW5naWZ5KHF1ZXJ5KSwge1xuICAgICAgcGFyYW06ICdjYngnLFxuICAgICAgdGltZW91dDogMTUwMDBcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZXR1cm5fZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmKCdlcnJvcicgaW4gcmVzcCkge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgTG9naW5FcnJvcihyZXNwLnN0YXR1cywgcmVzcC5lcnJvcik7XG4gICAgICAgIHJldHVybiByZXR1cm5fZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgICAgc2VsZi5fcmVuZGVyQW5kU3VibWl0V1NGZWRGb3JtKHJlc3AuZm9ybSk7XG4gICAgfSk7XG4gIH1cblxuICByZXF3ZXN0KHtcbiAgICB1cmw6ICAgICAnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL2xvZ2luJyxcbiAgICBtZXRob2Q6ICAncG9zdCcsXG4gICAgdHlwZTogICAgJ2h0bWwnLFxuICAgIGRhdGE6ICAgIHF1ZXJ5LFxuICAgIGNyb3NzT3JpZ2luOiB0cnVlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcCk7XG4gICAgfVxuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgZXIgPSBlcnI7XG4gICAgaWYgKCFlci5zdGF0dXMgfHwgZXIuc3RhdHVzID09PSAwKSB7IC8vaWUxMCB0cmlja1xuICAgICAgZXIgPSB7fTtcbiAgICAgIGVyLnN0YXR1cyA9IDQwMTtcbiAgICAgIGVyLnJlc3BvbnNlVGV4dCA9IHtcbiAgICAgICAgY29kZTogJ2ludmFsaWRfdXNlcl9wYXNzd29yZCdcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKGVyLnN0YXR1cywgZXIucmVzcG9uc2VUZXh0KTtcbiAgICByZXR1cm4gcmV0dXJuX2Vycm9yKGVycm9yKTtcbiAgfSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuZ2V0U1NPRGF0YSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvdXNlci9zc29kYXRhJywge1xuICAgIHBhcmFtOiAnY2J4JyxcbiAgICB0aW1lb3V0OiAxNTAwMFxuICB9LCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgY2FsbGJhY2sobnVsbCwgZXJyID/CoHt9IDogcmVzcCk7IC8vIEFsd2F5cyByZXR1cm4gT0ssIHJlZ2FyZGxlc3Mgb2YgYW55IGVycm9yc1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5nZXRDb25uZWN0aW9ucyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4ganNvbnAoJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvcHVibGljL2FwaS8nICsgdGhpcy5fY2xpZW50SUQgKyAnL2Nvbm5lY3Rpb25zJywge1xuICAgIHBhcmFtOiAnY2J4JyxcbiAgICB0aW1lb3V0OiAxNTAwMFxuICB9LCBjYWxsYmFjayk7XG59O1xuXG5pZiAoZ2xvYmFsLndpbmRvdykge1xuICBnbG9iYWwud2luZG93LkF1dGgwID0gQXV0aDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aDA7IiwidmFyIGpzb25fcGFyc2UgPSByZXF1aXJlKCcuL2pzb25fcGFyc2UnKTtcblxuZnVuY3Rpb24gTG9naW5FcnJvcihzdGF0dXMsIGRldGFpbHMpIHtcbiAgdmFyIG9iajtcblxuICBpZiAodHlwZW9mIGRldGFpbHMgPT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgb2JqID0ganNvbl9wYXJzZShkZXRhaWxzKTtcbiAgICB9IGNhdGNoIChlcikge1xuICAgICAgb2JqID0ge21lc3NhZ2U6IGRldGFpbHN9OyAgICAgIFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvYmogPSBkZXRhaWxzO1xuICB9XG5cbiAgdmFyIGVyciA9IEVycm9yLmNhbGwodGhpcywgb2JqLmRlc2NyaXB0aW9uIHx8IG9iai5tZXNzYWdlIHx8IG9iai5lcnJvcik7XG5cbiAgZXJyLnN0YXR1cyA9IHN0YXR1cztcbiAgZXJyLm5hbWUgPSBvYmouY29kZTtcbiAgZXJyLmNvZGUgPSBvYmouY29kZTtcbiAgZXJyLmRldGFpbHMgPSBvYmo7XG4gIFxuICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgZXJyLmNvZGUgPSBcIlVua25vd25cIjtcbiAgICBlcnIubWVzc2FnZSA9IFwiVW5rbm93biBlcnJvci5cIjtcbiAgfVxuXG4gIHJldHVybiBlcnI7XG59XG5cbmlmIChPYmplY3QgJiYgT2JqZWN0LmNyZWF0ZSkge1xuICBMb2dpbkVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7IFxuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBMb2dpbkVycm9yIH0gXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luRXJyb3I7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqLCBwcm9wKSB7XG4gIGlmICghb2JqW3Byb3BdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHByb3AgKyAnIGlzIHJlcXVpcmVkLicpO1xuICB9XG59OyIsInZhciBCYXNlNjQgPSByZXF1aXJlKCdCYXNlNjQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKFwiLVwiLCBcIitcIikucmVwbGFjZShcIl9cIiwgXCIvXCIpO1xuICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgY2FzZSAwOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgb3V0cHV0ICs9IFwiPT1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIG91dHB1dCArPSBcIj1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBcIklsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyFcIjtcbiAgfVxuICByZXR1cm4gQmFzZTY0LmF0b2Iob3V0cHV0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiB3aW5kb3cuSlNPTiA/IHdpbmRvdy5KU09OLnBhcnNlKHN0cikgOiBldmFsKCcoJyArIHN0ciArICcpJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgeGhyID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0ID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsO1xuICBcbiAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gJ1hEb21haW5SZXF1ZXN0JyBpbiB3aW5kb3cgJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonO1xufTsiLCI7KGZ1bmN0aW9uICgpIHtcblxuICB2YXJcbiAgICBvYmplY3QgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiB0aGlzLCAvLyAjODogd2ViIHdvcmtlcnNcbiAgICBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPScsXG4gICAgSU5WQUxJRF9DSEFSQUNURVJfRVJSID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGZhYnJpY2F0ZSBhIHN1aXRhYmxlIGVycm9yIG9iamVjdFxuICAgICAgdHJ5IHsgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnJCcpOyB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHsgcmV0dXJuIGVycm9yOyB9fSgpKTtcblxuICAvLyBlbmNvZGVyXG4gIC8vIFtodHRwczovL2dpc3QuZ2l0aHViLmNvbS85OTkxNjZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vbmlnbmFnXVxuICBvYmplY3QuYnRvYSB8fCAoXG4gIG9iamVjdC5idG9hID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgZm9yIChcbiAgICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyXG4gICAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycywgb3V0cHV0ID0gJyc7XG4gICAgICAvLyBpZiB0aGUgbmV4dCBpbnB1dCBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAgIC8vICAgY2hhbmdlIHRoZSBtYXBwaW5nIHRhYmxlIHRvIFwiPVwiXG4gICAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG4gICAgICBpbnB1dC5jaGFyQXQoaWR4IHwgMCkgfHwgKG1hcCA9ICc9JywgaWR4ICUgMSk7XG4gICAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuICAgICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICAgKSB7XG4gICAgICBjaGFyQ29kZSA9IGlucHV0LmNoYXJDb2RlQXQoaWR4ICs9IDMvNCk7XG4gICAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB0aHJvdyBJTlZBTElEX0NIQVJBQ1RFUl9FUlI7XG4gICAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbiAgLy8gZGVjb2RlclxuICAvLyBbaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTAyMDM5Nl0gYnkgW2h0dHBzOi8vZ2l0aHViLmNvbS9hdGtdXG4gIG9iamVjdC5hdG9iIHx8IChcbiAgb2JqZWN0LmF0b2IgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKVxuICAgIGlmIChpbnB1dC5sZW5ndGggJSA0ID09IDEpIHRocm93IElOVkFMSURfQ0hBUkFDVEVSX0VSUjtcbiAgICBmb3IgKFxuICAgICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJzXG4gICAgICB2YXIgYmMgPSAwLCBicywgYnVmZmVyLCBpZHggPSAwLCBvdXRwdXQgPSAnJztcbiAgICAgIC8vIGdldCBuZXh0IGNoYXJhY3RlclxuICAgICAgYnVmZmVyID0gaW5wdXQuY2hhckF0KGlkeCsrKTtcbiAgICAgIC8vIGNoYXJhY3RlciBmb3VuZCBpbiB0YWJsZT8gaW5pdGlhbGl6ZSBiaXQgc3RvcmFnZSBhbmQgYWRkIGl0cyBhc2NpaSB2YWx1ZTtcbiAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgLy8gYW5kIGlmIG5vdCBmaXJzdCBvZiBlYWNoIDQgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gY29udmVydCB0aGUgZmlyc3QgOCBiaXRzIHRvIG9uZSBhc2NpaSBjaGFyYWN0ZXJcbiAgICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICAgKSB7XG4gICAgICAvLyB0cnkgdG8gZmluZCBjaGFyYWN0ZXIgaW4gdGFibGUgKDAtNjMsIG5vdCBmb3VuZCA9PiAtMSlcbiAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSk7XG5cbn0oKSk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2pzb25wJyk7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBqc29ucDtcblxuLyoqXG4gKiBDYWxsYmFjayBpbmRleC5cbiAqL1xuXG52YXIgY291bnQgPSAwO1xuXG4vKipcbiAqIE5vb3AgZnVuY3Rpb24uXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogSlNPTlAgaGFuZGxlclxuICpcbiAqIE9wdGlvbnM6XG4gKiAgLSBwYXJhbSB7U3RyaW5nfSBxcyBwYXJhbWV0ZXIgKGBjYWxsYmFja2ApXG4gKiAgLSB0aW1lb3V0IHtOdW1iZXJ9IGhvdyBsb25nIGFmdGVyIGEgdGltZW91dCBlcnJvciBpcyBlbWl0dGVkIChgNjAwMDBgKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBvcHRpb25hbCBvcHRpb25zIC8gY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbmFsIGNhbGxiYWNrXG4gKi9cblxuZnVuY3Rpb24ganNvbnAodXJsLCBvcHRzLCBmbil7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBvcHRzKSB7XG4gICAgZm4gPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHZhciBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIHBhcmFtID0gb3B0cy5wYXJhbSB8fCAnY2FsbGJhY2snO1xuICB2YXIgdGltZW91dCA9IG51bGwgIT0gb3B0cy50aW1lb3V0ID8gb3B0cy50aW1lb3V0IDogNjAwMDA7XG4gIHZhciBlbmMgPSBlbmNvZGVVUklDb21wb25lbnQ7XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gIHZhciBzY3JpcHQ7XG4gIHZhciB0aW1lcjtcblxuICAvLyBnZW5lcmF0ZSBhIHVuaXF1ZSBpZCBmb3IgdGhpcyByZXF1ZXN0XG4gIHZhciBpZCA9IGNvdW50Kys7XG5cbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIGZuICYmIGZuKG5ldyBFcnJvcignVGltZW91dCcpKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKXtcbiAgICB0YXJnZXQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIHdpbmRvd1snX19qcCcgKyBpZF0gPSBub29wO1xuICB9XG5cbiAgd2luZG93WydfX2pwJyArIGlkXSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGRlYnVnKCdqc29ucCBnb3QnLCBkYXRhKTtcbiAgICBpZiAodGltZXIpIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgY2xlYW51cCgpO1xuICAgIGZuICYmIGZuKG51bGwsIGRhdGEpO1xuICB9O1xuXG4gIC8vIGFkZCBxcyBjb21wb25lbnRcbiAgdXJsICs9ICh+dXJsLmluZGV4T2YoJz8nKSA/ICcmJyA6ICc/JykgKyBwYXJhbSArICc9JyArIGVuYygnX19qcCcgKyBpZCArICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoJz8mJywgJz8nKTtcblxuICBkZWJ1ZygnanNvbnAgcmVxIFwiJXNcIicsIHVybCk7XG5cbiAgLy8gY3JlYXRlIHNjcmlwdFxuICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgdGFyZ2V0KTtcbn07XG4iLCJcbi8qKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZGVidWc7XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtUeXBlfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWJ1ZyhuYW1lKSB7XG4gIGlmICghZGVidWcuZW5hYmxlZChuYW1lKSkgcmV0dXJuIGZ1bmN0aW9uKCl7fTtcblxuICByZXR1cm4gZnVuY3Rpb24oZm10KXtcbiAgICB2YXIgY3VyciA9IG5ldyBEYXRlO1xuICAgIHZhciBtcyA9IGN1cnIgLSAoZGVidWdbbmFtZV0gfHwgY3Vycik7XG4gICAgZGVidWdbbmFtZV0gPSBjdXJyO1xuXG4gICAgZm10ID0gbmFtZVxuICAgICAgKyAnICdcbiAgICAgICsgZm10XG4gICAgICArICcgKycgKyBkZWJ1Zy5odW1hbml6ZShtcyk7XG5cbiAgICAvLyBUaGlzIGhhY2tlcnkgaXMgcmVxdWlyZWQgZm9yIElFOFxuICAgIC8vIHdoZXJlIGBjb25zb2xlLmxvZ2AgZG9lc24ndCBoYXZlICdhcHBseSdcbiAgICB3aW5kb3cuY29uc29sZVxuICAgICAgJiYgY29uc29sZS5sb2dcbiAgICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcy5cbiAqL1xuXG5kZWJ1Zy5uYW1lcyA9IFtdO1xuZGVidWcuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmVuYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdHJ5IHtcbiAgICBsb2NhbFN0b3JhZ2UuZGVidWcgPSBuYW1lO1xuICB9IGNhdGNoKGUpe31cblxuICB2YXIgc3BsaXQgPSAobmFtZSB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKVxuICAgICwgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBuYW1lID0gc3BsaXRbaV0ucmVwbGFjZSgnKicsICcuKj8nKTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy0nKSB7XG4gICAgICBkZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZS5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWJ1Zy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZSArICckJykpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmRpc2FibGUgPSBmdW5jdGlvbigpe1xuICBkZWJ1Zy5lbmFibGUoJycpO1xufTtcblxuLyoqXG4gKiBIdW1hbml6ZSB0aGUgZ2l2ZW4gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbVxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZGVidWcuaHVtYW5pemUgPSBmdW5jdGlvbihtcykge1xuICB2YXIgc2VjID0gMTAwMFxuICAgICwgbWluID0gNjAgKiAxMDAwXG4gICAgLCBob3VyID0gNjAgKiBtaW47XG5cbiAgaWYgKG1zID49IGhvdXIpIHJldHVybiAobXMgLyBob3VyKS50b0ZpeGVkKDEpICsgJ2gnO1xuICBpZiAobXMgPj0gbWluKSByZXR1cm4gKG1zIC8gbWluKS50b0ZpeGVkKDEpICsgJ20nO1xuICBpZiAobXMgPj0gc2VjKSByZXR1cm4gKG1zIC8gc2VjIHwgMCkgKyAncyc7XG4gIHJldHVybiBtcyArICdtcyc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZGVidWcuZW5hYmxlZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGRlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRlYnVnLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGRlYnVnLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBwZXJzaXN0XG5cbmlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSBkZWJ1Zy5lbmFibGUobG9jYWxTdG9yYWdlLmRlYnVnKTtcbiIsIi8qKlxuICogT2JqZWN0I3RvU3RyaW5nKCkgcmVmIGZvciBzdHJpbmdpZnkoKS5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIE9iamVjdCNoYXNPd25Qcm9wZXJ0eSByZWZcbiAqL1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIHNlZSBpc3N1ZSAjNzBcbiAqL1xudmFyIGlzUmVzdG9yYWJsZVByb3RvID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG87XG5cbiAgaWYgKCFPYmplY3QuY3JlYXRlKSByZXR1cm4gZmFsc2U7XG5cbiAgbyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIG8uX19wcm90b19fID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICByZXR1cm4gby5oYXNPd25Qcm9wZXJ0eSA9PT0gaGFzT3duUHJvcGVydHk7XG59KSgpO1xuXG4vKipcbiAqIEFycmF5I2luZGV4T2Ygc2hpbS5cbiAqL1xuXG52YXIgaW5kZXhPZiA9IHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJ1xuICA/IGZ1bmN0aW9uKGFyciwgZWwpIHsgcmV0dXJuIGFyci5pbmRleE9mKGVsKTsgfVxuICA6IGZ1bmN0aW9uKGFyciwgZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJyID09ICdzdHJpbmcnICYmIHR5cGVvZiBcImFcIlswXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcnIgPSBhcnIuc3BsaXQoJycpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFycltpXSA9PT0gZWwpIHJldHVybiBpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbi8qKlxuICogQXJyYXkuaXNBcnJheSBzaGltLlxuICovXG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuLyoqXG4gKiBPYmplY3Qua2V5cyBzaGltLlxuICovXG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbi8qKlxuICogQXJyYXkjZm9yRWFjaCBzaGltLlxuICovXG5cbnZhciBmb3JFYWNoID0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nXG4gID8gZnVuY3Rpb24oYXJyLCBmbikgeyByZXR1cm4gYXJyLmZvckVhY2goZm4pOyB9XG4gIDogZnVuY3Rpb24oYXJyLCBmbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGZuKGFycltpXSk7XG4gICAgfTtcblxuLyoqXG4gKiBBcnJheSNyZWR1Y2Ugc2hpbS5cbiAqL1xuXG52YXIgcmVkdWNlID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCkge1xuICBpZiAodHlwZW9mIGFyci5yZWR1Y2UgPT09ICdmdW5jdGlvbicpIHJldHVybiBhcnIucmVkdWNlKGZuLCBpbml0aWFsKTtcbiAgdmFyIHJlcyA9IGluaXRpYWw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSByZXMgPSBmbihyZXMsIGFycltpXSk7XG4gIHJldHVybiByZXM7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIG51bGxhcnkgb2JqZWN0IGlmIHBvc3NpYmxlXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KCkge1xuICByZXR1cm4gaXNSZXN0b3JhYmxlUHJvdG9cbiAgICA/IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICA6IHt9O1xufVxuXG4vKipcbiAqIENhY2hlIG5vbi1pbnRlZ2VyIHRlc3QgcmVnZXhwLlxuICovXG5cbnZhciBpc2ludCA9IC9eWzAtOV0rJC87XG5cbmZ1bmN0aW9uIHByb21vdGUocGFyZW50LCBrZXkpIHtcbiAgaWYgKHBhcmVudFtrZXldLmxlbmd0aCA9PSAwKSByZXR1cm4gcGFyZW50W2tleV0gPSBjcmVhdGVPYmplY3QoKTtcbiAgdmFyIHQgPSBjcmVhdGVPYmplY3QoKTtcbiAgZm9yICh2YXIgaSBpbiBwYXJlbnRba2V5XSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmVudFtrZXldLCBpKSkge1xuICAgICAgdFtpXSA9IHBhcmVudFtrZXldW2ldO1xuICAgIH1cbiAgfVxuICBwYXJlbnRba2V5XSA9IHQ7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBwYXJzZShwYXJ0cywgcGFyZW50LCBrZXksIHZhbCkge1xuICB2YXIgcGFydCA9IHBhcnRzLnNoaWZ0KCk7XG4gIC8vIGVuZFxuICBpZiAoIXBhcnQpIHtcbiAgICBpZiAoaXNBcnJheShwYXJlbnRba2V5XSkpIHtcbiAgICAgIHBhcmVudFtrZXldLnB1c2godmFsKTtcbiAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICB9XG4gICAgLy8gYXJyYXlcbiAgfSBlbHNlIHtcbiAgICB2YXIgb2JqID0gcGFyZW50W2tleV0gPSBwYXJlbnRba2V5XSB8fCBbXTtcbiAgICBpZiAoJ10nID09IHBhcnQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgaWYgKCcnICE9IHZhbCkgb2JqLnB1c2godmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIG9iaikge1xuICAgICAgICBvYmpbb2JqZWN0S2V5cyhvYmopLmxlbmd0aF0gPSB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmogPSBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICAgIH1cbiAgICAgIC8vIHByb3BcbiAgICB9IGVsc2UgaWYgKH5pbmRleE9mKHBhcnQsICddJykpIHtcbiAgICAgIHBhcnQgPSBwYXJ0LnN1YnN0cigwLCBwYXJ0Lmxlbmd0aCAtIDEpO1xuICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgICAgLy8ga2V5XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSBwYXJlbnQga2V5L3ZhbCBwYWlyLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlKHBhcmVudCwga2V5LCB2YWwpe1xuICBpZiAofmluZGV4T2Yoa2V5LCAnXScpKSB7XG4gICAgdmFyIHBhcnRzID0ga2V5LnNwbGl0KCdbJylcbiAgICAgICwgbGVuID0gcGFydHMubGVuZ3RoXG4gICAgICAsIGxhc3QgPSBsZW4gLSAxO1xuICAgIHBhcnNlKHBhcnRzLCBwYXJlbnQsICdiYXNlJywgdmFsKTtcbiAgICAvLyBvcHRpbWl6ZVxuICB9IGVsc2Uge1xuICAgIGlmICghaXNpbnQudGVzdChrZXkpICYmIGlzQXJyYXkocGFyZW50LmJhc2UpKSB7XG4gICAgICB2YXIgdCA9IGNyZWF0ZU9iamVjdCgpO1xuICAgICAgZm9yICh2YXIgayBpbiBwYXJlbnQuYmFzZSkgdFtrXSA9IHBhcmVudC5iYXNlW2tdO1xuICAgICAgcGFyZW50LmJhc2UgPSB0O1xuICAgIH1cbiAgICBzZXQocGFyZW50LmJhc2UsIGtleSwgdmFsKTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8qKlxuICogQ29tcGFjdCBzcGFyc2UgYXJyYXlzLlxuICovXG5cbmZ1bmN0aW9uIGNvbXBhY3Qob2JqKSB7XG4gIGlmICgnb2JqZWN0JyAhPSB0eXBlb2Ygb2JqKSByZXR1cm4gb2JqO1xuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkge1xuICAgICAgICByZXQucHVzaChvYmpbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgb2JqW2tleV0gPSBjb21wYWN0KG9ialtrZXldKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogUmVzdG9yZSBPYmplY3QucHJvdG90eXBlLlxuICogc2VlIHB1bGwtcmVxdWVzdCAjNThcbiAqL1xuXG5mdW5jdGlvbiByZXN0b3JlUHJvdG8ob2JqKSB7XG4gIGlmICghaXNSZXN0b3JhYmxlUHJvdG8pIHJldHVybiBvYmo7XG4gIGlmIChpc0FycmF5KG9iaikpIHJldHVybiBvYmo7XG4gIGlmIChvYmogJiYgJ29iamVjdCcgIT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHJlc3RvcmVQcm90byhvYmpba2V5XSk7XG4gICAgfVxuICB9XG5cbiAgb2JqLl9fcHJvdG9fXyA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIG9iai5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZU9iamVjdChvYmope1xuICB2YXIgcmV0ID0geyBiYXNlOiB7fSB9O1xuXG4gIGZvckVhY2gob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihuYW1lKXtcbiAgICBtZXJnZShyZXQsIG5hbWUsIG9ialtuYW1lXSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb21wYWN0KHJldC5iYXNlKTtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gc3RyLlxuICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cil7XG4gIHZhciByZXQgPSByZWR1Y2UoU3RyaW5nKHN0cikuc3BsaXQoJyYnKSwgZnVuY3Rpb24ocmV0LCBwYWlyKXtcbiAgICB2YXIgZXFsID0gaW5kZXhPZihwYWlyLCAnPScpXG4gICAgICAsIGJyYWNlID0gbGFzdEJyYWNlSW5LZXkocGFpcilcbiAgICAgICwga2V5ID0gcGFpci5zdWJzdHIoMCwgYnJhY2UgfHwgZXFsKVxuICAgICAgLCB2YWwgPSBwYWlyLnN1YnN0cihicmFjZSB8fCBlcWwsIHBhaXIubGVuZ3RoKVxuICAgICAgLCB2YWwgPSB2YWwuc3Vic3RyKGluZGV4T2YodmFsLCAnPScpICsgMSwgdmFsLmxlbmd0aCk7XG5cbiAgICAvLyA/Zm9vXG4gICAgaWYgKCcnID09IGtleSkga2V5ID0gcGFpciwgdmFsID0gJyc7XG4gICAgaWYgKCcnID09IGtleSkgcmV0dXJuIHJldDtcblxuICAgIHJldHVybiBtZXJnZShyZXQsIGRlY29kZShrZXkpLCBkZWNvZGUodmFsKSk7XG4gIH0sIHsgYmFzZTogY3JlYXRlT2JqZWN0KCkgfSkuYmFzZTtcblxuICByZXR1cm4gcmVzdG9yZVByb3RvKGNvbXBhY3QocmV0KSk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHF1ZXJ5IGBzdHJgIG9yIGBvYmpgLCByZXR1cm5pbmcgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgfCB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHN0cil7XG4gIGlmIChudWxsID09IHN0ciB8fCAnJyA9PSBzdHIpIHJldHVybiB7fTtcbiAgcmV0dXJuICdvYmplY3QnID09IHR5cGVvZiBzdHJcbiAgICA/IHBhcnNlT2JqZWN0KHN0cilcbiAgICA6IHBhcnNlU3RyaW5nKHN0cik7XG59O1xuXG4vKipcbiAqIFR1cm4gdGhlIGdpdmVuIGBvYmpgIGludG8gYSBxdWVyeSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnZhciBzdHJpbmdpZnkgPSBleHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKG9iaiwgcHJlZml4KSB7XG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5QXJyYXkob2JqLCBwcmVmaXgpO1xuICB9IGVsc2UgaWYgKCdbb2JqZWN0IE9iamVjdF0nID09IHRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHJldHVybiBzdHJpbmdpZnlPYmplY3Qob2JqLCBwcmVmaXgpO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBvYmopIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5U3RyaW5nKG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvYmopKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0cmluZyhzdHIsIHByZWZpeCkge1xuICBpZiAoIXByZWZpeCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5naWZ5IGV4cGVjdHMgYW4gb2JqZWN0Jyk7XG4gIHJldHVybiBwcmVmaXggKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyKTtcbn1cblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBhcnJgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5QXJyYXkoYXJyLCBwcmVmaXgpIHtcbiAgdmFyIHJldCA9IFtdO1xuICBpZiAoIXByZWZpeCkgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5naWZ5IGV4cGVjdHMgYW4gb2JqZWN0Jyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgcmV0LnB1c2goc3RyaW5naWZ5KGFycltpXSwgcHJlZml4ICsgJ1snICsgaSArICddJykpO1xuICB9XG4gIHJldHVybiByZXQuam9pbignJicpO1xufVxuXG4vKipcbiAqIFN0cmluZ2lmeSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaW5naWZ5T2JqZWN0KG9iaiwgcHJlZml4KSB7XG4gIHZhciByZXQgPSBbXVxuICAgICwga2V5cyA9IG9iamVjdEtleXMob2JqKVxuICAgICwga2V5O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoJycgPT0ga2V5KSBjb250aW51ZTtcbiAgICBpZiAobnVsbCA9PSBvYmpba2V5XSkge1xuICAgICAgcmV0LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQucHVzaChzdHJpbmdpZnkob2JqW2tleV0sIHByZWZpeFxuICAgICAgICA/IHByZWZpeCArICdbJyArIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJ10nXG4gICAgICAgIDogZW5jb2RlVVJJQ29tcG9uZW50KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBTZXQgYG9iamAncyBga2V5YCB0byBgdmFsYCByZXNwZWN0aW5nXG4gKiB0aGUgd2VpcmQgYW5kIHdvbmRlcmZ1bCBzeW50YXggb2YgYSBxcyxcbiAqIHdoZXJlIFwiZm9vPWJhciZmb289YmF6XCIgYmVjb21lcyBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXQob2JqLCBrZXksIHZhbCkge1xuICB2YXIgdiA9IG9ialtrZXldO1xuICBpZiAodW5kZWZpbmVkID09PSB2KSB7XG4gICAgb2JqW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2KSkge1xuICAgIHYucHVzaCh2YWwpO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gW3YsIHZhbF07XG4gIH1cbn1cblxuLyoqXG4gKiBMb2NhdGUgbGFzdCBicmFjZSBpbiBgc3RyYCB3aXRoaW4gdGhlIGtleS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsYXN0QnJhY2VJbktleShzdHIpIHtcbiAgdmFyIGxlbiA9IHN0ci5sZW5ndGhcbiAgICAsIGJyYWNlXG4gICAgLCBjO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYyA9IHN0cltpXTtcbiAgICBpZiAoJ10nID09IGMpIGJyYWNlID0gZmFsc2U7XG4gICAgaWYgKCdbJyA9PSBjKSBicmFjZSA9IHRydWU7XG4gICAgaWYgKCc9JyA9PSBjICYmICFicmFjZSkgcmV0dXJuIGk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWNvZGUgYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuIiwiLyohXG4gICogUmVxd2VzdCEgQSBnZW5lcmFsIHB1cnBvc2UgWEhSIGNvbm5lY3Rpb24gbWFuYWdlclxuICAqIChjKSBEdXN0aW4gRGlheiAyMDEzXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9yZXF3ZXN0XG4gICogbGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ3JlcXdlc3QnLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHdpbiA9IHdpbmRvd1xuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIHR3b0h1bmRvID0gL14yMFxcZCQvXG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGNvbnRlbnRUeXBlID0gJ0NvbnRlbnQtVHlwZSdcbiAgICAsIHJlcXVlc3RlZFdpdGggPSAnWC1SZXF1ZXN0ZWQtV2l0aCdcbiAgICAsIGhlYWQgPSBkb2NbYnlUYWddKCdoZWFkJylbMF1cbiAgICAsIHVuaXFpZCA9IDBcbiAgICAsIGNhbGxiYWNrUHJlZml4ID0gJ3JlcXdlc3RfJyArICgrbmV3IERhdGUoKSlcbiAgICAsIGxhc3RWYWx1ZSAvLyBkYXRhIHN0b3JlZCBieSB0aGUgbW9zdCByZWNlbnQgSlNPTlAgY2FsbGJhY2tcbiAgICAsIHhtbEh0dHBSZXF1ZXN0ID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICAgICwgeERvbWFpblJlcXVlc3QgPSAnWERvbWFpblJlcXVlc3QnXG4gICAgLCBub29wID0gZnVuY3Rpb24gKCkge31cblxuICAgICwgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBBcnJheS5pc0FycmF5XG4gICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICB9XG5cbiAgICAsIGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAsIHJlcXVlc3RlZFdpdGg6IHhtbEh0dHBSZXF1ZXN0XG4gICAgICAgICwgYWNjZXB0OiB7XG4gICAgICAgICAgICAgICcqJzogICd0ZXh0L2phdmFzY3JpcHQsIHRleHQvaHRtbCwgYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCwgKi8qJ1xuICAgICAgICAgICAgLCB4bWw6ICAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCdcbiAgICAgICAgICAgICwgaHRtbDogJ3RleHQvaHRtbCdcbiAgICAgICAgICAgICwgdGV4dDogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAsIGpzb246ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgICAsIGpzOiAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCB4aHIgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgIC8vIGlzIGl0IHgtZG9tYWluXG4gICAgICAgIGlmIChvLmNyb3NzT3JpZ2luID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHhociA9IHdpblt4bWxIdHRwUmVxdWVzdF0gPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG51bGxcbiAgICAgICAgICBpZiAoeGhyICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgICAgICAgcmV0dXJuIHhoclxuICAgICAgICAgIH0gZWxzZSBpZiAod2luW3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLW9yaWdpbiByZXF1ZXN0cycpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHdpblt4bWxIdHRwUmVxdWVzdF0pIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgZ2xvYmFsU2V0dXBPcHRpb25zID0ge1xuICAgICAgICBkYXRhRmlsdGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZWFkeVN0YXRlKHIsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHVzZSBfYWJvcnRlZCB0byBtaXRpZ2F0ZSBhZ2FpbnN0IElFIGVyciBjMDBjMDIzZlxuICAgICAgLy8gKGNhbid0IHJlYWQgcHJvcHMgb24gYWJvcnRlZCByZXF1ZXN0IG9iamVjdHMpXG4gICAgICBpZiAoci5fYWJvcnRlZCkgcmV0dXJuIGVycm9yKHIucmVxdWVzdClcbiAgICAgIGlmIChyLnJlcXVlc3QgJiYgci5yZXF1ZXN0W3JlYWR5U3RhdGVdID09IDQpIHtcbiAgICAgICAgci5yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG5vb3BcbiAgICAgICAgaWYgKHR3b0h1bmRvLnRlc3Qoci5yZXF1ZXN0LnN0YXR1cykpXG4gICAgICAgICAgc3VjY2VzcyhyLnJlcXVlc3QpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlcnJvcihyLnJlcXVlc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyhodHRwLCBvKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBvLmhlYWRlcnMgfHwge31cbiAgICAgICwgaFxuXG4gICAgaGVhZGVycy5BY2NlcHQgPSBoZWFkZXJzLkFjY2VwdFxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnMuYWNjZXB0W28udHlwZV1cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzLmFjY2VwdFsnKiddXG5cbiAgICAvLyBicmVha3MgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzIHdpdGggbGVnYWN5IGJyb3dzZXJzXG4gICAgaWYgKCFvLmNyb3NzT3JpZ2luICYmICFoZWFkZXJzW3JlcXVlc3RlZFdpdGhdKSBoZWFkZXJzW3JlcXVlc3RlZFdpdGhdID0gZGVmYXVsdEhlYWRlcnMucmVxdWVzdGVkV2l0aFxuICAgIGlmICghaGVhZGVyc1tjb250ZW50VHlwZV0pIGhlYWRlcnNbY29udGVudFR5cGVdID0gby5jb250ZW50VHlwZSB8fCBkZWZhdWx0SGVhZGVycy5jb250ZW50VHlwZVxuICAgIGZvciAoaCBpbiBoZWFkZXJzKVxuICAgICAgaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoKSAmJiAnc2V0UmVxdWVzdEhlYWRlcicgaW4gaHR0cCAmJiBodHRwLnNldFJlcXVlc3RIZWFkZXIoaCwgaGVhZGVyc1toXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pIHtcbiAgICBpZiAodHlwZW9mIG8ud2l0aENyZWRlbnRpYWxzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaHR0cC53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9ICEhby53aXRoQ3JlZGVudGlhbHNcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmFsQ2FsbGJhY2soZGF0YSkge1xuICAgIGxhc3RWYWx1ZSA9IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybGFwcGVuZCAodXJsLCBzKSB7XG4gICAgcmV0dXJuIHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKSB7XG4gICAgdmFyIHJlcUlkID0gdW5pcWlkKytcbiAgICAgICwgY2JrZXkgPSBvLmpzb25wQ2FsbGJhY2sgfHwgJ2NhbGxiYWNrJyAvLyB0aGUgJ2NhbGxiYWNrJyBrZXlcbiAgICAgICwgY2J2YWwgPSBvLmpzb25wQ2FsbGJhY2tOYW1lIHx8IHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXgocmVxSWQpXG4gICAgICAvLyAsIGNidmFsID0gby5qc29ucENhbGxiYWNrTmFtZSB8fCAoJ3JlcXdlc3RfJyArIHJlcUlkKSAvLyB0aGUgJ2NhbGxiYWNrJyB2YWx1ZVxuICAgICAgLCBjYnJlZyA9IG5ldyBSZWdFeHAoJygoXnxcXFxcP3wmKScgKyBjYmtleSArICcpPShbXiZdKyknKVxuICAgICAgLCBtYXRjaCA9IHVybC5tYXRjaChjYnJlZylcbiAgICAgICwgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICAsIGxvYWRlZCA9IDBcbiAgICAgICwgaXNJRTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDEwLjAnKSAhPT0gLTFcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgaWYgKG1hdGNoWzNdID09PSAnPycpIHtcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoY2JyZWcsICckMT0nICsgY2J2YWwpIC8vIHdpbGRjYXJkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2J2YWwgPSBtYXRjaFszXSAvLyBwcm92aWRlZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgY2JrZXkgKyAnPScgKyBjYnZhbCkgLy8gbm8gY2FsbGJhY2sgZGV0YWlscywgYWRkICdlbVxuICAgIH1cblxuICAgIHdpbltjYnZhbF0gPSBnZW5lcmFsQ2FsbGJhY2tcblxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICBzY3JpcHQuc3JjID0gdXJsXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZVxuICAgIGlmICh0eXBlb2Ygc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzSUUxMCkge1xuICAgICAgLy8gbmVlZCB0aGlzIGZvciBJRSBkdWUgdG8gb3V0LW9mLW9yZGVyIG9ucmVhZHlzdGF0ZWNoYW5nZSgpLCBiaW5kaW5nIHNjcmlwdFxuICAgICAgLy8gZXhlY3V0aW9uIHRvIGFuIGV2ZW50IGxpc3RlbmVyIGdpdmVzIHVzIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBzY3JpcHRcbiAgICAgIC8vIGlzIGV4ZWN1dGVkLiBTZWUgaHR0cDovL2phdWJvdXJnLm5ldC8yMDEwLzA3L2xvYWRpbmctc2NyaXB0LWFzLW9uY2xpY2staGFuZGxlci1vZi5odG1sXG4gICAgICAvL1xuICAgICAgLy8gaWYgdGhpcyBoYWNrIGlzIHVzZWQgaW4gSUUxMCBqc29ucCBjYWxsYmFjayBhcmUgbmV2ZXIgY2FsbGVkXG4gICAgICBzY3JpcHQuZXZlbnQgPSAnb25jbGljaydcbiAgICAgIHNjcmlwdC5odG1sRm9yID0gc2NyaXB0LmlkID0gJ19yZXF3ZXN0XycgKyByZXFJZFxuICAgIH1cblxuICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKChzY3JpcHRbcmVhZHlTdGF0ZV0gJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnY29tcGxldGUnICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2xvYWRlZCcpIHx8IGxvYWRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgc2NyaXB0Lm9uY2xpY2sgJiYgc2NyaXB0Lm9uY2xpY2soKVxuICAgICAgLy8gQ2FsbCB0aGUgdXNlciBjYWxsYmFjayB3aXRoIHRoZSBsYXN0IHZhbHVlIHN0b3JlZCBhbmQgY2xlYW4gdXAgdmFsdWVzIGFuZCBzY3JpcHRzLlxuICAgICAgZm4obGFzdFZhbHVlKVxuICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgIGxvYWRlZCA9IDFcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHNjcmlwdCB0byB0aGUgRE9NIGhlYWRcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdClcblxuICAgIC8vIEVuYWJsZSBKU09OUCB0aW1lb3V0XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgICBlcnIoe30sICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnLCB7fSlcbiAgICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgICBsb2FkZWQgPSAxXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVxdWVzdChmbiwgZXJyKSB7XG4gICAgdmFyIG8gPSB0aGlzLm9cbiAgICAgICwgbWV0aG9kID0gKG8ubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAsIHVybCA9IHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG8gOiBvLnVybFxuICAgICAgLy8gY29udmVydCBub24tc3RyaW5nIG9iamVjdHMgdG8gcXVlcnktc3RyaW5nIGZvcm0gdW5sZXNzIG8ucHJvY2Vzc0RhdGEgaXMgZmFsc2VcbiAgICAgICwgZGF0YSA9IChvLnByb2Nlc3NEYXRhICE9PSBmYWxzZSAmJiBvLmRhdGEgJiYgdHlwZW9mIG8uZGF0YSAhPT0gJ3N0cmluZycpXG4gICAgICAgID8gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKG8uZGF0YSlcbiAgICAgICAgOiAoby5kYXRhIHx8IG51bGwpXG4gICAgICAsIGh0dHBcbiAgICAgICwgc2VuZFdhaXQgPSBmYWxzZVxuXG4gICAgLy8gaWYgd2UncmUgd29ya2luZyBvbiBhIEdFVCByZXF1ZXN0IGFuZCB3ZSBoYXZlIGRhdGEgdGhlbiB3ZSBzaG91bGQgYXBwZW5kXG4gICAgLy8gcXVlcnkgc3RyaW5nIHRvIGVuZCBvZiBVUkwgYW5kIG5vdCBwb3N0IGRhdGFcbiAgICBpZiAoKG8udHlwZSA9PSAnanNvbnAnIHx8IG1ldGhvZCA9PSAnR0VUJykgJiYgZGF0YSkge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgZGF0YSlcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKG8udHlwZSA9PSAnanNvbnAnKSByZXR1cm4gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKVxuXG4gICAgaHR0cCA9IHhocihvKVxuICAgIGh0dHAub3BlbihtZXRob2QsIHVybCwgby5hc3luYyA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgc2V0SGVhZGVycyhodHRwLCBvKVxuICAgIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pXG4gICAgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0gJiYgaHR0cCBpbnN0YW5jZW9mIHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgaHR0cC5vbmxvYWQgPSBmblxuICAgICAgICBodHRwLm9uZXJyb3IgPSBlcnJcbiAgICAgICAgLy8gTk9URTogc2VlXG4gICAgICAgIC8vIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9lbi1VUy9pZXdlYmRldmVsb3BtZW50L3RocmVhZC8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmVcbiAgICAgICAgaHR0cC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fVxuICAgICAgICBzZW5kV2FpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVSZWFkeVN0YXRlKHRoaXMsIGZuLCBlcnIpXG4gICAgfVxuICAgIG8uYmVmb3JlICYmIG8uYmVmb3JlKGh0dHApXG4gICAgaWYgKHNlbmRXYWl0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgICB9LCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gaHR0cFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxd2VzdChvLCBmbikge1xuICAgIHRoaXMubyA9IG9cbiAgICB0aGlzLmZuID0gZm5cblxuICAgIGluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHlwZSh1cmwpIHtcbiAgICB2YXIgbSA9IHVybC5tYXRjaCgvXFwuKGpzb258anNvbnB8aHRtbHx4bWwpKFxcP3wkKS8pXG4gICAgcmV0dXJuIG0gPyBtWzFdIDogJ2pzJ1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdChvLCBmbikge1xuXG4gICAgdGhpcy51cmwgPSB0eXBlb2YgbyA9PSAnc3RyaW5nJyA/IG8gOiBvLnVybFxuICAgIHRoaXMudGltZW91dCA9IG51bGxcblxuICAgIC8vIHdoZXRoZXIgcmVxdWVzdCBoYXMgYmVlbiBmdWxmaWxsZWQgZm9yIHB1cnBvc2VcbiAgICAvLyBvZiB0cmFja2luZyB0aGUgUHJvbWlzZXNcbiAgICB0aGlzLl9mdWxmaWxsZWQgPSBmYWxzZVxuICAgIC8vIHN1Y2Nlc3MgaGFuZGxlcnNcbiAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uKCl7fVxuICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMgPSBbXVxuICAgIC8vIGVycm9yIGhhbmRsZXJzXG4gICAgdGhpcy5fZXJyb3JIYW5kbGVycyA9IFtdXG4gICAgLy8gY29tcGxldGUgKGJvdGggc3VjY2VzcyBhbmQgZmFpbCkgaGFuZGxlcnNcbiAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzID0gW11cbiAgICB0aGlzLl9lcnJlZCA9IGZhbHNlXG4gICAgdGhpcy5fcmVzcG9uc2VBcmdzID0ge31cblxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLCB0eXBlID0gby50eXBlIHx8IHNldFR5cGUodGhpcy51cmwpXG5cbiAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgICBpZiAoby50aW1lb3V0KSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5hYm9ydCgpXG4gICAgICB9LCBvLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgaWYgKG8uc3VjY2Vzcykge1xuICAgICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uc3VjY2Vzcy5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG8uZXJyb3IpIHtcbiAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uZXJyb3IuYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoby5jb21wbGV0ZSkge1xuICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgby5jb21wbGV0ZS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlIChyZXNwKSB7XG4gICAgICBvLnRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcbiAgICAgIHNlbGYudGltZW91dCA9IG51bGxcbiAgICAgIHdoaWxlIChzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fY29tcGxldGVIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VjY2VzcyAocmVzcCkge1xuICAgICAgcmVzcCA9ICh0eXBlICE9PSAnanNvbnAnKSA/IHNlbGYucmVxdWVzdCA6IHJlc3BcbiAgICAgIC8vIHVzZSBnbG9iYWwgZGF0YSBmaWx0ZXIgb24gcmVzcG9uc2UgdGV4dFxuICAgICAgdmFyIGZpbHRlcmVkUmVzcG9uc2UgPSBnbG9iYWxTZXR1cE9wdGlvbnMuZGF0YUZpbHRlcihyZXNwLnJlc3BvbnNlVGV4dCwgdHlwZSlcbiAgICAgICAgLCByID0gZmlsdGVyZWRSZXNwb25zZVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcC5yZXNwb25zZVRleHQgPSByXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNhbid0IGFzc2lnbiB0aGlzIGluIElFPD04LCBqdXN0IGlnbm9yZVxuICAgICAgfVxuICAgICAgaWYgKHIpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwID0gd2luLkpTT04gPyB3aW4uSlNPTi5wYXJzZShyKSA6IGV2YWwoJygnICsgciArICcpJylcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcihyZXNwLCAnQ291bGQgbm90IHBhcnNlIEpTT04gaW4gcmVzcG9uc2UnLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICByZXNwID0gZXZhbChyKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgIHJlc3AgPSByXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICByZXNwID0gcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IgLy8gSUUgdHJvbG9sb1xuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IuZXJyb3JDb2RlXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5yZWFzb25cbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX2Z1bGZpbGxlZCA9IHRydWVcbiAgICAgIGZuKHJlc3ApXG4gICAgICBzZWxmLl9zdWNjZXNzSGFuZGxlcihyZXNwKVxuICAgICAgd2hpbGUgKHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwID0gc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG5cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcCwgbXNnLCB0KSB7XG4gICAgICByZXNwID0gc2VsZi5yZXF1ZXN0XG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5tc2cgPSBtc2dcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy50ID0gdFxuICAgICAgc2VsZi5fZXJyZWQgPSB0cnVlXG4gICAgICB3aGlsZSAoc2VsZi5fZXJyb3JIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2Vycm9ySGFuZGxlcnMuc2hpZnQoKShyZXNwLCBtc2csIHQpXG4gICAgICB9XG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IGdldFJlcXVlc3QuY2FsbCh0aGlzLCBzdWNjZXNzLCBlcnJvcilcbiAgfVxuXG4gIFJlcXdlc3QucHJvdG90eXBlID0ge1xuICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9hYm9ydGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KClcbiAgICB9XG5cbiAgLCByZXRyeTogZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdC5jYWxsKHRoaXMsIHRoaXMubywgdGhpcy5mbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbWFsbCBkZXZpYXRpb24gZnJvbSB0aGUgUHJvbWlzZXMgQSBDb21tb25KcyBzcGVjaWZpY2F0aW9uXG4gICAgICogaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvUHJvbWlzZXMvQVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogYHRoZW5gIHdpbGwgZXhlY3V0ZSB1cG9uIHN1Y2Nlc3NmdWwgcmVxdWVzdHNcbiAgICAgKi9cbiAgLCB0aGVuOiBmdW5jdGlvbiAoc3VjY2VzcywgZmFpbCkge1xuICAgICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGZhaWwgPSBmYWlsIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwID0gc3VjY2Vzcyh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZmFpbCh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzLnB1c2goc3VjY2VzcylcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZhaWwpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBhbHdheXNgIHdpbGwgZXhlY3V0ZSB3aGV0aGVyIHRoZSByZXF1ZXN0IHN1Y2NlZWRzIG9yIGZhaWxzXG4gICAgICovXG4gICwgYWx3YXlzOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQgfHwgdGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBmYWlsYCB3aWxsIGV4ZWN1dGUgd2hlbiB0aGUgcmVxdWVzdCBmYWlsc1xuICAgICAqL1xuICAsIGZhaWw6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVxd2VzdChvLCBmbikge1xuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIC8vIG5vcm1hbGl6ZSBuZXdsaW5lIHZhcmlhbnRzIGFjY29yZGluZyB0byBzcGVjIC0+IENSTEZcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvXFxyP1xcbi9nLCAnXFxyXFxuJykgOiAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gc2VyaWFsKGVsLCBjYikge1xuICAgIHZhciBuID0gZWwubmFtZVxuICAgICAgLCB0ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIG9wdENiID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAvLyBJRSBnaXZlcyB2YWx1ZT1cIlwiIGV2ZW4gd2hlcmUgdGhlcmUgaXMgbm8gdmFsdWUgYXR0cmlidXRlXG4gICAgICAgICAgLy8gJ3NwZWNpZmllZCcgcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1Db3JlL2NvcmUuaHRtbCNJRC04NjI1MjkyNzNcbiAgICAgICAgICBpZiAobyAmJiAhby5kaXNhYmxlZClcbiAgICAgICAgICAgIGNiKG4sIG5vcm1hbGl6ZShvLmF0dHJpYnV0ZXMudmFsdWUgJiYgby5hdHRyaWJ1dGVzLnZhbHVlLnNwZWNpZmllZCA/IG8udmFsdWUgOiBvLnRleHQpKVxuICAgICAgICB9XG4gICAgICAsIGNoLCByYSwgdmFsLCBpXG5cbiAgICAvLyBkb24ndCBzZXJpYWxpemUgZWxlbWVudHMgdGhhdCBhcmUgZGlzYWJsZWQgb3Igd2l0aG91dCBhIG5hbWVcbiAgICBpZiAoZWwuZGlzYWJsZWQgfHwgIW4pIHJldHVyblxuXG4gICAgc3dpdGNoICh0KSB7XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgaWYgKCEvcmVzZXR8YnV0dG9ufGltYWdlfGZpbGUvaS50ZXN0KGVsLnR5cGUpKSB7XG4gICAgICAgIGNoID0gL2NoZWNrYm94L2kudGVzdChlbC50eXBlKVxuICAgICAgICByYSA9IC9yYWRpby9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgdmFsID0gZWwudmFsdWVcbiAgICAgICAgLy8gV2ViS2l0IGdpdmVzIHVzIFwiXCIgaW5zdGVhZCBvZiBcIm9uXCIgaWYgYSBjaGVja2JveCBoYXMgbm8gdmFsdWUsIHNvIGNvcnJlY3QgaXQgaGVyZVxuICAgICAgICA7KCEoY2ggfHwgcmEpIHx8IGVsLmNoZWNrZWQpICYmIGNiKG4sIG5vcm1hbGl6ZShjaCAmJiB2YWwgPT09ICcnID8gJ29uJyA6IHZhbCkpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNiKG4sIG5vcm1hbGl6ZShlbC52YWx1ZSkpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoZWwudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0LW9uZScpIHtcbiAgICAgICAgb3B0Q2IoZWwuc2VsZWN0ZWRJbmRleCA+PSAwID8gZWwub3B0aW9uc1tlbC5zZWxlY3RlZEluZGV4XSA6IG51bGwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwOyBlbC5sZW5ndGggJiYgaSA8IGVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWwub3B0aW9uc1tpXS5zZWxlY3RlZCAmJiBvcHRDYihlbC5vcHRpb25zW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbGxlY3QgdXAgYWxsIGZvcm0gZWxlbWVudHMgZm91bmQgZnJvbSB0aGUgcGFzc2VkIGFyZ3VtZW50IGVsZW1lbnRzIGFsbFxuICAvLyB0aGUgd2F5IGRvd24gdG8gY2hpbGQgZWxlbWVudHM7IHBhc3MgYSAnPGZvcm0+JyBvciBmb3JtIGZpZWxkcy5cbiAgLy8gY2FsbGVkIHdpdGggJ3RoaXMnPWNhbGxiYWNrIHRvIHVzZSBmb3Igc2VyaWFsKCkgb24gZWFjaCBlbGVtZW50XG4gIGZ1bmN0aW9uIGVhY2hGb3JtRWxlbWVudCgpIHtcbiAgICB2YXIgY2IgPSB0aGlzXG4gICAgICAsIGUsIGlcbiAgICAgICwgc2VyaWFsaXplU3VidGFncyA9IGZ1bmN0aW9uIChlLCB0YWdzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGZhXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZhID0gZVtieVRhZ10odGFnc1tpXSlcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYS5sZW5ndGg7IGorKykgc2VyaWFsKGZhW2pdLCBjYilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUgPSBhcmd1bWVudHNbaV1cbiAgICAgIGlmICgvaW5wdXR8c2VsZWN0fHRleHRhcmVhL2kudGVzdChlLnRhZ05hbWUpKSBzZXJpYWwoZSwgY2IpXG4gICAgICBzZXJpYWxpemVTdWJ0YWdzKGUsIFsgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScgXSlcbiAgICB9XG4gIH1cblxuICAvLyBzdGFuZGFyZCBxdWVyeSBzdHJpbmcgc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVRdWVyeVN0cmluZygpIHtcbiAgICByZXR1cm4gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKHJlcXdlc3Quc2VyaWFsaXplQXJyYXkuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgfVxuXG4gIC8vIHsgJ25hbWUnOiAndmFsdWUnLCAuLi4gfSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZUhhc2goKSB7XG4gICAgdmFyIGhhc2ggPSB7fVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lIGluIGhhc2gpIHtcbiAgICAgICAgaGFzaFtuYW1lXSAmJiAhaXNBcnJheShoYXNoW25hbWVdKSAmJiAoaGFzaFtuYW1lXSA9IFtoYXNoW25hbWVdXSlcbiAgICAgICAgaGFzaFtuYW1lXS5wdXNoKHZhbHVlKVxuICAgICAgfSBlbHNlIGhhc2hbbmFtZV0gPSB2YWx1ZVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLy8gWyB7IG5hbWU6ICduYW1lJywgdmFsdWU6ICd2YWx1ZScgfSwgLi4uIF0gc3R5bGUgc2VyaWFsaXphdGlvblxuICByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnIgPSBbXVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGFyci5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWV9KVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICByZXF3ZXN0LnNlcmlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gICAgdmFyIG9wdCwgZm5cbiAgICAgICwgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcblxuICAgIG9wdCA9IGFyZ3MucG9wKClcbiAgICBvcHQgJiYgb3B0Lm5vZGVUeXBlICYmIGFyZ3MucHVzaChvcHQpICYmIChvcHQgPSBudWxsKVxuICAgIG9wdCAmJiAob3B0ID0gb3B0LnR5cGUpXG5cbiAgICBpZiAob3B0ID09ICdtYXAnKSBmbiA9IHNlcmlhbGl6ZUhhc2hcbiAgICBlbHNlIGlmIChvcHQgPT0gJ2FycmF5JykgZm4gPSByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5XG4gICAgZWxzZSBmbiA9IHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nXG5cbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncylcbiAgfVxuXG4gIHJlcXdlc3QudG9RdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChvLCB0cmFkKSB7XG4gICAgdmFyIHByZWZpeCwgaVxuICAgICAgLCB0cmFkaXRpb25hbCA9IHRyYWQgfHwgZmFsc2VcbiAgICAgICwgcyA9IFtdXG4gICAgICAsIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgLCBhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgIC8vIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGludm9rZSBpdCBhbmQgcmV0dXJuIGl0cyB2YWx1ZVxuICAgICAgICAgIHZhbHVlID0gKCdmdW5jdGlvbicgPT09IHR5cGVvZiB2YWx1ZSkgPyB2YWx1ZSgpIDogKHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlKVxuICAgICAgICAgIHNbcy5sZW5ndGhdID0gZW5jKGtleSkgKyAnPScgKyBlbmModmFsdWUpXG4gICAgICAgIH1cbiAgICAvLyBJZiBhbiBhcnJheSB3YXMgcGFzc2VkIGluLCBhc3N1bWUgdGhhdCBpdCBpcyBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzLlxuICAgIGlmIChpc0FycmF5KG8pKSB7XG4gICAgICBmb3IgKGkgPSAwOyBvICYmIGkgPCBvLmxlbmd0aDsgaSsrKSBhZGQob1tpXS5uYW1lLCBvW2ldLnZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuICAgICAgLy8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG4gICAgICBmb3IgKHByZWZpeCBpbiBvKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCwgb1twcmVmaXhdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNwYWNlcyBzaG91bGQgYmUgKyBhY2NvcmRpbmcgdG8gc3BlY1xuICAgIHJldHVybiBzLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRQYXJhbXMocHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQpIHtcbiAgICB2YXIgbmFtZSwgaSwgdlxuICAgICAgLCByYnJhY2tldCA9IC9cXFtcXF0kL1xuXG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgLy8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG4gICAgICBmb3IgKGkgPSAwOyBvYmogJiYgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICB2ID0gb2JqW2ldXG4gICAgICAgIGlmICh0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgICAvLyBUcmVhdCBlYWNoIGFycmF5IGl0ZW0gYXMgYSBzY2FsYXIuXG4gICAgICAgICAgYWRkKHByZWZpeCwgdilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyAodHlwZW9mIHYgPT09ICdvYmplY3QnID8gaSA6ICcnKSArICddJywgdiwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIG9iai50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgLy8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyBuYW1lICsgJ10nLCBvYmpbbmFtZV0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VyaWFsaXplIHNjYWxhciBpdGVtLlxuICAgICAgYWRkKHByZWZpeCwgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrUHJlZml4XG4gIH1cblxuICAvLyBqUXVlcnkgYW5kIFplcHRvIGNvbXBhdGliaWxpdHksIGRpZmZlcmVuY2VzIGNhbiBiZSByZW1hcHBlZCBoZXJlIHNvIHlvdSBjYW4gY2FsbFxuICAvLyAuYWpheC5jb21wYXQob3B0aW9ucywgY2FsbGJhY2spXG4gIHJlcXdlc3QuY29tcGF0ID0gZnVuY3Rpb24gKG8sIGZuKSB7XG4gICAgaWYgKG8pIHtcbiAgICAgIG8udHlwZSAmJiAoby5tZXRob2QgPSBvLnR5cGUpICYmIGRlbGV0ZSBvLnR5cGVcbiAgICAgIG8uZGF0YVR5cGUgJiYgKG8udHlwZSA9IG8uZGF0YVR5cGUpXG4gICAgICBvLmpzb25wQ2FsbGJhY2sgJiYgKG8uanNvbnBDYWxsYmFja05hbWUgPSBvLmpzb25wQ2FsbGJhY2spICYmIGRlbGV0ZSBvLmpzb25wQ2FsbGJhY2tcbiAgICAgIG8uanNvbnAgJiYgKG8uanNvbnBDYWxsYmFjayA9IG8uanNvbnApXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIHJlcXdlc3QuYWpheFNldHVwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGZvciAodmFyIGsgaW4gb3B0aW9ucykge1xuICAgICAgZ2xvYmFsU2V0dXBPcHRpb25zW2tdID0gb3B0aW9uc1trXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXF3ZXN0XG59KTtcbiIsIi8qIVxuICAqIEJlYW4gLSBjb3B5cmlnaHQgKGMpIEphY29iIFRob3JudG9uIDIwMTEtMjAxMlxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYXQvYmVhblxuICAqIE1JVCBsaWNlbnNlXG4gICovXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgnYmVhbicsIHRoaXMsIGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0KSB7XG4gIG5hbWUgICAgPSBuYW1lICAgIHx8ICdiZWFuJ1xuICBjb250ZXh0ID0gY29udGV4dCB8fCB0aGlzXG5cbiAgdmFyIHdpbiAgICAgICAgICAgID0gd2luZG93XG4gICAgLCBvbGQgICAgICAgICAgICA9IGNvbnRleHRbbmFtZV1cbiAgICAsIG5hbWVzcGFjZVJlZ2V4ID0gL1teXFwuXSooPz1cXC4uKilcXC58LiovXG4gICAgLCBuYW1lUmVnZXggICAgICA9IC9cXC4uKi9cbiAgICAsIGFkZEV2ZW50ICAgICAgID0gJ2FkZEV2ZW50TGlzdGVuZXInXG4gICAgLCByZW1vdmVFdmVudCAgICA9ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xuICAgICwgZG9jICAgICAgICAgICAgPSBkb2N1bWVudCB8fCB7fVxuICAgICwgcm9vdCAgICAgICAgICAgPSBkb2MuZG9jdW1lbnRFbGVtZW50IHx8IHt9XG4gICAgLCBXM0NfTU9ERUwgICAgICA9IHJvb3RbYWRkRXZlbnRdXG4gICAgLCBldmVudFN1cHBvcnQgICA9IFczQ19NT0RFTCA/IGFkZEV2ZW50IDogJ2F0dGFjaEV2ZW50J1xuICAgICwgT05FICAgICAgICAgICAgPSB7fSAvLyBzaW5nbGV0b24gZm9yIHF1aWNrIG1hdGNoaW5nIG1ha2luZyBhZGQoKSBkbyBvbmUoKVxuXG4gICAgLCBzbGljZSAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICwgc3RyMmFyciAgICAgICAgPSBmdW5jdGlvbiAocywgZCkgeyByZXR1cm4gcy5zcGxpdChkIHx8ICcgJykgfVxuICAgICwgaXNTdHJpbmcgICAgICAgPSBmdW5jdGlvbiAobykgeyByZXR1cm4gdHlwZW9mIG8gPT0gJ3N0cmluZycgfVxuICAgICwgaXNGdW5jdGlvbiAgICAgPSBmdW5jdGlvbiAobykgeyByZXR1cm4gdHlwZW9mIG8gPT0gJ2Z1bmN0aW9uJyB9XG5cbiAgICAgIC8vIGV2ZW50cyB0aGF0IHdlIGNvbnNpZGVyIHRvIGJlICduYXRpdmUnLCBhbnl0aGluZyBub3QgaW4gdGhpcyBsaXN0IHdpbGxcbiAgICAgIC8vIGJlIHRyZWF0ZWQgYXMgYSBjdXN0b20gZXZlbnRcbiAgICAsIHN0YW5kYXJkTmF0aXZlRXZlbnRzID1cbiAgICAgICAgJ2NsaWNrIGRibGNsaWNrIG1vdXNldXAgbW91c2Vkb3duIGNvbnRleHRtZW51ICcgICAgICAgICAgICAgICAgICArIC8vIG1vdXNlIGJ1dHRvbnNcbiAgICAgICAgJ21vdXNld2hlZWwgbW91c2VtdWx0aXdoZWVsIERPTU1vdXNlU2Nyb2xsICcgICAgICAgICAgICAgICAgICAgICArIC8vIG1vdXNlIHdoZWVsXG4gICAgICAgICdtb3VzZW92ZXIgbW91c2VvdXQgbW91c2Vtb3ZlIHNlbGVjdHN0YXJ0IHNlbGVjdGVuZCAnICAgICAgICAgICAgKyAvLyBtb3VzZSBtb3ZlbWVudFxuICAgICAgICAna2V5ZG93biBrZXlwcmVzcyBrZXl1cCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8ga2V5Ym9hcmRcbiAgICAgICAgJ29yaWVudGF0aW9uY2hhbmdlICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIG1vYmlsZVxuICAgICAgICAnZm9jdXMgYmx1ciBjaGFuZ2UgcmVzZXQgc2VsZWN0IHN1Ym1pdCAnICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gZm9ybSBlbGVtZW50c1xuICAgICAgICAnbG9hZCB1bmxvYWQgYmVmb3JldW5sb2FkIHJlc2l6ZSBtb3ZlIERPTUNvbnRlbnRMb2FkZWQgJyAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdyZWFkeXN0YXRlY2hhbmdlIG1lc3NhZ2UgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ2Vycm9yIGFib3J0IHNjcm9sbCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pc2NcbiAgICAgIC8vIGVsZW1lbnQuZmlyZUV2ZW50KCdvblhZWicuLi4gaXMgbm90IGZvcmdpdmluZyBpZiB3ZSB0cnkgdG8gZmlyZSBhbiBldmVudFxuICAgICAgLy8gdGhhdCBkb2Vzbid0IGFjdHVhbGx5IGV4aXN0LCBzbyBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGVzZSBvbiBuZXdlciBicm93c2Vyc1xuICAgICwgdzNjTmF0aXZlRXZlbnRzID1cbiAgICAgICAgJ3Nob3cgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIG1vdXNlIGJ1dHRvbnNcbiAgICAgICAgJ2lucHV0IGludmFsaWQgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGZvcm0gZWxlbWVudHNcbiAgICAgICAgJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsICcgICAgICAgICAgICAgICAgICAgICArIC8vIHRvdWNoXG4gICAgICAgICdnZXN0dXJlc3RhcnQgZ2VzdHVyZWNoYW5nZSBnZXN0dXJlZW5kICcgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBnZXN0dXJlXG4gICAgICAgICd0ZXh0aW5wdXQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBUZXh0RXZlbnRcbiAgICAgICAgJ3JlYWR5c3RhdGVjaGFuZ2UgcGFnZXNob3cgcGFnZWhpZGUgcG9wc3RhdGUgJyAgICAgICAgICAgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAnaGFzaGNoYW5nZSBvZmZsaW5lIG9ubGluZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdhZnRlcnByaW50IGJlZm9yZXByaW50ICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBwcmludGluZ1xuICAgICAgICAnZHJhZ3N0YXJ0IGRyYWdlbnRlciBkcmFnb3ZlciBkcmFnbGVhdmUgZHJhZyBkcm9wIGRyYWdlbmQgJyAgICAgICsgLy8gZG5kXG4gICAgICAgICdsb2Fkc3RhcnQgcHJvZ3Jlc3Mgc3VzcGVuZCBlbXB0aWVkIHN0YWxsZWQgbG9hZG1ldGFkYXRhICcgICAgICAgKyAvLyBtZWRpYVxuICAgICAgICAnbG9hZGVkZGF0YSBjYW5wbGF5IGNhbnBsYXl0aHJvdWdoIHBsYXlpbmcgd2FpdGluZyBzZWVraW5nICcgICAgICsgLy8gbWVkaWFcbiAgICAgICAgJ3NlZWtlZCBlbmRlZCBkdXJhdGlvbmNoYW5nZSB0aW1ldXBkYXRlIHBsYXkgcGF1c2UgcmF0ZWNoYW5nZSAnICArIC8vIG1lZGlhXG4gICAgICAgICd2b2x1bWVjaGFuZ2UgY3VlY2hhbmdlICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBtZWRpYVxuICAgICAgICAnY2hlY2tpbmcgbm91cGRhdGUgZG93bmxvYWRpbmcgY2FjaGVkIHVwZGF0ZXJlYWR5IG9ic29sZXRlICcgICAgICAgLy8gYXBwY2FjaGVcblxuICAgICAgLy8gY29udmVydCB0byBhIGhhc2ggZm9yIHF1aWNrIGxvb2t1cHNcbiAgICAsIG5hdGl2ZUV2ZW50cyA9IChmdW5jdGlvbiAoaGFzaCwgZXZlbnRzLCBpKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIGV2ZW50c1tpXSAmJiAoaGFzaFtldmVudHNbaV1dID0gMSlcbiAgICAgICAgcmV0dXJuIGhhc2hcbiAgICAgIH0oe30sIHN0cjJhcnIoc3RhbmRhcmROYXRpdmVFdmVudHMgKyAoVzNDX01PREVMID8gdzNjTmF0aXZlRXZlbnRzIDogJycpKSkpXG5cbiAgICAgIC8vIGN1c3RvbSBldmVudHMgYXJlIGV2ZW50cyB0aGF0IHdlICpmYWtlKiwgdGhleSBhcmUgbm90IHByb3ZpZGVkIG5hdGl2ZWx5IGJ1dFxuICAgICAgLy8gd2UgY2FuIHVzZSBuYXRpdmUgZXZlbnRzIHRvIGdlbmVyYXRlIHRoZW1cbiAgICAsIGN1c3RvbUV2ZW50cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiByb290XG4gICAgICAgICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiAoY29udGFpbmVyLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQpICYgMTYpID09PSAxNlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiAnY29udGFpbnMnIGluIHJvb3RcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyLm5vZGVUeXBlID09PSA5IHx8IGNvbnRhaW5lciA9PT0gd2luZG93ID8gcm9vdCA6IGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAsIGNoZWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgIHZhciByZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldFxuICAgICAgICAgICAgICByZXR1cm4gIXJlbGF0ZWRcbiAgICAgICAgICAgICAgICA/IHJlbGF0ZWQgPT0gbnVsbFxuICAgICAgICAgICAgICAgIDogKHJlbGF0ZWQgIT09IHRoaXMgJiYgcmVsYXRlZC5wcmVmaXggIT09ICd4dWwnICYmICEvZG9jdW1lbnQvLnRlc3QodGhpcy50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNBbmNlc3RvcihyZWxhdGVkLCB0aGlzKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbW91c2VlbnRlcjogeyBiYXNlOiAnbW91c2VvdmVyJywgY29uZGl0aW9uOiBjaGVjayB9XG4gICAgICAgICAgLCBtb3VzZWxlYXZlOiB7IGJhc2U6ICdtb3VzZW91dCcsIGNvbmRpdGlvbjogY2hlY2sgfVxuICAgICAgICAgICwgbW91c2V3aGVlbDogeyBiYXNlOiAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSA/ICdET01Nb3VzZVNjcm9sbCcgOiAnbW91c2V3aGVlbCcgfVxuICAgICAgICB9XG4gICAgICB9KCkpXG5cbiAgICAgIC8vIHdlIHByb3ZpZGUgYSBjb25zaXN0ZW50IEV2ZW50IG9iamVjdCBhY3Jvc3MgYnJvd3NlcnMgYnkgdGFraW5nIHRoZSBhY3R1YWwgRE9NXG4gICAgICAvLyBldmVudCBvYmplY3QgYW5kIGdlbmVyYXRpbmcgYSBuZXcgb25lIGZyb20gaXRzIHByb3BlcnRpZXMuXG4gICAgLCBFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBhIHdoaXRlbGlzdCBvZiBwcm9wZXJ0aWVzIChmb3IgZGlmZmVyZW50IGV2ZW50IHR5cGVzKSB0ZWxscyB1cyB3aGF0IHRvIGNoZWNrIGZvciBhbmQgY29weVxuICAgICAgICB2YXIgY29tbW9uUHJvcHMgID0gc3RyMmFycignYWx0S2V5IGF0dHJDaGFuZ2UgYXR0ck5hbWUgYnViYmxlcyBjYW5jZWxhYmxlIGN0cmxLZXkgY3VycmVudFRhcmdldCAnICtcbiAgICAgICAgICAgICAgJ2RldGFpbCBldmVudFBoYXNlIGdldE1vZGlmaWVyU3RhdGUgaXNUcnVzdGVkIG1ldGFLZXkgcmVsYXRlZE5vZGUgcmVsYXRlZFRhcmdldCBzaGlmdEtleSAnICArXG4gICAgICAgICAgICAgICdzcmNFbGVtZW50IHRhcmdldCB0aW1lU3RhbXAgdHlwZSB2aWV3IHdoaWNoIHByb3BlcnR5TmFtZScpXG4gICAgICAgICAgLCBtb3VzZVByb3BzICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignYnV0dG9uIGJ1dHRvbnMgY2xpZW50WCBjbGllbnRZIGRhdGFUcmFuc2ZlciAnICAgICAgK1xuICAgICAgICAgICAgICAnZnJvbUVsZW1lbnQgb2Zmc2V0WCBvZmZzZXRZIHBhZ2VYIHBhZ2VZIHNjcmVlblggc2NyZWVuWSB0b0VsZW1lbnQnKSlcbiAgICAgICAgICAsIG1vdXNlV2hlZWxQcm9wcyA9IG1vdXNlUHJvcHMuY29uY2F0KHN0cjJhcnIoJ3doZWVsRGVsdGEgd2hlZWxEZWx0YVggd2hlZWxEZWx0YVkgd2hlZWxEZWx0YVogJyArXG4gICAgICAgICAgICAgICdheGlzJykpIC8vICdheGlzJyBpcyBGRiBzcGVjaWZpY1xuICAgICAgICAgICwga2V5UHJvcHMgICAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2NoYXIgY2hhckNvZGUga2V5IGtleUNvZGUga2V5SWRlbnRpZmllciAnICAgICAgICAgICtcbiAgICAgICAgICAgICAgJ2tleUxvY2F0aW9uIGxvY2F0aW9uJykpXG4gICAgICAgICAgLCB0ZXh0UHJvcHMgICAgPSBjb21tb25Qcm9wcy5jb25jYXQoc3RyMmFycignZGF0YScpKVxuICAgICAgICAgICwgdG91Y2hQcm9wcyAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ3RvdWNoZXMgdGFyZ2V0VG91Y2hlcyBjaGFuZ2VkVG91Y2hlcyBzY2FsZSByb3RhdGlvbicpKVxuICAgICAgICAgICwgbWVzc2FnZVByb3BzID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2RhdGEgb3JpZ2luIHNvdXJjZScpKVxuICAgICAgICAgICwgc3RhdGVQcm9wcyAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ3N0YXRlJykpXG4gICAgICAgICAgLCBvdmVyT3V0UmVnZXggPSAvb3ZlcnxvdXQvXG4gICAgICAgICAgICAvLyBzb21lIGV2ZW50IHR5cGVzIG5lZWQgc3BlY2lhbCBoYW5kbGluZyBhbmQgc29tZSBuZWVkIHNwZWNpYWwgcHJvcGVydGllcywgZG8gdGhhdCBhbGwgaGVyZVxuICAgICAgICAgICwgdHlwZUZpeGVycyAgID0gW1xuICAgICAgICAgICAgICAgIHsgLy8ga2V5IGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9rZXkvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uIChldmVudCwgbmV3RXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5rZXlDb2RlID0gZXZlbnQua2V5Q29kZSB8fCBldmVudC53aGljaFxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQcm9wc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gbW91c2UgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL2NsaWNrfG1vdXNlKD8hKC4qd2hlZWx8c2Nyb2xsKSl8bWVudXxkcmFnfGRyb3AvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uIChldmVudCwgbmV3RXZlbnQsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5yaWdodENsaWNrID0gZXZlbnQud2hpY2ggPT09IDMgfHwgZXZlbnQuYnV0dG9uID09PSAyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQucG9zID0geyB4OiAwLCB5OiAwIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucGFnZVggfHwgZXZlbnQucGFnZVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFggPSBldmVudC5wYWdlWFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WSA9IGV2ZW50LnBhZ2VZXG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5jbGllbnRYIHx8IGV2ZW50LmNsaWVudFkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFggPSBldmVudC5jbGllbnRYICsgZG9jLmJvZHkuc2Nyb2xsTGVmdCArIHJvb3Quc2Nyb2xsTGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuY2xpZW50WSA9IGV2ZW50LmNsaWVudFkgKyBkb2MuYm9keS5zY3JvbGxUb3AgKyByb290LnNjcm9sbFRvcFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAob3Zlck91dFJlZ2V4LnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LnJlbGF0ZWRUYXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50Wyh0eXBlID09ICdtb3VzZW92ZXInID8gJ2Zyb20nIDogJ3RvJykgKyAnRWxlbWVudCddXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3VzZVByb3BzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBtb3VzZSB3aGVlbCBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvbW91c2UuKih3aGVlbHxzY3JvbGwpL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtb3VzZVdoZWVsUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIFRleHRFdmVudFxuICAgICAgICAgICAgICAgICAgICByZWc6IC9edGV4dC9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGV4dFByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyB0b3VjaCBhbmQgZ2VzdHVyZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXnRvdWNofF5nZXN0dXJlL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0b3VjaFByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBtZXNzYWdlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9ebWVzc2FnZSQvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1lc3NhZ2VQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gcG9wc3RhdGUgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL15wb3BzdGF0ZSQvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN0YXRlUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZWc6IC8uKi9cbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb21tb25Qcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgICwgdHlwZUZpeGVyTWFwID0ge30gLy8gdXNlZCB0byBtYXAgZXZlbnQgdHlwZXMgdG8gZml4ZXIgZnVuY3Rpb25zIChhYm92ZSksIGEgYmFzaWMgY2FjaGUgbWVjaGFuaXNtXG5cbiAgICAgICAgICAsIEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBlbGVtZW50LCBpc05hdGl2ZSkge1xuICAgICAgICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVyblxuICAgICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8ICgoZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQuZG9jdW1lbnQgfHwgZWxlbWVudCkucGFyZW50V2luZG93IHx8IHdpbikuZXZlbnRcbiAgICAgICAgICAgICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gZXZlbnRcbiAgICAgICAgICAgICAgdGhpcy5pc05hdGl2ZSAgICAgICA9IGlzTmF0aXZlXG4gICAgICAgICAgICAgIHRoaXMuaXNCZWFuICAgICAgICAgPSB0cnVlXG5cbiAgICAgICAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuXG5cbiAgICAgICAgICAgICAgdmFyIHR5cGUgICA9IGV2ZW50LnR5cGVcbiAgICAgICAgICAgICAgICAsIHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50XG4gICAgICAgICAgICAgICAgLCBpLCBsLCBwLCBwcm9wcywgZml4ZXJcblxuICAgICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgPT09IDMgPyB0YXJnZXQucGFyZW50Tm9kZSA6IHRhcmdldFxuXG4gICAgICAgICAgICAgIGlmIChpc05hdGl2ZSkgeyAvLyB3ZSBvbmx5IG5lZWQgYmFzaWMgYXVnbWVudGF0aW9uIG9uIGN1c3RvbSBldmVudHMsIHRoZSByZXN0IGV4cGVuc2l2ZSAmIHBvaW50bGVzc1xuICAgICAgICAgICAgICAgIGZpeGVyID0gdHlwZUZpeGVyTWFwW3R5cGVdXG4gICAgICAgICAgICAgICAgaWYgKCFmaXhlcikgeyAvLyBoYXZlbid0IGVuY291bnRlcmVkIHRoaXMgZXZlbnQgdHlwZSBiZWZvcmUsIG1hcCBhIGZpeGVyIGZ1bmN0aW9uIGZvciBpdFxuICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IHR5cGVGaXhlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlRml4ZXJzW2ldLnJlZy50ZXN0KHR5cGUpKSB7IC8vIGd1YXJhbnRlZWQgdG8gbWF0Y2ggYXQgbGVhc3Qgb25lLCBsYXN0IGlzIC4qXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZUZpeGVyTWFwW3R5cGVdID0gZml4ZXIgPSB0eXBlRml4ZXJzW2ldLmZpeFxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwcm9wcyA9IGZpeGVyKGV2ZW50LCB0aGlzLCB0eXBlKVxuICAgICAgICAgICAgICAgIGZvciAoaSA9IHByb3BzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgaWYgKCEoKHAgPSBwcm9wc1tpXSkgaW4gdGhpcykgJiYgcCBpbiBldmVudCkgdGhpc1twXSA9IGV2ZW50W3BdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJldmVudERlZmF1bHQoKSBhbmQgc3RvcFByb3BhZ2F0aW9uKCkgYXJlIGEgY29uc2lzdGVudCBpbnRlcmZhY2UgdG8gdGhvc2UgZnVuY3Rpb25zXG4gICAgICAgIC8vIG9uIHRoZSBET00sIHN0b3AoKSBpcyBhbiBhbGlhcyBmb3IgYm90aCBvZiB0aGVtIHRvZ2V0aGVyXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KSB0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIGVsc2UgdGhpcy5vcmlnaW5hbEV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBlbHNlIHRoaXMub3JpZ2luYWxFdmVudC5jYW5jZWxCdWJibGUgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgdGhpcy5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICAvLyBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSBoYXMgdG8gYmUgaGFuZGxlZCBpbnRlcm5hbGx5IGJlY2F1c2Ugd2UgbWFuYWdlIHRoZSBldmVudCBsaXN0IGZvclxuICAgICAgICAvLyBlYWNoIGVsZW1lbnRcbiAgICAgICAgLy8gbm90ZSB0aGF0IG9yaWdpbmFsRWxlbWVudCBtYXkgYmUgYSBCZWFuI0V2ZW50IG9iamVjdCBpbiBzb21lIHNpdHVhdGlvbnNcbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikgdGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICAgICAgdGhpcy5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWUgfVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbEV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkICYmIHRoaXMub3JpZ2luYWxFdmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpXG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgICAvL1RPRE86IHRoaXMgaXMgcmlwZSBmb3Igb3B0aW1pc2F0aW9uLCBuZXcgZXZlbnRzIGFyZSAqZXhwZW5zaXZlKlxuICAgICAgICAgIC8vIGltcHJvdmluZyB0aGlzIHdpbGwgc3BlZWQgdXAgZGVsZWdhdGVkIGV2ZW50c1xuICAgICAgICAgIHZhciBuZSA9IG5ldyBFdmVudCh0aGlzLCB0aGlzLmVsZW1lbnQsIHRoaXMuaXNOYXRpdmUpXG4gICAgICAgICAgbmUuY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXRcbiAgICAgICAgICByZXR1cm4gbmVcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBFdmVudFxuICAgICAgfSgpKVxuXG4gICAgICAvLyBpZiB3ZSdyZSBpbiBvbGQgSUUgd2UgY2FuJ3QgZG8gb25wcm9wZXJ0eWNoYW5nZSBvbiBkb2Mgb3Igd2luIHNvIHdlIHVzZSBkb2MuZG9jdW1lbnRFbGVtZW50IGZvciBib3RoXG4gICAgLCB0YXJnZXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGlzTmF0aXZlKSB7XG4gICAgICAgIHJldHVybiAhVzNDX01PREVMICYmICFpc05hdGl2ZSAmJiAoZWxlbWVudCA9PT0gZG9jIHx8IGVsZW1lbnQgPT09IHdpbikgPyByb290IDogZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBCZWFuIG1haW50YWlucyBhbiBpbnRlcm5hbCByZWdpc3RyeSBmb3IgZXZlbnQgbGlzdGVuZXJzLiBXZSBkb24ndCB0b3VjaCBlbGVtZW50cywgb2JqZWN0c1xuICAgICAgICAqIG9yIGZ1bmN0aW9ucyB0byBpZGVudGlmeSB0aGVtLCBpbnN0ZWFkIHdlIHN0b3JlIGV2ZXJ5dGhpbmcgaW4gdGhlIHJlZ2lzdHJ5LlxuICAgICAgICAqIEVhY2ggZXZlbnQgbGlzdGVuZXIgaGFzIGEgUmVnRW50cnkgb2JqZWN0LCB3ZSBoYXZlIG9uZSAncmVnaXN0cnknIGZvciB0aGUgd2hvbGUgaW5zdGFuY2UuXG4gICAgICAgICovXG4gICAgLCBSZWdFbnRyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGVhY2ggaGFuZGxlciBpcyB3cmFwcGVkIHNvIHdlIGNhbiBoYW5kbGUgZGVsZWdhdGlvbiBhbmQgY3VzdG9tIGV2ZW50c1xuICAgICAgICB2YXIgd3JhcHBlZEhhbmRsZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgZm4sIGNvbmRpdGlvbiwgYXJncykge1xuICAgICAgICAgICAgdmFyIGNhbGwgPSBmdW5jdGlvbiAoZXZlbnQsIGVhcmdzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgYXJncyA/IHNsaWNlLmNhbGwoZWFyZ3MsIGV2ZW50ID8gMCA6IDEpLmNvbmNhdChhcmdzKSA6IGVhcmdzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCBmaW5kVGFyZ2V0ID0gZnVuY3Rpb24gKGV2ZW50LCBldmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmbi5fX2JlYW5EZWwgPyBmbi5fX2JlYW5EZWwuZnQoZXZlbnQudGFyZ2V0LCBlbGVtZW50KSA6IGV2ZW50RWxlbWVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCBoYW5kbGVyID0gY29uZGl0aW9uXG4gICAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBmaW5kVGFyZ2V0KGV2ZW50LCB0aGlzKSAvLyBkZWxlYXRlZCBldmVudFxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24uYXBwbHkodGFyZ2V0LCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQpIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsKGV2ZW50LCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChmbi5fX2JlYW5EZWwpIGV2ZW50ID0gZXZlbnQuY2xvbmUoZmluZFRhcmdldChldmVudCkpIC8vIGRlbGVnYXRlZCBldmVudCwgZml4IHRoZSBmaXhcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbChldmVudCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW5kbGVyLl9fYmVhbkRlbCA9IGZuLl9fYmVhbkRlbFxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgICAgICAgICB9XG5cbiAgICAgICAgLCBSZWdFbnRyeSA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBoYW5kbGVyLCBvcmlnaW5hbCwgbmFtZXNwYWNlcywgYXJncywgcm9vdCkge1xuICAgICAgICAgICAgdmFyIGN1c3RvbVR5cGUgICAgID0gY3VzdG9tRXZlbnRzW3R5cGVdXG4gICAgICAgICAgICAgICwgaXNOYXRpdmVcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ3VubG9hZCcpIHtcbiAgICAgICAgICAgICAgLy8gc2VsZiBjbGVhbi11cFxuICAgICAgICAgICAgICBoYW5kbGVyID0gb25jZShyZW1vdmVMaXN0ZW5lciwgZWxlbWVudCwgdHlwZSwgaGFuZGxlciwgb3JpZ2luYWwpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXN0b21UeXBlKSB7XG4gICAgICAgICAgICAgIGlmIChjdXN0b21UeXBlLmNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIgPSB3cmFwcGVkSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyLCBjdXN0b21UeXBlLmNvbmRpdGlvbiwgYXJncylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0eXBlID0gY3VzdG9tVHlwZS5iYXNlIHx8IHR5cGVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pc05hdGl2ZSAgICAgID0gaXNOYXRpdmUgPSBuYXRpdmVFdmVudHNbdHlwZV0gJiYgISFlbGVtZW50W2V2ZW50U3VwcG9ydF1cbiAgICAgICAgICAgIHRoaXMuY3VzdG9tVHlwZSAgICA9ICFXM0NfTU9ERUwgJiYgIWlzTmF0aXZlICYmIHR5cGVcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCAgICAgICA9IGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMudHlwZSAgICAgICAgICA9IHR5cGVcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWwgICAgICA9IG9yaWdpbmFsXG4gICAgICAgICAgICB0aGlzLm5hbWVzcGFjZXMgICAgPSBuYW1lc3BhY2VzXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSAgICAgPSBXM0NfTU9ERUwgfHwgaXNOYXRpdmUgPyB0eXBlIDogJ3Byb3BlcnR5Y2hhbmdlJ1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgICAgICAgID0gdGFyZ2V0RWxlbWVudChlbGVtZW50LCBpc05hdGl2ZSlcbiAgICAgICAgICAgIHRoaXNbZXZlbnRTdXBwb3J0XSA9ICEhdGhpcy50YXJnZXRbZXZlbnRTdXBwb3J0XVxuICAgICAgICAgICAgdGhpcy5yb290ICAgICAgICAgID0gcm9vdFxuICAgICAgICAgICAgdGhpcy5oYW5kbGVyICAgICAgID0gd3JhcHBlZEhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgbnVsbCwgYXJncylcbiAgICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2l2ZW4gYSBsaXN0IG9mIG5hbWVzcGFjZXMsIGlzIG91ciBlbnRyeSBpbiBhbnkgb2YgdGhlbT9cbiAgICAgICAgUmVnRW50cnkucHJvdG90eXBlLmluTmFtZXNwYWNlcyA9IGZ1bmN0aW9uIChjaGVja05hbWVzcGFjZXMpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgYyA9IDBcbiAgICAgICAgICBpZiAoIWNoZWNrTmFtZXNwYWNlcykgcmV0dXJuIHRydWVcbiAgICAgICAgICBpZiAoIXRoaXMubmFtZXNwYWNlcykgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgZm9yIChpID0gY2hlY2tOYW1lc3BhY2VzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgZm9yIChqID0gdGhpcy5uYW1lc3BhY2VzLmxlbmd0aDsgai0tOykge1xuICAgICAgICAgICAgICBpZiAoY2hlY2tOYW1lc3BhY2VzW2ldID09IHRoaXMubmFtZXNwYWNlc1tqXSkgYysrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGVja05hbWVzcGFjZXMubGVuZ3RoID09PSBjXG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXRjaCBieSBlbGVtZW50LCBvcmlnaW5hbCBmbiAob3B0KSwgaGFuZGxlciBmbiAob3B0KVxuICAgICAgICBSZWdFbnRyeS5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChjaGVja0VsZW1lbnQsIGNoZWNrT3JpZ2luYWwsIGNoZWNrSGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQgPT09IGNoZWNrRWxlbWVudCAmJlxuICAgICAgICAgICAgKCFjaGVja09yaWdpbmFsIHx8IHRoaXMub3JpZ2luYWwgPT09IGNoZWNrT3JpZ2luYWwpICYmXG4gICAgICAgICAgICAoIWNoZWNrSGFuZGxlciB8fCB0aGlzLmhhbmRsZXIgPT09IGNoZWNrSGFuZGxlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZWdFbnRyeVxuICAgICAgfSgpKVxuXG4gICAgLCByZWdpc3RyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIG91ciBtYXAgc3RvcmVzIGFycmF5cyBieSBldmVudCB0eXBlLCBqdXN0IGJlY2F1c2UgaXQncyBiZXR0ZXIgdGhhbiBzdG9yaW5nXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgaW4gYSBzaW5nbGUgYXJyYXkuXG4gICAgICAgIC8vIHVzZXMgJyQnIGFzIGEgcHJlZml4IGZvciB0aGUga2V5cyBmb3Igc2FmZXR5IGFuZCAncicgYXMgYSBzcGVjaWFsIHByZWZpeCBmb3JcbiAgICAgICAgLy8gcm9vdExpc3RlbmVycyBzbyB3ZSBjYW4gbG9vayB0aGVtIHVwIGZhc3RcbiAgICAgICAgdmFyIG1hcCA9IHt9XG5cbiAgICAgICAgICAvLyBnZW5lcmljIGZ1bmN0aW9uYWwgc2VhcmNoIG9mIG91ciByZWdpc3RyeSBmb3IgbWF0Y2hpbmcgbGlzdGVuZXJzLFxuICAgICAgICAgIC8vIGBmbmAgcmV0dXJucyBmYWxzZSB0byBicmVhayBvdXQgb2YgdGhlIGxvb3BcbiAgICAgICAgICAsIGZvckFsbCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgaGFuZGxlciwgcm9vdCwgZm4pIHtcbiAgICAgICAgICAgICAgdmFyIHBmeCA9IHJvb3QgPyAncicgOiAnJCdcbiAgICAgICAgICAgICAgaWYgKCF0eXBlIHx8IHR5cGUgPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgLy8gc2VhcmNoIHRoZSB3aG9sZSByZWdpc3RyeVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHQgaW4gbWFwKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gcGZ4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvckFsbChlbGVtZW50LCB0LnN1YnN0cigxKSwgb3JpZ2luYWwsIGhhbmRsZXIsIHJvb3QsIGZuKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIGwsIGxpc3QgPSBtYXBbcGZ4ICsgdHlwZV0sIGFsbCA9IGVsZW1lbnQgPT0gJyonXG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0KSByZXR1cm5cbiAgICAgICAgICAgICAgICBmb3IgKGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgaWYgKChhbGwgfHwgbGlzdFtpXS5tYXRjaGVzKGVsZW1lbnQsIG9yaWdpbmFsLCBoYW5kbGVyKSkgJiYgIWZuKGxpc3RbaV0sIGxpc3QsIGksIHR5cGUpKSByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgaGFzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCByb290KSB7XG4gICAgICAgICAgICAgIC8vIHdlJ3JlIG5vdCB1c2luZyBmb3JBbGwgaGVyZSBzaW1wbHkgYmVjYXVzZSBpdCdzIGEgYml0IHNsb3dlciBhbmQgdGhpc1xuICAgICAgICAgICAgICAvLyBuZWVkcyB0byBiZSBmYXN0XG4gICAgICAgICAgICAgIHZhciBpLCBsaXN0ID0gbWFwWyhyb290ID8gJ3InIDogJyQnKSArIHR5cGVdXG4gICAgICAgICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICAgIGlmICghbGlzdFtpXS5yb290ICYmIGxpc3RbaV0ubWF0Y2hlcyhlbGVtZW50LCBvcmlnaW5hbCwgbnVsbCkpIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBnZXQgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIHJvb3QpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJpZXMgPSBbXVxuICAgICAgICAgICAgICBmb3JBbGwoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIG51bGwsIHJvb3QsIGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIHB1dCA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICB2YXIgaGFzID0gIWVudHJ5LnJvb3QgJiYgIXRoaXMuaGFzKGVudHJ5LmVsZW1lbnQsIGVudHJ5LnR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICAgICAgICwga2V5ID0gKGVudHJ5LnJvb3QgPyAncicgOiAnJCcpICsgZW50cnkudHlwZVxuICAgICAgICAgICAgICA7KG1hcFtrZXldIHx8IChtYXBba2V5XSA9IFtdKSkucHVzaChlbnRyeSlcbiAgICAgICAgICAgICAgcmV0dXJuIGhhc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBkZWwgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgZm9yQWxsKGVudHJ5LmVsZW1lbnQsIGVudHJ5LnR5cGUsIG51bGwsIGVudHJ5LmhhbmRsZXIsIGVudHJ5LnJvb3QsIGZ1bmN0aW9uIChlbnRyeSwgbGlzdCwgaSkge1xuICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgZW50cnkucmVtb3ZlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIGRlbGV0ZSBtYXBbKGVudHJ5LnJvb3QgPyAncicgOiAnJCcpICsgZW50cnkudHlwZV1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZHVtcCBhbGwgZW50cmllcywgdXNlZCBmb3Igb251bmxvYWRcbiAgICAgICAgICAsIGVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciB0LCBlbnRyaWVzID0gW11cbiAgICAgICAgICAgICAgZm9yICh0IGluIG1hcCkge1xuICAgICAgICAgICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnJCcpIGVudHJpZXMgPSBlbnRyaWVzLmNvbmNhdChtYXBbdF0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBoYXM6IGhhcywgZ2V0OiBnZXQsIHB1dDogcHV0LCBkZWw6IGRlbCwgZW50cmllczogZW50cmllcyB9XG4gICAgICB9KCkpXG5cbiAgICAgIC8vIHdlIG5lZWQgYSBzZWxlY3RvciBlbmdpbmUgZm9yIGRlbGVnYXRlZCBldmVudHMsIHVzZSBxdWVyeVNlbGVjdG9yQWxsIGlmIGl0IGV4aXN0c1xuICAgICAgLy8gYnV0IGZvciBvbGRlciBicm93c2VycyB3ZSBuZWVkIFF3ZXJ5LCBTaXp6bGUgb3Igc2ltaWxhclxuICAgICwgc2VsZWN0b3JFbmdpbmVcbiAgICAsIHNldFNlbGVjdG9yRW5naW5lID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZWN0b3JFbmdpbmUgPSBkb2MucXVlcnlTZWxlY3RvckFsbFxuICAgICAgICAgICAgPyBmdW5jdGlvbiAocywgcikge1xuICAgICAgICAgICAgICAgIHJldHVybiByLnF1ZXJ5U2VsZWN0b3JBbGwocylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCZWFuOiBObyBzZWxlY3RvciBlbmdpbmUgaW5zdGFsbGVkJykgLy8gZWVla1xuICAgICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0b3JFbmdpbmUgPSBlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2UgYXR0YWNoIHRoaXMgbGlzdGVuZXIgdG8gZWFjaCBET00gZXZlbnQgdGhhdCB3ZSBuZWVkIHRvIGxpc3RlbiB0bywgb25seSBvbmNlXG4gICAgICAvLyBwZXIgZXZlbnQgdHlwZSBwZXIgRE9NIGVsZW1lbnRcbiAgICAsIHJvb3RMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCwgdHlwZSkge1xuICAgICAgICBpZiAoIVczQ19NT0RFTCAmJiB0eXBlICYmIGV2ZW50ICYmIGV2ZW50LnByb3BlcnR5TmFtZSAhPSAnX29uJyArIHR5cGUpIHJldHVyblxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSByZWdpc3RyeS5nZXQodGhpcywgdHlwZSB8fCBldmVudC50eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAgICAgLCBpID0gMFxuXG4gICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50LCB0aGlzLCB0cnVlKVxuICAgICAgICBpZiAodHlwZSkgZXZlbnQudHlwZSA9IHR5cGVcblxuICAgICAgICAvLyBpdGVyYXRlIHRocm91Z2ggYWxsIGhhbmRsZXJzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgdHlwZSwgY2FsbGluZyB0aGVtIHVubGVzcyB0aGV5IGhhdmVcbiAgICAgICAgLy8gYmVlbiByZW1vdmVkIGJ5IGEgcHJldmlvdXMgaGFuZGxlciBvciBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSBoYXMgYmVlbiBjYWxsZWRcbiAgICAgICAgZm9yICg7IGkgPCBsICYmICFldmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWxpc3RlbmVyc1tpXS5yZW1vdmVkKSBsaXN0ZW5lcnNbaV0uaGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhbmQgcmVtb3ZlIGxpc3RlbmVycyB0byBET00gZWxlbWVudHNcbiAgICAsIGxpc3RlbmVyID0gVzNDX01PREVMXG4gICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGFkZCkge1xuICAgICAgICAgICAgLy8gbmV3IGJyb3dzZXJzXG4gICAgICAgICAgICBlbGVtZW50W2FkZCA/IGFkZEV2ZW50IDogcmVtb3ZlRXZlbnRdKHR5cGUsIHJvb3RMaXN0ZW5lciwgZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBhZGQsIGN1c3RvbSkge1xuICAgICAgICAgICAgLy8gSUU4IGFuZCBiZWxvdywgdXNlIGF0dGFjaEV2ZW50L2RldGFjaEV2ZW50IGFuZCB3ZSBoYXZlIHRvIHBpZ2d5LWJhY2sgcHJvcGVydHljaGFuZ2UgZXZlbnRzXG4gICAgICAgICAgICAvLyB0byBzaW11bGF0ZSBldmVudCBidWJibGluZyBldGMuXG4gICAgICAgICAgICB2YXIgZW50cnlcbiAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgcmVnaXN0cnkucHV0KGVudHJ5ID0gbmV3IFJlZ0VudHJ5KFxuICAgICAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgICwgY3VzdG9tIHx8IHR5cGVcbiAgICAgICAgICAgICAgICAsIGZ1bmN0aW9uIChldmVudCkgeyAvLyBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RMaXN0ZW5lci5jYWxsKGVsZW1lbnQsIGV2ZW50LCBjdXN0b20pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLCByb290TGlzdGVuZXJcbiAgICAgICAgICAgICAgICAsIG51bGxcbiAgICAgICAgICAgICAgICAsIG51bGxcbiAgICAgICAgICAgICAgICAsIHRydWUgLy8gaXMgcm9vdFxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICBpZiAoY3VzdG9tICYmIGVsZW1lbnRbJ19vbicgKyBjdXN0b21dID09IG51bGwpIGVsZW1lbnRbJ19vbicgKyBjdXN0b21dID0gMFxuICAgICAgICAgICAgICBlbnRyeS50YXJnZXQuYXR0YWNoRXZlbnQoJ29uJyArIGVudHJ5LmV2ZW50VHlwZSwgZW50cnkuaGFuZGxlcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVudHJ5ID0gcmVnaXN0cnkuZ2V0KGVsZW1lbnQsIGN1c3RvbSB8fCB0eXBlLCByb290TGlzdGVuZXIsIHRydWUpWzBdXG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5kZXRhY2hFdmVudCgnb24nICsgZW50cnkuZXZlbnRUeXBlLCBlbnRyeS5oYW5kbGVyKVxuICAgICAgICAgICAgICAgIHJlZ2lzdHJ5LmRlbChlbnRyeSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICwgb25jZSA9IGZ1bmN0aW9uIChybSwgZWxlbWVudCwgdHlwZSwgZm4sIG9yaWdpbmFsRm4pIHtcbiAgICAgICAgLy8gd3JhcCB0aGUgaGFuZGxlciBpbiBhIGhhbmRsZXIgdGhhdCBkb2VzIGEgcmVtb3ZlIGFzIHdlbGxcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgcm0oZWxlbWVudCwgdHlwZSwgb3JpZ2luYWxGbilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcmdUeXBlLCBoYW5kbGVyLCBuYW1lc3BhY2VzKSB7XG4gICAgICAgIHZhciB0eXBlICAgICA9IG9yZ1R5cGUgJiYgb3JnVHlwZS5yZXBsYWNlKG5hbWVSZWdleCwgJycpXG4gICAgICAgICAgLCBoYW5kbGVycyA9IHJlZ2lzdHJ5LmdldChlbGVtZW50LCB0eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAsIHJlbW92ZWQgID0ge31cbiAgICAgICAgICAsIGksIGxcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCghaGFuZGxlciB8fCBoYW5kbGVyc1tpXS5vcmlnaW5hbCA9PT0gaGFuZGxlcikgJiYgaGFuZGxlcnNbaV0uaW5OYW1lc3BhY2VzKG5hbWVzcGFjZXMpKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiB0aGlzIGlzIHByb2JsZW1hdGljLCB3ZSBoYXZlIGEgcmVnaXN0cnkuZ2V0KCkgYW5kIHJlZ2lzdHJ5LmRlbCgpIHRoYXRcbiAgICAgICAgICAgIC8vIGJvdGggZG8gcmVnaXN0cnkgc2VhcmNoZXMgc28gd2Ugd2FzdGUgY3ljbGVzIGRvaW5nIHRoaXMuIE5lZWRzIHRvIGJlIHJvbGxlZCBpbnRvXG4gICAgICAgICAgICAvLyBhIHNpbmdsZSByZWdpc3RyeS5mb3JBbGwoZm4pIHRoYXQgcmVtb3ZlcyB3aGlsZSBmaW5kaW5nLCBidXQgdGhlIGNhdGNoIGlzIHRoYXRcbiAgICAgICAgICAgIC8vIHdlJ2xsIGJlIHNwbGljaW5nIHRoZSBhcnJheXMgdGhhdCB3ZSdyZSBpdGVyYXRpbmcgb3Zlci4gTmVlZHMgZXh0cmEgdGVzdHMgdG9cbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBzY3JldyBpdCB1cC4gQHJ2YWdnXG4gICAgICAgICAgICByZWdpc3RyeS5kZWwoaGFuZGxlcnNbaV0pXG4gICAgICAgICAgICBpZiAoIXJlbW92ZWRbaGFuZGxlcnNbaV0uZXZlbnRUeXBlXSAmJiBoYW5kbGVyc1tpXVtldmVudFN1cHBvcnRdKVxuICAgICAgICAgICAgICByZW1vdmVkW2hhbmRsZXJzW2ldLmV2ZW50VHlwZV0gPSB7IHQ6IGhhbmRsZXJzW2ldLmV2ZW50VHlwZSwgYzogaGFuZGxlcnNbaV0udHlwZSB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGVhY2ggdHlwZS9lbGVtZW50IGZvciByZW1vdmVkIGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZSByb290TGlzdGVuZXIgd2hlcmUgaXQncyBubyBsb25nZXIgbmVlZGVkXG4gICAgICAgIGZvciAoaSBpbiByZW1vdmVkKSB7XG4gICAgICAgICAgaWYgKCFyZWdpc3RyeS5oYXMoZWxlbWVudCwgcmVtb3ZlZFtpXS50LCBudWxsLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIC8vIGxhc3QgbGlzdGVuZXIgb2YgdGhpcyB0eXBlLCByZW1vdmUgdGhlIHJvb3RMaXN0ZW5lclxuICAgICAgICAgICAgbGlzdGVuZXIoZWxlbWVudCwgcmVtb3ZlZFtpXS50LCBmYWxzZSwgcmVtb3ZlZFtpXS5jKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgdXAgYSBkZWxlZ2F0ZSBoZWxwZXIgdXNpbmcgdGhlIGdpdmVuIHNlbGVjdG9yLCB3cmFwIHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgLCBkZWxlZ2F0ZSA9IGZ1bmN0aW9uIChzZWxlY3RvciwgZm4pIHtcbiAgICAgICAgLy9UT0RPOiBmaW5kVGFyZ2V0ICh0aGVyZWZvcmUgJCkgaXMgY2FsbGVkIHR3aWNlLCBvbmNlIGZvciBtYXRjaCBhbmQgb25jZSBmb3JcbiAgICAgICAgLy8gc2V0dGluZyBlLmN1cnJlbnRUYXJnZXQsIGZpeCB0aGlzIHNvIGl0J3Mgb25seSBuZWVkZWQgb25jZVxuICAgICAgICB2YXIgZmluZFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQsIHJvb3QpIHtcbiAgICAgICAgICAgICAgdmFyIGksIGFycmF5ID0gaXNTdHJpbmcoc2VsZWN0b3IpID8gc2VsZWN0b3JFbmdpbmUoc2VsZWN0b3IsIHJvb3QpIDogc2VsZWN0b3JcbiAgICAgICAgICAgICAgZm9yICg7IHRhcmdldCAmJiB0YXJnZXQgIT09IHJvb3Q7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gYXJyYXkubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IHRhcmdldCkgcmV0dXJuIHRhcmdldFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICwgaGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgIHZhciBtYXRjaCA9IGZpbmRUYXJnZXQoZS50YXJnZXQsIHRoaXMpXG4gICAgICAgICAgICAgIGlmIChtYXRjaCkgZm4uYXBwbHkobWF0Y2gsIGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBfX2JlYW5EZWwgaXNuJ3QgcGxlYXNhbnQgYnV0IGl0J3MgYSBwcml2YXRlIGZ1bmN0aW9uLCBub3QgZXhwb3NlZCBvdXRzaWRlIG9mIEJlYW5cbiAgICAgICAgaGFuZGxlci5fX2JlYW5EZWwgPSB7XG4gICAgICAgICAgICBmdCAgICAgICA6IGZpbmRUYXJnZXQgLy8gYXR0YWNoIGl0IGhlcmUgZm9yIGN1c3RvbUV2ZW50cyB0byB1c2UgdG9vXG4gICAgICAgICAgLCBzZWxlY3RvciA6IHNlbGVjdG9yXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgICAgIH1cblxuICAgICwgZmlyZUxpc3RlbmVyID0gVzNDX01PREVMID8gZnVuY3Rpb24gKGlzTmF0aXZlLCB0eXBlLCBlbGVtZW50KSB7XG4gICAgICAgIC8vIG1vZGVybiBicm93c2VycywgZG8gYSBwcm9wZXIgZGlzcGF0Y2hFdmVudCgpXG4gICAgICAgIHZhciBldnQgPSBkb2MuY3JlYXRlRXZlbnQoaXNOYXRpdmUgPyAnSFRNTEV2ZW50cycgOiAnVUlFdmVudHMnKVxuICAgICAgICBldnRbaXNOYXRpdmUgPyAnaW5pdEV2ZW50JyA6ICdpbml0VUlFdmVudCddKHR5cGUsIHRydWUsIHRydWUsIHdpbiwgMSlcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcbiAgICAgIH0gOiBmdW5jdGlvbiAoaXNOYXRpdmUsIHR5cGUsIGVsZW1lbnQpIHtcbiAgICAgICAgLy8gb2xkIGJyb3dzZXIgdXNlIG9ucHJvcGVydHljaGFuZ2UsIGp1c3QgaW5jcmVtZW50IGEgY3VzdG9tIHByb3BlcnR5IHRvIHRyaWdnZXIgdGhlIGV2ZW50XG4gICAgICAgIGVsZW1lbnQgPSB0YXJnZXRFbGVtZW50KGVsZW1lbnQsIGlzTmF0aXZlKVxuICAgICAgICBpc05hdGl2ZSA/IGVsZW1lbnQuZmlyZUV2ZW50KCdvbicgKyB0eXBlLCBkb2MuY3JlYXRlRXZlbnRPYmplY3QoKSkgOiBlbGVtZW50Wydfb24nICsgdHlwZV0rK1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBQdWJsaWMgQVBJOiBvZmYoKSwgb24oKSwgYWRkKCksIChyZW1vdmUoKSksIG9uZSgpLCBmaXJlKCksIGNsb25lKClcbiAgICAgICAgKi9cblxuICAgICAgLyoqXG4gICAgICAgICogb2ZmKGVsZW1lbnRbLCBldmVudFR5cGUocylbLCBoYW5kbGVyIF1dKVxuICAgICAgICAqL1xuICAgICwgb2ZmID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGVTcGVjLCBmbikge1xuICAgICAgICB2YXIgaXNUeXBlU3RyID0gaXNTdHJpbmcodHlwZVNwZWMpXG4gICAgICAgICAgLCBrLCB0eXBlLCBuYW1lc3BhY2VzLCBpXG5cbiAgICAgICAgaWYgKGlzVHlwZVN0ciAmJiB0eXBlU3BlYy5pbmRleE9mKCcgJykgPiAwKSB7XG4gICAgICAgICAgLy8gb2ZmKGVsLCAndDEgdDIgdDMnLCBmbikgb3Igb2ZmKGVsLCAndDEgdDIgdDMnKVxuICAgICAgICAgIHR5cGVTcGVjID0gc3RyMmFycih0eXBlU3BlYylcbiAgICAgICAgICBmb3IgKGkgPSB0eXBlU3BlYy5sZW5ndGg7IGktLTspXG4gICAgICAgICAgICBvZmYoZWxlbWVudCwgdHlwZVNwZWNbaV0sIGZuKVxuICAgICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlID0gaXNUeXBlU3RyICYmIHR5cGVTcGVjLnJlcGxhY2UobmFtZVJlZ2V4LCAnJylcbiAgICAgICAgaWYgKHR5cGUgJiYgY3VzdG9tRXZlbnRzW3R5cGVdKSB0eXBlID0gY3VzdG9tRXZlbnRzW3R5cGVdLmJhc2VcblxuICAgICAgICBpZiAoIXR5cGVTcGVjIHx8IGlzVHlwZVN0cikge1xuICAgICAgICAgIC8vIG9mZihlbCkgb3Igb2ZmKGVsLCB0MS5ucykgb3Igb2ZmKGVsLCAubnMpIG9yIG9mZihlbCwgLm5zMS5uczIubnMzKVxuICAgICAgICAgIGlmIChuYW1lc3BhY2VzID0gaXNUeXBlU3RyICYmIHR5cGVTcGVjLnJlcGxhY2UobmFtZXNwYWNlUmVnZXgsICcnKSkgbmFtZXNwYWNlcyA9IHN0cjJhcnIobmFtZXNwYWNlcywgJy4nKVxuICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGVsZW1lbnQsIHR5cGUsIGZuLCBuYW1lc3BhY2VzKVxuICAgICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odHlwZVNwZWMpKSB7XG4gICAgICAgICAgLy8gb2ZmKGVsLCBmbilcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcihlbGVtZW50LCBudWxsLCB0eXBlU3BlYylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBvZmYoZWwsIHsgdDE6IGZuMSwgdDIsIGZuMiB9KVxuICAgICAgICAgIGZvciAoayBpbiB0eXBlU3BlYykge1xuICAgICAgICAgICAgaWYgKHR5cGVTcGVjLmhhc093blByb3BlcnR5KGspKSBvZmYoZWxlbWVudCwgaywgdHlwZVNwZWNba10pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogb24oZWxlbWVudCwgZXZlbnRUeXBlKHMpWywgc2VsZWN0b3JdLCBoYW5kbGVyWywgYXJncyBdKVxuICAgICAgICAqL1xuICAgICwgb24gPSBmdW5jdGlvbihlbGVtZW50LCBldmVudHMsIHNlbGVjdG9yLCBmbikge1xuICAgICAgICB2YXIgb3JpZ2luYWxGbiwgdHlwZSwgdHlwZXMsIGksIGFyZ3MsIGVudHJ5LCBmaXJzdFxuXG4gICAgICAgIC8vVE9ETzogdGhlIHVuZGVmaW5lZCBjaGVjayBtZWFucyB5b3UgY2FuJ3QgcGFzcyBhbiAnYXJncycgYXJndW1lbnQsIGZpeCB0aGlzIHBlcmhhcHM/XG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBldmVudHMgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvL1RPRE86IHRoaXMgY2FuJ3QgaGFuZGxlIGRlbGVnYXRlZCBldmVudHNcbiAgICAgICAgICBmb3IgKHR5cGUgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICAgIG9uLmNhbGwodGhpcywgZWxlbWVudCwgdHlwZSwgZXZlbnRzW3R5cGVdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGdW5jdGlvbihzZWxlY3RvcikpIHtcbiAgICAgICAgICAvLyBkZWxlZ2F0ZWQgZXZlbnRcbiAgICAgICAgICBvcmlnaW5hbEZuID0gZm5cbiAgICAgICAgICBhcmdzICAgICAgID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDQpXG4gICAgICAgICAgZm4gICAgICAgICA9IGRlbGVnYXRlKHNlbGVjdG9yLCBvcmlnaW5hbEZuLCBzZWxlY3RvckVuZ2luZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzICAgICAgID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpXG4gICAgICAgICAgZm4gICAgICAgICA9IG9yaWdpbmFsRm4gPSBzZWxlY3RvclxuICAgICAgICB9XG5cbiAgICAgICAgdHlwZXMgPSBzdHIyYXJyKGV2ZW50cylcblxuICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIG9uZSgpLCB3cmFwIGluIGEgc2VsZi1yZW1vdmluZyBoYW5kbGVyXG4gICAgICAgIGlmICh0aGlzID09PSBPTkUpIHtcbiAgICAgICAgICBmbiA9IG9uY2Uob2ZmLCBlbGVtZW50LCBldmVudHMsIGZuLCBvcmlnaW5hbEZuKVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gdHlwZXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgLy8gYWRkIG5ldyBoYW5kbGVyIHRvIHRoZSByZWdpc3RyeSBhbmQgY2hlY2sgaWYgaXQncyB0aGUgZmlyc3QgZm9yIHRoaXMgZWxlbWVudC90eXBlXG4gICAgICAgICAgZmlyc3QgPSByZWdpc3RyeS5wdXQoZW50cnkgPSBuZXcgUmVnRW50cnkoXG4gICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICwgdHlwZXNbaV0ucmVwbGFjZShuYW1lUmVnZXgsICcnKSAvLyBldmVudCB0eXBlXG4gICAgICAgICAgICAsIGZuXG4gICAgICAgICAgICAsIG9yaWdpbmFsRm5cbiAgICAgICAgICAgICwgc3RyMmFycih0eXBlc1tpXS5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJyksICcuJykgLy8gbmFtZXNwYWNlc1xuICAgICAgICAgICAgLCBhcmdzXG4gICAgICAgICAgICAsIGZhbHNlIC8vIG5vdCByb290XG4gICAgICAgICAgKSlcbiAgICAgICAgICBpZiAoZW50cnlbZXZlbnRTdXBwb3J0XSAmJiBmaXJzdCkge1xuICAgICAgICAgICAgLy8gZmlyc3QgZXZlbnQgb2YgdGhpcyB0eXBlIG9uIHRoaXMgZWxlbWVudCwgYWRkIHJvb3QgbGlzdGVuZXJcbiAgICAgICAgICAgIGxpc3RlbmVyKGVsZW1lbnQsIGVudHJ5LmV2ZW50VHlwZSwgdHJ1ZSwgZW50cnkuY3VzdG9tVHlwZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBhZGQoZWxlbWVudFssIHNlbGVjdG9yXSwgZXZlbnRUeXBlKHMpLCBoYW5kbGVyWywgYXJncyBdKVxuICAgICAgICAqXG4gICAgICAgICogRGVwcmVjYXRlZDoga2VwdCAoZm9yIG5vdykgZm9yIGJhY2t3YXJkLWNvbXBhdGliaWxpdHlcbiAgICAgICAgKi9cbiAgICAsIGFkZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudHMsIGZuLCBkZWxmbikge1xuICAgICAgICByZXR1cm4gb24uYXBwbHkoXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgLCAhaXNTdHJpbmcoZm4pXG4gICAgICAgICAgICAgID8gc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgICAgICAgICAgIDogWyBlbGVtZW50LCBmbiwgZXZlbnRzLCBkZWxmbiBdLmNvbmNhdChhcmd1bWVudHMubGVuZ3RoID4gMyA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCA1KSA6IFtdKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIG9uZShlbGVtZW50LCBldmVudFR5cGUocylbLCBzZWxlY3Rvcl0sIGhhbmRsZXJbLCBhcmdzIF0pXG4gICAgICAgICovXG4gICAgLCBvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvbi5hcHBseShPTkUsIGFyZ3VtZW50cylcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogZmlyZShlbGVtZW50LCBldmVudFR5cGUocylbLCBhcmdzIF0pXG4gICAgICAgICpcbiAgICAgICAgKiBUaGUgb3B0aW9uYWwgJ2FyZ3MnIGFyZ3VtZW50IG11c3QgYmUgYW4gYXJyYXksIGlmIG5vICdhcmdzJyBhcmd1bWVudCBpcyBwcm92aWRlZFxuICAgICAgICAqIHRoZW4gd2UgY2FuIHVzZSB0aGUgYnJvd3NlcidzIERPTSBldmVudCBzeXN0ZW0sIG90aGVyd2lzZSB3ZSB0cmlnZ2VyIGhhbmRsZXJzIG1hbnVhbGx5XG4gICAgICAgICovXG4gICAgLCBmaXJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGFyZ3MpIHtcbiAgICAgICAgdmFyIHR5cGVzID0gc3RyMmFycih0eXBlKVxuICAgICAgICAgICwgaSwgaiwgbCwgbmFtZXMsIGhhbmRsZXJzXG5cbiAgICAgICAgZm9yIChpID0gdHlwZXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgdHlwZSA9IHR5cGVzW2ldLnJlcGxhY2UobmFtZVJlZ2V4LCAnJylcbiAgICAgICAgICBpZiAobmFtZXMgPSB0eXBlc1tpXS5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpIG5hbWVzID0gc3RyMmFycihuYW1lcywgJy4nKVxuICAgICAgICAgIGlmICghbmFtZXMgJiYgIWFyZ3MgJiYgZWxlbWVudFtldmVudFN1cHBvcnRdKSB7XG4gICAgICAgICAgICBmaXJlTGlzdGVuZXIobmF0aXZlRXZlbnRzW3R5cGVdLCB0eXBlLCBlbGVtZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBub24tbmF0aXZlIGV2ZW50LCBlaXRoZXIgYmVjYXVzZSBvZiBhIG5hbWVzcGFjZSwgYXJndW1lbnRzIG9yIGEgbm9uIERPTSBlbGVtZW50XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIGxpc3RlbmVycyBhbmQgbWFudWFsbHkgJ2ZpcmUnXG4gICAgICAgICAgICBoYW5kbGVycyA9IHJlZ2lzdHJ5LmdldChlbGVtZW50LCB0eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAgIGFyZ3MgPSBbZmFsc2VdLmNvbmNhdChhcmdzKVxuICAgICAgICAgICAgZm9yIChqID0gMCwgbCA9IGhhbmRsZXJzLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICBpZiAoaGFuZGxlcnNbal0uaW5OYW1lc3BhY2VzKG5hbWVzKSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzW2pdLmhhbmRsZXIuYXBwbHkoZWxlbWVudCwgYXJncylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBjbG9uZShkc3RFbGVtZW50LCBzcmNFbGVtZW50WywgZXZlbnRUeXBlIF0pXG4gICAgICAgICpcbiAgICAgICAgKiBUT0RPOiBwZXJoYXBzIGZvciBjb25zaXN0ZW5jeSB3ZSBzaG91bGQgYWxsb3cgdGhlIHNhbWUgZmxleGliaWxpdHkgaW4gdHlwZSBzcGVjaWZpZXJzP1xuICAgICAgICAqL1xuICAgICwgY2xvbmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgZnJvbSwgdHlwZSkge1xuICAgICAgICB2YXIgaGFuZGxlcnMgPSByZWdpc3RyeS5nZXQoZnJvbSwgdHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgLCBsID0gaGFuZGxlcnMubGVuZ3RoXG4gICAgICAgICAgLCBpID0gMFxuICAgICAgICAgICwgYXJncywgYmVhbkRlbFxuXG4gICAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGhhbmRsZXJzW2ldLm9yaWdpbmFsKSB7XG4gICAgICAgICAgICBhcmdzID0gWyBlbGVtZW50LCBoYW5kbGVyc1tpXS50eXBlIF1cbiAgICAgICAgICAgIGlmIChiZWFuRGVsID0gaGFuZGxlcnNbaV0uaGFuZGxlci5fX2JlYW5EZWwpIGFyZ3MucHVzaChiZWFuRGVsLnNlbGVjdG9yKVxuICAgICAgICAgICAgYXJncy5wdXNoKGhhbmRsZXJzW2ldLm9yaWdpbmFsKVxuICAgICAgICAgICAgb24uYXBwbHkobnVsbCwgYXJncylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICwgYmVhbiA9IHtcbiAgICAgICAgICBvbiAgICAgICAgICAgICAgICA6IG9uXG4gICAgICAgICwgYWRkICAgICAgICAgICAgICAgOiBhZGRcbiAgICAgICAgLCBvbmUgICAgICAgICAgICAgICA6IG9uZVxuICAgICAgICAsIG9mZiAgICAgICAgICAgICAgIDogb2ZmXG4gICAgICAgICwgcmVtb3ZlICAgICAgICAgICAgOiBvZmZcbiAgICAgICAgLCBjbG9uZSAgICAgICAgICAgICA6IGNsb25lXG4gICAgICAgICwgZmlyZSAgICAgICAgICAgICAgOiBmaXJlXG4gICAgICAgICwgRXZlbnQgICAgICAgICAgICAgOiBFdmVudFxuICAgICAgICAsIHNldFNlbGVjdG9yRW5naW5lIDogc2V0U2VsZWN0b3JFbmdpbmVcbiAgICAgICAgLCBub0NvbmZsaWN0ICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRleHRbbmFtZV0gPSBvbGRcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gIC8vIGZvciBJRSwgY2xlYW4gdXAgb24gdW5sb2FkIHRvIGF2b2lkIGxlYWtzXG4gIGlmICh3aW4uYXR0YWNoRXZlbnQpIHtcbiAgICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpLCBlbnRyaWVzID0gcmVnaXN0cnkuZW50cmllcygpXG4gICAgICBmb3IgKGkgaW4gZW50cmllcykge1xuICAgICAgICBpZiAoZW50cmllc1tpXS50eXBlICYmIGVudHJpZXNbaV0udHlwZSAhPT0gJ3VubG9hZCcpIG9mZihlbnRyaWVzW2ldLmVsZW1lbnQsIGVudHJpZXNbaV0udHlwZSlcbiAgICAgIH1cbiAgICAgIHdpbi5kZXRhY2hFdmVudCgnb251bmxvYWQnLCBjbGVhbnVwKVxuICAgICAgd2luLkNvbGxlY3RHYXJiYWdlICYmIHdpbi5Db2xsZWN0R2FyYmFnZSgpXG4gICAgfVxuICAgIHdpbi5hdHRhY2hFdmVudCgnb251bmxvYWQnLCBjbGVhbnVwKVxuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSBzZWxlY3RvciBlbmdpbmUgdG8gaW50ZXJuYWwgZGVmYXVsdCAocVNBIG9yIHRocm93IEVycm9yKVxuICBzZXRTZWxlY3RvckVuZ2luZSgpXG5cbiAgcmV0dXJuIGJlYW5cbn0pOyIsIi8qIVxuICAqIEJvbnpvOiBET00gVXRpbGl0eSAoYykgRHVzdGluIERpYXogMjAxMlxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvYm9uem9cbiAgKiBMaWNlbnNlIE1JVFxuICAqL1xuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSkoJ2JvbnpvJywgdGhpcywgZnVuY3Rpb24oKSB7XG4gIHZhciB3aW4gPSB3aW5kb3dcbiAgICAsIGRvYyA9IHdpbi5kb2N1bWVudFxuICAgICwgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnRcbiAgICAsIHBhcmVudE5vZGUgPSAncGFyZW50Tm9kZSdcbiAgICAsIHNwZWNpYWxBdHRyaWJ1dGVzID0gL14oY2hlY2tlZHx2YWx1ZXxzZWxlY3RlZHxkaXNhYmxlZCkkL2lcbiAgICAgIC8vIHRhZ3MgdGhhdCB3ZSBoYXZlIHRyb3VibGUgaW5zZXJ0aW5nICppbnRvKlxuICAgICwgc3BlY2lhbFRhZ3MgPSAvXihzZWxlY3R8ZmllbGRzZXR8dGFibGV8dGJvZHl8dGZvb3R8dGR8dHJ8Y29sZ3JvdXApJC9pXG4gICAgLCBzaW1wbGVTY3JpcHRUYWdSZSA9IC9cXHMqPHNjcmlwdCArc3JjPVsnXCJdKFteJ1wiXSspWydcIl0+L1xuICAgICwgdGFibGUgPSBbJzx0YWJsZT4nLCAnPC90YWJsZT4nLCAxXVxuICAgICwgdGQgPSBbJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nLCAzXVxuICAgICwgb3B0aW9uID0gWyc8c2VsZWN0PicsICc8L3NlbGVjdD4nLCAxXVxuICAgICwgbm9zY29wZSA9IFsnXycsICcnLCAwLCAxXVxuICAgICwgdGFnTWFwID0geyAvLyB0YWdzIHRoYXQgd2UgaGF2ZSB0cm91YmxlICppbnNlcnRpbmcqXG4gICAgICAgICAgdGhlYWQ6IHRhYmxlLCB0Ym9keTogdGFibGUsIHRmb290OiB0YWJsZSwgY29sZ3JvdXA6IHRhYmxlLCBjYXB0aW9uOiB0YWJsZVxuICAgICAgICAsIHRyOiBbJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nLCAyXVxuICAgICAgICAsIHRoOiB0ZCAsIHRkOiB0ZFxuICAgICAgICAsIGNvbDogWyc8dGFibGU+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+JywgMl1cbiAgICAgICAgLCBmaWVsZHNldDogWyc8Zm9ybT4nLCAnPC9mb3JtPicsIDFdXG4gICAgICAgICwgbGVnZW5kOiBbJzxmb3JtPjxmaWVsZHNldD4nLCAnPC9maWVsZHNldD48L2Zvcm0+JywgMl1cbiAgICAgICAgLCBvcHRpb246IG9wdGlvbiwgb3B0Z3JvdXA6IG9wdGlvblxuICAgICAgICAsIHNjcmlwdDogbm9zY29wZSwgc3R5bGU6IG5vc2NvcGUsIGxpbms6IG5vc2NvcGUsIHBhcmFtOiBub3Njb3BlLCBiYXNlOiBub3Njb3BlXG4gICAgICB9XG4gICAgLCBzdGF0ZUF0dHJpYnV0ZXMgPSAvXihjaGVja2VkfHNlbGVjdGVkfGRpc2FibGVkKSQvXG4gICAgLCBpZSA9IC9tc2llL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuICAgICwgaGFzQ2xhc3MsIGFkZENsYXNzLCByZW1vdmVDbGFzc1xuICAgICwgdWlkTWFwID0ge31cbiAgICAsIHV1aWRzID0gMFxuICAgICwgZGlnaXQgPSAvXi0/W1xcZFxcLl0rJC9cbiAgICAsIGRhdHRyID0gL15kYXRhLSguKykkL1xuICAgICwgcHggPSAncHgnXG4gICAgLCBzZXRBdHRyaWJ1dGUgPSAnc2V0QXR0cmlidXRlJ1xuICAgICwgZ2V0QXR0cmlidXRlID0gJ2dldEF0dHJpYnV0ZSdcbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgZmVhdHVyZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgICAgIGUuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjeFwiPng8L2E+PHRhYmxlIHN0eWxlPVwiZmxvYXQ6bGVmdDtcIj48L3RhYmxlPidcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmRXh0ZW5kZWQ6IGVbYnlUYWddKCdhJylbMF1bZ2V0QXR0cmlidXRlXSgnaHJlZicpICE9ICcjeCcgLy8gSUUgPCA4XG4gICAgICAgICwgYXV0b1Rib2R5OiBlW2J5VGFnXSgndGJvZHknKS5sZW5ndGggIT09IDAgLy8gSUUgPCA4XG4gICAgICAgICwgY29tcHV0ZWRTdHlsZTogZG9jLmRlZmF1bHRWaWV3ICYmIGRvYy5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlXG4gICAgICAgICwgY3NzRmxvYXQ6IGVbYnlUYWddKCd0YWJsZScpWzBdLnN0eWxlLnN0eWxlRmxvYXQgPyAnc3R5bGVGbG9hdCcgOiAnY3NzRmxvYXQnXG4gICAgICAgICwgdHJhbnNmb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvcHMgPSBbJ3RyYW5zZm9ybScsICd3ZWJraXRUcmFuc2Zvcm0nLCAnTW96VHJhbnNmb3JtJywgJ09UcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nXSwgaVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9wc1tpXSBpbiBlLnN0eWxlKSByZXR1cm4gcHJvcHNbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KClcbiAgICAgICAgLCBjbGFzc0xpc3Q6ICdjbGFzc0xpc3QnIGluIGVcbiAgICAgICAgLCBvcGFzaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGRvYy5jcmVhdGVFbGVtZW50KCdhJykuc3R5bGUub3BhY2l0eSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICB9KClcbiAgICAgICAgfVxuICAgICAgfSgpXG4gICAgLCB0cmltUmVwbGFjZSA9IC8oXlxccyp8XFxzKiQpL2dcbiAgICAsIHdoaXRlc3BhY2VSZWdleCA9IC9cXHMrL1xuICAgICwgdG9TdHJpbmcgPSBTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLCB1bml0bGVzcyA9IHsgbGluZUhlaWdodDogMSwgem9vbTogMSwgekluZGV4OiAxLCBvcGFjaXR5OiAxLCBib3hGbGV4OiAxLCBXZWJraXRCb3hGbGV4OiAxLCBNb3pCb3hGbGV4OiAxIH1cbiAgICAsIHF1ZXJ5ID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwgJiYgZnVuY3Rpb24gKHNlbGVjdG9yKSB7IHJldHVybiBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgfVxuICAgICwgdHJpbSA9IFN0cmluZy5wcm90b3R5cGUudHJpbSA/XG4gICAgICAgIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHMudHJpbSgpXG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbiAocykge1xuICAgICAgICAgIHJldHVybiBzLnJlcGxhY2UodHJpbVJlcGxhY2UsICcnKVxuICAgICAgICB9XG5cbiAgICAsIGdldFN0eWxlID0gZmVhdHVyZXMuY29tcHV0ZWRTdHlsZVxuICAgICAgICA/IGZ1bmN0aW9uIChlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG51bGxcbiAgICAgICAgICAgICAgLCBjb21wdXRlZCA9IGRvYy5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCAnJylcbiAgICAgICAgICAgIGNvbXB1dGVkICYmICh2YWx1ZSA9IGNvbXB1dGVkW3Byb3BlcnR5XSlcbiAgICAgICAgICAgIHJldHVybiBlbC5zdHlsZVtwcm9wZXJ0eV0gfHwgdmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgIDogIShpZSAmJiBodG1sLmN1cnJlbnRTdHlsZSlcbiAgICAgICAgICA/IGZ1bmN0aW9uIChlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsLnN0eWxlW3Byb3BlcnR5XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDpcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfG51bWJlcn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBmdW5jdGlvbiAoZWwsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdmFsLCB2YWx1ZVxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09ICdvcGFjaXR5JyAmJiAhZmVhdHVyZXMub3Bhc2l0eSkge1xuICAgICAgICAgICAgICB2YWwgPSAxMDBcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YWwgPSBlbFsnZmlsdGVycyddWydEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYSddLm9wYWNpdHlcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZTEpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFsID0gZWxbJ2ZpbHRlcnMnXSgnYWxwaGEnKS5vcGFjaXR5XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHt9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbCAvIDEwMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBlbC5jdXJyZW50U3R5bGUgPyBlbC5jdXJyZW50U3R5bGVbcHJvcGVydHldIDogbnVsbFxuICAgICAgICAgICAgcmV0dXJuIGVsLnN0eWxlW3Byb3BlcnR5XSB8fCB2YWx1ZVxuICAgICAgICAgIH1cblxuICBmdW5jdGlvbiBpc05vZGUobm9kZSkge1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubm9kZU5hbWUgJiYgKG5vZGUubm9kZVR5cGUgPT0gMSB8fCBub2RlLm5vZGVUeXBlID09IDExKVxuICB9XG5cblxuICBmdW5jdGlvbiBub3JtYWxpemUobm9kZSwgaG9zdCwgY2xvbmUpIHtcbiAgICB2YXIgaSwgbCwgcmV0XG4gICAgaWYgKHR5cGVvZiBub2RlID09ICdzdHJpbmcnKSByZXR1cm4gYm9uem8uY3JlYXRlKG5vZGUpXG4gICAgaWYgKGlzTm9kZShub2RlKSkgbm9kZSA9IFsgbm9kZSBdXG4gICAgaWYgKGNsb25lKSB7XG4gICAgICByZXQgPSBbXSAvLyBkb24ndCBjaGFuZ2Ugb3JpZ2luYWwgYXJyYXlcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBub2RlLmxlbmd0aDsgaSA8IGw7IGkrKykgcmV0W2ldID0gY2xvbmVOb2RlKGhvc3QsIG5vZGVbaV0pXG4gICAgICByZXR1cm4gcmV0XG4gICAgfVxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGMgYSBjbGFzcyBuYW1lIHRvIHRlc3RcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGNsYXNzUmVnKGMpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnKF58XFxcXHMrKScgKyBjICsgJyhcXFxccyt8JCknKVxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtCb256b3xBcnJheX0gYXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsIG51bWJlciwgKEJvbnpvfEFycmF5KSl9IGZuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF9yZXZcbiAgICogQHJldHVybiB7Qm9uem98QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBlYWNoKGFyLCBmbiwgb3B0X3Njb3BlLCBvcHRfcmV2KSB7XG4gICAgdmFyIGluZCwgaSA9IDAsIGwgPSBhci5sZW5ndGhcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgaW5kID0gb3B0X3JldiA/IGFyLmxlbmd0aCAtIGkgLSAxIDogaVxuICAgICAgZm4uY2FsbChvcHRfc2NvcGUgfHwgYXJbaW5kXSwgYXJbaW5kXSwgaW5kLCBhcilcbiAgICB9XG4gICAgcmV0dXJuIGFyXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0JvbnpvfEFycmF5fSBhclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCwgbnVtYmVyLCAoQm9uem98QXJyYXkpKX0gZm5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICogQHJldHVybiB7Qm9uem98QXJyYXl9XG4gICAqL1xuICBmdW5jdGlvbiBkZWVwRWFjaChhciwgZm4sIG9wdF9zY29wZSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaXNOb2RlKGFyW2ldKSkge1xuICAgICAgICBkZWVwRWFjaChhcltpXS5jaGlsZE5vZGVzLCBmbiwgb3B0X3Njb3BlKVxuICAgICAgICBmbi5jYWxsKG9wdF9zY29wZSB8fCBhcltpXSwgYXJbaV0sIGksIGFyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNhbWVsaXplKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uIChtLCBtMSkge1xuICAgICAgcmV0dXJuIG0xLnRvVXBwZXJDYXNlKClcbiAgICB9KVxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZGVjYW1lbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCkgOiBzXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBmdW5jdGlvbiBkYXRhKGVsKSB7XG4gICAgZWxbZ2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcpIHx8IGVsW3NldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnLCArK3V1aWRzKVxuICAgIHZhciB1aWQgPSBlbFtnZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJylcbiAgICByZXR1cm4gdWlkTWFwW3VpZF0gfHwgKHVpZE1hcFt1aWRdID0ge30pXG4gIH1cblxuXG4gIC8qKlxuICAgKiByZW1vdmVzIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhbiBlbGVtZW50XG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFyRGF0YShlbCkge1xuICAgIHZhciB1aWQgPSBlbFtnZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJylcbiAgICBpZiAodWlkKSBkZWxldGUgdWlkTWFwW3VpZF1cbiAgfVxuXG5cbiAgZnVuY3Rpb24gZGF0YVZhbHVlKGQpIHtcbiAgICB2YXIgZlxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGQgPT09IG51bGwgfHwgZCA9PT0gdW5kZWZpbmVkKSA/IHVuZGVmaW5lZCA6XG4gICAgICAgIGQgPT09ICd0cnVlJyA/IHRydWUgOlxuICAgICAgICAgIGQgPT09ICdmYWxzZScgPyBmYWxzZSA6XG4gICAgICAgICAgICBkID09PSAnbnVsbCcgPyBudWxsIDpcbiAgICAgICAgICAgICAgKGYgPSBwYXJzZUZsb2F0KGQpKSA9PSBkID8gZiA6IGQ7XG4gICAgfSBjYXRjaChlKSB7fVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9uem98QXJyYXl9IGFyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBudW1iZXIsIChCb256b3xBcnJheSkpfSBmblxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIGBzb21lYHRoaW5nIHdhcyBmb3VuZFxuICAgKi9cbiAgZnVuY3Rpb24gc29tZShhciwgZm4sIG9wdF9zY29wZSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXIubGVuZ3RoOyBpIDwgajsgKytpKSBpZiAoZm4uY2FsbChvcHRfc2NvcGUgfHwgbnVsbCwgYXJbaV0sIGksIGFyKSkgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHRoaXMgY291bGQgYmUgYSBnaWFudCBlbnVtIG9mIENTUyBwcm9wZXJ0aWVzXG4gICAqIGJ1dCBpbiBmYXZvciBvZiBmaWxlIHNpemUgc2Fucy1jbG9zdXJlIGRlYWRjb2RlIG9wdGltaXphdGlvbnNcbiAgICogd2UncmUganVzdCBhc2tpbmcgZm9yIGFueSBvbCBzdHJpbmdcbiAgICogdGhlbiBpdCBnZXRzIHRyYW5zZm9ybWVkIGludG8gdGhlIGFwcHJvcHJpYXRlIHN0eWxlIHByb3BlcnR5IGZvciBKUyBhY2Nlc3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc3R5bGVQcm9wZXJ0eShwKSB7XG4gICAgICAocCA9PSAndHJhbnNmb3JtJyAmJiAocCA9IGZlYXR1cmVzLnRyYW5zZm9ybSkpIHx8XG4gICAgICAgICgvXnRyYW5zZm9ybS0/W09vXXJpZ2luJC8udGVzdChwKSAmJiAocCA9IGZlYXR1cmVzLnRyYW5zZm9ybSArICdPcmlnaW4nKSkgfHxcbiAgICAgICAgKHAgPT0gJ2Zsb2F0JyAmJiAocCA9IGZlYXR1cmVzLmNzc0Zsb2F0KSlcbiAgICAgIHJldHVybiBwID8gY2FtZWxpemUocCkgOiBudWxsXG4gIH1cblxuICAvLyB0aGlzIGluc2VydCBtZXRob2QgaXMgaW50ZW5zZVxuICBmdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBob3N0LCBmbiwgcmV2KSB7XG4gICAgdmFyIGkgPSAwLCBzZWxmID0gaG9zdCB8fCB0aGlzLCByID0gW11cbiAgICAgIC8vIHRhcmdldCBub2RlcyBjb3VsZCBiZSBhIGNzcyBzZWxlY3RvciBpZiBpdCdzIGEgc3RyaW5nIGFuZCBhIHNlbGVjdG9yIGVuZ2luZSBpcyBwcmVzZW50XG4gICAgICAvLyBvdGhlcndpc2UsIGp1c3QgdXNlIHRhcmdldFxuICAgICAgLCBub2RlcyA9IHF1ZXJ5ICYmIHR5cGVvZiB0YXJnZXQgPT0gJ3N0cmluZycgJiYgdGFyZ2V0LmNoYXJBdCgwKSAhPSAnPCcgPyBxdWVyeSh0YXJnZXQpIDogdGFyZ2V0XG4gICAgLy8gbm9ybWFsaXplIGVhY2ggbm9kZSBpbiBjYXNlIGl0J3Mgc3RpbGwgYSBzdHJpbmcgYW5kIHdlIG5lZWQgdG8gY3JlYXRlIG5vZGVzIG9uIHRoZSBmbHlcbiAgICBlYWNoKG5vcm1hbGl6ZShub2RlcyksIGZ1bmN0aW9uICh0LCBqKSB7XG4gICAgICBlYWNoKHNlbGYsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBmbih0LCByW2krK10gPSBqID4gMCA/IGNsb25lTm9kZShzZWxmLCBlbCkgOiBlbClcbiAgICAgIH0sIG51bGwsIHJldilcbiAgICB9LCB0aGlzLCByZXYpXG4gICAgc2VsZi5sZW5ndGggPSBpXG4gICAgZWFjaChyLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZlstLWldID0gZVxuICAgIH0sIG51bGwsICFyZXYpXG4gICAgcmV0dXJuIHNlbGZcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHNldHMgYW4gZWxlbWVudCB0byBhbiBleHBsaWNpdCB4L3kgcG9zaXRpb24gb24gdGhlIHBhZ2VcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0gez9udW1iZXJ9IHhcbiAgICogQHBhcmFtIHs/bnVtYmVyfSB5XG4gICAqL1xuICBmdW5jdGlvbiB4eShlbCwgeCwgeSkge1xuICAgIHZhciAkZWwgPSBib256byhlbClcbiAgICAgICwgc3R5bGUgPSAkZWwuY3NzKCdwb3NpdGlvbicpXG4gICAgICAsIG9mZnNldCA9ICRlbC5vZmZzZXQoKVxuICAgICAgLCByZWwgPSAncmVsYXRpdmUnXG4gICAgICAsIGlzUmVsID0gc3R5bGUgPT0gcmVsXG4gICAgICAsIGRlbHRhID0gW3BhcnNlSW50KCRlbC5jc3MoJ2xlZnQnKSwgMTApLCBwYXJzZUludCgkZWwuY3NzKCd0b3AnKSwgMTApXVxuXG4gICAgaWYgKHN0eWxlID09ICdzdGF0aWMnKSB7XG4gICAgICAkZWwuY3NzKCdwb3NpdGlvbicsIHJlbClcbiAgICAgIHN0eWxlID0gcmVsXG4gICAgfVxuXG4gICAgaXNOYU4oZGVsdGFbMF0pICYmIChkZWx0YVswXSA9IGlzUmVsID8gMCA6IGVsLm9mZnNldExlZnQpXG4gICAgaXNOYU4oZGVsdGFbMV0pICYmIChkZWx0YVsxXSA9IGlzUmVsID8gMCA6IGVsLm9mZnNldFRvcClcblxuICAgIHggIT0gbnVsbCAmJiAoZWwuc3R5bGUubGVmdCA9IHggLSBvZmZzZXQubGVmdCArIGRlbHRhWzBdICsgcHgpXG4gICAgeSAhPSBudWxsICYmIChlbC5zdHlsZS50b3AgPSB5IC0gb2Zmc2V0LnRvcCArIGRlbHRhWzFdICsgcHgpXG5cbiAgfVxuXG4gIC8vIGNsYXNzTGlzdCBzdXBwb3J0IGZvciBjbGFzcyBtYW5hZ2VtZW50XG4gIC8vIGFsdGhvIHRvIGJlIGZhaXIsIHRoZSBhcGkgc3Vja3MgYmVjYXVzZSBpdCB3b24ndCBhY2NlcHQgbXVsdGlwbGUgY2xhc3NlcyBhdCBvbmNlXG4gIGlmIChmZWF0dXJlcy5jbGFzc0xpc3QpIHtcbiAgICBoYXNDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjKVxuICAgIH1cbiAgICBhZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjKVxuICAgIH1cbiAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjKVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBoYXNDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgcmV0dXJuIGNsYXNzUmVnKGMpLnRlc3QoZWwuY2xhc3NOYW1lKVxuICAgIH1cbiAgICBhZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NOYW1lID0gdHJpbShlbC5jbGFzc05hbWUgKyAnICcgKyBjKVxuICAgIH1cbiAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgYykge1xuICAgICAgZWwuY2xhc3NOYW1lID0gdHJpbShlbC5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZyhjKSwgJyAnKSlcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiB0aGlzIGFsbG93cyBtZXRob2QgY2FsbGluZyBmb3Igc2V0dGluZyB2YWx1ZXNcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYm9uem8oZWxlbWVudHMpLmNzcygnY29sb3InLCBmdW5jdGlvbiAoZWwpIHtcbiAgICogICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLWNvbG9yJylcbiAgICogfSlcbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uIChFbGVtZW50KXxzdHJpbmd9XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNldHRlcihlbCwgdikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PSAnZnVuY3Rpb24nID8gdihlbCkgOiB2XG4gIH1cblxuICBmdW5jdGlvbiBzY3JvbGwoeCwgeSwgdHlwZSkge1xuICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICBpZiAoIWVsKSByZXR1cm4gdGhpc1xuICAgIGlmICh4ID09IG51bGwgJiYgeSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gKGlzQm9keShlbCkgPyBnZXRXaW5kb3dTY3JvbGwoKSA6IHsgeDogZWwuc2Nyb2xsTGVmdCwgeTogZWwuc2Nyb2xsVG9wIH0pW3R5cGVdXG4gICAgfVxuICAgIGlmIChpc0JvZHkoZWwpKSB7XG4gICAgICB3aW4uc2Nyb2xsVG8oeCwgeSlcbiAgICB9IGVsc2Uge1xuICAgICAgeCAhPSBudWxsICYmIChlbC5zY3JvbGxMZWZ0ID0geClcbiAgICAgIHkgIT0gbnVsbCAmJiAoZWwuc2Nyb2xsVG9wID0geSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtBcnJheS48RWxlbWVudD58RWxlbWVudHxOb2RlfHN0cmluZ30gZWxlbWVudHNcbiAgICovXG4gIGZ1bmN0aW9uIEJvbnpvKGVsZW1lbnRzKSB7XG4gICAgdGhpcy5sZW5ndGggPSAwXG4gICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICBlbGVtZW50cyA9IHR5cGVvZiBlbGVtZW50cyAhPT0gJ3N0cmluZycgJiZcbiAgICAgICAgIWVsZW1lbnRzLm5vZGVUeXBlICYmXG4gICAgICAgIHR5cGVvZiBlbGVtZW50cy5sZW5ndGggIT09ICd1bmRlZmluZWQnID9cbiAgICAgICAgICBlbGVtZW50cyA6XG4gICAgICAgICAgW2VsZW1lbnRzXVxuICAgICAgdGhpcy5sZW5ndGggPSBlbGVtZW50cy5sZW5ndGhcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHRoaXNbaV0gPSBlbGVtZW50c1tpXVxuICAgIH1cbiAgfVxuXG4gIEJvbnpvLnByb3RvdHlwZSA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbaW5kZXhdIHx8IG51bGxcbiAgICAgIH1cblxuICAgICAgLy8gaXRldGF0b3JzXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oRWxlbWVudHxOb2RlKX0gZm5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZWFjaDogZnVuY3Rpb24gKGZuLCBvcHRfc2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIGVhY2godGhpcywgZm4sIG9wdF9zY29wZSlcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBkZWVwRWFjaDogZnVuY3Rpb24gKGZuLCBvcHRfc2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIGRlZXBFYWNoKHRoaXMsIGZuLCBvcHRfc2NvcGUpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9yZWplY3RcbiAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICovXG4gICAgLCBtYXA6IGZ1bmN0aW9uIChmbiwgb3B0X3JlamVjdCkge1xuICAgICAgICB2YXIgbSA9IFtdLCBuLCBpXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbiA9IGZuLmNhbGwodGhpcywgdGhpc1tpXSwgaSlcbiAgICAgICAgICBvcHRfcmVqZWN0ID8gKG9wdF9yZWplY3QobikgJiYgbS5wdXNoKG4pKSA6IG0ucHVzaChuKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtXG4gICAgICB9XG5cbiAgICAvLyB0ZXh0IGFuZCBodG1sIGluc2VydGVycyFcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoIHRoZSBIVE1MIHRvIGluc2VydFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF90ZXh0IHdoZXRoZXIgdG8gc2V0IG9yIGdldCB0ZXh0IGNvbnRlbnRcbiAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICovXG4gICAgLCBodG1sOiBmdW5jdGlvbiAoaCwgb3B0X3RleHQpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9wdF90ZXh0XG4gICAgICAgICAgICAgID8gaHRtbC50ZXh0Q29udGVudCA9PT0gdW5kZWZpbmVkID8gJ2lubmVyVGV4dCcgOiAndGV4dENvbnRlbnQnXG4gICAgICAgICAgICAgIDogJ2lubmVySFRNTCdcbiAgICAgICAgICAsIHRoYXQgPSB0aGlzXG4gICAgICAgICAgLCBhcHBlbmQgPSBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICAgICAgZWFjaChub3JtYWxpemUoaCwgdGhhdCwgaSksIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAsIHVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0X3RleHQgfHwgKHR5cGVvZiBoID09ICdzdHJpbmcnICYmICFzcGVjaWFsVGFncy50ZXN0KGVsLnRhZ05hbWUpKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsW21ldGhvZF0gPSBoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICBhcHBlbmQoZWwsIGkpXG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2YgaCAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgID8gdGhpcy5lbXB0eSgpLmVhY2godXBkYXRlRWxlbWVudClcbiAgICAgICAgICA6IHRoaXNbMF0gPyB0aGlzWzBdW21ldGhvZF0gOiAnJ1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3RleHQgdGhlIHRleHQgdG8gc2V0LCBvdGhlcndpc2UgdGhpcyBpcyBhIGdldHRlclxuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCB0ZXh0OiBmdW5jdGlvbiAob3B0X3RleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHRtbChvcHRfdGV4dCwgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gbW9yZSByZWxhdGVkIGluc2VydGlvbiBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFwcGVuZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcHJlcGVuZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgdmFyIGZpcnN0ID0gZWwuZmlyc3RDaGlsZFxuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWwuaW5zZXJ0QmVmb3JlKGksIGZpcnN0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSB0YXJnZXQgdGhlIGxvY2F0aW9uIGZvciB3aGljaCB5b3UnbGwgaW5zZXJ0IHlvdXIgbmV3IGNvbnRlbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYXBwZW5kVG86IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB0LmFwcGVuZENoaWxkKGVsKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHByZXBlbmRUbzogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHQuaW5zZXJ0QmVmb3JlKGVsLCB0LmZpcnN0Q2hpbGQpXG4gICAgICAgIH0sIDEpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYmVmb3JlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsW3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShpLCBlbClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFmdGVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsW3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShpLCBlbC5uZXh0U2libGluZylcbiAgICAgICAgICB9LCBudWxsLCAxKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHRbcGFyZW50Tm9kZV0uaW5zZXJ0QmVmb3JlKGVsLCB0KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGluc2VydEFmdGVyOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdmFyIHNpYmxpbmcgPSB0Lm5leHRTaWJsaW5nXG4gICAgICAgICAgc2libGluZyA/XG4gICAgICAgICAgICB0W3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShlbCwgc2libGluZykgOlxuICAgICAgICAgICAgdFtwYXJlbnROb2RlXS5hcHBlbmRDaGlsZChlbClcbiAgICAgICAgfSwgMSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZXBsYWNlV2l0aDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYm9uem8obm9ybWFsaXplKG5vZGUpKS5pbnNlcnRBZnRlcih0aGlzKVxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUoKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2hvc3QgYW4gb3B0aW9uYWwgaG9zdCBzY29wZSAocHJpbWFyaWx5IHVzZWQgd2hlbiBpbnRlZ3JhdGVkIHdpdGggRW5kZXIpXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgY2xvbmU6IGZ1bmN0aW9uIChvcHRfaG9zdCkge1xuICAgICAgICB2YXIgcmV0ID0gW10gLy8gZG9uJ3QgY2hhbmdlIG9yaWdpbmFsIGFycmF5XG4gICAgICAgICAgLCBsLCBpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgcmV0W2ldID0gY2xvbmVOb2RlKG9wdF9ob3N0IHx8IHRoaXMsIHRoaXNbaV0pXG4gICAgICAgIHJldHVybiBib256byhyZXQpXG4gICAgICB9XG5cbiAgICAgIC8vIGNsYXNzIG1hbmFnZW1lbnRcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFkZENsYXNzOiBmdW5jdGlvbiAoYykge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgLy8gd2UgYGVhY2hgIGhlcmUgc28geW91IGNhbiBkbyAkZWwuYWRkQ2xhc3MoJ2ZvbyBiYXInKVxuICAgICAgICAgIGVhY2goYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjICYmICFoYXNDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSkpXG4gICAgICAgICAgICAgIGFkZENsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoYykge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKGMgJiYgaGFzQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpKVxuICAgICAgICAgICAgICByZW1vdmVDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAsIGhhc0NsYXNzOiBmdW5jdGlvbiAoYykge1xuICAgICAgICBjID0gdG9TdHJpbmcuY2FsbChjKS5zcGxpdCh3aGl0ZXNwYWNlUmVnZXgpXG4gICAgICAgIHJldHVybiBzb21lKHRoaXMsIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiBzb21lKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICByZXR1cm4gYyAmJiBoYXNDbGFzcyhlbCwgYylcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGMgY2xhc3NuYW1lIHRvIHRvZ2dsZVxuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gb3B0X2NvbmRpdGlvbiB3aGV0aGVyIHRvIGFkZCBvciByZW1vdmUgdGhlIGNsYXNzIHN0cmFpZ2h0IGF3YXlcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCB0b2dnbGVDbGFzczogZnVuY3Rpb24gKGMsIG9wdF9jb25kaXRpb24pIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVhY2goYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjKSB7XG4gICAgICAgICAgICAgIHR5cGVvZiBvcHRfY29uZGl0aW9uICE9PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgICAgICAgb3B0X2NvbmRpdGlvbiA/ICFoYXNDbGFzcyhlbCwgYykgJiYgYWRkQ2xhc3MoZWwsIGMpIDogcmVtb3ZlQ2xhc3MoZWwsIGMpIDpcbiAgICAgICAgICAgICAgICBoYXNDbGFzcyhlbCwgYykgPyByZW1vdmVDbGFzcyhlbCwgYykgOiBhZGRDbGFzcyhlbCwgYylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBkaXNwbGF5IHRvZ2dsZXJzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdHlwZSB1c2VmdWwgdG8gc2V0IGJhY2sgdG8gYW55dGhpbmcgb3RoZXIgdGhhbiBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBzaG93OiBmdW5jdGlvbiAob3B0X3R5cGUpIHtcbiAgICAgICAgb3B0X3R5cGUgPSB0eXBlb2Ygb3B0X3R5cGUgPT0gJ3N0cmluZycgPyBvcHRfdHlwZSA6ICcnXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IG9wdF90eXBlXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3R5cGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCB0b2dnbGU6IGZ1bmN0aW9uIChvcHRfY2FsbGJhY2ssIG9wdF90eXBlKSB7XG4gICAgICAgIG9wdF90eXBlID0gdHlwZW9mIG9wdF90eXBlID09ICdzdHJpbmcnID8gb3B0X3R5cGUgOiAnJztcbiAgICAgICAgdHlwZW9mIG9wdF9jYWxsYmFjayAhPSAnZnVuY3Rpb24nICYmIChvcHRfY2FsbGJhY2sgPSBudWxsKVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0KSA/ICdub25lJyA6IG9wdF90eXBlO1xuICAgICAgICAgIG9wdF9jYWxsYmFjayAmJiBvcHRfY2FsbGJhY2suY2FsbChlbClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvLyBET00gV2Fsa2VycyAmIGdldHRlcnNcblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIGZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBib256byh0aGlzLmxlbmd0aCA/IHRoaXNbMF0gOiBbXSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYm9uem8odGhpcy5sZW5ndGggPyB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gOiBbXSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0VsZW1lbnR8Tm9kZX1cbiAgICAgICAqL1xuICAgICwgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGVkKCduZXh0U2libGluZycpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIHByZXZpb3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZWQoJ3ByZXZpb3VzU2libGluZycpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIHBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZWQocGFyZW50Tm9kZSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIHRoZSBkaXJlY3Rpb25hbCBET00gbWV0aG9kXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIHJlbGF0ZWQ6IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGJvbnpvKHRoaXMubWFwKFxuICAgICAgICAgIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwgPSBlbFttZXRob2RdXG4gICAgICAgICAgICB3aGlsZSAoZWwgJiYgZWwubm9kZVR5cGUgIT09IDEpIHtcbiAgICAgICAgICAgICAgZWwgPSBlbFttZXRob2RdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWwgfHwgMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICB9XG4gICAgICAgICkpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggJiYgdGhpc1swXS5mb2N1cygpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgYmx1cjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxlbmd0aCAmJiB0aGlzWzBdLmJsdXIoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuXG4gICAgICAvLyBzdHlsZSBnZXR0ZXIgc2V0dGVyICYgcmVsYXRlZCBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBvXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF92XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIGNzczogZnVuY3Rpb24gKG8sIG9wdF92KSB7XG4gICAgICAgIHZhciBwLCBpdGVyID0gb1xuICAgICAgICAvLyBpcyB0aGlzIGEgcmVxdWVzdCBmb3IganVzdCBnZXR0aW5nIGEgc3R5bGU/XG4gICAgICAgIGlmIChvcHRfdiA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gcmVwdXJwb3NlICd2J1xuICAgICAgICAgIG9wdF92ID0gdGhpc1swXVxuICAgICAgICAgIGlmICghb3B0X3YpIHJldHVybiBudWxsXG4gICAgICAgICAgaWYgKG9wdF92ID09PSBkb2MgfHwgb3B0X3YgPT09IHdpbikge1xuICAgICAgICAgICAgcCA9IChvcHRfdiA9PT0gZG9jKSA/IGJvbnpvLmRvYygpIDogYm9uem8udmlld3BvcnQoKVxuICAgICAgICAgICAgcmV0dXJuIG8gPT0gJ3dpZHRoJyA/IHAud2lkdGggOiBvID09ICdoZWlnaHQnID8gcC5oZWlnaHQgOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKG8gPSBzdHlsZVByb3BlcnR5KG8pKSA/IGdldFN0eWxlKG9wdF92LCBvKSA6IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgIGl0ZXIgPSB7fVxuICAgICAgICAgIGl0ZXJbb10gPSBvcHRfdlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmZWF0dXJlcy5vcGFzaXR5ICYmICdvcGFjaXR5JyBpbiBpdGVyKSB7XG4gICAgICAgICAgLy8gb2ggdGhpcyAnb2wgZ2FtdXRcbiAgICAgICAgICBpdGVyLmZpbHRlciA9IGl0ZXIub3BhY2l0eSAhPSBudWxsICYmIGl0ZXIub3BhY2l0eSAhPT0gJydcbiAgICAgICAgICAgID8gJ2FscGhhKG9wYWNpdHk9JyArIChpdGVyLm9wYWNpdHkgKiAxMDApICsgJyknXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgLy8gZ2l2ZSBpdCBsYXlvdXRcbiAgICAgICAgICBpdGVyLnpvb20gPSBvLnpvb20gfHwgMVxuICAgICAgICAgIDtkZWxldGUgaXRlci5vcGFjaXR5XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmbihlbCwgcCwgdikge1xuICAgICAgICAgIGZvciAodmFyIGsgaW4gaXRlcikge1xuICAgICAgICAgICAgaWYgKGl0ZXIuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgdiA9IGl0ZXJba107XG4gICAgICAgICAgICAgIC8vIGNoYW5nZSBcIjVcIiB0byBcIjVweFwiIC0gdW5sZXNzIHlvdSdyZSBsaW5lLWhlaWdodCwgd2hpY2ggaXMgYWxsb3dlZFxuICAgICAgICAgICAgICAocCA9IHN0eWxlUHJvcGVydHkoaykpICYmIGRpZ2l0LnRlc3QodikgJiYgIShwIGluIHVuaXRsZXNzKSAmJiAodiArPSBweClcbiAgICAgICAgICAgICAgdHJ5IHsgZWwuc3R5bGVbcF0gPSBzZXR0ZXIoZWwsIHYpIH0gY2F0Y2goZSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmbilcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gb3B0X3hcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gb3B0X3lcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfG51bWJlcn1cbiAgICAgICAqL1xuICAgICwgb2Zmc2V0OiBmdW5jdGlvbiAob3B0X3gsIG9wdF95KSB7XG4gICAgICAgIGlmIChvcHRfeCAmJiB0eXBlb2Ygb3B0X3ggPT0gJ29iamVjdCcgJiYgKHR5cGVvZiBvcHRfeC50b3AgPT0gJ251bWJlcicgfHwgdHlwZW9mIG9wdF94LmxlZnQgPT0gJ251bWJlcicpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHh5KGVsLCBvcHRfeC5sZWZ0LCBvcHRfeC50b3ApXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0X3ggPT0gJ251bWJlcicgfHwgdHlwZW9mIG9wdF95ID09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHh5KGVsLCBvcHRfeCwgb3B0X3kpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXNbMF0pIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAsIGxlZnQ6IDBcbiAgICAgICAgICAsIGhlaWdodDogMFxuICAgICAgICAgICwgd2lkdGg6IDBcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICAgICAgLCBkZSA9IGVsLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICAgICAgLCBiY3IgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICwgc2Nyb2xsID0gZ2V0V2luZG93U2Nyb2xsKClcbiAgICAgICAgICAsIHdpZHRoID0gZWwub2Zmc2V0V2lkdGhcbiAgICAgICAgICAsIGhlaWdodCA9IGVsLm9mZnNldEhlaWdodFxuICAgICAgICAgICwgdG9wID0gYmNyLnRvcCArIHNjcm9sbC55IC0gTWF0aC5tYXgoMCwgZGUgJiYgZGUuY2xpZW50VG9wLCBkb2MuYm9keS5jbGllbnRUb3ApXG4gICAgICAgICAgLCBsZWZ0ID0gYmNyLmxlZnQgKyBzY3JvbGwueCAtIE1hdGgubWF4KDAsIGRlICYmIGRlLmNsaWVudExlZnQsIGRvYy5ib2R5LmNsaWVudExlZnQpXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogdG9wXG4gICAgICAgICAgLCBsZWZ0OiBsZWZ0XG4gICAgICAgICAgLCBoZWlnaHQ6IGhlaWdodFxuICAgICAgICAgICwgd2lkdGg6IHdpZHRoXG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAqL1xuICAgICwgZGltOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5sZW5ndGgpIHJldHVybiB7IGhlaWdodDogMCwgd2lkdGg6IDAgfVxuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICAgICAgLCBkZSA9IGVsLm5vZGVUeXBlID09IDkgJiYgZWwuZG9jdW1lbnRFbGVtZW50IC8vIGRvY3VtZW50XG4gICAgICAgICAgLCBvcmlnID0gIWRlICYmICEhZWwuc3R5bGUgJiYgIWVsLm9mZnNldFdpZHRoICYmICFlbC5vZmZzZXRIZWlnaHQgP1xuICAgICAgICAgICAgIC8vIGVsIGlzbid0IHZpc2libGUsIGNhbid0IGJlIG1lYXN1cmVkIHByb3Blcmx5LCBzbyBmaXggdGhhdFxuICAgICAgICAgICAgIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICB2YXIgcyA9IHtcbiAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWwuc3R5bGUucG9zaXRpb24gfHwgJydcbiAgICAgICAgICAgICAgICAgLCB2aXNpYmlsaXR5OiBlbC5zdHlsZS52aXNpYmlsaXR5IHx8ICcnXG4gICAgICAgICAgICAgICAgICwgZGlzcGxheTogZWwuc3R5bGUuZGlzcGxheSB8fCAnJ1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgdC5maXJzdCgpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgICAgICAgLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAsIGRpc3BsYXk6ICdibG9jaydcbiAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICByZXR1cm4gc1xuICAgICAgICAgICAgfSh0aGlzKSA6IG51bGxcbiAgICAgICAgICAsIHdpZHRoID0gZGVcbiAgICAgICAgICAgICAgPyBNYXRoLm1heChlbC5ib2R5LnNjcm9sbFdpZHRoLCBlbC5ib2R5Lm9mZnNldFdpZHRoLCBkZS5zY3JvbGxXaWR0aCwgZGUub2Zmc2V0V2lkdGgsIGRlLmNsaWVudFdpZHRoKVxuICAgICAgICAgICAgICA6IGVsLm9mZnNldFdpZHRoXG4gICAgICAgICAgLCBoZWlnaHQgPSBkZVxuICAgICAgICAgICAgICA/IE1hdGgubWF4KGVsLmJvZHkuc2Nyb2xsSGVpZ2h0LCBlbC5ib2R5Lm9mZnNldEhlaWdodCwgZGUuc2Nyb2xsSGVpZ2h0LCBkZS5vZmZzZXRIZWlnaHQsIGRlLmNsaWVudEhlaWdodClcbiAgICAgICAgICAgICAgOiBlbC5vZmZzZXRIZWlnaHRcblxuICAgICAgICBvcmlnICYmIHRoaXMuZmlyc3QoKS5jc3Mob3JpZylcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgLCB3aWR0aDogd2lkdGhcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhdHRyaWJ1dGVzIGFyZSBoYXJkLiBnbyBzaG9wcGluZ1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrIGFuIGF0dHJpYnV0ZSB0byBnZXQgb3Igc2V0XG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF92IHRoZSB2YWx1ZSB0byBzZXRcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgYXR0cjogZnVuY3Rpb24gKGssIG9wdF92KSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXNbMF1cbiAgICAgICAgICAsIG5cblxuICAgICAgICBpZiAodHlwZW9mIGsgIT0gJ3N0cmluZycgJiYgIShrIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICAgIGZvciAobiBpbiBrKSB7XG4gICAgICAgICAgICBrLmhhc093blByb3BlcnR5KG4pICYmIHRoaXMuYXR0cihuLCBrW25dKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvcHRfdiA9PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgIWVsID8gbnVsbCA6IHNwZWNpYWxBdHRyaWJ1dGVzLnRlc3QoaykgP1xuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzLnRlc3QoaykgJiYgdHlwZW9mIGVsW2tdID09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgdHJ1ZSA6IGVsW2tdIDogKGsgPT0gJ2hyZWYnIHx8IGsgPT0nc3JjJykgJiYgZmVhdHVyZXMuaHJlZkV4dGVuZGVkID9cbiAgICAgICAgICAgICAgICBlbFtnZXRBdHRyaWJ1dGVdKGssIDIpIDogZWxbZ2V0QXR0cmlidXRlXShrKSA6XG4gICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgc3BlY2lhbEF0dHJpYnV0ZXMudGVzdChrKSA/IChlbFtrXSA9IHNldHRlcihlbCwgb3B0X3YpKSA6IGVsW3NldEF0dHJpYnV0ZV0oaywgc2V0dGVyKGVsLCBvcHRfdikpXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVtb3ZlQXR0cjogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXMudGVzdChrKSA/IChlbFtrXSA9IGZhbHNlKSA6IGVsLnJlbW92ZUF0dHJpYnV0ZShrKVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfc1xuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCB2YWw6IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHMgPT0gJ3N0cmluZycgfHwgdHlwZW9mIHMgPT0gJ251bWJlcicpID9cbiAgICAgICAgICB0aGlzLmF0dHIoJ3ZhbHVlJywgcykgOlxuICAgICAgICAgIHRoaXMubGVuZ3RoID8gdGhpc1swXS52YWx1ZSA6IG51bGxcbiAgICAgIH1cblxuICAgICAgLy8gdXNlIHdpdGggY2FyZSBhbmQga25vd2xlZGdlLiB0aGlzIGRhdGEoKSBtZXRob2QgdXNlcyBkYXRhIGF0dHJpYnV0ZXMgb24gdGhlIERPTSBub2Rlc1xuICAgICAgLy8gdG8gZG8gdGhpcyBkaWZmZXJlbnRseSBjb3N0cyBhIGxvdCBtb3JlIGNvZGUuIGMnZXN0IGxhIHZpZVxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3Q9fSBvcHRfayB0aGUga2V5IGZvciB3aGljaCB0byBnZXQgb3Igc2V0IGRhdGFcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3ZcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfE9iamVjdH1cbiAgICAgICAqL1xuICAgICwgZGF0YTogZnVuY3Rpb24gKG9wdF9rLCBvcHRfdikge1xuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdLCBvLCBtXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0X3YgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKCFlbCkgcmV0dXJuIG51bGxcbiAgICAgICAgICBvID0gZGF0YShlbClcbiAgICAgICAgICBpZiAodHlwZW9mIG9wdF9rID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWFjaChlbC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAobSA9ICgnJyArIGEubmFtZSkubWF0Y2goZGF0dHIpKSAmJiAob1tjYW1lbGl6ZShtWzFdKV0gPSBkYXRhVmFsdWUoYS52YWx1ZSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIG9cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvW29wdF9rXSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgIG9bb3B0X2tdID0gZGF0YVZhbHVlKHRoaXMuYXR0cignZGF0YS0nICsgZGVjYW1lbGl6ZShvcHRfaykpKVxuICAgICAgICAgICAgcmV0dXJuIG9bb3B0X2tdXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7IGRhdGEoZWwpW29wdF9rXSA9IG9wdF92IH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRE9NIGRldGFjaG1lbnQgJiByZWxhdGVkXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRlZXBFYWNoKGNsZWFyRGF0YSlcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV0YWNoKClcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBlbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGRlZXBFYWNoKGVsLmNoaWxkTm9kZXMsIGNsZWFyRGF0YSlcblxuICAgICAgICAgIHdoaWxlIChlbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBkZXRhY2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbFtwYXJlbnROb2RlXSAmJiBlbFtwYXJlbnROb2RlXS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gd2hvIHVzZXMgYSBtb3VzZSBhbnl3YXk/IG9oIHJpZ2h0LlxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICAgKi9cbiAgICAsIHNjcm9sbFRvcDogZnVuY3Rpb24gKHkpIHtcbiAgICAgICAgcmV0dXJuIHNjcm9sbC5jYWxsKHRoaXMsIG51bGwsIHksICd5JylcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICAgICAgKi9cbiAgICAsIHNjcm9sbExlZnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiBzY3JvbGwuY2FsbCh0aGlzLCB4LCBudWxsLCAneCcpXG4gICAgICB9XG5cbiAgfVxuXG5cbiAgZnVuY3Rpb24gY2xvbmVOb2RlKGhvc3QsIGVsKSB7XG4gICAgdmFyIGMgPSBlbC5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICwgY2xvbmVFbGVtc1xuICAgICAgLCBlbEVsZW1zXG4gICAgICAsIGlcblxuICAgIC8vIGNoZWNrIGZvciBleGlzdGVuY2Ugb2YgYW4gZXZlbnQgY2xvbmVyXG4gICAgLy8gcHJlZmVyYWJseSBodHRwczovL2dpdGh1Yi5jb20vZmF0L2JlYW5cbiAgICAvLyBvdGhlcndpc2UgQm9uem8gd29uJ3QgZG8gdGhpcyBmb3IgeW91XG4gICAgaWYgKGhvc3QuJCAmJiB0eXBlb2YgaG9zdC5jbG9uZUV2ZW50cyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBob3N0LiQoYykuY2xvbmVFdmVudHMoZWwpXG5cbiAgICAgIC8vIGNsb25lIGV2ZW50cyBmcm9tIGV2ZXJ5IGNoaWxkIG5vZGVcbiAgICAgIGNsb25lRWxlbXMgPSBob3N0LiQoYykuZmluZCgnKicpXG4gICAgICBlbEVsZW1zID0gaG9zdC4kKGVsKS5maW5kKCcqJylcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGVsRWxlbXMubGVuZ3RoOyBpKyspXG4gICAgICAgIGhvc3QuJChjbG9uZUVsZW1zW2ldKS5jbG9uZUV2ZW50cyhlbEVsZW1zW2ldKVxuICAgIH1cbiAgICByZXR1cm4gY1xuICB9XG5cbiAgZnVuY3Rpb24gaXNCb2R5KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudCA9PT0gd2luIHx8ICgvXig/OmJvZHl8aHRtbCkkL2kpLnRlc3QoZWxlbWVudC50YWdOYW1lKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsKCkge1xuICAgIHJldHVybiB7IHg6IHdpbi5wYWdlWE9mZnNldCB8fCBodG1sLnNjcm9sbExlZnQsIHk6IHdpbi5wYWdlWU9mZnNldCB8fCBodG1sLnNjcm9sbFRvcCB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTY3JpcHRGcm9tSHRtbChodG1sKSB7XG4gICAgdmFyIHNjcmlwdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbWF0Y2hlcyA9IGh0bWwubWF0Y2goc2ltcGxlU2NyaXB0VGFnUmUpXG4gICAgc2NyaXB0RWwuc3JjID0gbWF0Y2hlc1sxXVxuICAgIHJldHVybiBzY3JpcHRFbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkuPEVsZW1lbnQ+fEVsZW1lbnR8Tm9kZXxzdHJpbmd9IGVsc1xuICAgKiBAcmV0dXJuIHtCb256b31cbiAgICovXG4gIGZ1bmN0aW9uIGJvbnpvKGVscykge1xuICAgIHJldHVybiBuZXcgQm9uem8oZWxzKVxuICB9XG5cbiAgYm9uem8uc2V0UXVlcnlFbmdpbmUgPSBmdW5jdGlvbiAocSkge1xuICAgIHF1ZXJ5ID0gcTtcbiAgICBkZWxldGUgYm9uem8uc2V0UXVlcnlFbmdpbmVcbiAgfVxuXG4gIGJvbnpvLmF1ZyA9IGZ1bmN0aW9uIChvLCB0YXJnZXQpIHtcbiAgICAvLyBmb3IgdGhvc2Ugc3RhbmRhbG9uZSBib256byB1c2Vycy4gdGhpcyBsb3ZlIGlzIGZvciB5b3UuXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBvLmhhc093blByb3BlcnR5KGspICYmICgodGFyZ2V0IHx8IEJvbnpvLnByb3RvdHlwZSlba10gPSBvW2tdKVxuICAgIH1cbiAgfVxuXG4gIGJvbnpvLmNyZWF0ZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgLy8gaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhcbiAgICByZXR1cm4gdHlwZW9mIG5vZGUgPT0gJ3N0cmluZycgJiYgbm9kZSAhPT0gJycgP1xuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2ltcGxlU2NyaXB0VGFnUmUudGVzdChub2RlKSkgcmV0dXJuIFtjcmVhdGVTY3JpcHRGcm9tSHRtbChub2RlKV1cbiAgICAgICAgdmFyIHRhZyA9IG5vZGUubWF0Y2goL15cXHMqPChbXlxccz5dKykvKVxuICAgICAgICAgICwgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAsIGVscyA9IFtdXG4gICAgICAgICAgLCBwID0gdGFnID8gdGFnTWFwW3RhZ1sxXS50b0xvd2VyQ2FzZSgpXSA6IG51bGxcbiAgICAgICAgICAsIGRlcCA9IHAgPyBwWzJdICsgMSA6IDFcbiAgICAgICAgICAsIG5zID0gcCAmJiBwWzNdXG4gICAgICAgICAgLCBwbiA9IHBhcmVudE5vZGVcbiAgICAgICAgICAsIHRiID0gZmVhdHVyZXMuYXV0b1Rib2R5ICYmIHAgJiYgcFswXSA9PSAnPHRhYmxlPicgJiYgISgvPHRib2R5L2kpLnRlc3Qobm9kZSlcblxuICAgICAgICBlbC5pbm5lckhUTUwgPSBwID8gKHBbMF0gKyBub2RlICsgcFsxXSkgOiBub2RlXG4gICAgICAgIHdoaWxlIChkZXAtLSkgZWwgPSBlbC5maXJzdENoaWxkXG4gICAgICAgIC8vIGZvciBJRSBOb1Njb3BlLCB3ZSBtYXkgaW5zZXJ0IGNydWZ0IGF0IHRoZSBiZWdpbmluZyBqdXN0IHRvIGdldCBpdCB0byB3b3JrXG4gICAgICAgIGlmIChucyAmJiBlbCAmJiBlbC5ub2RlVHlwZSAhPT0gMSkgZWwgPSBlbC5uZXh0U2libGluZ1xuICAgICAgICBkbyB7XG4gICAgICAgICAgLy8gdGJvZHkgc3BlY2lhbCBjYXNlIGZvciBJRTw4LCBjcmVhdGVzIHRib2R5IG9uIGFueSBlbXB0eSB0YWJsZVxuICAgICAgICAgIC8vIHdlIGRvbid0IHdhbnQgaXQgaWYgd2UncmUganVzdCBhZnRlciBhIDx0aGVhZD4sIDxjYXB0aW9uPiwgZXRjLlxuICAgICAgICAgIGlmICgoIXRhZyB8fCBlbC5ub2RlVHlwZSA9PSAxKSAmJiAoIXRiIHx8IChlbC50YWdOYW1lICYmIGVsLnRhZ05hbWUgIT0gJ1RCT0RZJykpKSB7XG4gICAgICAgICAgICBlbHMucHVzaChlbClcbiAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGVsID0gZWwubmV4dFNpYmxpbmcpXG4gICAgICAgIC8vIElFIDwgOSBnaXZlcyB1cyBhIHBhcmVudE5vZGUgd2hpY2ggbWVzc2VzIHVwIGluc2VydCgpIGNoZWNrIGZvciBjbG9uaW5nXG4gICAgICAgIC8vIGBkZXBgID4gMSBjYW4gYWxzbyBjYXVzZSBwcm9ibGVtcyB3aXRoIHRoZSBpbnNlcnQoKSBjaGVjayAobXVzdCBkbyB0aGlzIGxhc3QpXG4gICAgICAgIGVhY2goZWxzLCBmdW5jdGlvbihlbCkgeyBlbFtwbl0gJiYgZWxbcG5dLnJlbW92ZUNoaWxkKGVsKSB9KVxuICAgICAgICByZXR1cm4gZWxzXG4gICAgICB9KCkgOiBpc05vZGUobm9kZSkgPyBbbm9kZS5jbG9uZU5vZGUodHJ1ZSldIDogW11cbiAgfVxuXG4gIGJvbnpvLmRvYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdnAgPSBib256by52aWV3cG9ydCgpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IE1hdGgubWF4KGRvYy5ib2R5LnNjcm9sbFdpZHRoLCBodG1sLnNjcm9sbFdpZHRoLCB2cC53aWR0aClcbiAgICAgICwgaGVpZ2h0OiBNYXRoLm1heChkb2MuYm9keS5zY3JvbGxIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCB2cC5oZWlnaHQpXG4gICAgfVxuICB9XG5cbiAgYm9uem8uZmlyc3RDaGlsZCA9IGZ1bmN0aW9uIChlbCkge1xuICAgIGZvciAodmFyIGMgPSBlbC5jaGlsZE5vZGVzLCBpID0gMCwgaiA9IChjICYmIGMubGVuZ3RoKSB8fCAwLCBlOyBpIDwgajsgaSsrKSB7XG4gICAgICBpZiAoY1tpXS5ub2RlVHlwZSA9PT0gMSkgZSA9IGNbaiA9IGldXG4gICAgfVxuICAgIHJldHVybiBlXG4gIH1cblxuICBib256by52aWV3cG9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogaWUgPyBodG1sLmNsaWVudFdpZHRoIDogc2VsZi5pbm5lcldpZHRoXG4gICAgICAsIGhlaWdodDogaWUgPyBodG1sLmNsaWVudEhlaWdodCA6IHNlbGYuaW5uZXJIZWlnaHRcbiAgICB9XG4gIH1cblxuICBib256by5pc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PSAxNlxuICAgIH0gOiAnY29udGFpbnMnIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChjb250YWluZXIsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpO1xuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChjb250YWluZXIsIGVsZW1lbnQpIHtcbiAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudFtwYXJlbnROb2RlXSkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gIHJldHVybiBib256b1xufSk7IC8vIHRoZSBvbmx5IGxpbmUgd2UgY2FyZSBhYm91dCB1c2luZyBhIHNlbWktY29sb24uIHBsYWNlZCBoZXJlIGZvciBjb25jYXRlbmF0aW9uIHRvb2xzXG4iLCJcbi8vIG5vdCBpbXBsZW1lbnRlZFxuLy8gVGhlIHJlYXNvbiBmb3IgaGF2aW5nIGFuIGVtcHR5IGZpbGUgYW5kIG5vdCB0aHJvd2luZyBpcyB0byBhbGxvd1xuLy8gdW50cmFkaXRpb25hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1vZHVsZS5cbiIsInZhciBpbnNlcnRlZCA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgICBpZiAoaW5zZXJ0ZWQuaW5kZXhPZihjc3MpID49IDApIHJldHVybjtcbiAgICBpbnNlcnRlZC5wdXNoKGNzcyk7XG4gICAgXG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcbiAgICBlbGVtLmFwcGVuZENoaWxkKHRleHQpO1xuICAgIFxuICAgIGlmIChkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKGVsZW0sIGRvY3VtZW50LmhlYWQuY2hpbGROb2Rlc1swXSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGVsZW0pO1xuICAgIH1cbn07XG4iLCIvKiFcbiAgKiBAcHJlc2VydmUgUXdlcnkgLSBBIEJsYXppbmcgRmFzdCBxdWVyeSBzZWxlY3RvciBlbmdpbmVcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3F3ZXJ5XG4gICogY29weXJpZ2h0IER1c3RpbiBEaWF6IDIwMTJcbiAgKiBNSVQgTGljZW5zZVxuICAqL1xuXG4oZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KSgncXdlcnknLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudFxuICAgICwgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnRcbiAgICAsIGJ5Q2xhc3MgPSAnZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSdcbiAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICwgcVNBID0gJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gICAgLCB1c2VOYXRpdmVRU0EgPSAndXNlTmF0aXZlUVNBJ1xuICAgICwgdGFnTmFtZSA9ICd0YWdOYW1lJ1xuICAgICwgbm9kZVR5cGUgPSAnbm9kZVR5cGUnXG4gICAgLCBzZWxlY3QgLy8gbWFpbiBzZWxlY3QoKSBtZXRob2QsIGFzc2lnbiBsYXRlclxuXG4gICAgLCBpZCA9IC8jKFtcXHdcXC1dKykvXG4gICAgLCBjbGFzID0gL1xcLltcXHdcXC1dKy9nXG4gICAgLCBpZE9ubHkgPSAvXiMoW1xcd1xcLV0rKSQvXG4gICAgLCBjbGFzc09ubHkgPSAvXlxcLihbXFx3XFwtXSspJC9cbiAgICAsIHRhZ09ubHkgPSAvXihbXFx3XFwtXSspJC9cbiAgICAsIHRhZ0FuZE9yQ2xhc3MgPSAvXihbXFx3XSspP1xcLihbXFx3XFwtXSspJC9cbiAgICAsIHNwbGl0dGFibGUgPSAvKF58LClcXHMqWz5+K10vXG4gICAgLCBub3JtYWxpenIgPSAvXlxccyt8XFxzKihbLFxcc1xcK1xcfj5dfCQpXFxzKi9nXG4gICAgLCBzcGxpdHRlcnMgPSAvW1xcc1xcPlxcK1xcfl0vXG4gICAgLCBzcGxpdHRlcnNNb3JlID0gLyg/IVtcXHNcXHdcXC1cXC9cXD9cXCZcXD1cXDpcXC5cXChcXClcXCEsQCMlPD5cXHtcXH1cXCRcXCpcXF4nXCJdKlxcXXxbXFxzXFx3XFwrXFwtXSpcXCkpL1xuICAgICwgc3BlY2lhbENoYXJzID0gLyhbLiorP1xcXj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nXG4gICAgLCBzaW1wbGUgPSAvXihcXCp8W2EtejAtOV0rKT8oPzooW1xcLlxcI10rW1xcd1xcLVxcLiNdKyk/KS9cbiAgICAsIGF0dHIgPSAvXFxbKFtcXHdcXC1dKykoPzooW1xcfFxcXlxcJFxcKlxcfl0/XFw9KVsnXCJdPyhbIFxcd1xcLVxcL1xcP1xcJlxcPVxcOlxcLlxcKFxcKVxcISxAIyU8Plxce1xcfVxcJFxcKlxcXl0rKVtcIiddPyk/XFxdL1xuICAgICwgcHNldWRvID0gLzooW1xcd1xcLV0rKShcXChbJ1wiXT8oW14oKV0rKVsnXCJdP1xcKSk/L1xuICAgICwgZWFzeSA9IG5ldyBSZWdFeHAoaWRPbmx5LnNvdXJjZSArICd8JyArIHRhZ09ubHkuc291cmNlICsgJ3wnICsgY2xhc3NPbmx5LnNvdXJjZSlcbiAgICAsIGRpdmlkZXJzID0gbmV3IFJlZ0V4cCgnKCcgKyBzcGxpdHRlcnMuc291cmNlICsgJyknICsgc3BsaXR0ZXJzTW9yZS5zb3VyY2UsICdnJylcbiAgICAsIHRva2VuaXpyID0gbmV3IFJlZ0V4cChzcGxpdHRlcnMuc291cmNlICsgc3BsaXR0ZXJzTW9yZS5zb3VyY2UpXG4gICAgLCBjaHVua2VyID0gbmV3IFJlZ0V4cChzaW1wbGUuc291cmNlICsgJygnICsgYXR0ci5zb3VyY2UgKyAnKT8nICsgJygnICsgcHNldWRvLnNvdXJjZSArICcpPycpXG5cbiAgdmFyIHdhbGtlciA9IHtcbiAgICAgICcgJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZSAhPT0gaHRtbCAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAsICc+JzogZnVuY3Rpb24gKG5vZGUsIGNvbnRlc3RhbnQpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlID09IGNvbnRlc3RhbnQucGFyZW50Tm9kZSAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAsICd+JzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgIH1cbiAgICAsICcrJzogZnVuY3Rpb24gKG5vZGUsIGNvbnRlc3RhbnQsIHAxLCBwMikge1xuICAgICAgICBpZiAoIW5vZGUpIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gKHAxID0gcHJldmlvdXMobm9kZSkpICYmIChwMiA9IHByZXZpb3VzKGNvbnRlc3RhbnQpKSAmJiBwMSA9PSBwMiAmJiBwMVxuICAgICAgfVxuICAgIH1cblxuICBmdW5jdGlvbiBjYWNoZSgpIHtcbiAgICB0aGlzLmMgPSB7fVxuICB9XG4gIGNhY2hlLnByb3RvdHlwZSA9IHtcbiAgICBnOiBmdW5jdGlvbiAoaykge1xuICAgICAgcmV0dXJuIHRoaXMuY1trXSB8fCB1bmRlZmluZWRcbiAgICB9XG4gICwgczogZnVuY3Rpb24gKGssIHYsIHIpIHtcbiAgICAgIHYgPSByID8gbmV3IFJlZ0V4cCh2KSA6IHZcbiAgICAgIHJldHVybiAodGhpcy5jW2tdID0gdilcbiAgICB9XG4gIH1cblxuICB2YXIgY2xhc3NDYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCBjbGVhbkNhY2hlID0gbmV3IGNhY2hlKClcbiAgICAsIGF0dHJDYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCB0b2tlbkNhY2hlID0gbmV3IGNhY2hlKClcblxuICBmdW5jdGlvbiBjbGFzc1JlZ2V4KGMpIHtcbiAgICByZXR1cm4gY2xhc3NDYWNoZS5nKGMpIHx8IGNsYXNzQ2FjaGUucyhjLCAnKF58XFxcXHMrKScgKyBjICsgJyhcXFxccyt8JCknLCAxKVxuICB9XG5cbiAgLy8gbm90IHF1aXRlIGFzIGZhc3QgYXMgaW5saW5lIGxvb3BzIGluIG9sZGVyIGJyb3dzZXJzIHNvIGRvbid0IHVzZSBsaWJlcmFsbHlcbiAgZnVuY3Rpb24gZWFjaChhLCBmbikge1xuICAgIHZhciBpID0gMCwgbCA9IGEubGVuZ3RoXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIGZuKGFbaV0pXG4gIH1cblxuICBmdW5jdGlvbiBmbGF0dGVuKGFyKSB7XG4gICAgZm9yICh2YXIgciA9IFtdLCBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7ICsraSkgYXJyYXlMaWtlKGFyW2ldKSA/IChyID0gci5jb25jYXQoYXJbaV0pKSA6IChyW3IubGVuZ3RoXSA9IGFyW2ldKVxuICAgIHJldHVybiByXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheWlmeShhcikge1xuICAgIHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aCwgciA9IFtdXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHJbaV0gPSBhcltpXVxuICAgIHJldHVybiByXG4gIH1cblxuICBmdW5jdGlvbiBwcmV2aW91cyhuKSB7XG4gICAgd2hpbGUgKG4gPSBuLnByZXZpb3VzU2libGluZykgaWYgKG5bbm9kZVR5cGVdID09IDEpIGJyZWFrO1xuICAgIHJldHVybiBuXG4gIH1cblxuICBmdW5jdGlvbiBxKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lm1hdGNoKGNodW5rZXIpXG4gIH1cblxuICAvLyBjYWxsZWQgdXNpbmcgYHRoaXNgIGFzIGVsZW1lbnQgYW5kIGFyZ3VtZW50cyBmcm9tIHJlZ2V4IGdyb3VwIHJlc3VsdHMuXG4gIC8vIGdpdmVuID0+IGRpdi5oZWxsb1t0aXRsZT1cIndvcmxkXCJdOmZvbygnYmFyJylcbiAgLy8gZGl2LmhlbGxvW3RpdGxlPVwid29ybGRcIl06Zm9vKCdiYXInKSwgZGl2LCAuaGVsbG8sIFt0aXRsZT1cIndvcmxkXCJdLCB0aXRsZSwgPSwgd29ybGQsIDpmb28oJ2JhcicpLCBmb28sICgnYmFyJyksIGJhcl1cbiAgZnVuY3Rpb24gaW50ZXJwcmV0KHdob2xlLCB0YWcsIGlkc0FuZENsYXNzZXMsIHdob2xlQXR0cmlidXRlLCBhdHRyaWJ1dGUsIHF1YWxpZmllciwgdmFsdWUsIHdob2xlUHNldWRvLCBwc2V1ZG8sIHdob2xlUHNldWRvVmFsLCBwc2V1ZG9WYWwpIHtcbiAgICB2YXIgaSwgbSwgaywgbywgY2xhc3Nlc1xuICAgIGlmICh0aGlzW25vZGVUeXBlXSAhPT0gMSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHRhZyAmJiB0YWcgIT09ICcqJyAmJiB0aGlzW3RhZ05hbWVdICYmIHRoaXNbdGFnTmFtZV0udG9Mb3dlckNhc2UoKSAhPT0gdGFnKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoaWRzQW5kQ2xhc3NlcyAmJiAobSA9IGlkc0FuZENsYXNzZXMubWF0Y2goaWQpKSAmJiBtWzFdICE9PSB0aGlzLmlkKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoaWRzQW5kQ2xhc3NlcyAmJiAoY2xhc3NlcyA9IGlkc0FuZENsYXNzZXMubWF0Y2goY2xhcykpKSB7XG4gICAgICBmb3IgKGkgPSBjbGFzc2VzLmxlbmd0aDsgaS0tOykgaWYgKCFjbGFzc1JlZ2V4KGNsYXNzZXNbaV0uc2xpY2UoMSkpLnRlc3QodGhpcy5jbGFzc05hbWUpKSByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKHBzZXVkbyAmJiBxd2VyeS5wc2V1ZG9zW3BzZXVkb10gJiYgIXF3ZXJ5LnBzZXVkb3NbcHNldWRvXSh0aGlzLCBwc2V1ZG9WYWwpKSByZXR1cm4gZmFsc2VcbiAgICBpZiAod2hvbGVBdHRyaWJ1dGUgJiYgIXZhbHVlKSB7IC8vIHNlbGVjdCBpcyBqdXN0IGZvciBleGlzdGFuY2Ugb2YgYXR0cmliXG4gICAgICBvID0gdGhpcy5hdHRyaWJ1dGVzXG4gICAgICBmb3IgKGsgaW4gbykge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspICYmIChvW2tdLm5hbWUgfHwgaykgPT0gYXR0cmlidXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2hvbGVBdHRyaWJ1dGUgJiYgIWNoZWNrQXR0cihxdWFsaWZpZXIsIGdldEF0dHIodGhpcywgYXR0cmlidXRlKSB8fCAnJywgdmFsdWUpKSB7XG4gICAgICAvLyBzZWxlY3QgaXMgZm9yIGF0dHJpYiBlcXVhbGl0eVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbihzKSB7XG4gICAgcmV0dXJuIGNsZWFuQ2FjaGUuZyhzKSB8fCBjbGVhbkNhY2hlLnMocywgcy5yZXBsYWNlKHNwZWNpYWxDaGFycywgJ1xcXFwkMScpKVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBdHRyKHF1YWxpZnksIGFjdHVhbCwgdmFsKSB7XG4gICAgc3dpdGNoIChxdWFsaWZ5KSB7XG4gICAgY2FzZSAnPSc6XG4gICAgICByZXR1cm4gYWN0dWFsID09IHZhbFxuICAgIGNhc2UgJ149JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJ149JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJ149JyArIHZhbCwgJ14nICsgY2xlYW4odmFsKSwgMSkpXG4gICAgY2FzZSAnJD0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnJD0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnJD0nICsgdmFsLCBjbGVhbih2YWwpICsgJyQnLCAxKSlcbiAgICBjYXNlICcqPSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKHZhbCkgfHwgYXR0ckNhY2hlLnModmFsLCBjbGVhbih2YWwpLCAxKSlcbiAgICBjYXNlICd+PSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCd+PScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCd+PScgKyB2YWwsICcoPzpefFxcXFxzKyknICsgY2xlYW4odmFsKSArICcoPzpcXFxccyt8JCknLCAxKSlcbiAgICBjYXNlICd8PSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCd8PScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCd8PScgKyB2YWwsICdeJyArIGNsZWFuKHZhbCkgKyAnKC18JCknLCAxKSlcbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIC8vIGdpdmVuIGEgc2VsZWN0b3IsIGZpcnN0IGNoZWNrIGZvciBzaW1wbGUgY2FzZXMgdGhlbiBjb2xsZWN0IGFsbCBiYXNlIGNhbmRpZGF0ZSBtYXRjaGVzIGFuZCBmaWx0ZXJcbiAgZnVuY3Rpb24gX3F3ZXJ5KHNlbGVjdG9yLCBfcm9vdCkge1xuICAgIHZhciByID0gW10sIHJldCA9IFtdLCBpLCBsLCBtLCB0b2tlbiwgdGFnLCBlbHMsIGludHIsIGl0ZW0sIHJvb3QgPSBfcm9vdFxuICAgICAgLCB0b2tlbnMgPSB0b2tlbkNhY2hlLmcoc2VsZWN0b3IpIHx8IHRva2VuQ2FjaGUucyhzZWxlY3Rvciwgc2VsZWN0b3Iuc3BsaXQodG9rZW5penIpKVxuICAgICAgLCBkaXZpZGVkVG9rZW5zID0gc2VsZWN0b3IubWF0Y2goZGl2aWRlcnMpXG5cbiAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHJldHVybiByXG5cbiAgICB0b2tlbiA9ICh0b2tlbnMgPSB0b2tlbnMuc2xpY2UoMCkpLnBvcCgpIC8vIGNvcHkgY2FjaGVkIHRva2VucywgdGFrZSB0aGUgbGFzdCBvbmVcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAmJiAobSA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0ubWF0Y2goaWRPbmx5KSkpIHJvb3QgPSBieUlkKF9yb290LCBtWzFdKVxuICAgIGlmICghcm9vdCkgcmV0dXJuIHJcblxuICAgIGludHIgPSBxKHRva2VuKVxuICAgIC8vIGNvbGxlY3QgYmFzZSBjYW5kaWRhdGVzIHRvIGZpbHRlclxuICAgIGVscyA9IHJvb3QgIT09IF9yb290ICYmIHJvb3Rbbm9kZVR5cGVdICE9PSA5ICYmIGRpdmlkZWRUb2tlbnMgJiYgL15bK35dJC8udGVzdChkaXZpZGVkVG9rZW5zW2RpdmlkZWRUb2tlbnMubGVuZ3RoIC0gMV0pID9cbiAgICAgIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHdoaWxlIChyb290ID0gcm9vdC5uZXh0U2libGluZykge1xuICAgICAgICAgIHJvb3Rbbm9kZVR5cGVdID09IDEgJiYgKGludHJbMV0gPyBpbnRyWzFdID09IHJvb3RbdGFnTmFtZV0udG9Mb3dlckNhc2UoKSA6IDEpICYmIChyW3IubGVuZ3RoXSA9IHJvb3QpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJcbiAgICAgIH0oW10pIDpcbiAgICAgIHJvb3RbYnlUYWddKGludHJbMV0gfHwgJyonKVxuICAgIC8vIGZpbHRlciBlbGVtZW50cyBhY2NvcmRpbmcgdG8gdGhlIHJpZ2h0LW1vc3QgcGFydCBvZiB0aGUgc2VsZWN0b3JcbiAgICBmb3IgKGkgPSAwLCBsID0gZWxzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGl0ZW0gPSBpbnRlcnByZXQuYXBwbHkoZWxzW2ldLCBpbnRyKSkgcltyLmxlbmd0aF0gPSBpdGVtXG4gICAgfVxuICAgIGlmICghdG9rZW5zLmxlbmd0aCkgcmV0dXJuIHJcblxuICAgIC8vIGZpbHRlciBmdXJ0aGVyIGFjY29yZGluZyB0byB0aGUgcmVzdCBvZiB0aGUgc2VsZWN0b3IgKHRoZSBsZWZ0IHNpZGUpXG4gICAgZWFjaChyLCBmdW5jdGlvbiAoZSkgeyBpZiAoYW5jZXN0b3JNYXRjaChlLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMpKSByZXRbcmV0Lmxlbmd0aF0gPSBlIH0pXG4gICAgcmV0dXJuIHJldFxuICB9XG5cbiAgLy8gY29tcGFyZSBlbGVtZW50IHRvIGEgc2VsZWN0b3JcbiAgZnVuY3Rpb24gaXMoZWwsIHNlbGVjdG9yLCByb290KSB7XG4gICAgaWYgKGlzTm9kZShzZWxlY3RvcikpIHJldHVybiBlbCA9PSBzZWxlY3RvclxuICAgIGlmIChhcnJheUxpa2Uoc2VsZWN0b3IpKSByZXR1cm4gISF+ZmxhdHRlbihzZWxlY3RvcikuaW5kZXhPZihlbCkgLy8gaWYgc2VsZWN0b3IgaXMgYW4gYXJyYXksIGlzIGVsIGEgbWVtYmVyP1xuXG4gICAgdmFyIHNlbGVjdG9ycyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIHRva2VucywgZGl2aWRlZFRva2Vuc1xuICAgIHdoaWxlIChzZWxlY3RvciA9IHNlbGVjdG9ycy5wb3AoKSkge1xuICAgICAgdG9rZW5zID0gdG9rZW5DYWNoZS5nKHNlbGVjdG9yKSB8fCB0b2tlbkNhY2hlLnMoc2VsZWN0b3IsIHNlbGVjdG9yLnNwbGl0KHRva2VuaXpyKSlcbiAgICAgIGRpdmlkZWRUb2tlbnMgPSBzZWxlY3Rvci5tYXRjaChkaXZpZGVycylcbiAgICAgIHRva2VucyA9IHRva2Vucy5zbGljZSgwKSAvLyBjb3B5IGFycmF5XG4gICAgICBpZiAoaW50ZXJwcmV0LmFwcGx5KGVsLCBxKHRva2Vucy5wb3AoKSkpICYmICghdG9rZW5zLmxlbmd0aCB8fCBhbmNlc3Rvck1hdGNoKGVsLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMsIHJvb3QpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIGdpdmVuIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSByaWdodC1tb3N0IHBhcnQgb2YgYSBzZWxlY3RvciwgZmlsdGVyIG91dCBhbnkgdGhhdCBkb24ndCBtYXRjaCB0aGUgcmVzdFxuICBmdW5jdGlvbiBhbmNlc3Rvck1hdGNoKGVsLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnMsIHJvb3QpIHtcbiAgICB2YXIgY2FuZFxuICAgIC8vIHJlY3Vyc2l2ZWx5IHdvcmsgYmFja3dhcmRzIHRocm91Z2ggdGhlIHRva2VucyBhbmQgdXAgdGhlIGRvbSwgY292ZXJpbmcgYWxsIG9wdGlvbnNcbiAgICBmdW5jdGlvbiBjcmF3bChlLCBpLCBwKSB7XG4gICAgICB3aGlsZSAocCA9IHdhbGtlcltkaXZpZGVkVG9rZW5zW2ldXShwLCBlKSkge1xuICAgICAgICBpZiAoaXNOb2RlKHApICYmIChpbnRlcnByZXQuYXBwbHkocCwgcSh0b2tlbnNbaV0pKSkpIHtcbiAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgaWYgKGNhbmQgPSBjcmF3bChwLCBpIC0gMSwgcCkpIHJldHVybiBjYW5kXG4gICAgICAgICAgfSBlbHNlIHJldHVybiBwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChjYW5kID0gY3Jhd2woZWwsIHRva2Vucy5sZW5ndGggLSAxLCBlbCkpICYmICghcm9vdCB8fCBpc0FuY2VzdG9yKGNhbmQsIHJvb3QpKVxuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKGVsLCB0KSB7XG4gICAgcmV0dXJuIGVsICYmIHR5cGVvZiBlbCA9PT0gJ29iamVjdCcgJiYgKHQgPSBlbFtub2RlVHlwZV0pICYmICh0ID09IDEgfHwgdCA9PSA5KVxuICB9XG5cbiAgZnVuY3Rpb24gdW5pcShhcikge1xuICAgIHZhciBhID0gW10sIGksIGo7XG4gICAgbzpcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXIubGVuZ3RoOyArK2kpIHtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBhLmxlbmd0aDsgKytqKSBpZiAoYVtqXSA9PSBhcltpXSkgY29udGludWUgb1xuICAgICAgYVthLmxlbmd0aF0gPSBhcltpXVxuICAgIH1cbiAgICByZXR1cm4gYVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlMaWtlKG8pIHtcbiAgICByZXR1cm4gKHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBpc0Zpbml0ZShvLmxlbmd0aCkpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVSb290KHJvb3QpIHtcbiAgICBpZiAoIXJvb3QpIHJldHVybiBkb2NcbiAgICBpZiAodHlwZW9mIHJvb3QgPT0gJ3N0cmluZycpIHJldHVybiBxd2VyeShyb290KVswXVxuICAgIGlmICghcm9vdFtub2RlVHlwZV0gJiYgYXJyYXlMaWtlKHJvb3QpKSByZXR1cm4gcm9vdFswXVxuICAgIHJldHVybiByb290XG4gIH1cblxuICBmdW5jdGlvbiBieUlkKHJvb3QsIGlkLCBlbCkge1xuICAgIC8vIGlmIGRvYywgcXVlcnkgb24gaXQsIGVsc2UgcXVlcnkgdGhlIHBhcmVudCBkb2Mgb3IgaWYgYSBkZXRhY2hlZCBmcmFnbWVudCByZXdyaXRlIHRoZSBxdWVyeSBhbmQgcnVuIG9uIHRoZSBmcmFnbWVudFxuICAgIHJldHVybiByb290W25vZGVUeXBlXSA9PT0gOSA/IHJvb3QuZ2V0RWxlbWVudEJ5SWQoaWQpIDpcbiAgICAgIHJvb3Qub3duZXJEb2N1bWVudCAmJlxuICAgICAgICAoKChlbCA9IHJvb3Qub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpICYmIGlzQW5jZXN0b3IoZWwsIHJvb3QpICYmIGVsKSB8fFxuICAgICAgICAgICghaXNBbmNlc3Rvcihyb290LCByb290Lm93bmVyRG9jdW1lbnQpICYmIHNlbGVjdCgnW2lkPVwiJyArIGlkICsgJ1wiXScsIHJvb3QpWzBdKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHF3ZXJ5KHNlbGVjdG9yLCBfcm9vdCkge1xuICAgIHZhciBtLCBlbCwgcm9vdCA9IG5vcm1hbGl6ZVJvb3QoX3Jvb3QpXG5cbiAgICAvLyBlYXN5LCBmYXN0IGNhc2VzIHRoYXQgd2UgY2FuIGRpc3BhdGNoIHdpdGggc2ltcGxlIERPTSBjYWxsc1xuICAgIGlmICghcm9vdCB8fCAhc2VsZWN0b3IpIHJldHVybiBbXVxuICAgIGlmIChzZWxlY3RvciA9PT0gd2luZG93IHx8IGlzTm9kZShzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiAhX3Jvb3QgfHwgKHNlbGVjdG9yICE9PSB3aW5kb3cgJiYgaXNOb2RlKHJvb3QpICYmIGlzQW5jZXN0b3Ioc2VsZWN0b3IsIHJvb3QpKSA/IFtzZWxlY3Rvcl0gOiBbXVxuICAgIH1cbiAgICBpZiAoc2VsZWN0b3IgJiYgYXJyYXlMaWtlKHNlbGVjdG9yKSkgcmV0dXJuIGZsYXR0ZW4oc2VsZWN0b3IpXG4gICAgaWYgKG0gPSBzZWxlY3Rvci5tYXRjaChlYXN5KSkge1xuICAgICAgaWYgKG1bMV0pIHJldHVybiAoZWwgPSBieUlkKHJvb3QsIG1bMV0pKSA/IFtlbF0gOiBbXVxuICAgICAgaWYgKG1bMl0pIHJldHVybiBhcnJheWlmeShyb290W2J5VGFnXShtWzJdKSlcbiAgICAgIGlmIChoYXNCeUNsYXNzICYmIG1bM10pIHJldHVybiBhcnJheWlmeShyb290W2J5Q2xhc3NdKG1bM10pKVxuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3Qoc2VsZWN0b3IsIHJvb3QpXG4gIH1cblxuICAvLyB3aGVyZSB0aGUgcm9vdCBpcyBub3QgZG9jdW1lbnQgYW5kIGEgcmVsYXRpb25zaGlwIHNlbGVjdG9yIGlzIGZpcnN0IHdlIGhhdmUgdG9cbiAgLy8gZG8gc29tZSBhd2t3YXJkIGFkanVzdG1lbnRzIHRvIGdldCBpdCB0byB3b3JrLCBldmVuIHdpdGggcVNBXG4gIGZ1bmN0aW9uIGNvbGxlY3RTZWxlY3Rvcihyb290LCBjb2xsZWN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHMpIHtcbiAgICAgIHZhciBvaWQsIG5pZFxuICAgICAgaWYgKHNwbGl0dGFibGUudGVzdChzKSkge1xuICAgICAgICBpZiAocm9vdFtub2RlVHlwZV0gIT09IDkpIHtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGVsIGhhcyBhbiBpZCwgcmV3cml0ZSB0aGUgcXVlcnksIHNldCByb290IHRvIGRvYyBhbmQgcnVuIGl0XG4gICAgICAgICAgaWYgKCEobmlkID0gb2lkID0gcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJykpKSByb290LnNldEF0dHJpYnV0ZSgnaWQnLCBuaWQgPSAnX19xd2VyeW1ldXBzY290dHknKVxuICAgICAgICAgIHMgPSAnW2lkPVwiJyArIG5pZCArICdcIl0nICsgcyAvLyBhdm9pZCBieUlkIGFuZCBhbGxvdyB1cyB0byBtYXRjaCBjb250ZXh0IGVsZW1lbnRcbiAgICAgICAgICBjb2xsZWN0b3Iocm9vdC5wYXJlbnROb2RlIHx8IHJvb3QsIHMsIHRydWUpXG4gICAgICAgICAgb2lkIHx8IHJvb3QucmVtb3ZlQXR0cmlidXRlKCdpZCcpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcy5sZW5ndGggJiYgY29sbGVjdG9yKHJvb3QsIHMsIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpc0FuY2VzdG9yID0gJ2NvbXBhcmVEb2N1bWVudFBvc2l0aW9uJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PSAxNlxuICAgIH0gOiAnY29udGFpbnMnIGluIGh0bWwgP1xuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lcltub2RlVHlwZV0gPT09IDkgfHwgY29udGFpbmVyID09IHdpbmRvdyA/IGh0bWwgOiBjb250YWluZXJcbiAgICAgIHJldHVybiBjb250YWluZXIgIT09IGVsZW1lbnQgJiYgY29udGFpbmVyLmNvbnRhaW5zKGVsZW1lbnQpXG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHJldHVybiAxXG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgLCBnZXRBdHRyID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZGV0ZWN0IGJ1Z2d5IElFIHNyYy9ocmVmIGdldEF0dHJpYnV0ZSgpIGNhbGxcbiAgICAgIHZhciBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgcmV0dXJuICgoZS5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiN4XCI+eDwvYT4nKSAmJiBlLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCdocmVmJykgIT0gJyN4JykgP1xuICAgICAgICBmdW5jdGlvbiAoZSwgYSkge1xuICAgICAgICAgIHJldHVybiBhID09PSAnY2xhc3MnID8gZS5jbGFzc05hbWUgOiAoYSA9PT0gJ2hyZWYnIHx8IGEgPT09ICdzcmMnKSA/XG4gICAgICAgICAgICBlLmdldEF0dHJpYnV0ZShhLCAyKSA6IGUuZ2V0QXR0cmlidXRlKGEpXG4gICAgICAgIH0gOlxuICAgICAgICBmdW5jdGlvbiAoZSwgYSkgeyByZXR1cm4gZS5nZXRBdHRyaWJ1dGUoYSkgfVxuICAgIH0oKVxuICAsIGhhc0J5Q2xhc3MgPSAhIWRvY1tieUNsYXNzXVxuICAgIC8vIGhhcyBuYXRpdmUgcVNBIHN1cHBvcnRcbiAgLCBoYXNRU0EgPSBkb2MucXVlcnlTZWxlY3RvciAmJiBkb2NbcVNBXVxuICAgIC8vIHVzZSBuYXRpdmUgcVNBXG4gICwgc2VsZWN0UVNBID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW10sIHNzLCBlXG4gICAgICB0cnkge1xuICAgICAgICBpZiAocm9vdFtub2RlVHlwZV0gPT09IDkgfHwgIXNwbGl0dGFibGUudGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgICAvLyBtb3N0IHdvcmsgaXMgZG9uZSByaWdodCBoZXJlLCBkZWZlciB0byBxU0FcbiAgICAgICAgICByZXR1cm4gYXJyYXlpZnkocm9vdFtxU0FdKHNlbGVjdG9yKSlcbiAgICAgICAgfVxuICAgICAgICAvLyBzcGVjaWFsIGNhc2Ugd2hlcmUgd2UgbmVlZCB0aGUgc2VydmljZXMgb2YgYGNvbGxlY3RTZWxlY3RvcigpYFxuICAgICAgICBlYWNoKHNzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgY29sbGVjdFNlbGVjdG9yKHJvb3QsIGZ1bmN0aW9uIChjdHgsIHMpIHtcbiAgICAgICAgICBlID0gY3R4W3FTQV0ocylcbiAgICAgICAgICBpZiAoZS5sZW5ndGggPT0gMSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gZS5pdGVtKDApXG4gICAgICAgICAgZWxzZSBpZiAoZS5sZW5ndGgpIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoYXJyYXlpZnkoZSkpXG4gICAgICAgIH0pKVxuICAgICAgICByZXR1cm4gc3MubGVuZ3RoID4gMSAmJiByZXN1bHQubGVuZ3RoID4gMSA/IHVuaXEocmVzdWx0KSA6IHJlc3VsdFxuICAgICAgfSBjYXRjaCAoZXgpIHsgfVxuICAgICAgcmV0dXJuIHNlbGVjdE5vbk5hdGl2ZShzZWxlY3Rvciwgcm9vdClcbiAgICB9XG4gICAgLy8gbm8gbmF0aXZlIHNlbGVjdG9yIHN1cHBvcnRcbiAgLCBzZWxlY3ROb25OYXRpdmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHJvb3QpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXSwgaXRlbXMsIG0sIGksIGwsIHIsIHNzXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2Uobm9ybWFsaXpyLCAnJDEnKVxuICAgICAgaWYgKG0gPSBzZWxlY3Rvci5tYXRjaCh0YWdBbmRPckNsYXNzKSkge1xuICAgICAgICByID0gY2xhc3NSZWdleChtWzJdKVxuICAgICAgICBpdGVtcyA9IHJvb3RbYnlUYWddKG1bMV0gfHwgJyonKVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHIudGVzdChpdGVtc1tpXS5jbGFzc05hbWUpKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBpdGVtc1tpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICAgIC8vIG1vcmUgY29tcGxleCBzZWxlY3RvciwgZ2V0IGBfcXdlcnkoKWAgdG8gZG8gdGhlIHdvcmsgZm9yIHVzXG4gICAgICBlYWNoKHNzID0gc2VsZWN0b3Iuc3BsaXQoJywnKSwgY29sbGVjdFNlbGVjdG9yKHJvb3QsIGZ1bmN0aW9uIChjdHgsIHMsIHJld3JpdGUpIHtcbiAgICAgICAgciA9IF9xd2VyeShzLCBjdHgpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSByLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChjdHhbbm9kZVR5cGVdID09PSA5IHx8IHJld3JpdGUgfHwgaXNBbmNlc3RvcihyW2ldLCByb290KSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcltpXVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICAgIHJldHVybiBzcy5sZW5ndGggPiAxICYmIHJlc3VsdC5sZW5ndGggPiAxID8gdW5pcShyZXN1bHQpIDogcmVzdWx0XG4gICAgfVxuICAsIGNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBjb25maWdOYXRpdmVRU0E6IHVzZSBmdWxseS1pbnRlcm5hbCBzZWxlY3RvciBvciBuYXRpdmUgcVNBIHdoZXJlIHByZXNlbnRcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1t1c2VOYXRpdmVRU0FdICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgc2VsZWN0ID0gIW9wdGlvbnNbdXNlTmF0aXZlUVNBXSA/IHNlbGVjdE5vbk5hdGl2ZSA6IGhhc1FTQSA/IHNlbGVjdFFTQSA6IHNlbGVjdE5vbk5hdGl2ZVxuICAgIH1cblxuICBjb25maWd1cmUoeyB1c2VOYXRpdmVRU0E6IHRydWUgfSlcblxuICBxd2VyeS5jb25maWd1cmUgPSBjb25maWd1cmVcbiAgcXdlcnkudW5pcSA9IHVuaXFcbiAgcXdlcnkuaXMgPSBpc1xuICBxd2VyeS5wc2V1ZG9zID0ge31cblxuICByZXR1cm4gcXdlcnlcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBoYXNLZXlzXG5cbmZ1bmN0aW9uIGhhc0tleXMoc291cmNlKSB7XG4gICAgcmV0dXJuIHNvdXJjZSAhPT0gbnVsbCAmJlxuICAgICAgICAodHlwZW9mIHNvdXJjZSA9PT0gXCJvYmplY3RcIiB8fFxuICAgICAgICB0eXBlb2Ygc291cmNlID09PSBcImZ1bmN0aW9uXCIpXG59XG4iLCJ2YXIgS2V5cyA9IHJlcXVpcmUoXCJvYmplY3Qta2V5c1wiKVxudmFyIGhhc0tleXMgPSByZXF1aXJlKFwiLi9oYXMta2V5c1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgaWYgKCFoYXNLZXlzKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IEtleXMoc291cmNlKVxuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBrZXlzW2pdXG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBzb3VyY2VbbmFtZV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIGlzRnVuYyA9ICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgIShmbiBpbnN0YW5jZW9mIFJlZ0V4cCkpIHx8IHRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHRpZiAoIWlzRnVuYyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGlzRnVuYyA9IGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fCBmbiA9PT0gd2luZG93LmFsZXJ0IHx8IGZuID09PSB3aW5kb3cuY29uZmlybSB8fCBmbiA9PT0gd2luZG93LnByb21wdDtcblx0fVxuXHRyZXR1cm4gaXNGdW5jO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcblx0aWYgKCFpc0Z1bmN0aW9uKGZuKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHR9XG5cdHZhciBpLCBrLFxuXHRcdGlzU3RyaW5nID0gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycsXG5cdFx0bCA9IG9iai5sZW5ndGgsXG5cdFx0Y29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogbnVsbDtcblx0aWYgKGwgPT09ICtsKSB7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0aWYgKGNvbnRleHQgPT09IG51bGwpIHtcblx0XHRcdFx0Zm4oaXNTdHJpbmcgPyBvYmouY2hhckF0KGkpIDogb2JqW2ldLCBpLCBvYmopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm4uY2FsbChjb250ZXh0LCBpc1N0cmluZyA/IG9iai5jaGFyQXQoaSkgOiBvYmpbaV0sIGksIG9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvciAoayBpbiBvYmopIHtcblx0XHRcdGlmIChoYXNPd24uY2FsbChvYmosIGspKSB7XG5cdFx0XHRcdGlmIChjb250ZXh0ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0Zm4ob2JqW2tdLCBrLCBvYmopO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZuLmNhbGwoY29udGV4dCwgb2JqW2tdLCBrLCBvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IHJlcXVpcmUoJy4vc2hpbScpO1xuXG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG5cdHZhciBzdHIgPSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcblx0dmFyIGlzQXJndW1lbnRzID0gc3RyID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcblx0aWYgKCFpc0FyZ3VtZW50cykge1xuXHRcdGlzQXJndW1lbnRzID0gc3RyICE9PSAnW29iamVjdCBBcnJheV0nXG5cdFx0XHQmJiB2YWx1ZSAhPT0gbnVsbFxuXHRcdFx0JiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuXHRcdFx0JiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcblx0XHRcdCYmIHZhbHVlLmxlbmd0aCA+PSAwXG5cdFx0XHQmJiB0b1N0cmluZy5jYWxsKHZhbHVlLmNhbGxlZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0cmV0dXJuIGlzQXJndW1lbnRzO1xufTtcblxuIiwiKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltXG5cdHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuXHRcdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0XHRmb3JFYWNoID0gcmVxdWlyZSgnLi9mb3JlYWNoJyksXG5cdFx0aXNBcmdzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuXHRcdGhhc0RvbnRFbnVtQnVnID0gISh7J3RvU3RyaW5nJzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpLFxuXHRcdGhhc1Byb3RvRW51bUJ1ZyA9IChmdW5jdGlvbiAoKSB7fSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3Byb3RvdHlwZScpLFxuXHRcdGRvbnRFbnVtcyA9IFtcblx0XHRcdFwidG9TdHJpbmdcIixcblx0XHRcdFwidG9Mb2NhbGVTdHJpbmdcIixcblx0XHRcdFwidmFsdWVPZlwiLFxuXHRcdFx0XCJoYXNPd25Qcm9wZXJ0eVwiLFxuXHRcdFx0XCJpc1Byb3RvdHlwZU9mXCIsXG5cdFx0XHRcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXG5cdFx0XHRcImNvbnN0cnVjdG9yXCJcblx0XHRdLFxuXHRcdGtleXNTaGltO1xuXG5cdGtleXNTaGltID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0XHR2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcsXG5cdFx0XHRpc0Z1bmN0aW9uID0gdG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBGdW5jdGlvbl0nLFxuXHRcdFx0aXNBcmd1bWVudHMgPSBpc0FyZ3Mob2JqZWN0KSxcblx0XHRcdHRoZUtleXMgPSBbXTtcblxuXHRcdGlmICghaXNPYmplY3QgJiYgIWlzRnVuY3Rpb24gJiYgIWlzQXJndW1lbnRzKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcblx0XHR9XG5cblx0XHRpZiAoaXNBcmd1bWVudHMpIHtcblx0XHRcdGZvckVhY2gob2JqZWN0LCBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dGhlS2V5cy5wdXNoKHZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgbmFtZSxcblx0XHRcdFx0c2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRnVuY3Rpb247XG5cblx0XHRcdGZvciAobmFtZSBpbiBvYmplY3QpIHtcblx0XHRcdFx0aWYgKCEoc2tpcFByb3RvICYmIG5hbWUgPT09ICdwcm90b3R5cGUnKSAmJiBoYXMuY2FsbChvYmplY3QsIG5hbWUpKSB7XG5cdFx0XHRcdFx0dGhlS2V5cy5wdXNoKG5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGhhc0RvbnRFbnVtQnVnKSB7XG5cdFx0XHR2YXIgY3RvciA9IG9iamVjdC5jb25zdHJ1Y3Rvcixcblx0XHRcdFx0c2tpcENvbnN0cnVjdG9yID0gY3RvciAmJiBjdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0O1xuXG5cdFx0XHRmb3JFYWNoKGRvbnRFbnVtcywgZnVuY3Rpb24gKGRvbnRFbnVtKSB7XG5cdFx0XHRcdGlmICghKHNraXBDb25zdHJ1Y3RvciAmJiBkb250RW51bSA9PT0gJ2NvbnN0cnVjdG9yJykgJiYgaGFzLmNhbGwob2JqZWN0LCBkb250RW51bSkpIHtcblx0XHRcdFx0XHR0aGVLZXlzLnB1c2goZG9udEVudW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoZUtleXM7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBrZXlzU2hpbTtcbn0oKSk7XG5cbiIsIm1vZHVsZS5leHBvcnRzPShmdW5jdGlvbigpIHt2YXIgdCA9IGZ1bmN0aW9uIGFub255bW91cyhsb2NhbHMsIGZpbHRlcnMsIGVzY2FwZSkge1xuZXNjYXBlID0gZXNjYXBlIHx8IGZ1bmN0aW9uIChodG1sKXtcbiAgcmV0dXJuIFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mKD8hXFx3KzspL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xufTtcbnZhciBidWYgPSBbXTtcbndpdGggKGxvY2FscyB8fCB7fSkgeyAoZnVuY3Rpb24oKXsgXG4gYnVmLnB1c2goJzxkaXYgaWQ9XCJhdXRoMC13aWRnZXRcIiBjbGFzcz1cImNsZWFuc2xhdGVcIj5cXG5cdDxkaXYgY2xhc3M9XCJtb2RlIHNpZ25pblwiPlxcblx0ICAgIDxkaXYgY2xhc3M9XCJwb3B1cFwiPlxcblx0ICAgICAgXHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiPlxcblx0ICAgICAgICBcdDxkaXYgaWQ9XCJvbmVzdGVwXCIgY2xhc3M9XCJwYW5lbCBvbmVzdGVwXCI+XFxuXHQgICAgICAgICAgXHRcdDxoZWFkZXIgY2xhc3M9XCJoZWFkZXJcIj5cXG5cdCAgICAgICAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwiaW1hZ2VcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5cXG5cdCAgICAgICAgICAgIFx0XHRcdDxpbWcgc3JjPVwiXCI+XFxuXHQgICAgICAgICAgICBcdFx0PC9kaXY+XFxuXHQgICAgICAgICAgICBcdFx0PGgxPlNpZ24gSW48L2gxPlxcblx0XHRcdCAgICAgICAgICAgIDxoMiBjbGFzcz1cImVycm9yXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Jm5ic3A7PC9oMj5cXG5cdFx0XHQgICAgICAgICAgICA8aDIgY2xhc3M9XCJzdWNjZXNzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Jm5ic3A7PC9oMj5cXG5cdFx0XHQgICAgICAgICAgICA8YSBjbGFzcz1cImNsb3NlXCI+Q2xvc2U8L2E+XFxuXHQgICAgICAgICAgXHRcdDwvaGVhZGVyPlxcblxcblx0ICAgICAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwibG9nZ2VkaW5cIj5cXG5cdFx0XHQgICAgICAgICAgICA8Zm9ybT5cXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2VudGVyZWQgbGFzdC10aW1lXCI+PC9zcGFuPlxcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInN0cmF0ZWd5XCI+PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZW1haWwtcmVhZG9ubHlcIj48L3NwYW4+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgZGlzYWJsZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgYXV0b2ZvY3VzIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJ6b2NpYWwgcHJpbWFyeSBuZXh0XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIj5TaWduIEluPC9idXR0b24+XFxuXHRcdFx0XHRcdFx0XHRcdCAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHRcdFx0ICBcdDxsYWJlbCBjbGFzcz1cImNyZWF0ZS1hY2NvdW50XCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJmb3Jnb3QtcGFzc1wiPkZvcmdvdCB5b3VyIHBhc3N3b3JkPzwvYT48L2xhYmVsPlxcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjZW50ZXJlZCBhbGxcIj5TaG93IGFsbDwvc3Bhbj5cXG5cdFx0XHQgICAgICAgICAgICA8L2Zvcm0+XFxuXHQgICAgICAgICAgXHRcdDwvZGl2Plxcblxcblx0XHQgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwibm90bG9nZ2VkaW5cIj5cXG5cdFx0XHQgICAgICAgICAgICA8Zm9ybT5cXG5cdFx0XHQgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJpY29ubGlzdFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjxwIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Li4uIG9yIHNpZ24gaW4gdXNpbmc8L3A+PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJzZXBhcmF0b3JcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48c3Bhbj5vcjwvc3Bhbj48L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIGlkPVwic2lnbmluX2Vhc3lfZW1haWxcIiB0eXBlPVwiZW1haWxcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwicGFzc3dvcmRcIiBpZD1cInNpZ25pbl9lYXN5X3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHRpdGxlPVwiUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2lnbiBJbjwvYnV0dG9uPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGxhYmVsIGNsYXNzPVwiY3JlYXRlLWFjY291bnRcIj48YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cInNpZ24tdXBcIj5TaWduIFVwPC9hPjxzcGFuIGNsYXNzPVwiZGl2aWRlclwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Jm5ic3A74oCiJm5ic3A7PC9zcGFuPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiZm9yZ290LXBhc3NcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+PC9sYWJlbD5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0XHQgICAgICAgICAgXHQ8L2Rpdj5cXG5cXG5cdFx0ICAgICAgICAgIFx0PGRpdiBjbGFzcz1cInNpZ251cFwiPlxcblx0XHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiBpZD1cInNpZ251cF9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJzaWdudXBfZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJDcmVhdGUgYSBQYXNzd29yZFwiIHRpdGxlPVwiUGFzc3dvcmRcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2lnbiBVcDwvYnV0dG9uPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImZvb3RlclwiPjwvZGl2Plxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwib3B0aW9uc1wiPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgICBcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiY2VudGVyZWQgY2FuY2VsXCI+Q2FuY2VsPC9hPlxcblx0XHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0XHQgICAgICAgICAgXHQ8L2Rpdj5cXG5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlc2V0XCI+XFxuXHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJjaGFuZ2VfcGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgIFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPjwvZGl2Plxcblx0XHRcdFx0XHRcdCAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgaWQ9XCJyZXNldF9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiPlxcblx0XHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJyZXNldF9lYXN5X3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIk5ldyBQYXNzd29yZFwiIHRpdGxlPVwiTmV3IFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cInJlcGVhdFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxpbnB1dCBuYW1lPVwicmVwZWF0X3Bhc3N3b3JkXCIgaWQ9XCJyZXNldF9lYXN5X3JlcGVhdF9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJDb25maXJtIE5ldyBQYXNzd29yZFwiIHRpdGxlPVwiQ29uZmlybSBOZXcgUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHRcdFx0ICAgICAgXHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiem9jaWFsIHByaW1hcnkgbmV4dFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+U2VuZDwvYnV0dG9uPlxcblx0XHRcdFx0XHRcdCAgICAgIFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PGRpdiBjbGFzcz1cIm9wdGlvbnNcIj5cXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHQ8YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cImNlbnRlcmVkIGNhbmNlbFwiPkNhbmNlbDwvYT5cXG5cdFx0XHRcdFx0XHQgICAgICBcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0ICBcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZm9ybT5cXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFxcblx0ICAgICAgICAgIFx0XHQ8Zm9vdGVyPlxcblx0ICAgICAgICAgICAgXHRcdDxzcGFuPlBvd2VyZWQgYnkgPGEgaHJlZj1cImh0dHA6Ly9hdXRoMC5jb21cIiB0YXJnZXQ9XCJfbmV3XCI+QXV0aDA8L2E+PC9zcGFuPlxcblx0ICAgICAgICAgIFx0XHQ8L2Zvb3Rlcj5cXG5cdCAgICAgICAgXHQ8L2Rpdj5cXG5cdCAgICAgIFx0PC9kaXY+XFxuXHQgICAgPC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nKTsgfSkoKTtcbn0gXG5yZXR1cm4gYnVmLmpvaW4oJycpO1xufTsgcmV0dXJuIGZ1bmN0aW9uKGwpIHsgcmV0dXJuIHQobCkgfX0oKSkiLCJ2YXIgZ2xvYmFsPXR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fTt2YXIgQXV0aDAgICAgID0gcmVxdWlyZSgnYXV0aDAtanMnKTtcbnZhciBxd2VyeSAgICAgPSByZXF1aXJlKCdxd2VyeScpO1xudmFyIGJvbnpvICAgICA9IHJlcXVpcmUoJ2JvbnpvJyk7XG52YXIgYmVhbiAgICAgID0gcmVxdWlyZSgnYmVhbicpO1xudmFyIHh0ZW5kICAgICA9IHJlcXVpcmUoJ3h0ZW5kJyk7XG5cbnZhciBsb2dpblRtcGwgPSByZXF1aXJlKCcuL2h0bWwvbG9naW4uaHRtbCcpO1xuXG52YXIgJCA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICByZXR1cm4gYm9uem8ocXdlcnkoc2VsZWN0b3IsIHJvb3QpKTtcbn07XG5cbmZ1bmN0aW9uIEF1dGgwV2lkZ2V0IChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBdXRoMFdpZGdldCkpIHtcbiAgICByZXR1cm4gbmV3IEF1dGgwV2lkZ2V0KG9wdGlvbnMpO1xuICB9XG5cbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuX2F1dGgwID0gbmV3IEF1dGgwKHtcbiAgICBjbGllbnRJRDogICAgIHRoaXMuX29wdGlvbnMuY2xpZW50SUQsIFxuICAgIGNhbGxiYWNrVVJMOiAgdGhpcy5fb3B0aW9ucy5jYWxsYmFja1VSTCxcbiAgICBkb21haW46ICAgICAgIHRoaXMuX29wdGlvbnMuZG9tYWluXG4gIH0pO1xuICBcbiAgdGhpcy5fc3RyYXRlZ2llcyA9IHtcbiAgICAnZ29vZ2xlLW9wZW5pZCc6IHsgY3NzOiAnZ29vZ2xlJywgbmFtZTogJ0dvb2dsZSBPcGVuSWQnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnZ29vZ2xlLWFwcHMnOiB7IGNzczogJ2dvb2dsZScsIG5hbWU6ICdHb29nbGUgQXBwcycsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnZ29vZ2xlLW9hdXRoMic6IHsgY3NzOiAnZ29vZ2xlcGx1cycsIG5hbWU6ICdHb29nbGUnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnZmFjZWJvb2snOiB7IGNzczogJ2ZhY2Vib29rJywgbmFtZTogJ0ZhY2Vib29rJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ3dpbmRvd3NsaXZlJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ01pY3Jvc29mdCBBY2NvdW50Jywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2xpbmtlZGluJzogeyBjc3M6ICdsaW5rZWRpbicsIG5hbWU6ICdMaW5rZWRJbicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdnaXRodWInOiB7IGNzczogJ2dpdGh1YicsIG5hbWU6ICdHaXRIdWInLCBzb2NpYWw6IHRydWUgfSxcbiAgICAncGF5cGFsJzogeyBjc3M6ICdwYXlwYWwnLCBuYW1lOiAnUGF5UGFsJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ3R3aXR0ZXInOiB7IGNzczogJ3R3aXR0ZXInLCBuYW1lOiAnVHdpdHRlcicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdhbWF6b24nOiB7IGNzczogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBzb2NpYWw6IHRydWUgfSxcbiAgICAndmtvbnRha3RlJzogeyBjc3M6ICd2aycsIG5hbWU6ICd2S29udGFrdGUnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAneWFuZGV4JzogeyBjc3M6ICd5YW5kZXgnLCBuYW1lOiAnWWFuZGV4Jywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ29mZmljZTM2NSc6IHsgY3NzOiAnb2ZmaWNlMzY1JywgbmFtZTogJ09mZmljZTM2NScsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnd2FhZCc6IHsgY3NzOiAnd2FhZCcsIG5hbWU6ICdXaW5kb3dzIEF6dXJlIEFEJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhZGZzJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ0FERlMnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ3NhbWxwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdTQU1MJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdtc2NybSc6IHsgY3NzOiAnZ3Vlc3QnLCBuYW1lOiAnRHluYW1pY3MgQ1JNJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhZCc6IHsgY3NzOiAnd2luZG93cycsIG5hbWU6ICdBRCAvIExEQVAnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2N1c3RvbSc6IHsgY3NzOiAnZ3Vlc3QnLCBuYW1lOiAnQ3VzdG9tIEF1dGgnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2F1dGgwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdBdXRoMCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnYXV0aDAtYWRsZGFwJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdBRC9MREFQJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICd0aGlydHlzZXZlbnNpZ25hbHMnOiB7IGNzczogJ3RoaXJ0eXNldmVuc2lnbmFscycsIG5hbWU6ICczNyBTaWduYWxzJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2JveCc6IHsgY3NzOiAnYm94JywgbmFtZTogJ0JveCcsIHNvY2lhbDogdHJ1ZSwgaW1hZ2VpY29uOiB0cnVlIH0sXG4gICAgJ3NhbGVzZm9yY2UnOiB7IGNzczogJ3NhbGVzZm9yY2UnLCBuYW1lOiAnU2FsZXNmb3JjZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdmaXRiaXQnOiB7IGNzczogJ2ZpdGJpdCcsIG5hbWU6ICdGaXRiaXQnLCBzb2NpYWw6IHRydWUgfVxuICB9O1xufVxuXG4vLyBoZWxwZXIgbWV0aG9kc1xuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgZ2xvYmFsLndpbmRvdy5sb2NhdGlvbiA9IHVybDtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2V0VG9wID0gZnVuY3Rpb24gKG9uVG9wLCBlbGVtZW50KSB7XG4gIGlmICghb25Ub3ApIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZWxlbWVudC5jc3Moe1xuICAgICAgICAnbWFyZ2luVG9wJzogJy0nICsgKGVsZW1lbnQub2Zmc2V0KCkuaGVpZ2h0IC8gMikgKyAncHgnLFxuICAgICAgICAndG9wJzogJzUwJSdcbiAgICAgIH0pO1xuICAgIH0sIDEpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICdtYXJnaW5Ub3AnOiAnMnB4JyxcbiAgICAgICd0b3AnOiAnMCdcbiAgICB9KTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgJCgnLnNpZ25pbiBoMScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICQoJy5zaWduaW4gLnN1Y2Nlc3MnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5lcnJvcicpLmh0bWwoZXJyb3IpLmNzcygnZGlzcGxheScsICcnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1N1Y2Nlc3MgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiAuZXJyb3InKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5zdWNjZXNzJykuaHRtbChtZXNzYWdlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzQXV0aDBDb25uID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7XG4gIHJldHVybiBzdHJhdGVneSA9PT0gJ2F1dGgwJyB8fCBzdHJhdGVneSA9PT0gJ2F1dGgwLWFkbGRhcCc7XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX3NldFRpdGxlID0gZnVuY3Rpb24odGl0bGUpIHtcbiAgJCgnLnNpZ25pbiAuZXJyb3InKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbmluIC5zdWNjZXNzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnNpZ25pbiBoMScpLmh0bWwodGl0bGUpLmNzcygnZGlzcGxheScsICcnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fcGFyc2VSZXNwb25zZU1lc3NhZ2UgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0LCBkZWZhdWx0VmFsdWUpIHtcbiAgdHJ5IHtcbiAgICB2YXIgbXNqT2JqID0gSlNPTi5wYXJzZShyZXNwb25zZVRleHQpO1xuICAgIHJldHVybiB0aGlzLl9zaWduSW5PcHRpb25zW21zak9iai5jb2RlXSB8fCBtc2pPYmouZGVzY3JpcHRpb24gfHwgZGVmYXVsdFZhbHVlO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZSB8fMKgcmVzcG9uc2VUZXh0O1xuICB9XG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2lzQWRMZGFwQ29ubiA9IGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gIHJldHVybiBjb25uZWN0aW9uID09PSAnYWRsZGFwJztcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fYXJlVGhlcmVBbnlTb2NpYWxDb25uID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0gJiYgdGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fYXJlVGhlcmVBbnlFbnRlcnByaXNlT3JEYkNvbm4gPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgIGlmICh0aGlzLl9zdHJhdGVnaWVzW3RoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdICYmIFxuICAgICAgICAhdGhpcy5fc3RyYXRlZ2llc1t0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5faXNFbnRlcnByaXNlQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChlbWFpbCwgb3V0cHV0KSB7XG4gIHZhciBlbWFpbE0gPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL1xuICAgICAgICAgICAgICAgICAgICAuZXhlYyhlbWFpbC50b0xvd2VyQ2FzZSgpKTtcblxuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG4gICAgaWYgKHRoaXMuX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGMgaW4gc3RyYXRlZ3kuY29ubmVjdGlvbnMpIHtcbiAgICAgIGlmIChlbWFpbE0gJiYgZW1haWxNLnNsaWNlKC0yKVswXSA9PSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5kb21haW4pIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0IHx8wqB7fTtcbiAgICAgICAgb3V0cHV0LmRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9pc0VudGVycHJpc2VTdHJhdGVneSA9IGZ1bmN0aW9uIChzdHJhdGVneSkgeyBcbiAgZm9yICh2YXIgcyBpbiB0aGlzLl9zdHJhdGVnaWVzKSB7XG4gICAgaWYgKHMgPT09IHN0cmF0ZWd5ICYmICF0aGlzLl9zdHJhdGVnaWVzW3NdLnNvY2lhbCkgeyBcbiAgICAgIHJldHVybiB0cnVlOyBcbiAgICB9IFxuICB9IFxuXG4gIHJldHVybiBmYWxzZTsgXG59O1xuXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2dldENvbmZpZ3VyZWRTdHJhdGVneSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGZvciAodmFyIHMgaW4gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICBpZiAodGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10gJiYgdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuICAgIH1cbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRBdXRoMENvbm5lY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gaWYgc3BlY2lmaWVkLCB1c2UgaXQsIG90aGVyd2lzZSByZXR1cm4gZmlyc3RcbiAgaWYgKHRoaXMuX3NpZ25pbk9wdGlvbnNbJ3VzZXJQd2RDb25uZWN0aW9uTmFtZSddKSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9hdXRoMFN0cmF0ZWd5LmNvbm5lY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5fYXV0aDBTdHJhdGVneS5jb25uZWN0aW9uc1tpXS5uYW1lID09PSB0aGlzLl9zaWduaW5PcHRpb25zWyd1c2VyUHdkQ29ubmVjdGlvbk5hbWUnXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aDBTdHJhdGVneS5jb25uZWN0aW9uc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5fYXV0aDBTdHJhdGVneSA/IHRoaXMuX2F1dGgwU3RyYXRlZ3kuY29ubmVjdGlvbnNbMF0gOiBudWxsO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93T3JIaWRlUGFzc3dvcmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtYWlsRmllbGQgPSAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0Jyk7XG4gIHZhciBwd2RGaWVsZCAgPSAkKCcubm90bG9nZ2VkaW4gLnBhc3N3b3JkIGlucHV0JykuZmlyc3QoKTtcbiAgXG4gIHZhciBpc0VudGVycHJpc2VDb25uZWN0aW9uID0gdGhpcy5faXNFbnRlcnByaXNlQ29ubmVjdGlvbihtYWlsRmllbGQudmFsKCkpO1xuXG4gIGlmIChpc0VudGVycHJpc2VDb25uZWN0aW9uKSB7XG4gICAgcHdkRmllbGQuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBwd2RGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICBwd2RGaWVsZC5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpO1xuICB9IGVsc2Uge1xuICAgIHB3ZEZpZWxkLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgcHdkRmllbGQuYXR0cigncmVxdWlyZWQnLCB0cnVlKTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9oaWRlU2lnbkluID0gZnVuY3Rpb24gKGNiKSB7XG4gICQoJ2Rpdi5vdmVybGF5JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ21vZGUtc2lnbmluJyk7XG4gICAgaWYgKGNiKSBjYigpO1xuICB9LCA1MDApO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9nZXRBY3RpdmVMb2dpblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2hhc0xvZ2dlZEluQmVmb3JlID8gJCgnLmxvZ2dlZGluJykgOiAkKCcubm90bG9nZ2VkaW4nKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fdG9nZ2xlU3Bpbm5lciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICB2YXIgc3Bpbm5lciA9ICQoJy5zcGlubmVyJywgY29udGFpbmVyKTtcbiAgdmFyIHNpZ25pbiA9ICQoJy56b2NpYWwucHJpbWFyeScsIGNvbnRhaW5lcik7XG5cbiAgc3Bpbm5lci5jc3MoJ2Rpc3BsYXknLCBzcGlubmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgPyAnJyA6ICdub25lJyk7XG4gIHNpZ25pbi5jc3MoJ2Rpc3BsYXknLCBzaWduaW4uY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyA/ICcnIDogJ25vbmUnKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2V0TG9naW5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB0aGlzLl9oYXNMb2dnZWRJbkJlZm9yZSA9IG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyO1xuICB0aGlzLl9zZXRUaXRsZSh0aGlzLl9zaWduaW5PcHRpb25zWyd0aXRsZSddKTtcblxuICAkKCcubG9nZ2VkaW4nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcubm90bG9nZ2VkaW4nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAkKCcuc2lnbnVwJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgJCgnLnJlc2V0JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAkKCcubG9nZ2VkaW4nKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLmlzUmV0dXJuaW5nVXNlciA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLm5vdGxvZ2dlZGluJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5pc1JldHVybmluZ1VzZXIgPyAnbm9uZScgOiAnJyk7XG5cbiAgdGhpcy5fc2V0VG9wKHRoaXMuX3NpZ25pbk9wdGlvbnMudG9wLCAkKCcuc2lnbmluIGRpdi5wYW5lbC5vbmVzdGVwJykpO1xuICAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0JykuZmlyc3QoKS5mb2N1cygpO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaG93TG9nZ2VkSW5FeHBlcmllbmNlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fc3NvRGF0YS5sYXN0VXNlZENvbm5lY3Rpb24uc3RyYXRlZ3k7XG4gIHRoaXMuX3NldExvZ2luVmlldyh7IGlzUmV0dXJuaW5nVXNlcjogISFzdHJhdGVneSB9KTtcblxuICBpZiAoIXN0cmF0ZWd5KSByZXR1cm47XG5cbiAgdmFyIGxvZ2luVmlldyA9IHRoaXMuX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICBiZWFuLm9uKCQoJ2Zvcm0nLCBsb2dpblZpZXcpWzBdLCAnc3VibWl0JywgdGhpcy5fc2lnbkluRW50ZXJwcmlzZSk7XG4gIFxuICB2YXIgYnV0dG9uO1xuICBpZiAoc3RyYXRlZ3kgIT09ICdhdXRoMCcpIHtcbiAgICBidXR0b24gPSBib256byhib256by5jcmVhdGUoJzxzcGFuPjwvc3Bhbj4nKSlcbiAgICAgIC5hdHRyKCd0YWJpbmRleCcsIDApXG4gICAgICAuYXR0cignZGF0YS1zdHJhdGVneScsIHN0cmF0ZWd5KVxuICAgICAgLmF0dHIoJ3RpdGxlJywgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSlcbiAgICAgIC5hZGRDbGFzcygnem9jaWFsJykuYWRkQ2xhc3MoJ2Jsb2NrJylcbiAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5jc3MpXG4gICAgICAuYWRkQ2xhc3ModGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0uaW1hZ2VpY29uID8gJ2ltYWdlLWljb24nIDogJycpXG4gICAgICAuaHRtbCh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5uYW1lKTtcbiAgICBcbiAgICBiZWFuLm9uKGJ1dHRvblswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5fc2lnbkluU29jaWFsKGUudGFyZ2V0KTsgfSk7XG5cbiAgICAkKCcuc3RyYXRlZ3kgc3BhbicsIGxvZ2luVmlldykuZWFjaChmdW5jdGlvbiAoZWwpIHsgaWYgKGVsKSBlbC5yZW1vdmUoKTsgfSk7XG4gICAgJCgnLnN0cmF0ZWd5JywgbG9naW5WaWV3KS5hcHBlbmQoYnV0dG9uKTtcbiAgfVxuXG4gICQoJy5hbGwnLCBsb2dpblZpZXcpLmh0bWwodGhpcy5fc2lnbmluT3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSk7XG5cbiAgYmVhbi5vbigkKCcuYWxsJywgbG9naW5WaWV3KVswXSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3NldExvZ2luVmlldyh7IGlzUmV0dXJuaW5nVXNlcjogZmFsc2UgfSk7XG4gIH0pO1xuXG4gIGlmICh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpIHtcbiAgICBpZiAoc3RyYXRlZ3kgPT09ICdhdXRoMCcpIHtcbiAgICAgICQoJy5lbWFpbC1yZWFkb25seScsIGxvZ2luVmlldykuaHRtbCh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpOyBcbiAgICAgICQoJy5lbWFpbCBpbnB1dCcsIGxvZ2luVmlldykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICQoJy5lbWFpbFBhc3N3b3JkJywgbG9naW5WaWV3KS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgfSBcbiAgICBlbHNlIGlmICh0aGlzLl9pc0VudGVycHJpc2VTdHJhdGVneShzdHJhdGVneSkpIHtcbiAgICAgIGJ1dHRvbi5odG1sKF9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUgfHwgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSlcbiAgICAgICAgICAgIC5hdHRyKCd0aXRsZScsIF9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUgfHwgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBzaWduIGluIG1ldGhvZHNcbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluU29jaWFsID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICB2YXIgc3RyYXRlZ3lOYW1lID0gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyB0YXJnZXQgOiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN0cmF0ZWd5Jyk7XG4gIHZhciBzdHJhdGVneSA9IHRoaXMuX2dldENvbmZpZ3VyZWRTdHJhdGVneShzdHJhdGVneU5hbWUpO1xuXG4gIGlmIChzdHJhdGVneSkge1xuICAgIHRoaXMuX2F1dGgwLmxvZ2luKHtcbiAgICAgIGNvbm5lY3Rpb246IHN0cmF0ZWd5LmNvbm5lY3Rpb25zWzBdLm5hbWVcbiAgICB9KTtcbiAgfVxufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLl9zaWduSW5FbnRlcnByaXNlID0gZnVuY3Rpb24gKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLl9nZXRBY3RpdmVMb2dpblZpZXcoKTtcbiAgdmFyIGZvcm0gPSAkKCdmb3JtJywgY29udGFpbmVyKTtcbiAgdmFyIHZhbGlkID0gdHJ1ZTtcblxuICB2YXIgZW1haWxEID0gJCgnLmVtYWlsJywgZm9ybSksXG4gICAgICBlbWFpbEUgPSAkKCdpbnB1dFtuYW1lPWVtYWlsXScsIGZvcm0pLFxuICAgICAgZW1haWxNID0gL14oKFtePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSsoXFwuW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKykqKXwoXFxcIi4rXFxcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcXSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC8uZXhlYyhlbWFpbEUudmFsKCkudG9Mb3dlckNhc2UoKSksXG4gICAgICBlbWFpbFAgPSAvXlxccyokLy50ZXN0KGVtYWlsRS52YWwoKSksXG4gICAgICBkb21haW4sIHVybCwgZW1haWwgPSBudWxsLCBzdHJhdGVneTtcblxuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgc3RyYXRlZ3kgPSB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1tzXTtcblxuICAgIGlmICh0aGlzLl9pc0F1dGgwQ29ubihzdHJhdGVneS5uYW1lKSkgY29udGludWU7XG5cbiAgICBmb3IgKHZhciBjIGluIHN0cmF0ZWd5LmNvbm5lY3Rpb25zKSB7XG4gICAgICBpZighZW1haWxQICYmIGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbikge1xuICAgICAgICBkb21haW4gPSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS5kb21haW47XG4gICAgICAgIHVybCA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLnVybDtcbiAgICAgICAgZW1haWwgPSBlbWFpbEUudmFsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkb21haW4pIGJyZWFrO1xuICB9XG5cbiAgaWYgKGVtYWlsUCkge1xuICAgIHRoaXMuX3Nob3dFcnJvcih0aGlzLl9zaWduaW5PcHRpb25zWydzdHJhdGVneUVtYWlsRW1wdHknXSk7XG4gIH0gXG4gIGVsc2UgaWYgKCFlbWFpbE0pIHtcbiAgICB0aGlzLl9zaG93RXJyb3IodGhpcy5fc2lnbmluT3B0aW9uc1snc3RyYXRlZ3lFbWFpbEludmFsaWQnXSk7XG4gIH0gXG4gIGVsc2UgaWYgKCFkb21haW4pIHtcbiAgICBpZiAodGhpcy5fYXV0aDBTdHJhdGVneSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25JbldpdGhBdXRoMChlbWFpbEUudmFsKCkpO1xuICAgIH1cblxuICAgIGlmIChlbWFpbE0gJiYgZW1haWxNLnNsaWNlKC0yKVswXSA9PT0gJ2dtYWlsLmNvbScpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaWduSW5Tb2NpYWwoJ2dvb2dsZS1vYXV0aDInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zaG93RXJyb3IodGhpcy5fc2lnbmluT3B0aW9uc1snc3RyYXRlZ3lEb21haW5JbnZhbGlkJ10sIHsgZG9tYWluOiBlbWFpbE0gJiYgZW1haWxNLnNsaWNlKC0yKVswXSB9KTtcbiAgfVxuXG4gIHZhbGlkICY9ICghZG9tYWluICYmICFlbWFpbEQuYWRkQ2xhc3MoJ2ludmFsaWQnKSkgfHwgKCEhZG9tYWluICYmICEhZW1haWxELnJlbW92ZUNsYXNzKCdpbnZhbGlkJykpO1xuXG4gIGlmICh2YWxpZCkge1xuICAgIHRoaXMuX3JlZGlyZWN0KHVybCk7XG4gIH1cbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2lnbkluV2l0aEF1dGgwID0gZnVuY3Rpb24gKHVzZXJOYW1lLCBzaWduSW5QYXNzd29yZCkge1xuICB0aGlzLl90b2dnbGVTcGlubmVyKCk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29udGFpbmVyID0gdGhpcy5fZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gIHZhciBjb25uZWN0aW9uICA9IHRoaXMuX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuICBcbiAgdmFyIGxvZ2luT3B0aW9ucyA9IHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgdXNlcm5hbWU6IHRoaXMuX2lzQWRMZGFwQ29ubihjb25uZWN0aW9uLm5hbWUpID8gdXNlck5hbWUucmVwbGFjZSgnQCcgKyBjb25uZWN0aW9uLmRvbWFpbiwgJycpIDogdXNlck5hbWUsXG4gICAgcGFzc3dvcmQ6IHNpZ25JblBhc3N3b3JkIHx8wqAkKCcucGFzc3dvcmQgaW5wdXQnLCBjb250YWluZXIpLnZhbCgpXG4gIH07XG5cbiAgZm9yICh2YXIgayBpbiB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMpIHtcbiAgICBsb2dpbk9wdGlvbnNba10gPSB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXNba107XG4gIH1cblxuICB0aGlzLl9hdXRoMC5sb2dpbihsb2dpbk9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzZWxmLl9zaG93RXJyb3Ioc2VsZi5fcGFyc2VSZXNwb25zZU1lc3NhZ2UoZXJyLCBzZWxmLl9zaWduaW5PcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSkpO1xuICAgIH1cblxuICAgIHNlbGYuX3RvZ2dsZVNwaW5uZXIoKTtcbiAgfSk7XG59O1xuXG4vLyBpbml0aWFsaXplXG5BdXRoMFdpZGdldC5wcm90b3R5cGUuX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRPRE86IHN1cHBvcnQgY3NzIG9wdGlvbiBmb3Igbm9uIGZyZWUgc3Vic2NyaXB0aW9uc1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgYS5jbG9zZScpWzBdLCAnY2xpY2snLCB0aGlzLl9oaWRlU2lnbkluKTtcbiAgYmVhbi5vbigkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLm5vdGxvZ2dlZGluIGZvcm0nKVswXSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3NpZ25JbkVudGVycHJpc2UoZSk7IH0pO1xuICBiZWFuLm9uKCQoJ2h0bWwnKVswXSwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdtb2RlLXNpZ25pbicpKSB7XG4gICAgICBpZiAoKGUud2hpY2ggPT0gMjcgfHwgZS5rZXljb2RlID09IDI3KSAmJiAhc2VsZi5fc2lnbmluT3B0aW9ucy5zdGFuZGFsb25lKSB7XG4gICAgICAgIHNlbGYuX2hpZGVTaWduSW4oKTsgLy8gY2xvc2UgcG9wdXAgd2l0aCBFU0Mga2V5XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBsb2FkIHNvY2lhbCBidXR0b25zXG4gIHZhciBsaXN0ID0gJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5pY29ubGlzdCcpO1xuICBmb3IgKHZhciBzIGluIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fY2xpZW50LnN0cmF0ZWdpZXNbc107XG5cbiAgICBpZiAodGhpcy5faXNBdXRoMENvbm4oc3RyYXRlZ3kubmFtZSkgJiYgc3RyYXRlZ3kuY29ubmVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYXV0aDBTdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgICAgJCgnLmNyZWF0ZS1hY2NvdW50LCAucGFzc3dvcmQnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgYmVhbi5vbigkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0JylbMF0sICdpbnB1dCcsIGZ1bmN0aW9uIChlKSB7IHNlbGYuX3Nob3dPckhpZGVQYXNzd29yZChlKTsgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0gJiYgdGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5zb2NpYWwpIHtcbiAgICAgIHZhciBidXR0b24gPSBib256byhib256by5jcmVhdGUoJzxzcGFuPjwvc3Bhbj4nKSlcbiAgICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgICAgLmF0dHIoJ2RhdGEtc3RyYXRlZ3knLCBzdHJhdGVneS5uYW1lKVxuICAgICAgICAuYXR0cigndGl0bGUnLCB0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLm5hbWUpXG4gICAgICAgIC5hZGRDbGFzcygnem9jaWFsJykuYWRkQ2xhc3MoJ2ljb24nKVxuICAgICAgICAuYWRkQ2xhc3ModGhpcy5fc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5jc3MpXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLmltYWdlaWNvbiA/ICdpbWFnZS1pY29uJyA6ICcnKVxuICAgICAgICAuaHRtbCh0aGlzLl9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLm5hbWUpO1xuXG4gICAgICBsaXN0LmFwcGVuZChidXR0b24pO1xuICAgICAgbGlzdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5zZXBhcmF0b3InKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG4gIH1cblxuICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5lYWNoKGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICBiZWFuLm9uKGJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYuX3NpZ25JblNvY2lhbChlLnRhcmdldCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRoaXMuX3Nob3dTaWduSW4oKTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fc2hvd1NpZ25JbiA9IGZ1bmN0aW9uICgpIHtcbiAgJCgnaHRtbCcpLmFkZENsYXNzKCdtb2RlLXNpZ25pbicpO1xuXG4gIC8vIGlmIG5vIHNvY2lhbCBjb25uZWN0aW9ucyBhbmQgb25lIGVudGVycHJpc2UgY29ubmVjdGlvbiBvbmx5LCByZWRpcmVjdFxuICBpZiAoIXRoaXMuX2FyZVRoZXJlQW55U29jaWFsQ29ubigpICYmIFxuICAgIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzLmxlbmd0aCA9PT0gMSAmJlxuICAgIHRoaXMuX2NsaWVudC5zdHJhdGVnaWVzWzBdLm5hbWUgIT09ICdhdXRoMCcgJiZcbiAgICB0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1swXS5jb25uZWN0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICBcbiAgICB0aGlzLl9yZWRpcmVjdCh0aGlzLl9jbGllbnQuc3RyYXRlZ2llc1swXS5jb25uZWN0aW9uc1swXS51cmwpO1xuICB9XG5cbiAgLy8gbGFiZWxzIHRleHRcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLl9zaWduaW5PcHRpb25zIHx8IHt9O1xuICBvcHRpb25zWydvbmVzdGVwJ10gPSB0eXBlb2Ygb3B0aW9uc1snb25lc3RlcCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ29uZXN0ZXAnXSA6IGZhbHNlO1xuICBvcHRpb25zWyd0b3AnXSA9IG9wdGlvbnNbJ3RvcCddIHx8IGZhbHNlO1xuICBvcHRpb25zWyd0aXRsZSddID0gb3B0aW9uc1sndGl0bGUnXSB8fCAnU2lnbiBJbic7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5QnV0dG9uVGVtcGxhdGUnXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5QnV0dG9uVGVtcGxhdGUnXSB8fCBcIntuYW1lfVwiO1xuICBvcHRpb25zWydhbGxCdXR0b25UZW1wbGF0ZSddID0gb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSB8fCBcIlNob3cgYWxsXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5QmFjayddID0gb3B0aW9uc1snc3RyYXRlZ3lCYWNrJ10gfHwgXCJCYWNrXCI7XG4gIG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxMYWJlbCddID0gb3B0aW9uc1snc3RyYXRlZ3lFbWFpbExhYmVsJ10gfHwgXCJFbWFpbDpcIjtcbiAgb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEVtcHR5J10gPSBvcHRpb25zWydzdHJhdGVneUVtYWlsRW1wdHknXSB8fCBcIlRoZSBlbWFpbCBpcyBlbXB0eS5cIjtcbiAgb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEludmFsaWQnXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxJbnZhbGlkJ10gfHwgXCJUaGUgZW1haWwgaXMgaW52YWxpZC5cIjtcblxuICBvcHRpb25zWydpY29uJ10gPSBvcHRpb25zWydpY29uJ10gfHwgXCJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vYXNzZXRzLmF1dGgwLmNvbS93Mi9pbWcvbG9nby0zMi5wbmdcIjtcbiAgb3B0aW9uc1snc2hvd0ljb24nXSA9IHR5cGVvZiBvcHRpb25zWydzaG93SWNvbiddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dJY29uJ10gOiBmYWxzZTtcbiAgb3B0aW9uc1snc2hvd1NpZ251cCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dTaWdudXAnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93U2lnbnVwJ10gOiB0cnVlO1xuICBvcHRpb25zWydzaG93Rm9yZ290J10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0ZvcmdvdCddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3Nob3dGb3Jnb3QnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3NpZ251cFRleHQnXSA9IG9wdGlvbnNbJ3NpZ251cFRleHQnXSB8fCAnU2lnbiBVcCc7XG4gIG9wdGlvbnNbJ2ZvcmdvdFRleHQnXSA9IG9wdGlvbnNbJ2ZvcmdvdFRleHQnXSB8fCAnRm9yZ290IHlvdXIgcGFzc3dvcmQ/JztcbiAgb3B0aW9uc1sndXNlQXBwU2lnbkluQ2FsbGJhY2snXSA9IHR5cGVvZiBvcHRpb25zWyd1c2VBcHBTaWduSW5DYWxsYmFjayddICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnNbJ3VzZUFwcFNpZ25JbkNhbGxiYWNrJ10gOiBmYWxzZTtcbiAgb3B0aW9uc1snc2lnbkluQnV0dG9uVGV4dCddID0gb3B0aW9uc1snc2lnbkluQnV0dG9uVGV4dCddIHx8ICdTaWduIEluJztcbiAgb3B0aW9uc1snZW1haWxQbGFjZWhvbGRlciddID0gb3B0aW9uc1snZW1haWxQbGFjZWhvbGRlciddIHx8ICdFbWFpbCc7XG4gIG9wdGlvbnNbJ3Bhc3N3b3JkUGxhY2Vob2xkZXInXSA9IG9wdGlvbnNbJ3Bhc3N3b3JkUGxhY2Vob2xkZXInXSB8fCAnUGFzc3dvcmQnO1xuICBvcHRpb25zWydzZXBhcmF0b3JUZXh0J10gPSBvcHRpb25zWydzZXBhcmF0b3JUZXh0J10gfHwgJ29yJztcbiAgb3B0aW9uc1snc2VydmVyRXJyb3JUZXh0J10gPSBvcHRpb25zWydzZXJ2ZXJFcnJvclRleHQnXSB8fCAnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHNpZ24gaW4uJztcbiAgb3B0aW9uc1snc2hvd0VtYWlsJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0VtYWlsJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd0VtYWlsJ10gOiB0cnVlO1xuICBvcHRpb25zWydzaG93UGFzc3dvcmQnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93UGFzc3dvcmQnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93UGFzc3dvcmQnXSA6IHRydWU7XG4gIG9wdGlvbnNbJ3NvY2lhbEJpZ0J1dHRvbnMnXSA9IHR5cGVvZiBvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddIDogIXRoaXMuX2FyZVRoZXJlQW55RW50ZXJwcmlzZU9yRGJDb25uKCk7XG4gIG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10gPSB0eXBlb2Ygb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddIDogdHJ1ZTtcbiAgb3B0aW9uc1sncmV0dXJuVXNlckxhYmVsJ10gPSBvcHRpb25zWydyZXR1cm5Vc2VyTGFiZWwnXSB8fCAnTGFzdCB0aW1lIHlvdSBzaWduZWQgaW4gdXNpbmcuLi4nO1xuICBvcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSA9IG9wdGlvbnNbJ3dyb25nRW1haWxQYXNzd29yZEVycm9yVGV4dCddIHx8ICdXcm9uZyBlbWFpbCBvciBwYXNzd29yZC4nO1xuXG4gIC8vIHRoZW1lXG4gIGlmIChvcHRpb25zLnRoZW1lKSB7XG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCd0aGVtZS0nICsgb3B0aW9ucy50aGVtZSk7XG4gIH1cblxuICAkKCcucGFuZWwgYS5jbG9zZScpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc3RhbmRhbG9uZSA/ICdub25lJyA6ICdibG9jaycpO1xuXG4gIC8vIHNob3cgaWNvblxuICBpZiAob3B0aW9ucy5zaG93SWNvbikge1xuICAgICQoJy5wYW5lbCAuaW1hZ2UgaW1nJykuYXR0cignc3JjJywgb3B0aW9ucy5pY29uKTtcbiAgICAkKCcucGFuZWwgLmltYWdlJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93SWNvbiA/ICdibG9jaycgOiAnbm9uZScpO1xuICB9XG5cbiAgLy8gaGlkZSBkaXZpZGVyIGRvdCBpZiB0aGVyZSBhcmUgb25lIG9mIHR3b1xuICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5kaXZpZGVyJylcbiAgICAuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgb3B0aW9ucy5zaG93U2lnbnVwICYmIG9wdGlvbnMuc2hvd0ZvcmdvdCA/ICcnIDogJ25vbmUnKTtcblxuICAkKCdkaXYucGFuZWwgaW5wdXQnKS5lYWNoKGZ1bmN0aW9uIChlKSB7IGUudmFsdWUgPSAnJzsgfSk7XG5cbiAgLy8gcGxhY2Vob2xkZXJzIGFuZCBidXR0b25zXG4gICQoJy5wYW5lbCAuem9jaWFsLnByaW1hcnknKS5odG1sKG9wdGlvbnMuc2lnbkluQnV0dG9uVGV4dCk7XG4gICQoJy5wYW5lbCAuZW1haWwgaW5wdXQnKS5hdHRyKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMuZW1haWxQbGFjZWhvbGRlcik7XG4gICQoJy5wYW5lbCAucGFzc3dvcmQgaW5wdXQnKS5hdHRyKCdwbGFjZWhvbGRlcicsIG9wdGlvbnMucGFzc3dvcmRQbGFjZWhvbGRlcik7XG4gICQoJy5wYW5lbCAuc2VwYXJhdG9yIHNwYW4nKS5odG1sKG9wdGlvbnMuc2VwYXJhdG9yVGV4dCk7XG5cbiAgLy8gc2hvdyBlbWFpbCwgcGFzc3dvcmQsIHNlcGFyYXRvciBhbmQgYnV0dG9uIGlmIHRoZXJlIGFyZSBlbnRlcnByaXNlL2RiIGNvbm5lY3Rpb25zXG4gIHZhciBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPSB0aGlzLl9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubigpO1xuICB2YXIgYW55U29jaWFsQ29ubmVjdGlvbiA9IHRoaXMuX2FyZVRoZXJlQW55U29jaWFsQ29ubigpO1xuXG4gICQoJy5wYW5lbCAuZW1haWwgaW5wdXQnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuem9jaWFsLnByaW1hcnknKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAucGFzc3dvcmQgaW5wdXQnKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBvcHRpb25zLnNob3dQYXNzd29yZCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuY3JlYXRlLWFjY291bnQgLmZvcmdvdC1wYXNzJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgb3B0aW9ucy5zaG93Rm9yZ290ICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuc2lnbi11cCcpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd1NpZ251cCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAuc2VwYXJhdG9yJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uICYmIGFueVNvY2lhbENvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICQoJy5wYW5lbCAubGFzdC10aW1lJykuaHRtbChvcHRpb25zLnJldHVyblVzZXJMYWJlbCk7XG5cbiAgLy8gVE9ETzogc2hvdyBwbGFjZWhvbGRlcnMgZm9yIElFOVxuXG4gIC8vIGFjdGl2YXRlIHBhbmVsXG4gICQoJ2Rpdi5wYW5lbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJCgnZGl2Lm92ZXJsYXknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICQoJy5wb3B1cCBoMScpLmh0bWwob3B0aW9ucy50aXRsZSk7XG4gICQoJy5wb3B1cCAuaW52YWxpZCcpLnJlbW92ZUNsYXNzKCdpbnZhbGlkJyk7XG5cbiAgLy8gaWYgdXNlciBsb2dnZWQgaW4gc2hvdyBsb2dnZWQgaW4gZXhwZXJpZW5jZVxuICBpZiAodGhpcy5fc3NvRGF0YS5zc28gJiYgb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSkge1xuICAgIHRoaXMuX3Nob3dMb2dnZWRJbkV4cGVyaWVuY2UoKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10pIHtcbiAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLmljb25saXN0IHNwYW4nKS5yZW1vdmVDbGFzcygnaWNvbicpLmFkZENsYXNzKCdibG9jaycpO1xuICB9IGVsc2Uge1xuICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmFkZENsYXNzKCdpY29uJykucmVtb3ZlQ2xhc3MoJ2Jsb2NrJyk7XG4gIH1cblxuICAkKCdkaXYucGFuZWwub25lc3RlcCBoMScpLmh0bWwob3B0aW9uc1sndGl0bGUnXSk7XG4gICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gIGlmICh0aGlzLl9zc29EYXRhLnNzbyAmJiB0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpIHtcbiAgICAkKCdkaXYucGFuZWwub25lc3RlcCBpbnB1dCcpLnZhbCh0aGlzLl9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpO1xuICB9XG5cbiAgdGhpcy5fc2V0VG9wKG9wdGlvbnMudG9wLCAkKCdkaXYucGFuZWwub25lc3RlcCcpKTtcbiAgdGhpcy5fc2V0TG9naW5WaWV3KHsgaXNSZXR1cm5pbmdVc2VyOiB0aGlzLl9zc29EYXRhLnNzbyB9KTtcbn07XG5cbkF1dGgwV2lkZ2V0LnByb3RvdHlwZS5fZ2V0Q29uZmlndXJlZFN0cmF0ZWdpZXMgPSBmdW5jdGlvbiAoY29ubnMpIHtcbiAgdmFyIHN0cmF0ZWdpZXMgPSBbXTtcbiAgZm9yICh2YXIgY29ubiBpbiBjb25ucykge1xuICAgIGlmICh0eXBlb2YoY29ubnNbY29ubl0uc3RhdHVzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWNvbm5zW2Nvbm5dLnN0YXR1cykgY29udGludWU7XG5cbiAgICB2YXIgc3RyYXRlZ3kgPSBzdHJhdGVnaWVzLmZpbHRlcihmdW5jdGlvbiAocykgeyBcbiAgICAgIHJldHVybiBzLm5hbWUgPT09IGNvbm5zW2Nvbm5dLnN0cmF0ZWd5OyBcbiAgICB9KVswXTtcblxuICAgIGlmICghc3RyYXRlZ3kpIHtcbiAgICAgIHN0cmF0ZWd5ID0ge1xuICAgICAgICBuYW1lOiBjb25uc1tjb25uXS5zdHJhdGVneSxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtdXG4gICAgICB9O1xuXG4gICAgICBzdHJhdGVnaWVzLnB1c2goc3RyYXRlZ3kpO1xuICAgIH1cblxuICAgIHZhciBjb25uRGF0YSA9IHtcbiAgICAgIG5hbWU6IGNvbm5zW2Nvbm5dLm5hbWUsXG4gICAgICBkb21haW46IGNvbm5zW2Nvbm5dLmRvbWFpblxuICAgIH07XG5cbiAgICBzdHJhdGVneS5jb25uZWN0aW9ucy5wdXNoKGNvbm5EYXRhKTtcbiAgfVxuXG4gIHJldHVybiBzdHJhdGVnaWVzO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLmdldENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2F1dGgwO1xufTtcblxuQXV0aDBXaWRnZXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoc2lnbmluT3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3NpZ25pbk9wdGlvbnMgPSB4dGVuZCh0aGlzLl9vcHRpb25zLCBzaWduaW5PcHRpb25zKTtcbiAgdGhpcy5fYXV0aDAgPSBuZXcgQXV0aDAoe1xuICAgIGNsaWVudElEOiAgICAgdGhpcy5fc2lnbmluT3B0aW9ucy5jbGllbnRJRCwgXG4gICAgY2FsbGJhY2tVUkw6ICB0aGlzLl9zaWduaW5PcHRpb25zLmNhbGxiYWNrVVJMLFxuICAgIGRvbWFpbjogICAgICAgdGhpcy5fc2lnbmluT3B0aW9ucy5kb21haW5cbiAgfSk7XG5cbiAgLy8gVE9ETzogc2V0IGF1dGgwIGNvbm5lY3Rpb24gcGFyYW1ldGVyc1xuICB0aGlzLl9hdXRoMENvbm5lY3Rpb25QYXJhbXMgPSBudWxsO1xuXG4gIC8vIGdldCBjb25maWd1cmVkIHN0cmF0ZWdpZXMvY29ubmVjdGlvbnNcbiAgdGhpcy5fYXV0aDAuZ2V0Q29ubmVjdGlvbnMoZnVuY3Rpb24gKGVyciwgY29ubmVjdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZENvbm5lY3Rpb25zID0gW107XG5cbiAgICAvLyB1c2Ugb25seSBzcGVjaWZpZWQgY29ubmVjdGlvbnNcbiAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucykge1xuICAgICAgZm9yICh2YXIgaSBpbiBjb25uZWN0aW9ucykge1xuICAgICAgICBpZiAoc2VsZi5fc2lnbmluT3B0aW9ucy5jb25uZWN0aW9ucy5pbmRleE9mKGNvbm5lY3Rpb25zW2ldLm5hbWUpID4gLTEpIHtcbiAgICAgICAgICBhbGxvd2VkQ29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhbGxvd2VkQ29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICBzZWxmLl9jbGllbnQgPSB7XG4gICAgICBzdHJhdGVnaWVzOiBzZWxmLl9nZXRDb25maWd1cmVkU3RyYXRlZ2llcyhhbGxvd2VkQ29ubmVjdGlvbnMpXG4gICAgfTtcblxuICAgIC8vIGdldCBTU08gZGF0YVxuICAgIHNlbGYuX2F1dGgwLmdldFNTT0RhdGEoZnVuY3Rpb24gKGVyciwgc3NvRGF0YSkge1xuICAgICAgc2VsZi5fc3NvRGF0YSA9IHNzb0RhdGE7XG4gICAgICBcbiAgICAgIC8vIHdpZGdldCBjb250YWluZXJcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5pbm5lckhUTUwgPSBsb2dpblRtcGwoe30pO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgXG4gICAgICBzZWxmLl9pbml0aWFsaXplKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMFdpZGdldDtcbiJdfQ==
;