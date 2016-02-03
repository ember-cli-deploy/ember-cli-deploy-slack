# Ember-cli-deploy-slack [![Build Status](https://travis-ci.org/ember-cli-deploy/ember-cli-deploy-slack.svg?branch=master)](https://travis-ci.org/ember-cli-deploy/ember-cli-deploy-slack)

> An ember-cli-deploy-plugin for sending deployment messages to [Slack](https://slack.com/).

[![](https://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/plugins/ember-cli-deploy-slack.svg)](http://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/)

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][2].

## Quick Start

To get up and running quickly, do the following:

- Install this plugin

```bash
$ ember install ember-cli-deploy-slack
```

- Create a [webhook](https://api.slack.com/incoming-webhooks) in Slack.

- Place the following configuration into `config/deploy.js`

```javascript
ENV.slack = {
  webhookURL: '<your-webhook-URI>'
}
```

- Run the pipeline

```bash
$ ember deploy
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][2].

- `configure`
- `willDeploy`
- `willBuild`
- `build`
- `didBuild`
- `willUpload`
- `upload`
- `didUpload`
- `willActivate`
- `activate`
- `didActivate`
- `didDeploy`
- `didFail`

## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][2].

###webhookURL

The [webhook](https://api.slack.com/incoming-webhooks) in Slack that the plugin will notify.

###channel

The channel in slack that the notification should be displayed in in Slack.

###username

The username that will send the message in Slack.

###iconURL

URL to an image to use as the message's icon.

###iconEmoji

Slack emoji code to use as the message's icon (like `:heart_eyes_cat:` or `:saxophone:`).

## Customization

`ember-cli-deploy-slack` will send default messages on the `didDeploy`- and
`didFail`-hooks on the pipeline. Because every team is different and people
tend to customize their automatic slack notifications messages can be
customized.

To customize a message you simply add a function to your slack configuration
options that is named the same as the hook notification you want to customize:

```js
ENV.slack = {
  webhookURL: '<your-webhook-URI>',
  channel: '#notifications',
  username: 'ember-cli-deploy',
  didDeploy: function(context) {
    return function(slack) {
      return slack.notify({
        text: 'w00t I can haz customizations!'
      });
    };
  }
}
```

Notification hooks will be passed the deployment context and the slackNotifier
utility class. The SlackNotifier uses [node-slackr](https://github.com/chenka/node-slackr) under the hood so you can use its `notify`-function accordingly. This enables you to customize your messages in any way possible.

Because of the way `ember-cli-deploy` merges return values of hooks back into the deployment context, you can easily add custom properties to the deployment context if that's what you need to do:

```javascript
ENV.slack = {
  webhookURL: '<your-webhook-URI>',
  willDeploy: function(context) {
    return function(slack) {
      return {
        slackStartDeployDate: new Date()
      };
    };
  },

  didDeploy: function(context) {
    return function(slack) {
      var start = context.slackStartDeployDate;
      var end = new Date();
      var duration = (end - start) / 1000;

      return slack.notify({
        text: 'Deploy took '+duration+' seconds'
      });
    };
  }
}
```

Please see the [Slack API documentation for message formatting](https://api.slack.com/docs/formatting)
to see how you can customize your messages.

## Running Tests

- `npm test`

[2]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
