// Polyfills for Node.js globals needed by jsdom and whatwg-url
// This file must be loaded before any imports that use JSDOM
//
// POLYFILL IMPLEMENTATION NOTES:
// - web-streams-polyfill: Complete polyfill for Web Streams API
// - MessagePort/MessageChannel: Test-friendly implementations with actual message passing
// - TextEncoder/TextDecoder: Uses Node.js native implementations
// - Performance: Minimal implementation using Date.now()

const util = require('util');

// Verify required dependencies are available
try {
  require('web-streams-polyfill');
} catch (error) {
  console.warn('web-streams-polyfill not found in dependencies. Some functionality may be limited.');
}

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
// Check for undefined OR incomplete implementations (Node.js built-ins may be incomplete)
if (typeof global.ReadableStream === 'undefined' || 
    (global.ReadableStream && !global.ReadableStream.prototype.tee)) {
  try {
    const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
    global.ReadableStream = ReadableStream;
    global.WritableStream = WritableStream;
    global.TransformStream = TransformStream;
  } catch (error) {
    // Fallback warning if web-streams-polyfill is not available
    console.warn('web-streams-polyfill not available, some functionality may be limited:', error.message);
  }
}

// MessagePort polyfill
if (typeof global.MessagePort === 'undefined') {
  global.MessagePort = class MessagePort {
    constructor() {
      this.onmessage = null;
      this.onmessageerror = null;
      this._messageQueue = [];
      this._started = false;
      this._closed = false;
      this._paired = null; // Reference to paired port
    }
    
    postMessage(data) {
      if (this._closed) return;
      
      // If paired port exists and is started, deliver message
      if (this._paired && this._paired._started && this._paired.onmessage) {
        // Simulate async delivery with microtask
        Promise.resolve().then(() => {
          if (!this._paired._closed) {
            this._paired.onmessage({ data, ports: [] });
          }
        });
      } else if (this._paired) {
        // Queue message for later delivery
        this._paired._messageQueue.push({ data, ports: [] });
      }
    }
    
    start() {
      if (this._closed) return;
      this._started = true;
      
      // Deliver any queued messages
      while (this._messageQueue.length > 0 && this.onmessage) {
        const message = this._messageQueue.shift();
        Promise.resolve().then(() => {
          if (!this._closed && this.onmessage) {
            this.onmessage(message);
          }
        });
      }
    }
    
    close() {
      this._closed = true;
      this._messageQueue = [];
      this.onmessage = null;
      this.onmessageerror = null;
      if (this._paired) {
        this._paired._paired = null;
        this._paired = null;
      }
    }
  };
}

// MessageChannel polyfill - Creates paired MessagePorts
if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new global.MessagePort();
      this.port2 = new global.MessagePort();
      
      // Pair the ports so they can communicate
      this.port1._paired = this.port2;
      this.port2._paired = this.port1;
    }
  };
}
