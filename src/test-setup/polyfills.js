// Polyfills for Node.js globals needed by jsdom and whatwg-url
// This file must be loaded before any imports that use JSDOM

const util = require('util');

// Set up TextEncoder/TextDecoder from Node.js util module
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = util.TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = util.TextDecoder;
}

// Additional polyfills that might be needed
if (typeof global.performance === 'undefined') {
  global.performance = {
    now: () => Date.now()
  };
}

// Web API polyfills for Node.js environment
// Proper Web Streams API polyfill (required by undici/fetch)
if (typeof global.ReadableStream === 'undefined') {
  const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
  global.ReadableStream = ReadableStream;
  global.WritableStream = WritableStream;
  global.TransformStream = TransformStream;
}

// MessagePort polyfill - basic implementation
if (typeof global.MessagePort === 'undefined') {
  global.MessagePort = class MessagePort {
    constructor() {
      this.onmessage = null;
      this.onmessageerror = null;
    }
    
    postMessage() {}
    start() {}
    close() {}
  };
}

// MessageChannel polyfill
if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new global.MessagePort();
      this.port2 = new global.MessagePort();
    }
  };
}
