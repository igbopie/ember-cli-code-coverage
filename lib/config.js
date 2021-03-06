'use strict';

/**
 * @typedef {Object} Configuration
 * @property {String} coverageEnvVar - name of environment variable for coverage
 * @property {String} coverageFolder - directory in which to write coverage to
 * @property {Array<String>} excludes - list of glob paths to exclude
 * @property {Array<String>} reporters - list of reporters
 */

var extend = require('extend');
var fs = require('fs');
var path = require('path');

/**
 * Get configuration for a project, falling back to default configuration if
 * project does not provide a configuration of its own
 * @param {String} configPath - The path for the configuration of the project
 * @returns {Configuration} configuration to use for project
 */
function config(configPath, emberBuildConfig) {
  var configDirName = path.dirname(configPath);
  var configFile = path.resolve(path.join(configDirName, 'coverage.js'));
  var defaultConfig = getDefaultConfig();

  if (fs.existsSync(configFile)) {
    var projectConfig = require(configFile);
    return extend({}, defaultConfig, projectConfig, emberBuildConfig);
  }
  return extend({}, defaultConfig, emberBuildConfig);
}

/**
 * Get default configuration
 * @returns {Configuration} default configuration
 */
function getDefaultConfig() {
  return {
    coverageEnvVar: 'COVERAGE',
    coverageFolder: 'coverage',
    excludes: [
      '*/mirage/**/*'
    ],
    useBabelInstrumenter: false,
    // The reasoning behind this default is to match the default language version
    // supported by Ember CLI. As of Ember CLI 2.13, it supports ES2017.
    babelPlugins: [
      'babel-plugin-transform-async-to-generator'
    ],
    reporters: [
      'html',
      'lcov'
    ],
    includeTranspiledSources: []
  };
}

module.exports = config;
