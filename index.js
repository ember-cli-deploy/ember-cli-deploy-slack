/* jshint node: true */
'use strict';

var Promise       = require('ember-cli/lib/Ext/promise');
var SilentError   = require('ember-cli/lib/errors/silent');
var SlackNotifier = require('./lib/slack-notifier');
var defaults      = require('./lib/default-config');
var chalk         = require('chalk');

var blue   = chalk.blue;
var yellow = chalk.yellow;

function applyDefaultConfigIfNecessary(config, prop, defaultConfig, ui){
  if (!config[prop]) {
    var value = defaultConfig[prop] || function() { return; };
    config[prop] = value;
    if (defaultConfig[prop]) {
      ui.write(blue('|    '));
      ui.writeLine(yellow('- Missing config: `' + prop + '`, using default: `' + value + '`'));
    }
  }
}

function initSlackNotifier(config, context) {
  var webhookURL = config.webhookURL;

  if (!webhookURL) {
    var message   = 'Ember-CLI-Deploy: You have to pass a `webhookURL` config-option to ember-cli-deploy-slack';
    context.slack = context.slack || {};

    context.slack.error = message;

    throw new SilentError(message);
  }

  var channel   = config.channel;
  var username  = config.username;

  return new SlackNotifier({
    webhookURL: webhookURL,
    channel: channel,
    username: username
  });
}

function executeSlackNotificationHook(context, hookName) {
    var deployment = context.deployment;
    var ui         = deployment.ui;
    var config     = deployment.config[this.name] = deployment.config[this.name] || {};
    var slack      = initSlackNotifier(config, context);

    applyDefaultConfigIfNecessary(config, hookName, defaults, ui);

    return config[hookName](context, slack);
}

module.exports = {
  name: 'ember-cli-deploy-slack',

  createDeployPlugin: function(options) {
    return {
      name: options.name,

      willDeploy: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'willDeploy');
      },

      willBuild: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'willBuild');
      },

      build: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'build');
      },

      didBuild: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'didBuild');
      },

      willUpload: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'willUpload');
      },

      upload: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'upload');
      },

      didUpload: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'didUpload');
      },

      willActivate: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'willActivate');
      },

      activate: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'activate');
      },

      didActivate: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'didActivate');
      },

      didDeploy: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'didDeploy');
      },

      didFail: function(context) {
        return executeSlackNotificationHook.bind(this)(context, 'didFail');
      }
    }
  }
};
