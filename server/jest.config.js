const { dirname } = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "coverage",
  coverageReporters: [["lcovonly", {"projectRoot": dirname(__dirname)}], ["text", {"skipFull": true}]],
  testSequencer: "./test/testSequencer.js",
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
};
