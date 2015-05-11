/**
 * Module dependencies.
 */

var r = module.exports;

// Check for a valid email address
r.email_parser = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

r.username_parser = /^[a-zA-Z0-9_]{1,15}$/;
// check for an empty form value
r.empty = /^\s*$/;

// Check for a valid phone number
r.phone_number = /^[0-9]{1,14}$/;

// Check for a valid sms passcode
r.sms_passcode = /^[0-9]{6}$/;
