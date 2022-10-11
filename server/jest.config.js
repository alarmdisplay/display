const { dirname } = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  coverageDirectory: "coverage",
  coverageReporters: [["lcovonly", {"projectRoot": dirname(__dirname)}], ["text", {"skipFull": true}]],
  testSequencer: "./test/testSequencer.js"
};
