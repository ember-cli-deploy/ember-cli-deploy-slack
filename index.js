/* jshint node: true */
'use strict';

var Promise       = require('ember-cli/lib/ext/promise');
var SilentError   = require('silent-error');
var SlackNotifier = require('./lib/slack-notifier');
var DeployPluginBase = require('ember-cli-deploy-plugin');

var moment = require('moment');
require('moment-duration-format');

module.exports = {
  name: 'ember-cli-deploy-slack',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        enabled: true,

        willDeploy: function(context) {
          return function(slack){
            return {
              slackStartDeployDate: new Date()
            };
          }
        },

        didDeploy: function(context) {
          return function(slack){
            var startDeployDate    = this.context.slackStartDeployDate;
            var endDeployDate      = new Date();
            var duration           = moment.duration(endDeployDate - startDeployDate);

            return slack.notify({
              attachments: [{
                "fallback":"Deployment finished! New revision was successfully uploaded.",
                "pretext":"Deployment finished! New revision was successfully uploaded.",
                "color":"good",
                "fields":[
                   {
                      "title":"Stats",
                      "value":"Deploying revision took "+duration.format('m [min], s [s], S [ms]')+'.',
                      "short":false
                   }
                 ]
              }]
            });
          };
        },

        didFail: function(context) {
          return function(slack) {
            var message = "Ember-cli-deploy tried to deploy a revision but failed.";

            return slack.notify({
              attachments: [{
               "fallback": "Deployment failed!",
               "pretext": "Deployment failed!",
               "color": "danger",
               "fields":[
                  {
                     "title": "Failure",
                     "value": message,
                     "short": false
                  }
               ]
              }]
            });
          };
        }
      },

      willDeploy: function(/* context */) {
        return this._executeSlackNotificationHook('willDeploy');
      },

      willBuild: function(/* context */) {
        return this._executeSlackNotificationHook('willBuild');
      },

      build: function(/* context */) {
        return this._executeSlackNotificationHook('build');
      },

      didBuild: function(/* context */) {
        return this._executeSlackNotificationHook('didBuild');
      },

      willUpload: function(/* context */) {
        return this._executeSlackNotificationHook('willUpload');
      },

      upload: function(/* context */) {
        return this._executeSlackNotificationHook('upload');
      },

      didUpload: function(/* context */) {
        return this._executeSlackNotificationHook('didUpload');
      },

      willActivate: function(/* context */) {
        return this._executeSlackNotificationHook('willActivate');
      },

      activate: function(/* context */) {
        return this._executeSlackNotificationHook('activate');
      },

      didActivate: function(/* context */) {
        return this._executeSlackNotificationHook('didActivate');
      },

      didDeploy: function(/* context */) {
        return this._executeSlackNotificationHook('didDeploy');
      },

      didFail: function(/* context */) {
        return this._executeSlackNotificationHook('didFail');
      },
      _executeSlackNotificationHook: function(hookName) {
        var slack      = this._initSlackNotifier();
        var slackHook = this.readConfig(hookName);
        if (slackHook) {
          return slackHook.call(this, slack);
        }
      },
      _initSlackNotifier: function() {
        var webhookURL = this.readConfig('webhookURL');
        var enabled  = !!this.readConfig('enabled');

        if (!webhookURL && enabled) {
          var message   = 'Ember-CLI-Deploy: You have to pass a `webhookURL` config-option to ember-cli-deploy-slack';
          throw new Error(message);
        }

        var channel   = this.readConfig('channel');
        var username  = this.readConfig('username');
        var iconURL  = this.readConfig('iconURL');
        var iconEmoji  = this.readConfig('iconEmoji');

        return this.readConfig('slackNotifier') || new SlackNotifier({
          enabled: enabled,
          webhookURL: webhookURL,
          channel: channel,
          username: username,
          iconURL: iconURL,
          iconEmoji: iconEmoji
        });
      }
    });
    return new DeployPlugin();
  }
};
