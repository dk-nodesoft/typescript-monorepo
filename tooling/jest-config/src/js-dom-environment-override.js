const { TextEncoder, TextDecoder } = require('util');
const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

/**
 * The JSDomEnvironmentOverride class is used to fix shortcummings of the jest jsdom environmnet
 * Check the overrides provided in the constructor to see the overrides
 *
 * The exported class is then addressed in the jest configuration file under the testEnvironment property
 */
class JSDOMEnvironmentOverride extends JSDOMEnvironment {
  constructor(config, options) {
    super(config, options);

    this.global.Uint8Array = Uint8Array;
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;

    this.global.jsdom = this.dom;
  }
}

module.exports = JSDOMEnvironmentOverride;
