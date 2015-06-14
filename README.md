# Ember-cli-deploy-slack

An ember-cli-deploy-plugin for sending deployment messages to [Slack](https://slack.com/).

## Usage

This plugin will only work with the upcoming 0.5.0-release of
[ember-cli-deploy](https://github.com/ember-cli/ember-cli-deploy). Right now
you have to use my [didFail branch](levelbossmike/ember-cli-deploy#didFail-hook-).

To setup ember-cli-deploy-slack you need to add a `slack`-entry into your
`deploy.js` configuration file:

```js
module.exports = function(environment) {
  var environments = {
    "development": {
      // ...
      "slack": {
        "webhookURL": "https://hooks.slack.com/services/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",
        "channel": "#notifications",
        "username": "ember-cli-deploy"
      },
      // ...
    },

    "staging": {
      // ...
    },

    "production": {
      // ...
    }
  };

  return environments[environment];
};
```

## Customization

`ember-cli-deploy-slack` will send default messages on the `didDeploy`- and
`didFail`-hooks on the pipeline. Because every team is different and people
tend to customize their automatic slack notifications messages can be
customized.

To customize a message you simply add a function to your slack configuration
options that is named the same as the hook notification you want to customize:

```js
module.exports = function(environment) {
  var environments = {
    "development": {
      // ...
      "slack": {
        "webhookURL": "https://hooks.slack.com/services/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",
        "channel": "#notifications",
        "username": "ember-cli-deploy",
        "didDeploy": function(context, slack) {
          return slack.notify({
            text: 'w00t I can haz custumizations!'
          });
        }
      },
      // ...
    },
```


Notification hooks will be passed the deployment context and the slackNotifier
utility class. The SlackNotifier uses [node-slackr](https://github.com/chenka/node-slackr) under the hood so you can use its `notify`-function accordingly. This enables you to customize your messages in any way possible. You can even add custom properties to the deployment context if that's what you need to do.

Please see the [Slack API documentation for message formatting](https://api.slack.com/docs/formatting)
to see how you can customize your messages.

### Available hooks

`willDeploy`, `willBuild`, `build`, `didBuild`, `willActivate`, `activate`,
`didActivate`, `didDeploy`, `didFail`
