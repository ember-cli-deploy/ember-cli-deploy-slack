var expect        = require('chai').expect;
var sinon         = require('sinon');
var Slack = require('node-slackr');
var SlackNotifier = require('../../lib/slack-notifier.js');
var Promise    = require('ember-cli/lib/ext/promise');

var WEBHOOK_URL = 'https://hooks.slack.com/services/123123';
var CHANNEL     = '#testing';
var USER_NAME   = 'ember-cli-deploy';

var slackNotify;

describe('SlackNotifier', function() {
  var slack;
  var sandbox;

  beforeEach(function() {
    slack = new SlackNotifier({
      enabled: true,
      webhookURL: WEBHOOK_URL,
      channel: CHANNEL,
      username: USER_NAME
    });

    sandbox = sinon.sandbox.create();
    slackNotify = sandbox.spy(Slack.prototype, 'notify');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('it can be initialized', function() {
    expect(slack).to.be.ok;
    expect(slack.enabled).to.eql(true);
    expect(slack.webhookURL).to.eql(WEBHOOK_URL);
    expect(slack.channel).to.eql(CHANNEL);
    expect(slack.username).to.eql(USER_NAME);
  });

  describe('#_getSlackOptions', function() {
    it("snake_cases and adds `iconURL` and/or `iconEmoji` options if they are set", function() {
      var iconEmojiOnly = new SlackNotifier({
        enabled: true,
        webhookURL: WEBHOOK_URL,
        channel: CHANNEL,
        username: USER_NAME,
        iconEmoji: ':dromedary_camel:'
      });
      var bothOptions = new SlackNotifier({
        enabled: true,
        webhookURL: WEBHOOK_URL,
        channel: CHANNEL,
        username: USER_NAME,
        iconEmoji: ':dromedary_camel:',
        iconURL: 'http://placehold.it/128x128'
      });

      expect(slack._getSlackOptions()).to.eql({
        channel: CHANNEL,
        username: USER_NAME
      });
      expect(iconEmojiOnly._getSlackOptions()).to.eql({
        channel: CHANNEL,
        username: USER_NAME,
        icon_emoji: ':dromedary_camel:'
      });
      expect(bothOptions._getSlackOptions()).to.eql({
        channel: CHANNEL,
        username: USER_NAME,
        icon_emoji: ':dromedary_camel:',
        icon_url: 'http://placehold.it/128x128'
      });
    });
  });

  describe('enabled', function() {
    describe('#notify', function() {
      it('is callable', function() {
        expect(typeof(slack.notify)).to.eql('function');
      });

      it('sends the correct params to the node-slackr library', function() {
        var messages = {
            text: "using node-slackr to send messages to slack"
        };

        slack.notify(messages);

        expect(slackNotify.calledWith(messages)).to.be.ok;
      });

      it('returns a promise', function() {
        var messages = {
            text: "I can haz promises instead of callbacks"
        };

        expect(slack.notify(messages).then).to.be.ok;
        expect(slack.notify(messages).catch).to.be.ok;
      });
    });
  });

  describe('disabled', function() {
    beforeEach(function() {
      slack = new SlackNotifier({
        enabled: false,
        webhookURL: WEBHOOK_URL,
        channel: CHANNEL,
        username: USER_NAME
      });
    });

    describe('#notify', function() {
      it('is callable', function() {
        expect(typeof(slack.notify)).to.eql('function');
      });

      it('returns a promise', function() {
        expect(slack.notify({}).then).to.be.ok;
        expect(slack.notify({}).catch).to.be.ok;
      });
    });
  });
})
