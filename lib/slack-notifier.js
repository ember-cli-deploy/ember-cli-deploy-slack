var Promise    = require('ember-cli/lib/ext/promise');
var CoreObject = require('core-object');
var Slack      = require ('node-slackr');

module.exports = CoreObject.extend({
  init: function(data) {
    this._super(data);

    this.slack = new Slack(this.webhookURL, this._getSlackOptions());

    this.notify = function(message) {
      return new Promise(function(resolve, reject) {
        if (this.enabled) {
          this.slack.notify(message, function(error, result) {
            if (error) { return reject(error); }

            return resolve(result);
          });
        } else {
          return resolve();
        }
      }.bind(this));
    }
  },

  _getSlackOptions: function () {
    var options = {
      channel: this.channel,
      username: this.username
    };
    if (this.iconURL) {
      options.icon_url = this.iconURL;
    }
    if (this.iconEmoji) {
      options.icon_emoji = this.iconEmoji;
    }
    return options;
  }
});
