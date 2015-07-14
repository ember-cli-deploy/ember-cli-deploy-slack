var Promise    = require('ember-cli/lib/ext/promise');
var CoreObject = require('core-object');
var Slack      = require ('node-slackr');

module.exports = CoreObject.extend({
  init: function(data) {
    this._super(data);

    this.slack = new Slack(this.webhookURL, {
      channel: this.channel,
      username: this.username
    });

    this.notify = function(message) {
      return new Promise(function(resolve, reject) {
        this.slack.notify(message, function(error, result) {
          if (error) { return reject(error); }

          return resolve(result);
        });
      }.bind(this));
    }
  }
});
