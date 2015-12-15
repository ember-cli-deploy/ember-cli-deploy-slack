'use strict';
var Promise = require('ember-cli/lib/ext/promise');
var assert = require('ember-cli/tests/helpers/assert');

var WEBHOOK_URL = 'https://hooks.slack.com/services/123123';
var CHANNEL     = '#testing';
var USER_NAME   = 'ember-cli-deploy';

describe('the index', function() {
  var subject, mockUi, sandbox;

  beforeEach(function() {
    subject = require('../../index');
    mockUi = {
      messages: [],
      write: function() { },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  it('has a name', function() {
    var result = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(result.name, 'test-plugin');
  });

  it('implements the correct hooks', function() {
    var plugin = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.typeOf(plugin.configure, 'function');
    assert.typeOf(plugin.willDeploy, 'function');
    assert.typeOf(plugin.willBuild, 'function');
    assert.typeOf(plugin.build, 'function');
    assert.typeOf(plugin.didBuild, 'function');
    assert.typeOf(plugin.willUpload, 'function');
    assert.typeOf(plugin.upload, 'function');
    assert.typeOf(plugin.didUpload, 'function');
    assert.typeOf(plugin.willActivate, 'function');
    assert.typeOf(plugin.activate, 'function');
    assert.typeOf(plugin.didActivate, 'function');
    assert.typeOf(plugin.didDeploy, 'function');
    assert.typeOf(plugin.didFail, 'function');
  });

  describe('configure hook', function() {
    it('resolves if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 'slack'
      });

      var context = {
        ui: mockUi,
        config: {
          slack: {
            webhookURL: 'http://foo/bar'
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      assert.ok(true); // it didn't throw
    });

    it('throws if require config is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'slack'
      });

      var context = {
        ui: mockUi,
        config: {
          slack: {
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      assert.throws(function(){
        plugin.didDeploy(context);
      })
    });

    it('warns about missing optional config', function() {
      var plugin = subject.createDeployPlugin({
        name: 'slack'
      });

      var context = {
        ui: mockUi,
        config: {
          slack: {
            webhookURL: 'http://foo/bar'
          }
        }
      };

      mockUi.verbose = true;

      plugin.beforeHook(context);
      plugin.configure(context);

      var messages = mockUi.messages.reduce(function(previous, current) {
        if (/- Missing config:\s.*, using default:\s/.test(current)) {
          previous.push(current);
        }

        return previous;
      }, []);
      assert.equal(messages.length, 4);
    });

    it('adds default config to the config object', function() {
      var plugin = subject.createDeployPlugin({
        name: 'slack'
      });

      var context = {
        ui: mockUi,
        config: {
          "slack": {
            webhookURL: 'http://foo/bar'
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);

      assert.isDefined(context.config['slack'].willDeploy);
      assert.isDefined(context.config['slack'].didDeploy);
      assert.isDefined(context.config['slack'].didFail);
    });
  });

  describe('didDeploy hook', function() {
    it('notifies slack', function() {
      var plugin = subject.createDeployPlugin({
        name: 'slack'
      });
      var slackMessages = [];

      var context = {
        slackStartDeployDate: new Date(),
        ui: mockUi,
        config: {
          "slack": {
            webhookURL: 'http://foo/bar',
            slackNotifier: {
              notify: function(message){
                slackMessages.push(message);
                return Promise.resolve();
              }
            }
          }
        }
      };
      plugin.beforeHook(context);
      plugin.configure(context);

      return assert.isFulfilled(plugin.didDeploy(context))
        .then(function(result) {
          assert.equal(slackMessages.length, 1);
        });
    });
  });
});

