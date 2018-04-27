// polyfill web crypto API
const WebCrypto = require("node-webcrypto-ossl")
window.crypto = new WebCrypto()

// polyfill TextEncoder and TextDecoder
var TextEncodingShim = require('text-encoding-shim')
TextEncoder = TextEncodingShim.TextEncoder
TextDecoder = TextEncodingShim.TextDecoder
